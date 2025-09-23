<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidosModel extends Model
{
    protected $table = 'pedidos';
    protected $fillable = ['endereco', 'forma_pagamento', 'status_pagamento', 'total'];

    public function itens() {
        return $this->hasMany(PedidoItem::class, 'id_pedido');
    }

}
