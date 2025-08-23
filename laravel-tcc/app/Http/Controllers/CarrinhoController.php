<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrinho;

class CarrinhoController extends Controller
{
    public function adicionar(Request $request)
    {
        $carrinho = session()->get('carrinho', []);

        $id = $produto['id'];

        if(isset($carrinho[$id])){
            $carrinho[$id]['quantidade'] += $produto['quantidade'];
        } else {
            $carrinho[$id] = $produto;
        }

        session()->put('carrinho', $carrinho);

        return response()->json($carrinho);

    }

    public function remover(Request $request, $id)
    {
        $carrinho = session()->get('carrinho', []);
        unset($carrinho[$id]);
        session()->put('carrinho', $carrinho);

        return response()->json($carrinho);
    }

    public function listar()
    {
        return response()->json(session()->get('carrinho', []));
    }

    public function limpar()
    {
        session()->forget('carrinho');
        return response()->json([]);
    }


    public function finalizar(Request $request)
    {
        $id_cliente = $request->input('id_cliente');
        $itens = $request->input('itens'); // array de produtos com adicionais

        // Aqui você pode criar pedidos no banco vinculando id_cliente
        // Exemplo:
        $pedido = Pedido::create([
            'id_cliente' => $id_cliente,
            'status' => 'novo',
            'total' => collect($itens)->sum(function($item){
                $total = $item['preco'] * $item['quantidade'];
                if(isset($item['adicionais'])){
                    $total += collect($item['adicionais'])->sum('preco');
                }
                return $total;
            })
        ]);

        // Adicionar itens do pedido no banco (PedidoItem ou similar)
        foreach ($itens as $item) {
            PedidoItem::create([
                'id_pedido' => $pedido->id,
                'id_produto' => $item['id'],
                'quantidade' => $item['quantidade'],
                'preco' => $item['preco']
            ]);

            if(isset($item['adicionais'])){
                foreach ($item['adicionais'] as $adicional){
                    PedidoItemAdicional::create([
                        'id_pedido_item' => $pedidoItem->id,
                        'id_adicional' => $adicional['id'],
                        'preco' => $adicional['preco']
                    ]);
                }
            }
        }

        return response()->json(['mensagem' => 'Pedido finalizado com sucesso', 'pedido' => $pedido]);
    }


}
