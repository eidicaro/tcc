<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProdutoModel;
use Illuminate\Support\Facades\Storage;

class ProdutosController extends Controller
{
    // Listar todos os produtos
    public function index()
    {
        $produtos = ProdutoModel::all()->map(function ($produto) {
            $produto->imagem_url = $produto->imagem
                ? asset('storage/' . $produto->imagem)
                : null;
            return $produto;
        });

        return response()->json($produtos);
    }

    // Criar produto
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric',
            'id_categoria' => 'nullable|integer|exists:categoria,id_categoria',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $caminhoImagem = null;
        if ($request->hasFile('imagem')) {
            $caminhoImagem = $request->file('imagem')->store('images', 'public');
        }

        $produto = ProdutoModel::create([
            'nome' => $validated['nome'],
            'descricao' => $validated['descricao'] ?? '',
            'preco' => $validated['preco'],
            'imagem' => $caminhoImagem,
            'id_categoria' => $validated['id_categoria'] ?? null,
        ]);

        $produto->imagem_url = $produto->imagem ? asset('storage/' . $produto->imagem) : null;

        return response()->json($produto);
    }

    // Atualizar produto
    public function update(Request $request, $id)
    {
        $produto = ProdutoModel::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric',
            'id_categoria' => 'nullable|integer|exists:categoria,id_categoria',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        if ($request->hasFile('imagem')) {
            // Remove imagem antiga
            if ($produto->imagem && Storage::disk('public')->exists($produto->imagem)) {
                Storage::disk('public')->delete($produto->imagem);
            }
            $produto->imagem = $request->file('imagem')->store('images', 'public');
        }

        $produto->update([
            'nome' => $validated['nome'],
            'descricao' => $validated['descricao'] ?? '',
            'preco' => $validated['preco'],
            'id_categoria' => $validated['id_categoria'] ?? null,
            'imagem' => $produto->imagem, // garante que a nova imagem seja salva
        ]);

        $produto->imagem_url = $produto->imagem ? asset('storage/' . $produto->imagem) : null;

        return response()->json($produto);
    }

    // Excluir produto
    public function destroy($id)
    {
        $produto = ProdutoModel::findOrFail($id);

        if ($produto->imagem && Storage::disk('public')->exists($produto->imagem)) {
            Storage::disk('public')->delete($produto->imagem);
        }

        $produto->delete();
        return response()->json(['success' => true]);
    }
}
