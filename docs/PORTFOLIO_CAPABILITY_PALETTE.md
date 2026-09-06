# Portfolio Capability Palette — capacidades disponíveis, não template

Status: **normativo para novos projetos v2** · Complementa `PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`, `PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` e `PORTFOLIO_TECH_STACK_PARAMETRIZATION.md`.

## Princípio

Este documento descreve o repertório técnico e criativo que um agente pode combinar ao construir uma página. Ele **não define uma anatomia obrigatória de landing page**.

A ordem correta é:

```text
verdade do cliente → objetivo → direção de arte → topologia de layout → seleção de capacidades → implementação → QA
```

Nunca o inverso. Não montar automaticamente `header + hero + 3 cards + números + depoimentos + FAQ + CTA + footer` só porque as capacidades existem.

## 1. Papéis/competências que o agente deve representar

Uma execução substancial pode compor várias perspectivas, sem criar dependências só para “ter mais skills”:

- **UX/UI / Product design:** jornada, wireframe conceitual, hierarquia, interação, responsividade, prototipagem mental/Figma quando houver fonte real.
- **Direção de arte:** personalidade, metáfora visual, tipografia, cor, fotografia, iconografia, composição, ritmo e assinatura.
- **Front-end:** React 19 + TypeScript + TanStack Start, HTML semântico via JSX/TSX, CSS Grid/Flex/Tailwind v4, componentização.
- **Motion/interação:** CSS transitions/keyframes, APIs nativas, `motion/react` e primitives locais; SVG animado e efeitos de profundidade quando justificáveis.
- **Back-end/integrações:** server functions, Supabase/Lovable Cloud, APIs REST/GraphQL quando realmente necessárias, formulários e automações.
- **Conversão/CRO:** CTA, hierarquia de decisão, microcopy, redução de fricção, funil e intenção.
- **SEO/entidades:** metadata, canonical, Open Graph, JSON-LD, breadcrumbs, LocalBusiness/Service/FAQ quando semanticamente corretos.
- **Performance/DevOps:** Vite/Bun, lazy loading, code splitting, responsive media, cache/CDN conforme infraestrutura, CI/CD.
- **Acessibilidade:** semântica, teclado, foco, contraste, touch targets, ARIA somente quando necessário, reduced motion.
- **Privacidade/segurança:** contato server-side, validação de entrada, RLS, consentimento quando aplicável, nenhum segredo/PII no bundle.
- **Analytics/marketing:** eventos, UTMs, funil e pixels somente dentro da política de consentimento e da instrumentação aprovada.
- **QA:** browser real, mobile/tablet/desktop, cross-browser relevante, Lighthouse, axe, Playwright, regressão visual.
- **Product/Project ownership:** escopo, critérios de aceite, riscos, backlog e decisões explícitas.

## 2. Topologias de layout disponíveis

Escolher 1 direção dominante e combinações complementares. Evitar repetir a mesma topologia em clientes próximos.

- split hero 6/6, 7/5 ou assimétrico;
- full-screen / cinematic hero;
- editorial columns;
- image-first / type-first;
- masonry / gallery-first;
- broken grid / asymmetrical grid;
- bento quando a informação realmente pede modularidade;
- sticky narrative / scrollytelling;
- timeline/process-led;
- catalogue/product-led;
- blueprint/technical board;
- poster/brutalist composition;
- layered collage;
- full-bleed photography;
- minimal whitespace-led;
- horizontal rail/section quando usável e acessível;
- cardless content flow;
- mixed density (blocos densos + respiros amplos).

Grid de 12 colunas, breakpoints clássicos e containers centrados são ferramentas possíveis, não regra universal.

## 3. Navegação e header

Capacidades selecionáveis:

- header estático;
- sticky/semi-sticky;
- transparente → sólido ao rolar;
- compacto após scroll;
- navegação lateral;
- navigation rail;
- menu overlay full-screen;
- drawer lateral mobile;
- hamburger → close animado;
- anchor navigation;
- section-aware active state;
- CTA primário/secundário no cabeçalho quando a conversão pedir.

Toda navegação mobile deve manter foco, leitura, touch target e fechamento previsível.

## 4. Hero / above-the-fold

Recursos possíveis:

- foto, ilustração, vídeo curto otimizado ou composição de marca;
- split, full bleed, collage, masked image, editorial, technical/diagrammatic;
- heading forte + subtítulo + 1 CTA primário e no máximo 1 secundário quando necessário;
- microcopy factual de confiança;
- text reveal, masked reveal, image reveal, layered depth;
- parallax leve ou pointer-reactive apenas quando acrescentar significado e respeitar reduced motion.

Não exigir microcopy numérica. Número/tempo só aparece se for factual e defensável.

## 5. Conteúdo e blocos opcionais

Selecionar somente os que ajudam aquela jornada:

- proposta de valor;
- serviços/produtos;
- processo/“como funciona”;
- expertise por segmento;
- galeria/portfolio/cases;
- before/after verdadeiro;
- timeline;
- comparison;
- pricing/oferta quando real;
- FAQ;
- blog/conteúdo editorial;
- localização/região;
- equipe real;
- parceiros/logos reais;
- prova social verificável;
- métricas verificáveis;
- CTA intermediário/final;
- formulário/funil;
- mapa ou link interno para localização quando aplicável;
- newsletter/opt-in quando existe estratégia real.

Não criar bloco só para preencher espaço.

## 6. Interações e motion

Palette de comportamentos:

### Entrada/scroll
- fade;
- fade-up/down;
- slide lateral;
- clip/mask reveal;
- stagger linear, grid ou diagonal;
- progressive reveal;
- scroll progress;
- sticky transitions;
- layered depth;
- parallax sutil.

### Texto
- split words/lines;
- masked heading;
- underline draw;
- character/word stagger moderado;
- counter apenas para números reais.

### Imagens
- crop reveal;
- zoom controlado;
- pan leve;
- before/after controlável;
- lightbox;
- crossfade;
- gallery transitions.

### Cards/controles
- lift;
- depth;
- border/outline reaction;
- icon transform;
- CTA feedback;
- hover reveal;
- pointer-aware efeito sutil quando acessível;
- accordion height/opacity;
- tabs com transição;
- drawer/modal transitions.

### Loops
- marquee;
- logo/product rail;
- SVG/Lottie loop;
- ambient background motion.

Loops são exceção: devem ter pausa/controle quando necessário e fallback de reduced motion. Autoplay nunca pode bloquear leitura ou navegação.

## 7. Componentes avançados selecionáveis

- carousel/slider com teclado, indicadores e swipe;
- lightbox acessível com foco e escape;
- tabs;
- accordion com `aria-expanded`;
- filters/search;
- masonry gallery;
- timeline;
- stepper/progress;
- comparison table/cards;
- map integration;
- chat/assistente virtual com fallback de formulário;
- e-commerce/product actions;
- forms multi-step;
- sticky/mobile CTA;
- media viewer;
- blog/content feed;
- local pages por cidade/bairro quando houver estratégia e conteúdo suficiente.

## 8. Engenharia real da stack 0WEB

Traduzir referências genéricas para a stack atual:

- HTML5 → JSX/TSX semântico;
- CSS3/Flex/Grid → Tailwind v4 + CSS/Grid/Flex + tokens locais do cliente;
- Sass/SCSS → não instalar por padrão; usar somente se houver razão arquitetural real;
- Vanilla JS → handlers React e APIs nativas;
- React/Vue/Next/Nuxt → manter React 19 + TanStack Start; não trocar framework para satisfazer skill;
- Webpack/Babel → Vite/Bun já cumprem build/transpile/minificação;
- IntersectionObserver → preferir primitives locais (`useInViewOnce`, `MotionReveal`, `MotionStagger`) em vez de observers espalhados;
- GSAP/AOS/ScrollReveal → não default; avaliar somente se uma experiência não puder ser construída bem com CSS/API nativa/`motion/react`;
- Lottie → permitido condicionalmente para arte vetorial específica, com lazy-load e reduced motion;
- SVG → preferido para ícones/marca/diagramas quando apropriado;
- state management → manter local/leve; adicionar solução global só quando o domínio exigir.

## 9. Imagens e mídia

- usar material real do cliente quando houver;
- gerar arte de marca/abstrata/editorial quando necessário;
- não representar imagem gerada como prova factual de sede, equipe, cliente, obra ou resultado real;
- `PortfolioImage`, dimensões explícitas, lazy loading e prioridade somente no LCP;
- WebP/JPEG/PNG/SVG e AVIF quando pipeline suportar e fizer sentido;
- responsive images/srcset quando necessário;
- vídeo curto somente se comprimido, com poster, sem autoplay sonoro e com estratégia mobile;
- code-split de galerias, lightboxes e mídia pesada.

## 10. Performance

Princípios:

- animar preferencialmente `transform`, `opacity` e `clip-path`;
- evitar listeners contínuos de scroll quando CSS/API nativa ou observer resolvem;
- lazy loading e dynamic import para recursos não críticos;
- não carregar libs de animação/slider/mapa se a página não as usa;
- reduzir payload por página, não recursos percebidos pelo usuário;
- cache/CDN conforme plataforma;
- critical assets do hero com prioridade correta;
- Lighthouse/field data orientam refinamento; meta >=90 é objetivo, não licença para remover identidade arbitrariamente.

## 11. Acessibilidade

Obrigatório:

- H1 único e hierarquia correta;
- landmarks semânticos;
- foco visível;
- tab order lógica;
- touch targets >=44px onde aplicável;
- contraste AA;
- alt útil e contextual;
- labels reais em forms;
- ARIA apenas para cobrir semântica ausente;
- focus trap em dialogs/drawers;
- escape/close previsível;
- `prefers-reduced-motion`;
- controles para autoplay quando necessário.

Widgets de acessibilidade não substituem acessibilidade nativa. Libras/assistive widgets são integrações opcionais quando houver decisão de produto, fornecedor e revisão de privacidade/performance.

## 12. SEO, entidades e local

Possíveis capacidades:

- title/description/canonical únicos;
- Open Graph/Twitter Card;
- Organization/LocalBusiness/Service/Product/FAQ/Breadcrumb/Article conforme o conteúdo real;
- sitemap e robots;
- breadcrumbs;
- páginas locais por cidade/bairro somente com conteúdo substancial, intenção distinta e prevenção de doorway pages;
- internal linking;
- conteúdo legível por mecanismos e LLMs;
- imagem social própria.

Não gerar schema de FAQ se a FAQ não estiver visível/real. Não marcar métricas ou avaliações inexistentes.

## 13. Marketing, analytics e consentimento

Capacidades condicionais:

- UTM preservation;
- CTA/funnel events;
- analytics first-party/aprovado;
- pixels Google/Meta;
- tag manager;
- experiments/A-B tests;
- CRM integration;
- newsletter/opt-in;
- chat/assistant;
- e-commerce integration.

Consentimento granular/cookie banner é obrigatório **quando** houver tags/cookies não essenciais que exijam consentimento. Não adicionar banner vazio em site sem esse tipo de coleta. Tags de marketing devem respeitar a decisão de consentimento antes de disparar.

## 14. Segurança/compliance

- HTTPS na infraestrutura;
- contato operacional somente server-side;
- validação server/client;
- RLS onde houver Supabase;
- proteção contra abuso/rate limit conforme endpoint;
- CSRF conforme o modelo de sessão/endpoint — não adicionar token ornamental onde o framework já fornece mitigação adequada;
- política de privacidade e termos quando aplicáveis;
- LGPD por minimização de dados, finalidade e consentimento onde necessário;
- headers de segurança via infraestrutura/servidor conforme compatibilidade.

## 15. Critério de seleção de capacidades

Para cada recurso escolhido, responder no creative brief:

1. **Por quê?** Qual problema de negócio/UX resolve?
2. **Por que aqui?** Por que combina com esta marca?
3. **Qual custo?** Payload, interação, acessibilidade, manutenção.
4. **Qual fallback?** Mobile, reduced motion, JS ausente, mídia lenta.
5. **Como evita template?** O que torna esta aplicação específica do cliente?

Se não houver boa resposta para 1 e 2, não usar.

## 16. Anti-template gate conceitual

Um novo projeto v2 deve falhar na revisão quando:

- a ordem de seções replica um vizinho sem justificativa;
- usa a mesma família de hero + cards + CTA apenas recolorida;
- tipografia/paleta não têm relação com o cliente;
- motion vem apenas do default de segmento;
- imagens são genéricas e intercambiáveis;
- todas as capacidades foram ligadas indiscriminadamente;
- a página não possui pelo menos uma assinatura visual ou interativa identificável.

**Regra final:** máximo de repertório disponível, mínimo de automatismo visual.
