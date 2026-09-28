# 0WEB — Portfolio as Individual Site + Aggressive SEO Standard

Status: **normativo, global e obrigatório**  
Escopo: **todos os `/portfolio/:slug` atuais e futuros, seus derivados, hubs locais/temáticos, preview, social/OG, publicação e promoção para domínio próprio.**

## 1. Regra principal

Cada `/portfolio/:slug` é tratado como **um site individual completo do negócio**, hospedado dentro da infraestrutura 0WEB.

O fato de compartilhar o domínio `0web.com.br` não reduz sua autonomia editorial ou de SEO.

Cada projeto deve possuir identidade própria, narrativa própria, mídia própria, entidade própria, contexto local próprio, intenção de busca própria, dados estruturados próprios, navegação contextual própria e caminhos de conversão próprios.

> **Infraestrutura compartilhada; site, entidade e experiência individuais.**

O resultado esperado é que uma página de portfólio tenha riqueza suficiente para funcionar como a presença digital real daquele negócio e, ao mesmo tempo, demonstrar ao proprietário o potencial de uma versão contratada/evoluída.

---

## 2. Objetivo comercial da amostra

A amostra não deve parecer limitada ou provisória.

Ela deve gerar a percepção:

> **“Se a amostra já funciona e aparece assim, a versão adquirida pode evoluir ainda mais.”**

Para isso, cada projeto deve demonstrar, quando aplicável:

- identidade visual coerente;
- hero autoral;
- navegação suficiente;
- conteúdo profundo;
- serviços/produtos/cardápio/catálogo;
- localização real;
- contexto de bairro/cidade;
- mídia real;
- redes sociais oficiais;
- últimas 6 publicações oficiais do Instagram quando existirem;
- galeria;
- perguntas frequentes;
- mapa/localização quando pertinente;
- prova real quando disponível;
- CTA e funil próprios;
- mobile completo;
- motion/microinterações;
- SEO técnico;
- SEO de imagem;
- Open Graph/social;
- malha interna;
- descoberta local;
- performance e acessibilidade.

A amostra pode ser mais rica com o tempo. Ela não deve ser empobrecida para “guardar recursos” para uma venda futura.

---

## 3. Indexação por padrão

Todo portfolio que estiver realmente:

- publicado;
- acessível ao público;
- com entidade identificada;
- com conteúdo próprio;
- com canonical própria;

deve nascer tecnicamente preparado para:

`index,follow,max-image-preview:large,max-snippet:-1`

`noindex` em portfolio público é exceção, não padrão.

Exceções devem ser rastreáveis, por exemplo:

- rascunho;
- preview interno;
- publicação desativada;
- rota técnica;
- entidade ainda não resolvida;
- conflito grave que torne a página imprópria para descoberta pública;
- instrução explícita do responsável.

Quando a página é comercialmente válida mas ainda está fraca para busca, a ação preferencial é:

**enriquecer → conectar → melhorar descoberta → reenviar/monitorar**,  
não reduzir o conteúdo existente.

---

## 4. SEO individual obrigatório

Cada portfolio publicado deve possuir, no mínimo:

### 4.1 Head próprio

- `<title>` exclusivo;
- meta description exclusiva;
- canonical própria;
- robots coerente;
- Open Graph;
- Twitter Card;
- imagem social própria;
- texto alternativo coerente;
- idioma `pt-BR`;
- favicon/brand assets quando a arquitetura suportar.

Nenhum portfolio deve depender exclusivamente do title/description global da 0WEB.

### 4.2 Entidade própria

A página deve modelar o negócio real como entidade principal, usando apenas tipos Schema.org compatíveis com a evidência disponível.

Possíveis nós, conforme o caso:

- `WebPage`;
- `Organization`;
- `LocalBusiness`;
- `Store`;
- `Restaurant`;
- `ProfessionalService`;
- `Person`;
- `Service`;
- `Product`;
- `Offer`;
- `Menu`;
- `Place`;
- `PostalAddress`;
- `ImageObject`;
- `VideoObject`;
- `FAQPage`;
- `BreadcrumbList`;
- `ItemList`;
- `ProfilePage`.

Nunca usar tipo mais específico que a informação sustentada pela própria página/provenance.

A 0WEB é a plataforma/publicadora, não deve substituir a entidade principal do cliente.

### 4.3 Local SEO próprio

Quando bairro/cidade/estado são conhecidos:

- inserir contexto local no conteúdo;
- usar bairro/cidade em títulos/subtítulos somente quando natural;
- ligar o projeto ao hub do bairro;
- ligar o projeto ao hub da cidade;
- relacionar primeiro negócios do mesmo bairro/cidade quando houver densidade;
- incluir endereço/mapa apenas quando houver dado real;
- não fabricar “perto de você” nem coordenada.

Exemplo:

`Beto Pastéis → Jardim Itália → São José dos Pinhais → alimentação/gastronomia → outros negócios próximos do catálogo`.

### 4.4 Conteúdo próprio

Cada site individual deve possuir texto suficientemente específico para que remover marca, imagens e localidade torne óbvio que não se trata de outra empresa.

Conteúdo recomendado quando aplicável:

- história/contexto;
- produtos/serviços;
- cardápio;
- processo;
- diferenciais;
- aplicações;
- áreas de atendimento;
- dúvidas reais;
- como pedir/orçar/agendar;
- localização;
- horários;
- mídia social;
- fotos reais;
- materiais enviados pelo proprietário;
- perguntas e respostas;
- conteúdo educativo relacionado ao negócio;
- novidades;
- catálogo;
- portfólio do próprio cliente.

O conteúdo cresce de forma aditiva.

---

## 5. SEO agressivo = cobertura máxima legítima

Neste projeto, “SEO agressivo” significa **usar o máximo de sinais legítimos e úteis**, não manipular mecanismos de busca.

Inclui:

- conteúdo original e profundo;
- título/meta específicos;
- headings semânticos;
- entidade resolvida;
- schema rico;
- imagem real com `alt`;
- nomes de arquivo e dimensões adequados;
- links internos;
- hubs locais;
- hubs de categoria;
- breadcrumbs;
- sitemap;
- canonical;
- SSR/indexabilidade;
- FAQ quando útil;
- mídia social oficial;
- vídeo quando existir;
- atualização/freshness;
- Search Console;
- IndexNow após produção confirmada;
- GSC URL Inspection;
- descoberta por bairro/cidade/categoria;
- backlinks internos entre entidades relacionadas;
- promoção futura para domínio próprio sem reconstrução.

Não inclui:

- keyword stuffing;
- texto oculto;
- doorway pages;
- avaliações falsas apresentadas como reais;
- fake Google reviews;
- endereço fictício;
- localização inexistente;
- garantia de posição;
- garantia de leads/vendas;
- schema que afirme fatos ausentes da página.

---

## 6. Mídia como parte do SEO

Mídia não é decoração opcional.

Quando existir fonte oficial pública ou material do proprietário, o portfolio deve aproveitar:

- logo;
- fachada;
- ambiente;
- produtos;
- equipe;
- trabalhos realizados;
- cardápio;
- catálogo;
- posts;
- reels;
- vídeos;
- materiais promocionais.

Para negócio com Instagram oficial público, aplicar o padrão das **últimas 6 publicações oficiais**, preservando permalink/provenance conforme a política vigente.

As imagens devem participar do SEO individual:

- `alt` contextual;
- width/height;
- responsividade;
- `ImageObject` quando apropriado;
- OG própria;
- uso em galerias e blocos relevantes;
- nenhum placeholder genérico quando existe mídia oficial melhor.

---

## 7. Navegação do site individual

Mesmo dentro do domínio 0WEB, o portfolio deve poder se comportar como mini-site.

Quando a riqueza do negócio justificar:

- âncoras/seções;
- navegação interna;
- menu/cardápio;
- categorias;
- filtros;
- galeria;
- links sociais;
- conteúdo editorial;
- CTA persistente;
- FAQ;
- mapa;
- páginas/estados derivados no futuro.

A navegação global 0WEB não pode apagar a identidade de navegação do cliente.

---

## 8. Grafo de descoberta

Cada portfolio publicado participa de um grafo.

### 8.1 Links de saída

Prioridade:

1. mesmo bairro;
2. mesma cidade;
3. região próxima quando modelada;
4. mesma categoria;
5. serviços/produtos relacionados;
6. mesmo estado;
7. descoberta complementar.

### 8.2 Links de entrada

O portfolio deve receber links de:

- `/portfolio`;
- hub do bairro;
- hub da cidade;
- categoria/segmento quando disponível;
- páginas de projetos relacionados;
- sitemap do portfolio;
- outros hubs editoriais legítimos.

Projeto publicado sem links internos suficientes é regressão de descoberta.

---

## 9. Sitemap e mecanismos de busca

Portfolio publicado deve estar no sitemap canônico do portfolio.

Após produção confirmada:

- Google: sitemap + Search Console + inspeção/monitoramento;
- Bing e mecanismos participantes: IndexNow para URLs realmente novas/alteradas;
- demais mecanismos: descoberta via sitemap, links e protocolos suportados.

Submissão não é garantia de indexação.

O objetivo técnico é remover barreiras e aumentar qualidade/descoberta até que cada página elegível tenha sinais suficientes para ser rastreada e considerada.

---

## 10. Promoção para domínio próprio

O portfolio deve ser criado como projeto suficientemente autônomo para que uma aquisição futura permita:

- promover o mesmo projeto para domínio próprio;
- atualizar host/canonical;
- preservar conteúdo;
- preservar SEO;
- preservar identidade;
- preservar funil;
- preservar mídia;
- preservar histórico;
- adicionar recursos contratados.

Não reconstruir do zero.

A amostra e o site adquirido são fases do mesmo projeto.

---

## 11. Novo projeto: contrato de nascimento

Todo novo portfolio deve nascer com checklist automático:

### Identidade
- marca;
- logo ou tratamento de marca;
- paleta/tokens;
- direção tipográfica;
- composição autoral.

### Entidade
- nome;
- categoria;
- bairro/cidade/estado;
- endereço quando real;
- redes;
- contato interno/funil;
- provenance.

### Conteúdo
- hero;
- descrição;
- serviços/produtos;
- conteúdo aprofundado;
- FAQ;
- mídia;
- contexto local;
- CTA/funil.

### SEO
- title;
- description;
- canonical;
- robots;
- OG;
- schema;
- breadcrumb;
- sitemap;
- internal links;
- hubs locais;
- imagem social;
- keywords/contexto editorial;
- GSC/IndexNow pós-publicação.

### Qualidade
- 390/768/1440;
- keyboard;
- reduced motion;
- performance;
- acessibilidade;
- originalidade;
- zero-generic;
- funil;
- SEO;
- mídia.

O projeto não deve depender de uma rodada manual futura para receber o básico deste contrato.

---

## 12. Gates universais

Adicionar ao conceito de qualidade dos portfolios:

- `PORTFOLIO_INDIVIDUAL_SITE_GATE`;
- `PORTFOLIO_ENTITY_GATE`;
- `PORTFOLIO_LOCAL_SEO_GATE`;
- `PORTFOLIO_MEDIA_RICHNESS_GATE`;
- `PORTFOLIO_DISCOVERY_GRAPH_GATE`;
- `PORTFOLIO_INDEXABILITY_GATE`.

Falhas típicas:

- title/meta genéricos;
- ausência de canonical;
- conteúdo raso/genérico;
- página publicada fora do sitemap;
- projeto sem backlinks internos;
- schema da 0WEB substituindo entidade do cliente;
- bairro/cidade conhecidos mas não aproveitados;
- mídia oficial existente mas ignorada;
- projetos visualmente clonados;
- `noindex` sem motivo rastreável;
- portfolio publicado sem participação no diretório local.

---

## 13. Relação com a Constituição Aditiva

Este padrão especializa:

`0WEB_UNIVERSAL_ADDITIVE_GROWTH_CONSTITUTION.md`

A Constituição diz **como evoluir**.  
Este documento diz **como cada portfolio deve funcionar como site individual e entidade SEO autônoma**.

A regra combinada é:

> **Cada projeto é individual. Cada evolução soma. Cada publicação entra no grafo. Cada negócio merece riqueza própria.**
