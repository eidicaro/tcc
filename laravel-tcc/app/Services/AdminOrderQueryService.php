<?php

namespace App\Services;

use App\Models\PedidosModel;
use Illuminate\Database\Eloquent\Builder;

class AdminOrderQueryService
{
    public const ACTIVE_STATUSES = [
        'novo',
        'confirmado',
        'preparando',
        'saiu_entrega',
    ];

    public function applyFilters(Builder $query, array $filters): Builder
    {
        $search = trim((string) ($filters['q'] ?? ''));

        if ($search !== '') {
            $like = "%$search%";
            $phoneDigits = preg_replace('/\D+/', '', $search) ?? '';
            $orderId = preg_match('/^\d{1,18}$/', $search) === 1
                ? (ltrim($search, '0') ?: '0')
                : null;

            $query->where(function (Builder $conditions) use (
                $like,
                $orderId,
                $phoneDigits
            ): void {
                // Todas as alternativas ficam neste grupo para não escaparem
                // dos filtros de status aplicados na consulta externa.
                $conditions
                    ->where('endereco', 'like', $like)
                    ->orWhereHas('cliente', function (Builder $customers) use ($like, $phoneDigits): void {
                        $customers->where('nome', 'like', $like);

                        if ($phoneDigits !== '') {
                            $customers->orWhere('telefone', 'like', "%$phoneDigits%");
                        } else {
                            $customers->orWhere('telefone', 'like', $like);
                        }
                    });

                if ($orderId !== null) {
                    $conditions->orWhere('id_pedido', $orderId);
                }
            });
        }

        if (array_key_exists('status', $filters)) {
            if ($filters['status'] === 'ativos') {
                $query->whereIn('status_pedido', self::ACTIVE_STATUSES);
            } elseif ($filters['status'] !== 'todos') {
                $query->where('status_pedido', $filters['status']);
            }
        } elseif (isset($filters['status_pedido'])) {
            // Compatibilidade com consumidores anteriores ao filtro agregado.
            $query->where('status_pedido', $filters['status_pedido']);
        }

        if (isset($filters['status_pagamento'])) {
            $query->where('status_pagamento', $filters['status_pagamento']);
        }

        return $query;
    }

    public function summary(): array
    {
        $totals = PedidosModel::query()
            ->selectRaw(
                'COALESCE(SUM(CASE WHEN status_pedido IN (?, ?, ?, ?) THEN 1 ELSE 0 END), 0) AS active_count,
                COALESCE(SUM(CASE WHEN status_pedido = ? THEN 1 ELSE 0 END), 0) AS new_count,
                COALESCE(SUM(CASE WHEN status_pedido = ? THEN 1 ELSE 0 END), 0) AS preparing_count',
                [...self::ACTIVE_STATUSES, 'novo', 'preparando']
            )
            ->first();

        return [
            'active' => (int) ($totals?->active_count ?? 0),
            'new' => (int) ($totals?->new_count ?? 0),
            'preparing' => (int) ($totals?->preparing_count ?? 0),
        ];
    }
}
