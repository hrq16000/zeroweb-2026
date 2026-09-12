# Motion

Norma detalhada para landing/home comercial:
`docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md`.

## Princípios

Movimento comunica causalidade, continuidade, hierarquia, feedback, profundidade e progresso.
Nunca é decoração gratuita.

Em landing pages, homes comerciais e páginas institucionais de aquisição, motion faz parte da
experiência e da originalidade. O sistema deve buscar o **máximo de capacidades pertinentes**,
sem transformar a página em vitrine de efeitos.

## Regras

- Preferir `transform`, `opacity` e `clip-path`; evitar animar layout (`width`, `height`, `top`, `left`, `margin`).
- Durações de referência: microinteração 120–240ms; transição de elemento 200–420ms;
  reveal de seção/mídia 350–900ms; hero/signature moment 600–1200ms quando a direção justificar.
- Easing de saída rápida e entrada suave; sem bounce gratuito.
- Nada de atraso artificial só para exibir animação.
- `prefers-reduced-motion: reduce` desativa deslocamento, zoom, parallax, marquee e loops não essenciais;
  mantém todo conteúdo visível e utilizável.
- Elementos que entram na viewport normalmente animam uma única vez.
- Motion é **fail-open**: falha de JS/observer/hidratação nunca pode deixar conteúdo crítico invisível.
- A mesma animação não deve ser aplicada mecanicamente a todas as seções.

## Motion Matrix — paleta global

Toda landing/home comercial deve avaliar explicitamente, quando pertinentes:

`fade-up` · `fade-left` · `fade-right` · `blur-in` · `scale-in` ·
`stagger-up` · `image-reveal` · `clip-reveal` · `parallax` · `marquee` ·
`float` · `header-scroll` · `menu-reveal`.

Cada capability recebe:

`APPLIED` · `N/A_JUSTIFIED` · `REJECTED_PERFORMANCE`.

Não é obrigatório usar todas. É obrigatório considerar as pertinentes e construir uma gramática
variada entre hero, navegação, seções, mídia, coleções, microinterações e transições de capítulos.

## Estados

initial · loading/skeleton · enter · idle · hover · focus · active · pressed ·
selected · disabled · submitting · success · warning · error · empty · exit.

Toda superfície interativa precisa de foco visível independente do hover.

## Evidência em runtime

Configuração de motion não é prova de motion.

Para signature moments, registrar no navegador real pelo menos:

- `BEFORE` — antes do gatilho;
- `DURING` — estado intermediário perceptível;
- `AFTER` — estado final estabilizado.

Verificar no mínimo um momento do hero, um reveal/scroll de seção ou mídia e uma
microinteração/estado de navegação, além de `prefers-reduced-motion`.

Quando houver projetos/cases ou mídia editorial, comprovar também que as imagens críticas
carregam e permanecem visíveis após o reveal.
