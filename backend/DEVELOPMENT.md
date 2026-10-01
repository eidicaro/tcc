# Manual do backend

## Subir localmente

Requisitos: PHP 8.2+, Composer 2 e MySQL/MariaDB do XAMPP.

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

O exemplo usa banco `BD_TCC`, usuario `root` e senha vazia. Crie o banco no phpMyAdmin ou ajuste as variaveis `DB_*`.

Admin local da seeder:

```text
E-mail: admin@example.com
Senha:  admin12345678
```

## Mapa de alteracoes

- Loja, horarios, entrega e pagamento: `config/store.php` e `STORE_*`.
- Rotas: `routes/api.php` e `routes/web.php`.
- Checkout: `app/Http/Controllers/PedidosController.php`.
- Carrinho e precos: `app/Services/CartService.php`.
- Filtros de pedidos: `app/Services/AdminOrderQueryService.php`.
- Uploads: `ProdutosController` e `AdicionalController`.
- Admin: `database/seeders/UsuariosSeeder.php` ou `php artisan admin:create`.

## Seguranca mantida

Sessao HttpOnly, regeneracao no login, CSRF do Sanctum, CORS local limitado, autorizacao `is_admin`, rate limits e recalculo de precos no servidor. Opcoes exclusivas de HTTPS/deploy ficam desligadas no ambiente local.

## Testes

```powershell
php artisan test
php artisan route:list --except-vendor
php artisan optimize:clear
```

Os testes usam SQLite em memoria e nao alteram o MySQL local.
