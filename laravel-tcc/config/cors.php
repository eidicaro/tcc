<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'carrinho/*',
        'pedidos/*',
        'admin/*',
        '192.168.1.105/*'
    ],

    'allowed_methods' => ['*'],

    // ✅ Permite o React em localhost e na rede local
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3003',
        'http://192.168.1.105:3000',
        'http://192.168.1.105:3003',
        'http://192.168.1.105'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

