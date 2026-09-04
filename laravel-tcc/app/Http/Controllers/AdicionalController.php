<?php

namespace App\Http\Controllers;

use App\Models\AdicionalModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AdicionalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AdicionalModel::query();

        if (! $request->is('api/admin/*')) {
            $query->where('ativo', true);
        }

        return response()->json($query
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $image = $data['imagem'] ?? null;
        unset($data['imagem']);

        $storedPath = null;

        try {
            if ($image) {
                $storedPath = $image->store('images', 'public');
                $data['imagem'] = $storedPath;
            }

            $additional = AdicionalModel::create($data);
        } catch (Throwable $exception) {
            if ($storedPath) {
                Storage::disk('public')->delete($storedPath);
            }

            throw $exception;
        }

        return response()->json($additional, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $additional = AdicionalModel::findOrFail($id);
        $data = $request->validate($this->rules(true));
        $image = $data['imagem'] ?? null;
        unset($data['imagem']);

        $oldPath = $additional->imagem;
        $newPath = null;

        try {
            if ($image) {
                $newPath = $image->store('images', 'public');
                $data['imagem'] = $newPath;
            }

            $additional->update($data);
        } catch (Throwable $exception) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            throw $exception;
        }

        if ($newPath && $oldPath && $oldPath !== $newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json($additional->fresh());
    }

    public function destroy(int $id): JsonResponse
    {
        $additional = AdicionalModel::findOrFail($id);
        $additional->delete();

        return response()->json([
            'success' => true,
            'message' => 'Adicional desativado com sucesso.',
        ]);
    }

    private function rules(bool $updating = false): array
    {
        $presence = $updating ? 'sometimes' : 'required';

        return [
            'nome' => [$presence, 'string', 'max:100'],
            'preco' => [$presence, 'numeric', 'min:0', 'max:99999999.99'],
            'imagem' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'ativo' => ['sometimes', 'boolean'],
            'ordem' => ['sometimes', 'integer', 'min:0', 'max:4294967295'],
        ];
    }
}
