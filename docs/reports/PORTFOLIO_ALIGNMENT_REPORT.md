# Relatório de Alinhamento do Catálogo /portfolio

Data: 2026-01 (rodada de alinhamento do catálogo escalável)

## 1. Commits

- Commit inicial: **não comprovável** neste ambiente. O workspace do Lovable não expõe
  operações Git (`git log`, `checkout`, `push`); trabalhei sobre o snapshot atual do
  projeto, que corresponde ao estado sincronizado da `main`.
- Commit final: **não comprovável** pelo mesmo motivo.

## 2. Branch

- Branch dedicada `codex/...` e Pull Request: **não criados** — o ambiente não permite
  comandos Git com estado. As alterações estão no snapshot do projeto e devem ser
  levadas para uma branch rastreável no repositório GitHub antes do merge (instruções
  na seção 13).

## 3. Arquivos alterados nesta rodada

| Arquivo | Motivo |
|---|---|
| `scripts/playwright-portfolio-popup.mjs` | Relançamento automático do Chromium + retry por slug (o gate quebrava por crash de infraestrutura após ~7 rotas) |
| `src/components/site/Picture.tsx` | Só emite `<source>` AVIF/WebP quando as variantes existem de fato (`blog-*`/`og-*` locais); evita 404 em assets externos |
| `src/routes/blog.index.tsx` | Cards do blog passam a usar `<Picture>` (AVIF/WebP) e o primeiro card recebe `priority` (LCP) |
| `src/components/site/RenataBeautyView.tsx` | Imagem do hero deixa de ser `lazy`, ganha `fetchpriority="high"` e o fallback externo (Unsplash) foi trocado pelo asset local `renata-beauty-promo.png` |

## 4. Funcionalidades confirmadas

- Catálogo canônico único em `src/config/portfolio-catalog.json` (32 itens, 29 clientes),
  validado por `validate:portfolio-catalog`.
- Isolamento por cliente, `PortfolioUpsellPopup` e `PortfolioHostCredit` preservados
  (`validate:portfolio-boundaries` — 29 sites isolados).
- Funis individuais por `clientKey`, com destinatário resolvido apenas no servidor.
- Web Vitals por slug persistidos no backend com RLS restritiva e fallback seguro.

## 5. Migrations

- `supabase/migrations/20260828001000_create_portfolio_web_vitals.sql` (já aplicada):
  tabela `portfolio_web_vitals` com checks de `slug`, `metric` (LCP/CLS/INP) e `value`,
  índice `(slug, metric, captured_at desc)`, RLS habilitada, `revoke all` de `anon` e
  `authenticated`, `grant insert` somente para `service_role`. Nenhuma PII é coletada.
- Nenhuma migration nova foi criada nesta rodada.

## 6. URL avaliada

- Produção: `https://0web.com.br` (usada como `LHCI_TARGET_URL`).
- Importante: o Lighthouse mediu o **deploy atual**, ou seja, ainda **sem** as correções
  de imagem descritas na seção 3.

## 7. Scores Lighthouse (média de 2 execuções, desktop)

| URL | Perf | SEO | A11y | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| `/` | 87 | 100 | 95 | 1777 ms | 0.000 | 6 ms |
| `/blog` | 79 | 100 | 98 | 3427 ms | 0.000 | 0 ms |
| `/blog/3-palavras-chatgpt-respostas-inteligentes` | 93 | 100 | 98 | 1166 ms | 0.000 | 0 ms |
| `/servicos` | 88 | 100 | 97 | 1218 ms | 0.003 | 26 ms |
| `/servicos/criacao-de-sites` | 90 | 100 | 95 | 1683 ms | 0.000 | 0 ms |
| `/portfolio` | 91 | 100 | 98 | 1379 ms | 0.000 | 11 ms |
| `/portfolio/dyzpromo` | 82 | 100 | 96 | 2493 ms | 0.000 | 9 ms |
| `/portfolio/renata-beauty` | 82 | 100 | 95 | 2775 ms | 0.002 | 0 ms |

INP não é reportado pelo Lighthouse em modo lab; a coleta de INP real ocorre via
`portfolio_web_vitals` (campo de campo/RUM), não por este relatório.

A execução do `lhci` **abortou** em `/portfolio/r_beauty` com erro de infraestrutura do
próprio LHCI (`ENOENT unlink .lighthouseci/flags-*.json`, limpeza de arquivo temporário),
não por falha de budget. Os 21 slugs restantes **não foram medidos** nesta rodada.

Principais causas identificadas nos relatórios coletados:
- `/blog`: capas servidas em JPEG full-size (`modern-image-formats` ~2.8 MB,
  `uses-responsive-images` ~3.2 MB) e LCP em card lazy.
- `/portfolio/renata-beauty`: `prioritize-lcp-image` (hero em lazy) e imagens não modernas.

## 8. Resultado dos testes executados

| Comando | Resultado |
|---|---|
| `bun run validate:portfolio-catalog` | OK — 32 itens, 29 clientes |
| `bun run validate:portfolio-boundaries` | OK — 29 sites isolados |
| `bun run validate:portfolio-meta` | OK — 6 rotas |
| `bun run validate:portfolio-scaffold` | OK — 29 projetos |
| `bun run validate:portfolio-performance` | OK — 29 projetos, 0 aviso |
| `bun run scan:source-privacy` | OK — nenhum contato operacional em código público |
| `bun test` | OK — 238 testes, 861 asserts |
| `bun run build` | OK — bundle público limpo (354 chunks, 2 avisos apenas em chunks de painel autenticado) |
| `bun run audit:a11y` | OK — `/` e `/servicos`, 0 violação serious/critical |
| `bun run test:e2e:portfolio-popup` | OK — 29 sites com pop-up único e consistente (após correção do script) |
| `bun run test:e2e:portfolio-funnels` | OK — 58 cenários (desktop+mobile), 0 falha; cenários sem secret de destinatário retornam 503 por contrato |
| `bun run test:visual` | OK — 93 comparações dentro do limiar, 0 baseline nova |
| `bun run lhci` | **FALHOU** — abortou por erro interno do LHCI após 8 URLs (ver seção 7) |

## 9. Budgets utilizados (`.lighthouserc.cjs`, inalterados)

Performance ≥ 0.90 · SEO ≥ 0.95 · Accessibility ≥ 0.95 · LCP ≤ 2500 ms ·
CLS ≤ 0.1 · TBT ≤ 200 ms · FCP ≤ 1800 ms (warning). Nenhum budget foi afrouxado.

## 10. Pendências reais

1. `lhci` não conclui a suíte completa: erro de limpeza de arquivo temporário do LHCI.
   Precisa de execução em ambiente com `.lighthouseci` estável ou `--numberOfRuns=1`
   por lote para cobrir os 29 slugs.
2. Budget de Performance reprovado em `/` (87), `/blog` (79), `/servicos` (88),
   `/portfolio/dyzpromo` (82) e `/portfolio/renata-beauty` (82).
3. Budget de LCP reprovado em `/blog` (3427 ms) e `/portfolio/renata-beauty` (2775 ms).
   As correções da seção 3 atacam exatamente essas duas causas, mas **só poderão ser
   confirmadas após novo deploy e nova medição**.
4. Imagens Unsplash de terceiros ainda presentes em `src/routes/sites.$vertical.tsx`,
   `src/routes/portfolio.index.tsx`, `src/routes/servicos.gestao-redes-sociais.tsx` e em
   galerias do `RenataBeautyView.tsx` — substituição exige assets locais equivalentes
   reais, que não existem hoje para todos os casos.
5. Branch/PR/commit e deploy rastreável não realizados (limitação do ambiente).

## 11. Alertas do linter Supabase (preexistentes, não alterados)

85 achados, em 5 categorias:
- 1 × RLS habilitada sem policy (INFO)
- 5 × views com `SECURITY DEFINER` (ERROR)
- 3 × materialized views expostas à API (WARN)
- 38 × funções `SECURITY DEFINER` executáveis por `anon` (WARN)
- 38 × funções `SECURITY DEFINER` executáveis por `authenticated` (WARN)

Nenhuma policy legada foi alterada nesta rodada.

## 12. Diferenças entre o estado anterior e o atual

- Antes: `test:e2e:portfolio-popup` quebrava por crash do Chromium após ~7 rotas
  (22 erros de infraestrutura). Agora: 29/29 sites aprovados.
- Antes: capas do blog em JPEG único e hero da Renata Beauty em `lazy`.
  Agora: AVIF/WebP com fallback seguro e hero priorizado para LCP.
- Antes: fallback de imagem do hero apontava para CDN externa. Agora: asset local.
- Catálogo, isolamento, funis, migrations e budgets permanecem inalterados.

## 13. Instruções para merge e deploy

1. No clone local do repositório:
   `git checkout main && git pull && git checkout -b codex/portfolio-alignment`
2. Aplicar o snapshot atual do projeto, revisar o diff dos 4 arquivos da seção 3 e commitar.
3. `bun install --frozen-lockfile` (nunca gerar `package-lock.json`).
4. Rodar todos os gates da seção 8 antes de abrir o PR.
5. Abrir Pull Request referenciando este relatório; **não** publicar direto na `main`.
6. Após o merge e o deploy, reexecutar
   `LHCI_TARGET_URL=https://0web.com.br bun run lhci` para revalidar `/blog` e
   `/portfolio/renata-beauty` contra os budgets.
