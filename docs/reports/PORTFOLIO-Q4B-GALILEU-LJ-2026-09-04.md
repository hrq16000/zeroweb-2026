# Q4B — Galileu + L&J Cleaning (fechamento do redesign sistemático)

## Baseline real no início da rodada

```
PREMIUM_CURRENT = 26
STANDARD_CURRENT = 42
NEEDS_UPGRADE_CURRENT = 0
AVG_SCORE_CURRENT = 86
P0 = 0 · P1 = 57 · P2 = 146 · P3 = 58
```

| slug | antes | depois |
| --- | --- | --- |
| galileu-locacao-brinquedos | STANDARD 85 · originality FAIL · nearest lj-cleaning (66) · charm LOW | PREMIUM 96 · originality WARNING (47) · nearest eletro-solucoes-eficazes · charm HIGH |
| lj-cleaning | STANDARD 79 · originality FAIL · nearest galileu (66) · charm LOW · cover NEEDS_REVIEW | PREMIUM 96 · originality WARNING (45) · charm HIGH · cover APPROVED |

## Diagnóstico

Ambos usavam o mesmo padrão: panfleto do cliente como hero e OG recortado do
mesmo panfleto. Os panfletos exibiam telefone/WhatsApp — material impróprio
para uso público. As logos são marcas legítimas (`CLIENT_PROVIDED`) e foram
preservadas sem redesenho.

Removidos: `hero.png` e `hero-og.jpg` de cada projeto.

## Direção autoral

- **Galileu — "cartela de atrações"**: navy profundo, blocos coloridos numerados
  (tobogã, cama elástica, piscina de bolinhas, kit combinado) e bloco de
  planejamento data/local/público. Não parece prancha técnica, ordem de serviço,
  painel industrial, polaroide ou caderno.
- **L&J — "matriz de superfícies"**: editorial claro, acento laranja, item por
  item agrupado em residencial e automotiva. Deliberadamente distinto de
  No Brilho e do clichê azul-com-bolhas do setor de limpeza.

Assets novos, todos gráficos autorais sem PII: `vitrine.png`, `cena.png`,
`capa-card.jpg` (1600×1000) e `capa-og.jpg` (1200×630) em cada diretório.

## Gates

```
check:portfolio-projects        68 COMPLETE · 0 bloqueante
check:portfolio-funnel-context  68 PASS · 0 WARNING · 0 FAIL
check:portfolio-runtime-overrides  66 administráveis · MISSING 0
check:portfolio-originality     0 clones · 0 fallback · 0 clusters
check:portfolio-visual-quality  PREMIUM 25 · STANDARD 43 · NEEDS_UPGRADE 0 · P0 0 · média 86
render audit                    68 × HTTP 200 · overflow 0 · imagens quebradas 0
bun test                        324 pass · 0 fail
typecheck / bun run build       verdes (privacy e SEO postbuild inclusos)
```

## Frente X — classificação das capas pendentes (sem gerar imagens)

Total real pendente: **31** (não 36). Registrado em
`src/config/portfolio-visual-review.json` no campo `coverMaterial`.

```
HAS_SAFE_REAL_MATERIAL   16
NO_SAFE_REAL_MATERIAL     4   lk-alvenaria · salao-da-marcia · liz-moraes-nail-designer · miro-tech
MATERIAL_INSUFFICIENT    11   aguia-sul · emporio-lelecute · marido-de-aluguel · mirassol (2) ·
                              guaratuba (4) · bh-barreiro-marmitas · uberlandia-eletrica-residencial
```

Evidência: inventário de assets + OCR como **alerta** (não como prova).
Confirmação visual item a item continua pendente antes de qualquer produção de capa.

## Frente Z — medição existente (nada novo instalado)

```
PORTFOLIO_MEASUREMENT = src/lib/analytics.ts · src/lib/event-taxonomy.ts ·
  src/lib/ab-testing.ts · src/lib/quiz-pixel.ts · src/lib/use-whatsapp-tracking.ts ·
  FunnelCTAButton · FunnelRunner · FunnelModalWrapper · FloatingFunnelCTA ·
  PortfolioSocialProofPopup · PortfolioContactFloating
```

Cobertura: view de projeto, abertura de funil, avanço de etapa, envio de lead,
redirect de WhatsApp e popups. Nenhum tracker paralelo foi adicionado.

## Conclusão

```
SYSTEMATIC_PORTFOLIO_REDESIGN = CLOSED
```

Critérios atendidos: `NEEDS_UPGRADE = 0`, `P0 = 0`, clones = 0, clusters = 0.
Fila remanescente é de refinamento (P1–P3) e de produção de capas, não de redesign.
