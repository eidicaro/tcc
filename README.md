# Tong Commerce

Plataforma white-label para catálogo, pedidos e gestão de restaurantes e lojas. O projeto mantém a identidade original da Tong Sushi como configuração padrão, mas concentra marca, operação, entrega e pagamento em configurações substituíveis por estabelecimento.

## Estrutura

- `tong-tcc/`: storefront e painel administrativo em React + Vite.
- `laravel-tcc/`: API Laravel, autenticação Sanctum, catálogo, carrinho e pedidos.
- `deploy/`: exemplos seguros para publicação.

## Requisitos

- Node.js 22.12 ou superior.
- PHP 8.2 ou superior.
- Composer 2.
- MySQL/MariaDB em produção; SQLite é usado pelos testes automatizados.

## Preparação do backend

```powershell
cd laravel-tcc
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Configure o banco e as variáveis `STORE_*` no `.env`, depois execute:

```powershell
php artisan migrate --seed
php artisan storage:link
php artisan admin:create
php artisan serve
```

`admin:create` solicita nome, e-mail e uma senha forte. Não há credencial administrativa fixa no código.

## Preparação do frontend

```powershell
cd tong-tcc
Copy-Item .env.example .env
npm ci
npm run dev
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

Enquanto nome, descrição, marca, imagem de capa e endereço essenciais não estiverem completos, o storefront mostra um aviso e pausa novos pedidos. Isso impede que uma instalação nova publique, por engano, identidade ou dados da loja-modelo.

Metadados lidos por buscadores e redes sociais não executam o React; por isso, nome, descrição, ícone e imagem Open Graph também são definidos pelas variáveis `VITE_STORE_*` do frontend. A imagem padrão fica em `tong-tcc/public/og-preview.jpg` e deve ser substituída para cada cliente.

## Qualidade

```powershell
# Frontend
cd tong-tcc
npm test
npm run build
npm audit

# Backend
cd ..\laravel-tcc
php artisan test
composer audit --locked
```

## Publicação

Nunca publique a raiz deste repositório como `DocumentRoot`. O backend deve apontar exclusivamente para `laravel-tcc/public`; o frontend deve ser servido a partir de `tong-tcc/dist` após `npm run build`. Consulte [SECURITY.md](SECURITY.md) e o exemplo em `deploy/apache-vhost.conf.example`.

Em produção, instale o backend sem ferramentas de desenvolvimento e gere os caches depois de configurar o ambiente:

```powershell
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm ci
npm run build
```

Cada cliente deve usar uma instalação e banco separados. A arquitetura atual é white-label por implantação, não multi-tenant em uma única base.
