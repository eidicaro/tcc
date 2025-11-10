<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdicionalModel extends Model
{
    use HasFactory;

    protected $table = 'adicional';
    protected $primaryKey = 'id_adicional';

    protected $fillable = [
        'nome',
        'preco',
        'imagem',
        'ativo',
    ];

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

    public function adicionais()
{
    return $this->hasMany(PedidoItemAdicional::class);
}
}

