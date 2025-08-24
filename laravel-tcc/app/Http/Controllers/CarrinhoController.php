<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CarrinhoController extends Controller
{
    // Lista carrinho atual
    public function listar(Request $request)
    {
        $carrinho = session()->get('carrinho', []);
        return response()->json(['carrinho' => $carrinho]);
    }

    // Adiciona produto ao carrinho
    public function adicionar(Request $request)
    {
        $produto = $request->input('produto');
        $carrinho = session()->get('carrinho', []);

        // Gera UID se não existir
        if (!isset($produto['uid'])) {
            $produto['uid'] = uniqid();
        }

        // Verifica se já existe no carrinho
        $index = array_search($produto['uid'], array_column($carrinho, 'uid'));
        if ($index !== false) {
            $carrinho[$index]['quantidade'] += $produto['quantidade'] ?? 1;
        } else {
            $produto['quantidade'] = $produto['quantidade'] ?? 1;
            $carrinho[] = $produto;
        }

        session()->put('carrinho', $carrinho);

        return response()->json([
            'message' => 'Produto adicionado',
            'carrinho' => $carrinho
        ]);
    }

    // Remove um produto pelo UID
    public function remover(Request $request, $uid)
    {
        $carrinho = session()->get('carrinho', []);
        $carrinho = array_filter($carrinho, fn($item) => $item['uid'] !== $uid);
        session()->put('carrinho', $carrinho);
        return response()->json(['carrinho' => array_values($carrinho)]);
    }

    // Limpa todo o carrinho
    public function limpar()
    {
        session()->forget('carrinho');
        return response()->json(['carrinho' => []]);
    }
}
