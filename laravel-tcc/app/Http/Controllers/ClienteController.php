<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClienteModel;

class ClienteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'telefone' => 'required|string|max:20',
        ]);

        $cliente = ClienteModel::firstOrCreate(
            ['telefone' => $validated['telefone']],
            ['nome' => $validated['nome']]
        );

        return response()->json($cliente, 201);
    }
}

