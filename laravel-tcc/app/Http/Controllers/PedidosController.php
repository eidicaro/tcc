<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\PedidoItemAdicional;
use Illuminate\Support\Facades\DB;

class PedidosController extends Controller
{
    public function finalizarPedido(Request $request)
    {
        $carrinho = $request->input('carrinho', []);
        $endereco = $request->input('endereco');
        $forma_pagamento = $request->input('forma_pagamento');
        $total = $request->input('total');

        if (empty($carrinho)) {
            return response()->json(['error' => 'Carrinho vazio'], 400);
        }

        DB::beginTransaction();
        try {
            $pedido = Pedido::create([
                'status' => 'pendente',
                'total' => $total,
                'endereco' => $endereco,
                'forma_pagamento' => $forma_pagamento,
            ]);

            foreach ($carrinho as $item) {
                $pedidoItem = PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'produto_id' => $item['id_produto'],
                    'quantidade' => $item['quantidade'],
                    'preco' => $item['preco'],
                ]);

                if (!empty($item['adicionais'])) {
                    foreach ($item['adicionais'] as $ad) {
                        PedidoItemAdicional::create([
                            'pedido_item_id' => $pedidoItem->id,
                            'adicional_id' => $ad['id_adicional'],
                            'quantidade' => $ad['quantidade'] ?? 1,
                            'preco' => $ad['preco'],
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['success' => true, 'pedido_id' => $pedido->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function listarPedidos()
    {
        $pedidos = Pedido::with(['itens.adicionais'])->get();
        return response()->json($pedidos);
    }
}
