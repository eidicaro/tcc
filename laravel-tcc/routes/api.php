<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\AdicionalController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CarrinhoController;
use App\Http\Controllers\PedidosController;
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
Route::prefix('carrinho')->group(function() {
    Route::get('/listar', [CarrinhoController::class, 'listar']);
    Route::post('/adicionar', [CarrinhoController::class, 'adicionar']);
    Route::delete('/remover/{uid}', [CarrinhoController::class, 'remover']);
    Route::delete('/limpar', [CarrinhoController::class, 'limpar']);
});


// rotas de pagamento
Route::get('/pedidos', [PedidosController::class, 'listarPedidos']); // listar pedidos no admin
Route::post('/pedidos/finalizar', [PedidosController::class, 'finalizar']);

// rotas de admim

Route::prefix('admin')->group(function () {
    Route::get('/pedidos', [PedidosController::class, 'listarPedidos']);
    Route::get('/pedidos/{id}', [PedidosController::class, 'mostrarPedido']);
    Route::put('/pedidos/{id}', [PedidosController::class, 'atualizarPedido']);
    Route::put('/pedidos/{id}/status', [PedidosController::class, 'atualizarStatus']);
    Route::delete('/pedidos/{id}', [PedidosController::class, 'excluirPedido']);
});

// Produtos - CRUD admin
Route::prefix('admin')->group(function () {
        //produtos
    Route::get('/produtos', [ProdutosController::class, 'index']); // já existe
    Route::post('/produtos', [ProdutosController::class, 'store']); // criar
    Route::put('/produtos/{id}', [ProdutosController::class, 'update']); // editar
    Route::delete('/produtos/{id}', [ProdutosController::class, 'destroy']); // excluir

      // Categorias
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::post('/categorias', [CategoriaController::class, 'store']);
    Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
    Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

    // Adicionais
    Route::get('/adicionais', [AdicionalController::class, 'index']);
    Route::post('/adicionais', [AdicionalController::class, 'store']);
    Route::put('/adicionais/{id}', [AdicionalController::class, 'update']);
    Route::delete('/adicionais/{id}', [AdicionalController::class, 'destroy']);

});



// rota para o token
Route::get('/csrf-cookie', function() {
    return response()->json(['csrf_token' => csrf_token()]);
});






