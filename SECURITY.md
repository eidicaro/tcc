# Segurança e publicação

## Regras essenciais

1. Gere uma `APP_KEY` diferente para cada instalação com `php artisan key:generate`.
2. Use `APP_ENV=production`, `APP_DEBUG=false`, HTTPS e cookies seguros em produção.
3. Crie um usuário exclusivo do banco, com senha forte e apenas os privilégios necessários para o schema da aplicação.
4. Aponte o servidor web somente para `laravel-tcc/public`; nunca exponha `.env`, `.git`, `storage`, `vendor`, código-fonte ou logs.
5. Crie administradores com `php artisan admin:create`. Não compartilhe contas.
6. Restrinja `FRONTEND_URL` e `ALLOWED_ORIGINS` aos domínios reais da loja.
7. Mantenha PHP, Composer, Node e as dependências atualizados; rode os audits antes de cada publicação.
8. Faça backup do banco e das imagens antes de migrations ou atualizações.

## Dados pessoais

O painel exibe nome, telefone e endereço apenas para administradores autenticados. Defina política de retenção, descarte pedidos antigos quando permitido e conceda acesso somente à equipe que atende pedidos. Adeque aviso de privacidade, base legal e canal de atendimento à LGPD antes da operação comercial.

## Estrutura legada

A tabela `adm` das primeiras versões permanece no histórico de migrations para não destruir instalações existentes, mas não possui model, rota nem participação na autenticação atual. Depois de criar e validar os administradores na tabela `users`, faça backup e remova `adm` por uma migration própria de implantação caso existam dados antigos a preservar.

## Cabeçalhos e sessões

A API aplica cabeçalhos defensivos, autenticação por sessão HttpOnly, CSRF via Sanctum, rate limits e autorização administrativa no servidor. Em produção, configure:

```dotenv
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
APP_DEBUG=false
```

Frontend e API devem compartilhar o mesmo domínio raiz para o modo SPA do Sanctum; subdomínios separados são aceitos quando `SANCTUM_STATEFUL_DOMAINS` e `SESSION_DOMAIN` estão corretos.

## Reporte responsável

Não abra issues públicas com credenciais, dados pessoais ou detalhes exploráveis. Envie o relato de forma privada ao responsável técnico da instalação.
