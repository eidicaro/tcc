<?php

namespace Tests\Feature;

use Database\Seeders\AdicionaisSeeder;
use Database\Seeders\CategoriaSeeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\ProdutosSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_local_seeders_can_run_twice_without_duplicating_example_data(): void
    {
        $this->seed(DatabaseSeeder::class);

        $firstRun = [
            'users' => DB::table('users')->count(),
            'categories' => DB::table('categoria')->count(),
            'additionals' => DB::table('adicional')->count(),
            'products' => DB::table('produto')->count(),
        ];

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($firstRun['users'], DB::table('users')->count());
        $this->assertSame($firstRun['categories'], DB::table('categoria')->count());
        $this->assertSame($firstRun['additionals'], DB::table('adicional')->count());
        $this->assertSame($firstRun['products'], DB::table('produto')->count());
        $this->assertSame(count(ProdutosSeeder::ITEMS), $firstRun['products']);
        $this->assertSame(count(CategoriaSeeder::NAMES), $firstRun['categories']);
        $this->assertSame(count(AdicionaisSeeder::ITEMS), $firstRun['additionals']);
        $this->assertDatabaseHas('produto', ['nome' => 'Barca Maré de Nori (36 peças)', 'ativo' => true]);
    }

    public function test_demo_seeding_retires_old_catalog_without_erasing_records(): void
    {
        DB::table('categoria')->insert(['nome' => 'Categoria antiga', 'ativo' => true]);
        $categoryId = DB::table('categoria')->where('nome', 'Categoria antiga')->value('id_categoria');
        DB::table('produto')->insert([
            'nome' => 'Produto antigo',
            'preco' => 10,
            'id_categoria' => $categoryId,
            'ativo' => true,
        ]);

        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('categoria', ['nome' => 'Categoria antiga', 'ativo' => false]);
        $this->assertDatabaseHas('produto', ['nome' => 'Produto antigo', 'ativo' => false]);
        $this->assertDatabaseHas('produto', ['nome' => 'Barca Maré de Nori (36 peças)', 'ativo' => true]);
    }
}
