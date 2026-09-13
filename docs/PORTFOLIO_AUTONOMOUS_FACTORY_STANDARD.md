---
id: 0web-portfolio-autonomous-factory
version: 1.0.0
status: NORMATIVE_TARGET
scope:
  - /portfolio/:slug
  - client self-service
  - seller live creation
  - AI research and generation
  - custom-domain promotion
owner: 0WEB
updated: 2026-09-13
---

# 0WEB — PORTFOLIO AUTONOMOUS FACTORY STANDARD

Este documento define o **produto-alvo** da zona `/portfolio` e a arquitetura que qualquer agente, ferramenta, desenvolvedor ou automação deve perseguir.

Ele complementa `PORTFOLIO_PROJECT_LIFECYCLE.md`, `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`, `PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`, `PORTFOLIO_CLIENT_STANDARD.md`, `PORTFOLIO_FUNNELS.md` e `0WEB_AI_PROSPECTING_PLATFORM_STANDARD.md`.

Em conflito sobre **como novos projetos devem ser criados, armazenados, editados, publicados ou promovidos a domínio próprio**, este documento define o alvo arquitetural. Ele não autoriza remover gates de segurança, evidência, acessibilidade, SEO, privacidade, funil ou originalidade.

> Norte em uma frase: **poucas palavras → pesquisa factual → direção criativa própria → site completo e único → preview → edição pelo cliente → publicação → domínio próprio, sem reconstrução manual.**

## 1. O que a 0WEB está construindo

`/portfolio` deixa de ser apenas uma galeria de páginas criadas manualmente e evolui para uma **plataforma multi-tenant de criação, venda, hospedagem e evolução de sites**.

Cada `/portfolio/:slug` é um projeto/cliente independente com:

- identidade e fatos próprios;
- pesquisa e provenance próprias;
- conteúdo e assets próprios;
- composição e motion próprios;
- funil e destinatário próprios;
- SEO e domínio próprios;
- permissões e proprietários próprios;
- histórico de versões próprio;
- analytics próprios.

A 0WEB compartilha infraestrutura. **O cliente nunca compartilha identidade, composição visual, conteúdo, dados ou destino comercial com outro cliente.**

## 2. Experiência desejada: criação a partir de poucas palavras

Entradas válidas incluem:

```text
"criar um site para minha oficina"
"Confeitaria Sabor da Realeza em Curitiba"
"sou eletricista, atendo São José dos Pinhais"
URL de site / Google / rede social
logo ou foto
nome + cidade
```

O sistema deve:

1. entender a intenção;
2. pesquisar o negócio e/ou segmento em fontes públicas permitidas;
3. resolver a entidade correta;
4. aproveitar automaticamente fatos confiáveis já disponíveis;
5. perguntar **somente** o que continua crítico e não resolvido;
6. criar 2–3 direções criativas internamente, materialmente diferentes;
7. escolher ou regenerar a direção mais adequada e original;
8. gerar site completo, responsivo, SEO, assets, funil e preview;
9. permitir edição por linguagem natural e por controles estruturados;
10. guardar cada alteração como revisão recuperável.

Regra de UX: **não perguntar ao usuário o que a plataforma consegue descobrir com confiança. Não inventar o que não consegue descobrir.**

## 3. Pesquisa e enriquecimento factual

A plataforma pode consultar, quando aplicável e permitido: material enviado pelo cliente, site oficial, Google Business/Maps, redes oficiais, cardápios/catálogos, diretórios públicos, páginas públicas, registros e outras fontes abertas relevantes.

A plataforma não promete “raspar literalmente toda a internet”. Ela executa **pesquisa pública proporcional, verificável e orientada a evidência**, respeitando autenticação, paywalls, direitos e termos das fontes.

Cada fato utilizado deve poder carregar:

```yaml
field: phone | address | service | hours | social | image | claim | ...
value: ...
sourceType: OWNER_SUPPLIED | OFFICIAL_WEBSITE | GOOGLE | OFFICIAL_SOCIAL | PUBLIC_DIRECTORY | PUBLIC_WEB
sourceUrl: ...
retrievedAt: ...
confidence: 0..1
status: VERIFIED | PROBABLE | CONFLICT | UNKNOWN
```

`CONFLICT` nunca vira fato publicado automaticamente. `UNKNOWN` nunca vira preço, avaliação, garantia, endereço, telefone, horário, número de clientes ou resultado inventado.

## 4. Contato e WhatsApp: contrato canônico

O objetivo operacional é chegar a **100% dos projetos com destino correto quando existir evidência suficiente**, sem fabricar número para completar a cobertura.

Regras permanentes:

- telefone brasileiro com DDD + **8 dígitos locais** é válido;
- telefone brasileiro com DDD + **9 dígitos locais** é válido;
- pode ser fixo ou celular;
- nunca acrescentar, retirar ou inferir o nono dígito;
- o formato do número não é motivo para rejeição quando entidade e evidência batem;
- número institucional da 0WEB é proibido como destino de cliente;
- número compartilhado entre marcas exige evidência e regra explícita de compartilhamento;
- troca de destino já VERIFIED exige proteção de mudança;
- relatórios públicos/operacionais exibem máscara/fingerprint, não número completo;
- ausência de destino nunca manda lead para 0WEB como fallback: salvar lead e coletar retorno do visitante.

Fonte de verdade alvo do destino por cliente: `portfolio_client_settings`, com confirmação pelo fluxo canônico e trilha em `portfolio_destination_revisions`. Segredos/variáveis antigas são legado de runtime, não o modelo desejado para gestão editorial de destinos.

## 5. Modelo de projeto: entidade, não pasta de arquivos

O projeto é a unidade primária. Arquivos são implementação.

Modelo conceitual mínimo:

```yaml
project:
  id: immutable
  clientKey: immutable
  slug: mutable-with-history
  ownerId: nullable
  status: draft | researching | designing | qa | preview | published | suspended | archived
  identity: {}
  researchEvidence: []
  content: {}
  services: []
  media: []
  visualDNA: {}
  compositionGraph: {}
  motionGrammar: {}
  funnel: {}
  destination: {}
  seo: {}
  domains: []
  permissions: []
  revisions: []
  analyticsScope: {}
```

Projetos novos **não devem exigir dezenas de arquivos artesanais para existir**. Configuração, conteúdo, evidência, composição e ownership devem migrar gradualmente para dados persistentes e versionados. Código compartilhado fornece primitives e renderização; dados do projeto fornecem a experiência específica.

## 6. Parametrizado NÃO significa padronizado visualmente

Regra central:

> **Padronizar dados, segurança e engenharia. Nunca padronizar a aparência final.**

O sistema pode compartilhar botões, media primitives, motion engine, funil, analytics, SEO helpers, upload, autenticação, editor e renderer. O resultado final deve variar materialmente em:

- arquitetura de informação;
- geometria da primeira dobra;
- navegação;
- ordem e quantidade de capítulos;
- topologia de grid;
- densidade e whitespace;
- tipografia;
- paleta e materialidade;
- linguagem de bordas/formas;
- tratamento de mídia;
- relação texto/imagem;
- estratégia de prova;
- distribuição dos CTAs;
- motion grammar;
- microinterações;
- encerramento/footer;
- pelo menos uma assinatura visual/interativa específica do negócio.

Trocar logo, cores, fotos e texto sobre o mesmo DOM/composição é **FAIL**.

## 7. Motor criativo: gerar antes de renderizar

Antes da implementação final, o Creative Director deve produzir direções divergentes, por exemplo:

```yaml
creativeCandidates:
  - concept: ...
    visualMetaphor: ...
    spatialLanguage: ...
    heroConcept: ...
    contentRhythm: ...
    mediaNarrative: ...
    typographyStrategy: ...
    motionNarrative: ...
    signatureInteraction: ...
  - ...
  - ...
```

Essas direções **não são templates nomeados**. São hipóteses criativas derivadas da empresa, público, oferta, localidade, mídia, personalidade e objetivo comercial.

O sistema deve comparar o candidato com o portfólio existente antes de gerar a versão final.

### Anti-template gate

Um projeto novo reprova se repetir materialmente de outro projeto a combinação de:

`heroGeometry + firstThreeChapters + gridTopology + typographyStrategy + mediaNarrative + motionGrammar + ctaDistribution`.

O `NO-BRAND TEST` de `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md` continua obrigatório: sem logo, cor, texto e fotos, dois sites ainda devem parecer projetos diferentes.

## 8. Blueprint/composition graph gerável

O Blueprint é contrato de fatos, capacidades e conteúdo; o `compositionGraph` descreve a composição criada para aquele projeto.

Exemplo conceitual:

```yaml
compositionGraph:
  root: experience
  nodes:
    - id: opening
      primitive: immersive-stage
      children: [brandMark, offer, mediaWindow, primaryAction]
      behavior: layered-reveal
    - id: services
      primitive: editorial-path
      layout: asymmetric
    - id: proof
      primitive: evidence-strip
      source: verified-only
```

A biblioteca de primitives funciona como vocabulário, **não como conjunto fechado de templates**. Quando nenhuma composição existente expressa a direção, o sistema pode criar uma nova composição/primitive segura e incorporá-la à biblioteca depois de revisão.

## 9. Qualidade: build verde não significa site bom

Há dois eixos independentes:

```text
TECHNICAL_PASS
+ EDITORIAL_CREATIVE_PASS
= READY
```

`TECHNICAL_PASS`: types, build, SSR, privacidade, segurança, a11y, performance, SEO técnico, funil, responsive.

`EDITORIAL_CREATIVE_PASS`: entidade correta, conteúdo útil, mídia resolvida, hierarquia forte, direção visual coerente, originalidade real, motion observado, conversão clara, acabamento premium, ausência de dead zones e evidência suficiente.

Uma landing “quadrada”, genérica, vazia, apenas textual ou parecida com outra **não está pronta**, mesmo com todos os testes de código verdes.

## 10. Usuários, ownership e isolamento

Papéis-alvo:

```yaml
roles:
  super_admin:
    scope: all
    canAssignOwnership: true
    canPublish: true
    canPromoteDomain: true
  seller:
    canCreateDraft: true
    canRunIntakeWithClient: true
    canSharePreview: true
    canEditAssignedProjects: true
  client_owner:
    canRead: own_projects
    canEdit: own_projects
    canUploadMedia: own_projects
    canRequestPublish: true
    canManageBusinessContent: true
  client_editor:
    canRead: assigned_projects
    canEdit: assigned_scopes
  visitor:
    canRead: published_public_content
```

Regras:

- cadastro de usuário não concede automaticamente acesso a projeto de cliente;
- `super_admin` aprova/atribui ownership;
- autorização é verificada no servidor e no banco/RLS, nunca apenas escondendo botão na UI;
- `client_owner` nunca lê ou modifica projeto, leads, assets, destino ou analytics de outro `clientKey`;
- toda alteração sensível registra ator, projeto, antes/depois e timestamp;
- publicação, troca de domínio, troca de owner e mudanças críticas podem exigir aprovação elevada.

## 11. Editor do cliente

O cliente autorizado precisa conseguir, sem código:

- editar textos e títulos;
- adicionar/remover/reordenar serviços quando permitido;
- trocar/upload de fotos e logo;
- atualizar horário, região e informações confirmáveis;
- alterar preços que sejam declaradamente do próprio negócio;
- pedir mudanças em cor, tipografia, densidade e direção por linguagem natural;
- editar SEO básico com ajuda da IA;
- testar o funil;
- ver preview antes de publicar;
- restaurar versões anteriores.

Mudança livre não pode destruir acessibilidade, privacidade, estrutura SEO, segurança ou identidade sem aviso. O editor aplica constraints de qualidade em vez de expor CSS bruto ao cliente.

## 12. Seller live mode

Um vendedor da 0WEB deve poder criar a presença na frente do cliente:

```text
Nova presença
→ nome/descrição curta
→ pesquisa automática
→ perguntas críticas restantes
→ gerar direção e primeira versão
→ preview compartilhável
→ ajustar por conversa
→ cliente aprova
→ proposta/pagamento
→ ownership + publicação
```

O vendedor não precisa conhecer Git, Vercel, React, SEO técnico ou banco.

## 13. Promoção para domínio próprio

Pagamento/domínio **não cria um segundo site**.

O mesmo `project.id` deve poder servir:

```text
preview:      /portfolio/minha-oficina
publicação:   /portfolio/minha-oficina
promovido:    https://minhaoficina.com.br
```

Na promoção:

- associar domínio ao projeto;
- provisionar/verificar DNS/SSL;
- atualizar canonical/OG/sitemap/host awareness;
- preservar conteúdo, assets, analytics, revisions, owner, funil e dados;
- definir política do endereço antigo (`redirect`, `canonical-to-domain`, `showcase`, `noindex`) sem reconstruir manualmente a página.

## 14. Benchmarks externos: aprender capacidade, não copiar design

Referências de produto incluem Landingsite.ai, UX Pilot, LeadSite e outras ferramentas de geração assistida por IA.

Capacidades observadas que servem de benchmark:

- iniciar com uma frase ou poucas perguntas;
- gerar página/site completo rapidamente;
- escrever conteúdo e selecionar mídia;
- oferecer múltiplas alternativas de layout/direção;
- editar conversando em linguagem natural;
- versionar e permitir rollback;
- publicar preview compartilhável;
- operar agência/equipe e múltiplos clientes;
- conectar domínio próprio;
- transformar pesquisa pública em contexto para geração quando permitido.

Referências são **capability benchmarks**. Proibido copiar marca, template, texto, layout proprietário ou assets.

## 15. Lifecycle alvo

```text
INTAKE
→ ENTITY_DISCOVERY
→ ENTITY_RESOLUTION
→ EVIDENCE
→ MEDIA_DISCOVERY
→ CONTENT_MODEL
→ CREATIVE_DIRECTIONS
→ UNIQUENESS_PREFLIGHT
→ COMPOSITION_GRAPH
→ FUNNEL/DESTINATION
→ SEO
→ RENDER
→ TECHNICAL_QA
→ EDITORIAL_CREATIVE_QA
→ PREVIEW
→ APPROVAL
→ PUBLISH
→ DOMAIN_PROMOTION
→ CONTINUOUS_EDITING
```

A intervenção humana é prioritária em: conflito de entidade, contato conflitante, direitos de mídia, fatos comerciais críticos, aprovação de owner, publicação e exceções de segurança. O resto deve ser automatizado progressivamente.

## 16. Auditoria global obrigatória

A evolução para fábrica autônoma não ignora o legado. O catálogo deve ter auditoria por projeto com, no mínimo:

```yaml
audit:
  catalogIntegrity: PASS|FAIL
  identityResolution: PASS|WARN|FAIL
  destination: VERIFIED|UNRESOLVED|CONFLICT
  funnel: PASS|FAIL
  ownership: ASSIGNED|UNASSIGNED|INVALID
  authIsolation: PASS|FAIL|NOT_TESTED
  visualOriginality: PASS|WARN|FAIL
  visualQuality: PASS|WARN|FAIL
  mobile: PASS|FAIL
  accessibility: PASS|WARN|FAIL
  seo: PASS|WARN|FAIL
  media: PASS|WARN|FAIL
  domain: PORTFOLIO|CUSTOM|NONE
```

Não mascarar `NOT_TESTED` como `PASS`.

## 17. Prioridades de implementação

```text
P0  destinos/funis corretos + nenhum lead perdido
P0  isolamento de usuário/clientKey e segurança
P1  auditoria canônica dos projetos atuais
P1  modelo persistente de project/ownership/revisions
P1  editor seguro do cliente
P2  intake conversacional + pesquisa/enrichment automático
P2  creative director + composition graph + similarity gate
P2  preview/versioning
P2  seller live mode
P3  domínio próprio/pagamento/provisionamento
P3  analytics e otimização contínua por cliente
```

P0 funcional e segurança vencem polimento. Depois dos P0, **qualidade/originalidade é requisito de produto, não cosmética opcional**.

## 18. Definition of Done da plataforma

A visão está cumprida quando:

- uma pessoa inicia com poucas palavras;
- a plataforma pesquisa e pergunta apenas gaps críticos;
- fatos publicados possuem provenance e conflito é bloqueado;
- o site gerado é claramente específico daquele negócio;
- projetos diferentes não parecem skins do mesmo template;
- preview fica disponível sem operação manual de deploy;
- super admin controla ownership e publicação;
- cliente autorizado edita apenas o próprio projeto;
- cada edição é reversível;
- funil chega ao destino correto do cliente;
- nenhum contato institucional é usado como fallback de cliente;
- o mesmo projeto pode ganhar domínio próprio sem reautoria;
- o sistema continua responsivo, indexável, acessível, seguro e observável.

## 19. Estado atual versus alvo

Este documento é **contrato de direção e arquitetura**, não declaração de que todas as capacidades acima já estejam implementadas.

Agentes devem informar explicitamente `IMPLEMENTED`, `PARTIAL`, `PLANNED` ou `BLOCKED` ao auditar cada capacidade. É proibido apresentar uma meta deste documento como funcionalidade já ativa sem teste/evidência.
