<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ProdutosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            DB::table('produto')->insert([
        ['nome' => 'sunomono', 'descricao' => 'Salada agridoce de pepino com gergelim.', 'preco' => 18.91],
        ['nome' => 'sunomono', 'descricao' => 'Salada agridoce de pepino com gergelim.', 'preco' => 18.91],
        ['nome' => 'sunomono', 'descricao' => 'Salada agridoce de pepino com gergelim.', 'preco' => 18.91],
        ['nome' => 'Hot Roll', 'descricao' => 'Sushi empanado e frito.', 'preco' => 25.50],
    ]);
    }
}

