<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    private const ESSENTIAL_FIELDS = [
        'name' => 'name',
        'tagline' => 'tagline',
        'description' => 'description',
        'logo_url' => 'logo_url',
        'hero_image_url' => 'hero_image_url',
        'address' => 'address.line',
        'city' => 'address.city',
    ];

    public function show(): JsonResponse
    {
        $store = config('store', []);
        $missingFields = [];

        foreach (self::ESSENTIAL_FIELDS as $field => $path) {
            $value = data_get($store, $path);

            if (! is_string($value) || trim($value) === '') {
                $missingFields[] = $field;
            }
        }

        return response()->json([
            'store' => $store,
            'configured' => $missingFields === [],
            'missing_fields' => $missingFields,
        ]);
    }
}
