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
        return Produto::paginate(20);
    }


    // rota para o carrossel
    public function getByIds(Request $request)
    {
        $ids = explode(',', $request->query('ids'));

        $produtos = ProdutoModel::whereIn('id_produto', $ids)->get()->map(function($p) {
            $p->imagem_url = asset('storage/' . $p->imagem); // monta caminho completo
            return $p;
        });

        return response()->json($produtos);
    }


    // atualiza os adicionais
    // public function atualizarAdicionais(Request $request, $id)
    // {
    //     $produto = ProdutoModel::findOrFail($id);

    //     // IDs dos adicionais selecionados vindo do React
    //     $adicionaisIds = $request->input('adicionais');

    //     // Sincroniza os adicionais com o produto
    //     $produto->adicionais()->sync($adicionaisIds);

    //     return response()->json(['message' => 'Adicionais atualizados com sucesso']);
    // }

    






}
