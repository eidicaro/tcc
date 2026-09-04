<?php

use App\Http\Controllers\AdicionalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarrinhoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/store', [StoreController::class, 'show']);
Route::get('/produtos', [ProdutosController::class, 'index']);
Route::get('/produtos/by-ids', [ProdutosController::class, 'getByIds']);
Route::get('/categoria', [CategoriaController::class, 'index']);
Route::get('/adicionais', [AdicionalController::class, 'index']);

Route::prefix('carrinho')->middleware('throttle:carrinho')->group(function (): void {
    Route::get('/listar', [CarrinhoController::class, 'listar']);
    Route::post('/adicionar', [CarrinhoController::class, 'adicionar']);
    Route::patch('/atualizar/{uid}', [CarrinhoController::class, 'atualizar']);
    Route::delete('/remover/{uid}', [CarrinhoController::class, 'remover']);
    Route::delete('/limpar', [CarrinhoController::class, 'limpar']);
});

Route::post('/pedidos/finalizar', [PedidosController::class, 'finalizar'])
    ->middleware('throttle:checkout');

Route::get('/auth/me', [AuthController::class, 'me'])
    ->middleware('auth:sanctum');

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin'])
    ->group(function (): void {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/pedidos', [PedidosController::class, 'listarPedidos']);
        Route::get('/pedidos/{id}', [PedidosController::class, 'mostrarPedido'])->whereNumber('id');
        Route::put('/pedidos/{id}', [PedidosController::class, 'atualizarPedido'])->whereNumber('id');
        Route::put('/pedidos/{id}/status', [PedidosController::class, 'atualizarStatus'])->whereNumber('id');
        Route::delete('/pedidos/{id}', [PedidosController::class, 'excluirPedido'])->whereNumber('id');

        Route::get('/produtos', [ProdutosController::class, 'index']);
        Route::post('/produtos', [ProdutosController::class, 'store']);
        Route::put('/produtos/{id}', [ProdutosController::class, 'update'])->whereNumber('id');
        Route::delete('/produtos/{id}', [ProdutosController::class, 'destroy'])->whereNumber('id');

        Route::get('/categorias', [CategoriaController::class, 'index']);
        Route::post('/categorias', [CategoriaController::class, 'store']);
        Route::put('/categorias/{id}', [CategoriaController::class, 'update'])->whereNumber('id');
        Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy'])->whereNumber('id');

        Route::get('/adicionais', [AdicionalController::class, 'index']);
        Route::post('/adicionais', [AdicionalController::class, 'store']);
        Route::put('/adicionais/{id}', [AdicionalController::class, 'update'])->whereNumber('id');
        Route::delete('/adicionais/{id}', [AdicionalController::class, 'destroy'])->whereNumber('id');

        Route::get('/clientes', [ClienteController::class, 'index']);
    });
