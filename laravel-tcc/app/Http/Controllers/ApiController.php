<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PixController extends Controller
{
    public function gerarPix(Request $request)
    {
        \MercadoPago\SDK::setAccessToken(env('MERCADO_PAGO_ACCESS_TOKEN'));

        $payment = new \MercadoPago\Payment();

        $payment->transaction_amount = (float)$request->valor;
        $payment->description = $request->descricao ?? "Pagamento via PIX";
        $payment->payment_method_id = "pix"; // MUITO IMPORTANTE
        $payment->payer = [
            "email" => $request->email ?? "email@test.com",
            "first_name" => $request->nome ?? "Cliente"
        ];

        $payment->save();

        return response()->json([
            "id" => $payment->id,
            "qr_code" => $payment->point_of_interaction->transaction_data->qr_code_base64,
            "qr_code_plain" => $payment->point_of_interaction->transaction_data->qr_code,
            "status" => $payment->status,
        ]);
    }
}

