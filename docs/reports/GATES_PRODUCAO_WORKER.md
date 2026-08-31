# Gates de produção no worker (SSR, hidratação, funis)

Última execução local: worker real (`bun run preview:prod`, Wrangler + `dist/server/wrangler.json`).

## Causa-raiz corrigida

`/servicos/google-ads-299` devolvia **404 no worker** e 200 no dev. O motivo não
era roteamento: as leituras **públicas** de catálogo usavam o cliente
`supabaseAdmin` (service role). Como `SUPABASE_SERVICE_ROLE_KEY` não existe no
runtime de preview/CI, o `loader` caía no `catch`, não encontrava o slug no
fallback de arquivo e lançava `notFound()`.

Correção (também é ganho de segurança — menor privilégio):

- `src/lib/supabase-public.server.ts`: cliente server-side com a **chave
  publicável**, sujeito a RLS.
- Migrados para leitura pública: `services-public.functions.ts`
  (`listServicesPublic`, `getServicePublic`), `services-nav.functions.ts`
  (`listServicesNav`), `site-sections.functions.ts` (`getPageSections`),
  `hero-slides.functions.ts` (`listHeroSlides`).
  Políticas usadas: `services_public_read_active`, `site_sections public read`,
  `hero_slides public read`.
- Assinatura de imagens do bucket privado (`service-images`) continua exigindo
  credencial elevada e é **opcional**: sem ela a imagem degrada para `null`,
  sem derrubar a página.
- `redirects` e `ip_blocklist` **permanecem** em service role de propósito —
  são tabelas de operação/segurança e não devem ser legíveis por `anon`.

## Infraestrutura do worker

- `scripts/preview-prod.mjs` substitui o comando cru do Wrangler e repassa
  `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (e `SUPABASE_PROJECT_ID`) via
  `--var`; `wrangler dev` não herda o ambiente do processo.
- Porta configurável por `PREVIEW_PORT` (padrão 8080), para não colidir com o
  servidor de desenvolvimento em execuções locais.
- `wrangler` é dependência direta em `package.json`.

## Resultado dos gates

| Gate | Resultado |
| --- | --- |
| `bunx tsc --noEmit` | OK |
| `bun test` | 238 pass / 0 fail (27 arquivos) |
| `bun run build` | OK |
| `bun run validate:ssr-payload` | OK — 9 rotas com dehydrated state |
| `bun run test:e2e:hydration` | OK — 8 rotas, sem console error acionável |
| `bun run validate:portfolio-boundaries` | OK — 29 sites isolados |
| `bun run scan:source-privacy` | OK — nenhum contato operacional |
| `bun run validate:client-privacy` | OK — bundle público limpo (2 avisos em chunks de painel) |
| `bun run test:e2e:portfolio-funnels` | **Bloqueado no sandbox** — ver abaixo |

## Limitação declarada (não mascarada)

Os cenários de funil executam **escrita** (sessão + lead), que roda com service
role por decisão de segurança. `SUPABASE_SERVICE_ROLE_KEY` não é acessível no
ambiente Lovable Cloud/sandbox, então o gate falha localmente com
`Missing Supabase environment variable(s): SUPABASE_SERVICE_ROLE_KEY`.

Nada foi afrouxado em RLS para contornar isso. No CI o gate passa a ser real
assim que o segredo `SUPABASE_SERVICE_ROLE_KEY` estiver configurado no
repositório — `.github/workflows/portfolio-gates.yml` já o repassa ao worker.

## Ajuste em telemetria de terceiros

`src/lib/geo-location.ts` agora valida `response.ok` e aplica timeout de 2,5 s;
o gate de hidratação ignora falhas de rede de **origem externa** (ex.: 429 do
serviço de geolocalização), mas continua falhando em qualquer erro da própria
aplicação.
