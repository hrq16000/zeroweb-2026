# 0WEB — Universal Portfolio SEO Standard

Status: **normativo**  
Escopo: todos os `/portfolio/:slug` atuais e futuros.

## Princípio

SEO é infraestrutura universal do portfólio. Cada projeto mantém conteúdo, identidade,
entidade e composição próprios, mas não pode depender de trabalho manual para receber a
camada técnica mínima de descoberta, indexação e interligação.

O objetivo é ampliar autoridade e cobertura sem produzir doorway pages, texto oculto,
keyword stuffing, avaliações inventadas ou informação local não comprovada.

Este padrão deve ser lido em conjunto com `PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md`.
A camada universal existe para garantir o básico em escala, mas **cada portfolio publicado
deve se comportar como site individual**, com entidade, conteúdo, mídia, contexto local,
head, schema e descoberta próprios.

Este padrão obedece à `0WEB_UNIVERSAL_ADDITIVE_GROWTH_CONSTITUTION.md`.
Quando uma página comercial/local legítima precisar melhorar indexabilidade, a ação
preferencial é **ganhar conteúdo, mídia, links, contexto local e utilidade**, não perder
conteúdo já aprovado. Remoção é exceção rastreável, não técnica padrão de SEO.

## Contrato obrigatório

Todo projeto publicado deve possuir, como contrato mínimo de um site individual:

- URL canônica exclusiva derivada do slug;
- `index,follow,max-image-preview:large` somente quando realmente publicado;
- title único e útil, com entidade + contexto local/temático quando couber em até 65 caracteres;
- meta description factual e específica do cliente;
- Open Graph completo, `og:locale=pt_BR` e imagem social;
- Twitter Card e texto alternativo da imagem social;
- Schema.org válido;
- BreadcrumbList;
- sitemap único de portfólio;
- submissão por GSC/IndexNow nos gatilhos de publicação já existentes;
- conteúdo SSR/indexável;
- rede interna de links contextual entre portfólios;
- nenhuma alegação criada apenas para SEO.

## Grafo universal de entidades

Todo portfolio publicado deve emitir um grafo JSON-LD factual por meio de
`portfolioEntityGraphSchema`.

O grafo mínimo contém:

- `WebPage` canônica, em `pt-BR`;
- uma entidade principal genérica `Thing`, evitando classificar pessoa/empresa
  sem evidência suficiente;
- `BreadcrumbList` universal `0WEB → Portfólio → projeto`;
- `Place` somente quando cidade/estado são específicos e comprovados;
- `DefinedTerm` para temas editoriais comprovados;
- `Service` somente quando a fonte do projeto fornece serviços explícitos;
- imagem principal somente quando existe asset real.

Para Managed, os serviços já persistidos no projeto podem alimentar nós
`Service`, com `provider` apontando para a entidade e `areaServed` apenas
quando há localidade comprovada.

Tags editoriais nunca são automaticamente promovidas a serviços. O objetivo é
aumentar entendimento de entidade por buscadores sem transformar inferência em
fato.

## Enriquecimento semântico individual

A camada universal também deve expor contexto factual curto por projeto, derivado apenas de
dados já comprovados no catálogo ou, para Managed, dos campos salvos no próprio projeto.

O bloco pode usar:

- entidade/marca;
- segmento;
- cidade/estado quando específicos;
- até cinco temas vindos de tags ou serviços reais;
- links para hubs regionais já existentes em `/portfolio-em/*`.

O texto nunca inventa atributos, preços, bairros, certificações, horários, avaliações ou
serviços. Tags que apenas repetem a localidade são filtradas para evitar stuffing.

Os hubs regionais formam circuito de navegação bidirecional: hub → projeto e projeto → hub.
Isso reforça rastreamento e contexto geográfico sem criar páginas artificiais.

## Rede de relevância universal

A casca `PortfolioStandardShell` deve renderizar `PortfolioSeoNetwork`.

O resolvedor usa apenas o catálogo publicado e, para Managed, contexto factual já salvo.
A descoberta local deve privilegiar proximidade quando houver dados suficientes:

1. mesmo bairro;
2. contexto local/bairros relacionados quando modelados;
3. mesma cidade;
4. mesma região metropolitana/estado;
5. mesmo segmento, serviços/tags em comum e afinidade temática;
6. descoberta editorial complementar.

A rede nunca inventa distância ou proximidade. Na ausência de dado geográfico suficiente,
usa afinidade semântica de forma neutra.

Cada página recebe até seis links HTML reais para outras páginas publicadas. O grafo também
é exposto como `ItemList` JSON-LD.

Quando uma página não possui vizinhos semanticamente fortes suficientes, o restante é
preenchido como **descoberta editorial**. O texto da interface não pode fingir relação de
cidade, segmento ou serviço inexistente.

## Titles e palavras-chave

`portfolioUniversalSeoTitle` resolve o title universal de forma determinística:

1. marca + subtítulo, se couber;
2. marca + cidade útil;
3. marca + segmento;
4. marca.

Runtime/admin continua tendo precedência quando existe `seo_title` válido.

`portfolioUniversalKeywords` combina entidade, tags, segmento e localidade sem repetir
termos. O campo ajuda governança editorial; não deve ser tratado como fator principal de
ranking.

## Dados locais e entidades

Cidade, endereço, telefone, horário, rating, preço, certificação, social profile e
coordenadas só entram em schema quando houver evidência válida. Cidade genérica como
“Brasil” ou “Região a confirmar” nunca é promovida a presença local específica.

Schema específico já comprovado por cliente prevalece sobre inferência genérica.

## Conteúdo e escala

Escala exponencial significa:

- mais páginas reais e ricas;
- mais relações semânticas entre páginas;
- maior cobertura de entidades e intenções;
- conteúdo original e verificável;
- atualização automática de sitemap/indexação;
- prevenção de regressões por gate.

Não significa replicar o mesmo texto por cidade, criar páginas quase vazias ou multiplicar
slugs apenas para capturar palavras-chave.

## Gate

`tests/portfolio/universal-seo-network.test.ts` faz parte de `test:portfolio-ops` e,
portanto, do prebuild. Ele verifica:

- todos os projetos publicados entram no grafo;
- seis relações são produzidas por projeto;
- não existe self-link;
- title universal permanece único e <= 65 caracteres;
- contexto de palavras-chave não duplica termos;
- páginas isoladas recebem fallback honesto;
- a camada continua conectada à casca universal.

Qualquer novo caminho de criação de portfolio deve reutilizar esta camada; não criar SEO
paralelo por template ou por cliente.
