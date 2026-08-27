# Motion

## Princípios

Movimento comunica causalidade, continuidade, hierarquia, feedback e progresso.
Nunca é decoração.

## Regras

- Animar `transform` e `opacity`; evitar animar layout, `width`, `top`.
- Durações: microinteração 120–200ms, transição de elemento 200–320ms,
  entrada de seção ≤ 500ms.
- Easing de saída rápida e entrada suave; sem bounce gratuito.
- Nada de atraso artificial só para exibir animação.
- `prefers-reduced-motion: reduce` desativa translações e escalas; mantém
  apenas mudanças de opacidade ou nenhuma animação.
- Elementos que entram na viewport animam uma única vez.

## Estados

initial · loading/skeleton · enter · idle · hover · focus · active · pressed ·
selected · disabled · submitting · success · warning · error · empty · exit.

Toda superfície interativa precisa de foco visível independente do hover.
