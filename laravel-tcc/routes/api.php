<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\AdicionalController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CarrinhoAdicionalController;
use App\Http\Controllers\CarrinhoController;
use App\Models\ClienteModel;
use App\Models\Carrinho;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::get('/produtos', [ProdutosController::class, 'index']);
Route::get('/produtos/{id}/adicionais', [ProdutosController::class, 'getAdicionais']);
Route::get('/produtos/testar-adicionais', [ProdutosController::class, 'testarAdicionais']);
Route::get('/adicionais', [AdicionalController::class, 'index']);
Route::get('/categoria', [CategoriaController::class, 'index']);


Route::post('/produtos/{id}/adicionais', [ProdutosController::class, 'atualizarAdicionais']);
Route::post('/carrinho/adicional', [CarrinhoController::class, 'adicionarAdicional']);
Route::post('/carrinho/criar', [CarrinhoController::class, 'criarCarrinho']);



Route::post('/clientes/cadastrar', function (Request $request) {
    $validated = $request->validate([
        'nome' => 'required|string|max:255',
        'telefone' => 'required|string|max:20',
        'email' => 'required|email|unique:cliente,email',
    ]);

    $cliente = ClienteModel::create($validated);

    return response()->json([
        'message' => 'Cliente cadastrado com sucesso!',
        'id_cliente' => $cliente->id_cliente,
        'cliente' => $cliente
    ]);
});

Route::post('/clientes/login', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
    ]);

    $cliente = ClienteModel::where('email', $validated['email'])->first();

    if (!$cliente) {
        return response()->json(['message' => 'Cliente não encontrado'], 404);
    }

    return response()->json([
        'message' => 'Login realizado!',
        'id_cliente' => $cliente->id_cliente,
        'cliente' => $cliente
    ]);
});

Route::post('/carrinho/criar', function (Request $request) {
    $validated = $request->validate([
        'id_cliente' => 'required|exists:cliente,id_cliente',
    ]);

    $carrinho = Carrinho::firstOrCreate([
        'id_cliente' => $validated['id_cliente'],
    ]);

    return response()->json([
        'message' => 'Carrinho criado com sucesso!',
        'id_carrinho' => $carrinho->id_carrinho
    ]);
});





