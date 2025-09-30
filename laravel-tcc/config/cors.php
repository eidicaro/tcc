<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'carrinho', 'carrinho/*', '*', 'pedidos/'],
    // 'paths' => ['*'],


    // 'allowed_methods' => ['*'],
    'allowed_methods' => ['*'],


    'allowed_origins' => ['http://localhost:3000'], //react
    // 'allowed_origins' => ['*'], //react

    
    // 'allowed_origins_patterns' => [],
    'allowed_origins_patterns' => [],


    // 'allowed_headers' => ['*'],
    'allowed_headers' => ['*'],


    // 'exposed_headers' => [],
    'exposed_headers' => [],


    // 'max_age' => 0,
    'max_age' => 0,


    'supports_credentials' => true, // habilita os cookies
    // 'supports_credentials' => false, // habilita os cookies

];
