<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoItem extends Model {
    protected $table = 'pedido_itens';
    protected $fillable = ['id_pedido', 'id_produto', 'quantidade', 'preco_unitario'];

    // Um item pertence a um pedido
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    // Um item pode ter vários adicionais
    public function adicionais()
    {
        return $this->hasMany(PedidoItemAdicional::class);
    }

    // Produto relacionado
    public function produto()
    {
        return $this->belongsTo(Produto::class, 'id_produto', 'id_produto');
    }
}

