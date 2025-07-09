<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProdutoModel; 


class ProdutosController extends Controller
{
    public function index()
        {
            return response()->json(ProdutoModel::all());
        }
    // ProdutoController.php
    public function getAdicionais($id)
    {
        $produto = ProdutoModel::with('adicionais')->findOrFail($id);
        return response()->json($produto->adicionais);
    }


        public function atualizarAdicionais(Request $request, $id)
    {
        $produto = ProdutoModel::findOrFail($id);

        // IDs dos adicionais selecionados vindo do React
        $adicionaisIds = $request->input('adicionais'); // Ex: [1, 3, 5]

        // Sincroniza os adicionais com o produto
        $produto->adicionais()->sync($adicionaisIds);

        return response()->json(['message' => 'Adicionais atualizados com sucesso']);
    }

}
