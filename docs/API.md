# Contrato da API

Base local: `http://localhost:8000`. Rotas `/api/admin` exigem sessao administrativa. Mutacoes da SPA usam antes `GET /sanctum/csrf-cookie`.

## Publico

| Metodo | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/store` | Perfil, tema e regras comerciais |
| GET | `/api/produtos` | Produtos ativos |
| GET | `/api/produtos/by-ids?ids=1,2` | Produtos ativos por IDs |
| GET | `/api/categoria` | Categorias ativas |
| GET | `/api/adicionais` | Adicionais ativos |
| GET | `/api/carrinho/listar` | Carrinho da sessao |
| POST | `/api/carrinho/adicionar` | Adiciona produto e adicionais |
| PATCH | `/api/carrinho/atualizar/{uid}` | Atualiza quantidade |
| DELETE | `/api/carrinho/remover/{uid}` | Remove item |
| DELETE | `/api/carrinho/limpar` | Limpa carrinho |
| POST | `/api/pedidos/finalizar` | Cria o pedido |

Adicionar ao carrinho:

```json
{
  "produto_id": 1,
  "quantidade": 2,
  "adicionais": [{ "adicional_id": 3, "quantidade": 1 }]
}
```

Checkout:

```json
{
  "pedido_token": "token-unico",
  "tipo_pedido": "delivery",
  "endereco": "Rua Exemplo, 123",
  "forma_pagamento": "Pix",
  "troco": null,
  "observacao": "Sem descartaveis",
  "cliente": {
    "nome": "Cliente Exemplo",
    "telefone": "15999999999"
  }
}
```

Nao envie `cliente_id`, itens, precos ou total no checkout. O servidor obtem esses dados da sessao e do banco.

## Autenticacao

| Metodo | Rota | Finalidade |
| --- | --- | --- |
| GET | `/sanctum/csrf-cookie` | Inicializa CSRF |
| POST | `/login` | Abre sessao administrativa |
| POST | `/logout` | Encerra sessao |
| GET | `/api/auth/me` | Retorna o admin atual |

## Administracao

- `/api/admin/dashboard`: `GET`.
- `/api/admin/pedidos`: `GET`, com `q`, `status`, `status_pagamento`, `page` e `per_page`.
- `/api/admin/pedidos/{id}`: `GET`, `PUT` e `DELETE`.
- `/api/admin/pedidos/{id}/status`: `PUT`.
- `/api/admin/produtos`: `GET` e `POST`.
- `/api/admin/produtos/{id}`: `PUT` e `DELETE`; multipart pode usar `POST` com `_method=PUT`.
- `/api/admin/categorias`: `GET` e `POST`.
- `/api/admin/categorias/{id}`: `PUT` e `DELETE`.
- `/api/admin/adicionais`: `GET` e `POST`.
- `/api/admin/adicionais/{id}`: `PUT` e `DELETE`; multipart pode usar `POST` com `_method=PUT`.
- `/api/admin/clientes`: `GET`, com `q`, `page` e `per_page`.

Validacao usa HTTP 422 com `message` e `errors`; falta de sessao usa 401; falta de privilegio usa 403; conflito comercial usa 409.
