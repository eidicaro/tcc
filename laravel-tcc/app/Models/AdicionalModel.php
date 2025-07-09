<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdicionalModel extends Model
{
    protected $table = 'adicional';
    protected $fillable = ['nome', 'preco', 'imagem'];
    protected $primaryKey = 'id_adicional';
    use HasFactory;

    public function produtos()
    {
        return $this->belongsToMany(
            ProdutoModel::class,
            'produto_adicional',
            'id_adicional',
            'id_produto'
        );
    }
}
