# Fechamento operacional do portfólio 0WEB — 2026-09-05

Escopo: validação de produção de Galileu e L&J, reconciliação total do inventário
de capas, funil mensurável por projeto, relatório final e contrato universal de
qualidade. Arquitetura, leads, metadata e domínio permaneceram como estado
validado — nada foi reimplementado.

## Frente A/B — Galileu e L&J em produção (após propagação)

| Item | galileu-locacao-brinquedos | lj-cleaning |
|---|---|---|
| HTTP | 200 | 200 |
| TITLE | Galileu Locação de Brinquedos | L&J Cleaning |
| DESCRIPTION | própria | própria |
| CANONICAL | https://0web.com.br/portfolio/galileu-locacao-brinquedos | https://0web.com.br/portfolio/lj-cleaning |
| OG_TITLE / OG_DESCRIPTION | próprios | próprios |
| OG_IMAGE | /images/galileu-locacao-brinquedos/capa-og.jpg?v=78180cbe | /images/lj-cleaning/capa-og.jpg?v=16b62c80 |
| OG_IMAGE_HTTP | 200 (58 KB, image/jpeg) | 200 (66 KB, image/jpeg) |
| HERO / LOGO / COVER | novos assets servidos (capa-card, vitrine, cena: HTTP 200) | novos assets servidos (HTTP 200) |
| CTA / NEXT_STEP | do cliente, presente | do cliente, presente |
| POPUP_0WEB | presente | presente |
| MOBILE_390 / DESKTOP_1440 | H1 único, overflow 0 | H1 único, overflow 0 |
| PII_VISIBLE | NO | NO |

Panfleto antigo com telefone não retornou em nenhuma das duas. Verificação feita
contra a URL pública real (curl + navegador headless em 390 e 1440), não apenas
HTML local. Observação: em 390 a capa OG aparece como ainda não carregada por ser
lazy fora da dobra — o arquivo responde 200.

Status: **VALIDADO_EM_PRODUCAO**.

## Frente C — Inventário reconciliado das capas

Fonte única: `src/config/portfolio-visual-review.json`. Relatório reproduzível:
`node scripts/report-portfolio-cover-inventory.mjs --markdown`.

```
TOTAL_CANDIDATES = 17 · APPROVED = 7 · BLOCKED = 10 · BALANCED = YES
BLOCKED_CONTACT = 6 · BLOCKED_PROMOTIONAL_PRICE = 2 · BLOCKED_ADDRESS = 1 · BLOCKED_QUALITY = 1
```

Por que 17 e não 16: o número 16 é um retrato anterior à rodada Q4B. Galileu e
L&J receberam capas próprias e seguras naquela rodada e entraram como candidatas,
elevando o total para 17. A candidata “sem classificação explícita” apontada no
pedido é justamente `lj-cleaning`, agora registrada como `APPROVED`.

### Aprovadas (7)

| slug | material | asset | focal | publicada |
|---|---|---|---|---|
| artesanatos-darleia-oliveira | REAL_CLIENT_MATERIAL | images/artesanatos-darleia-oliveira/hero-og.png | 0.5/0.5 | YES |
| refrigeracao-maresia | REAL_CLIENT_MATERIAL | images/refrigeracao-maresia/hero-og.png | 0.5/0.5 | YES |
| thays-camilla | REAL_CLIENT_MATERIAL | images/thays-camilla/hero-og.png | 0.5/0.5 | YES |
| lucas-arruma-maquina-lavar | AUTHORED_GRAPHIC | images/lucas-arruma-maquina-lavar/vitrine.png | 0.5/0.5 | YES |
| no-brilho-higienizacao | AUTHORED_GRAPHIC | images/no-brilho-higienizacao/vitrine.png | 0.5/0.5 | YES |
| galileu-locacao-brinquedos | AUTHORED_GRAPHIC | images/galileu-locacao-brinquedos/vitrine.png | 0.5/0.5 | YES |
| lj-cleaning | AUTHORED_GRAPHIC | images/lj-cleaning/vitrine.png | 0.5/0.5 | YES |

As cinco confirmadas no pedido correspondem a Darléia, Maresia, Thays, Lucas e
No Brilho; Galileu e L&J completam o conjunto. Todas já publicadas, com asset
próprio, focal point aplicado em card desktop/mobile e sem PII.

### Bloqueadas (10) — fila editorial

| slug | decisão | motivo registrado |
|---|---|---|
| studio-de-cilios | BLOCKED_CONTACT | telefone + tabela de preços |
| eletro-solucoes-eficazes | BLOCKED_CONTACT | telefone na arte |
| mp-festas-eventos | BLOCKED_CONTACT | telefone/WhatsApp + print de perfil |
| ecommerce-on | BLOCKED_CONTACT | print de perfil pessoal + tabela de preços |
| mary-diarista | BLOCKED_CONTACT | telefone + tabela de preços |
| fernanda-amaral-drywall | BLOCKED_CONTACT | chamada de WhatsApp |
| confeitaria-sabor-da-realeza | BLOCKED_ADDRESS | endereço físico + preço promocional |
| espaco-cih-luh | BLOCKED_PROMOTIONAL_PRICE | promoção “10% OFF” inseparável |
| renata-beauty | BLOCKED_PROMOTIONAL_PRICE | arte promocional com preço e telefone |
| eisenfer-tubos-acos | BLOCKED_QUALITY | arte promocional + resolução insuficiente |

Nenhuma arte foi “limpa” para fabricar aprovação e nenhuma capa foi inventada.
Havendo apenas marca, o projeto permanece pendente.

## Frentes G–P — Funil mensurável

Fontes canônicas (uma por métrica, documentadas em
`docs/PORTFOLIO_FUNNEL_METRICS_STANDARD.md`):

```
PORTFOLIO_VIEW_SOURCE = analytics_events:portfolio_view
CTA_CLICK_SOURCE      = analytics_events:portfolio_contact_floating_click
POPUP_OPEN_SOURCE     = analytics_events:popup_view
LEAD_SOURCE           = dynamic_form_leads.metadata_json.portfolio_slug
WHATSAPP_SOURCE       = whatsapp_redirect_tokens.used_at
```

Nenhum evento novo foi criado: todos já existiam. Agregação em
`src/lib/portfolio-funnel-metrics.functions.ts` (autenticada), consumida pelo
painel `PortfolioFunnelPanel` dentro de `/app/portfolio` (visão compacta por
projeto) e `/app/portfolio/:slug` (bloco “Desempenho”, 7/30/90 dias). Sem
dashboard paralelo, sem base nova, sem migração de leads.

Regra de VIEW: uma por sessão do navegador × slug (trava em `sessionStorage`).
Refresh na mesma sessão não infla; slug diferente conta no outro projeto; nova
sessão gera nova view. GA4/GTM, se existirem, não são somados à métrica interna.

Taxas derivadas usam `views` como denominador e retornam `—`/`NO_DATA` quando não
há base de cálculo; zero fabricado é proibido. Analytics recebe apenas slug, nome
do evento, rota e identificadores anônimos.

## Frentes U–Z — Gates

```
projetos          68 · COMPLETE 68 · PARTIAL 0 · bloqueantes 0
boundaries        OK (68 sites isolados)
originalidade     CLONE 0 · SHARED_FALLBACK 0 · clusters 0 · HIGH_SIMILARITY 4 · regressão PASS
qualidade visual  PREMIUM 26 · STANDARD 42 · NEEDS_UPGRADE 0 · P0 0
privacidade       bundle público limpo (445 chunks; 2 avisos apenas em chunk de painel autenticado)
typecheck         PASS · testes 324 pass / 0 fail · build PASS
```

## Contrato universal de qualidade

Formalizado em `docs/PORTFOLIO_UNIVERSAL_QUALITY_CONTRACT.md`: 12 capacidades
(brand, cover, hero, content, funnel, SEO, conversion, motion, performance,
accessibility, originality, privacy) exigidas por contexto, não por layout,
validadas no wizard antes de `READY`. Projetos concluídos não são redesenhados
sistematicamente.

## Status de fechamento

`SYSTEMATIC_PORTFOLIO_MODERNIZATION = CLOSED`
com pendência editorial declarada: 10 capas bloqueadas e 26 projetos sem capa
dedicada seguem em fila, dependentes de material real do cliente — não de código.
Métricas do funil ficam em `NO_DATA` até acumularem tráfego na janela medida.
