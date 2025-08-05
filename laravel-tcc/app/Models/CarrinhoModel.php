<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrinho extends Model
{
    protected $table = 'carrinho';
    protected $primaryKey = 'id_carrinho';

    protected $fillable = [
        'id_cliente',
        'data_criacao'
    ];
}
