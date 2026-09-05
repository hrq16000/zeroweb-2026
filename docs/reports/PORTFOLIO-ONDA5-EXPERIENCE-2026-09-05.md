# Onda 5 — Experience Quality (páginas intermediárias)

Data: 2026-09-05 · Escopo: elevar somente páginas BASELINE sem assinatura própria.
Sem redesign de conteúdo, SEO, funil, capas ou analytics.

## 1. Resultado

| Antes | Depois |
|---|---|
| PREMIUM 33 · SIGNATURE 5 · BASELINE 30 · STATIC 0 | PREMIUM 33 · SIGNATURE 19 · BASELINE 16 · STATIC 0 |

Cobertura mantida em 68/68. Gate `check:experience-standard`: OK, 0 bloqueantes.

## 2. Páginas elevadas (14)

| Slug | Intenção de movimento |
|---|---|
| clinica-integrada | confiança / calma |
| almeida-torres | sobriedade editorial |
| eletrovale-eletromecanica | precisão industrial |
| eisenfer-tubos-acos | peso estrutural |
| hbk-iluminacao-led | luz que acende |
| artesanatos-darleia-oliveira | tempo lento artesanal |
| eletro-solucoes-eficazes | circuito ligado |
| no-brilho-higienizacao | limpeza que assenta |
| ag-electrical-services | barramento |
| lk-alvenaria | obra em etapas |
| rm-fretes | carga em movimento |
| paraiso-do-hot-dog | apetite |
| heloa-gas | entrega direta |
| espaco-cih-luh | cartela de cuidados |

Cada uma recebeu `MotionScope` + assinaturas próprias (hero, seção, interação)
usando exclusivamente as primitives oficiais (`transform`/`opacity`/`clip-path`).
Decisões registradas em `src/config/portfolio-motion-profiles.json`
(`overrides` + `decisions`, `wave: onda5`).

## 3. Páginas mantidas como BASIC (16)

Já possuem movimento autoral via `motion/react` (ex.: `mp-festas-eventos`,
`liz-moraes-nail-designer`, `mary-diarista`, `vila-da-capivara`,
`aguia-sul-sinalizacao`) ou ritmo adequado ao segmento. Não foram tocadas para
evitar redesenho de projetos já aprovados. O scanner subconta esses casos —
melhoria de precisão fica registrada como dívida, sem alterar scores agora.

## 4. Correção de responsividade

`paraiso-do-hot-dog`: coluna do cardápio sem `min-w-0` empurrava a barra de
categorias para fora da viewport em 390px. Corrigido; sem overflow de documento.

## 5. Validações executadas

- `bun run check:experience-standard` — 68/68, OK
- `bun run validate:portfolio-boundaries` — OK, 68 sites isolados
- `bun run check:portfolio-projects` — 68 COMPLETE
- `tsgo --noEmit` — limpo
- `bun test` — 338 pass / 0 fail
- `bun run build` — OK; privacidade do bundle público limpa
- QA Playwright 390px e 1440px nas 14 páginas: H1 único e visível, sem overflow,
  sem erros de console de aplicação
