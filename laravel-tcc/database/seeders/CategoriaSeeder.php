<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
         DB::table('categoria')->insert([
        [
            'nome' => 'Entradas'
        ],

        [
            'nome' => 'Combinados'
        ],

        [
            'nome' => 'Especial da Casa'
        ],

        [
            'nome' => 'Sushis'
        ],

        [
            'nome' => 'Temakis'
        ],

        [
            'nome' => 'Hot Rolls'
        ],

        [
            'nome' => 'Yakisoba'
        ],

        [
            'nome' => 'coxinhas'
        ],

        [
            'nome' => 'Bebidas'
        ]

    ]);
    }
}
