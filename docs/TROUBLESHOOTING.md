# Solucao de problemas locais

## `ERR_CONNECTION_REFUSED` na porta 8000

```powershell
cd laravel-tcc
php artisan serve --host=127.0.0.1 --port=8000
```

Confirme `VITE_API_URL=http://localhost:8000` em `tong-tcc/.env`.

## CORS entre as portas 3000 e 8000

O backend aceita `localhost` e `127.0.0.1` nas portas 3000 e 5173. Depois de mudar `.env`, rode `php artisan optimize:clear`. Use o mesmo hostname nos dois lados quando possivel.

## Erro 419 / CSRF

1. Verifique `withCredentials` no frontend.
2. Confirme resposta 204 em `/sanctum/csrf-cookie`.
3. Limpe cookies de `localhost` e rode `php artisan optimize:clear`.
4. Confirme `SESSION_SECURE_COOKIE=false` no HTTP local.

Nao desative CSRF para corrigir isso; a falha indica configuracao incorreta da sessao.

## Rota `api/cliente` nao encontrada

O frontend esta desatualizado. O fluxo atual envia `cliente` para `POST /api/pedidos/finalizar`. Reinicie o Vite e force a atualizacao do navegador.

## Imagens nao aparecem

- Marca: `tong-tcc/public`, com URLs como `/logo.svg`.
- Catalogo: `laravel-tcc/storage/app/public/images`.
- Rode `php artisan storage:link` uma vez.
- Confirme `APP_URL=http://localhost:8000`.

## Banco local

`php artisan migrate --seed` atualiza os dados de exemplo sem duplicar nomes conhecidos. `php artisan migrate:fresh --seed` recria tudo, mas apaga os dados existentes.

## PowerShell bloqueia `npm.ps1`

Use `npm.cmd install` e `npm.cmd run dev`.
