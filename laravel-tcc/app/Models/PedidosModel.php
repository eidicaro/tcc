<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PedidoItem;

class PedidosModel extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido';

    // 🔹 Incluímos 'tipo_pedido' aqui
    protected $fillable = [
        'endereco',
        'forma_pagamento',
        'status_pagamento',
        'total',
        'tipo_pedido', // novo campo
    ];

    // 🔹 Relacionamento: um pedido tem muitos itens
    public function itens()
    {
        return $this->hasMany(PedidoItem::class, 'id_pedido', 'id_pedido');
    }
}
