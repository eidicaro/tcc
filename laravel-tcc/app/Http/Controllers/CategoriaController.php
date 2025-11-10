<?php

namespace App\Http\Controllers;

use App\Models\CategoriaModel;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    // Lista todas as categorias
    public function index()
    {
        return response()->json(CategoriaModel::all());
    }

    // Cria uma nova categoria
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100'
        ]);

        $categoria = CategoriaModel::create($validated);

        return response()->json([
            'message' => 'Categoria criada com sucesso!',
            'data' => $categoria
        ], 201);
    }

    // Atualiza uma categoria existente
    public function update(Request $request, $id)
    {
        $categoria = CategoriaModel::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:100'
        ]);

        $categoria->update($validated);

        return response()->json([
            'message' => 'Categoria atualizada com sucesso!',
            'data' => $categoria
        ]);
    }

    // Exclui uma categoria
    public function destroy($id)
    {
        $categoria = CategoriaModel::findOrFail($id);
        $categoria->delete();

        return response()->json(['message' => 'Categoria excluída com sucesso!']);
    }
}
