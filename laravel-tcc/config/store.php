<?php

$csv = static function (?string $value): array {
    return array_values(array_filter(array_map(
        static fn (string $item): string => trim($item),
        explode(',', (string) $value)
    )));
};

$boolean = static function (mixed $value, bool $default): bool {
    if ($value === null) {
        return $default;
    }

    return filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? $default;
};

$integerCsv = static function (?string $value) use ($csv): array {
    return array_values(array_filter(array_map(
        static fn (string $item): int => (int) $item,
        $csv($value)
    ), static fn (int $id): bool => $id > 0));
};

$defaultHours = [
    ['label' => 'Segunda a quinta', 'value' => '18h30 — 22h'],
    ['label' => 'Sexta e sábado', 'value' => '18h30 — 22h30'],
    ['label' => 'Domingo', 'value' => 'Consulte o atendimento'],
];

$hours = static function (?string $value) use ($defaultHours): array {
    if ($value === null || trim($value) === '') {
        return $defaultHours;
    }

    $result = [];

    foreach (explode(';', $value) as $entry) {
        $parts = array_map('trim', explode('|', $entry, 2));

        if (count($parts) !== 2 || $parts[0] === '' || $parts[1] === '') {
            continue;
        }

        $result[] = [
            'label' => substr($parts[0], 0, 80),
            'value' => substr($parts[1], 0, 80),
        ];
    }

    return $result !== [] ? array_slice($result, 0, 14) : $defaultHours;
};

return [
    'id' => env('STORE_SLUG', 'tong-sushi'),
    'name' => env('STORE_NAME', 'Tong Sushi'),
    'short_name' => env('STORE_SHORT_NAME', env('STORE_NAME', 'Tong')),
    'business_type' => env('STORE_BUSINESS_TYPE', 'restaurant'),
    'tagline' => env('STORE_TAGLINE', 'Sabor e cuidado em cada pedido'),
    'description' => env('STORE_DESCRIPTION', 'Ingredientes selecionados e uma experiência preparada em cada detalhe.'),
    'logo_url' => env('STORE_LOGO_URL'),
    'hero_image_url' => env('STORE_HERO_IMAGE_URL'),

    'contact' => [
        'whatsapp' => env('STORE_WHATSAPP'),
        'phone' => env('STORE_PHONE'),
        'email' => env('STORE_EMAIL'),
        'instagram' => env('STORE_INSTAGRAM'),
        'facebook' => env('STORE_FACEBOOK'),
    ],

    'address' => [
        'line' => env('STORE_ADDRESS', 'Rua Orlando Sartorelli, 45 — Centro'),
        'city' => env('STORE_CITY', 'Iperó'),
        'state' => env('STORE_STATE', 'SP'),
        'postal_code' => env('STORE_POSTAL_CODE'),
    ],

    'location' => [
        'address' => env('STORE_ADDRESS', 'Rua Orlando Sartorelli, 45 — Centro'),
        'city' => trim(env('STORE_CITY', 'Iperó').' — '.env('STORE_STATE', 'SP'), ' —'),
        'map_url' => env('STORE_MAP_URL'),
    ],

    'hours' => $hours(env('STORE_HOURS')),

    'locale' => env('STORE_LOCALE', 'pt_BR'),
    'currency' => env('STORE_CURRENCY', 'BRL'),
    'timezone' => env('STORE_TIMEZONE', 'America/Sao_Paulo'),

    'theme' => [
        'primary' => env('STORE_PRIMARY_COLOR', '#F48347'),
        'secondary' => env('STORE_SECONDARY_COLOR', '#111111'),
        'accent' => env('STORE_ACCENT_COLOR', '#03391D'),
        'ink' => env('STORE_SECONDARY_COLOR', '#111111'),
        'orange' => env('STORE_PRIMARY_COLOR', '#F48347'),
        'green' => env('STORE_ACCENT_COLOR', '#03391D'),
        'surface' => '#F8F5EF',
        'muted' => '#D9D9D9',
    ],

    'delivery' => [
        'enabled' => $boolean(env('DELIVERY_ENABLED'), true),
        'fee' => number_format((float) env('DELIVERY_FEE', 3), 2, '.', ''),
        'minimum_order' => number_format((float) env('ORDER_MINIMUM', 0), 2, '.', ''),
        'estimate' => env('DELIVERY_ESTIMATE', '40-90 min'),
    ],

    'pickup' => [
        'enabled' => $boolean(env('PICKUP_ENABLED'), true),
    ],

    'payment_methods' => $csv(env(
        'STORE_PAYMENT_METHODS',
        'Cartão Débito/Crédito,Pix,Dinheiro'
    )),

    'featured_product_ids' => $integerCsv(env('STORE_FEATURED_PRODUCT_IDS')),

    'order' => [
        'delivery_fee' => number_format((float) env('DELIVERY_FEE', 3), 2, '.', ''),
        'minimum' => number_format((float) env('ORDER_MINIMUM', 0), 2, '.', ''),
        'estimate' => env('DELIVERY_ESTIMATE', '40-90 min'),
        'fulfillment' => array_values(array_filter([
            $boolean(env('DELIVERY_ENABLED'), true) ? 'delivery' : null,
            $boolean(env('PICKUP_ENABLED'), true) ? 'local' : null,
        ])),
        'payment_methods' => $csv(env(
            'STORE_PAYMENT_METHODS',
            'Cartão Débito/Crédito,Pix,Dinheiro'
        )),
    ],

    'order_statuses' => [
        'novo',
        'confirmado',
        'preparando',
        'saiu_entrega',
        'concluido',
        'cancelado',
    ],
];
