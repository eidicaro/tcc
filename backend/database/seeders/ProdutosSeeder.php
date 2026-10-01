<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdutosSeeder extends Seeder
{
    // Nome, descrição, preço ilustrativo, categoria. Todos os itens são fictícios.
    public const ITEMS = [
        ['Sunomono da Brisa', 'Pepino em conserva suave com gergelim tostado.', 16.90, 'Entradas'],
        ['Guioza do Porto', 'Seis guiozas de legumes com molho cítrico.', 27.90, 'Entradas'],
        ['Edamame Salgado', 'Vagens de soja com sal marinho.', 18.90, 'Entradas'],
        ['Combinado Maré Mansa (20 peças)', 'Uramakis, hossomakis e niguiris para compartilhar.', 62.90, 'Combinados'],
        ['Combinado Horizonte (32 peças)', 'Seleção variada de sushis e sashimis.', 94.90, 'Combinados'],
        ['Combinado Oceano (48 peças)', 'Peças clássicas e especiais para o grupo.', 139.90, 'Combinados'],
        ['Barca Maré de Nori (36 peças)', 'Seleção de salmão, pepino e manga.', 119.90, 'Especiais da Casa'],
        ['Uramaki Aurora (8 peças)', 'Salmão, cream cheese e toque de limão.', 32.90, 'Especiais da Casa'],
        ['Niguiri do Farol (6 peças)', 'Arroz temperado com lâminas de salmão.', 31.90, 'Sushis'],
        ['Hossomaki Jardim (8 peças)', 'Pepino fresco envolto em arroz e nori.', 24.90, 'Sushis'],
        ['Uramaki Sol Nascente (8 peças)', 'Manga, pepino e gergelim.', 26.90, 'Sushis'],
        ['Sashimi da Enseada (8 fatias)', 'Fatias de salmão servidas com limão.', 39.90, 'Sushis'],
        ['Temaki Costa Azul', 'Salmão, cebolinha e arroz no cone de nori.', 34.90, 'Temakis'],
        ['Temaki Jardim Japonês', 'Pepino, manga, gergelim e cream cheese.', 29.90, 'Temakis'],
        ['Temaki Brasa', 'Salmão grelhado, tarê e cebolinha.', 36.90, 'Temakis'],
        ['Hot Roll Ondas (8 peças)', 'Salmão e cream cheese empanados, com tarê.', 32.90, 'Hot Rolls'],
        ['Hot Roll Dourado (16 peças)', 'Rolinho crocante com toque cítrico.', 57.90, 'Hot Rolls'],
        ['Poke Maré Verde', 'Arroz, pepino, manga, edamame e gergelim.', 39.90, 'Pokes'],
        ['Poke Salmão do Porto', 'Salmão, arroz, cenoura e molho da casa.', 49.90, 'Pokes'],
        ['Poke Brisa Tropical', 'Arroz, manga, pepino e salmão grelhado.', 46.90, 'Pokes'],
        ['Mochi de Morango', 'Doce de arroz macio com recheio de morango.', 19.90, 'Sobremesas'],
        ['Harumaki de Banana', 'Dois rolinhos doces com canela.', 18.90, 'Sobremesas'],
        ['Chá Gelado da Casa', 'Chá preto com limão servido gelado.', 9.90, 'Bebidas'],
        ['Limonada com Gengibre', 'Limonada fresca com toque de gengibre.', 11.90, 'Bebidas'],
        ['Água Mineral', 'Garrafa de água mineral sem gás.', 5.90, 'Bebidas'],
    ];

    public function run(): void
    {
        $categoryIds = DB::table('categoria')
            ->whereIn('nome', CategoriaSeeder::NAMES)
            ->pluck('id_categoria', 'nome');

        foreach (self::ITEMS as $order => [$name, $description, $price, $category]) {
            $image = match ($category) {
                'Bebidas' => 'bebidas',
                'Sobremesas' => 'sobremesas',
                'Pokes' => 'pokes',
                'Entradas' => 'entradas',
                'Temakis' => 'temakis',
                default => 'sushi',
            };
            DB::table('produto')->updateOrInsert(
                ['nome' => $name],
                [
                    'descricao' => $description,
                    'preco' => $price,
                    'imagem' => "images/demo/{$image}.svg",
                    'id_categoria' => $categoryIds[$category],
                    'ativo' => true,
                    'disponivel' => true,
                    'destaque' => in_array($name, [
                        'Barca Maré de Nori (36 peças)',
                        'Combinado Maré Mansa (20 peças)',
                        'Poke Maré Verde',
                        'Hot Roll Ondas (8 peças)',
                    ], true),
                    'ordem' => $order + 1,
                    'deleted_at' => null,
                ]
            );
        }
    }
}
