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
        'subtotal',
        'taxa_entrega',
        'total',
        'status_pagamento',
        'status_pedido',
        'tipo_pedido',
        'token',
    ];

    protected $casts = [
        'troco' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'taxa_entrega' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    protected $hidden = ['token'];

    // Relacionamentos
    public function itens()
    {
        return $this->hasMany(PedidoItemModel::class, 'id_pedido', 'id_pedido');
    }

    public function cliente()
    {
        return $this->belongsTo(ClienteModel::class, 'cliente_id', 'id');
    }
}
