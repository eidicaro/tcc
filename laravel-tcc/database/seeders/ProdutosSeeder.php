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
            //Entradas

            'nome' => 'Ceviche Tilápia',
            'descricao' => '200 gramas de Tilápia em cubos, marinados, com cebola, cebolinha, temperos especiais e finalizado com azeite.',
            'preco' => 49.90,
            'imagem' => 'images/ceviche.webp',
            'id_categoria' => 1 // <- Entradas
        ],

        [
            'nome' => 'Ceviche Misto', 
            'descricao' => 'Cubos de salmão e tilápia, com cebola, cebolinha, marinados com temperos especiais e finalizado com azeite.', 
            'preco' => 45.90, 
            'imagem' => 'images/cevichemisto.jpg',
            'id_categoria' => 1 // <- Entradas
        ],

        [
            'nome' => 'Sunomono', 
            'descricao' => 'Fatias finas de pepino, com molho especial da casa finalizado com gergelim (100 gramas).', 
            'preco' => 9.90, 
            'imagem' => 'images/sunomonoo.png',
            'id_categoria' => 1 // <- Entradas
        ],

        [
            'nome' => 'Guioza', 
            'descricao' => '4 unidade de Guioza frito ou a vapor,no sabor de sua escolha.', 
            'preco' => 19.90, 
            'imagem' => 'images/guioza.png',
            'id_categoria' => 1 // <- Entradas
        ],

       [
        'nome' => 'Harumaki De Queijo',
        'descricao' => '2 unidades de rolinho de queijo, acompanha molho especial.',
        'preco' => 18.00,
        'imagem' => 'images/harumakidequeijo.png',
        'id_categoria' => 1 // <- Entradas
    ],
    [
        'nome' => 'Shimeji Na Manteiga',
        'descricao' => 'Shimeji na manteiga finalizado com cebolinha.',
        'preco' => 25.00,
        'imagem' => 'images/shimejinamanteiga.jfif',
        'id_categoria' => 1 // <- Entradas
    ],

    // Combinados

    [
        'nome' => 'Combinado 1 (16 Peças)',
        'descricao' => '4 fatias de sashimi, 4 uramaki salmão com cream cheese, 8 unidades de hotholl finalizado com cream cheese, cebolinha, gergelim e tare da casa, acompanha 2 shoyu sachê, 1 tare sachê e 1 hashi.',
        'preco' => 52.00,
        'imagem' => 'images/combinado1.png',
        'id_categoria' => 2 // <- Comninados
    ],
    [
        'nome' => 'Combinado 20',
        'descricao' => '4 niguiris de salmão cru, 8 uramaki de salmão com cream cheese, 8 hossomaki de pepino, acompanha 2 shoyu, 1 tare e 1 hashi.',
        'preco' => 49.90,
        'imagem' => 'images/combinado-20.jpg',
        'id_categoria' => 2 // <- Comninados
    ],
    [
        'nome' => 'Combinado 4',
        'descricao' => '8 niguiris, 8 jhow cream cheese, 8 uramaki salmão cream cheese, 8 hotholl doritos, 8 hotholl cebolinha.',
        'preco' => 129.90,
        'imagem' => 'images/combinado4.png',
        'id_categoria' => 2 // <- Comninados
    ],
    [
        'nome' => 'Combinado 6 Grelhados',
        'descricao' => '5 niguiris sem cream cheese, 5 jhow cream cheese flambado, 5 uramaki de salmão grelhado, 5 hot holl couve crispy, 10 hot holl cebolinha, finalizado com gergelim e tare da casa. Acompanha 2 shoyu, 1 tare e 2 hashi.',
        'preco' => 80.00,
        'imagem' => 'images/combinado6.png',
        'id_categoria' => 2 // <- Comninados
    ],
    [
        'nome' => 'Combinado 7',
        'descricao' => '5 niguiris de salmão cru, 5 jhow doritos, 5 uramaki salmão, 5 hot camarão, 10 hot cebolinha, finalizado com gergelim e tare da casa. Acompanha 2 hashi, 2 shoyu e 2 tare sachê.',
        'preco' => 75.00,
        'imagem' => 'images/combinado7.png',
        'id_categoria' => 2 // <- Comninados
    ],
    [
        'nome' => 'Combinado Premium',
        'descricao' => '4 sashimis, 4 niguiris, 4 jhow batidinho, 8 uramaki salmão, 4 hossomaki salmão. Acompanha 2 shoyu, 2 tare, 2 hashi.',
        'preco' => 84.90,
        'imagem' => 'images/combinadopremium.png',
        'id_categoria' => 2 // <- Comninados
    ],
    [
        'nome' => 'Combinado Tropical',
        'descricao' => '2 niguiris salmão cru, 4 uramaki salmão, 8 uramaki california, 8 hossomaki pepino, 8 hossomaki kani, 10 hot holl couve crispy. Acompanha 2 hashi, 2 shoyu e 2 tare sachê.',
        'preco' => 79.90,
        'imagem' => 'images/combinadotropical.png',
        'id_categoria' => 2 // <- Comninados
    ],

    // Especial da Casa

    [
        'nome' => 'Big Hot Holl',
        'descricao' => '1 hot recheado com salmão cru, cream cheese e cebolinha finalizado com gergelim e tare da casa. Acompanha 1 shoyu e 1 tare sachê.',
        'preco' => 50.00,
        'imagem' => 'images/bighotholl.png',
        'id_categoria' => 3 // <- Especial
    ],
    [
        'nome' => 'Poke Tong',
        'descricao' => 'Shari, salmão, sunomono, batata e couve crispy, doritos, manga, gergelim, cream cheese, pimenta biquinho. Acompanha 1 shoyu, 1 tare e 1 hashi.',
        'preco' => 55.00,
        'imagem' => 'images/hamburguer.jfif',
        'id_categoria' => 3 // <- Especial
    ],
    [
        'nome' => 'Hambúrguer Salmão',
        'descricao' => 'Hambúrguer de salmão, cream cheese, cebolinha, cebola, couve crispy e pimenta biquinho.',
        'preco' => 40.00,
        'imagem' => 'images/poketong.png',
        'id_categoria' => 3 // <- Especial
    ],

    // Temaki
[
    'nome' => 'Temaki Completo Salmão Cru',
    'descricao' => 'Arroz, salmão em cubos ou batido, com cream cheese, cebolinha. Acompanha 1 shoyu e 1 tare sachê.',
    'preco' => 38.00,
    'imagem' => 'images/TEMAKICOMPLETOSALMÃOCRU.jfif',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki Completo Salmão Grelado',
    'descricao' => 'Arroz, salmão grelhado, cream cheese, cebolinha. Acompanha 1 shoyu e 1 tare sachê.',
    'preco' => 38.00,
    'imagem' => 'images/salmaogrelhado.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki California',
    'descricao' => 'Arroz, pepino, manga, kani e cream cheese. Acompanha 1 shoyu e 1 tare sachê.',
    'preco' => 30.00,
    'imagem' => 'images/california.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki Grelhado E Frito',
    'descricao' => 'Temaki de salmão grelhado e frito. Acompanha 1 shoyu e 1 tare.',
    'preco' => 45.00,
    'imagem' => 'images/grelhadoefrito.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki Camarão Empanado',
    'descricao' => 'Arroz, camarão empanado e frito, cream cheese e cebolinha. Acompanha 1 shoyu e 1 tare.',
    'preco' => 54.90,
    'imagem' => 'images/camaraoempanado.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki Camarão Empanado e Frito',
    'descricao' => 'Arroz, camarão empanado e frito. Acompanha 1 shoyu e 1 tare.',
    'preco' => 59.90,
    'imagem' => 'images/camaraoempanado.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki Double',
    'descricao' => '2 temakis slim cru com cream cheese e cebolinha. Acompanha 2 shoyu e 1 tare.',
    'preco' => 45.00,
    'imagem' => 'images/double.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki Double Grelhado',
    'descricao' => '2 temakis de salmão grelhado slim com cebolinha. Acompanha 2 shoyu e 1 tare sachê.',
    'preco' => 45.90,
    'imagem' => 'images/temakidoublegrlhado.jpg',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Nanjoo',
    'descricao' => '2 temakis salmão cru com cream cheese, cebolinha e 8 hot holl couve crispy finalizado com tare da casa. Acompanha 2 shoyu e 2 tare sachê.',
    'preco' => 59.90,
    'imagem' => 'images/nanjoo.png',
    'id_categoria' => 5 // <- Temaki
],
[
    'nome' => 'Temaki+ Hot + Refri 200 Ml',
    'descricao' => '1 temaki slim grelhado e frito, 10 hot holls cebolinha, finalizado com gergelim e tare da casa, e 1 refri 200 ml. Acompanha 2 shoyu e 1 tare sachê.',
    'preco' => 55.00,
    'imagem' => 'images/temakimaishot.jfif',
    'id_categoria' => 5 // <- Temaki
],

// Sushi Individual
    [
        'nome' => 'Uramaki Salmão Cru (8 Unidades)',
        'descricao' => 'Nori, arroz, salmão cru, cream cheese, envolvido com gergelim. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare.',
        'preco' => 28.00,
        'imagem' => 'images/urumakisalmaocru8.jpg',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Uramaki Salmão Grelhado (8 Unidades)',
        'descricao' => 'Nori, arroz, salmão grelhado com cream cheese envolto com gergelim.',
        'preco' => 28.00,
        'imagem' => 'images/urumakisalmaogrelhado8.jpg',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Uramaki Camarão (8 Unidades)',
        'descricao' => 'Nori, arroz, camarão empanado e cream cheese. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 32.00,
        'imagem' => 'images/urumakicamarao8.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Uramaki Califórnia (8 Unidades)',
        'descricao' => 'Nori, arroz, kani, manga, pepino e cream cheese. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 25.00,
        'imagem' => 'images/urumakicalifornia8.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Hossomaki de Salmão (8 Unidades)',
        'descricao' => 'Nori, shari, salmão. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 25.00,
        'imagem' => 'images/hossomakisalmao8.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Hossomaki Pepino (8 Unidades)',
        'descricao' => 'Shari, nori, pepino. 1 unidade cortada em 8 pedaços.',
        'preco' => 18.00,
        'imagem' => 'images/hossomakipepino8.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Hossomaki Kani (8 Unidades)',
        'descricao' => 'Shari, nori, kani. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 20.00,
        'imagem' => 'images/hossomakikani8.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Sashimi (5 Unidades)',
        'descricao' => '5 unidades de salmão fresco. Acompanha 1 shoyu sachê, 1 tare sachê e 1 hashi.',
        'preco' => 25.00,
        'imagem' => 'images/sashimi5.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Jhow Cream Cheese (6 Unidades)',
        'descricao' => '6 unidades de jhow cream cheese e cebolinha.',
        'preco' => 30.00,
        'imagem' => 'images/jhowcreamcheese6.jfif',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Jhow Couve (6 Unidades)',
        'descricao' => '6 unidades de jhow couve, finalizado com tare da casa. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 33.00,
        'imagem' => 'images/jhowcouve6.jfif',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Niguiri (6 Unidades)',
        'descricao' => 'Niguiris de salmão cru. Acompanha 1 shoyu, 1 tare sachê e 1 hashi.',
        'preco' => 29.90,
        'imagem' => 'images/niguiri6.jfif',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Niguiri Tong (6 Unidades)',
        'descricao' => '6 unidades de niguiris flambados, finalizado com geleia de pimenta e cebolinha. Acompanha 1 shoyu e 1 hashi.',
        'preco' => 31.90,
        'imagem' => 'images/niguiritong.png',
        'id_categoria' => 4 // <- Sushi
    ],
    [
        'nome' => 'Joy Ebi Flambado (6 Unidades)',
        'descricao' => '6 unidades de joy flambado, finalizado com cream cheese, camarão e tare da casa. Acompanha 1 shoyu, 1 tare e 1 hashi.',
        'preco' => 34.00,
        'imagem' => 'images/joyebi.png',
        'id_categoria' => 4 // <- Sushi
    ],

// Hot Holl
    [
        'nome' => 'Hot Holl Cebolinha (10 Unidades)',
        'descricao' => 'Arroz, nori, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha, gergelim e tare da casa. 1 unidade cortada em 10 pedaços.',
        'preco' => 30.00,
        'imagem' => 'images/hothollcebolinha10.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Mix (10 Unidades)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha e doritos, gergelim e tare da casa. 1 unidade cortada em 10 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 32.00,
        'imagem' => 'images/hothollmix10.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Couve Crispy (10 Unidades)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com couve e tare da casa. 1 unidade cortada em 10 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 32.00,
        'imagem' => 'images/hothollcouvecrispy10.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Camarão (10 Unidades)',
        'descricao' => 'Shari, nori, salmão grelhado finalizado com cream cheese e camarão, finalizado com tare da casa. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 37.00,
        'imagem' => 'images/hothollcamarão10.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Cebolinha (20 Unidades)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese e cebolinha, gergelim e tare da casa.',
        'preco' => 42.00,
        'imagem' => 'images/hothollcebolinha20.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Mix (20 Unidades)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cebolinha e doritos, gergelim e tare da casa. 2 unidades cortadas em 20 pedaços. Acompanha 1 hashi, 2 shoyu e 1 tare sachê.',
        'preco' => 52.00,
        'imagem' => 'images/hothollmix20.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Couve Crispy (20 Unidades)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com cream cheese, couve e tare da casa. 2 unidades cortadas em 20 pedaços. Acompanha 1 hashi, 2 shoyu e 1 tare sachê.',
        'preco' => 44.00,
        'imagem' => 'images/hothollcouvecrispy10.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Gourmet (20 Unidades)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com 4 unidades de pimenta biquinho, 4 unidades de geleia de pimenta, 4 unidades de couve crispy, 4 unidades de cebolinha e 4 unidades de doritos, finalizado com tare da casa. Acompanha 1 hashi, 2 shoyu e 1 tare sachê. 2 unidades cortadas em 20 pedaços.',
        'preco' => 55.00,
        'imagem' => 'images/hothollgourmet20.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Doritos (20 Unidades)',
        'descricao' => '2 unidades cortadas em 20 pedaços de shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese, doritos, gergelim e tare da casa. Acompanha 1 hashi, 2 shoyu e 1 tare sachê.',
        'preco' => 55.00,
        'imagem' => 'images/hotholldoritos20.webp',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Cebolinha (30 Unidades)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha, gergelim e tare da casa. 3 unidades cortadas em 30 pedaços. Acompanha 2 shoyu, 1 hashi e 1 tare sachê.',
        'preco' => 70.00,
        'imagem' => 'images/hothollcebolinha20.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Cebolinha (40 Unidades)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha, gergelim e tare da casa. 4 unidades cortadas em 40 pedaços. Acompanha 2 hashi, 2 shoyu e 2 tare sachê.',
        'preco' => 78.00,
        'imagem' => 'images/hothollcebolinha40.png',
        'id_categoria' => 6 // <- hot roll
    ],
    [
        'nome' => 'Hot Holl Mix (40 Unidades)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com cebolinha, doritos, gergelim e tare da casa. 4 unidades cortadas em 40 pedaços. Acompanha 1 hashi, 3 shoyu e 2 tare sachê.',
        'preco' => 85.00,
        'imagem' => 'images/hothollmix40.png',
        'id_categoria' => 6 // <- hot roll
    ],

    //yakisoba 
[
    'nome' => 'Yakisoba Misto Carne E Frango',
    'descricao' => 'Macarrão oriental frito com carne e frango flambado, brócolis, pimentões coloridos, acelga, cenoura, cebola e molho especial da casa finalizado com óleo de gergelim. Acompanha 1 hashi e 1 shoyu sachê. Peso aproximado: 800g.',
    'preco' => 55.00,
    'imagem' => 'images/yakisobamisto.jfif',
    'id_categoria' => 7 // <- yakisoba
],

[
    'nome' => 'Yakisoba Supremo',
    'descricao' => 'Macarrão oriental frito, carne, frango e camarão, brócolis, cenoura, acelga, pimentões coloridos e molho especial da casa finalizado com óleo de gergelim.',
    'preco' => 75.00,
    'imagem' => 'images/yakisobasupremo.jfif',
    'id_categoria' => 7 // <- yakisoba
],

[
    'nome' => 'Yakisoba De Frango',
    'descricao' => 'Macarrão frito, frango, brócolis, cenoura, acelga, pimentões coloridos, cebola e molho especial da casa finalizado com óleo de gergelim. Acompanha 1 sachê de shoyu e 1 hashi.',
    'preco' => 55.00,
    'imagem' => 'images/yakisobafrango.jfif',
    'id_categoria' => 7 // <- yakisoba
],

[
    'nome' => 'Yakisoba Camarão',
    'descricao' => 'Macarrão frito, camarão, brócolis, cenoura, acelga, pimentões coloridos, cebola e molho especial da casa finalizado com óleo de gergelim. Acompanha 1 hashi e 1 shoyu sachê.',
    'preco' => 70.00,
    'imagem' => 'images/yakisobacamarao.jpg',
    'id_categoria' => 7 // <- yakisoba
],

//coxinhass
[
    'nome' => 'Coxinha De Frango Com Catupiry',
    'descricao' => '1 unidade de 120g. Massa artesanal feita com leite e manteiga, recheada com frango desfiado e catupiry. Acompanha 1 sachê de ketchup e 1 de maionese.',
    'preco' => 12.00,
    'imagem' => 'images/coxinhafrango.jfif',
    'id_categoria' => 8 // <- coxinhas
],

[
    'nome' => 'Coxinha de Camarão',
    'descricao' => '1 unidade de 120g. Massa artesanal feita com leite e manteiga, recheada com catupiry e camarão. Acompanha 1 sachê de ketchup e 1 de maionese.',
    'preco' => 15.00,
    'imagem' => 'images/coxinhacamarao.jfif',
    'id_categoria' => 8 // <- coxinhas
],

// //bebidas 

 [
    'nome' => 'Coca Cola lata 350ML',
    'descricao' => 'refri',
    'preco' => 7.00,
    'imagem' => 'images/coca350ml.jpg',
    'id_categoria' => '9',
],

    [
        'nome' => 'Coca Zero 350ML',
        'descricao' => 'refri',
        'preco' => 7.00,
        'imagem' => 'images/cocazero350.png',
        'id_categoria' => '9',
    ],
    [
        'nome' => 'Fanta uva lata 350ML',
        'descricao' => 'refri',
        'preco' => 7.00,
        'imagem' => 'images/fantalaranja350.jpg',
        'id_categoria' => '9',
    ],
    [
        'nome' => 'Fanta laranja 350ML',
        'descricao' => 'refri',
        'preco' => 7.00,
        'imagem' => 'images/fantauva350.jpg',
        'id_categoria' => '9',
    ],
    [
        'nome' => 'Sprite 350ML',
        'descricao' => 'refri',
        'preco' => 7.00,
        'imagem' => 'images/sprite.webp',
        'id_categoria' => '9',
    ],
    [
        'nome' => 'Guarana Fanta 350ML',
        'descricao' => 'refri',
        'preco' => 6.00,
        'imagem' => 'images/guarana350.jpg',
        'id_categoria' => '9',
    ],
    [
        'nome' => 'Schweppes Citrus 350ML',
        'descricao' => 'refri',
        'preco' => 7.00,
        'imagem' => 'images/Schweppes.webp',
        'id_categoria' => '9',
    ],
    // [
    //     'nome' => 'Guaraná Antártica 350ML',
    //     'descricao' => 'refri',
    //     'preco' => 7.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Suco Delvale Uva 290ML',
    //     'descricao' => 'refri',
    //     'preco' => 7.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Suco Delvalle Pessego 290ML',
    //     'descricao' => 'refri',
    //     'preco' => 7.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Mini Coca 200ML',
    //     'descricao' => 'refri',
    //     'preco' => 3.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Coca Cola Origiral 1,5L',
    //     'descricao' => 'refri',
    //     'preco' => 12.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Coca Cola 2 LITROS',
    //     'descricao' => 'refri',
    //     'preco' => 15.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Coca Cola Zero 2 LITROS',
    //     'descricao' => 'refri',
    //     'preco' => 15.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Fanta Laranja 2 LITROS',
    //     'descricao' => 'refri',
    //     'preco' => 12.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Fanta Uva 2 LITROS',
    //     'descricao' => 'refri',
    //     'preco' => 12.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Kuat 2 LITROS',
    //     'preco' => 12.00,
    //     'descricao' => 'refri',
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Suco Del Valle Frut Sabor Uva 450ML',
    //     'preco' => 8.00,
    //     'descricao' => 'refri',
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Sprite Lemon Fresh',
    //     'descricao' => 'refri',
    //     'preco' => 8.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'H20 Limoneto',
    //     'descricao' => 'refri',
    //     'preco' => 8.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'H20 Citrus',
    //     'descricao' => 'refri',
    //     'preco' => 8.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Água sem gás 350ML',
    //     'descricao' => 'refri',
    //     'preco' => 4.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Água com gás',
    //     'descricao' => 'refri',
    //     'preco' => 5.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Cerveja Heineken Long Neck 330ML',
    //     'descricao' => 'refri',
    //     'preco' => 12.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Cerveja Therezópolis Gold 355ML',
    //     'descricao' => 'refri',
    //     'preco' => 12.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Cerveja Therezópolis Elfenbein 500ML',
    //     'descricao' => 'refri',
    //     'preco' => 15.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ],
    // [
    //     'nome' => 'Cerveja Skol lata 350ML',
    //     'descricao' => 'refri',
    //     'preco' => 8.00,
    //     'imagem' => 'images/',
    //     'id_categoria' => '9',
    // ] 


//DOCES
// [
//     'nome' => 'Harumaki de Chocolate 2 unidades',
//     'descricao' => 'doce',
//     'preco' => 20.00,
//     'imagem' => 'doce',
//     'id_categoria' => 'doce',
// ],
// [
//     'nome' => 'Harumaki Romeu e Julieta 2 UnidadeS',
//     'descricao' => 'doce',
//     'preco' => 20.00,
//     'imagem' => 'doce',
//     'id_categoria' => 'doce',
// ],
    ]);
    }
}

