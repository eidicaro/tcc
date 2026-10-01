<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdicionaisSeeder extends Seeder
{
    public const ITEMS = [
        ['Molho tarê da casa', 3.50], ['Cream cheese extra', 5.00],
        ['Gergelim torrado', 2.00], ['Wasabi', 2.50],
        ['Gengibre em conserva', 2.50], ['Shoyu', 2.00],
        ['Salmão extra (50 g)', 12.00], ['Par de hashis', 1.00],
    ];

    public function run(): void
    {
        foreach (self::ITEMS as $order => [$name, $price]) {
            DB::table('adicional')->updateOrInsert(
                ['nome' => $name],
                [
                    'preco' => $price,
                    'imagem' => 'images/demo/adicionais.svg',
                    'ativo' => true,
                    'ordem' => $order + 1,
                    'deleted_at' => null,
                ]
            );
        }
    }
}
