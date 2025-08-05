<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarrinhoProdAdd;
use App\Models\Carrinho;


class CarrinhoController extends Controller
{
    public function adicionarAdicional(Request $request)
    {
        $validated = $request->validate([
            'id_carrinho' => 'required|integer|exists:carrinho,id_carrinho',
            'id_produto' => 'required|integer|exists:produto,id_produto',
            'id_adicional' => 'required|integer|exists:adicional,id_adicional',
            'quantidade' => 'required|integer|min:1',
        ]);

        $adicional = CarrinhoProdAdd::create($validated);

        return response()->json([
            'message' => 'Adicional adicionado com sucesso ao produto no carrinho!',
            'data' => $adicional
        ], 201);
    }

    public function criarCarrinho(Request $request)
    {
        $validated = $request->validate([
            'id_cliente' => 'required|exists:cliente,id_cliente',
        ]);

        $carrinho = Carrinho::create([
            'id_cliente' => $validated['id_cliente'],
        ]);

        return response()->json([
            'message' => 'Carrinho criado com sucesso!',
            'id_carrinho' => $carrinho->id_carrinho
        ], 201);
    }
}
