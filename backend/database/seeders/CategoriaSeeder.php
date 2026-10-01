<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public const NAMES = [
        'Entradas', 'Combinados', 'Especiais da Casa', 'Sushis',
        'Temakis', 'Hot Rolls', 'Pokes', 'Sobremesas', 'Bebidas',
    ];

    public function run(): void
    {
        foreach (self::NAMES as $order => $name) {
            DB::table('categoria')->updateOrInsert(
                ['nome' => $name],
                ['ativo' => true, 'ordem' => $order + 1, 'deleted_at' => null]
            );
        }
    }
}
