<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdicionalModel;
use Illuminate\Support\Facades\Storage;
use App\Models\AdicionalModel as Adicional;


class AdicionalController extends Controller
{
    // Lista todos os adicionais
    public function index()
    {
        $adicionais = AdicionalModel::all()->map(function ($adc) {
            $adc->imagem_url = $adc->imagem ? asset('storage/' . $adc->imagem) : null;
            return $adc;
        });
        return response()->json($adicionais);
    }

    // Cria um novo adicional
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric',
            'imagem' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('imagem')) {
            $path = $request->file('imagem')->store('images', 'public');
            $validated['imagem'] = $path; 
        }

        $adicional = AdicionalModel::create($validated); 

        return response()->json($adicional, 201);
    }

    // Atualiza um adicional existente
    public function update(Request $request, $id)
    {
        $adicional = AdicionalModel::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'preco' => 'sometimes|numeric',
            'imagem' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('imagem')) {
            // Remove imagem anterior se existir
            if ($adicional->imagem && Storage::disk('public')->exists($adicional->imagem)) {
                Storage::disk('public')->delete($adicional->imagem);
            }

            $path = $request->file('imagem')->store('images', 'public');
            $validated['imagem'] = $path;
        }

        $adicional->update($validated);

        return response()->json($adicional);
    }

    // Exclui um adicional
    public function destroy($id)
    {
        $adicional = AdicionalModel::findOrFail($id);

        if ($adicional->imagem && Storage::disk('public')->exists($adicional->imagem)) {
            Storage::disk('public')->delete($adicional->imagem);
        }

        $adicional->delete();

        return response()->json(['message' => 'Adicional excluído com sucesso!']);
    }
}
