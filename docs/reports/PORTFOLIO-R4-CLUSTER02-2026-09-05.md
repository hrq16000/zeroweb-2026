# Rodada 4 — CLUSTER_02 (brechós e alimentação)

Data: 2026-09-05 · Escopo fechado: 4 projetos. Sem novo template, sem novas
features administrativas, SEO, CRM ou telemetria.

## Projetos recompostos

| Projeto | Antes | Depois | Composição própria |
|---|---|---|---|
| brecho-sao-francisco | 60 ATTENTION | **32 ACCEPTABLE** | Coluna fixa de marca + lista de araras numeradas em texto corrido |
| toquinho-de-gente-brecho | 60 ATTENTION | **54 ATTENTION** | Mural de recados com bilhetes inclinados e tira de lembretes |
| marmitaria-dom-diego | 58 ATTENTION | **44 ATTENTION** | Faixa fotográfica com título aplicado + cardápio em linhas pontilhadas |
| woodhouse-hamburgueres | 56 ATTENTION | **54 ATTENTION** | Comanda da casa em coluna + faixa vertical fotográfica fixa |

## Preservado integralmente

- `clientKey`, `companySlug`, `formSlug` e `location` de cada CTA.
- `ManagedText` (`heroHeadline`, `heroSubheadline`, `ctaLabel`) e
  `PortfolioImage managedField="heroImageUrl"` — runtime administrável intacto.
- `PortfolioUpsellPopup` e `PortfolioHostCredit` em todas as páginas.
- Somente assets do próprio cliente; nenhum contato no bundle público.

## Gates

| Gate | Resultado |
|---|---|
| tsc --noEmit | OK |
| check-portfolio-projects | 68/68 COMPLETE |
| validate:portfolio-boundaries | OK |
| originalidade | 0 CLONE · 0 HIGH_SIMILARITY · 0 cluster · 24 ACCEPTABLE / 44 ATTENTION · regressão PASS |
| bun test | 324 pass / 0 fail |
| scan:source-privacy | OK (1 warning legado de placeholder) |
| bun run build + client-privacy | OK (2 warnings em chunks administrativos) |
| QA 390/768/1440 | overflow 0 · 1 H1 · 0 imagens quebradas · 0 erros de console |

## Pendências conhecidas (fora do escopo desta rodada)

- 26 projetos sem capa dedicada e 10 capas bloqueadas seguem em fila editorial.
- Próxima subfamília candidata: `mp-festas-eventos` / `studio-de-cilios` /
  `confeitaria-chyrley` (59/59/56) — não iniciada nesta rodada.
