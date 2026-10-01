<?php

return [
    // Conta criada somente pelas seeders do ambiente de desenvolvimento.
    'admin' => [
        'name' => env('ADMIN_NAME', 'Administrador'),
        'email' => env('ADMIN_EMAIL', 'admin@example.com'),
        'password' => env('ADMIN_PASSWORD', 'admin12345678'),
    ],
];
