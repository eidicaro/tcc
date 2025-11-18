<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector; 
use Mike42\Escpos\PrintConnectors\FilePrintConnector;

class PrinterController extends Controller
{
    public function imprimirPedido(Request $request)
    {
        try {
            $pedido = $request->all();

            // -------------- CONFIGURAÇÃO DA IMPRESSORA ----------------
            // 🔥 ALTERAR PARA O NOME REAL DA IMPRESSORA
            $connector = new WindowsPrintConnector("NOME_DA_IMPRESSORA_AQUI");

            $printer = new Printer($connector);

            // ------------------ CABEÇALHO ---------------------
            $printer->setEmphasis(true);
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("***** TONG SUSHI *****\n");
            $printer->setEmphasis(false);

            $printer->feed();

            // ------------------ DADOS GERAIS -------------------
            $printer->setJustification(Printer::JUSTIFY_LEFT);

            $printer->text("Pedido: " . ($pedido['id'] ?? '---') . "\n");
            $printer->text("Tipo: " . strtoupper($pedido['tipo_pedido'] ?? '') . "\n");

            if (!empty($pedido['cliente_nome'])) {
                $printer->text("Cliente: " . $pedido['cliente_nome'] . "\n");
            }

            if (!empty($pedido['endereco'])) {
                $printer->text("Endereço: " . $pedido['endereco'] . "\n");
            }

            $printer->text("Pagamento: " . ($pedido['forma_pagamento'] ?? '') . "\n");

            if (!empty($pedido['valor_troco'])) {
                $printer->text("Troco para: R$ " . $pedido['valor_troco'] . "\n");
            }

            if (!empty($pedido['observacao'])) {
                $printer->text("Obs: " . $pedido['observacao'] . "\n");
            }

            $printer->feed();

            // ------------------ ITENS --------------------------
            $printer->setEmphasis(true);
            $printer->text("Itens do pedido:\n");
            $printer->setEmphasis(false);

            foreach ($pedido['carrinho'] as $item) {
                $printer->text($item['quantidade'] . "x " . $item['nome'] . "\n");
                $printer->text("R$ " . number_format((float)$item['preco'], 2, ',', '.') . "\n");

                if (!empty($item['adicionais']) && is_array($item['adicionais'])) {
                    foreach ($item['adicionais'] as $add) {
                        $printer->text(
                            "   + " . $add['quantidade'] . "x " . $add['nome'] .
                            " (R$ " . number_format((float)$add['preco'], 2, ',', '.') . ")\n"
                        );
                    }
                }

                $printer->feed();
            }

            // ------------------ TOTAL --------------------------
            $printer->setEmphasis(true);
            $printer->text("TOTAL: R$ " . number_format((float)$pedido['total'], 2, ',', '.') . "\n");
            $printer->setEmphasis(false);

            $printer->feed(2);
            $printer->cut();
            $printer->close();

            return response()->json(["message" => "Pedido impresso com sucesso!"]);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }
}
