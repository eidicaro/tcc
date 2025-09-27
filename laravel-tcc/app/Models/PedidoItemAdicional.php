<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PedidosModel;
use App\Models\PedidoItem;
use App\Models\AdicionalModel;


class PedidoItemAdicional extends Model {
    use HasFactory;

    protected $table = 'pedido_item_adicionais';
    protected $fillable = ['id_pedido_item', 'id_adicional', 'quantidade', 'preco_unitario'];

     public $timestamps = false; // <---- adicione isto

    // O adicional pertence a um item do pedido
    public function pedidoItem()
    {
        return $this->belongsTo(PedidoItem::class, 'id_pedido_item', 'id');
    }

    // Relaciona com a tabela adicional
    public function adicional()
    {
        return $this->belongsTo(AdicionalModel::class, 'id_adicional', 'id_adicional');
    }
}
