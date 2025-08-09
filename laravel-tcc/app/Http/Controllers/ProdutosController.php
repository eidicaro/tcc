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

    // conecta e põe os adicionais para cada produto
    public function getAdicionais($id)
    {
        $produto = ProdutoModel::with('adicionais')->findOrFail($id);
        return response()->json($produto->adicionais);
    }

    // atualiza os adicionais
    public function atualizarAdicionais(Request $request, $id)
    {
        $produto = ProdutoModel::findOrFail($id);

        // IDs dos adicionais selecionados vindo do React
        $adicionaisIds = $request->input('adicionais');

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
