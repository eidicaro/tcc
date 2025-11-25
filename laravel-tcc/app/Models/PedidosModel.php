<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidosModel extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido'; 
    public $timestamps = true;

    protected $fillable = [
    'cliente_id',
    'endereco',
    'forma_pagamento',
    'troco', 
    'observacao', 
    'total',
    'status_pagamento',
    'tipo_pedido',
];


    // Relacionamentos
    public function itens()
    {
        return $this->hasMany(PedidoItem::class, 'id_pedido', 'id_pedido');
    }

    public function cliente()
    {
        return $this->belongsTo(ClienteModel::class, 'cliente_id', 'id');
    }
}
