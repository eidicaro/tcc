<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProductAdditionalsMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_migration_backfills_only_products_with_existing_additional_links(): void
    {
        $migration = require database_path(
            'migrations/2026_08_06_000002_add_additionals_configuration_marker_to_products.php'
        );
        $migration->down();

        $now = now();
        $configuredProductId = DB::table('produto')->insertGetId([
            'nome' => 'Produto previamente configurado',
            'preco' => 10,
            'created_at' => $now,
            'updated_at' => $now,
        ], 'id_produto');
        $legacyProductId = DB::table('produto')->insertGetId([
            'nome' => 'Produto realmente legado',
            'preco' => 10,
            'created_at' => $now,
            'updated_at' => $now,
        ], 'id_produto');
        $linkedAdditionalId = DB::table('adicional')->insertGetId([
            'nome' => 'Adicional vinculado',
            'preco' => 2,
            'ativo' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ], 'id_adicional');
        $unrelatedAdditionalId = DB::table('adicional')->insertGetId([
            'nome' => 'Adicional não vinculado',
            'preco' => 1,
            'ativo' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ], 'id_adicional');

        DB::table('produto_adicional')->insert([
            'id_produto' => $configuredProductId,
            'id_adicional' => $linkedAdditionalId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $migration->up();

        $this->assertDatabaseHas('produto', [
            'id_produto' => $configuredProductId,
            'adicionais_configurados' => true,
        ]);
        $this->assertDatabaseHas('produto', [
            'id_produto' => $legacyProductId,
            'adicionais_configurados' => false,
        ]);

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $configuredProductId,
            'adicionais' => [[
                'adicional_id' => $unrelatedAdditionalId,
                'quantidade' => 1,
            ]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('adicionais');

        $this->postJson('/api/carrinho/adicionar', [
            'produto_id' => $legacyProductId,
            'adicionais' => [[
                'adicional_id' => $unrelatedAdditionalId,
                'quantidade' => 1,
            ]],
        ])->assertCreated();
    }
}
