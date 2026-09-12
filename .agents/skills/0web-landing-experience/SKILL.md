---
name: 0web-landing-experience
description: >
  Norma executável para qualquer landing page, home comercial ou redesign material do ecossistema 0WEB.
  Obriga direção autoral, repertório rico de motion quando pertinente, mídia real, CTA/funil coerente,
  evidência visual em runtime e comparação anti-template antes de concluir.
---

# 0WEB Landing Experience

Use esta skill em **toda landing page, home comercial, página institucional de aquisição e redesign material**.
Ela é global: vale para a 0WEB e para projetos de clientes, preservando a identidade própria de cada domínio.

Fonte normativa detalhada: `docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md`.

## 1. Princípio

O sistema deve se esforçar para entregar o **máximo de capacidades visuais úteis e pertinentes**,
sem transformar a página em demonstração de efeitos.

Padronizar a engenharia, nunca a criatividade.

Não aceitar como pronto:

- hero + cards + CTA genérico;
- mesma topologia visual usada em vários clientes;
- a mesma animação `fade-up` aplicada em tudo;
- seção de projetos sem imagens visíveis;
- conteúdo editorial substituído por placeholders quando existem assets reais;
- motion configurado no código, mas não observado no navegador;
- página tecnicamente verde que continua visualmente estática, pobre ou sem assinatura.

## 2. Skill stack obrigatório

Antes de implementar:

```text
0web-skill-discovery
→ 0web-portfolio-art-direction (direção/anti-template, também fora de /portfolio quando útil)
→ 0web-landing-experience
→ especialista landing/CRO adequado
→ 0web-design-system
→ Apple HIG / UX review
→ 0web-ui-quality-gates
→ browser QA com evidência visual
```

Consultar `docs/skills/REGISTRY.md` para selecionar referências externas seguras.
As referências prioritárias incluem, quando pertinentes:

- Anthropic `frontend-design` — direção visual distinta e rejeição de estética genérica;
- UI Craft — craft, motion intencional, polish e crítica visual;
- Apple HIG local (`.design-rules/`) — interação, acessibilidade, foco e redução de movimento;
- Tasteful UI / Open Design / UX Principles — crítica complementar;
- especialistas de landing/CRO — conversão sem impor template fixo.

Skill externa é especialista, não autoridade absoluta. Nunca instalar dependência, CLI ou framework
só para obedecer a uma skill.

## 3. Direção antes de layout

Registrar antes do JSX:

- objetivo e público;
- ação principal;
- personalidade da marca;
- topologia da página;
- hero e ritmo de seções;
- tratamento de imagem;
- intensidade de motion;
- 1–3 signature moments;
- assinatura interativa;
- diferenças objetivas em relação às páginas visualmente mais próximas.

Se a diferença para outra página for majoritariamente logo, cor e copy, pare e redesenhe.

## 4. Motion capability matrix

Toda página deve **avaliar explicitamente** esta paleta. Cada efeito recebe um dos estados:

`APPLIED` · `N/A_JUSTIFIED` · `REJECTED_PERFORMANCE`.

Paleta:

`fade-up` · `fade-left` · `fade-right` · `blur-in` · `scale-in` ·
`stagger-up` · `image-reveal` · `clip-reveal` · `parallax` · `marquee` ·
`float` · `header-scroll` · `menu-reveal`.

Não é obrigatório ligar todos. É obrigatório **considerar todos os pertinentes** e construir uma
gramática variada. Para uma landing comercial substancial, normalmente esperamos:

1. entrada de hero;
2. estado de header/navegação;
3. pelo menos um reveal de seção;
4. reveal específico de mídia quando houver imagens;
5. stagger em coleções quando fizer sentido;
6. microinteração de hover/focus/pressed;
7. pelo menos um efeito de profundidade/scroll quando a direção comportar;
8. comportamento próprio de menu mobile;
9. transição narrativa entre capítulos;
10. reduced-motion completo.

`EXPRESSIVE` e `IMMERSIVE` devem explorar mais de uma família de profundidade/reveal,
sem fazer todos os elementos se moverem simultaneamente.

## 5. Fail-open obrigatório

Motion nunca pode esconder o conteúdo em caso de falha.

- conteúdo existe no SSR/DOM e permanece acessível sem JS;
- se a engine de motion depender de classe de inicialização, esconder apenas **depois** da engine estar pronta;
- falha de `IntersectionObserver`, hidratação ou script não pode deixar `opacity: 0`/`clip-path` permanente;
- `prefers-reduced-motion` deixa todo conteúdo imediatamente visível.

## 6. Imagem e mídia

Usar imagens reais e relevantes sempre que existirem assets seguros.

- projeto/case publicado precisa mostrar capa real carregada;
- editorial/blog/conteúdo visual deve usar imagem real quando disponível;
- abstração gráfica pode complementar, não substituir mídia real sem justificativa;
- nunca fabricar foto, equipe, sede, cliente, avaliação ou resultado como prova factual;
- ausência de mídia deve ser declarada, não mascarada por um bloco vazio.

## 7. CTA persistente

Em páginas de conversão que adotem CTA flutuante, reutilize o componente/funil canônico do domínio.
Nunca duplique mecanismo de contato. O CTA precisa respeitar analytics, acessibilidade, safe-area,
mobile e não cobrir conteúdo.

## 8. Evidência visual obrigatória

Código não é evidência suficiente.

Antes de concluir, capture/registre no navegador real as áreas equivalentes a:

1. hero;
2. principal bloco narrativo/visual;
3. serviços/oferta;
4. experiência/prova;
5. projetos/cases/galeria **com imagens visíveis**;
6. conteúdo/editorial **com mídia real quando disponível**;
7. CTA persistente quando aplicável;
8. footer/encerramento.

Para os signature moments de motion, medir no mínimo três estados:

- **before** — antes da entrada;
- **during** — estado intermediário perceptível;
- **after** — estado final estabilizado.

Também registrar estado `reduced-motion`.

## 9. Browser QA

Validar no mínimo 390, 768 e 1440 px; para gates gerais seguir também os viewports de
`0web-ui-quality-gates`.

Verificar:

- overflow horizontal;
- console;
- hidratação;
- crop e `naturalWidth/naturalHeight` das imagens críticas;
- foco por teclado;
- menu mobile;
- CTA/funil;
- sticky/floating;
- motion observado;
- reduced-motion;
- performance e CLS.

## 10. Critério de conclusão

A página só passa quando:

- a identidade é reconhecível sem depender do logo;
- a composição não parece derivada de outro projeto;
- mídia crítica está realmente visível;
- motion existe em runtime e tem variedade contextual;
- a página tem vida, profundidade e transições sem comprometer leitura/conversão;
- mobile é uma composição própria, não desktop apenas empilhado;
- reduced-motion preserva todo o conteúdo;
- build/tests/gates aplicáveis passam.

No relatório final, listar skills efetivamente usadas, capacidades `APPLIED`, itens `N/A_JUSTIFIED`,
evidências de browser e arquivos alterados.
