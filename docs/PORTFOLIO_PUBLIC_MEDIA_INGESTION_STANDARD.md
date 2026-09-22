# PORTFOLIO PUBLIC MEDIA INGESTION STANDARD

Status: **normativo, obrigatório e global** para todos os projetos atuais e futuros de `/portfolio/:slug`, especialmente lojas, catálogos, restaurantes, beleza, serviços visuais, construção, automotivo e qualquer projeto em que mídia real altere percepção, prova ou conversão.

## 1. Regra oficial

A 0WEB deve executar **pesquisa pública exaustiva de mídia** antes de substituir fotos reais por ícones, placeholders, arte genérica ou geração de imagem.

A pesquisa não termina porque Instagram, Facebook, Google ou outro provider bloqueou uma leitura direta. Um bloqueio de provider muda o caminho de pesquisa; **não encerra a pesquisa**.

O objetivo é localizar e usar, quando pertinente:

- fotos e vídeos publicados pelo próprio negócio;
- posts e reels públicos;
- fotos de produtos, trabalhos, ambientes, fachada e materiais promocionais;
- imagens de catálogo do próprio seller/marketplace;
- mídia pública ligada inequivocamente à entidade correta;
- logo e identidade oficiais.

Para comércio/loja/catálogo, produto real com mídia pública disponível deve ser mostrado com **mídia real**, não apenas com ícone ilustrativo.

## 2. Escada obrigatória de pesquisa

Pesquisar até obter mídia adequada ou esgotar tecnicamente as fontes aplicáveis:

1. site oficial;
2. Instagram oficial: perfil, posts, reels, destaques e embeds públicos;
3. Facebook oficial: página, posts, fotos e vídeos públicos;
4. Google/Business/Maps quando houver provider permitido;
5. Linktree e hubs oficiais;
6. marketplaces e lojas de seller vinculados à empresa;
7. TikTok, YouTube e demais redes oficiais;
8. mecanismos de busca e busca de imagens para resolver a origem;
9. diretórios, mirrors/indexadores públicos e páginas comerciais que preservem vínculo verificável com a entidade;
10. materiais fornecidos pelo proprietário;
11. somente depois: mídia licenciada, editorial contextual ou gerada.

`PROVIDER_BLOCKED`, `CACHE_MISS`, `LOGIN_REQUIRED` ou `ANTI_BOT` em uma fonte **não equivalem** a `NO_MEDIA`.

## 3. Persistência sem contornar controles

“Pesquisa exaustiva” significa amplitude, persistência e troca de fonte. Não significa violar controle de acesso.

É permitido:

- pesquisar páginas e índices públicos;
- usar embeds/oEmbed públicos suportados pela plataforma;
- resolver URLs públicas de mídia;
- consultar páginas públicas de seller/marketplace;
- usar mirrors/indexadores públicos para descobrir origem;
- baixar/versionar asset publicamente acessível quando tecnicamente possível e adequado ao projeto;
- preservar a URL de origem e atribuição;
- criar derivados técnicos de crop/tamanho/formato mantendo provenance.

Não é permitido:

- quebrar login, paywall ou conteúdo privado;
- burlar autenticação, token ou proteção de acesso;
- mascarar mídia de terceiro como mídia própria do cliente;
- remover autoria/atribuição exigida;
- depender de hotlink frágil quando um asset pode ser versionado de forma estável.

## 4. Ingestão e provenance

Sempre que possível, mídia usada em produção deve ser versionada em armazenamento controlado pelo projeto/CDN, preservando:

- `sourceUrl`;
- `sourceType`;
- entidade/seller/perfil de origem;
- data da coleta;
- assunto/produto representado;
- papel na página;
- observação de direitos/atribuição quando aplicável.

Estados recomendados:

`OFFICIAL_SOCIAL_MEDIA` · `REAL_BUSINESS_MEDIA` · `MARKETPLACE_SELLER_MEDIA` ·
`PUBLIC_BUSINESS_MEDIA` · `EXTERNAL_PRODUCT_REFERENCE` · `OWNER_SUPPLIED` ·
`GENERATED_CONTEXTUAL_MEDIA`.

Se download/versionamento não for possível mas a plataforma oferecer embed público legítimo, o embed pode ser usado como mídia viva com link/atribuição à origem.

## 5. Regra específica para lojas e catálogos

Uma página declarada como loja virtual, catálogo ou social-commerce deve se comportar como tal.

Obrigatório quando aplicável:

- cards com fotos reais de produto;
- busca;
- categorias/filtros;
- detalhe do item;
- seleção/carrinho ou lista de interesse;
- contexto da seleção preservado até o funil/pedido;
- estado de disponibilidade/preço tratado conforme freshness;
- feed social real quando as redes forem fonte comercial relevante;
- mobile funcional;
- loading/erro/fallback de mídia;
- origem/provenance da mídia.

**Ícone Lucide, SVG genérico ou bloco abstrato não pode substituir fotografia real de produto quando essa mídia estiver publicamente disponível.**

Falha bloqueante: `COMMERCE_PRODUCT_MEDIA_MISSING`.

Fallback gráfico é permitido somente para item/categoria cuja mídia real ainda não foi resolvida após a escada obrigatória de pesquisa; esse estado deve permanecer explícito e entrar na fila de remediação.

## 6. Redes sociais como fonte viva

Quando Instagram/Facebook são canais comerciais ativos do negócio:

- pesquisar posts/reels individualmente;
- usar mídia real resolvida;
- incorporar posts públicos oficiais quando download estável não for possível;
- converter conteúdo social em catálogo somente quando produto/serviço puder ser identificado sem invenção;
- não abandonar a mídia porque a primeira requisição direta falhou.

Um projeto com dezenas de produtos publicados nas redes não pode ser encerrado visualmente como “sem mídia” apenas porque um provider bloqueou scraping direto.

## 7. Projetos atuais

Esta norma vale retroativamente.

Qualquer projeto existente entra em remediação imediata quando:

- estiver sendo alterado materialmente;
- for uma loja/catálogo com cards sem fotos apesar de mídia pública disponível;
- usar placeholder/ícone onde a mídia real do negócio já foi encontrada;
- houver nova fonte social/marketplace capaz de enriquecer a experiência.

## 8. Critério de pronto

Antes de marcar mídia como concluída, registrar:

```text
site oficial               searched/found/usable
Instagram                  searched/found/usable
Facebook                   searched/found/usable
Google/Business            searched/found/usable
marketplace/seller         searched/found/usable
search/index/mirrors       searched/found/usable
assets versionados         yes/no + provenance
embeds oficiais            yes/no
fallback gerado/gráfico    motivo, se usado
```

`NO_MEDIA` só é aceitável após a escada aplicável ser executada e registrada.

## 9. Relação com outros padrões

Esta norma é aditiva e deve ser lida junto com:

- `PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`;
- `PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`;
- `PORTFOLIO_PREMIUM_EXPERIENCE_ACCEPTANCE_STANDARD.md`;
- `PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`;
- `PORTFOLIO_AUTONOMOUS_CREATION.md`;
- `BRAND_ASSET_POLICY.md`.

Factualidade, privacidade, acessibilidade, performance e isolamento de cliente continuam obrigatórios. A diferença é simples: **bloqueio de uma fonte nunca mais será tratado como autorização para desistir da pesquisa de mídia real.**
