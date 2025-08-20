<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrinho;

class CarrinhoController extends Controller
{
    public function adicionar(Request $request)
    {
        $produto = $request->input('produto'); // {id, nome, preco, quantidade}

        // pega carrinho atual da sessão (ou array vazio se não existir)
        $carrinho = session()->get('carrinho', []);

        // se produto já existe, só soma a quantidade
        if (isset($carrinho[$produto['id']])) {
            $carrinho[$produto['id']]['quantidade'] += $produto['quantidade'];
        } else {
            $carrinho[$produto['id']] = $produto;
        }

        // salva de volta na sessão
        session()->put('carrinho', $carrinho);

        return response()->json($carrinho);
    }

    public function remover(Request $request, $id)
    {
        $carrinho = session()->get('carrinho', []);
        unset($carrinho[$id]);
        session()->put('carrinho', $carrinho);

        return response()->json($carrinho);
    }

    public function listar()
    {
        return response()->json(session()->get('carrinho', []));
    }

    public function limpar()
    {
        session()->forget('carrinho');
        return response()->json([]);
    }
}
