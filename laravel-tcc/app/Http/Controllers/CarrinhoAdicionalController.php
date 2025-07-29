<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarrinhoProdAdd;

class CarrinhoAdicionalController extends Controller
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
}
