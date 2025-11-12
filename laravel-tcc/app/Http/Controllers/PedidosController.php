<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PedidosModel;
use App\Models\PedidoItem;
use App\Models\PedidoItemAdicional;
use Illuminate\Support\Facades\DB;

class PedidosController extends Controller
{
    
    public function finalizar(Request $request)
{
    $tipo_pedido = $request->filled('endereco') ? 'delivery' : 'local';

    $data = $request->validate([
        'endereco' => 'nullable|string|max:255',
        'forma_pagamento' => 'required|string|max:50',
        'troco' => 'nullable|numeric|min:0', 
        'observacao' => 'nullable|string|max:500', 
        'total' => 'required|numeric|min:0',
        'carrinho' => 'required|array|min:1',
        'carrinho.*.produto_id' => 'required|integer',
        'carrinho.*.quantidade' => 'required|integer|min:1',
        'carrinho.*.preco' => 'required|numeric|min:0',
        'carrinho.*.adicionais' => 'nullable|array',
        'carrinho.*.adicionais.*.adicional_id' => 'required_with:carrinho.*.adicionais|integer',
        'carrinho.*.adicionais.*.preco' => 'required_with:carrinho.*.adicionais|numeric|min:0',
        'carrinho.*.adicionais.*.quantidade' => 'nullable|integer|min:1',
        'cliente_id' => 'nullable|exists:clientes,id'
    ]);

    if ($tipo_pedido === 'delivery' && empty($request->endereco)) {
        return response()->json([
            'success' => false,
            'message' => 'O endereço é obrigatório para pedidos de delivery.'
        ], 422);
    }

    DB::beginTransaction();

    try {
        $pedido = PedidosModel::create([
            'cliente_id' => $data['cliente_id'] ?? null,
            'endereco' => $data['endereco'] ?? null,
            'forma_pagamento' => $data['forma_pagamento'],
            'troco' => $data['troco'] ?? null, 
            'observacao' => $data['observacao'] ?? null, 
            'total' => $data['total'],
            'status_pagamento' => 'pendente',
            'tipo_pedido' => $tipo_pedido,
        ]);

        foreach ($data['carrinho'] as $item) {
            $pedidoItem = PedidoItem::create([
                'id_pedido' => $pedido->getKey(),
                'id_produto' => $item['produto_id'],
                'quantidade' => $item['quantidade'],
                'preco_unitario' => $item['preco'],
            ]);

            if (!empty($item['adicionais'])) {
                foreach ($item['adicionais'] as $adicional) {
                    PedidoItemAdicional::create([
                        'id_pedido_item' => $pedidoItem->id,
                        'id_adicional' => $adicional['adicional_id'],
                        'quantidade' => $adicional['quantidade'] ?? 1,
                        'preco_unitario' => $adicional['preco'],
                    ]);
                }
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'pedido_id' => $pedido->id_pedido,
            'tipo_pedido' => $tipo_pedido,
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
    public function listarPedidos()
    {
        try {
            $pedidos = PedidosModel::with([
                'cliente', // <--- adiciona o relacionamento
                'itens.produto',
                'itens.adicionais.adicional'
            ])->get();

           return response()->json([
                'success' => true,
                'pedidos' => $pedidos,
                'message' => 'Pedido finalizado com sucesso!'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao listar pedidos: ' . $e->getMessage()]);
        }
    }

    /**
     * Exibe um pedido específico
     */
    public function mostrarPedido($id)
    {
        try {
            $pedido = PedidosModel::with(['itens.produto', 'itens.adicionais.adicional'])
                ->findOrFail($id);

            return response()->json(['success' => true, 'pedido' => $pedido]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao buscar pedido: ' . $e->getMessage()]);
        }
    }

    /**
     * Atualiza dados do pedido
     */
    public function atualizarPedido(Request $request, $id)
    {
        try {
            $pedido = PedidosModel::findOrFail($id);

            $data = $request->validate([
                'endereco' => 'sometimes|nullable|string|max:255',
                'forma_pagamento' => 'sometimes|string|max:50',
                'status_pagamento' => 'sometimes|string|max:50',
                'total' => 'sometimes|numeric|min:0',
                'tipo_pedido' => 'sometimes|string|in:local,delivery'
            ]);

            $pedido->update($data);

            return response()->json(['success' => true, 'message' => 'Pedido atualizado com sucesso', 'pedido' => $pedido]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao atualizar pedido: ' . $e->getMessage()]);
        }
    }

    /**
     * Atualiza apenas o status do pagamento
     */
    public function atualizarStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status_pagamento' => 'required|string'
            ]);

            PedidosModel::where('id', $id)
                ->update(['status_pagamento' => $request->status_pagamento]);

            return response()->json([
                'success' => true,
                'message' => 'Status atualizado com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar status',
                'erro' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exclui um pedido e seus relacionamentos
     */
    public function excluirPedido($id)
    {
        try {
            $pedido = PedidosModel::with('itens.adicionais')->findOrFail($id);

            foreach ($pedido->itens as $item) {
                $item->adicionais()->delete();
                $item->delete();
            }

            $pedido->delete();

            return response()->json(['success' => true, 'message' => 'Pedido excluído com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao excluir pedido: ' . $e->getMessage()]);
        }
    }
}
