<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProdutoModel; 


class ProdutosController extends Controller
{
    public function index()
{
    return response()->json(ProdutoModel::all());
}
public function adicionais($id) {
    $produto = Produto::findOrFail($id);
    return $produto->adicionais; // assumindo relacionamento $produto->adicionais()
}

}
