<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdicionalModel extends Model
{
     protected $table = 'adicional';
    protected $fillable = ['nome', 'preco', 'imagem'];
    use HasFactory;
}
