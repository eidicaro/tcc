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

            'nome' => 'CEVICHE TILÁPIA',
            'descricao' => '200 gramas de Tilápia em cubos, marinados, com cebola, cebolinha, temperos especiais e finalizado com azeite.',
            'preco' => 45.90,
            'imagem' => 'images/ceviche.webp'
        ],

        [
            'nome' => 'CEVICHE MISTO', 
            'descricao' => 'Cubos de salmão e tilápia, com cebola, cebolinha, marinados com temperos especiais e finalizado com azeite.', 
            'preco' => 45.90, 
            'imagem' => 'images/ceviche.webp'
        ],

        [
            'nome' => 'SUNOMONO', 
            'descricao' => 'Fatias finas de pepino, com molho especial da casa finalizado com gergelim (100 gramas).', 
            'preco' => 9.90, 
            'imagem' => 'images/sunomono.png'
        ],

        [
            'nome' => 'GUIOZA', 
            'descricao' => '4 unidade de Guioza frito ou a vapor,no sabor de sua escolha.', 
            'preco' => 19.90, 
            'imagem' => 'images/sunomono.png'
        ],

       [
        'nome' => 'HARUMAKI DE QUEIJO',
        'descricao' => '2 unidades de rolinho de queijo, acompanha molho especial.',
        'preco' => 18.00,
        'imagem' => ''
    ],
    [
        'nome' => 'SHIMEJI NA MANTEIGA',
        'descricao' => 'Shimeji na manteiga finalizado com cebolinha.',
        'preco' => 25.00,
        'imagem' => ''
    ],

    // Combinados

    [
        'nome' => 'COMBINADO 1 (16 PEÇAS)',
        'descricao' => '4 fatias de sashimi, 4 uramaki salmão com cream cheese, 8 unidades de hotholl finalizado com cream cheese, cebolinha, gergelim e tare da casa, acompanha 2 shoyu sachê, 1 tare sachê e 1 hashi.',
        'preco' => 52.00,
        'imagem' => ''
    ],
    [
        'nome' => 'COMBINADO 20',
        'descricao' => '4 niguiris de salmão cru, 8 uramaki de salmão com cream cheese, 8 hossomaki de pepino, acompanha 2 shoyu, 1 tare e 1 hashi.',
        'preco' => 49.90,
        'imagem' => ''
    ],
    [
        'nome' => 'COMBINADO 4',
        'descricao' => '8 niguiris, 8 jhow cream cheese, 8 uramaki salmão cream cheese, 8 hotholl doritos, 8 hotholl cebolinha.',
        'preco' => 129.90,
        'imagem' => ''
    ],
    [
        'nome' => 'COMBINADO 6 GRELHADOS',
        'descricao' => '5 niguiris sem cream cheese, 5 jhow cream cheese flambado, 5 uramaki de salmão grelhado, 5 hot holl couve crispy, 10 hot holl cebolinha, finalizado com gergelim e tare da casa. Acompanha 2 shoyu, 1 tare e 2 hashi.',
        'preco' => 80.00,
        'imagem' => ''
    ],
    [
        'nome' => 'COMBINADO 7',
        'descricao' => '5 niguiris de salmão cru, 5 jhow doritos, 5 uramaki salmão, 5 hot camarão, 10 hot cebolinha, finalizado com gergelim e tare da casa. Acompanha 2 hashi, 2 shoyu e 2 tare sachê.',
        'preco' => 75.00,
        'imagem' => ''
    ],
    [
        'nome' => 'COMBINADO PREMIUM',
        'descricao' => '4 sashimis, 4 niguiris, 4 jhow batidinho, 8 uramaki salmão, 4 hossomaki salmão. Acompanha 2 shoyu, 2 tare, 2 hashi.',
        'preco' => 84.90,
        'imagem' => ''
    ],
    [
        'nome' => 'COMBINADO TROPICAL',
        'descricao' => '2 niguiris salmão cru, 4 uramaki salmão, 8 uramaki california, 8 hossomaki pepino, 8 hossomaki kani, 10 hot holl couve crispy. Acompanha 2 hashi, 2 shoyu e 2 tare sachê.',
        'preco' => 79,90,
        'imagem' => ''
    ],

    // Especial da Casa

    [
        'nome' => 'BIG HOT HOLL',
        'descricao' => '1 hot recheado com salmão cru, cream cheese e cebolinha finalizado com gergelim e tare da casa. Acompanha 1 shoyu e 1 tare sachê.',
        'preco' => 50.00,
        'imagem' => ''
    ],
    [
        'nome' => 'POKE TONG',
        'descricao' => 'Shari, salmão, sunomono, batata e couve crispy, doritos, manga, gergelim, cream cheese, pimenta biquinho. Acompanha 1 shoyu, 1 tare e 1 hashi.',
        'preco' => 55.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HAMBÚRGUER DE SALMÃO',
        'descricao' => 'Hambúrguer de salmão, cream cheese, cebolinha, cebola, couve crispy e pimenta biquinho.',
        'preco' => 40.00,
        'imagem' => ''
    ],

    // Temaki
[
    'nome' => 'TEMAKI COMPLETO SALMÃO CRU',
    'descricao' => 'Arroz, salmão em cubos ou batido, com cream cheese, cebolinha. Acompanha 1 shoyu e 1 tare sachê.',
    'preco' => 38.00,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI SALMÃO COMPLETO GRELHADO',
    'descricao' => 'Arroz, salmão grelhado, cream cheese, cebolinha. Acompanha 1 shoyu e 1 tare sachê.',
    'preco' => 38.00,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI CALIFORNIA',
    'descricao' => 'Arroz, pepino, manga, kani e cream cheese. Acompanha 1 shoyu e 1 tare sachê.',
    'preco' => 30.00,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI GRELHADO E FRITO',
    'descricao' => 'Temaki de salmão grelhado e frito. Acompanha 1 shoyu e 1 tare.',
    'preco' => 45.00,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI CAMARÃO EMPANADO',
    'descricao' => 'Arroz, camarão empanado e frito, cream cheese e cebolinha. Acompanha 1 shoyu e 1 tare.',
    'preco' => 54,90,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI CAMARÃO EMPANADO E FRITO',
    'descricao' => 'Arroz, camarão empanado e frito. Acompanha 1 shoyu e 1 tare.',
    'preco' => 59,90,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI DOUBLE',
    'descricao' => '2 temakis slim cru com cream cheese e cebolinha. Acompanha 2 shoyu e 1 tare.',
    'preco' => 45.00,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI DOUBLE GRELHADO',
    'descricao' => '2 temakis de salmão grelhado slim com cebolinha. Acompanha 2 shoyu e 1 tare sachê.',
    'preco' => 45.90,
    'imagem' => ''
],
[
    'nome' => 'NANJOO',
    'descricao' => '2 temakis salmão cru com cream cheese, cebolinha e 8 hot holl couve crispy finalizado com tare da casa. Acompanha 2 shoyu e 2 tare sachê.',
    'preco' => 59.90,
    'imagem' => ''
],
[
    'nome' => 'TEMAKI+ HOT + REFRI 200 ML',
    'descricao' => '1 temaki slim grelhado e frito, 10 hot holls cebolinha, finalizado com gergelim e tare da casa, e 1 refri 200 ml. Acompanha 2 shoyu e 1 tare sachê.',
    'preco' => 55.00,
    'imagem' => ''
],

// Sushi Individual
    [
        'nome' => 'URAMAKI DE SALMÃO CRU (8 UNIDADES)',
        'descricao' => 'Nori, arroz, salmão cru, cream cheese, envolvido com gergelim. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare.',
        'preco' => 28.00,
        'imagem' => ''
    ],
    [
        'nome' => 'URAMAKI SALMÃO GRELHADO (8 UNIDADES)',
        'descricao' => 'Nori, arroz, salmão grelhado com cream cheese envolto com gergelim.',
        'preco' => 28.00,
        'imagem' => ''
    ],
    [
        'nome' => 'URAMAKI CAMARÃO (8 UNIDADES)',
        'descricao' => 'Nori, arroz, camarão empanado e cream cheese. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 32.00,
        'imagem' => ''
    ],
    [
        'nome' => 'URAMAKI CALIFÓRNIA (8 UNIDADES)',
        'descricao' => 'Nori, arroz, kani, manga, pepino e cream cheese. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 25.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOSSOMAKI DE SALMÃO (8 UNIDADES)',
        'descricao' => 'Nori, shari, salmão. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 25.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOSSOMAKI PEPINO (8 UNIDADES)',
        'descricao' => 'Shari, nori, pepino. 1 unidade cortada em 8 pedaços.',
        'preco' => 18.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOSSOMAKI KANI (8 UNIDADES)',
        'descricao' => 'Shari, nori, kani. 1 unidade cortada em 8 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 20.00,
        'imagem' => ''
    ],
    [
        'nome' => 'SASHIMI (5 UNIDADES)',
        'descricao' => '5 unidades de salmão fresco. Acompanha 1 shoyu sachê, 1 tare sachê e 1 hashi.',
        'preco' => 25.00,
        'imagem' => ''
    ],
    [
        'nome' => 'JHOW CREAM CHEESE (6 UNIDADES)',
        'descricao' => '6 unidades de jhow cream cheese e cebolinha.',
        'preco' => 30.00,
        'imagem' => ''
    ],
    [
        'nome' => 'JHOW COUVE (6 UNIDADES)',
        'descricao' => '6 unidades de jhow couve, finalizado com tare da casa. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 33.00,
        'imagem' => ''
    ],
    [
        'nome' => 'NIGUIRI (6 UNIDADES)',
        'descricao' => 'Niguiris de salmão cru. Acompanha 1 shoyu, 1 tare sachê e 1 hashi.',
        'preco' => 29,90,
        'imagem' => ''
    ],
    [
        'nome' => 'NIGUIRI TONG (6 UNIDADES)',
        'descricao' => '6 unidades de niguiris flambados, finalizado com geleia de pimenta e cebolinha. Acompanha 1 shoyu e 1 hashi.',
        'preco' => 31.90,
        'imagem' => ''
    ],
    [
        'nome' => 'JOY EBI FLAMBADO (6 UNIDADES)',
        'descricao' => '6 unidades de joy flambado, finalizado com cream cheese, camarão e tare da casa. Acompanha 1 shoyu, 1 tare e 1 hashi.',
        'preco' => 34.00,
        'imagem' => ''
    ],

// Hot Holl
    [
        'nome' => 'HOT HOLL CEBOLINHA (10 UNIDADES)',
        'descricao' => 'Arroz, nori, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha, gergelim e tare da casa. 1 unidade cortada em 10 pedaços.',
        'preco' => 30.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL MIX (10 UNIDADES)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha e doritos, gergelim e tare da casa. 1 unidade cortada em 10 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 32.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL COUVE CRISPY (10 UNIDADES)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com couve e tare da casa. 1 unidade cortada em 10 pedaços. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 32.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL CAMARÃO (10 UNIDADES)',
        'descricao' => 'Shari, nori, salmão grelhado finalizado com cream cheese e camarão, finalizado com tare da casa. Acompanha 1 hashi, 1 shoyu e 1 tare sachê.',
        'preco' => 37.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL CEBOLINHA (20 UNIDADES)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese e cebolinha, gergelim e tare da casa.',
        'preco' => 42.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL MIX (20 UNIDADES)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cebolinha e doritos, gergelim e tare da casa. 2 unidades cortadas em 20 pedaços. Acompanha 1 hashi, 2 shoyu e 1 tare sachê.',
        'preco' => 52.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL COUVE CRISPY (20 UNIDADES)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com cream cheese, couve e tare da casa. 2 unidades cortadas em 20 pedaços. Acompanha 1 hashi, 2 shoyu e 1 tare sachê.',
        'preco' => 44.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL GOURMET (20 UNIDADES)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com 4 unidades de pimenta biquinho, 4 unidades de geleia de pimenta, 4 unidades de couve crispy, 4 unidades de cebolinha e 4 unidades de doritos, finalizado com tare da casa. Acompanha 1 hashi, 2 shoyu e 1 tare sachê. 2 unidades cortadas em 20 pedaços.',
        'preco' => 55.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL DORITOS (20 UNIDADES)',
        'descricao' => '2 unidades cortadas em 20 pedaços de shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese, doritos, gergelim e tare da casa. Acompanha 1 hashi, 2 shoyu e 1 tare sachê.',
        'preco' => 55.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL CEBOLINHA (30 UNIDADES)',
        'descricao' => 'Shari, nori, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha, gergelim e tare da casa. 3 unidades cortadas em 30 pedaços. Acompanha 2 shoyu, 1 hashi e 1 tare sachê.',
        'preco' => 70.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL CEBOLINHA (40 UNIDADES)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com cream cheese, cebolinha, gergelim e tare da casa. 4 unidades cortadas em 40 pedaços. Acompanha 2 hashi, 2 shoyu e 2 tare sachê.',
        'preco' => 78.00,
        'imagem' => ''
    ],
    [
        'nome' => 'HOT HOLL MIX (40 UNIDADES)',
        'descricao' => 'Nori, shari, salmão grelhado empanado e frito, finalizado com cebolinha, doritos, gergelim e tare da casa. 4 unidades cortadas em 40 pedaços. Acompanha 1 hashi, 3 shoyu e 2 tare sachê.',
        'preco' => 85.00,
        'imagem' => ''
    ],

    //yakisoba 
[
    'nome' => 'YAKISOBA MISTO CARNE E FRANGO',
    'descricao' => 'Macarrão oriental frito com carne e frango flambado, brócolis, pimentões coloridos, acelga, cenoura, cebola e molho especial da casa finalizado com óleo de gergelim. Acompanha 1 hashi e 1 shoyu sachê. Peso aproximado: 800g.',
    'preco' => 55.00,
    'imagem' => ''
],

[
    'nome' => 'YAKISOBA SUPREMO',
    'descricao' => 'Macarrão oriental frito, carne, frango e camarão, brócolis, cenoura, acelga, pimentões coloridos e molho especial da casa finalizado com óleo de gergelim.',
    'preco' => 75.00,
    'imagem' => ''
],

[
    'nome' => 'YAKISOBA DE FRANGO',
    'descricao' => 'Macarrão frito, frango, brócolis, cenoura, acelga, pimentões coloridos, cebola e molho especial da casa finalizado com óleo de gergelim. Acompanha 1 sachê de shoyu e 1 hashi.',
    'preco' => 55.00,
    'imagem' => ''
],

[
    'nome' => 'YAKISOBA CAMARÃO',
    'descricao' => 'Macarrão frito, camarão, brócolis, cenoura, acelga, pimentões coloridos, cebola e molho especial da casa finalizado com óleo de gergelim. Acompanha 1 hashi e 1 shoyu sachê.',
    'preco' => 70.00,
    'imagem' => ''
],

//coxinhass
[
    'nome' => 'COXINHA DE FRANGO COM CATUPIRY',
    'descricao' => '1 unidade de 120g. Massa artesanal feita com leite e manteiga, recheada com frango desfiado e catupiry. Acompanha 1 sachê de ketchup e 1 de maionese.',
    'preco' => 12.00,
    'imagem' => ''
],

[
    'nome' => 'COXINHA DE CAMARÃO',
    'descricao' => '1 unidade de 120g. Massa artesanal feita com leite e manteiga, recheada com catupiry e camarão. Acompanha 1 sachê de ketchup e 1 de maionese.',
    'preco' => 15.00,
    'imagem' => ''
],

    ]);
    }
}

