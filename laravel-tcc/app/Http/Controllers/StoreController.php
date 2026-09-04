<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'store' => config('store', []),
            'configured' => true,
            'missing_fields' => [],
        ]);
    }
}
