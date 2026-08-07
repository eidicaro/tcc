<?php

namespace App\Services;

use App\Models\AdicionalModel;
use App\Models\ProdutoModel;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CartService
{
    public const SESSION_KEY = 'carrinho';

    public function all(): array
    {
        $items = Session::get(self::SESSION_KEY, []);

        return is_array($items) ? array_values($items) : [];
    }

    public function add(int $productId, int $quantity, array $additionals = []): array
    {
        $items = $this->all();
        $items[] = $this->canonicalItem(
            $productId,
            $quantity,
            $additionals,
            (string) Str::uuid()
        );

        return $this->replace($items);
    }

    public function updateQuantity(string $uid, int $quantity): array
    {
        $items = $this->all();
        $index = $this->findIndex($items, $uid);

        if ($index === null) {
            throw ValidationException::withMessages([
                'uid' => ['Item não encontrado no carrinho.'],
            ]);
        }

        $item = $items[$index];
        $items[$index] = $this->canonicalItem(
            (int) ($item['produto_id'] ?? $item['id_produto'] ?? 0),
            $quantity,
            $this->normalizeAdditionals($item['adicionais'] ?? []),
            $uid
        );

        return $this->replace($items);
    }

    public function remove(string $uid): array
    {
        $items = $this->all();
        $index = $this->findIndex($items, $uid);

        if ($index === null) {
            throw ValidationException::withMessages([
                'uid' => ['Item não encontrado no carrinho.'],
            ]);
        }

        unset($items[$index]);

        return $this->replace($items);
    }

    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }

    public function canonicalize(array $items): array
    {
        $canonical = [];

        foreach ($items as $index => $item) {
            if (! is_array($item)) {
                throw ValidationException::withMessages([
                    "carrinho.$index" => ['Item inválido no carrinho.'],
                ]);
            }

            $productId = (int) ($item['produto_id'] ?? $item['id_produto'] ?? 0);
            $quantity = (int) ($item['quantidade'] ?? 0);

            if ($productId < 1 || $quantity < 1) {
                throw ValidationException::withMessages([
                    "carrinho.$index" => ['Produto ou quantidade inválidos no carrinho.'],
                ]);
            }

            $canonical[] = $this->canonicalItem(
                $productId,
                $quantity,
                $this->normalizeAdditionals($item['adicionais'] ?? []),
                (string) ($item['uid'] ?? Str::uuid())
            );
        }

        return $canonical;
    }

    public function subtotalInCents(array $items): int
    {
        return array_reduce(
            $items,
            fn (int $total, array $item): int => $total + $this->moneyToCents($item['subtotal'] ?? 0),
            0
        );
    }

    public function moneyToCents(mixed $value): int
    {
        return (int) round(((float) $value) * 100);
    }

    public function centsToMoney(int $value): string
    {
        return number_format($value / 100, 2, '.', '');
    }

    private function canonicalItem(
        int $productId,
        int $quantity,
        array $additionals,
        string $uid
    ): array {
        $product = ProdutoModel::query()
            ->where('ativo', true)
            ->find($productId);

        if (! $product) {
            throw ValidationException::withMessages([
                'produto_id' => ['Produto indisponível ou inexistente.'],
            ]);
        }

        $additionalItems = $this->loadAdditionals($product, $additionals);
        $unitCents = $this->moneyToCents($product->preco);

        foreach ($additionalItems as $additional) {
            $unitCents += $this->moneyToCents($additional['preco']) * $additional['quantidade'];
        }

        return [
            'uid' => $uid,
            'produto_id' => $product->id_produto,
            'id_produto' => $product->id_produto,
            'nome' => $product->nome,
            'preco' => $product->preco,
            'imagem' => $product->imagem,
            'imagem_url' => $product->imagem_url,
            'quantidade' => $quantity,
            'adicionais' => $additionalItems,
            'subtotal' => $this->centsToMoney($unitCents * $quantity),
        ];
    }

    private function loadAdditionals(ProdutoModel $product, array $requested): array
    {
        if ($requested === []) {
            return [];
        }

        $ids = array_values(array_unique(array_map(
            static fn (array $item): int => (int) $item['adicional_id'],
            $requested
        )));

        $models = AdicionalModel::query()
            ->where('ativo', true)
            ->whereIn('id_adicional', $ids)
            ->get()
            ->keyBy('id_adicional');

        if ($models->count() !== count($ids)) {
            throw ValidationException::withMessages([
                'adicionais' => ['Um ou mais adicionais estão indisponíveis ou não existem.'],
            ]);
        }

        // Somente produtos ainda no modo legado podem usar qualquer adicional
        // ativo. Uma configuração explícita respeita estritamente a pivô; se
        // ela estiver vazia, nenhum adicional é permitido para o produto.
        if ($product->adicionais_configurados) {
            $configuredIds = $product->adicionais()
                ->pluck('adicional.id_adicional')
                ->map(static fn ($id): int => (int) $id)
                ->all();

            if (array_diff($ids, $configuredIds) !== []) {
                throw ValidationException::withMessages([
                    'adicionais' => ['Há adicionais que não pertencem a este produto.'],
                ]);
            }
        }

        $result = [];

        foreach ($requested as $selection) {
            /** @var AdicionalModel $model */
            $model = $models->get((int) $selection['adicional_id']);
            $result[] = [
                'adicional_id' => $model->id_adicional,
                'id_adicional' => $model->id_adicional,
                'nome' => $model->nome,
                'preco' => $model->preco,
                'imagem' => $model->imagem,
                'imagem_url' => $model->imagem_url,
                'quantidade' => (int) $selection['quantidade'],
            ];
        }

        return $result;
    }

    private function normalizeAdditionals(mixed $additionals): array
    {
        if (! is_array($additionals)) {
            return [];
        }

        $normalized = [];

        foreach ($additionals as $item) {
            if (! is_array($item)) {
                continue;
            }

            $id = (int) ($item['adicional_id'] ?? $item['id_adicional'] ?? 0);
            $quantity = (int) ($item['quantidade'] ?? 1);

            if ($id > 0 && $quantity > 0) {
                $normalized[] = [
                    'adicional_id' => $id,
                    'quantidade' => $quantity,
                ];
            }
        }

        return $normalized;
    }

    private function replace(array $items): array
    {
        $items = array_values($items);
        Session::put(self::SESSION_KEY, $items);

        return $items;
    }

    private function findIndex(array $items, string $uid): ?int
    {
        foreach ($items as $index => $item) {
            if (is_array($item) && (string) ($item['uid'] ?? '') === $uid) {
                return $index;
            }
        }

        return null;
    }
}
