# Adendo — Originalidade estrutural obrigatória em `/portfolio/:slug`

Este adendo SOMA ao Blueprint, ao Creative Direction Standard, à Quality Matrix,
ao Experience Addendum, ao Motion Addendum, ao Autonomy Addendum e à camada
institucional 0WEB. Não substitui nenhum deles.

Escopo: **projetos novos**. Projetos já publicados (Careca's Infotec, Moreira
Auto Mecânica, JKL Decor) permanecem como estão e servem apenas de baseline de
comparação — não são reprovados nem redesenhados por este adendo.

## 1. Problema

Variar paleta, textos, fotos, avaliações e logo não elimina a percepção de
repetição. A repetição percebida vem da **gramática visual**: mesmo hero, mesmo
ritmo de seções, mesma tensão compositiva, mesma distribuição de CTAs.

## 2. Princípio

Cada projeto novo deve cumprir dois níveis:

- **A. Originalidade de conteúdo** — textos, provas, mídias, SEO/busca e funil próprios.
- **B. Originalidade estrutural** — hero, ritmo de seções, hierarquia visual,
  composição de mídia, assinatura visual, distribuição de CTAs e narrativa visual próprios.

Sem a camada B o projeto **não** é exclusivo.

## 3. O que continua padronizado

Moldura do modal/vitrine, navegação anterior/próximo, copiar divulgação, camada
institucional 0WEB (`PortfolioHostCredit` + `PortfolioUpsellPopup`), gates, funis
individuais, medição, schema, QA e regras de contato (funil apenas, sem `tel:` /
`wa.me`). Isso é infraestrutura compartilhada, não identidade.

## 4. Assinatura estrutural obrigatória

Todo projeto novo declara em `src/config/portfolio-project-manifests.json`:

```json
"structuralSignature": {
  "segment": "...",
  "layoutFamily": "...",
  "heroFamily": "...",
  "sectionRhythm": "...",
  "proofStyle": "...",
  "mediaNarrative": "...",
  "ctaStyle": "...",
  "motionProfile": "..."
}
```

Os valores válidos vivem em `src/config/portfolio-structural-families.json`.
`structuralContract: 1` no manifesto ativa o gate como bloqueio.

## 5. Famílias estruturais

Editorial Premium · Local de Bairro · Industrial/Institucional · Serviço Técnico ·
Showcase Visual · Processo e Etapas · Autoridade e Prova · Catálogo/Capacidades.

Família é ponto de partida criativo, nunca template pronto: dois projetos da mesma
família precisam divergir em hero, ritmo, prova, mídia e CTA.

## 6. Proibição

Não é original a landing que apenas troca paleta, foto, logo e texto mantendo a
mesma composição, a mesma ordem de seções e a mesma tensão visual. Isso é
"template com skin" e reprova.

## 7. `STRUCTURAL_ORIGINALITY_GATE`

Implementado em `scripts/portfolio-structural-originality.mjs`, executado pelo
quality gate (`bun run check:portfolio-landing-quality`) e refletido no readiness
(`checks.structuralOriginality`). Itens avaliados em `PASS | WARN | FAIL`:

`layoutFamilyDeclared` · `heroStructureUniqueEnough` · `sectionOrderDiverse` ·
`mediaNarrativeDistinct` · `proofPresentationDistinct` · `ctaPatternDistinct` ·
`visualRhythmDistinct` · `notPerceivedAsSkinSwap`.

Limites atuais: hero repetido na janela reprova; ordem de seções ≥80% igual a um
par reprova (≥70% avisa); um eixo de composição repetido em 2+ pares da janela
reprova; menos de 3 eixos distintos frente a qualquer par reprova.

É gate separado da originalidade de assets (`check:portfolio-originality`) e da
topologia (`STRUCTURAL_SKELETON_SIMILARITY`).

## 8. Janela de comparação

Últimos 12 projetos gerenciados, últimos 5 da mesma `layoutFamily` e últimos 5 do
mesmo segmento.

## 9. Antes de `READY`

Pesquisa automática concluída, mídias e provas reais, hero forte acima da dobra,
CTA flutuante funnel-only, camada institucional 0WEB, motion declarado e
observado, estrutura distinta pelo gate, QA visual real e
`structuralOriginalityReview.approved = true` com nota editorial.

## 10. Baseline

Os três projetos publicados receberam assinatura retroativa marcada com
`baseline: true` apenas para alimentar a janela de comparação.
