# Onda 4 — Experience rollout final dos STATIC

Data: 2026-09-05 · Escopo: apenas experiência/motion nas páginas restantes sem
movimento. Nenhuma nova frente (capas, SEO, CRM, funis, landings, dependências).

## 1. Inventário

| Momento | PREMIUM | SIGNATURE | BASELINE | STATIC |
|---|---|---|---|---|
| Antes (pós-Onda 3) | 23 | 5 | 30 | 10 |
| Depois (Onda 4) | 33 | 5 | 30 | **0** |

Cobertura: 68/68 projetos (100%). Saldo pendente: nenhum.

## 2. Páginas tratadas e assinaturas

| Slug | Preset | Assinatura principal |
|---|---|---|
| marmitaria-dom-diego | cardapio-escrito | linha pontilhada do cardápio "escrita" via scaleX; faixa fotográfica lateral |
| toquinho-de-gente-brecho | mural-de-recados | bilhetes caem no mural e se endireitam no hover; título em máscara |
| reuse-house-brecho | ficha-de-etiqueta | índice tabular entrando linha a linha pela esquerda; foto só depois |
| brecho-sao-francisco | caderno-de-garimpo | coluna fixa em camadas; araras entrando pela direita |
| angel-mix-brecho | capa-de-revista | capa revelada de baixo, título em máscara, arara de estilos pendurando |
| confeitaria-sabor-da-realeza | mesa-posta | foto entrando lateralmente; cartões de sabores crescendo em sequência |
| manu-pasteis | balcao-quente | título crescendo como pastel na chapa; horários e pagamento em sequência |
| confeitaria-chyrley | festa-montada | kits subindo em sequência; passos da encomenda entrando pela direita |
| guaratuba-sabores-da-baia | mare-do-dia | pratos entrando um a um; faixa da maré crescendo |
| mirassol-delicias-caseiras | vitrine-redonda | medalhões da vitrine crescendo; calendário entrando pela esquerda |

Profiles e `decisions.onda4` registrados em `src/config/portfolio-motion-profiles.json`.

## 3. Regras respeitadas

- Somente primitives oficiais de `src/components/motion` — nenhuma dependência nova.
- Apenas `transform`, `opacity` e `clip-path`; nenhum property de layout animado.
- Conteúdo sempre no DOM; `prefers-reduced-motion` remove deslocamento.
- Semântica preservada (`li`, `article`, `dl` mantidos via `as=`).
- SEO, copy, funil, CTAs, analytics e resolução server-side de contato inalterados.

## 4. Validação

| Gate | Resultado |
|---|---|
| `check:experience-standard` | OK · STATIC 0 · 0 bloqueante |
| `check:portfolio-originality --enforce` | PASS · 0 CLONE · 0 HIGH_SIMILARITY · 0 cluster |
| `check-portfolio-projects` | 68 COMPLETE · 0 bloqueante |
| `validate:portfolio-boundaries` | OK — 68 sites isolados |
| Typecheck | OK |
| `bun test` | 337 pass · 0 fail |
| `bun run build` | OK · bundle público limpo |
| QA Playwright 390/1440 | 20/20 · HTTP 200 · H1 presente · overflow 0 · console sem erros |

## 5. Saldo

Capas pendentes (38) e scores ATTENTION seguem fora do escopo desta rodada,
na fila editorial já registrada.
