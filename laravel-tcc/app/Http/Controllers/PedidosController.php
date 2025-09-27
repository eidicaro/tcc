<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PedidosModel;
use App\Models\PedidoItem;
use App\Models\PedidoItemAdicional;
use Illuminate\Support\Facades\DB;

class PedidosController extends Controller
{
    /**
     * Finaliza um pedido com itens e adicionais
     */
    public function finalizar(Request $request)
    {
        $data = $request->validate([
            'endereco' => 'required|string|max:255',
            'forma_pagamento' => 'required|string|max:50',
            'total' => 'required|numeric|min:0',
            'carrinho' => 'required|array|min:1',
            'carrinho.*.produto_id' => 'required|integer|exists:produto,id_produto',
            'carrinho.*.quantidade' => 'required|integer|min:1',
            'carrinho.*.preco' => 'required|numeric|min:0',
            'carrinho.*.adicionais' => 'nullable|array',
            'carrinho.*.adicionais.*.adicional_id' => 'required_with:carrinho.*.adicionais|integer|exists:adicional,id_adicional',
            'carrinho.*.adicionais.*.preco' => 'required_with:carrinho.*.adicionais|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // Cria o pedido
            $pedido = PedidosModel::create([
                'endereco' => $data['endereco'],
                'forma_pagamento' => $data['forma_pagamento'],
                'total' => $data['total'],
                'status_pagamento' => 'pendente',
            ]);

            // Cria os itens do pedido
            foreach ($data['carrinho'] as $item) {
                $pedidoItem = PedidoItem::create([
                    'id_pedido' => $pedido->id_pedido,
                    'id_produto' => $item['produto_id'],
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $item['preco'],
                ]);

                // Cria os adicionais do item (se houver)
                if (!empty($item['adicionais'])) {
                    foreach ($item['adicionais'] as $adicional) {
                        PedidoItemAdicional::create([
                            'id_pedido_item' => $pedidoItem->id,
                            'id_adicional' => $adicional['adicional_id'],
                            'quantidade' => 1, // cada adicional vale 1
                            'preco_unitario' => $adicional['preco'],
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'pedido_id' => $pedido->id_pedido,
                'message' => 'Pedido finalizado com sucesso!'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro ao finalizar pedido: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lista todos os pedidos para o admin, com itens e adicionais
     */
        public function listarPedidos() {
            try {
                $pedidos = PedidosModel::with(['itens.produto', 'itens.adicionais.adicional'])->get();
                return response()->json(['success' => true, 'pedidos' => $pedidos]);
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'message' => 'Erro ao listar pedidos: ' . $e->getMessage()]);
            }
        }

}
