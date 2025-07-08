<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProdutoModel extends Model
{
    protected $table = 'produto';
    protected $fillable = ['nome', 'descricao', 'preco', 'imagem'];
    use HasFactory;
    
}
