# Rodada 6 — Consolidação A&G/LK + dissolução da subfamília de maior similaridade

Data: 2026-09-05 · Escopo: originalidade do /portfolio (nada além disso)

## Etapa A — A&G e LK em produção

Ambas já estavam publicadas; **nenhuma publicação nova foi disparada nesta etapa**.

| Item | ag-electrical-services | lk-alvenaria |
|---|---|---|
| HTTP | 200 | 200 |
| Title | A&G Electrical Services | LK Alvenaria |
| Description | própria | própria |
| Canonical | https://0web.com.br/portfolio/ag-electrical-services | https://0web.com.br/portfolio/lk-alvenaria |
| OG title/image | próprios (social-2026-og.jpg) | próprios (portfolio-og.jpg) |
| H1 de conteúdo | 1 | 1 |
| PII visível | NO | NO |
| Composição nova servida | sim (quadro/circuito) | sim (cronograma de obra) |

Observação: o HTML de todas as páginas do site contém um `<h1>` extra dentro do
fallback global de erro (não renderizado ao usuário). Estado pré-existente,
igual em heloa-gas e demais rotas — **não é regressão desta campanha** e fica
registrado para a rodada técnica de SSR.

- AG_PRODUCTION = PASS
- LK_PRODUCTION = PASS

## Etapa B — Grupo recalculado

Gate re-executado. Não existiam clusters nem clones; o maior grupo real era o
conjunto mútuo de HIGH_SIMILARITY (score 63):

| Slug | Nome | Segmento | Score antes | Nearest match | Reason |
|---|---|---|---|---|---|
| artesanatos-darleia-oliveira | Artesanatos Darléia Oliveira | artesanato / café | 63 | thays-camilla | NEAR_DUPLICATE_LAYOUT |
| thays-camilla | Thays Camilla Personalizados | presentes personalizados | 63 | artesanatos-darleia-oliveira | NEAR_DUPLICATE_LAYOUT |
| lolipa-arte-em-festas | Lolipa Arte em Festas Decor | decoração de festas | 63 | premium-envelopamentos | NEAR_DUPLICATE_LAYOUT |
| premium-envelopamentos | Premium Envelopamentos | plotagem / comunicação visual | 63 | lolipa-arte-em-festas | NEAR_DUPLICATE_LAYOUT |

Não havia subfamília de alimentação clonada: os projetos de comida remanescentes
(marmitaria-dom-diego, confeitaria-chyrley, acai-total-araucaria) estão em
ATTENTION isolado, sem par mútuo, e ficam para rodada futura.

- SELECTED_SUBGROUP = [artesanatos-darleia-oliveira, thays-camilla, lolipa-arte-em-festas, premium-envelopamentos]
- DEFERRED_PROJECTS = [brecho-sao-francisco, toquinho-de-gente-brecho, acai-total-araucaria, aguia-sul-sinalizacao, diego-montador-moveis, mp-festas-eventos, studio-de-cilios, marmitaria-dom-diego, mary-diarista, confeitaria-chyrley, demais 58 projetos]

## Contrato criativo por página

| Dimensão | Darléia | Thays Camilla | Lolipa | Premium |
|---|---|---|---|---|
| Hero | foto full-bleed com rótulo de papel sobreposto | centralizado, foto emoldurada + etiqueta de preço pendurada | mural fotográfico full-bleed com título sobreposto | faixa escura de largura total + tira panorâmica |
| Fluxo | hero → ritual → ficha → encomenda | hero → 2 peças → 3 passos → cartão final | mural → faixa CTA → formatos → mimos → fechamento | faixa → catálogo → aplicação → orçamento |
| Produtos | lista de definições (dl/dt/dd) | duas colunas com divisor | linhas A/B/C | linhas técnicas numeradas 01–04 |
| Grid | nenhum grid de cards | duas colunas + pílulas | mosaico 4 imagens | linhas de 4 colunas |
| Imagens | 1 foto dominante | 1 foto emoldurada | 4 fotos em mosaico | 1 tira + 1 bloco 16:9 |
| Tipografia | serif com caixa alta espaçada | serif centrada | display black sobre foto | black caixa alta condensada |
| Assinatura | trilho numerado + sombra sólida | etiqueta de preço rotacionada | mural como hero | tabela técnica com tags |
| CTA | bloco escuro alinhado à esquerda | botão centralizado | faixa colorida + fechamento assimétrico | linha horizontal com borda laranja |

Nenhuma das quatro páginas troca de lugar apenas com nome e foto: hero, fluxo e
apresentação de produto são estruturalmente distintos.

## Resultados

- IDENTICAL_STRUCTURE_BEFORE = 0 · IDENTICAL_STRUCTURE_AFTER = 0
- MAX_NEAREST_MATCH_BEFORE (subgrupo) = 63 · AFTER = 44
  (Darléia 44 · Thays 44 · Lolipa 40 · Premium 32)
- CLONES_BEFORE = 0 · CLONES_AFTER = 0
- HIGH_SIMILARITY_BEFORE = 4 · HIGH_SIMILARITY_AFTER = 0
- CLUSTERS_BEFORE = 0 · CLUSTERS_AFTER = 0 · NEW_CLUSTER = 0
- SHARED_FALLBACK = 0 · TOTAL_PROJECTS = 68 · COMPLETE = 68/68
- PROJECTS_CHANGED = 4

## Assets

Somente material já existente de cada cliente. Nenhuma fotografia inventada,
nenhum asset cruzado entre clientes, nenhum panfleto com contato exposto.
Sem novas pendências: LOGO_PENDING = 0 e COVER_ASSET_PENDING = 0 nos 4 projetos.

## Infraestrutura preservada

clientKey, studioName, recipientName, quizConfig, CTA, funil, WhatsApp,
tracking/analytics, ManagedText, PortfolioImage, managedField, PortfolioCTAQuiz,
PortfolioSocialProofPopup, PortfolioUpsellPopup, PortfolioHostCredit, SEO e banco
inalterados. Correção pontual: removida a seta duplicada nos botões de funil
(o componente já emite a própria) e adicionado fundo claro ao logo da Premium
sobre faixa escura.

## Gates

TYPECHECK = PASS · TESTS = PASS (324/0) · BUILD = PASS
COMPLETENESS = 68/68 · BOUNDARIES = PASS · PRIVACY = PASS · ORIGINALIDADE = PASS
MOBILE_QA (390) = PASS · TABLET (768) = PASS · DESKTOP_QA (1440) = PASS
(overflow 0, 1 H1 de conteúdo, 0 imagem quebrada, 0 erro de console)
SEO_REGRESSION = 0 · FUNNEL_REGRESSION = 0 · WHATSAPP_REGRESSION = 0
TRACKING_REGRESSION = 0 · PRIVACY_REGRESSION = 0

## Dívidas registradas (não tratadas nesta rodada)

- ORIGINALITY_METRIC_ASSET_FILENAME_DEBT (medir asset por hash/dimensão, não por nome)
- 26 capas ausentes / 36 NEEDS_REVIEW — rodada editorial própria
- `<h1>` extra do fallback global de erro no HTML

## Próxima micro-rodada recomendada

Par `brecho-sao-francisco` × `toquinho-de-gente-brecho` (score 60, mesma família
semântica real), no máximo 2 projetos.
