<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PedidosModel;
use App\Models\PedidoItemAdicional;
use App\Models\ProdutoModel;


class PedidoItem extends Model {
    use HasFactory;

    protected $table = 'pedido_itens';
    protected $fillable = ['id_pedido', 'id_produto', 'quantidade', 'preco_unitario'];


     public $timestamps = false; 

    // Um item pertence a um pedido
   public function pedido()
    {
        return $this->belongsTo(PedidosModel::class, 'id_pedido', 'id_pedido');
    }

    // Um item pode ter vários adicionais
    public function adicionais()
    {
        return $this->hasMany(PedidoItemAdicional::class, 'id_pedido_item', 'id');
    }

    // Produto relacionado
    public function produto()
    {
        return $this->belongsTo(ProdutoModel::class, 'id_produto', 'id_produto');
    }
}
