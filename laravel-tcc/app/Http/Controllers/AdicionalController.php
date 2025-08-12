<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdicionalController extends Controller
{
    public function index()
    {
        return response()->json(AdicionalModel::all());
    }

    public function listarAdicionais()
    {
        $adicionais = Adicional::all();
        return response()->json($adicionais);
    }

}
