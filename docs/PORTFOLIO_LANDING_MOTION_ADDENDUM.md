# ADENDO — MOTION, MICROINTERAÇÕES E EFEITOS VISUAIS

Este adendo **soma** ao padrão existente de `/portfolio/:slug`. Não substitui
Blueprint, Visual Enrichment, Media Narrative, Signature Moments, Motion
Narrative, Quality Profile, performance ou acessibilidade.

Documentos irmãos: `docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`,
`docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md`,
`docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md`,
`docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md`.

Aplica-se a **projetos novos** (`contractVersion >= 3`). Legado publicado não é
migrado sem gatilho real.

## 1. Princípio

Toda nova landing precisa de uma estratégia consciente de movimento. Não é
"animar tudo": é escolher movimentos que melhorem hierarquia, atenção,
entendimento, profundidade, feedback e percepção de qualidade. A animação faz
parte da identidade do projeto.

## 2. Vocabulário de motion

Capacidades reconhecidas pelo padrão (nem toda landing usa todas):

- **Entrada/reveal:** `fade`, `slide`, `scale`, `blurReveal`, `maskReveal`, `stagger`.
- **Scroll-driven:** `scrollReveal`, `parallax`, `imageParallax`, `stickyScroll`,
  `pinning`, `scrollProgress`, `scrollTransform`, `horizontalScrollStory`.
- **Microinterações:** `hoverLift`, `hoverScale`, `hoverGlow`, `magneticCTA`,
  `buttonPulse`, `buttonRipple`, `iconMotion`, `cardTilt`, `cursorReactive`.
- **Texto e números:** `typewriter`, `textReveal`, `counter`, `odometer`,
  `highlightSweep`, `marquee`.
- **Mídia:** `imageReveal`, `imageZoom`, `zoomOnScroll`, `mediaCrossfade`,
  `beforeAfter`, `videoBackground`, `lottie`, `svgMotion`.
- **Transição entre seções:** `layeredTransition`, `overlapTransition`,
  `depthTransition`, `colorTransition`, `backgroundShift`, `shapeTransition`,
  `stickyHandoff`.

`counter`/`odometer` só podem animar **número real e verificado**.

## 3. Não existe pacote fixo de efeitos

Proibido o preset universal "fade + parallax + hover". Cada Blueprint escolhe o
seu conjunto a partir da entidade: tecnologia (profundidade, scan, SVG, glow),
construção (montagem, máscaras geométricas, before/after), gastronomia
(imagem dominante, transições suaves), automotivo (deslocamento, reveal
técnico, números, camadas mecânicas), saúde/profissional (fade, slide, hover
discreto).

## 4. Motion profile por projeto

Todo projeto novo declara o seu `motionProfile` no Blueprint
(`src/lib/portfolio-blueprint.ts`, `BlueprintMotionProfile`):

```ts
motionProfile: {
  intensity,            // SUBTLE | BALANCED | EXPRESSIVE | IMMERSIVE
  personality,          // expressão própria do negócio
  entrance, scroll, hover, typography, media, transitions,
  signatureEffects,     // 1–3
  reducedMotionStrategy,
  mobileStrategy,
}
```

O exemplo de outro cliente nunca é copiado.

## 5. Signature motion

Além dos `signatureMoments` visuais, 1–3 `signatureEffects` de movimento
ligados ao negócio (etapa mecânica que se preenche, percurso de entrega,
circuito que conecta serviços, antes/depois, número comprovado revelado).
Efeito sem relação com o negócio é reprovação de originalidade.

## 6. Motion e conversão

Permitido: hover, profundidade, ícone responsivo, pulse ocasional, entrada do
CTA após argumento. Proibido: pulsação contínua agressiva, shake, bounce
permanente, movimento com cara de anúncio, qualquer efeito que atrapalhe a
leitura. O CTA continua sendo o funil individual do cliente.

## 7. Motion e media narrative

Cada movimento relevante recebe papel: `INTRODUCE`, `GUIDE_ATTENTION`,
`EXPLAIN`, `CONNECT`, `REVEAL`, `PROVE`, `TRANSITION`, `REINFORCE_CTA`.

## 8. Implementação

Prioridade: 1) CSS transitions/animations; 2) primitives já existentes em
`src/components/motion`; 3) IntersectionObserver e Web APIs; 4) biblioteca de
motion já adotada; 5) dependência nova só com ganho claro e justificado.
Nunca três bibliotecas para o que uma resolve. GSAP/Lottie/vídeo apenas quando
timelines, pinning, scroll storytelling ou representação de processo
justificarem — nunca por padrão.

Vídeo de fundo exige poster, `playsinline`, autoplay sem áudio, preload
controlado, fallback estático, mobile e reduced motion.

## 9. Mobile (§12 do pedido original)

Mobile é a experiência principal. Reduzir parallax, evitar pinning, não
depender de hover, simplificar efeitos pesados, preservar scroll natural.
`MotionParallax` já é desktop-only por padrão.

## 10. `prefers-reduced-motion`

Obrigatório: sem parallax, sem movimentos longos, sem loops dispensáveis,
conteúdo imediatamente acessível. Nenhuma informação pode depender da
conclusão de uma animação.

## 11. Performance budget

Animar `transform` e `opacity`. Sem reflow contínuo. Observar FPS,
main-thread, LCP, CLS, INP, bundle, memória e bateria. Scroll travando é
reprovação, mesmo com animação bonita.

## 12. SEO

Conteúdo essencial existe no DOM e é legível sem JS. Animação altera
apresentação, nunca existência semântica.

## 13. Visual effects

`blur`, `glass`, `glow`, `grain`, `texture`, `shadow depth`, `gradient mesh`,
`spotlight`, `masking`, `clipping`, `blend`, `perspective`, `3D leve`,
`lighting`, `overlays`, `custom cursor`, `animated gradient`, `noise`,
`particles`, `SVG patterns` — apenas os compatíveis com a direção criativa.
O catálogo não é checklist.

## 14. Quality profile

O `qualityProfile` do projeto passa a registrar: `motionIntensity`,
`motionPurpose`, `interactionDensity`, `scrollExperience`,
`microinteractionQuality`, `reducedMotionCoverage`, `motionPerformance`.

## 15. MOTION_QUALITY_GATE

Validado por `scripts/check-portfolio-landing-quality.mjs` sobre
`docs/portfolio/quality-matrix/<slug>.json` (`motion`):

- [ ] motion profile definido (todos os campos, listas não vazias)
- [ ] efeitos coerentes com a marca
- [ ] entrada não repetitiva em todas as seções (≥ 2 variantes de reveal)
- [ ] pelo menos uma microinteração contextual quando aplicável
- [ ] signature motion definido (1–3) quando fizer sentido
- [ ] CTA com feedback visual adequado
- [ ] mobile adaptado
- [ ] `prefers-reduced-motion` coberto
- [ ] conteúdo acessível sem animação
- [ ] sem overflow gerado por transformações
- [ ] sem dependência pesada desnecessária
- [ ] sem regressão perceptível de performance
- [ ] nenhum loop agressivo ou distrativo

Para `contractVersion >= 3`, `motion` ausente ou checklist incompleta é
**FAIL**; abaixo disso é warning.

Dimensão de matriz correspondente: `MOTION_DESIGN`.

## 16. Originalidade

A auditoria de similaridade considera padrões de entrada, comportamento de
cards, scroll effects, transições, signature motion, intensidade, timing e
direção. Dois projetos com cores diferentes e coreografia idêntica **não** são
diferentes.

## 17. Regra final

Nenhuma landing nova volta ao padrão estático `seção → card → seção → card`.
Um projeto pode ser sofisticado com motion discreto; outro pode usar scroll
storytelling e camadas. A intensidade deriva da entidade, sempre com
responsabilidade técnica.
