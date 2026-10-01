<?php

namespace Tests\Feature;

use App\Models\ClienteModel;
use App\Models\PedidosModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminOrdersFilteringTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_search_orders_by_id_customer_phone_and_address(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $ana = ClienteModel::create([
            'nome' => 'Ana Oliveira',
            'telefone' => '15987654321',
        ]);
        $bruno = ClienteModel::create([
            'nome' => 'Bruno Souza',
            'telefone' => '15911112222',
        ]);
        $anaOrder = $this->createOrder([
            'cliente_id' => $ana->id,
            'endereco' => 'Avenida das Flores, 120',
            'status_pedido' => 'novo',
        ]);
        $this->createOrder([
            'cliente_id' => $bruno->id,
            'endereco' => 'Rua Central, 50',
            'status_pedido' => 'concluido',
        ]);

        foreach (['Ana Oliveira', '(15) 98765-4321', 'Flores', (string) $anaOrder->id_pedido] as $query) {
            $this->actingAs($admin, 'web')
                ->getJson('/api/admin/pedidos?'.http_build_query(['q' => $query]))
                ->assertOk()
                ->assertJsonCount(1, 'pedidos')
                ->assertJsonPath('pedidos.0.id_pedido', $anaOrder->id_pedido);
        }
    }

    public function test_status_filter_and_summary_are_global_across_pages(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        foreach (['novo', 'confirmado', 'preparando', 'saiu_entrega', 'concluido', 'cancelado'] as $status) {
            $this->createOrder(['status_pedido' => $status]);
        }

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?status=ativos&per_page=2&page=1')
            ->assertOk()
            ->assertJsonCount(2, 'pedidos')
            ->assertJsonPath('pagination.total', 4)
            ->assertJsonPath('pagination.last_page', 2)
            ->assertJsonPath('summary.active', 4)
            ->assertJsonPath('summary.new', 1)
            ->assertJsonPath('summary.preparing', 1);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?status=ativos&per_page=2&page=2')
            ->assertOk()
            ->assertJsonCount(2, 'pedidos')
            ->assertJsonPath('summary.active', 4);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?status=concluido')
            ->assertOk()
            ->assertJsonCount(1, 'pedidos')
            ->assertJsonPath('pagination.total', 1)
            ->assertJsonPath('summary.active', 4);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?status=todos')
            ->assertOk()
            ->assertJsonCount(6, 'pedidos')
            ->assertJsonPath('pagination.total', 6);
    }

    public function test_search_is_grouped_with_status_and_new_filters_are_validated(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $customer = ClienteModel::create([
            'nome' => 'Cliente Alvo',
            'telefone' => '15955556666',
        ]);
        $active = $this->createOrder([
            'cliente_id' => $customer->id,
            'status_pedido' => 'novo',
        ]);
        $this->createOrder([
            'endereco' => 'Rua Cliente Alvo, 99',
            'status_pedido' => 'cancelado',
        ]);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?'.http_build_query([
                'q' => 'Cliente Alvo',
                'status' => 'ativos',
            ]))
            ->assertOk()
            ->assertJsonCount(1, 'pedidos')
            ->assertJsonPath('pedidos.0.id_pedido', $active->id_pedido)
            ->assertJsonPath('summary.active', 1);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?status=inexistente')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?'.http_build_query(['q' => str_repeat('x', 101)]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('q');
    }

    private function createOrder(array $attributes = []): PedidosModel
    {
        return PedidosModel::create(array_merge([
            'endereco' => null,
            'forma_pagamento' => 'Pix',
            'troco' => null,
            'observacao' => null,
            'subtotal' => 10,
            'taxa_entrega' => 0,
            'total' => 10,
            'status_pagamento' => 'pendente',
            'status_pedido' => 'novo',
            'tipo_pedido' => 'local',
            'token' => (string) Str::uuid(),
        ], $attributes));
    }
}
