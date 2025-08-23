<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdicionalModel;

class AdicionalController extends Controller
{
    public function index()
    {
        return response()->json(AdicionalModel::all());
    }

    public function listarAdicionais()
    {
        $adicionais = AdicionalModels::all();
        return response()->json($adicionais);
    }

}
