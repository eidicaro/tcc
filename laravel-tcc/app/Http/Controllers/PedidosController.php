<?php

namespace App\Http\Controllers;

use App\Models\ClienteModel;
use App\Models\PedidoItemAdicional;
use App\Models\PedidoItemModel;
use App\Models\PedidosModel;
use App\Services\CartService;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PedidosController extends Controller
{
    private const PAYMENT_STATUSES = ['pendente', 'pago', 'cancelado'];

    public function __construct(private readonly CartService $cart) {}

    public function finalizar(Request $request): JsonResponse
    {
        $data = $request->validate([
            'pedido_token' => ['required', 'string', 'max:64', 'regex:/^[A-Za-z0-9._-]+$/'],
            'tipo_pedido' => ['required', Rule::in(['local', 'delivery'])],
            'endereco' => ['nullable', 'string', 'max:255', 'required_if:tipo_pedido,delivery'],
            'forma_pagamento' => ['required', 'string', Rule::in(config('store.payment_methods', []))],
            'troco' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'observacao' => ['nullable', 'string', 'max:500'],
            'cliente_id' => ['prohibited'],
            'cliente' => ['required', 'array:nome,telefone'],
            'cliente.nome' => ['required', 'string', 'min:2', 'max:100'],
            'cliente.telefone' => ['required', 'string', 'max:20'],
        ]);

        $customerName = preg_replace('/\s+/u', ' ', trim($data['cliente']['nome']))
            ?? trim($data['cliente']['nome']);
        $rawPhone = trim($data['cliente']['telefone']);
        $normalizedPhone = $this->normalizePhone($rawPhone);

        if (strlen($normalizedPhone) < 10 || strlen($normalizedPhone) > 15) {
            throw ValidationException::withMessages([
                'cliente.telefone' => ['Informe um telefone válido com DDD.'],
            ]);
        }

        $existing = PedidosModel::where('token', $data['pedido_token'])->first();

        if ($existing) {
            $this->cart->clear();

            return $this->checkoutResponse($existing, 200);
        }

        $sessionItems = $this->cart->all();

        if ($sessionItems === []) {
            throw ValidationException::withMessages([
                'carrinho' => ['O carrinho está vazio.'],
            ]);
        }

        $items = $this->cart->canonicalize($sessionItems);
        $subtotalCents = $this->cart->subtotalInCents($items);
        $minimumCents = max(0, $this->cart->moneyToCents(config('store.delivery.minimum_order', 0)));

        if ($subtotalCents < $minimumCents) {
            throw ValidationException::withMessages([
                'carrinho' => [sprintf(
                    'O pedido mínimo é de %s.',
                    $this->moneyForMessage($minimumCents)
                )],
            ]);
        }

        if ($data['tipo_pedido'] === 'delivery' && ! config('store.delivery.enabled', true)) {
            throw ValidationException::withMessages([
                'tipo_pedido' => ['A entrega está indisponível no momento.'],
            ]);
        }

        if ($data['tipo_pedido'] === 'local' && ! config('store.pickup.enabled', true)) {
            throw ValidationException::withMessages([
                'tipo_pedido' => ['Pedidos locais estão indisponíveis no momento.'],
            ]);
        }

        $deliveryFeeCents = $data['tipo_pedido'] === 'delivery'
            ? max(0, $this->cart->moneyToCents(config('store.delivery.fee', 0)))
            : 0;
        $totalCents = $subtotalCents + $deliveryFeeCents;
        $isCash = $this->isCashPayment($data['forma_pagamento']);
        $changeCents = isset($data['troco'])
            ? $this->cart->moneyToCents($data['troco'])
            : null;

        if (! $isCash && $changeCents !== null) {
            throw ValidationException::withMessages([
                'troco' => ['Troco só pode ser informado para pagamento em dinheiro.'],
            ]);
        }

        if ($isCash && $changeCents !== null && $changeCents < $totalCents) {
            throw ValidationException::withMessages([
                'troco' => ['O valor para troco não pode ser menor que o total do pedido.'],
            ]);
        }

        try {
            $order = DB::transaction(function () use (
                $data,
                $items,
                $subtotalCents,
                $deliveryFeeCents,
                $totalCents,
                $changeCents,
                $customerName,
                $normalizedPhone,
                $rawPhone
            ): PedidosModel {
                $existingOrder = PedidosModel::where('token', $data['pedido_token'])
                    ->lockForUpdate()
                    ->first();

                if ($existingOrder) {
                    return $existingOrder;
                }

                $customer = $this->resolveCustomer(
                    $customerName,
                    $normalizedPhone,
                    $rawPhone
                );

                $order = PedidosModel::create([
                    'cliente_id' => $customer->getKey(),
                    'endereco' => $data['tipo_pedido'] === 'delivery' ? trim($data['endereco']) : null,
                    'forma_pagamento' => $data['forma_pagamento'],
                    'troco' => $changeCents === null ? null : $this->cart->centsToMoney($changeCents),
                    'observacao' => $data['observacao'] ?? null,
                    'subtotal' => $this->cart->centsToMoney($subtotalCents),
                    'taxa_entrega' => $this->cart->centsToMoney($deliveryFeeCents),
                    'total' => $this->cart->centsToMoney($totalCents),
                    'status_pagamento' => 'pendente',
                    'status_pedido' => 'novo',
                    'tipo_pedido' => $data['tipo_pedido'],
                    'token' => $data['pedido_token'],
                ]);

                foreach ($items as $item) {
                    $orderItem = PedidoItemModel::create([
                        'id_pedido' => $order->id_pedido,
                        'id_produto' => $item['produto_id'],
                        'quantidade' => $item['quantidade'],
                        'preco_unitario' => $item['preco'],
                    ]);

                    foreach ($item['adicionais'] as $additional) {
                        PedidoItemAdicional::create([
                            'id_pedido_item' => $orderItem->id,
                            'id_adicional' => $additional['adicional_id'],
                            'quantidade' => $additional['quantidade'],
                            'preco_unitario' => $additional['preco'],
                        ]);
                    }
                }

                return $order;
            }, 3);
        } catch (QueryException $exception) {
            // Uma requisição concorrente com o mesmo token pode vencer a
            // restrição UNIQUE. Nesse caso, devolvemos o pedido já criado.
            $order = PedidosModel::where('token', $data['pedido_token'])->first();

            if (! $order) {
                throw $exception;
            }
        }

        $this->cart->clear();

        return $this->checkoutResponse($order, $order->wasRecentlyCreated ? 201 : 200);
    }

    public function listarPedidos(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status_pedido' => ['sometimes', Rule::in(config('store.order_statuses', []))],
            'status_pagamento' => ['sometimes', Rule::in(self::PAYMENT_STATUSES)],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:200'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $perPage = (int) ($filters['per_page'] ?? $filters['limit'] ?? 50);
        $orders = PedidosModel::query()
            ->with([
                'cliente:id,nome,telefone',
                'itens.produto',
                'itens.adicionais.adicional',
            ])
            ->when(
                isset($filters['status_pedido']),
                fn ($query) => $query->where('status_pedido', $filters['status_pedido'])
            )
            ->when(
                isset($filters['status_pagamento']),
                fn ($query) => $query->where('status_pagamento', $filters['status_pagamento'])
            )
            ->latest('id_pedido')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'pedidos' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'has_more' => $orders->hasMorePages(),
            ],
        ]);
    }

    public function mostrarPedido(int $id): JsonResponse
    {
        $order = PedidosModel::with([
            'cliente:id,nome,telefone',
            'itens.produto',
            'itens.adicionais.adicional',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'pedido' => $order,
        ]);
    }

    public function atualizarPedido(Request $request, int $id): JsonResponse
    {
        $order = PedidosModel::findOrFail($id);
        $data = $request->validate([
            'endereco' => ['sometimes', 'nullable', 'string', 'max:255'],
            'forma_pagamento' => ['sometimes', 'string', Rule::in(config('store.payment_methods', []))],
            'troco' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'observacao' => ['sometimes', 'nullable', 'string', 'max:500'],
            'status_pagamento' => ['sometimes', Rule::in(self::PAYMENT_STATUSES)],
            'status_pedido' => ['sometimes', Rule::in(config('store.order_statuses', []))],
            'tipo_pedido' => ['sometimes', Rule::in(['local', 'delivery'])],
        ]);

        $type = $data['tipo_pedido'] ?? $order->tipo_pedido;
        $address = array_key_exists('endereco', $data) ? $data['endereco'] : $order->endereco;

        if ($type === 'delivery' && blank($address)) {
            throw ValidationException::withMessages([
                'endereco' => ['O endereço é obrigatório para entrega.'],
            ]);
        }

        if ($type === 'local') {
            $data['endereco'] = null;
        }

        $paymentMethod = $data['forma_pagamento'] ?? $order->forma_pagamento;

        if (! $this->isCashPayment($paymentMethod)) {
            $data['troco'] = null;
        } elseif (isset($data['troco']) && $this->cart->moneyToCents($data['troco']) < $this->cart->moneyToCents($order->total)) {
            throw ValidationException::withMessages([
                'troco' => ['O valor para troco não pode ser menor que o total do pedido.'],
            ]);
        }

        $order->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Pedido atualizado com sucesso.',
            'pedido' => $order->fresh(),
        ]);
    }

    public function atualizarStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status_pagamento' => ['sometimes', Rule::in(self::PAYMENT_STATUSES)],
            'status_pedido' => ['sometimes', Rule::in(config('store.order_statuses', []))],
        ]);

        if ($data === []) {
            throw ValidationException::withMessages([
                'status' => ['Informe status_pagamento ou status_pedido.'],
            ]);
        }

        $order = PedidosModel::findOrFail($id);
        $order->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Status atualizado com sucesso.',
            'pedido' => $order->fresh(),
        ]);
    }

    public function excluirPedido(int $id): JsonResponse
    {
        $order = PedidosModel::findOrFail($id);
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pedido excluído com sucesso.',
        ]);
    }

    private function checkoutResponse(PedidosModel $order, int $status): JsonResponse
    {
        return response()->json([
            'pedido_id' => $order->id_pedido,
            'total' => $order->total,
            'carrinho' => [],
        ], $status);
    }

    private function normalizePhone(string $phone): string
    {
        return preg_replace('/\D+/', '', $phone) ?? '';
    }

    private function resolveCustomer(
        string $name,
        string $normalizedPhone,
        string $rawPhone
    ): ClienteModel {
        $customer = ClienteModel::query()
            ->where('telefone', $normalizedPhone)
            ->lockForUpdate()
            ->first();

        if (! $customer && $rawPhone !== $normalizedPhone) {
            $customer = ClienteModel::query()
                ->where('telefone', $rawPhone)
                ->lockForUpdate()
                ->first();
        }

        if ($customer) {
            return $customer;
        }

        return ClienteModel::query()->createOrFirst(
            ['telefone' => $normalizedPhone],
            ['nome' => $name]
        );
    }

    private function isCashPayment(string $paymentMethod): bool
    {
        return Str::contains(Str::lower($paymentMethod), 'dinheiro');
    }

    private function moneyForMessage(int $cents): string
    {
        $amount = $this->cart->centsToMoney($cents);
        $currency = strtoupper(trim((string) config('store.currency', '')));

        return preg_match('/^[A-Z]{3}$/', $currency) === 1
            ? "$currency $amount"
            : $amount;
    }
}
