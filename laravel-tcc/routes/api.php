<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\AdicionalController;


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
Route::post('/produtos/{id}/adicionais', [ProdutosController::class, 'atualizarAdicionais']);



