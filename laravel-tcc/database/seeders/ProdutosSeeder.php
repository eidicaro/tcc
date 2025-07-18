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
        [
            'nome' => 'CEVICHE TILÁPIA',
            'descricao' => 'Bagui com peice cru.',
            'preco' => 20.50,
            'imagem' => 'images/ceviche.webp'
        ],
        [
            'nome' => 'sunomono', 
            'descricao' => 'Salada agridoce de pepino com gergelim.', 
            'preco' => 18.91, 
            'imagem' => 'images/ceviche.webp'
        ],
        [
            'nome' => 'sunomono', 
            'descricao' => 'Salada agridoce de pepino com gergelim.', 
            'preco' => 18.91, 
            'imagem' => 'images/sunomono.png'
        ],
        [
            'nome' => 'sunomono', 
            'descricao' => 'Salada agridoce de pepino com gergelim.', 
            'preco' => 18.91, 
            'imagem' => 'images/ceviche.webp'
        ],
        [
            'nome' => 'Hot Roll', 
            'descricao' => 'Sushi empanado e frito.', 
            'preco' => 25.50, 'imagem' => 'images/ceviche.webp'
        ],
        [
            'nome' => 'Temaki de Salmao Grelhado', 
            'descricao' => 'Sushi empanado e frito.', 
            'preco' => 40.50, 
            'imagem' => 'images/ceviche.webp'
        ],
        [
            'nome' => 'Temaki de Salmao Grelhado', 
            'descricao' => 'Sushi empanado e frito.', 
            'preco' => 40.50, 
            'imagem' => 'images/ceviche.webp'
        ]
    ]);
    }
}

