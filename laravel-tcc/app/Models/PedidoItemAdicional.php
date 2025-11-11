<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoItemAdicional extends Model
{
    use HasFactory;

    protected $table = 'pedido_item_adicionais';
    protected $fillable = ['id_pedido_item', 'id_adicional', 'quantidade', 'preco_unitario'];
    public $timestamps = false;

    public function adicional()
    {
        return $this->belongsTo(AdicionalModel::class, 'id_adicional', 'id_adicional');
    }

    public function item()
    {
        return $this->belongsTo(PedidoItem::class, 'id_pedido_item', 'id');
    }
}
