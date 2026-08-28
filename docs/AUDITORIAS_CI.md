# Auditorias automatizadas no CI (rotas, ícones, indexabilidade e visual)

Todos os comandos rodam contra uma URL real (`BASE_URL` / `E2E_BASE_URL`).
Nenhum relatório estima ou inventa métricas: só registra o que foi observado por HTTP
ou por navegador headless.

## Comandos

| Comando | O que faz | Saída |
| --- | --- | --- |
| `bun run validate:link-previews` | `og:image` / `twitter:image` / ícones por rota (HTTP) | `seo-reports/link-preview-report.json` |
| `bun run validate:head-icons` | Todos os `<link rel="icon\|apple-touch-icon\|mask-icon">`: status 200, `Content-Type` coerente com a extensão, `sizes="NxN"` batendo com os bytes, apple-touch-icon ≥ 180×180 e nunca em WebP/SVG | `seo-reports/head-icons-report.json` |
| `bun run audit:indexability:before` | Snapshot de robots, sitemap (index + filhos), canonicals, `noindex/nofollow`, redirects e schemas — normalmente contra produção | `seo-reports/indexability-before.json` |
| `bun run audit:indexability:after` | Mesmo snapshot no build atual + diff antes/depois | `seo-reports/indexability-after.json`, `seo-reports/indexability-diff.md` |
| `bun run test:visual` | Regressão visual da home e de cada `/portfolio/:slug` em desktop (1280), tablet (834) e mobile (393) | `tests/visual/baseline/`, diffs em `seo-reports/visual/` |
| `bun run audit:report` | Consolida tudo por rota, gera resumo do CI e publica os dados do painel | `seo-reports/ci-audit-summary.md`, `public/audit/*.json` |

`INDEXABILITY_STRICT=1` faz o diff falhar quando há regressão (status, canonical,
`noindex` novo ou perda de schema).

## Geração de imagens sociais

`node scripts/generate-social-jpg.mjs` roda no `prebuild`: cria as imagens sociais
1200×630 em JPEG que estiverem faltando, a partir dos assets do próprio cliente,
e atualiza `socialVersion` (SHA-1 de 8 caracteres) para cache-busting em
`og:image` / `twitter:image`. Ao criar um novo `/portfolio/:slug`, basta cadastrar
`icon` em `src/config/portfolio-assets.json` — o próximo build gera o restante.

Ícone iOS: `apple-touch-icon` precisa ser PNG ≥ 180×180. WebP não é renderizado
pelo iOS e o portão `validate:head-icons` bloqueia.

## Painel interno

`/painel-auditorias` (protegido por `PainelGate`, `noindex`) lê `public/audit/latest.json`
e `public/audit/history.json`:

- tabela por rota com HTTP, canonical, ícones, prévias, Lighthouse e lista de problemas;
- filtro por rota/slug e por "só rotas com problemas";
- exportação CSV e JSON;
- histórico dos últimos 30 deploys, com média de Performance/SEO e link para o run do CI.

## Pipeline

`.github/workflows/portfolio-gates.yml` executa, após o build e com o preview no ar:
pop-up, funis, prévias de link, ícones do `<head>`, indexabilidade (before/after),
acessibilidade (axe-core), regressão visual e, por fim, `audit:report`, que também
escreve o resumo no `$GITHUB_STEP_SUMMARY` e sobe os artefatos.

## Achado aberto (não corrigido automaticamente)

O `sitemap.xml` é um índice e 8 URLs aparecem em mais de um sitemap filho
(`/portfolio`, `/blog`, `/solucoes`, `/solicitar-orcamento`, `/blog-skyscraper` e três
portfólios com rota dedicada). Não bloqueia indexação, mas a deduplicação entre
`sitemap-pages.xml` e os sitemaps temáticos deve ser tratada na geração —
alteração de escopo maior, registrada aqui em vez de aplicada às cegas.

## Analytics — rejeição 42501 em `analytics_events` (corrigido)

Causa raiz confirmada por reprodução HTTP com a chave pública:

- `POST /analytics_events?on_conflict=id` (upsert) → `401 / 42501` "new row violates row-level security policy";
- `POST /analytics_events` (INSERT puro) → `201`.

O PostgREST exige política de UPDATE para resolver `on_conflict`; a tabela só
possui políticas de INSERT (`anon_insert_events` / `auth_insert_events`, com
`event_name IS NOT NULL AND length(event_name) <= 64`). Nenhum evento legítimo
era barrado pelo limite de 64 caracteres — o bloqueio vinha do upsert.

Correção em `src/lib/analytics-queue.ts`:

- envio por INSERT puro com `id` gerado no cliente;
- `23505` (chave duplicada) tratado como sucesso → idempotência preservada;
- `sanitizeEventName()` normaliza/trunca `event_name` em 64 caracteres e
  descarta eventos inválidos com `console.warn`, sem reenfileirar (evita retry
  infinito).

Não alterar a política de RLS para permitir UPDATE anônimo: eventos analíticos
são append-only.

## Regressão visual estável (`/`, `/portfolio`, `/portfolio/:slug`)

`bun run test:visual` cobre 31 rotas × 3 viewports (desktop 1280×900, tablet
834×1112, mobile 393×852) = 93 capturas.

Fontes de ruído eliminadas — sem elas a home acusava até 28% de pixels
alterados sem nenhuma regressão real:

- **Variantes A/B** (`hero_copy`, `hero_cta`, `hero_primary_cta`,
  `home_spotlight_copy`, `testimonials_headline`) eram sorteadas por sessão.
  O script fixa a variante `A` gravando `0web_ab_winner_v1` via `addInitScript`.
- **Blocos voláteis por dados** (`#servicos-destaque`, `#spotlight`, e qualquer
  elemento marcado com `data-visual-volatile="true"`) ficam com
  `visibility: hidden` — o layout é preservado, o conteúdo não entra no diff.
- **Camadas fixas/sticky** (chatbot, banner de consentimento, CTAs flutuantes,
  toasts) são ocultadas logo antes do screenshot.
- Animações, transições e caret são congelados.

Variáveis: `VISUAL_THRESHOLD` (padrão 0.02), `VISUAL_CONCURRENCY`,
`VISUAL_ROUTE_TIMEOUT_MS`, `VISUAL_ONLY=<nome-da-rota>`.
Regravar referências: `bun run test:visual -- --update` (a primeira execução
após mudança de UI real precisa disso; sempre revise o diff antes).

## Regeneração manual de imagens sociais

`bun run social:regen` (ou `bun run social:regen -- <clientKey> …`) regera, a
partir da imagem fonte real de cada cliente:

- `og:image` / `twitter:image` → JPEG 1200×630 (WhatsApp e Facebook não leem WebP);
- `apple-touch-icon` → PNG 180×180 (iOS ignora WebP/SVG nesse slot);
- `socialVersion` (SHA-1 de 8 caracteres) usado como cache-busting das prévias.

Roda como worker/CLI em Node com ImageMagick. **Não** existe endpoint
serverless equivalente: o runtime de borda do site não possui ImageMagick nem
filesystem gravável. Cada execução grava
`public/audit/social-regen-history.json` (50 execuções, com executor, escopo e
totais), exibido em `/painel-auditorias`.

## Painel de eventos de analytics descartados

Quando `sanitizeEventName()` rejeita um `event_name` (nulo, vazio ou fora do
limite de 64 caracteres da RLS), o evento original é descartado — mas agora um
evento sentinela `analytics_event_discarded` é gravado com `path`, `page` e
`metadata_json = { reason, original_event_name }`. O sentinela nunca se
auto-reporta, evitando laço.

`/painel-auditorias` agrupa esses descartes por rota + `event_name` inválido +
motivo, com janela configurável (1 h a 7 dias) e limiar de alerta (padrão 20
descartes na janela). A leitura de `analytics_events` continua restrita a
administradores pela RLS existente.

## Rotinas agendadas (ops jobs)

Rotinas periódicas passam pelo runner `src/lib/ops-jobs.server.ts`, que grava
cada execução em `ops_job_runs` e mantém estado em `ops_job_control`:

- **lock single-flight** — execução concorrente da mesma rotina é recusada
  (`already_running`), com liberação automática após 15 min de execução travada;
- **pausa manual** — `ops_job_control.paused = true` desliga a rotina sem deploy;
- **circuit breaker** — 3 falhas consecutivas abrem o circuito por 1 h.

Endpoints (todos exigem o header `x-cron-secret`):

| Rotina | Endpoint | Função |
|---|---|---|
| `analytics_discards_scan` | `POST /api/public/hooks/discards-scan?hours=24&threshold=20` | avalia telemetria descartada e alerta por WhatsApp |
| `social_images_regen` | `POST /api/public/hooks/social-regen-log` | recebe o resultado do worker de imagens sociais |

O worker `bun run social:regen` envia o histórico automaticamente quando
`SOCIAL_REGEN_HOOK_URL` e `CRON_SECRET` estão definidos. O `/painel-auditorias`
exibe execuções, duração, erro e estado do circuito na seção "Rotinas agendadas".
