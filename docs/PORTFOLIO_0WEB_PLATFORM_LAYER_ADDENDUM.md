# Adendo — Camada Institucional 0WEB obrigatória em `/portfolio/:slug`

Este adendo SOMA ao padrão existente. Não substitui Blueprint, Visual
Enrichment, Motion Addendum, Quality Matrix, Lifecycle ou Boundaries.

## 1. Princípio

Toda página pública em `/portfolio/:slug` é simultaneamente:

a) uma experiência digital exclusiva do cliente; e
b) uma página hospedada e apresentada dentro da plataforma 0WEB.

Identidade, conteúdo, motion, funil e composição pertencem ao cliente.
A presença institucional da 0WEB é **camada da plataforma**, não parte do
projeto do cliente.

## 2. Popup institucional obrigatório

Toda landing pública e publicada em `/portfolio/:slug` DEVE apresentar o
componente institucional oficial (`PortfolioUpsellPopup`, experiência
"Gostou desta página?"), independentemente de: legado ou Blueprint, segmento,
identidade visual, tipo de funil, número de seções, motion profile, footer
próprio ou estrutura autoral.

## 3. Proibição de montagem manual por projeto

O popup NÃO pode depender de `afterContent` nem de import em
`MoreiraAutoMecanicaPage.tsx`, `JklDecorPage.tsx`, `CarecasInfotecPage.tsx`
ou qualquer landing individual.

Implementação canônica única: `src/components/portfolio/PortfolioStandardShell.tsx`.

```text
landing do cliente → camada da plataforma 0WEB → popup institucional
```

`validate-portfolio-boundaries` rejeita montagem manual em landings.

## 4. Separação de responsabilidades

`PortfolioHostCredit` e `PortfolioUpsellPopup` pertencem à
`PLATFORM_LAYER_0WEB`. A identidade do cliente não pode removê-los, o
Blueprint não os declara, projeto autoral não os importa e mudança de
estrutura da landing não pode fazê-los desaparecer. Exceção exige decisão
explícita e documentada — nunca ausência de import.

## 5. Comportamento visual

O popup permanece visualmente da 0WEB, não do cliente, preservando autoria
institucional. Não pode encobrir: CTA principal do cliente, funil aberto,
conteúdo legal, referência da cidade, `PortfolioHostCredit`, navegação
crítica ou outro elemento fixo.

## 6. Frequência e QA determinístico

Regras de frequência atuais, auditáveis:

| Regra | Valor padrão |
|---|---|
| storage | `sessionStorage` `0web:portfolio-upsell-shown:v3:<slug>` |
| cota | uma exibição por sessão e por projeto |
| gatilhos | timer, fallback e scroll (configuráveis por painel) |
| supressão | iframe/embed e `0web_preview=1` / `0web_overlays_off=1` |
| prioridade | funil do cliente aberto oculta; ao fechar, rearma |

Ausência visual não é ausência de implementação. Para QA existe override
determinístico: `?force_0web_popup_qa=1` (ou `window.FORCE_0WEB_POPUP_QA`),
que ignora **somente** a cota de sessão e antecipa o gatilho. O
comportamento do visitante real não muda.

## 7. Gate obrigatório — `PLATFORM_0WEB_LAYER`

Estados mínimos: `HOST_CREDIT_MOUNTED`, `UPSELL_POPUP_MOUNTED`,
`UPSELL_POPUP_TRIGGERABLE`, `UPSELL_POPUP_VISIBLE_IN_RUNTIME_QA`,
`UPSELL_POPUP_DISMISSIBLE`, `NO_CLIENT_FUNNEL_COLLISION`,
`NO_FOOTER_COLLISION`, `NO_MOBILE_OVERFLOW`.

Projeto publicado não recebe PASS com qualquer item obrigatório ausente.

## 8. Runtime, não somente código

Import ou JSX não constitui PASS. O gate observa em navegador, em mobile
(390px) e desktop (1440px):

```text
MOUNTED → TRIGGERED → VISIBLE → DISMISSIBLE
```

Componente no DOM que nunca pode aparecer = FAIL.

Comando: `bun run check:portfolio-platform-layer [rota...] [--enforce]`
(`scripts/check-portfolio-platform-layer.mjs`).

## 9. Escopo

Aplica-se a todos os `/portfolio/:slug`, inclusive existentes. O catálogo
`/portfolio` é página da própria 0WEB: exibe o popup institucional, mas o
host credit não é exigido. Não se aplica a `/servicos`, páginas
institucionais ou `/lab/*`. `/lab/motion-pilot` permanece fora do catálogo e
não serve como evidência de presença do popup comercial.

## 10. Migração

Correção primeiro na infraestrutura compartilhada; depois remoção dos
imports manuais redundantes. Sem alteração visual, estrutural, de funil, de
conteúdo, de identidade ou de URL durante a migração.

**Resultado esperado:** 100% das páginas publicadas em `/portfolio/:slug`
recebem automaticamente a camada institucional 0WEB, sem depender da
implementação individual de cada landing.
