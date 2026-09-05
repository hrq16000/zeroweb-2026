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
| MOBILE_BLOCKER = 0 | FAIL em produção (1 página) · PASS no código atual |
| BUILD = PASS | PASS |

## 9. Declaração

A frente de Experience Standard está **tecnicamente concluída no código**:
68/68 auditados, STATIC = 0, 0 clone de motion, gates verdes.

O **encerramento formal fica condicionado a duas ações objetivas**:

1. publicar o estado atual (corrige o overflow do Paraíso do Hot Dog e a capa
   da Eisenfer em produção);
2. rodada editorial curta para diferenciar os 6 grupos de afinidade e reduzir
   as 34 capas pendentes.

Nenhum dos dois exige nova onda de redesign.
