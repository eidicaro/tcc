<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrinho;

class CarrinhoController extends Controller
{
    public function adicionar(Request $request)
    {
        $produto = $request->input('produto'); // recebe {id, nome, preco, quantidade, adicionais, uid}

        // pega carrinho atual da sessão
        $carrinho = session()->get('carrinho', []);

        // usa UID para chave, evitando sobrescrever produtos iguais
        $carrinho[$produto['uid']] = $produto;

        session()->put('carrinho', $carrinho);

        return response()->json($carrinho);
    }

    public function remover(Request $request, $uid)
    {
        $carrinho = session()->get('carrinho', []);
        unset($carrinho[$uid]);
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

    // a função finalizar permanece igual, só use os itens da sessão ou enviados pelo front
}
