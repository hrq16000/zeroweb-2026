# Centro Mega — Store Concept · evolução autônoma

Data: 2026-09-21  
Slug: `centro-mega`  
Client key: `centro-mega`  
Modo: **amostra de loja virtual / social commerce**

## Objetivo

Transformar a landing existente da Centro Mega em uma amostra convincente de loja virtual que demonstre como postagens de Facebook/Instagram podem virar:

`post → produto/categoria → busca/filtro → seleção → funil → atendimento`

Sem inventar estoque, preço atual, numeração, review ou checkout real.

## Pesquisa aplicada

Fontes públicas revalidadas:

- Linktree oficial: https://linktr.ee/centro.mega
- Instagram: https://www.instagram.com/centro.mega/
- Facebook: https://www.facebook.com/CentroMega.com.br/
- loja/contato pública: https://www.vhsys.net/centromega/contato/
- índice público de postagens: https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega
- apoio cadastral: https://cnpj.biz/17991627000154

## Produtos criados a partir de postagens verificáveis

### Poco X5 Pro · 8GB / 256GB

A postagem pública indexada de 25/01/2024 informa:

- Poco X5 Pro;
- 8 GB de RAM;
- 256 GB de memória;
- preço histórico de R$ 2.399,00 por R$ 1.899,00.

Na Store Concept esse valor **não é preço atual**. O card mostra explicitamente que se trata do preço da postagem histórica e manda confirmar valor/estoque.

### Tênis Dunk Low Pro

A postagem pública indexada de 08/11/2023 identifica o produto. Espelhos da mesma data mostram faixas de tamanho diferentes (34–39 e 34–43).

A Store Concept não escolhe uma das duas como verdade atual: usa “numeração sob consulta”.

## Categorias agregadas

A partir do mix informado pelo responsável e da atividade pública/cadastral da empresa:

- celulares/smartphones;
- acessórios;
- tênis;
- bonés;
- calçados;
- outlet.

Bonés e calçados entram como **categorias demonstrativas**, sem SKU, foto, preço ou estoque fabricado.

## Instagram/Facebook

Links públicos de posts/reels já existentes no projeto foram preservados como cards de fonte/descoberta.

Quando o conteúdo individual do post não pôde ser lido com segurança, o sistema **não inventou produto**. Essa é uma decisão deliberada de factualidade.

## Nova experiência

### Hero

- identidade “Mega Store”;
- macro tipografia;
- grid/neon/glows;
- dois cards de produto social;
- entrada direta para vitrine ou consulta;
- zero biblioteca pesada nova.

### Vitrine

- busca por texto;
- filtros por categoria;
- cards com provenance;
- histórico de preço quando verificável;
- CTA “Quero este”;
- link para fonte quando existente.

### Outlet Mode

Explica visualmente a transformação de feed em loja:

`POST → ITEM → CONTEXTO → CONSULTA`.

### Social Commerce

Cards ligam para Instagram/Facebook e posts já versionados. A rede continua sendo descoberta; a landing organiza a decisão.

### Minha seleção

Funciona como uma “sacola demonstrativa”, não checkout:

- adiciona/remove produtos;
- preserva contexto;
- envia seleção ao funil;
- não cobra;
- não promete estoque.

## Context carryover

Quando existem produtos selecionados:

- `initialAnswers.service` recebe os nomes;
- `skipPrefilledSteps=true`;
- `orderContext.order_items` recebe a seleção;
- intent = `pedido`.

O visitante não precisa redigitar aquilo que já selecionou na vitrine.

## Funil e isolamento

- `clientKey=centro-mega`;
- `ctaMode=ordering`;
- `funnelType=pedido`;
- `contactMode=funnelOnly`;
- `portfolio-whatsapp.json` continua com `null`.

Isso significa que a amostra pode salvar o lead/pedido sem cair em número de outro cliente. Um destino operacional da Centro Mega só deve ser configurado quando houver decisão/evidência canônica para o portfolio.

## Motion / visual

Perfil passou para:

- `IMMERSIVE`;
- `NEON_COMMERCE`;
- layered hero;
- stagger;
- hover depth;
- crossing depth;
- progressive scroll;
- reduced motion = opacity only.

O pedido de “leve exagero” foi interpretado como **mais profundidade, glow, contraste, estados e interação**, não como dependência pesada ou conteúdo piscando.

## Performance

Recursos visuais são majoritariamente:

- CSS gradients;
- grid;
- blur;
- shadow;
- transforms;
- primitives de motion já existentes;
- glyphs SVG via Lucide.

Não foram adicionados:

- Three.js;
- GSAP;
- WebGL;
- vídeo autoplay;
- pacote novo;
- fotografia sintética de produto.

## SEO/entity

A rota passa a tratar Centro Mega como `Store` + `ElectronicsStore`, com:

- nome;
- logo;
- mesma entidade social (Linktree/Instagram/Facebook);
- área SJP/Curitiba;
- categorias conhecidas.

Não existe `Product` com preço/availability em JSON-LD porque a amostra não possui estoque/preço atual verificável.

## Arquivos centrais

- `src/components/site/CentroMegaPage.tsx`
- `src/config/centro-mega-demo-products.ts`
- `src/config/portfolio-catalog.json`
- `src/config/portfolio-clients.json`
- `src/config/portfolio-funnel-context.json`
- `src/config/portfolio-discovery.json`
- `src/config/portfolio-motion-profiles.json`
- `src/config/portfolio-quiz-configs.generated.ts`
- `src/config/portfolio-assets.json`
- `src/routes/portfolio.$slug.tsx`
- `docs/portfolio/briefs/centro-mega.md`
- `docs/portfolio/enrichment/centro-mega.json`
- `docs/portfolio/media-plans/centro-mega.json`
- `tests/portfolio/centro-mega-store-demo.test.ts`

## Gates obrigatórios antes de publicar

- JSON parse;
- quiz registry sync;
- build/typecheck;
- portfolio boundaries/privacy;
- uniqueness/originality;
- teste dedicado Centro Mega;
- preview Vercel;
- runtime em 390 / 768 / 1440 quando o ambiente de browser estiver disponível;
- funil de seleção;
- console/hidratação;
- reduced motion.

A publicação só é encerrada depois do head final passar pelos gates executáveis disponíveis e preview final ficar pronto.
