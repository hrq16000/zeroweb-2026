# Auditoria — Lacuna de experiência premium nos dois portfolios mais recentes

Data: 2026-09-20  
Escopo: **somente leitura e documentação**. Nenhum componente, asset, rota, funil, contato ou página foi alterado nesta auditoria.

Projetos observados:

- `/portfolio/catharine-lima-studio`
- `/portfolio/cris-presentes-colonia-rio-grande`

Objetivo: entender por que páginas tecnicamente completas ainda podem ser percebidas como “template”, “secas” ou inadequadas para apresentação comercial.

## 1. Conclusão

A reclamação procede no nível de **direção criativa e qualidade percebida**, embora os dois projetos já possuam arquivos chamados `logo.svg`, `capa-card.svg` e assets de hero.

O problema não é literalmente “arquivo inexistente”. O problema é que esses arquivos são **soluções gráficas muito básicas**, e a composição das duas páginas repete a mesma gramática.

As duas páginas seguem essencialmente:

`sticky header → split hero → faixa/grid escuro de cards → split image/text → localização → grande CTA → footer`.

Também compartilham:

- mesma intensidade `BALANCED`;
- `MotionReveal` no hero;
- `MotionStagger` no grid;
- CTA em pill;
- cards arredondados;
- fundo claro + seção escura + retorno ao claro;
- hero com arte vetorial gerada;
- ausência de mídia real do negócio;
- ausência de signature motion realmente própria.

Pelo `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD`, isso é uma lacuna séria de originalidade.

## 2. Catharine Lima Studio

Arquivos observados:

- `src/components/site/CatharineLimaStudioPage.tsx`
- `public/images/catharine-lima-studio/logo.svg`
- `public/images/catharine-lima-studio/capa-card.svg`
- `public/images/catharine-lima-studio/hero.svg`
- `docs/portfolio/enrichment/catharine-lima-studio.json`
- `docs/portfolio/briefs/catharine-lima-studio.md`

### 2.1 Marca

Existe `logo.svg`, porém é um monograma **CL** dentro de círculos e um retângulo arredondado. Ele resolve tecnicamente “há um logo”, mas não demonstra pesquisa de linguagem visual nem uma identidade de marca memorável.

Classificação qualitativa desta auditoria: `GENERATED_BRAND_CONCEPT_WEAK`.

### 2.2 Capa

Existe `capa-card.svg`, porém ela é uma composição de gradiente + texto + lista de serviços. Funciona como placeholder editorial, não como capa forte de marca/produto.

Problemas:

- muito dependente de texto;
- pouca memória visual;
- sem foto/trabalho real;
- não entrega uma imagem que “vende” o negócio em thumbnail;
- não traduz acabamento premium de beleza.

### 2.3 Hero

O hero existe, mas usa `hero.svg` criado para a página, não foto ou vídeo real do Studio.

O enrichment registra corretamente:

- Facebook encontrado;
- perfil não ingerível;
- fotos/videos não obtidos.

Isso é bom em factualidade, porém insuficiente para chamar o projeto de **premium visual concluído** se existem materiais públicos do Studio que ainda não foram recuperados por canal autorizado/tecnicamente acessível.

### 2.4 Motion

O componente usa `MotionReveal`, `MotionStagger` e hover simples no CTA. Isso comprova motion básico, não uma narrativa de UX Motion própria.

Ausentes ou não observados no código:

- header-scroll autoral;
- menu reveal;
- media reveal próprio;
- parallax/depth narrative;
- clip/mask reveal;
- kinetic type;
- gallery motion;
- hover de mídia;
- transições entre capítulos;
- FAQ accordion;
- interação ligada ao ofício;
- signature moment identificável.

## 3. Cris Presentes · Colônia Rio Grande

Arquivos observados:

- `src/components/site/CrisPresentesColoniaRioGrandePage.tsx`
- `public/images/cris-presentes-colonia-rio-grande/logo.svg`
- `public/images/cris-presentes-colonia-rio-grande/capa-card.svg`
- `public/images/cris-presentes-colonia-rio-grande/hero.svg`
- `docs/portfolio/enrichment/cris-presentes-colonia-rio-grande.json`
- `docs/portfolio/briefs/cris-presentes-colonia-rio-grande.md`

### 3.1 Marca

O `logo.svg` é um pictograma de caixa de presente. É semanticamente relacionado ao ramo, mas continua genérico: poderia servir para centenas de lojas de presentes.

Classificação qualitativa desta auditoria: `GENERIC_GENERATED_LOGO`.

### 3.2 Capa

A capa é uma matriz abstrata de blocos que representa presentes/papelaria. Não há produto, loja, fachada, brinquedo, material de papelaria ou asset real.

Ela cumpre o papel técnico de “não deixar vazio”, mas não cumpre o padrão de capa irresistível para catálogo.

### 3.3 Pesquisa de mídia

O enrichment resolveu muito bem a entidade legal/endereço/CNAEs, mas registra:

`realBusinessPhotos: []`.

Isso demonstra uma assimetria no pipeline: a pesquisa factual foi mais profunda que a pesquisa visual.

Para um comércio, a autonomia precisa continuar até:

- pesquisar fachada;
- pesquisar presença do Jacomar/unidade;
- buscar Facebook/Instagram;
- buscar posts/fotos públicas do próprio negócio;
- buscar imagens associadas a diretórios e confirmar provenance;
- registrar por que cada fonte é ou não utilizável.

### 3.4 Motion e composição

O padrão de motion e layout é praticamente o mesmo do Catharine:

- sticky header;
- split hero;
- `MotionReveal`;
- cards escuros em grid;
- split image/text;
- localização;
- CTA final.

Isso viola o espírito de “composição visual nunca compartilhada”, mesmo que o texto, cores e ícones sejam diferentes.

## 4. Auditoria das referências externas

### 4.1 UX Motion Design
https://medium.com/uxmotiondesign/ux-motion-design-ui-animation-web-motion-qual-o-correto-794472903b70

Entendimento absorvido: a animação muda a **experiência**, portanto deve ser tratada como disciplina de UX. Nomenclaturas como UI Animator, UX Animator, Web Motion e Interface Animator convergem para a mesma responsabilidade: desenhar comportamento temporal da interface.

### 4.2 Wix
https://pt.wix.com/blog/animacao-sites-web-design

Entendimento absorvido:

- motion orienta;
- motion sustenta storytelling;
- motion pode ensinar;
- motion precisa de propósito;
- excesso prejudica performance e clareza.

### 4.3 SVGator
https://www.svgator.com/blog/animated-landing-pages-examples/

Padrões relevantes:

- interactive scroll/hover/click;
- line/path animation;
- storytelling;
- kinetic typography;
- animated gradients;
- hero/preloader como uma só assinatura;
- motion graphics contextuais;
- SVG como mídia leve.

Casos destacados pela própria referência:

- Stripe: gradiente animado, mas controlado;
- HUYML: conceito preto/branco simples e memorável;
- MetaMusic: linhas que entram no scroll e viram linguagem recorrente;
- Awwwards Conference: characters e cores alinhados à personalidade do evento.

### 4.4 Landingi
https://landingi.com/pt-br/blog/landing-pages-de-startups/

Entendimento absorvido: design precisa continuar legível e focado em CTA. “Mais rico” não significa “mais ruído”.

### 4.5 Nicepage
https://nicepage.com/pt/features/c/efeitos-de-animacao

Inventário útil observado:

- on-scroll;
- fade;
- slide;
- zoom;
- flip;
- rotate;
- hover movement;
- hover shadow;
- hover scale;
- image hover;
- group hover;
- loops;
- parallax.

Não devem virar presets repetidos; servem como repertório para uma motion grammar própria.

### 4.6 Awwwards / A1 / Exhibita

Referências:

- https://awwwards.withseismic.com/category/promotional
- https://www.a1.gallery/websites/animated-design
- https://www.a1.gallery/websites/animated-portfolio
- https://exhibita.design/casefiles.html

Padrão comum: os trabalhos mais fortes não usam motion apenas “em cima do layout”. A navegação, a tipografia, a mídia e a própria forma de explorar o conteúdo são parte da identidade.

## 5. Diagnóstico de causa

O repositório **já possuía documentação forte** antes desta auditoria:

- `PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM` já exigia pesquisa, identidade, hero, motion e autonomia;
- `PORTFOLIO_ENTITY_ENRICHMENT_STANDARD` já priorizava mídia real;
- `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD` já proibia o mesmo skeleton visual;
- `LANDING_PAGE_MOTION_EVIDENCE_STANDARD` já tratava motion e evidência visual como obrigatórios;
- `AGENT_SKILLS_GOVERNANCE` já exigia skill discovery.

Portanto, a falha principal é de **execução/aceitação**: o pipeline permitiu considerar “suficiente” uma página que satisfazia a existência de assets e motion básico, mas não o nível de craft que os próprios documentos pretendiam.

## 6. Mudança de interpretação adotada

A partir desta auditoria, “tem logo”, “tem capa”, “tem motion” e “pesquisou mídia” deixam de ser checks booleanos suficientes.

A interpretação correta passa a ser:

- `logo exists` → não basta; precisa ser marca pesquisada ou conceito autoral forte;
- `cover exists` → não basta; precisa ser capa reconhecível e comercial;
- `motion exists` → não basta; precisa existir narrativa temporal própria;
- `media searched` → não basta; precisa demonstrar busca social/publica profunda e provenance;
- `unique colors/copy` → não basta; precisa passar NO-BRAND TEST;
- `build green` → não basta; precisa de browser evidence;
- `generated hero` → é fallback, não substituto automático de mídia real.

## 7. Regra para a próxima implementação

Esta auditoria **não autoriza alteração imediata** nos dois projetos.

Quando houver rodada de correção futura, a ordem recomendada será:

`ENTITY/MEDIA RESEARCH → BRAND RESOLUTION → REAL MEDIA PLAN → 3 ART DIRECTIONS → UNIQUE COMPOSITION → HERO/COVER/OG → MOTION STORYBOARD → IMPLEMENT → BROWSER QA → PROJECT UNIQUENESS → READY`.

Nenhuma correção visual deve começar copiando layout de outra landing.
