# Guia para agentes e contribuidores

Este repositorio contem duas aplicacoes que devem evoluir juntas:

- `laravel-tcc/`: API Laravel, banco, sessao, regras comerciais e painel administrativo.
- `tong-tcc/`: storefront e painel React/Vite.

Antes de alterar um fluxo, leia `docs/ARCHITECTURE.md` e `docs/API.md`. As rotas em `laravel-tcc/routes` e os testes de feature sao a fonte de verdade. Nao crie rota publica para clientes: o checkout recebe `cliente` e resolve o cadastro na mesma operacao.

## Regras de trabalho

1. Preserve a estrutura visual e as classes CSS, salvo pedido explicito de redesign.
2. IDs, precos e totais sao controlados pelo backend. O frontend envia escolhas do usuario.
3. Mantenha autenticacao administrativa, autorizacao, CSRF de sessao e validacao dos payloads.
4. O ambiente padrao e local: frontend em `localhost:3000`, API em `localhost:8000` e MySQL do XAMPP.
5. Nao edite nem versione `.env`; ajuste `.env.example` quando surgir configuracao nova.
6. Atualize `docs/API.md` quando mudar uma rota, payload ou resposta.
7. Rode as duas suites antes de encerrar uma mudanca integrada.

## Verificacao obrigatoria

No PowerShell, use `npm.cmd` se a politica de execucao bloquear `npm.ps1`.

```powershell
cd laravel-tcc
php artisan test

cd ..\tong-tcc
npm.cmd test -- --run
npm.cmd run build
```

Consulte `docs/TROUBLESHOOTING.md` antes de mudar CORS, cookies ou Sanctum por causa de um erro local.
