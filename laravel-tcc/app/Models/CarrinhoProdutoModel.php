<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarrinhoProduto extends Model
{
    use HasFactory;

    protected $table = 'carrinho_produto';

    protected $fillable = [
        'carrinho_id',
        'produto_id',
        'nome',
        'preco',
        'quantidade',
        'adicionais',
        'uid'
    ];

    protected $casts = [
        'adicionais' => 'array', // para converter JSON em array automaticamente
    ];
}
