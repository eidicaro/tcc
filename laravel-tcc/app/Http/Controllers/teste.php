<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CardapioController extends Controller
{
    public function index()
    {
        return response()->json([
            ['nome' => 'Sushi', 'preco' => 20],
            ['nome' => 'Poke', 'preco' => 25],
            ['nome' => 'Temaki', 'preco' => 22],
        ]);
    }
}
