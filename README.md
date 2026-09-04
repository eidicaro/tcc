# Tong Commerce

Plataforma local-first para catálogo, pedidos e gestão de restaurantes e lojas. A configuração padrão traz uma loja Tong Sushi funcional para desenvolvimento com XAMPP. Comece por este guia e consulte [arquitetura](docs/ARCHITECTURE.md), [API](docs/API.md) e [solução de problemas](docs/TROUBLESHOOTING.md).

## Estrutura

- `tong-tcc/`: storefront e painel administrativo em React + Vite.
- `laravel-tcc/`: API Laravel, autenticação Sanctum, catálogo, carrinho e pedidos.
- `docs/`: arquitetura, contrato HTTP e troubleshooting.
- `deploy/`: material reservado para uma etapa futura de publicação.

## Requisitos

- Node.js 22.12 ou superior.
- PHP 8.2 ou superior.
- Composer 2.
- MySQL/MariaDB do XAMPP; SQLite em memória é usado pelos testes automatizados.

## Preparação do backend

```powershell
cd laravel-tcc
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Crie um banco vazio chamado `BD_TCC` no phpMyAdmin e execute:

```powershell
php artisan migrate --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

A seeder local cria `admin@example.com` com senha `admin12345678`. Essas credenciais são somente para desenvolvimento.

## Preparação do frontend

```powershell
cd tong-tcc
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

Por padrão, o frontend local usa `http://localhost:8000`. Para outro endereço, defina `VITE_API_URL`.

As variáveis `VITE_STORE_*` também configuram, no momento do build, o título, a descrição, as cores, o ícone, o manifesto PWA e a imagem de compartilhamento social. Para uma nova marca, copie `.env.example`, ajuste esses valores e substitua os arquivos públicos indicados antes de executar `npm run build`.

## Personalização white-label

Marca e operação são alteradas no `.env` do backend, sem modificar componentes:

- `STORE_NAME`, `STORE_TAGLINE`, `STORE_DESCRIPTION` e `STORE_LOGO_URL`;
- `STORE_PRIMARY_COLOR`, `STORE_SECONDARY_COLOR` e `STORE_ACCENT_COLOR`;
- `STORE_PHONE`, `STORE_WHATSAPP`, redes sociais e endereço;
- `STORE_HOURS`, `DELIVERY_FEE`, `ORDER_MINIMUM` e `DELIVERY_ESTIMATE`;
- `STORE_PAYMENT_METHODS`, entrega e retirada.

O endpoint público `/api/store` entrega essa configuração em runtime. Produtos, categorias, adicionais e destaques são administrados pelo painel.

Campos visuais ausentes usam os fallbacks do frontend e não pausam pedidos durante o desenvolvimento.

Metadados lidos por buscadores e redes sociais não executam o React; por isso, nome, descrição, ícone e imagem Open Graph também são definidos pelas variáveis `VITE_STORE_*` do frontend. A imagem padrão fica em `tong-tcc/public/og-preview.jpg` e deve ser substituída para cada cliente.

## Qualidade

```powershell
# Frontend
cd tong-tcc
npm.cmd test -- --run
npm.cmd run build
npm audit

# Backend
cd ..\laravel-tcc
php artisan test
composer audit --locked
```

## Publicação futura

O ambiente atual foi preparado para uso local. Antes de publicar, revise [SECURITY.md](SECURITY.md), troque todas as credenciais e crie uma configuração separada de produção. A pasta `deploy/` não faz parte do fluxo local.

Quando essa etapa chegar, crie um guia de deploy separado e mantenha este README voltado ao desenvolvimento. A arquitetura atual é white-label por instalação, não multi-tenant.
