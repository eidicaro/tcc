<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarrinhoController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/



// routes/web.php
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// rotas do carrinho migradas
// routes/web.php

// Route::prefix('carrinho')->group(function() {
//     Route::get('/', [CarrinhoController::class, 'listar']);
//     Route::post('/adicionar', [CarrinhoController::class, 'adicionar']);
//     Route::delete('/remover/{uid}', [CarrinhoController::class, 'remover']);
//     Route::delete('/limpar', [CarrinhoController::class, 'limpar']);
// });

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['message' => 'Logout efetuado com sucesso']);
});



Route::get('/debug-carrinho', function () {
    dd(session()->all());
});

