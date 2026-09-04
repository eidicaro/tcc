# Arquitetura do Tong Commerce

## Visao geral

O sistema e separado em SPA e API. O navegador abre o React em `http://localhost:3000`; o React acessa o Laravel em `http://localhost:8000` usando Axios e cookies de sessao.

```text
Navegador
  -> React/Vite (tong-tcc)
       -> catalogo, carrinho, checkout e painel
       -> HTTP + cookie + XSRF
  -> Laravel (laravel-tcc)
       -> controllers e validacao
       -> CartService / AdminOrderQueryService
       -> Eloquent -> MySQL
```

## Responsabilidades

### Frontend

- `src/services/api.js`: URL da API, Axios, CSRF, erros e URLs de imagens.
- `src/contexts/StoreContext.jsx`: normaliza configuracao visual e operacional.
- `src/contexts/CartContext.jsx`: sincroniza o carrinho da sessao.
- `src/contexts/AuthContext.jsx`: controla a sessao administrativa.
- `src/components/store`: experiencia publica e checkout.
- `src/pages/admin`: operacao administrativa.

### Backend

- `routes/api.php`: catalogo, carrinho, checkout e recursos administrativos.
- `routes/web.php`: login e logout com middleware web/CSRF.
- `app/Http/Controllers`: borda HTTP e validacao.
- `app/Services/CartService.php`: fonte de verdade do carrinho e dos precos.
- `app/Services/AdminOrderQueryService.php`: filtros e contadores de pedidos.
- `config/store.php`: perfil e regras comerciais.
- `database/migrations`: estrutura persistente.
- `database/seeders`: dados locais de exemplo, repetiveis por nome/e-mail.

## Fluxo de carrinho e checkout

1. O frontend solicita o cookie XSRF.
2. Produtos sao adicionados por ID e quantidade.
3. O backend recarrega produto, adicionais e precos do banco.
4. O checkout envia entrega, pagamento e `cliente`.
5. O backend cria ou reutiliza o cliente pelo telefone, cria pedido e itens em transacao e limpa o carrinho.
6. `pedido_token` evita pedidos duplicados em repeticoes da mesma requisicao.

## Fluxo administrativo

1. O login cria uma sessao HttpOnly.
2. `auth:sanctum` exige sessao valida.
3. O middleware `admin` exige `users.is_admin = true`.
4. O React carrega dashboard, pedidos, clientes e catalogo apos validar a sessao.

## Decisoes importantes

- O sistema e local-first e white-label por instalacao, nao multi-tenant.
- Campos visuais vazios usam fallbacks do frontend e nao pausam pedidos.
- Produtos, categorias e adicionais usam soft delete para preservar historico.
- Pedidos guardam precos unitarios; mudancas no catalogo nao alteram vendas antigas.
- A tabela legada `adm` nao participa da autenticacao; administradores ficam em `users`.
