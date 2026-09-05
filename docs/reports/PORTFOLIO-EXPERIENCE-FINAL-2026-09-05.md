# Onda 6 — Fechamento do Experience Standard `/portfolio`

Data: 2026-09-05 · Escopo: auditoria final, produção, governança e encerramento.
Sem redesign nesta rodada. Sem novas dependências. Sem métrica inventada.

## 1. Estado final do padrão

| Métrica | Valor |
|---|---|
| Projetos no catálogo | 68 |
| Cobertura da auditoria | 68/68 (100%) |
| IMMERSIVE (interno `PREMIUM`) | 33 |
| SIGNATURE | 19 |
| BASIC (interno `BASELINE`) | 16 |
| STATIC | 0 |

Fonte canônica: `bun run check:experience-standard` →
`reports/experience-standard.json` e `src/config/portfolio-experience-levels.json`.

## 2. Originalidade de motion

Medidor perceptível (assinaturas + intensidade + comportamento + tokens de uso),
não a primitive importada — reutilizar `MotionReveal`/`MotionStagger` é
infraestrutura compartilhada e não é clone.

| Indicador | Valor |
|---|---|
| MOTION_CLONES (≥95%) | 0 |
| MOTION_GROUPS (≥85%) | 6 |
| Similaridade máxima comparável | 92% |
| Pares de baixo sinal excluídos | 1197 |

Grupos de afinidade (não clones), maiores pares:

```text
92%  confeitaria-chyrley × guaratuba-sabores-da-baia
92%  beto-pasteis × lolipa-arte-em-festas
91%  lolipa-arte-em-festas × premium-envelopamentos
86%  reuse-house-brecho × confeitaria-sabor-da-realeza
86%  angel-mix-brecho × manu-pasteis
```

Leitura honesta: são negócios do mesmo segmento com intensidade e momentos
declarados iguais; a composição visual é distinta. Não foram forçados a zero.
Fila editorial: diferenciar `signatureMoments` desses 6 grupos numa rodada futura.

## 3. Originalidade estrutural e identidade

`bun run check:portfolio-originality:enforce`:
68 projetos · 0 ORIGINAL · 26 ACCEPTABLE · 42 ATTENTION ·
**0 HIGH_SIMILARITY · 0 CLONE · 0 SHARED_FALLBACK · 0 cluster** · regressão PASS.
Capas: 34 válidas · 34 pendentes · 0 compartilhada · 0 logo placeholder.

Pendências de capa (fila editorial, sem material seguro disponível):
`CONTACT_OR_PII=8 · PROMOTIONAL_MATERIAL=2 · LOGO_ONLY=10 · NO_REAL_ASSET=14`.

## 4. Produção (site publicado)

14 páginas da Onda 5 auditadas em produção com navegador real, em
390 / 768 / 1440 e também com `prefers-reduced-motion: reduce`
(+ 6 páginas amostrais das Ondas 1–4 em reduced motion):

- HTTP 200 em 100% dos casos (62 verificações);
- 1 `<h1>` visível por página, título e canonical/OG/JSON-LD próprios;
- conteúdo presente e visível com motion ativo e com motion reduzido
  (nenhum bloco escondido por animação);
- CTA de funil presente e visível em todas;
- 0 erro de runtime no console;
- overflow horizontal 0 em todas, **exceto** `paraiso-do-hot-dog` a 390px
  (302px de excesso).

### Único bloqueio real

`paraiso-do-hot-dog` em produção ainda serve a versão anterior ao ajuste de
cardápio. Localmente o overflow é 0 em 390/768/1440 (verificado com navegador).
Correção pronta, **publicação pendente**.

Pendência anterior mantida: `/images/eisenfer-tubos-acos/capa-card.jpg`
retornava 404 em produção após a R11 — publicar junto.

## 5. Funil, SEO, segurança e privacidade

| Gate | Resultado |
|---|---|
| `check:portfolio-funnel-context` | 68 PASS · 0 WARNING · 0 FAIL |
| `check:portfolio-projects` | 68 COMPLETE · 0 bloqueante |
| `check:portfolio-visual-quality` | NEEDS_UPGRADE 0 · P0 0 · score médio 87 |
| `check:portfolio-runtime-overrides` | 66/66 administráveis · MISSING 0 |
| `validate:portfolio-scaffold` | 68 conformes |
| `validate:client-privacy` | bundle público limpo (444 chunks) |
| Auditoria de privacidade no build | dist limpo, 454 arquivos, 0 contato/segredo |
| Scan de segurança | 0 finding ativo (4 itens já dispensados pelo usuário) |
| `bun test` | 348 passam · 0 falham |
| `bun run build` | PASS |

Nenhum texto, foto, contato, preço, funil, rota, canonical ou tracking foi
alterado nesta rodada.

## 6. Performance

`NOT_MEASURED` nesta rodada — não há instrumentação de campo (LCP/CLS/INP reais)
no site publicado e não foi adicionada nenhuma dependência para medir. Sinais
indiretos: 0 dependência nova de motion (`motion@12.40.0` já existia),
animação restrita a `transform`/`opacity`/`clip-path`, build dentro dos budgets
existentes.

## 7. Governança para projetos futuros

- `docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md` §19: contrato de nascimento.
- `validate:portfolio-scaffold` agora bloqueia projeto sem perfil de motion
  resolvível, sem qualquer sinal de experiência ou com loop infinito sem guarda
  de reduced motion.
- `portfolio-motion-profiles.json` ganhou `defaultsBySegment.default`, para que
  segmento novo nunca nasça sem perfil.
- Admin `/app/portfolio`: filtro e selo de Experiência
  (IMMERSIVE / SIGNATURE / BASIC / STATIC), lendo apenas
  `src/config/portfolio-experience-levels.json`. Ninguém classifica à mão.
- `AGENTS.md` referencia a regra.

## 8. Critérios de encerramento

| Critério | Estado |
|---|---|
| MOTION_CLONES = 0 | PASS |
| VISUAL_CLONES = 0 | PASS |
| VISUAL_GROUPS = 0 | FAIL parcial — 6 grupos de afinidade de motion (não clones) |
| FUNNEL_FAIL = 0 | PASS |
| CRITICAL_SECURITY = 0 | PASS |
| PII_REGRESSION = 0 | PASS |
| REDUCED_MOTION_BLOCKER = 0 | PASS |
| MOBILE_BLOCKER = 0 | PASS em produção (deploy 2026-09-05) |
| BUILD = PASS | PASS |

## 9. Production Closure (2026-09-05)

Publicação do estado auditado e validação em produção (`https://0web.com.br`).

| Item | Estado | Evidência |
|---|---|---|
| DEPLOY | PASS | deploy 2026-09-05, domínio `0web.com.br` servindo o build auditado |
| PARAISO_MOBILE_OVERFLOW | FIXED | `/portfolio/paraiso-do-hot-dog` — overflow horizontal 0px em 390/768/1440 |
| EISENFER_COVER | LIVE | `/images/eisenfer-tubos-acos/capa-card.jpg` HTTP 200; hero, logo, capa de catálogo e galeria migrados; `telhas.webp` (com telefone/site/endereço) fora de qualquer superfície pública |
| PRODUCTION_SMOKE | PASS | 72 verificações (12 slugs × 390/768/1440 × motion normal e reduzido): 0 falhas, HTTP 200, 1 H1, 0 imagem quebrada, 0 erro de console, CTA visível, conteúdo visível com motion reduzido |
| SECURITY | PASS | scan 2026-09-05T16:59Z — 0 finding crítico ativo; corrigida a política `dist target update` de `request_distributions` (adicionado `WITH CHECK` de posse do novo alvo); demais itens permanecem ignorados pelo usuário |
| PRIVACY | PASS | privacy audit do build: 0 contato operacional/segredo em 454 arquivos publicados |
| FUNNEL | PASS | 68 auditados · PASS 68 · WARNING 0 · FAIL 0 |
| EXPERIENCE | PASS | 68/68 no padrão · STATIC 0 · MOTION_CLONES 0 |

Pendências herdadas (fila editorial, não bloqueiam o encerramento): 34 capas
`PENDING` por falta de material real seguro e 6 grupos de afinidade de motion.

## 10. Declaração

A modernização de Experience do `/portfolio` está **encerrada**: 68/68 dentro do
padrão, estado auditado publicado e validado em produção, segurança, privacidade,
funil, testes e build verdes.

As duas divergências entre código e produção apontadas na auditoria anterior
(overflow mobile do Paraíso do Hot Dog e capa da Eisenfer) estão resolvidas no
site publicado.

Trabalho futuro limita-se a evolução editorial contínua: novas capas quando
houver material real do cliente e diferenciação gradual dos grupos de afinidade.
Nenhuma nova onda de redesign é necessária.


---

## 11. MAINTENANCE MODE

Seção normativa adicionada em 2026-09-05 (rodada de fechamento definitivo).
A partir daqui o `/portfolio` da 0WEB é mantido como produto, não desenvolvido
como campanha.

```text
PORTFOLIO_STATUS        = MAINTENANCE_MODE
MODERNIZATION           = CLOSED
FUTURE_STANDARD         = ACTIVE
GLOBAL_REDESIGN_REQUIRED= NO
SCOPE                   = 0web.com.br apenas
```

### 11.1 Baseline canônico

O estado abaixo é a referência oficial de comparação. Não criar fonte paralela:
as fontes canônicas continuam sendo `src/config/portfolio-motion-profiles.json`,
`src/config/experience-capabilities.json`, `src/config/portfolio-cover-status.json`,
`src/config/portfolio-catalog*.json` e os scripts `check:*` existentes.

| Dimensão | Baseline congelado |
|---|---|
| TOTAL_PROJECTS | 68 · COMPLETE 68 |
| Experience | STATIC 0 · BASIC/BASELINE 16 · SIGNATURE 19 · IMMERSIVE/PREMIUM 33 |
| Motion | MOTION_CLONES 0 · 6 grupos de afinidade · similaridade máx 92% |
| Originalidade | VISUAL_CLONES 0 · HIGH_SIMILARITY 0 · SHARED_FALLBACK 0 · clusters 0 · 26 ACCEPTABLE · 42 ATTENTION |
| Funil | FUNNEL_PASS 68 · FUNNEL_FAIL 0 |
| Capas | VALID 34 · PENDING 34 · NEEDS_CROP 0 · compartilhadas 0 |
| SEO | 0 erro · 0 aviso |
| Privacy | bundle público limpo (2 avisos conhecidos em chunks administrativos) |
| Security | CRITICAL 0 |
| Testes / Typecheck / Build | 350 PASS · PASS · PASS |
| Produção | smoke PASS |

### 11.2 Política de regressão

Nenhuma alteração futura pode degradar silenciosamente um projeto em:
`experience`, `originality`, `mobile`, `reducedMotion`, `SEO`, `funnel`,
`privacy`, `security`.

Os gates existentes já cobrem cada condição — **não criar gates novos**:

| Dimensão | Gate responsável |
|---|---|
| experience / reducedMotion / motion clones | `bun run check:experience-standard` |
| originality / capas / logos | `bun run check:portfolio-originality` |
| completude, funil, SEO por projeto | `bun run check:portfolio-projects` |
| isolamento de portfólio | `bun run validate:portfolio-boundaries` |
| privacidade do bundle | etapa `client-privacy` do `bun run build` |
| segurança de dados | scanner de segurança + testes RLS em `tests/rls/` |
| regressão geral | `bun test` · `bunx tsgo --noEmit` |

Regressão objetiva sinalizada por qualquer gate bloqueia a publicação.

### 11.3 Projetos novos

Todo novo `/portfolio/:slug` nasce dentro do contrato ativo
(`bun run validate:portfolio-scaffold` + §19 do Global Web Experience Standard).
Checklist obrigatório antes de publicar: BRAND · COVER · HERO · CONTENT ·
MOTION · INTERACTION · FUNNEL · SEO · ACCESSIBILITY · PERFORMANCE ·
ORIGINALITY · PRIVACY · SECURITY.

Não precisa ser IMMERSIVE. **Não pode nascer STATIC.**

### 11.4 Autoria

Padronizar engenharia, nunca criatividade.

- Compartilhável: primitives, shell, analytics, gates, acessibilidade,
  segurança, runtime, motion primitives.
- Não compartilhável perceptivelmente: composição, hero, ritmo, motion
  fingerprint, storytelling, identidade.

### 11.5 Motion

Não adicionar efeito para elevar score. Toda alteração de motion responde
`WHY_THIS_MOTION?` no PR e respeita contexto de marca, performance, mobile,
`prefers-reduced-motion`, acessibilidade e originalidade. Motion budget
inalterado: máx. 3 signature moments, 1 parallax, 1 stagger por viewport, 1 loop.

### 11.6 Capas pendentes = EDITORIAL_BACKLOG

As 34 capas `PENDING` são **fila editorial**, não `SYSTEM_BLOCKER` e não dívida
técnica. Não publicar capas automaticamente para zerar inventário.

Ao surgir material legítimo, classificar como `PHOTO_DERIVED`,
`BRAND_COMPOSITION`, `ABSTRACT_BRAND_ART` ou `BLOCKED`.

Permanecem proibidos: foto falsa de cliente, fachada inventada, funcionário
inventado, serviço inventado, asset de outro cliente e telefone/PII em imagem
pública.

### 11.7 Grupos de afinidade de motion

Os 6 grupos reportados **não** justificam redesign: `MOTION_CLONES = 0` e
afinidade não é clone. Agir apenas se uma auditoria futura registrar
`PERCEPTIBLE_DUPLICATION = YES`.

### 11.8 Admin

Manter o admin atual (`/app/portfolio`, `/app/portfolio/originalidade`,
`/app/leads/*`). Filtros e status são suficientes. Não criar painel novo de SEO,
Experience, leads ou capas sem necessidade operacional comprovada; estender o
existente quando necessário.

### 11.9 Métricas antes de estética

A próxima melhoria relevante nasce de dado real: `VIEWS`, `CTA`, `POPUP`,
`LEADS`, `WHATSAPP`. Intervenções válidas: muitas views com pouco CTA, CTA alto
com pouco WhatsApp, tráfego bom com conversão abaixo da média, regressão após
alteração. Preferência estética isolada não é motivo.

### 11.10 Segurança e privacidade

Finding `CRITICAL` ou `HIGH` tem prioridade sobre qualquer melhoria visual.
Nenhuma publicação ignora finding crítico real. Continuam protegidos: telefone,
e-mail, dados de lead, dados de parceiros, URLs internas, assets privados e
analytics. Nenhuma PII vai para tracking público.

### 11.11 Produção

O estado publicado é o baseline operacional. Publicação futura exige mudança
real, motivo declarado, gates verdes e smoke apropriado. Não publicar para
"mexer um pouco".

### 11.12 Critério para reabrir uma frente global

Somente com `SYSTEMIC_REGRESSION`, `NEW_TECHNICAL_REQUIREMENT`,
`NEW_PRODUCT_DIRECTION` ou `MAJOR_ARCHITECTURAL_CHANGE`.

Não reabrir por animação da moda, efeito visto em outro site, oscilação de 1–2
pontos de score ou porque uma página STANDARD não virou PREMIUM.

### 11.13 Isolamento de escopo

Este contrato vale para `0web.com.br`. Outros domínios ou negócios só adotam
padrões semelhantes quando tratados explicitamente em seus próprios contextos.
