# GLOBAL WEB EXPERIENCE STANDARD

Norma permanente de produto. Independente da arquitetura da 0WEB: qualquer
domínio ou repositório do ecossistema adota este contrato **antes** de começar
a construir páginas.

Máquina: `src/config/experience-capabilities.json`.

## 1. Princípio

Uma página fantástica não é a que tem mais animação. É aquela em que
identidade, conteúdo, movimento e conversão parecem parte da mesma ideia.

Nunca aceitar como pronto:

- página estática genérica (hero + cards + CTA) só porque o build passou;
- página saturada de efeitos sem propósito.

## 2. Camadas obrigatórias

Toda página cumpre, simultaneamente:

```text
ENGINEERING · BRAND · MOTION · INTERACTION · CONTENT · CONVERSION
SEO · ACCESSIBILITY · PERFORMANCE · ORIGINALITY · PRIVACY
```

O padrão universal é a **capacidade**. A execução visual permanece individual:
mesmas primitives, composições diferentes.

## 3. Hierarquia tecnológica

```text
CSS → APIs nativas do navegador → motion system do projeto →
biblioteca leve especializada → biblioteca pesada só com justificativa
```

Uma skill nunca justifica sozinha uma dependência nova.

## 4. Motion system

Primitives oficiais, não animação avulsa espalhada por componentes:

`MotionScope · MotionReveal · MotionStagger · MotionTextReveal ·
MotionImageReveal · MotionCounter` (+ `useInViewOnce`,
`usePrefersReducedMotion`).

Regras invioláveis:

1. conteúdo existe no DOM e é visível sem JS (SSR/SEO intactos);
2. anima apenas `transform`, `opacity`, `clip-path`;
3. `prefers-reduced-motion: reduce` remove deslocamento, parallax e zoom, e
   **nunca** esconde conteúdo;
4. entrada em viewport ocorre uma única vez;
5. animação nunca torna botão, foco ou leitura inacessível.

## 5. Intensidade

```text
SUBTLE · BALANCED · EXPRESSIVE · IMMERSIVE
```

Não existe `MAXIMUM_EVERYTHING`. Jurídico não se move como hamburgueria.

## 6. Motion profile por projeto

Campos em `motionProfileSchema` (intensity, preset, heroMotion, sectionReveal,
imageReveal, textReveal, iconMotion, hoverBehavior, depthBehavior,
scrollBehavior, staggerPattern, reducedMotionFallback e comportamento explícito
para desktop, tablet e mobile).

Presets (`EDITORIAL · CINEMATIC · TECHNICAL · PLAYFUL · LUXURY · ORGANIC ·
BOLD · MINIMAL`) são famílias combináveis, não templates fechados.

## 7. Motion budget

Por página: no máximo 3 signature moments, 1 camada de parallax, 1 grupo em
stagger por viewport, 1 animação em loop. Tudo mexendo = nada em foco.

## 8. Signature moments

Cada projeto tem no mínimo 1 momento de hero, 1 de seção e 1 de interação.
Podem ser extremamente sutis — mas precisam existir e ser próprios.

## 9. Interação e microinterações

Botões: hover, focus visível, pressed, loading, success quando aplicável.
Cards: resposta contextual (imagem, profundidade, elevação).
Links: revelação de sublinhado + foco explícito. Ícones interativos com
feedback. Sem gimmick.

## 10. Acessibilidade

Além de reduced motion: foco nunca se perde, leitura não é interrompida,
leitor de tela não recebe conteúdo duplicado, elemento animado não vira
armadilha de foco. Base: `docs/design/ACCESSIBILITY.md`.

## 11. Performance

Budgets em `src/config/portfolio-performance.json` +
`performanceBudget` das capabilities. Nunca fixar número sem medir baseline.
Proibido animar `width`, `height`, `top`, `left`, `margin`.

## 12. Mobile explícito

Cada capability declara `desktopBehavior`, `tabletBehavior`, `mobileBehavior` e
`reducedMotionBehavior`. Mobile não é desktop reduzido.

## 13. Capas autênticas

```text
PHOTO_DERIVED · BRAND_COMPOSITION · ABSTRACT_BRAND_ART
```

Nunca inventar fachada, funcionário, produto ou serviço executado. Nenhuma capa
pode ser "logo ao centro + gradiente + nome embaixo" repetido.

## 14. Originalidade inclui motion

A auditoria considera `motionProfile`, `heroMotion`, `sectionRhythm`,
`transitionStyle` e `interactionPattern`. Dois projetos não podem ser clones
animados.

## 15. Skill profile

`branding · motion · interaction · storytelling · conversion · seo ·
accessibility · performance · originality · privacy`, cada um
`REQUIRED | OPTIONAL | NOT_APPLICABLE`.

## 16. Gate

`bun run check:experience-standard` (report-only) e
`check:experience-standard:enforce`. Bloqueiam apenas falhas objetivas:

```text
MOTION_CONTENT_INACCESSIBLE · REDUCED_MOTION_BROKEN ·
MOTION_CAUSES_LAYOUT_SHIFT · INTERACTION_UNUSABLE ·
MOBILE_OVERFLOW · PERFORMANCE_REGRESSION
```

Nunca bloquear por gosto. Qualidade autoral continua em review humano.

## 17. Documentação de decisão

Cada projeto registra `whyThisMotion`, `signatureMoments`, `motionIntensity`,
`performanceNotes`, `accessibilityNotes`, `originalityNotes` em
`portfolio-motion-profiles.json → decisions`.

## 18. Identidade não é portável

A norma é global. A identidade não. Cada domínio tem público, marca, objetivo,
intensidade, funil e linguagem próprios.
