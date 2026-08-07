<?php

namespace App\Http\Controllers;

use App\Models\ProdutoModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProdutosController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->is('api/admin/*');

        $query = ProdutoModel::query()
            ->with([
                'categoria',
                'adicionais' => fn ($relation) => $relation
                    ->when(! $isAdmin, fn ($items) => $items->where('adicional.ativo', true))
                    ->orderBy('adicional.ordem')
                    ->orderBy('adicional.nome'),
            ]);

        if (! $isAdmin) {
            $query
                ->where('ativo', true)
                ->where(function ($categories) {
                    $categories
                        ->whereNull('id_categoria')
                        ->orWhereHas('categoria', fn ($category) => $category->where('ativo', true));
                });
        }

        if ($request->filled('categoria_id')) {
            $request->validate(['categoria_id' => ['integer', 'min:1']]);
            $query->where('id_categoria', $request->integer('categoria_id'));
        }

        if ($request->has('destaque')) {
            $request->validate(['destaque' => ['boolean']]);
            $query->where('destaque', $request->boolean('destaque'));
        }

        return response()->json($query
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get());
    }

    public function store(Request $request): JsonResponse
    {
        $this->normalizeAdditionalsInput($request);
        $data = $request->validate($this->rules());
        $image = $data['imagem'] ?? null;
        $hasAdditionalConfiguration = array_key_exists('adicionais', $data);
        $additionalIds = $data['adicionais'] ?? [];
        unset($data['imagem'], $data['adicionais']);
        $data['adicionais_configurados'] = $hasAdditionalConfiguration;

        $storedPath = null;

        try {
            if ($image) {
                $storedPath = $image->store('images', 'public');
                $data['imagem'] = $storedPath;
            }

            $product = DB::transaction(function () use ($data, $additionalIds): ProdutoModel {
                $product = ProdutoModel::create($data);
                $product->adicionais()->sync($additionalIds);

                return $product;
            });
        } catch (Throwable $exception) {
            if ($storedPath) {
                Storage::disk('public')->delete($storedPath);
            }

            throw $exception;
        }

        return response()->json($product->load(['categoria', 'adicionais']), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = ProdutoModel::findOrFail($id);
        $this->normalizeAdditionalsInput($request);
        $data = $request->validate($this->rules(true));
        $image = $data['imagem'] ?? null;
        $shouldSyncAdditionals = array_key_exists('adicionais', $data);
        $additionalIds = $data['adicionais'] ?? [];
        unset($data['imagem'], $data['adicionais']);

        if ($shouldSyncAdditionals) {
            $data['adicionais_configurados'] = true;
        }

        $oldPath = $product->imagem;
        $newPath = null;

        try {
            if ($image) {
                $newPath = $image->store('images', 'public');
                $data['imagem'] = $newPath;
            }

            DB::transaction(function () use (
                $additionalIds,
                $data,
                $product,
                $shouldSyncAdditionals
            ): void {
                $product->update($data);

                // Compatibilidade com clientes antigos: omitir `adicionais`
                // preserva os vínculos e o modo legado; enviar o campo marca
                // a configuração como explícita, mesmo quando o array é [].
                if ($shouldSyncAdditionals) {
                    $product->adicionais()->sync($additionalIds);
                }
            });
        } catch (Throwable $exception) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            throw $exception;
        }

        if ($newPath && $oldPath && $oldPath !== $newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json($product->fresh()->load(['categoria', 'adicionais']));
    }

    public function destroy(int $id): JsonResponse
    {
        $product = ProdutoModel::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produto desativado com sucesso.',
        ]);
    }

    public function getByIds(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'string', 'max:500'],
        ]);

        $ids = collect(explode(',', $data['ids']))
            ->map(static fn (string $id): int => (int) trim($id))
            ->filter(static fn (int $id): bool => $id > 0)
            ->unique()
            ->take(50)
            ->values();

        if ($ids->isEmpty()) {
            throw ValidationException::withMessages([
                'ids' => ['Informe ao menos um ID de produto válido.'],
            ]);
        }

        $products = ProdutoModel::query()
            ->where('ativo', true)
            ->whereIn('id_produto', $ids)
            ->where(function ($categories) {
                $categories
                    ->whereNull('id_categoria')
                    ->orWhereHas('categoria', fn ($category) => $category->where('ativo', true));
            })
            ->with([
                'categoria',
                'adicionais' => fn ($items) => $items
                    ->where('adicional.ativo', true)
                    ->orderBy('adicional.ordem'),
            ])
            ->get()
            ->keyBy('id_produto');

        return response()->json($ids
            ->map(fn (int $id) => $products->get($id))
            ->filter()
            ->values());
    }

    private function rules(bool $updating = false): array
    {
        $presence = $updating ? 'sometimes' : 'required';

        return [
            'nome' => [$presence, 'string', 'max:100'],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'preco' => [$presence, 'numeric', 'min:0', 'max:99999999.99'],
            'id_categoria' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('categoria', 'id_categoria')
                    ->where(fn ($query) => $query->whereNull('deleted_at')),
            ],
            'imagem' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'ativo' => ['sometimes', 'boolean'],
            'destaque' => ['sometimes', 'boolean'],
            'ordem' => ['sometimes', 'integer', 'min:0', 'max:4294967295'],
            'adicionais' => ['sometimes', 'array', 'max:100'],
            'adicionais.*' => [
                'integer',
                'distinct',
                Rule::exists('adicional', 'id_adicional')
                    ->where(fn ($query) => $query
                        ->where('ativo', true)
                        ->whereNull('deleted_at')),
            ],
        ];
    }

    private function normalizeAdditionalsInput(Request $request): void
    {
        if (! $request->exists('adicionais')) {
            return;
        }

        $additionals = $request->input('adicionais');

        // FormData não representa um array vazio diretamente. Aceitamos o
        // array como JSON (inclusive "[]") para manter uploads multipart.
        if (is_string($additionals)) {
            $decoded = json_decode($additionals, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $request->merge(['adicionais' => $decoded]);
            }
        }
    }
}
