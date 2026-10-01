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

    protected $casts = [
        'quantidade' => 'integer',
        'preco_unitario' => 'decimal:2',
    ];

    public function adicional()
    {
        return $this->belongsTo(AdicionalModel::class, 'id_adicional', 'id_adicional')->withTrashed();
    }

    public function item()
    {
        return $this->belongsTo(PedidoItemModel::class, 'id_pedido_item', 'id');
    }
}
