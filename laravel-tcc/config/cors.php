<?php

$configuredOrigins = env('ALLOWED_ORIGINS', env('FRONTEND_URL', 'http://localhost:3000'));

$allowedOrigins = array_values(array_unique(array_filter(array_map(
    static fn (string $origin): string => rtrim(trim($origin), '/'),
    explode(',', (string) $configuredOrigins)
))));

return [
    'paths' => [
        'api/*',
        'login',
        'logout',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Accept',
        'Authorization',
        'Content-Type',
        'Origin',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN',
    ],

    'exposed_headers' => [],

    'max_age' => (int) env('CORS_MAX_AGE', 600),

    'supports_credentials' => true,
];
