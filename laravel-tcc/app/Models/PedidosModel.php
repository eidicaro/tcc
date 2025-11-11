<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PedidoItem;

class PedidosModel extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    protected $primaryKey = 'id'; // <-- corrigido para o nome real da PK

    protected $fillable = [
        'endereco',
        'forma_pagamento',
        'status_pagamento',
        'total',
        'tipo_pedido',
        'cliente_id',
    ];

    public function itens()
    {
        return $this->hasMany(PedidoItem::class, 'id_pedido', 'id');
    }

public function cliente()
{
    return $this->belongsTo(ClienteModel::class, 'cliente_id', 'id');
}


}
