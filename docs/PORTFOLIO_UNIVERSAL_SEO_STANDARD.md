# 0WEB — Universal Portfolio SEO Standard

Status: **normativo**  
Escopo: todos os `/portfolio/:slug` atuais e futuros.

## Princípio

SEO é infraestrutura universal do portfólio. Cada projeto mantém conteúdo, identidade,
entidade e composição próprios, mas não pode depender de trabalho manual para receber a
camada técnica mínima de descoberta, indexação e interligação.

O objetivo é ampliar autoridade e cobertura sem produzir doorway pages, texto oculto,
keyword stuffing, avaliações inventadas ou informação local não comprovada.

## Contrato obrigatório

Todo projeto publicado deve possuir:

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
A pontuação privilegia:

1. mesmo segmento;
2. mesma cidade;
3. mesmo estado;
4. tags/serviços em comum;
5. mesmo tipo de projeto.

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
