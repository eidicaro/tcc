<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProdutoModel; 
use App\Models\AdicionalModel;


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

        // FUNÇÃO PARA REGISTRAR ADICIONAIS 


        public function testarAdicionais()
        {
            // Busca os 25 primeiros adicionais
            $adicionaisIds = AdicionalModel::limit(25)->pluck('id_adicional')->toArray();

            // Busca todos os produtos
            $produtos = ProdutoModel::all();

            // Para cada produto, sincroniza os adicionais
            foreach ($produtos as $produto) {
                $produto->adicionais()->sync($adicionaisIds);
            }

            return response()->json(['message' => 'Adicionais vinculados a todos os produtos com sucesso']);
        }



}
