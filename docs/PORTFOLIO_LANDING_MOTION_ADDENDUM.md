# ADENDO — MOTION, MICROINTERAÇÕES E EFEITOS VISUAIS

Este adendo **soma** ao padrão existente de `/portfolio/:slug`. Não substitui
Blueprint, Visual Enrichment, Media Narrative, Signature Moments, Motion
Narrative, Quality Profile, performance ou acessibilidade.

Documentos irmãos: `docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`,
`docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md`,
`docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md`,
`docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md`,
`docs/EXPERIENCE_DESIGN_MAX_STANDARD.md`.

Aplica-se a **projetos novos** (`contractVersion >= 3`) e a qualquer redesign
material de projeto existente. Legado publicado não é migrado em massa sem
gatilho real, mas toda página tocada materialmente deve ser reavaliada pela
matriz global.

## 1. Princípio

Toda nova landing precisa de uma estratégia consciente de movimento. Não é
"animar tudo": é escolher movimentos que melhorem hierarquia, atenção,
entendimento, profundidade, feedback e percepção de qualidade. A animação faz
parte da identidade do projeto.

A regra global é **máximo de capacidades relevantes, não máximo de efeitos**.
Cada capacidade é analisada e classificada como `REQUIRED`, `OPTIONAL` ou
`NOT_APPLICABLE`. O que não entra precisa ter sido conscientemente avaliado.

## 2. Matriz canônica de motion

Vocabulário obrigatório de avaliação para landing/home/portfolio material:

| Capability | Eixo | Intenção |
|---|---|---|
| `fade-up` | Y + opacity | entrada editorial/progressão de leitura |
| `fade-left/right` | X + opacity | alternância direcional, timeline, contraponto |
| `blur-in` | blur → foco | atmosfera/foco progressivo |
| `scale-in` | scale → 1 | ênfase de item, CTA ou mídia |
| `stagger-up` | sequência Y | grupos, listas e grids com ritmo |
| `image-reveal` | mídia | máscara/zoom/reveal de imagem |
| `clip-reveal` | clip/mask | recorte editorial, cartaz, transição de camada |
| `parallax` | scroll | profundidade e separação de planos |
| `marquee` | fluxo contínuo | repertório/tags/selos quando semanticamente útil |
| `float` | loop sutil | profundidade decorativa de elementos abstratos |
| `header-scroll` | scroll/state | compactação, contraste e mudança de estado do header |
| `menu-reveal` | navigation | abertura/stagger/máscara do menu |
| `text-line-reveal` | typography | hero, manifesto e títulos por linha/palavra |
| `progress-line` | scroll progress | leitura longa, capítulos e storytelling |

Esses nomes são a camada de decisão global. A implementação pode usar nomes de
primitive locais equivalentes, desde que a evidência deixe clara a capability.

## 3. Vocabulário ampliado

Capacidades reconhecidas pelo padrão:

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
- **Carga/estado:** `skeleton`, `preloader`, `formFeedback`, `accordionTransition`.
- **Profundidade avançada:** `perspective3d`, `webglScene`, `cursorDepth`, apenas
  quando houver ganho real de narrativa/identidade.

`counter`/`odometer` só podem animar **número real e verificado**.

## 4. Não existe pacote fixo de efeitos

Proibido o preset universal "fade + parallax + hover". Cada projeto escolhe o
seu conjunto a partir da entidade e da jornada. Segmento inspira, não determina
esqueleto nem coreografia.

Exemplos de linguagem possível, nunca template: tecnologia pode trabalhar
profundidade, scan, SVG e glow; construção pode usar montagem e máscaras
geométricas; gastronomia pode privilegiar imagem dominante e transições suaves;
automotivo pode usar deslocamento e reveal técnico; saúde/profissional tende a
motion discreto. A direção final sempre nasce do creative brief específico.

## 5. Motion profile por projeto

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

Além disso, a quality matrix/brief precisa registrar a decisão da matriz global:
`REQUIRED | OPTIONAL | NOT_APPLICABLE` para as 14 capabilities canônicas.

## 6. Signature motion

Além dos `signatureMoments` visuais, 1–3 `signatureEffects` de movimento
ligados ao negócio (etapa mecânica que se preenche, percurso de entrega,
circuito que conecta serviços, antes/depois, número comprovado revelado).
Efeito sem relação com o negócio é reprovação de originalidade.

## 7. Motion e conversão

Permitido: hover, profundidade, ícone responsivo, pulse ocasional, entrada do
CTA após argumento. Proibido: pulsação contínua agressiva, shake como único
feedback, bounce permanente, movimento com cara de anúncio ou qualquer efeito
que atrapalhe leitura. O CTA continua sendo o funil individual do cliente.

## 8. Motion e media narrative

Cada movimento relevante recebe papel: `INTRODUCE`, `GUIDE_ATTENTION`,
`EXPLAIN`, `CONNECT`, `REVEAL`, `PROVE`, `TRANSITION`, `REINFORCE_CTA`.

## 9. Implementação

Prioridade: 1) CSS transitions/animations; 2) primitives já existentes em
`src/components/motion`; 3) IntersectionObserver e Web APIs; 4) biblioteca de
motion já adotada; 5) dependência nova só com ganho claro e justificado.
Nunca três bibliotecas para o que uma resolve. GSAP/Lottie/vídeo/WebGL apenas
quando timelines, pinning, scroll storytelling ou representação de processo
justificarem — nunca por padrão.

Vídeo de fundo exige poster, `playsinline`, autoplay sem áudio, preload
controlado, fallback estático, mobile e reduced motion.

3D exige fallback 2D/estático, orçamento de performance explícito e experiência
completa sem hover/cursor.

## 10. Mobile

Mobile é a experiência principal. Reduzir parallax, evitar pinning, não
depender de hover, simplificar efeitos pesados, preservar scroll natural.
`MotionParallax` é desktop-only por padrão.

## 11. `prefers-reduced-motion`

Obrigatório: sem parallax, sem deslocamentos longos, sem loops dispensáveis,
sem blur/scale cinético desnecessário; conteúdo imediatamente acessível. Nenhuma
informação pode depender da conclusão de uma animação.

## 12. Performance budget

Animar `transform`, `opacity` e `clip-path` bounded. Sem reflow contínuo.
Observar FPS, main-thread, LCP, CLS, INP, bundle, memória e bateria. Scroll
travando é reprovação, mesmo com animação bonita.

## 13. SEO

Conteúdo essencial existe no DOM e é legível sem JS. Animação altera
apresentação, nunca existência semântica.

## 14. Visual effects

`blur`, `glass`, `glow`, `grain`, `texture`, `shadow depth`, `gradient mesh`,
`spotlight`, `masking`, `clipping`, `blend`, `perspective`, `3D leve`,
`lighting`, `overlays`, `custom cursor`, `animated gradient`, `noise`,
`particles`, `SVG patterns` — apenas os compatíveis com a direção criativa.
O catálogo não é checklist visual obrigatório.

## 15. Quality profile

O `qualityProfile` do projeto registra: `motionIntensity`, `motionPurpose`,
`interactionDensity`, `scrollExperience`, `microinteractionQuality`,
`reducedMotionCoverage`, `motionPerformance` e `motionCapabilityMatrix`.

## 16. MOTION_QUALITY_GATE

Validado por `scripts/check-portfolio-landing-quality.mjs` sobre
`docs/portfolio/quality-matrix/<slug>.json` (`motion`):

- [ ] motion profile definido (todos os campos necessários)
- [ ] matriz canônica avaliada (`REQUIRED | OPTIONAL | NOT_APPLICABLE`)
- [ ] efeitos coerentes com a marca/jornada
- [ ] entrada não repetitiva em todas as seções (≥ 2 variantes de reveal quando aplicável)
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

Para `contractVersion >= 3`, motion ausente ou não avaliado é **FAIL**; abaixo
disso é warning, salvo redesign material que optou pelo padrão novo.

Dimensão de matriz correspondente: `MOTION_DESIGN`.

## 17. Originalidade

A auditoria de similaridade considera padrões de entrada, comportamento de
cards, scroll effects, transições, signature motion, intensidade, timing e
direção. Dois projetos com cores diferentes e coreografia idêntica **não** são
diferentes.

## 18. Regra final

Nenhuma landing nova volta ao padrão estático `seção → card → seção → card`,
mas também nenhuma landing precisa virar showreel. Um projeto pode ser sofisticado
com motion discreto; outro pode usar scroll storytelling e camadas. A intensidade
deriva da entidade, sempre com responsabilidade técnica.