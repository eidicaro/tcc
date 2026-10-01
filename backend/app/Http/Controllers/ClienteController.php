<?php

namespace App\Http\Controllers;

use App\Models\ClienteModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClienteController extends Controller
{
    public function update(Request $request, int $id): JsonResponse
    {
        $customer = ClienteModel::findOrFail($id);
        [$data, $phone] = $this->validatedCustomer($request);

        $phoneInUse = ClienteModel::query()
            ->where('telefone', $phone)
            ->where('id', '!=', $customer->getKey())
            ->exists();

        if ($phoneInUse) {
            throw ValidationException::withMessages([
                'telefone' => ['Este telefone já pertence a outro cliente.'],
            ]);
        }

        $customer->update([
            'nome' => trim($data['nome']),
            'telefone' => $phone,
        ]);

        return response()->json($customer->fresh());
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $search = trim($data['q'] ?? '');
        $phone = preg_replace('/\D+/', '', $search) ?? '';
        $escapedSearch = addcslashes($search, '\\%_');

        $customers = ClienteModel::query()
            ->select('id', 'nome', 'telefone')
            ->orderBy('nome')
            ->when($search !== '', function ($query) use ($escapedSearch, $phone): void {
                $query->where(function ($query) use ($escapedSearch, $phone): void {
                    $query->where('nome', 'like', "%{$escapedSearch}%");
                    if ($phone !== '') {
                        $query->orWhere('telefone', 'like', "%{$phone}%");
                    }
                });
            })
            ->paginate(
                perPage: (int) ($data['per_page'] ?? 50),
                page: (int) ($data['page'] ?? 1),
            );

        return response()->json([
            'clientes' => $customers->items(),
            'pagination' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
                'has_more' => $customers->hasMorePages(),
            ],
        ]);
    }

    private function validatedCustomer(Request $request): array
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'telefone' => ['required', 'string', 'max:20'],
        ]);

        $phone = preg_replace('/\D+/', '', $data['telefone']) ?? '';

        if (strlen($phone) < 10 || strlen($phone) > 15) {
            throw ValidationException::withMessages([
                'telefone' => ['Informe um telefone válido com DDD.'],
            ]);
        }

        return [$data, $phone];
    }
}
