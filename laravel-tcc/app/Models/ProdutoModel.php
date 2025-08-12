<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdutoModel extends Model
{
    use HasFactory;

    protected $table = 'produto';
    protected $primaryKey = 'id_produto';
    protected $fillable = ['nome', 'descricao', 'preco', 'imagem', 'id_categoria'];

    public function adicionais()
    {
        return $this->belongsToMany(
            AdicionalModel::class,
            'produto_adicional',
            'id_produto',
            'id_adicional'
        );
    }

    public function categoria()
    {
        return $this->belongsTo(CategoriaModel::class, 'id_categoria');
    }
}
