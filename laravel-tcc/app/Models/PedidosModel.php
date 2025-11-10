<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PedidoItem;
use App\Models\PedidoItemAdicional;


class PedidosModel extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido'; // garantir que o Eloquent use a PK correta
    protected $fillable = ['endereco', 'forma_pagamento', 'status_pagamento', 'total', 'cliente_id'];

    // Um pedido tem muitos itens
    public function itens() {
        return $this->hasMany(PedidoItem::class, 'id_pedido', 'id_pedido');
    }

public function cliente()
{
    return $this->belongsTo(ClienteModel::class, 'cliente_id', 'id');
}


}
