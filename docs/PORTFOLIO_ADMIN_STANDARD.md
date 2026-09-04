# Admin dos projetos do portfólio (`/app/portfolio`)

Administração dos 68 projetos de `/portfolio/:slug` sem editar arquivos à mão.

## Fonte de verdade (decisão explícita)

Estratégia adotada: **camada híbrida versionada, com precedência documentada**.
Não existe segunda fonte de verdade por campo.

| Domínio | Fonte canônica | Onde muda |
|---|---|---|
| Slug, rota, componente, diretório de assets, modo de CTA | registries versionados (`src/config/portfolio-*.json`) | código/PR |
| Identidade, SEO, imagens, galeria, CTA (texto), divulgação, publicação, ciclo de vida | `public.portfolio_client_settings` | `/app/portfolio` |

Precedência em leitura: **banco > seed**. Campo vazio no banco herda o valor do
registry. Isso permite rollback (basta limpar o campo) e mantém o comportamento
atual enquanto nada é editado.

`src/config/portfolio-admin-seed.json` é a **projeção determinística** dos
registries + do contrato de conformidade. Ele é gerado por
`bun run build:portfolio-admin-seed` e verificado no prebuild
(`--check`), então nunca diverge silenciosamente do repositório.

## Contrato único de conformidade

`scripts/portfolio-conformance.mjs` é o único lugar onde as regras vivem.
Consumidores:

- `scripts/check-portfolio-projects.mjs` (gate de prebuild/CI)
- `scripts/build-portfolio-admin-seed.mjs` (seed do admin)
- `src/lib/portfolio-admin.ts` (reavaliação em runtime, mesmos códigos)

Códigos: `PORTFOLIO_BRAND_MISSING`, `PORTFOLIO_LOGO_MISSING`,
`PORTFOLIO_HERO_MISSING`, `PORTFOLIO_SOCIAL_IMAGE_MISSING`,
`PORTFOLIO_CTA_MISSING`, `PORTFOLIO_SEO_MISSING`, `PORTFOLIO_POPUP_MISSING`,
`PORTFOLIO_SHARE_COPY_MISSING`, `PORTFOLIO_COMPONENT_MISSING`.
Estados: `COMPLETE`, `PARTIAL`, `LEGACY`.

## Telas

| Rota | Função |
|---|---|
| `/app/portfolio` | Lista dos 68 projetos, busca, filtro por conformidade, resumo, importação idempotente dos registries |
| `/app/portfolio/:slug` | Identidade, SEO, imagens/galeria com upload, divulgação, prévia desktop/mobile e histórico |

Regras da tela de detalhe:

- **Salvar** grava rascunho; **Publicar** é ação separada e bloqueada quando
  houver falha bloqueante de conformidade.
- **Arquivar** nunca apaga: muda `lifecycle_status` para `archived`, despublica
  e remove do sitemap. Restaurar volta para `draft`.
- Slug, rota e componente são exibidos, mas não editáveis — projetos com
  componente próprio preservam sua arte.
- Concorrência otimista por `content_version`: salvar com versão defasada
  retorna erro pedindo recarregar.
- Todo campo alterado entra em `portfolio_client_settings_history`.

## Segurança e privacidade

- Todas as funções exigem sessão autenticada e papel `admin`/`super_admin`
  (`has_role` / `is_super_admin`), verificados no servidor.
- Campos administráveis rejeitam contatos operacionais (`wa.me`,
  `api.whatsapp.com`, `tel:`, `mailto:`). Contato de cliente continua exclusivo
  do funil, resolvido no servidor por `clientKey`.
- Assets aceitam apenas caminhos internos (`/images/...` ou
  `/api/public/portfolio-asset/...`). URL externa e `javascript:` são recusados.
- Uploads vão para o bucket **privado** `portfolio-admin` (máx. 4 MB, apenas
  JPEG/PNG/WebP/AVIF) e são servidos pela rota controlada
  `/api/public/portfolio-asset/*`, que valida o caminho e nunca lista o bucket.
- Leads do pop-up da 0WEB (`/app/leads/portfolio`) permanecem separados dos
  dados de contato dos clientes.

## Operação

```bash
bun run build:portfolio-admin-seed        # regenera o seed após mexer nos registries
bun run check:portfolio-projects          # gate de conformidade
bun test tests/portfolio/admin-registry.test.ts
```

## Limite conhecido desta versão

As edições feitas no admin ficam gravadas, auditadas e disponíveis para o
runtime (`mergeProject`), mas as páginas `/portfolio/:slug` com componente
próprio continuam renderizando o conteúdo definido em código. O consumo dessas
edições nas páginas públicas (SEO/OG primeiro, depois herói e galeria) é a
próxima etapa e deve ser feita rota a rota, com validação de SSR e prévia
social — não por atalho global.

## Runtime público (Rodada 3/4)

Fluxo comprovado: **ADMIN → `portfolio_client_settings` → resolver único → `/portfolio/:slug` (SSR)**.

- Resolver único: `src/lib/portfolio-runtime.ts`
  - `sanitizePortfolioRuntimeRow(slug, row)` — descarta contato operacional, HTML,
    URL externa e canonical arbitrária.
  - `applyPortfolioRuntime(base, overrides)` — política central
    `override_válido ?? registry`. Campo vazio no banco = rollback automático.
- Leitura pública sem sessão: `src/lib/portfolio-runtime.functions.ts`
  (`getPortfolioRuntimeOverrides`), tolerante a falha (`null` → página intacta).
- Consumo na rota `src/routes/portfolio.$slug.tsx`: `title`, `description`,
  `robots`, `keywords`, `og:*`, `twitter:*`, `canonical` e ícone.
- Componentes próprios: contexto `PortfolioRuntimeProvider` +
  `useManagedValue(campo, fallback)` — **custom component + managed data**.
  Nenhum componente perde imagem quando o banco está vazio.
- Social image administrada é servida pela rota pública controlada
  `/api/public/portfolio-asset/*` (bucket privado, MIME verificado, sem listagem);
  `social_version` entra como `?v=` para invalidar cache de crawler.
- Estados: `imported`/`published` = indexável; `draft`/`archived` =
  `noindex,nofollow` e fora do `sitemap-portfolio.xml`.
- Gate: `bun run check:portfolio-runtime-overrides` (também no prebuild) valida
  o contrato da rota e gera `reports/portfolio-runtime-matrix.md`.

### Evidência de SSR real (2026-09-04, preview)

| Passo | Resultado |
| --- | --- |
| baseline | `<title>Paulo Mestre de Obras</title>`, `robots index,follow` |
| override `seo_title` no banco | `<title>TESTE RUNTIME 0WEB — Paulo Mestre de Obras</title>` e `og:title` idêntico |
| `lifecycle_status = draft` | `robots noindex,nofollow` e URL fora do `sitemap-portfolio.xml` |
| limpar override + `published` | volta ao registry e ao sitemap |
