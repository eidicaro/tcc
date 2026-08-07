<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarrinhoController extends Controller
{
    public function __construct(private readonly CartService $cart) {}

    public function listar(): JsonResponse
    {
        return response()->json([
            'carrinho' => $this->cart->all(),
        ]);
    }

    public function adicionar(Request $request): JsonResponse
    {
        $payload = $this->normalizePayload($request);

        $data = Validator::make($payload, [
            'produto_id' => ['required', 'integer', 'min:1'],
            'quantidade' => ['sometimes', 'integer', 'min:1', 'max:99'],
            'adicionais' => ['sometimes', 'array', 'max:30'],
            'adicionais.*.adicional_id' => ['required', 'integer', 'min:1', 'distinct'],
            'adicionais.*.quantidade' => ['sometimes', 'integer', 'min:1', 'max:99'],
        ])->validate();

        $carrinho = $this->cart->add(
            (int) $data['produto_id'],
            (int) ($data['quantidade'] ?? 1),
            $data['adicionais'] ?? []
        );

        return response()->json([
            'message' => 'Produto adicionado ao carrinho.',
            'carrinho' => $carrinho,
        ], 201);
    }

    public function atualizar(Request $request, string $uid): JsonResponse
    {
        $data = $request->validate([
            'quantidade' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        return response()->json([
            'message' => 'Quantidade atualizada.',
            'carrinho' => $this->cart->updateQuantity($uid, (int) $data['quantidade']),
        ]);
    }

    public function remover(string $uid): JsonResponse
    {
        return response()->json([
            'message' => 'Produto removido do carrinho.',
            'carrinho' => $this->cart->remove($uid),
        ]);
    }

    public function limpar(): JsonResponse
    {
        $this->cart->clear();

        return response()->json([
            'message' => 'Carrinho limpo.',
            'carrinho' => [],
        ]);
    }

    private function normalizePayload(Request $request): array
    {
        // Mantém a leitura do envelope legado, mas descarta nomes e preços
        // enviados pelo navegador. O contrato canônico usa o objeto raiz.
        $payload = $request->input('produto');
        $payload = is_array($payload) ? $payload : $request->all();

        if (! isset($payload['produto_id']) && isset($payload['id_produto'])) {
            $payload['produto_id'] = $payload['id_produto'];
        }

        if (isset($payload['adicionais']) && is_array($payload['adicionais'])) {
            $payload['adicionais'] = array_map(static function ($item) {
                if (! is_array($item)) {
                    return $item;
                }

                if (! isset($item['adicional_id']) && isset($item['id_adicional'])) {
                    $item['adicional_id'] = $item['id_adicional'];
                }

                return $item;
            }, $payload['adicionais']);
        }

        return $payload;
    }
}
