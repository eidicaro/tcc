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
            'imagem' => 'images/tare.png'
        ],

        [
            'nome' => 'batata crispy',
            'preco' => 5.00,
            'imagem' => 'images/batata_crispy.jpeg'
        ],

        [
            'nome' => 'couve crispy',
            'preco' => 5.00,
            'imagem' => 'images/couve_crispy.jpeg'
        ],

        [
            'nome' => 'cream cheese',
            'preco' => 5.00,
            'imagem' => 'images/cream_cheese.jpeg'
        ],
        
        [
            'nome' => 'doritos',
            'preco' => 5.00,
            'imagem' => 'images/doritos.jpeg'
        ],

        [
            'nome' => 'geleia de pimenta 30ml',
            'preco' => 10.00,
            'imagem' => 'images/geleia_de_pimenta.jpeg'
        ],

        [
            'nome' => 'salmão em cubos extra 70g',
            'preco' => 20.00,
            'imagem' => 'images/salmao_cubos.jpeg'
        ],

        [
            'nome' => 'shoyu sache',
            'preco' => 1.50,
            'imagem' => 'images/sache_shoyu.png'
        ],

        [
            'nome' => 'tare sache',
            'preco' => 2.00,
            'imagem' => 'images/sache_tare.png'
        ],

        [
            'nome' => 'wasabi 20g',
            'preco' => 5.00,
            'imagem' => 'images/wasabi.png'
        ],

        [
            'nome' => 'gengibre 20g',
            'preco' => 5.00,
            'imagem' => 'images/gengibre.png'
        ],

        [
            'nome' => 'adaptador',
            'preco' => 1.00,
            'imagem' => 'images/adaptador.png'
        ],

        [
            'nome' => 'par de hashi',
            'preco' => 1.00,
            'imagem' => 'images/hashi.png'
        ],

        [
            'nome' => 'embalagem para viagem',
            'preco' => 2.00,
            'imagem' => 'images/embalagem.webp'
        ],

        [
            'nome' => 'cebolinha',
            'preco' => 3.00,
            'imagem' => 'images/cebolinha.jpeg'
        ],
    ]);
    }
}
