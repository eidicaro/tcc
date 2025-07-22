<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProdutoModel extends Model
{
    protected $table = 'produto';
    protected $fillable = ['nome', 'descricao', 'preco', 'imagem'];
    protected $primaryKey = 'id_produto';
    use HasFactory;

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

