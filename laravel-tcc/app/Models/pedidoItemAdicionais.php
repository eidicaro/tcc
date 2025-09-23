<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoItemAdicional extends Model {
    protected $table = 'pedido_item_adicionais';
    protected $fillable = ['id_pedido_item', 'id_adicional', 'quantidade', 'preco_unitario'];

    // O adicional pertence a um item do pedido
    public function pedidoItem()
    {
        return $this->belongsTo(PedidoItem::class);
    }

    // Relaciona com a tabela adicional
    public function adicional()
    {
        return $this->belongsTo(Adicional::class, 'id_adicional', 'id_adicional');
    }
}

