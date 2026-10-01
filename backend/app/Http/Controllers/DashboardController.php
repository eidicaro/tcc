<?php

namespace App\Http\Controllers;

use App\Models\AdicionalModel;
use App\Models\ClienteModel;
use App\Models\PedidosModel;
use App\Models\ProdutoModel;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $storeTimezone = config('store.timezone', 'America/Sao_Paulo');
        $storageTimezone = config('app.timezone', 'UTC');
        $today = CarbonImmutable::now($storeTimezone)->startOfDay();
        $validOrders = PedidosModel::query()
            ->where('status_pedido', '!=', 'cancelado');
        $todayOrders = (clone $validOrders)->whereBetween('created_at', [
            $today->setTimezone($storageTimezone),
            $today->endOfDay()->setTimezone($storageTimezone),
        ]);

        $orderCount = (clone $todayOrders)->count();
        $revenue = (float) (clone $todayOrders)->sum('total');
        $customers = ClienteModel::count();
        $activeProducts = ProdutoModel::where('ativo', true)->count();
        $activeAdditionals = AdicionalModel::where('ativo', true)->count();

        $sales = collect(range(6, 0))
            ->map(function (int $daysAgo) use ($storageTimezone, $validOrders, $today): array {
                $date = $today->subDays($daysAgo);

                return [
                    'date' => $date->toDateString(),
                    'label' => $date->format('d/m'),
                    'total' => number_format(
                        (float) (clone $validOrders)->whereBetween('created_at', [
                            $date->setTimezone($storageTimezone),
                            $date->endOfDay()->setTimezone($storageTimezone),
                        ])->sum('total'),
                        2,
                        '.',
                        ''
                    ),
                ];
            })
            ->all();

        $recentOrders = PedidosModel::query()
            ->with('cliente:id,nome,telefone')
            ->latest('id_pedido')
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => [
                    'orders_today' => $orderCount,
                    'pending_orders' => PedidosModel::where('status_pedido', 'novo')->count(),
                    'revenue_today' => number_format($revenue, 2, '.', ''),
                    'average_ticket' => number_format($orderCount > 0 ? $revenue / $orderCount : 0, 2, '.', ''),
                    'customers' => $customers,
                    'total_customers' => $customers,
                    'active_products' => $activeProducts,
                    'active_additionals' => $activeAdditionals,
                ],
                'today' => [
                    'orders' => $orderCount,
                    'revenue' => number_format($revenue, 2, '.', ''),
                    'average_ticket' => number_format($orderCount > 0 ? $revenue / $orderCount : 0, 2, '.', ''),
                ],
                'orders' => [
                    'new' => PedidosModel::where('status_pedido', 'novo')->count(),
                    'confirmed' => PedidosModel::where('status_pedido', 'confirmado')->count(),
                    'preparing' => PedidosModel::where('status_pedido', 'preparando')->count(),
                    'out_for_delivery' => PedidosModel::where('status_pedido', 'saiu_entrega')->count(),
                ],
                'catalog' => [
                    'active_products' => $activeProducts,
                    'active_additionals' => $activeAdditionals,
                ],
                'customers' => $customers,
                'recent_orders' => $recentOrders,
                'sales_last_7_days' => $sales,
            ],
        ]);
    }
}
