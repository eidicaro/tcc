<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarrinhoProduto;

class CarrinhoProdutoController extends Controller
{
    // Adiciona produto no banco
    public function adicionar(Request $request)
    {
        $produto = $request->input('produto');

        if (!isset($produto['uid'])) {
            $produto['uid'] = uniqid();
        }

        $carrinhoProduto = CarrinhoProduto::updateOrCreate(
            ['uid' => $produto['uid']],
            [
                'produto_id' => $produto['id_produto'],
                'nome' => $produto['nome'],
                'preco' => $produto['preco'],
                'quantidade' => $produto['quantidade'] ?? 1,
                'adicionais' => $produto['adicionais'] ?? [],
            ]
        );

        return response()->json([
            'message' => 'Produto adicionado no banco',
            'produto' => $carrinhoProduto
        ]);
    }

    // Lista produtos do carrinho
    public function listar()
    {
        $produtos = CarrinhoProduto::all();
        return response()->json(['carrinho' => $produtos]);
    }

    // Remove produto
    public function remover($uid)
    {
        CarrinhoProduto::where('uid', $uid)->delete();
        return response()->json(['message' => 'Produto removido']);
    }

    // Limpa carrinho
    public function limpar()
    {
        CarrinhoProduto::truncate();
        return response()->json(['message' => 'Carrinho limpo']);
    }
}
