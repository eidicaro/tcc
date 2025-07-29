<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarrinhoProdAdd extends Model
{
    protected $table = 'carrinho_prod_add';
    public $timestamps = false;

    protected $fillable = [
        'id_carrinho',
        'id_produto',
        'id_adicional',
        'quantidade',
    ];

    // Relacionamentos (opcional)
    public function adicional()
    {
        return $this->belongsTo(Adicional::class, 'id_adicional');
    }

    public function produto()
    {
        return $this->belongsTo(ProdutoModel::class, 'id_produto');
    }

    public function carrinho()
    {
        return $this->belongsTo(Carrinho::class, 'id_carrinho');
    }
}
