<?php

namespace Tests\Feature;

use App\Models\AdicionalModel;
use App\Models\CategoriaModel;
use App\Models\ClienteModel;
use App\Models\PedidoItemAdicional;
use App\Models\PedidoItemModel;
use App\Models\PedidosModel;
use App\Models\ProdutoModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CommerceFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'store.delivery.enabled' => true,
            'store.delivery.fee' => '3.00',
            'store.delivery.minimum_order' => '0.00',
            'store.pickup.enabled' => true,
            'store.payment_methods' => ['Pix', 'Cartão', 'Dinheiro'],
            'store.order_statuses' => [
                'novo',
                'confirmado',
                'preparando',
                'saiu_entrega',
                'concluido',
                'cancelado',
            ],
        ]);
    }

    public function test_cart_uses_catalog_prices_and_persists_quantity_changes(): void
    {
        [$product, $additional] = $this->createCatalog();

        $response = $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'quantidade' => 2,
            'adicionais' => [[
                'adicional_id' => $additional->id_adicional,
                'quantidade' => 2,
                'preco' => 0.01,
            ]],
            'preco' => 0.01,
        ])->assertCreated()
            ->assertJsonPath('carrinho.0.preco', '10.00')
            ->assertJsonPath('carrinho.0.adicionais.0.preco', '2.00')
            ->assertJsonPath('carrinho.0.subtotal', '28.00');

        $uid = $response->json('carrinho.0.uid');

        $this->patchJson("/api/carrinho/atualizar/$uid", ['quantidade' => 3])
            ->assertOk()
            ->assertJsonPath('carrinho.0.quantidade', 3)
            ->assertJsonPath('carrinho.0.subtotal', '42.00');

        $this->getJson('/api/carrinho/listar')
            ->assertOk()
            ->assertJsonPath('carrinho.0.quantidade', 3);

        $this->deleteJson("/api/carrinho/remover/$uid")
            ->assertOk()
            ->assertJsonCount(0, 'carrinho');
    }

    public function test_cart_rejects_inactive_products_and_additionals(): void
    {
        [$product, $additional] = $this->createCatalog();
        $additional->update(['ativo' => false]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'adicionais' => [[
                'adicional_id' => $additional->id_adicional,
                'quantidade' => 1,
            ]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('adicionais');

        $product->update(['ativo' => false]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('produto_id');
    }

    public function test_cart_only_uses_global_additional_fallback_for_legacy_products(): void
    {
        [$product, $linkedAdditional] = $this->createCatalog();
        $globalAdditional = AdicionalModel::create([
            'nome' => 'Adicional global legado',
            'preco' => 1,
            'ativo' => true,
        ]);

        $this->assertFalse($product->fresh()->adicionais_configurados);

        // Mesmo com uma pivô antiga, o produto legado ainda aceita qualquer
        // adicional ativo até ser configurado explicitamente no painel.
        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'adicionais' => [[
                'adicional_id' => $globalAdditional->id_adicional,
                'quantidade' => 1,
            ]],
        ])->assertCreated();
        $this->deleteJson('/api/carrinho/limpar')->assertOk();

        $product->update(['adicionais_configurados' => true]);
        $product->adicionais()->detach();

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'adicionais' => [[
                'adicional_id' => $globalAdditional->id_adicional,
                'quantidade' => 1,
            ]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('adicionais');

        $product->adicionais()->attach($linkedAdditional->id_adicional);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'adicionais' => [[
                'adicional_id' => $linkedAdditional->id_adicional,
                'quantidade' => 1,
            ]],
        ])->assertCreated();
    }

    public function test_checkout_ignores_tampered_totals_and_is_idempotent(): void
    {
        [$product, $additional] = $this->createCatalog();

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'quantidade' => 2,
            'adicionais' => [[
                'adicional_id' => $additional->id_adicional,
                'quantidade' => 2,
            ]],
        ])->assertCreated();

        $payload = [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'delivery',
            'endereco' => 'Rua de Teste, 123',
            'forma_pagamento' => 'Pix',
            'troco' => null,
            'observacao' => 'Sem descartáveis',
            'cliente' => [
                'nome' => 'Cliente Teste',
                'telefone' => '(15) 99999-9999',
            ],
            'total' => 0.01,
            'carrinho' => [[
                'produto_id' => $product->id_produto,
                'preco' => 0.01,
                'quantidade' => 99,
            ]],
        ];

        $first = $this->postJson('/api/pedidos/finalizar', $payload)
            ->assertCreated()
            ->assertJsonPath('total', '31.00')
            ->assertJsonPath('carrinho', []);

        $orderId = $first->json('pedido_id');
        $customer = ClienteModel::query()
            ->where('telefone', '15999999999')
            ->firstOrFail();

        $this->assertDatabaseHas('pedidos', [
            'id_pedido' => $orderId,
            'cliente_id' => $customer->id,
            'subtotal' => 28,
            'taxa_entrega' => 3,
            'total' => 31,
            'status_pedido' => 'novo',
        ]);
        $this->assertDatabaseHas('pedido_itens', [
            'id_pedido' => $orderId,
            'id_produto' => $product->id_produto,
            'quantidade' => 2,
            'preco_unitario' => 10,
        ]);
        $this->assertDatabaseHas('pedido_item_adicionais', [
            'id_adicional' => $additional->id_adicional,
            'quantidade' => 2,
            'preco_unitario' => 2,
        ]);
        $first->assertSessionMissing('carrinho');

        $this->postJson('/api/pedidos/finalizar', $payload)
            ->assertOk()
            ->assertJsonPath('pedido_id', $orderId)
            ->assertJsonPath('total', '31.00');

        $this->assertDatabaseCount('pedidos', 1);
        $this->assertDatabaseCount('pedido_itens', 1);
    }

    public function test_checkout_reuses_customer_without_overwriting_name_or_revealing_existence(): void
    {
        [$product] = $this->createCatalog();
        $existingCustomer = ClienteModel::create([
            'nome' => 'Nome confirmado',
            'telefone' => '15911112222',
        ]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
        ])->assertCreated();

        $existingResponse = $this->postJson('/api/pedidos/finalizar', [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'local',
            'forma_pagamento' => 'Pix',
            'cliente' => [
                'nome' => 'Nome não confirmado',
                'telefone' => '(15) 91111-2222',
            ],
        ])->assertCreated();

        $existingResponse->assertExactJson([
            'pedido_id' => $existingResponse->json('pedido_id'),
            'total' => '10.00',
            'carrinho' => [],
        ]);
        $this->assertDatabaseHas('clientes', [
            'id' => $existingCustomer->id,
            'nome' => 'Nome confirmado',
            'telefone' => '15911112222',
        ]);
        $this->assertDatabaseHas('pedidos', [
            'id_pedido' => $existingResponse->json('pedido_id'),
            'cliente_id' => $existingCustomer->id,
        ]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
        ])->assertCreated();

        $newResponse = $this->postJson('/api/pedidos/finalizar', [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'local',
            'forma_pagamento' => 'Pix',
            'cliente' => [
                'nome' => 'Novo cliente',
                'telefone' => '(15) 93333-4444',
            ],
        ])->assertCreated();

        $newResponse->assertExactJson([
            'pedido_id' => $newResponse->json('pedido_id'),
            'total' => '10.00',
            'carrinho' => [],
        ]);
        $this->assertDatabaseHas('clientes', [
            'nome' => 'Novo cliente',
            'telefone' => '15933334444',
        ]);
        $this->assertDatabaseCount('clientes', 2);
    }

    public function test_checkout_rejects_browser_customer_ids_and_invalid_nested_customer_data(): void
    {
        [$product] = $this->createCatalog();
        $customer = ClienteModel::create([
            'nome' => 'Cliente existente',
            'telefone' => '15955556666',
        ]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
        ])->assertCreated();

        $payload = [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'local',
            'forma_pagamento' => 'Pix',
            'cliente' => [
                'nome' => 'Cliente novo',
                'telefone' => '15977778888',
            ],
        ];

        $this->postJson('/api/pedidos/finalizar', $payload + [
            'cliente_id' => $customer->id,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('cliente_id');

        $payload['cliente']['telefone'] = '123';

        $this->postJson('/api/pedidos/finalizar', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('cliente.telefone');

        $this->assertDatabaseCount('pedidos', 0);
        $this->assertDatabaseCount('clientes', 1);
    }

    public function test_checkout_validates_delivery_cash_change_and_empty_cart(): void
    {
        $base = [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'delivery',
            'forma_pagamento' => 'Dinheiro',
            'cliente' => [
                'nome' => 'Cliente Teste',
                'telefone' => '15999999998',
            ],
        ];

        $this->postJson('/api/pedidos/finalizar', $base)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('endereco');

        $this->postJson('/api/pedidos/finalizar', $base + ['endereco' => 'Rua Teste, 10'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('carrinho');
    }

    public function test_minimum_order_message_uses_the_white_label_currency(): void
    {
        [$product] = $this->createCatalog();
        config([
            'store.currency' => 'USD',
            'store.delivery.minimum_order' => '20.00',
        ]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'quantidade' => 1,
        ])->assertCreated();

        $this->postJson('/api/pedidos/finalizar', [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'local',
            'forma_pagamento' => 'Pix',
            'cliente' => [
                'nome' => 'Cliente internacional',
                'telefone' => '15999999996',
            ],
        ])->assertUnprocessable()
            ->assertJsonPath(
                'errors.carrinho.0',
                'O pedido mínimo é de USD 20.00.'
            )
            ->assertJsonMissing(['R$']);
    }

    public function test_checkout_accepts_white_label_cash_payment_names(): void
    {
        [$product] = $this->createCatalog();
        config(['store.payment_methods' => ['Dinheiro na entrega']]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $product->id_produto,
            'quantidade' => 1,
        ])->assertCreated();

        $this->postJson('/api/pedidos/finalizar', [
            'pedido_token' => (string) Str::uuid(),
            'tipo_pedido' => 'local',
            'forma_pagamento' => 'Dinheiro na entrega',
            'troco' => 20,
            'cliente' => [
                'nome' => 'Cliente Dinheiro',
                'telefone' => '15999999997',
            ],
        ])->assertCreated()
            ->assertJsonPath('total', '10.00');
    }

    public function test_admin_can_update_operational_and_payment_status_by_id_pedido(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $order = $this->createOrder();

        $this->actingAs($admin, 'web')
            ->putJson("/api/admin/pedidos/{$order->id_pedido}/status", [
                'status_pedido' => 'preparando',
            ])
            ->assertOk()
            ->assertJsonPath('pedido.status_pedido', 'preparando');

        $this->actingAs($admin, 'web')
            ->putJson("/api/admin/pedidos/{$order->id_pedido}/status", [
                'status_pagamento' => 'pago',
            ])
            ->assertOk()
            ->assertJsonPath('pedido.status_pagamento', 'pago');

        $this->assertDatabaseHas('pedidos', [
            'id_pedido' => $order->id_pedido,
            'status_pedido' => 'preparando',
            'status_pagamento' => 'pago',
        ]);

        $this->actingAs($admin, 'web')
            ->putJson("/api/admin/pedidos/{$order->id_pedido}/status", [
                'status_pedido' => 'inventado',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status_pedido');
    }

    public function test_admin_dashboard_exposes_the_frontend_metrics_contract(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $order = $this->createOrder();

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('data.metrics.orders_today', 1)
            ->assertJsonPath('data.metrics.pending_orders', 1)
            ->assertJsonPath('data.metrics.revenue_today', '10.00')
            ->assertJsonPath('data.metrics.average_ticket', '10.00')
            ->assertJsonPath('data.recent_orders.0.id_pedido', $order->id_pedido)
            ->assertJsonCount(7, 'data.sales_last_7_days');
    }

    public function test_admin_can_paginate_the_complete_order_history(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->createOrder();
        $this->createOrder();
        $this->createOrder();

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?per_page=2&page=1')
            ->assertOk()
            ->assertJsonCount(2, 'pedidos')
            ->assertJsonPath('pagination.current_page', 1)
            ->assertJsonPath('pagination.last_page', 2)
            ->assertJsonPath('pagination.total', 3)
            ->assertJsonPath('pagination.has_more', true);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/pedidos?per_page=2&page=2')
            ->assertOk()
            ->assertJsonCount(1, 'pedidos')
            ->assertJsonPath('pagination.has_more', false);
    }

    public function test_catalog_deletion_is_soft_and_preserves_order_history(): void
    {
        [$product, $additional] = $this->createCatalog();
        $order = $this->createOrder();
        $orderItem = PedidoItemModel::create([
            'id_pedido' => $order->id_pedido,
            'id_produto' => $product->id_produto,
            'quantidade' => 1,
            'preco_unitario' => $product->preco,
        ]);
        PedidoItemAdicional::create([
            'id_pedido_item' => $orderItem->id,
            'id_adicional' => $additional->id_adicional,
            'quantidade' => 1,
            'preco_unitario' => $additional->preco,
        ]);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin, 'web')
            ->deleteJson("/api/admin/produtos/{$product->id_produto}")
            ->assertOk();
        $this->actingAs($admin, 'web')
            ->deleteJson("/api/admin/adicionais/{$additional->id_adicional}")
            ->assertOk();

        $this->assertSoftDeleted('produto', ['id_produto' => $product->id_produto]);
        $this->assertSoftDeleted('adicional', ['id_adicional' => $additional->id_adicional]);
        $this->assertDatabaseHas('pedido_itens', ['id' => $orderItem->id]);
        $this->assertDatabaseHas('pedido_item_adicionais', ['id_pedido_item' => $orderItem->id]);

        $historicalOrder = PedidosModel::with('itens.produto', 'itens.adicionais.adicional')
            ->findOrFail($order->id_pedido);
        $this->assertSame('Produto Teste', $historicalOrder->itens->first()->produto->nome);
        $this->assertSame(
            'Adicional Teste',
            $historicalOrder->itens->first()->adicionais->first()->adicional->nome
        );
    }

    public function test_admin_cannot_remove_a_category_while_non_deleted_products_are_linked(): void
    {
        [$product] = $this->createCatalog();
        $category = $product->categoria;
        $admin = User::factory()->create(['is_admin' => true]);

        // Produtos inativos continuam sendo registros válidos e também devem
        // impedir que a categoria desapareça do catálogo administrativo.
        $product->update(['ativo' => false]);

        $this->actingAs($admin, 'web')
            ->deleteJson("/api/admin/categorias/{$category->id_categoria}")
            ->assertConflict()
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'category_has_products')
            ->assertJsonPath('produtos_vinculados', 1);

        $this->assertNotSoftDeleted('categoria', [
            'id_categoria' => $category->id_categoria,
        ]);
        $this->assertDatabaseHas('produto', [
            'id_produto' => $product->id_produto,
            'id_categoria' => $category->id_categoria,
        ]);

        // Depois que o produto também é removido logicamente, não há mais um
        // registro operacional vinculado e a categoria pode ser desativada.
        $product->delete();

        $this->actingAs($admin, 'web')
            ->deleteJson("/api/admin/categorias/{$category->id_categoria}")
            ->assertOk();

        $this->assertSoftDeleted('categoria', [
            'id_categoria' => $category->id_categoria,
        ]);
        $this->assertSoftDeleted('produto', [
            'id_produto' => $product->id_produto,
            'id_categoria' => $category->id_categoria,
        ]);
    }

    public function test_admin_catalog_rejects_negative_prices_and_store_profile_has_order_contract(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin, 'web')
            ->postJson('/api/admin/produtos', [
                'nome' => 'Preço inválido',
                'preco' => -1,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('preco');

        $this->getJson('/api/store')
            ->assertOk()
            ->assertJsonPath('store.name', config('store.name'))
            ->assertJsonPath('store.order.delivery_fee', config('store.order.delivery_fee'))
            ->assertJsonPath('store.order.payment_methods.0', config('store.order.payment_methods.0'));
    }

    public function test_admin_product_store_syncs_active_additionals_and_always_returns_the_relation(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $first = AdicionalModel::create([
            'nome' => 'Primeiro adicional',
            'preco' => 1,
            'ativo' => true,
        ]);
        $second = AdicionalModel::create([
            'nome' => 'Segundo adicional',
            'preco' => 2,
            'ativo' => true,
        ]);

        $response = $this->actingAs($admin, 'web')
            ->postJson('/api/admin/produtos', [
                'nome' => 'Produto com adicionais',
                'preco' => 12,
                'adicionais' => [$first->id_adicional, $second->id_adicional],
            ])
            ->assertCreated()
            ->assertJsonPath('adicionais_configurados', true)
            ->assertJsonCount(2, 'adicionais')
            ->assertJsonFragment(['id_adicional' => $first->id_adicional])
            ->assertJsonFragment(['id_adicional' => $second->id_adicional]);

        $productId = $response->json('id_produto');
        $this->assertDatabaseHas('produto_adicional', [
            'id_produto' => $productId,
            'id_adicional' => $first->id_adicional,
        ]);
        $this->assertDatabaseHas('produto_adicional', [
            'id_produto' => $productId,
            'id_adicional' => $second->id_adicional,
        ]);

        $this->actingAs($admin, 'web')
            ->postJson('/api/admin/produtos', [
                'nome' => 'Produto legado sem configuração',
                'preco' => 8,
            ])
            ->assertCreated()
            ->assertJsonPath('adicionais_configurados', false)
            ->assertJsonCount(0, 'adicionais');

        $this->actingAs($admin, 'web')
            ->postJson('/api/admin/produtos', [
                'nome' => 'Produto configurado sem adicionais',
                'preco' => 9,
                'adicionais' => [],
            ])
            ->assertCreated()
            ->assertJsonPath('adicionais_configurados', true)
            ->assertJsonCount(0, 'adicionais');
    }

    public function test_admin_product_update_can_replace_preserve_and_clear_additional_links(): void
    {
        [$product, $first] = $this->createCatalog();
        $second = AdicionalModel::create([
            'nome' => 'Novo adicional',
            'preco' => 3,
            'ativo' => true,
        ]);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin, 'web')
            ->putJson("/api/admin/produtos/{$product->id_produto}", [
                'adicionais' => [$second->id_adicional],
            ])
            ->assertOk()
            ->assertJsonPath('adicionais_configurados', true)
            ->assertJsonCount(1, 'adicionais')
            ->assertJsonPath('adicionais.0.id_adicional', $second->id_adicional);

        $this->assertDatabaseMissing('produto_adicional', [
            'id_produto' => $product->id_produto,
            'id_adicional' => $first->id_adicional,
        ]);

        // O contrato legado omite `adicionais`; nesse caso, o vínculo atual
        // deve ser preservado em vez de ser apagado implicitamente.
        $this->actingAs($admin, 'web')
            ->putJson("/api/admin/produtos/{$product->id_produto}", [
                'nome' => 'Produto renomeado',
            ])
            ->assertOk()
            ->assertJsonPath('adicionais_configurados', true)
            ->assertJsonCount(1, 'adicionais')
            ->assertJsonPath('adicionais.0.id_adicional', $second->id_adicional);

        // Uploads usam FormData; `[]` em JSON permite representar uma seleção
        // explicitamente vazia e deve remover todos os vínculos.
        $this->actingAs($admin, 'web')
            ->post("/api/admin/produtos/{$product->id_produto}", [
                '_method' => 'PUT',
                'adicionais' => '[]',
            ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('adicionais_configurados', true)
            ->assertJsonCount(0, 'adicionais');

        $this->assertDatabaseMissing('produto_adicional', [
            'id_produto' => $product->id_produto,
        ]);
        $this->assertDatabaseHas('produto', [
            'id_produto' => $product->id_produto,
            'adicionais_configurados' => true,
        ]);
    }

    public function test_admin_product_rejects_unavailable_additionals_without_writing_product_data(): void
    {
        [$product, $active] = $this->createCatalog();
        $inactive = AdicionalModel::create([
            'nome' => 'Adicional inativo',
            'preco' => 1,
            'ativo' => false,
        ]);
        $deleted = AdicionalModel::create([
            'nome' => 'Adicional removido',
            'preco' => 1,
            'ativo' => true,
        ]);
        $deleted->delete();
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin, 'web')
            ->postJson('/api/admin/produtos', [
                'nome' => 'Produto inválido',
                'preco' => 12,
                'adicionais' => [
                    $active->id_adicional,
                    $inactive->id_adicional,
                    $deleted->id_adicional,
                    999999,
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'adicionais.1',
                'adicionais.2',
                'adicionais.3',
            ]);

        $this->assertDatabaseMissing('produto', ['nome' => 'Produto inválido']);

        $this->actingAs($admin, 'web')
            ->putJson("/api/admin/produtos/{$product->id_produto}", [
                'nome' => 'Nome que não deve persistir',
                'adicionais' => [$inactive->id_adicional],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('adicionais.0');

        $this->assertDatabaseHas('produto', [
            'id_produto' => $product->id_produto,
            'nome' => 'Produto Teste',
        ]);
        $this->assertDatabaseHas('produto_adicional', [
            'id_produto' => $product->id_produto,
            'id_adicional' => $active->id_adicional,
        ]);
    }

    private function createCatalog(): array
    {
        $category = CategoriaModel::create([
            'nome' => 'Categoria Teste',
            'ativo' => true,
            'ordem' => 1,
        ]);
        $product = ProdutoModel::create([
            'nome' => 'Produto Teste',
            'descricao' => 'Descrição',
            'preco' => 10,
            'id_categoria' => $category->id_categoria,
            'ativo' => true,
            'destaque' => false,
            'ordem' => 1,
        ]);
        $additional = AdicionalModel::create([
            'nome' => 'Adicional Teste',
            'preco' => 2,
            'ativo' => true,
            'ordem' => 1,
        ]);
        $product->adicionais()->attach($additional->id_adicional);

        return [$product, $additional];
    }

    private function createOrder(): PedidosModel
    {
        return PedidosModel::create([
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
        ]);
    }
}
