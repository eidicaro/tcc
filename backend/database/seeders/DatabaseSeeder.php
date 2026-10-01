<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new \RuntimeException(
                'Seeders de demonstração não podem ser executadas em produção. Use migrate --force e admin:create.'
            );
        }

        $this->call([
            UsuariosSeeder::class,
            DemoCatalogSeeder::class,
        ]);
    }
}
