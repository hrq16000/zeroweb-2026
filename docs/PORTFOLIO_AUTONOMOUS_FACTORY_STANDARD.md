---
id: 0web-portfolio-autonomous-factory
version: 1.1.0
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

O mesmo `projectId/client_key` deve sobreviver a todas as fases. Promover um projeto para domínio próprio troca host/canonical e publicação; não recria o site.

## 2. Princípio central

**Padronizar infraestrutura, dados, segurança, lifecycle, SEO técnico, telemetria e qualidade. Nunca padronizar a aparência final.**

Parametrização não significa uniformidade visual. Dois clientes podem compartilhar o mesmo motor e os mesmos componentes primitivos sem compartilhar hero, ordem de seções, grid, ritmo, linguagem tipográfica, narrativa de mídia, motion, microinterações ou fechamento.

É falha de produto quando uma página parece “o mesmo template com outras cores”.

## 3. Benchmark de capacidade — nunca de cópia

Landingsite.ai, UXPilot, LeadSite, Faroleads e ferramentas equivalentes servem como referência de **velocidade, autonomia e experiência do criador**. Nunca são fonte para copiar layout, texto, marca, identidade ou ativos.

A capacidade-alvo da 0WEB é:

1. iniciar por linguagem natural e poucas palavras;
2. pesquisar automaticamente empresa, segmento, cidade e contexto verificável;
3. detectar o que é fato, inferência, conflito ou ausência de evidência;
4. perguntar apenas gaps materiais;
5. gerar no mínimo três direções visuais realmente divergentes antes da seleção;
6. rejeitar composição parecida demais com projeto já existente;
7. criar copy, mídia, SEO, motion e funil contextualizados;
8. oferecer preview imediato desktop/mobile;
9. permitir edição por formulário, controles visuais e conversa;
10. versionar e permitir rollback;
11. publicar em `/portfolio/:slug` e depois ligar domínio próprio ao mesmo projeto.

## 4. Pipeline obrigatório

`intent_parse → entity_discovery → entity_resolution → evidence_collection → gap_detection → adaptive_questions → creative_direction_generation → originality_rejection → composition_graph → content → media → funnel → SEO → responsive implementation → quality audit → preview → approval → publish → continuous editing → custom domain`

Nenhuma etapa pode inventar dados apenas para completar a página.

## 5. Pesquisa e resolução de entidade

Antes de usar qualquer contato, endereço, nome legal, preço, depoimento, avaliação, estatística ou outra alegação externa, o sistema deve resolver a entidade.

Prioridade de fontes:

1. material fornecido pelo cliente;
2. registro interno previamente verificado;
3. site oficial;
4. perfil oficial Google/Google Business;
5. rede social oficial;
6. histórico interno/Git;
7. registro público confiável;
8. diretório de terceiros somente como evidência auxiliar.

Cada evidência deve registrar origem, entidade, localidade, momento da coleta e confiança. Resultado possível: `VERIFIED`, `STRONG`, `WEAK`, `CONFLICT`, `UNKNOWN`.

### Nunca fazer

- inventar telefone, e-mail, endereço, preço, depoimento ou número de clientes;
- acrescentar ou remover o nono dígito de telefone;
- rejeitar telefone apenas por ser fixo;
- atribuir telefone de marca semelhante;
- usar o WhatsApp institucional da 0WEB como destino de um cliente;
- transformar imagem conceitual em “foto real da empresa”;
- transformar resultado de busca em fato sem resolver identidade.

## 6. WhatsApp e destino do funil

DDD + 8 ou DDD + 9 dígitos locais são válidos. Fixo e celular são válidos. O critério é pertencer à entidade certa.

Fonte canônica: `portfolio_client_settings.funnel_recipient`.

Confirmação canônica: `confirmDestination`.

Histórico: `portfolio_destination_revisions`.

Destino institucional 0WEB é proibido como destino de cliente. Se não houver destino comprovado, o lead é salvo primeiro e o visitante deixa contato para retorno; não existe fallback silencioso para a 0WEB.

## 7. Creative Director — criatividade antes de validação

Presets podem existir temporariamente como compatibilidade técnica, mas **não podem ser a decisão criativa final**.

Para cada projeto novo ou redesign relevante, o Creative Director deve produzir pelo menos três propostas divergentes. Cada proposta define:

- personalidade do negócio;
- conceito criativo;
- metáfora visual;
- geometria do hero;
- grafo e ordem de seções;
- topologia de grid;
- linguagem tipográfica;
- estratégia cromática;
- narrativa de mídia;
- narrativa de prova;
- narrativa de conversão;
- narrativa de motion;
- momentos de assinatura;
- estrutura do fechamento.

As propostas não podem ser variações cosméticas da mesma árvore.

### Padrões proibidos

- “segmento X sempre usa template Y”;
- hero padrão com imagem à direita e copy à esquerda em todos os projetos;
- ordem automática `hero → serviços → sobre → depoimentos → FAQ → contato`;
- mesmos cards, mesmas bordas e mesmos grids apenas recoloridos;
- mesma família de componentes para segmentos diferentes sem justificativa narrativa;
- motion decorativo repetido;
- usar o campo `preset` como resposta final para direção criativa.

## 8. Originalidade é um gate de rejeição

Antes de publicar uma composição nova, comparar com todos os projetos existentes nas dimensões:

- `hero_geometry`;
- `section_order`;
- `grid_topology`;
- `component_family`;
- `visual_rhythm`;
- `media_distribution`;
- `motion_signature`;
- `cta_distribution`;
- `closing_structure`.

Se a combinação exceder o limite de similaridade, **não se corrige apenas cor ou copy**. A composição é rejeitada e regenerada.

A baseline histórica serve para impedir regressão, não para declarar satisfatório o passivo visual existente. Pares `HIGH_SIMILARITY` entram em fila de redesign até deixarem de compartilhar a mesma linguagem estrutural.

## 9. Projeto como entidade persistente

Cada projeto deve possuir, conceitualmente:

- identidade;
- conteúdo;
- ativos;
- `composition_graph`;
- SEO;
- funil;
- destino;
- analytics;
- membros/permissões;
- domínio;
- lifecycle;
- versões e histórico.

Lifecycle alvo: `draft → researching → composing → ready → published → archived`.

Rascunho não entra na busca pública e não deve ser indexado.

## 10. Autorização e multi-tenant

Papéis-alvo:

- `super_admin`: acesso global e autoridade para conceder/revogar acesso;
- `admin`: operação global conforme política;
- `seller`: inicia projeto para cliente sem virar administrador global;
- `project_owner`: proprietário de um ou mais projetos atribuídos;
- `project_editor`: edita projeto atribuído;
- `project_viewer`: somente leitura/preview.

Autorização deve ser validada no servidor e protegida por RLS. Esconder botão não é controle de acesso.

Um cliente comum nunca pode enumerar ou alterar projeto que não esteja explicitamente associado ao seu usuário.

O super admin deve poder pré-autorizar um `client_key` para que o próprio cliente crie o projeto reservado. Owner/editor pode editar até `READY`; publicação e arquivamento permanecem administrados até cobrança, contrato e domínio estarem automatizados.

## 11. Experiência do editor

O cliente/vendedor deve poder trabalhar de três formas complementares:

1. **guided form** — edição objetiva de fatos, serviços, horários, imagens e identidade;
2. **visual controls** — foco, imagem, ordem, opções contextuais e preview mobile/desktop;
3. **chat edit** — pedidos como “deixe mais sofisticado”, “troque a foto do hero”, “adicione serviço X”, sempre como alteração estruturada e versionada.

Toda alteração relevante gera versão e pode ser desfeita.

## 12. Media intelligence

Mídia deve ter função narrativa. O sistema escolhe entre:

- material real do cliente;
- mídia oficial encontrada e comprovadamente utilizável;
- ilustração/arte conceitual própria;
- gráfico, ícone, textura, mockup ou composição gerada.

Nunca usar imagem genérica apenas para preencher espaço. Imagem conceitual deve ser identificada como conceitual quando houver risco de ser interpretada como fotografia documental.

## 13. Qualidade antes de publicar

Gate mínimo:

- identidade resolvida;
- evidência suficiente para alegações publicadas;
- nenhuma alegação fabricada;
- funil funcional;
- destino verificado **ou** callback seguro;
- SEO completo e canonical válido;
- QA mobile;
- acessibilidade baseline;
- privacidade;
- performance baseline;
- originalidade;
- qualidade visual;
- ownership atribuído.

`NOT_TESTED` nunca equivale a `PASS`.

## 14. Qualidade visual

Avaliar explicitamente:

- hierarquia;
- composição;
- tipografia;
- espaçamento;
- qualidade e função da mídia;
- adequação à marca;
- profundidade;
- motion;
- expressão mobile;
- momentos de assinatura.

Build verde é requisito técnico, não prova de boa direção de arte.

## 15. Promoção para domínio próprio

Após contratação, o mesmo projeto recebe domínio próprio. Preservar:

- `projectId/client_key`;
- conteúdo;
- assets;
- funil;
- leads;
- analytics;
- histórico;
- versões;
- permissões.

A promoção exige troca de canonical, plano de redirect e configuração de host. Não recriar o projeto.

## 16. Auditoria global

A auditoria por projeto deve reportar no mínimo:

- `slug`;
- estado publicado;
- owner/membership;
- destino do funil;
- funcionamento do funil;
- SEO;
- mobile;
- privacidade;
- performance;
- qualidade visual;
- originalidade;
- gaps de evidência;
- ação recomendada.

O resumo global deve separar explicitamente passivo legado de regressões novas.

## 17. Estado de melhoria contínua

A meta não é “todos os gates verdes”. A meta é cada cliente possuir uma presença que pareça criada **para aquele negócio**, enquanto a 0WEB mantém um motor comum seguro e escalável.

Quando houver conflito entre velocidade e clonagem visual, preservar a velocidade no motor e regenerar a composição — nunca reduzir a singularidade para entregar mais rápido.
