<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;

class PixController extends Controller
{
    public function gerar(Request $request)
    {
        try {
            // Carrega o token
            MercadoPagoConfig::setAccessToken(env('MERCADOPAGO_ACCESS_TOKEN'));

            $valor = (float) $request->valor;

            if ($valor <= 0) {
                return response()->json([
                    "erro" => "Valor inválido."
                ], 400);
            }

            // Criar cliente MP
            $client = new PaymentClient();

            // Payload OBRIGATÓRIO
            $payment = $client->create([
                "transaction_amount" => $valor,
                "description" => "Pedido Tong Sushi",
                "payment_method_id" => "pix",
                "payer" => [
                    "email" => "teste" . rand(1000, 9999) . "@gmail.com" 
                    // Mercado Pago exige um payer SEMPRE,
                    // mesmo que seja fake, para pedidos sem login
                ]
            ]);

            return response()->json([
                "qr_code_base64" => $payment->point_of_interaction->transaction_data->qr_code_base64 ?? null,
                "qr_code_plain" => $payment->point_of_interaction->transaction_data->qr_code ?? null,
            ]);

        } catch (\Exception $e) {
            Log::error("ERRO PIX: " . $e->getMessage());
            return response()->json([
                "erro" => "Falha ao gerar PIX",
                "detalhes" => $e->getMessage(),
            ], 500);
        }
    }
}

