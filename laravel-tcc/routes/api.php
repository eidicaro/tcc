<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\AdicionalController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CarrinhoController;
use Illuminate\Session\Middleware\StartSession;


// Produtos
Route::get('/produtos', [ProdutosController::class, 'index']); // Lista todos os produtos
Route::get('/produtos/by-ids', [ProdutosController::class, 'getByIds']); // Para o carrossel
// Route::get('/produtos/testar-adicionais', [ProdutosController::class, 'testaradicionais']);  Adicionais do produto


// Categorias
Route::get('/categoria', [CategoriaController::class, 'index']);

// Adicionais
Route::get('/adicionais', [AdicionalController::class, 'index']);

// Rotas de carrinho com sessão ativa
// Route::middleware('web')->group(function () {
//     Route::get('/carrinho', [CarrinhoController::class, 'listar']);
//     Route::post('/carrinho/adicionar', [CarrinhoController::class, 'adicionar']);
//     Route::delete('/carrinho/remover/{uid}', [CarrinhoController::class, 'remover']);
//     Route::delete('/carrinho/limpar', [CarrinhoController::class, 'limpar']);
// });


// rota para o token
Route::get('/csrf-cookie', function() {
    return response()->json(['csrf_token' => csrf_token()]);
});


