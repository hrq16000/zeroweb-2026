# IMAGE_PERFORMANCE — Inspeção READ-ONLY (2026-09-05)

`FILES_OPTIMIZED = 0` · `PUBLIC_ASSETS_CHANGED = 0` · `VISUAL_CHANGED = NO`.
Nenhum arquivo foi gerado, movido ou substituído. Apenas medição.

## 1. Estado atual

- `public/images` total: **176 MB**, 378 arquivos.
- Arquivos > 1 MB: **75**, somando **143,2 MB** (81% do peso total).
- PNG fotográfico **sem alpha real**: **67 arquivos · 129,7 MB** — é a
  origem principal do desperdício.
- Apenas 7 dos 12 piores possuem variante `.webp` irmã; os 5 restantes não têm.

## 2. Top 20 piores (tamanho · dimensões · formato · alpha real)

| MB | WxH | fmt | alpha | arquivo | classe |
|---:|---|---|---|---|---|
| 3,06 | 1024x1536 | PNG | não | vila-da-capivara/revenda.png | P2 |
| 2,83 | 1220x1097 | PNG | não | vila-da-capivara/capa.png | P1 |
| 2,71 | 1536x1024 | PNG | não | reuse-house-brecho/capa.png | P1 |
| 2,67 | 1536x1024 | PNG | não | brecho-sao-francisco/capa.png | P1 |
| 2,66 | 1731x909 | PNG | não | portfolio-kit/stationery-base.png | P3 |
| 2,65 | 1024x1536 | PNG | não | vila-da-capivara/kit-10.png | P2 |
| 2,60 | 1536x1024 | PNG | não | toquinho-de-gente-brecho/capa.png | P1 |
| 2,58 | 1536x1024 | PNG | não | angel-mix-brecho/capa.png | P1 |
| 2,50 | 1254x1254 | PNG | sim | r-beauty-icon.png | P1 (ícone) |
| 2,49 | 1086x1448 | PNG | não | vila-da-capivara/kit-50.png | P2 |
| 2,47 | 1086x1448 | PNG | não | vila-da-capivara/kit-70.png | P2 |
| 2,46 | 1024x1536 | PNG | não | vila-da-capivara/editorial.png | P2 |
| 2,41 | 1024x1536 | PNG | não | confeitaria-sabor-da-realeza/hero.png | **P0** |
| 2,36 | 1086x1448 | PNG | não | vila-da-capivara/kit-100.png | P2 |
| 2,33 | 1200x1600 | PNG | não | sos-presentes-cosmeticos/cestas-feliz-aniversario.png | P2 |
| 2,33 | 1536x1024 | PNG | não | marmitaria-dom-diego/capa.png | P1 |
| 2,29 | 1024x1536 | PNG | não | vila-da-capivara/kit-20.png | P2 |
| 2,27 | 1730x909 | PNG | não | artesanatos-darleia-oliveira/hero-og.png | **P0** |
| 2,26 | 1672x941 | PNG | não | confeitaria-chyrley/editorial-gerada.png | P2 |
| 2,25 | 899x1599 | PNG | não | confeitaria-chyrley/bolos.png | P2 |

Rotas afetadas: `/portfolio` (grade de capas — todas as `capa.png`) e
`/portfolio/:slug` (hero, og, galeria). `portfolio-kit/*` e `concepts/*` são
material interno/administrativo (P3).

## 3. Desperdício identificado

- **PNG fotográfico sem alpha**: 67 arquivos, 129,7 MB. Conversão para WebP
  q80 reduz 86–94% nos casos medidos.
- **Duplicação exata por hash**:
  - `paraiso-do-hot-dog/capa.png` = `paraiso-hot-dog-cover.png`
  - `beto-pasteis/capa.png` = `concepts/casa-nativa-concept.png`
  - `woodhouse-hamburgueres/capa.png` = `concepts/clinica-integrada-concept.png`
- **Oversize moderado**: capas 1536x1024 exibidas em cards de ~400–800 px;
  há espaço para variante responsiva além da troca de formato.
- **Original servido sem variante**: 5 dos 12 piores não têm `.webp` irmão.

## 4. Equivalência visual

Todas as imagens de `/portfolio` passaram por auditoria de autenticidade, PII,
crop e focal point. Portanto, para todo candidato:
`VISUAL_EQUIVALENCE_REQUIRED = YES` — só recompressão/redimensionamento do
mesmo enquadramento; nunca substituição de imagem, novo crop ou arte gerada.

## 5. Estimativa medida (WebP q80, em memória, nada gravado)

| Amostra | Atual | WebP q80 | Economia |
|---|---:|---:|---:|
| 12 piores arquivos | 31,7 MB | 2,9 MB | **~91%** |
| Projeção nos 67 PNGs sem alpha | 129,7 MB | ~13 MB | ~117 MB |

## 6. Plano de micro-ondas (não executado)

- **Onda A (recomendada como primeira)** — 10 capas/heroes públicos de maior
  custo real: `confeitaria-sabor-da-realeza/hero.png`,
  `artesanatos-darleia-oliveira/hero-og.png`, e as capas de
  `reuse-house-brecho`, `brecho-sao-francisco`, `toquinho-de-gente-brecho`,
  `angel-mix-brecho`, `marmitaria-dom-diego`, `dlara-pizzaria`,
  `beto-pasteis`, `vila-da-capivara`. Atual ≈ 25 MB → estimado ≈ 2,3 MB.
- **Onda B** — demais capas frequentes e og/social restantes.
- **Onda C** — galerias abaixo da dobra, `vila-da-capivara/kit-*`,
  `sos-presentes-cosmeticos/*` e assets internos (`portfolio-kit`, `concepts`),
  incluindo a resolução das 3 duplicações.

Nada foi alterado nesta execução; a Onda A permanece apenas recomendada.
