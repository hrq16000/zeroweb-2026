# Cluster local — Criação de site institucional (2026-09-02)

## O que foi entregue

- `/criacao-de-site-institucional` virou hub do cluster (rota layout + `index`),
  com seção "Atendimento por capital" agrupada por região.
- 27 páginas locais em `/criacao-de-site-institucional/<capital>` geradas a partir
  de `src/lib/capitais.ts` (todas as capitais brasileiras + DF).
  Cada página tem H1, título, description, canonical e conteúdo próprios,
  além de JSON-LD `Service` (`areaServed: City`), `FAQPage` e `BreadcrumbList`.
- Slug inválido responde 404 com `noindex`.
- Novo `sitemap-institucional.xml`, registrado no índice `sitemap.xml`.
- Workflow `.github/workflows/gsc-daily.yml` executa `bun run gsc:export` todo dia
  às 06h BRT e commita o snapshot lido por `/app/seo`.

## Search Console

Mantido o conector Google Search Console da Lovable (não há service account
própria). Secrets necessários no CI: `LOVABLE_API_KEY` e
`GOOGLE_SEARCH_CONSOLE_API_KEY`. A keyword "criação de site institucional" já é
monitorada em `WATCHED_KEYWORDS` (`src/lib/seo-dashboard.functions.ts`) e aparece
no painel `/app/seo`.

## Não implementado (por decisão editorial)

- Seção de depoimentos e logos de clientes: omitida enquanto não houver prova
  auditável com nome, cargo, empresa e autorização. Regra de credibilidade do
  repositório: não publicar métrica, depoimento ou selo sem fonte.
- Prazos e preços fixos ("5 a 10 dias", "R$ 197,99"): não publicados a pedido do
  responsável; as páginas usam linguagem qualitativa e remetem ao diagnóstico.

## Validação

- `bun run build` OK (canonicals, client-privacy, contato público, sitemaps).
- SSR verificado: hub 200, `/curitiba` com título local correto, slug inválido 404.
