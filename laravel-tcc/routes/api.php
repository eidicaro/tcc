<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\AdicionalController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CarrinhoController;

// Produtos
Route::get('/produtos', [ProdutosController::class, 'index']); // Lista todos os produtos
Route::get('/produtos/by-ids', [ProdutosController::class, 'getByIds']); // Para o carrossel
// Route::get('/produtos/testar-adicionais', [ProdutosController::class, 'testaradicionais']);  Adicionais do produto


// Categorias
Route::get('/categoria', [CategoriaController::class, 'index']);

// Adicionais
Route::get('/adicionais', [AdicionalController::class, 'index']);

// criar carrinho 
Route::post('/carrinho/adicionar', [CarrinhoController::class, 'adicionar']);
Route::delete('/carrinho/remover/{id}', [CarrinhoController::class, 'remover']);
Route::get('/carrinho', [CarrinhoController::class, 'listar']);
Route::delete('/carrinho/limpar', [CarrinhoController::class, 'limpar']);
Route::post('/carrinho/finalizar', [CarrinhoController::class, 'finalizar']);



