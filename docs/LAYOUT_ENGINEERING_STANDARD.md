# LAYOUT ENGINEERING — Flexbox, Grid e responsividade

Status: **normativo** para novas interfaces e manutenção material de layout no 0WEB e em `/portfolio/:slug`.

## Princípio

Layout é engenharia de experiência, não decoração. Flexbox, Grid, sizing intrínseco, media/container queries e spacing devem resolver fluxo, hierarquia, responsividade e robustez sem impor um esqueleto visual compartilhado.

**Padronizar a engenharia; nunca padronizar a composição.**

## Flexbox

Flexbox é o modelo preferencial para problemas **unidimensionais**: alinhar, ordenar visualmente dentro de um fluxo sem alterar a semântica, distribuir espaço e adaptar itens ao longo de um eixo principal.

### Conceitos obrigatórios

- **Flex container:** pai com `display: flex` ou `inline-flex`.
- **Flex items:** filhos diretos do container.
- **Main axis:** eixo controlado por `flex-direction`.
- **Cross axis:** eixo perpendicular ao principal.

### Propriedades principais

- `display: flex` — ativa o contexto flexível.
- `flex-direction` — `row`, `column` e variantes reverse; escolher pela hierarquia/fluxo, não por hábito.
- `justify-content` — distribuição ao longo do **main axis**.
- `align-items` — alinhamento ao longo do **cross axis**.
- `flex-wrap` — permitir quebra quando necessário para sobreviver a larguras menores.
- `gap` — spacing de responsabilidade do container, preferível a cascatas frágeis de margin entre filhos.
- `flex-grow`, `flex-shrink`, `flex-basis` — controlar crescimento/encolhimento com intenção.

## Regras de robustez

- Mobile-first: testar 390, 768 e 1440 px.
- Não depender de `hover` para informação ou ação essencial.
- Não usar `order`/`row-reverse` para criar uma leitura visual que contradiz a ordem semântica/teclado.
- Em filhos flexíveis com texto/mídia longa, avaliar `min-width: 0`, `overflow-wrap`, `object-fit`, `max-width` e sizing intrínseco.
- Evitar largura fixa quando `flex`, `minmax`, `clamp`, `max-width`, `aspect-ratio` ou container constraints resolvem melhor.
- `flex-wrap` deve ser considerado para chips, CTAs, metadados e grupos de cards/ações.
- Em layouts de conteúdo + mídia, o breakpoint deve responder ao conteúdo, não apenas a um número copiado de outro projeto.

## Quando usar Grid

CSS Grid é preferível quando a composição precisa controlar **duas dimensões** simultaneamente: colunas + linhas, mosaicos, layouts editoriais, áreas assimétricas, bento autoral, galeria, timeline matricial ou composição com alinhamentos cruzados.

Flexbox e Grid podem coexistir: Grid define macrocomposição; Flexbox organiza grupos internos.

## Originalidade

Flexbox/Grid são primitives de engenharia. O uso das mesmas primitives não autoriza repetir:

- geometria de hero;
- section order;
- grid topology;
- distribuição de mídia;
- navegação;
- CTA placement;
- fechamento;
- motion grammar.

Dois projetos com CSS diferente e esqueleto perceptualmente igual continuam reprovados pelo `PROJECT_UNIQUENESS_GATE`.

## Performance e acessibilidade

- Preferir layout CSS nativo a JavaScript para posicionamento responsivo.
- Evitar layout thrashing e medições contínuas no scroll.
- Não animar `width`, `height`, `top`, `left` ou margins em loops/scroll; motion deve privilegiar `transform`, `opacity` e clip controlado.
- DOM/heading/focus order deve permanecer coerente.
- Zoom do navegador não pode ser desabilitado.
- Conteúdo deve permanecer legível sem JS e com `prefers-reduced-motion`.

## Gate de decisão

Toda mudança material de layout deve registrar, no PR/changelog quando relevante:

- macro-layout escolhido: Flexbox / Grid / híbrido;
- comportamento desktop/tablet/mobile;
- estratégia de wrap/sizing;
- risco de overflow/CLS;
- impacto em semântica/teclado;
- motivo de a composição ser própria daquele projeto.
