<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProductionCheck extends Command
{
    protected $signature = 'production:check';

    protected $description = 'Valida a configuração básica antes da publicação';

    public function handle(): int
    {
        $errors = [];
        $appUrl = (string) config('app.url');
        $frontendUrl = (string) config('deployment.frontend_url');
        $frontendHost = parse_url($frontendUrl, PHP_URL_HOST);
        $apiHost = parse_url($appUrl, PHP_URL_HOST);
        $origins = config('cors.allowed_origins', []);
        $stateful = config('sanctum.stateful', []);

        if (! app()->isProduction()) {
            $errors[] = 'APP_ENV deve ser production.';
        }
        if (config('app.debug')) {
            $errors[] = 'APP_DEBUG deve ser false.';
        }
        if (! config('app.key')) {
            $errors[] = 'APP_KEY precisa ser gerada nesta instalação.';
        }
        if (! $apiHost || parse_url($appUrl, PHP_URL_SCHEME) !== 'https') {
            $errors[] = 'APP_URL deve usar HTTPS e um host válido.';
        }
        if (! $frontendHost || parse_url($frontendUrl, PHP_URL_SCHEME) !== 'https') {
            $errors[] = 'FRONTEND_URL deve usar HTTPS e um host válido.';
        }
        if (! config('session.secure')) {
            $errors[] = 'SESSION_SECURE_COOKIE deve ser true.';
        }
        if (! config('cors.supports_credentials') || $origins !== [rtrim($frontendUrl, '/')]) {
            $errors[] = 'ALLOWED_ORIGINS deve conter somente FRONTEND_URL.';
        }
        if ($frontendHost && ! in_array($frontendHost, $stateful, true)) {
            $errors[] = 'SANCTUM_STATEFUL_DOMAINS deve incluir o host do frontend.';
        }
        if (! in_array(config('session.driver'), ['file', 'database', 'redis'], true)) {
            $errors[] = 'SESSION_DRIVER precisa persistir sessões.';
        }
        if (config('database.default') !== 'mysql') {
            $errors[] = 'DB_CONNECTION deve apontar para o MySQL de produção.';
        }
        if (in_array(config('database.connections.mysql.username'), ['', 'root'], true)
            || ! config('database.connections.mysql.password')) {
            $errors[] = 'Configure um usuário MySQL próprio e senha forte.';
        }
        if (in_array(config('store.name'), ['', 'Sua Loja', 'Maré de Nori Sushi'], true)) {
            $errors[] = 'Configure a marca real da instalação em STORE_NAME.';
        }
        if (in_array(config('store.logo_url'), ['', '/logo.svg'], true)
            || in_array(config('store.hero_image_url'), ['', '/hero.svg'], true)) {
            $errors[] = 'Substitua logo e imagem de capa de demonstração.';
        }

        foreach ($errors as $error) {
            $this->error($error);
        }

        if ($errors !== []) {
            return self::FAILURE;
        }

        $this->info('Configuração básica pronta para a publicação.');
        return self::SUCCESS;
    }
}
