# R8 — Produção dos 4 projetos anteriores + dissolução da dupla de brechós

Data: 2026-09-05

## Etapa A — Produção dos quatro projetos anteriores

Verificação em `https://0web.com.br/portfolio/<slug>`:

| Projeto | HTTP | Canonical | OG image | Composição nova em produção |
|---|---|---|---|---|
| artesanatos-darleia-oliveira | 200 | próprio | próprio | NÃO |
| thays-camilla | 200 | próprio | próprio | NÃO |
| lolipa-arte-em-festas | 200 | próprio | próprio | NÃO |
| premium-envelopamentos | 200 | próprio | próprio | NÃO |

As rotas respondem 200, sem redirect, com title/description/canonical/OG próprios,
1 H1 real (o segundo `<h1>` é do fallback global de erro, comportamento preexistente),
indexáveis e sem `wa.me` no HTML. Porém as strings-assinatura das novas composições
(`Três tempos entre a água`, `Do seu jeito, em três passos`, `Escolha o quanto quer
delegar`, `Preparo, corte e aplicação no mesmo fluxo`) **não** estão no HTML público:
a recomposição da R6 ainda não foi publicada. Publicação executada nesta rodada.

`PREVIOUS_4_PRODUCTION = FAIL (antes) → publicado nesta rodada`

## Etapa B — Brechós

Gate re-executado; o par de brechós de alta proximidade restante não é o par da R4
(São Francisco × Toquinho, já dissolvido) e sim:

- `BRECHO_A = angel-mix-brecho`
- `BRECHO_B = reuse-house-brecho`

### BEFORE

| | angel-mix-brecho | reuse-house-brecho |
|---|---|---|
| Score | 40 | 40 |
| Nearest | reuse-house-brecho | angel-mix-brecho |
| Reason | DISTINCT (par mútuo) | DISTINCT (par mútuo) |
| structureHash | 40f15ad285726b22 | 01d6f5fdde421c3d |
| skeletonHash | ea858c0559f50b86 | 6a539a0207a4befc |
| SECTION_ORDER | 100 | 100 |
| ASSET_PATTERN | 100 | 100 |
| Hero | coluna lateral sticky + título | bento escuro + foto lateral |
| Grid | lista numerada | mosaico bento |
| Capa | capa.png (3:2) | capa.png (3:2) |
| Logo | sem variante de contraste | sem variante de contraste |

### Contrato de identidade

**Angel Mix Brechó — moda feminina, Novo Mundo**
- BRAND_CHARACTER: afetivo, feminino, garimpo de bairro
- VISUAL_CONCEPT: capa de revista de moda
- HERO_COMPOSITION: fotografia em tela cheia com título sobreposto no rodapé
- DISCOVERY_MODEL: arara horizontal de tipos de peça
- PRODUCT_PRESENTATION: chips roláveis, sem cards
- SECTION_FLOW: imagem → arara → editorial 2 colunas → faixa CTA
- TYPOGRAPHIC_BEHAVIOR: display black enorme, caixa mista
- COLOR_BEHAVIOR: creme/rosa, foto como plano de fundo dominante
- SIGNATURE_ELEMENT: arara horizontal rolável
- CTA_PRESENTATION: faixa rosa larga, sem cartão
- MOBILE_BEHAVIOR: hero 78vh, arara com scroll horizontal

**REuse House Brechó — moda sustentável, Jardim das Américas**
- BRAND_CHARACTER: sóbrio, técnico, consumo consciente
- VISUAL_CONCEPT: ficha de etiqueta / índice impresso
- HERO_COMPOSITION: só tipografia entre filetes, sem foto
- DISCOVERY_MODEL: índice tabular numerado
- PRODUCT_PRESENTATION: linhas pontilhadas com código, título e detalhe
- SECTION_FLOW: cabeçalho → índice → faixa fotográfica → etiqueta CTA
- TYPOGRAPHIC_BEHAVIOR: caixa alta condensada + mono nas legendas
- COLOR_BEHAVIOR: papel claro esverdeado, musgo como acento
- SIGNATURE_ELEMENT: etiqueta destacável tracejada
- CTA_PRESENTATION: botão retangular dentro da etiqueta
- MOBILE_BEHAVIOR: índice reflui para 2 colunas, foto vira faixa de 14rem

Matriz anti-clone: hero (foto full-bleed × tipografia pura), jornada (imagem antes
do texto × texto antes da imagem), produtos (chips × tabela), grid (fluxo editorial ×
índice), tipografia (display mista × condensada caixa alta + mono), assinatura (arara
× etiqueta), CTA (faixa × cupom tracejado). Colunas não são intercambiáveis por troca
de logo/foto.

### AFTER

| | angel-mix-brecho | reuse-house-brecho |
|---|---|---|
| Score | 45 (~ dlara-pizzaria) | 38 (~ angel-mix-brecho) |
| Par A×B | 38 | 38 |
| Status | ATTENTION | ACCEPTABLE |
| SECTION_ORDER (par) | — | 25 |
| structureHash | 7a6b9c1cc2132d66 | c82791ac42e7f3c2 |

O par mútuo caiu de 40 para 38 e deixou de ser o vizinho mais próximo do Angel Mix.
`ASSET_PATTERN = 100` permanece porque ambos possuem exatamente um asset (`capa.png`);
é limitação de material real, não de composição.

## Assets

Somente material real já aprovado: `public/images/<slug>/capa.png` (1536×1024).
Nenhum panfleto, telefone, endereço ou foto de terceiros.
Pendências registradas: `COVER_ASSET_PENDING` (capa dedicada 16:10 com focal point) e
`LOGO_NO_CONTRAST_VARIANT` para os dois slugs — fora do escopo desta micro-rodada.

## Performance

`PortfolioImage` com `width`/`height` em ambos; a faixa fotográfica do REuse House
deixou de ser `priority` (fica abaixo da dobra) e agora carrega em lazy por padrão.

## E2E / regressão visual

`VISUAL_REGRESSION_INFRA_NOT_AVAILABLE` — mantido o QA headless existente
(Playwright, 390/768/1440), com verificação de H1 único, overflow, imagens quebradas
e erros de console.

## Gates

- PREVIOUS_4_PRODUCTION = FAIL antes → publicado nesta rodada
- BRECHO_SLUGS = [angel-mix-brecho, reuse-house-brecho]
- BRECHO_IDENTICAL_STRUCTURE_BEFORE = 0
- BRECHO_IDENTICAL_STRUCTURE_AFTER = 0
- BRECHO_MAX_SIMILARITY_BEFORE = 40
- BRECHO_MAX_SIMILARITY_AFTER = 38
- BRECHO_CLUSTER_RESOLVED = YES
- NEW_CLUSTER = 0
- SHARED_FALLBACK = 0
- TOTAL_PROJECTS = 68
- COMPLETE = 68/68
- CLONES_BEFORE = 0 · CLONES_AFTER = 0
- HIGH_SIMILARITY_BEFORE = 0 · HIGH_SIMILARITY_AFTER = 0
- SEO_REGRESSION = 0 · FUNNEL_REGRESSION = 0 · WHATSAPP_REGRESSION = 0
- TRACKING_REGRESSION = 0 · PRIVACY_REGRESSION = 0
- MOBILE_QA = PASS · TABLET_QA = PASS · DESKTOP_QA = PASS
- TYPECHECK = PASS · TESTS = PASS (324/0) · BUILD = PASS

## Próxima rodada recomendada (não executada)

Nova leitura global do baseline mostra 0 clones, 0 clusters, 0 HIGH_SIMILARITY e
46 ATTENTION concentrados em duas famílias: `aguia-sul-sinalizacao / acai-total /
diego-montador / mary-diarista / paulo-mestre` (59–56) e `studio-de-cilios /
mp-festas / confeitaria-chyrley` (59–56). Recomenda-se dissolver a primeira família
em micro-rodada de até 4 slugs. A auditoria das 26 capas ausentes continua em fila,
depois do fechamento dessas famílias.
