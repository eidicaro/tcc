# Manual do frontend

## Subir localmente

Requisito: Node.js 22.12 ou superior.

```powershell
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

Abra `http://localhost:3000`. A API deve estar em `http://localhost:8000`.

## Estrutura

- `src/AppRouter.jsx`: paginas e layouts.
- `src/services/api.js`: Axios e erros.
- `src/contexts`: loja, carrinho e autenticacao.
- `src/components/store`: catalogo e checkout.
- `src/components/admin`: estrutura do painel.
- `src/pages`: paginas publicas e administrativas.
- `src/styles`: design atual; preserve classes e tokens.
- `public`: `/logo.svg` e `/og-preview.jpg`.

## Contratos

Consulte `../docs/API.md`. O carrinho vive na sessao Laravel; o checkout envia `cliente: { nome, telefone }`; nao existe `POST /api/cliente`; busca e status de pedidos sao processados no servidor; uploads multipart usam `_method=PUT`.

## Testes

```powershell
npm.cmd test -- --run
npm.cmd run build
```
