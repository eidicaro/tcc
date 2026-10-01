<?php

namespace App\Http\Controllers;

use App\Models\CategoriaModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CategoriaModel::query();

        if (! $request->is('api/admin/*')) {
            $query->where('ativo', true);
        }

        return response()->json($query
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get());
    }

    public function store(Request $request): JsonResponse
    {
        $category = CategoriaModel::create($request->validate($this->rules()));

        return response()->json([
            'success' => true,
            'message' => 'Categoria criada com sucesso.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = CategoriaModel::findOrFail($id);
        $category->update($request->validate($this->rules(true)));

        return response()->json([
            'success' => true,
            'message' => 'Categoria atualizada com sucesso.',
            'data' => $category->fresh(),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        return DB::transaction(function () use ($id): JsonResponse {
            $category = CategoriaModel::query()
                ->lockForUpdate()
                ->findOrFail($id);
            $linkedProducts = $category->produtos()->count();

            if ($linkedProducts > 0) {
                return response()->json([
                    'success' => false,
                    'code' => 'category_has_products',
                    'message' => 'Não é possível remover esta categoria enquanto houver produtos vinculados. Reatribua ou remova os produtos primeiro.',
                    'produtos_vinculados' => $linkedProducts,
                ], 409);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Categoria desativada com sucesso.',
            ]);
        });
    }

    private function rules(bool $updating = false): array
    {
        return [
            'nome' => [$updating ? 'sometimes' : 'required', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
            'ordem' => ['sometimes', 'integer', 'min:0', 'max:4294967295'],
        ];
    }
}
