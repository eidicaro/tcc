<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoItemModel extends Model
{
    use HasFactory;

    protected $table = 'pedido_itens';

    public $timestamps = false;

    protected $fillable = [
        'id_pedido',
        'id_produto',
        'quantidade',
        'preco_unitario',
    ];

    protected $casts = [
        'quantidade' => 'integer',
        'preco_unitario' => 'decimal:2',
    ];

    public function pedido()
    {
        return $this->belongsTo(PedidosModel::class, 'id_pedido', 'id_pedido');
    }

    public function adicionais()
    {
        return $this->hasMany(PedidoItemAdicional::class, 'id_pedido_item', 'id');
    }

    public function produto()
    {
        return $this->belongsTo(ProdutoModel::class, 'id_produto', 'id_produto')->withTrashed();
    }
}
