<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Entradas',
            'Combinados',
            'Especial da Casa',
            'Sushis',
            'Temakis',
            'Hot Rolls',
            'Yakisoba',
            'Coxinhas',
            'Bebidas',
        ];

        foreach ($categories as $order => $name) {
            DB::table('categoria')->updateOrInsert(
                ['nome' => $name],
                ['ativo' => true, 'ordem' => $order + 1, 'deleted_at' => null]
            );
        }
    }
}
