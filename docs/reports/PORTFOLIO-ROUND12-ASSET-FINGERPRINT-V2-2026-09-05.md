# Rodada 12 — Fingerprint de assets v2 (corrigir o medidor, não os projetos)

Data: 2026-09-05 · Escopo: exclusivamente técnico (gate de originalidade).
Nenhuma página pública, capa, logo, copy, CTA, SEO, canonical, sitemap, funil,
WhatsApp, tracking, rota ou tabela foi alterada nesta rodada.

## Problema corrigido

A métrica v1 calculava `ASSET_PATTERN_SIMILARITY` a partir do **basename**
normalizado dos arquivos (`hero.jpg`, `logo.png`, `servicos.webp`). Dois clientes
com fotos completamente diferentes atingiam 100% nessa dimensão apenas por usarem
nomes de arquivo iguais.

## O que passou a existir

`scripts/portfolio-asset-fingerprint.mjs` (`ASSET_METRIC_VERSION = 2`):

- referência canônica normalizada (path/URL, sem query, case-insensitive);
- hash SHA-256 truncado do conteúdo real do arquivo local;
- perfil de mídia: mime, faixa de bytes, dimensões e proporção;
- basename mantido apenas como informação, nunca como prova de duplicação;
- reason codes: `IDENTICAL_ASSET_CONTENT`, `SHARED_ASSET_REFERENCE`,
  `PERCEPTUAL_ASSET_MATCH` (reservado), `SAME_BASENAME_ONLY`, `DISTINCT_ASSET`,
  `NO_ASSET`;
- comparação com 85% de peso em identidade real e 15% em perfil; ausência de
  assets nunca gera similaridade.

`scripts/portfolio-originality.mjs` passou a exportar `ORIGINALITY_METRIC_VERSION = 2`
e aceita `metricVersion` em `analyzePortfolio`/`compareFingerprints`. A v1 continua
computável para comparação. **Pesos e fórmula estrutural inalterados**
(`structure .28 · sectionOrder .22 · component .18 · style .13 · copy .12 ·
assetPattern .04 · identity .03`). O hash do logo entrou em `IDENTITY`.

## Evidência real (mesmo nome, arquivos diferentes)

```
hbk-iluminacao-led × jc-revestimentos
hero-og.jpg   cafc9427…  vs 348a7e19…
hero.webp     8b95129c…  vs 7c367ba0…
logo.png      fc329089…  vs ed7fdaf6…
servicos.webp a59d9d1a…  vs 92290cbb…

brecho-sao-francisco × toquinho-de-gente-brecho
capa-card.jpg fc27d7f9…  vs cb4ffb70…
capa-og.jpg   8b564588…  vs 86974333…
capa.png      4807f898…  vs d23a3d34…
```

## V1 × V2

| Projeto | V1 | V2 | ASSET v1 → v2 | Classificação |
|---|---|---|---|---|
| toquinho-de-gente-brecho | 52 | 46 | 100 → 15 | METRIC_CORRECTION |
| woodhouse-hamburgueres | 52 | 46 | 100 → 15 | METRIC_CORRECTION |
| raphael-construcoes | 40 | 34 | 100 → 9 | METRIC_CORRECTION |
| ton-e-cor | 40 | 34 | 100 → 9 | METRIC_CORRECTION |
| hbk-iluminacao-led | 39 | 32 | 100 → 9 | METRIC_CORRECTION |
| jc-revestimentos | 39 | 32 | 100 → 9 | METRIC_CORRECTION |
| marmitaria-dom-diego | 38 | 32 | 100 → 15 | METRIC_CORRECTION |
| brecho-sao-francisco | 31 | 24 | 100 → 15 | METRIC_CORRECTION |

Resumo: V1 `0 clones · 0 acima de 60 · 0 clusters`; V2 idem. 7 vizinhos mais
próximos mudaram. Nenhuma perda de sensibilidade: duplicação real por bytes
continua marcada como `IDENTICAL_ASSET_CONTENT`.

Estado V2: 68 projetos · 0 ORIGINAL · 26 ACCEPTABLE · 42 ATTENTION ·
0 HIGH_SIMILARITY · 0 CLONE · 0 SHARED_FALLBACK · 0 clusters ·
34 capas válidas · 34 pendentes.

## Baselines

- `reports/portfolio-originality.baseline.json` — v1, preservada intacta.
- `reports/portfolio-originality.baseline.v2.json` — criada nesta rodada.
- `reports/portfolio-originality-v1-v2.md` — comparação gerada automaticamente.

## Testes

`tests/portfolio/asset-fingerprint.test.ts` — 10 casos:
mesmo basename/bytes diferentes, bytes iguais em paths diferentes, mesma URL,
`logo.svg` homônimo com marcas distintas, placeholder SVG reutilizado, ausência
de assets, falso 100 da v1 corrigido, duplicação real preservada, e versão da
métrica com pesos idênticos entre v1 e v2.

## Painel

`/app/portfolio/originalidade` passou a exibir a versão da métrica e o delta
V1 → V2, com a nota de que a queda é correção de medição.

## Gates

- `check:portfolio-originality --report --enforce` — regressão PASS
- `validate:portfolio-boundaries` — OK
- `check:portfolio-projects` — 68 COMPLETE
- `tsgo --noEmit` — limpo
- `bun test` — 348 testes, 0 falhas, 1715 assertions
- `bun run build` — OK, auditoria de privacidade do bundle público limpa

## Autorização de pedidos (prova server-side)

Probe transacional com rollback, usando um usuário **sem papéis** (a tentativa
anterior usou por engano a conta admin):

```
CASE1_CUSTOMER_MARK_PAID=DENIED_PASS (not allowed to set order status to paid)
CASE2_CUSTOMER_CHANGE_TOTAL_APPLIED=100.00 (total preservado pelo trigger)
CASE3_ANON=DENIED_PASS
CASE4_CUSTOMER_CANCEL=ALLOWED_PASS
CASE5_ADMIN_MARK_PAID=ALLOWED_PASS
```

`PAYMENT_SERVER_AUTHORIZATION = PASS`. Nenhuma alteração de arquitetura de
pagamento foi feita.

## Pendências herdadas (não abertas nesta rodada)

- Publicação pós-R11 não confirmada: `/images/eisenfer-tubos-acos/capa-card.jpg`
  ainda retorna 404 em produção.
- 34 capas pendentes (`CONTACT_OR_PII 8 · PROMOTIONAL_MATERIAL 2 · LOGO_ONLY 10 ·
  NO_REAL_ASSET 14`).
- Matching perceptual (pHash) permanece reservado como evolução futura.
