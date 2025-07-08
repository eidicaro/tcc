<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdicionaisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('adicional')->insert([
        [
            'nome' => 'tare 30ml',
            'preco' => 5.00,
            'imagem' => 'images/tare.webp'
        ],

        [
            'nome' => 'batata crispy',
            'preco' => 5.00,
            'imagem' => 'images/batata-crispy.webp'
        ],

        [
            'nome' => 'couve crispy',
            'preco' => 5.00,
            'imagem' => 'images/couve-crispy.webp'
        ],

        [
            'nome' => 'cream cheese',
            'preco' => 5.00,
            'imagem' => 'images/cream-cheese.webp'
        ],
        
        [
            'nome' => 'doritos',
            'preco' => 5.00,
            'imagem' => 'images/doritos.webp'
        ],

        [
            'nome' => 'geleia de pimenta 30ml',
            'preco' => 10.00,
            'imagem' => 'images/geleia-pimenta.webp'
        ],

        [
            'nome' => 'salmão em cubos extra 70g',
            'preco' => 20.00,
            'imagem' => 'images/salmao-cubos.webp'
        ],

        [
            'nome' => 'shoyu sache',
            'preco' => 1.50,
            'imagem' => 'images/shoyu-sache.webp'
        ],

        [
            'nome' => 'tare sache',
            'preco' => 2.00,
            'imagem' => 'images/tare-sache.webp'
        ],

        [
            'nome' => 'wasabi 20g',
            'preco' => 5.00,
            'imagem' => 'images/wasabi.webp'
        ],

        [
            'nome' => 'gengibre 20g',
            'preco' => 5.00,
            'imagem' => 'images/gengibre.webp'
        ],

        [
            'nome' => 'adaptador',
            'preco' => 1.00,
            'imagem' => 'images/adaptador.webp'
        ],

        [
            'nome' => 'par de hashi',
            'preco' => 1.00,
            'imagem' => 'images/hashi.webp'
        ],

        [
            'nome' => 'embalagem para viagem',
            'preco' => 2.00,
            'imagem' => 'images/embalagem.webp'
        ],

        [
            'nome' => 'cebolinha',
            'preco' => 3.00,
            'imagem' => 'images/cebolinha.webp'
        ],
    ]);
    }
}
