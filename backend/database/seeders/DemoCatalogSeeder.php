<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoCatalogSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            // Preserva os registros antigos para o histórico dos pedidos.
            DB::table('produto')->where('ativo', true)->update(['ativo' => false]);
            DB::table('adicional')->where('ativo', true)->update(['ativo' => false]);
            DB::table('categoria')->where('ativo', true)->update(['ativo' => false]);

            $this->call([
                CategoriaSeeder::class,
                AdicionaisSeeder::class,
                ProdutosSeeder::class,
            ]);
        });
    }
}
