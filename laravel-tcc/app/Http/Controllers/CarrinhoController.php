<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrinho;

class CarrinhoController extends Controller
{
    public function criarCarrinho()
    {
        $carrinho = Carrinho::create([
            'id_cliente' => null,
            'status' => 'aberto'
        ]);

        return response()->json([
            'id_carrinho' => $carrinho->id
        ]);
    }
}
