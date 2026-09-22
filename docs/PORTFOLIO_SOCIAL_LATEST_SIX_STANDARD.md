# PORTFOLIO SOCIAL LATEST SIX STANDARD

Status: **normativo, obrigatório e global** para todos os portfolios e landing pages de clientes da 0WEB que possuam rede social pública ativa.

## 1. Regra principal

Se o cliente possui Instagram público ativo, a página deve exibir uma seção social rica com as **6 publicações públicas mais recentes verificáveis** do perfil oficial.

A seção não é decorativa. Ela deve usar conteúdo real do cliente, com:

- permalink real da publicação;
- imagem, carrossel ou vídeo real da publicação;
- data de publicação quando verificável;
- tipo do conteúdo (`POST`, `REEL`, `CAROUSEL`);
- identificação do perfil oficial;
- link clicável para a publicação original;
- provenance registrada;
- coleta/refresh recente.

Para Facebook, TikTok, YouTube e outras redes públicas relevantes, aplicar o mesmo princípio de conteúdo social recente conforme a plataforma permitir.

## 2. O que conta como “últimas 6”

“Últimas 6” significa as seis publicações mais recentes por data entre as publicações públicas verificadas do perfil oficial.

Não conta como uma das seis:

- link do perfil;
- link genérico para a rede;
- screenshot sem permalink;
- post de outro perfil;
- mídia stock;
- mídia gerada;
- item antigo escolhido apenas por conveniência;
- mirror sem resolução para a publicação original, quando o permalink oficial deveria existir.

Se a conta oficial possuir menos de seis publicações públicas, usar todas as disponíveis e registrar `SOCIAL_ACCOUNT_HAS_FEWER_THAN_6_POSTS`.

## 3. Ordem de resolução

Para descobrir e renderizar as seis publicações, usar nesta ordem, conforme disponível:

1. conector/API autorizada da rede;
2. permalink e embed/oEmbed público oficial;
3. site/hub oficial que liste os posts;
4. mecanismo de busca e índice público para descoberta;
5. mirror/indexador público para localizar shortcode/permalink;
6. material fornecido pelo responsável.

Um provider bloqueado não encerra a pesquisa. Deve-se trocar de fonte sem contornar autenticação, login, paywall ou conteúdo privado.

## 4. Regra de imagem e vídeo

Cada item social precisa renderizar a própria mídia da publicação, preferencialmente por:

- embed oficial;
- asset público versionado com provenance;
- poster real do reel/vídeo;
- CDN controlado pela 0WEB quando a ingestão for tecnicamente permitida.

Não usar ícone, gradiente ou imagem genérica no lugar da mídia real quando o post estiver resolvido.

## 5. Factualidade e freshness

A camada social deve guardar no mínimo:

```text
platform
officialProfileUrl
permalink
shortcode/id
mediaType
publishedAt
mediaUrl/embedUrl
captionSummary
collectedAt
provenance
```

Posts devem ser ordenados por `publishedAt DESC`.

A seção deve permitir refresh sem reescrever a landing.

## 6. Gate de publicação

Quando o cliente possui Instagram oficial ativo, uma nova landing ou uma revisão material não pode ser considerada 100% pronta se não houver seis publicações recentes resolvidas, salvo conta com menos de seis posts.

Falhas bloqueantes:

- `SOCIAL_LATEST_6_NOT_RESEARCHED`
- `SOCIAL_LATEST_6_INCOMPLETE`
- `SOCIAL_POST_PERMALINK_MISSING`
- `SOCIAL_POST_REAL_MEDIA_MISSING`
- `SOCIAL_POST_ORIGIN_UNVERIFIED`
- `SOCIAL_FEED_STALE`

Se a página já estiver online, ela pode continuar publicada durante a remediação, mas o estado interno permanece incompleto até o gate ser satisfeito.

## 7. Riqueza mínima da página

A presença social deve enriquecer a experiência, não ficar escondida no rodapé.

A página deve integrar conteúdo social de forma coerente com o negócio, podendo usar:

- grid dos seis posts;
- reels em destaque;
- produtos derivados de posts verificáveis;
- galeria;
- prova de atividade recente;
- chamadas para a publicação original.

A composição visual é específica de cada cliente; o requisito de seis posts é de conteúdo e provenance, não um template visual compartilhado.

## 8. Projetos atuais e futuros

Esta norma é retroativa.

Todo portfolio existente com rede social pública entra na fila de remediação quando for revisado, republicado ou alterado materialmente.

Todo novo projeto deve aplicar esta regra desde a pesquisa inicial.

## 9. Relação com outros padrões

Ler em conjunto com:

- `PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`;
- `PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`;
- `PORTFOLIO_PREMIUM_EXPERIENCE_ACCEPTANCE_STANDARD.md`;
- `PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`;
- `PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`.

A regra é objetiva: **cliente com Instagram ativo → seis publicações recentes reais, com links reais, mídia real e origem verificável.**
