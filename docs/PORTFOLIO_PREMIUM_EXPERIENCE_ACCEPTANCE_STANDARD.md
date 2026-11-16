# PORTFOLIO PREMIUM EXPERIENCE ACCEPTANCE STANDARD

Status: **normativo e não negociável** para todo novo `/portfolio/:slug`, para toda recriação material de um portfolio e para qualquer projeto que pretenda ser apresentado a um cliente como entrega visual concluída.

Este documento **não cria um template**. Ele consolida e endurece os padrões já existentes de autonomia, pesquisa de entidade, mídia, identidade, composição única, motion, skill discovery, conversão, browser QA e presença visual.

Fontes canônicas relacionadas:

- `docs/PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md`
- `docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`
- `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`
- `docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md`
- `docs/EXPERIENCE_DESIGN_MAX_STANDARD.md`
- `docs/PORTFOLIO_BRAND_STANDARD.md`
- `docs/PORTFOLIO_PRESENCE_KIT_STANDARD.md`
- `docs/AGENT_SKILLS_GOVERNANCE.md`
- `docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`

## 1. Princípio de aceitação

Uma landing não passa por estar funcional, bonita em termos genéricos, responsiva ou com build verde.

Ela precisa parecer **criada para aquela empresa e impossível de trocar de cliente sem redesenhar**.

Critério de uma linha:

> **Página pronta para cliente = verdade da empresa + mídia real pesquisada + identidade própria + composição autoral + motion com intenção + capa/OG próprias + funil correto + prova visual em runtime.**

Falha em qualquer camada principal deixa o projeto em `NEEDS_UPGRADE`, mesmo que esteja tecnicamente publicado.

## 2. “Premium” não é um preset estético

“Premium” significa **nível de craft**, não “preto + dourado”, “luxo”, “glassmorphism” ou qualquer skin fixa.

Uma loja infantil pode ser lúdica. Uma oficina pode ser técnica. Uma confeitaria pode ser tátil e artesanal. Um studio de beleza pode ser editorial. O requisito é profundidade de direção, coerência, acabamento e personalidade.

São sinais de craft premium:

- hierarquia tipográfica específica;
- escala e ritmo editorial;
- composição espacial não genérica;
- mídia tratada por função narrativa;
- transições entre capítulos;
- microinterações consistentes;
- feedback em controles;
- motion que orienta atenção;
- capa e social image próprias;
- mobile realmente composto;
- ausência de elementos “default de IA”;
- coerência entre hero, seções, funil, card do catálogo e OG.

## 3. Pesquisa pública e coleta de mídia são parte do produto

A pesquisa não termina ao encontrar nome, endereço e telefone. Para negócios visuais, a **descoberta e classificação de mídia real** é obrigatória.

### 3.1 Eixos de pesquisa

Pesquisar, quando aplicável:

1. site oficial;
2. Google/Maps/Business;
3. Facebook oficial;
4. Instagram oficial;
5. TikTok oficial;
6. YouTube oficial;
7. marketplaces/perfis comerciais públicos;
8. diretórios locais confiáveis;
9. imprensa/local/community pages;
10. material fornecido pelo operador ou proprietário.

Cada eixo registra:

`searched · found · resolved · accessible · ingestable · usable · rightsStatus · lastCheckedAt`.

### 3.2 Prioridade visual

Ordem preferencial:

1. foto/vídeo real do negócio publicada pelo próprio negócio;
2. foto/vídeo real de produto, trabalho ou ambiente do próprio negócio;
3. logo e materiais oficiais;
4. mídia oficial de presença pública com uso permitido;
5. mídia licenciada;
6. mídia gerada contextual;
7. composição gráfica/SVG original.

Mídia gerada **não substitui mídia real por conveniência**.

### 3.3 Facebook/Instagram e redes sociais

O pipeline deve tentar descobrir e qualificar mídia pública do perfil oficial do negócio.

Permitido:

- localizar perfil oficial;
- registrar URLs de posts, reels, fotos e vídeos públicos;
- baixar/versionar asset quando houver acesso técnico legítimo e direitos/uso compatíveis;
- usar post/foto/vídeo do próprio negócio como `REAL_BUSINESS_MEDIA` quando a origem e a autorização forem claras;
- gerar poster/crop/derivação técnica preservando provenance.

Proibido:

- contornar login, paywall, token, proteção anti-bot ou controle de acesso;
- scraping clandestino de conteúdo privado/restrito;
- hotlink frágil como solução de produção;
- usar imagem de terceiro encontrada na mesma busca como se fosse do cliente;
- classificar thumbnail de buscador como mídia oficial sem resolver a origem;
- apresentar asset gerado como foto real da empresa.

Se a rede estiver descoberta mas tecnicamente inacessível, o estado correto é `SOCIAL_MEDIA_PRESENT_BUT_NOT_INGESTABLE`, nunca “não existe mídia”.

Esse estado não encerra a busca. O agente continua pela escada de `PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`: embeds públicos, site/hubs, marketplace/seller, busca pública e mirrors/indexadores. Para comércio, a existência de mídia real resolvível torna inadequado encerrar a experiência com ícones de produto.

## 4. Identidade: logo é gate, não detalhe

Antes de criar marca:

1. procurar logo oficial em site, Google, Facebook, Instagram, fachada, material promocional e posts;
2. tentar normalização fiel se o material estiver fotografado ou em baixa qualidade;
3. só depois considerar criação autoral.

### 4.1 Sem logo oficial utilizável

Quando não existir logo utilizável, um projeto de demonstração/prospecção pode criar identidade original, registrada como `GENERATED_BRAND_CONCEPT` ou `GENERATED_BRAND_ASSET`.

Kit mínimo:

- wordmark;
- símbolo/brandmark quando a direção pedir;
- lockup horizontal;
- versão compacta/avatar;
- versão clara;
- versão escura;
- favicon/social icon;
- paleta;
- tipografia;
- regras mínimas de aplicação.

A identidade criada **não pode ser apresentada internamente como marca oficial anterior do cliente**. Se o cliente fornecer logo oficial depois, a identidade real tem precedência.

### 4.2 Logo genérica é FAIL

Exemplos de reprovação:

- iniciais dentro de círculo/retângulo sem conceito;
- presente genérico para qualquer loja de presentes;
- ícone Lucide tratado como marca;
- símbolo sem relação com personalidade, público ou posicionamento;
- wordmark com fonte padrão sem trabalho tipográfico;
- mesma fórmula usada em vários portfolios.

## 5. Capa, OG e hero são entregáveis diferentes

Todo portfolio visualmente concluído precisa de uma família de mídia coerente.

### 5.1 Capa do catálogo

Precisa funcionar em tamanho pequeno, comunicar segmento e identidade sem depender de texto miúdo e ser reconhecível como aquele cliente.

### 5.2 Social / Open Graph

Deve possuir composição própria para preview social, com hierarquia, safe areas e legibilidade de thumbnail.

### 5.3 Hero / primeira dobra

A primeira dobra precisa ser um **signature moment** da marca.

Não é obrigatório usar “texto à esquerda + imagem à direita”. É obrigatório que a primeira dobra:

- identifique o negócio;
- deixe claro o segmento;
- comunique proposta/benefício;
- apresente CTA;
- use mídia real quando ela for visualmente adequada e disponível;
- possua movimento/entrada compatível com a direção;
- crie atmosfera própria;
- sobreviva a 390px sem virar desktop empilhado.

`HERO_GENERIC`, `CATALOG_COVER_GENERIC`, `OG_DIRECTION_DRIFT` e `MEDIA_STARVATION` reprovam a entrega premium.

## 6. Skill stack obrigatório: competências, não nomes decorativos

Toda nova landing executa discovery e registra skills efetivamente usadas.

Stack-base de revisão:

- `0web-skill-router`;
- `0web-skill-discovery`;
- `0web-experience-design-max`;
- `0web-portfolio-art-direction`;
- `frontend-design`;
- UI/UX Pro Max;
- `0web-design-system`;
- landing/CRO specialist apropriado;
- layout engineering;
- Apple HIG / interaction review;
- `web-design-guidelines`;
- `react-best-practices`;
- `0web-landing-experience`;
- `0web-ui-quality-gates`;
- browser QA / `agent-browser` quando disponível;
- `canvas-design` ou equivalente quando houver necessidade de capa/social/brand creative;
- SVG/Lottie/video expertise quando a direção realmente exigir.

As lentes abaixo passam a ser explicitamente obrigatórias na revisão, mesmo quando não correspondem a um pacote com esse nome:

- UX Motion Designer;
- UI Animator;
- UX Animator;
- Web Motion;
- Web Motion Designer;
- Interface Animator;
- Interaction Designer;
- Art Director;
- Brand Designer;
- Editorial Designer;
- Conversion Designer;
- Mobile UX Reviewer;
- Accessibility Reviewer;
- Performance Reviewer.

“Skill aplicada” precisa produzir decisão ou evidência. Listar skill sem efeito observável é `SKILL_WASHING`.

## 7. Motion: presença obrigatória, excesso proibido

Motion faz parte da UX. Não é enfeite opcional e também não é licença para animar tudo.

### 7.1 Funções mínimas

Uma landing comercial substancial normalmente precisa cobrir:

1. **hero choreography** — reveal de headline, mídia e CTA;
2. **section choreography** — entradas contextuais, não o mesmo fade em tudo;
3. **media interaction** — image reveal, crop/zoom/hover, gallery transition ou equivalente;
4. **depth** — parallax leve, sticky narrative, layered scroll ou outro mecanismo pertinente;
5. **microinteraction** — CTA, links, cards, ícones e estados pressed/focus;
6. **navigation motion** — header/menu/anchors quando aplicável;
7. **form/funnel feedback** — loading, success, error e mudança de etapa;
8. **FAQ/accordion motion** quando houver accordion;
9. **mobile adaptation**;
10. **reduced-motion** completo.

### 7.2 Paleta a avaliar

`fade-up` · `fade-left/right` · `blur-in` · `scale-in` · `stagger-up` ·
`image-reveal` · `clip-reveal` · `parallax` · `marquee` · `float` ·
`header-scroll` · `menu-reveal` · `text-line-reveal` · `progress-line` ·
`mask-reveal` · `scroll-progress` · `sticky-storytelling` · `hover-zoom` ·
`hover-lift` · `cursor-response` · `SVG-path-animation` · `morph` ·
`crossfade` · `layout-transition` · `lightbox-transition` ·
`carousel-transition` · `Lottie` · `video-motion` · `3D/WebGL`.

Cada item recebe:

`APPLIED` · `N/A_JUSTIFIED` · `REJECTED_PERFORMANCE`.

Não é obrigatório ligar todos; é obrigatório não ignorar capacidades relevantes.

### 7.3 Signature moments

Cada projeto precisa de 1–3 momentos reconhecíveis como **dele**.

Exemplos válidos:

- logo/brandmark se monta no hero;
- produto real atravessa visualmente duas seções;
- linha desenhada no scroll acompanha um processo real;
- headline cinética responde à proposta de valor;
- galeria de trabalhos reais muda de composição no scroll;
- detalhe do ofício vira transição;
- menu/nav incorpora linguagem da marca.

Um `fade-up` comum não conta como signature moment.

## 8. Galeria, filtros, cards e mídia

Quando existirem projetos, produtos, serviços ou categorias visualmente relevantes:

- hover/focus revela contexto ou ação;
- imagem responde com zoom/pan/crop controlado;
- filtros/tabs trocam conteúdo com transição de layout;
- galeria/lightbox tem transição e teclado;
- imagens reais são priorizadas;
- motion não esconde informação;
- card não deve ser apenas `rounded-3xl + icon + title + text` repetido em todos os clientes.

## 9. Formulário/funil precisa ter feedback visual

O funil individual não pode parecer um elemento colado na página.

Precisa de:

- entrada/saída coerente;
- mudança de etapa perceptível;
- botão com pressed/loading;
- erro visível e acessível;
- confirmação/sucesso;
- foco correto;
- transição reduzida sob `prefers-reduced-motion`;
- linguagem visual compatível com o projeto.

## 10. FAQ e elementos expansíveis

Se houver FAQ:

- abrir/fechar com transição de altura/opacidade ou primitive equivalente;
- ícone/indicador muda de estado;
- `aria-expanded` e foco corretos;
- conteúdo permanece acessível;
- reduced-motion remove deslocamento, não conteúdo.

## 11. Auditoria de referências externas — princípios absorvidos

Estas fontes foram auditadas como **repertório**, nunca como templates para copiar.

### UX Motion Design — Medium
https://medium.com/uxmotiondesign/ux-motion-design-ui-animation-web-motion-qual-o-correto-794472903b70

Princípio adotado: UI animation, web motion e interface animation são manifestações da mesma disciplina quando o movimento altera a experiência. Movimento é UX, não somente decoração da camada visual.

### Wix — animação em web design
https://pt.wix.com/blog/animacao-sites-web-design

Princípios adotados:

- animação precisa ter função;
- pode orientar clique/scroll;
- pode sustentar narrativa;
- pode simplificar conteúdo;
- moderação e performance fazem parte do design.

### SVGator — animated landing pages
https://www.svgator.com/blog/animated-landing-pages-examples/

Princípios adotados:

- motion direciona atenção para headline/benefício/CTA;
- interação por scroll/hover/click cria experiência de mão dupla;
- line animation pode explicar processos;
- kinetic typography pode virar foco visual;
- SVG é opção eficiente para motion vetorial;
- cada site forte usa uma linguagem própria, não um pacote igual de efeitos.

Exemplos analisados na própria referência:

- **Stripe** — animated gradients com restrição e identidade;
- **HUYML** — animação preto-e-branco funcionando como preloader e hero;
- **MetaMusic** — line animations acionadas pelo scroll como motivo recorrente;
- **Awwwards Conference** — character animation coerente com personalidade do evento.

### Landingi — landing pages de startups
https://landingi.com/pt-br/blog/landing-pages-de-startups/

Princípios adotados:

- hierarquia precisa manter CTA claro;
- personalização por público/intenção;
- design limpo não significa design pobre;
- conversão, conteúdo, prova e mobile precisam trabalhar juntos;
- motion nunca pode competir com a ação principal.

### Nicepage — efeitos de animação
https://nicepage.com/pt/features/c/efeitos-de-animacao

Paleta observada e absorvida como repertório:

- on-scroll;
- loop;
- fade;
- slide;
- zoom;
- flip;
- rotate;
- hover de cor/borda/sombra/movimento/escala;
- image-hover;
- group-hover;
- mudança de posição inicial;
- slider/hover slider;
- parallax/camadas de profundidade.

A regra 0WEB continua sendo selecionar efeitos por significado, não usar presets em massa.

### Awwwards / A1 Gallery / Exhibita
Referências de repertório auditadas:

- https://www.awwwards.com/
- https://awwwards.withseismic.com/category/promotional
- https://www.a1.gallery/websites/animated-design
- https://www.a1.gallery/websites/animated-portfolio
- https://exhibita.design/casefiles.html

Princípio adotado: portfólios memoráveis tratam navegação, tipografia, mídia, transição e interação como parte do trabalho; motion forte é mais convincente quando executa a linguagem do próprio negócio/profissional.

## 12. Padrão para mídia social real

Quando uma empresa tem fotos/vídeos públicos próprios, o projeto não deve encerrar pesquisa após criar arte genérica.

Antes do fallback gerado, registrar tentativa real de:

- foto de perfil;
- cover;
- fotos do feed;
- reels/vídeos;
- posts com produto/trabalho;
- fachada;
- equipe quando apropriado/autorizado;
- bastidores;
- peças promocionais;
- materiais impressos;
- screenshots apenas como evidência, não como mídia editorial final por padrão.

O media plan escolhe **função por asset**:

`HERO` · `GALLERY` · `PROOF` · `PROCESS` · `BACKGROUND` · `COVER` ·
`OG` · `BRAND_REFERENCE` · `EVIDENCE_ONLY`.

### 12.1 Últimas 6 publicações

Cliente com Instagram oficial público ativo deve ter uma seção social baseada nas seis publicações mais recentes verificáveis, com links reais e mídia real. Aplicar `PORTFOLIO_SOCIAL_LATEST_SIX_STANDARD.md`.

Esse requisito é conteúdo/provenance, não template visual. O design da seção continua autoral por cliente.

## 13. Padrão de vídeo

Vídeo público do próprio cliente pode elevar muito a landing quando houver acesso e direito de uso.

Regras:

- preservar provenance;
- gerar poster;
- lazy-load;
- autoplay somente sem som e quando realmente necessário;
- respeitar `prefers-reduced-motion`;
- mobile pode usar poster estático;
- não usar vídeo pesado acima da dobra sem estratégia de LCP;
- nunca baixar/republicar vídeo de terceiro como se fosse do cliente.

## 14. Zero-template acceptance gate

A página reprova quando duas páginas recentes compartilham substancialmente:

- mesma header geometry;
- hero split equivalente;
- mesma sequência de seção;
- mesmo grid de 4/5 cards;
- mesma alternância de fundo;
- mesmo bloco de localização;
- mesmo CTA final;
- mesma gramática de motion;
- mesma geometria de capa;
- mesma fórmula de logo.

O teste definitivo continua sendo o NO-BRAND TEST:
remova logo, nome, cores, textos e fotos. Se duas páginas ainda tiverem a mesma silhueta, **FAIL**.

## 15. Browser evidence obrigatória

Nenhuma página é “premium” por inspeção de TSX.

Registrar em navegador real:

- 390px;
- 768px;
- 1440px;
- 390px reduced-motion.

Evidências:

- hero;
- signature moments BEFORE/DURING/AFTER;
- mídia real carregada;
- hover/focus;
- menu/header;
- section reveal;
- gallery/cards;
- funnel feedback;
- FAQ se aplicável;
- CTA persistente se aplicável;
- footer/closing;
- ausência de overflow;
- ausência de imagens quebradas;
- ausência de conteúdo invisível após motion.

## 16. Falhas bloqueantes

Um novo projeto não deve ser considerado visualmente concluído com qualquer um destes estados:

- `REAL_MEDIA_RESEARCH_NOT_RUN`
- `SOCIAL_MEDIA_RESEARCH_NOT_RUN`
- `SOCIAL_LATEST_6_NOT_RESEARCHED`
- `SOCIAL_LATEST_6_INCOMPLETE`
- `SOCIAL_POST_REAL_MEDIA_MISSING`
- `OFFICIAL_BRAND_RESEARCH_NOT_RUN`
- `GENERIC_GENERATED_LOGO`
- `LOGO_MISSING`
- `CATALOG_COVER_MISSING`
- `CATALOG_COVER_GENERIC`
- `OG_MISSING`
- `HERO_GENERIC`
- `MEDIA_STARVATION`
- `REAL_MEDIA_IGNORED`
- `COMMERCE_PRODUCT_MEDIA_MISSING`
- `PUBLIC_MEDIA_RESEARCH_STOPPED_EARLY`
- `SHARED_VISUAL_SKELETON`
- `REPEATED_MOTION_GRAMMAR`
- `NO_SIGNATURE_MOMENT`
- `MOTION_RUNTIME_NOT_OBSERVED`
- `FORM_FEEDBACK_MISSING`
- `MOBILE_COMPOSITION_WEAK`
- `REDUCED_MOTION_MISSING`
- `SKILL_STACK_NOT_RECORDED`
- `VISUAL_QA_MISSING`

## 17. Definição de pronto

Um novo portfolio só pode ser apresentado como entrega visual final quando:

1. pesquisa de entidade completa;
2. pesquisa de redes e mídia completa, incluindo latest-six quando houver Instagram público;
3. mídia real aproveitável usada quando existe;
4. identidade oficial encontrada ou conceito autoral devidamente classificado;
5. logo/brand system coerentes;
6. capa de catálogo própria;
7. OG/social própria;
8. primeira dobra autoral;
9. composição única;
10. motion narrative própria;
11. microinterações e feedback;
12. funnel visualmente integrado;
13. mobile, tablet e desktop aprovados;
14. reduced-motion aprovado;
15. evidência em browser;
16. comparação anti-template;
17. skills registradas;
18. performance/acessibilidade/SEO/factualidade preservados.

**Build verde é condição necessária. Nunca é prova suficiente de qualidade visual.**

## Resource Utilization Gate

Uma entrega premium precisa demonstrar **esforço real de utilização de recursos**.
Não basta ter acesso a pesquisa, mídia, skills, decision aids, motion, browser QA,
SEO, analytics ou recursos de performance e simplesmente ignorá-los.

Reprova quando:

- fonte oficial relevante não foi pesquisada;
- mídia real disponível não foi tentada;
- competência/skill útil não foi avaliada;
- decision aid evidente não foi considerado;
- mobile, acessibilidade, reduced motion ou performance ficaram sem revisão;
- funil, destino, analytics ou runtime não foram exercitados;
- `NOT_APPLICABLE` virou atalho sem justificativa;
- a implementação mais pobre foi escolhida apenas por conveniência.

Também reprova quando o agente liga recurso sem benefício apenas para “mostrar
capacidade”. A meta é **máximo de recursos relevantes, não máximo de ruído**.

A evidência mínima segue o `Resource Effort Ledger` de
`docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`.
