# BTB Construção — evolução R3 / Mapa da Reforma

Data: 2026-09-21  
Slug/client_key: `btb-construcao`  
Branch de trabalho: `feat/btb-decision-experience-r3-20260921`  
Base inicial: `03f80205e2977ee509955d4723432406cd76297d`

## Objetivo

Usar a BTB como primeiro portfolio legado submetido de forma explícita ao conjunto atual de regras:

- R1/R2/R3 de Landing Decision Intelligence;
- Premium Experience;
- Creative Direction / anti-template;
- Resource Utilization Gate;
- funil individual e isolamento de cliente;
- SEO/entity evidence-first;
- mídia/provenance;
- performance, acessibilidade e reduced motion.

A evolução não é “mais um redesign”. O objetivo é transformar uma landing de catálogo de serviços em uma experiência que ajuda o visitante a **organizar o escopo inicial da reforma antes do orçamento**.

## Estado anterior observado

A página publicada já era funcional e possuía hero, CTA, serviços e funil. O relatório visual histórico, porém, registrava score 58, `NEEDS_UPGRADE` e similaridade estrutural elevada com Easy Clean. Parte dos sinais do relatório estava desatualizada — a produção atual já possuía hero/headline/CTA — mas a macroestrutura realmente permanecia próxima do padrão:

`header sticky → hero split → cards → processo → CTA → footer`.

O próprio creative brief da BTB já dizia que o projeto não deveria depender de “hero dividido genérico”, portanto havia uma divergência entre intenção editorial e composição real.

## Pesquisa factual

A fonte segura continua sendo o flyer oficial e o briefing fornecidos pelo cliente.

Nova busca pública tentou resolver site, redes, telefone e mídia da BTB de Curitiba. Os resultados encontrados não produziram uma entidade correspondente com confiança suficiente. Homônimos de outros estados/segmentos foram rejeitados, especialmente BTB Construções e Participações (Goiás) e BTB Engenharia.

Consequência:

- nenhum dado desses homônimos entrou na página;
- nenhuma foto externa foi copiada;
- nenhum perfil social foi associado;
- nenhuma condição comercial externa foi inferida;
- o destino operacional já existente foi preservado, mas segue `CONFIGURED_UNVERIFIED` no ledger de provenance.

Registro factual: `docs/portfolio/enrichment/btb-construcao.json`.

## Nova experiência

### Hero

Sai o split genérico. Entra um hero full-bleed editorial, com manifesto tipográfico e disclosure explícito de que a imagem é composição contextual, não fotografia documental de obra executada.

### Mapa da Reforma

Novo decision aid interativo:

1. visitante pode selecionar uma ou várias frentes;
2. pode informar opcionalmente o tipo de espaço;
3. a seleção é levada para o funil;
4. o funil começa na primeira informação ainda ausente.

O decision aid não calcula preço e não promete viabilidade, agenda ou prazo.

### Context carryover

`PortfolioCTAQuiz` ganhou suporte opcional a:

- `initialAnswers`;
- `skipPrefilledSteps`.

O comportamento legado não muda quando essas props não são utilizadas.

Na BTB, o Mapa preenche `service` e `experience`; região, timing e detalhes continuam sendo coletados normalmente.

### Narrativa

A página passa a seguir:

`ORIENTAÇÃO → ESCOPO → FRENTES → PROCESSO → FATOS → COMPROMISSO`.

A grade dominante de cards foi substituída por uma leitura linear/técnica e pela interação do Mapa.

## Claims

Mantidos somente fatos com base interna:

- serviços documentados;
- Curitiba e região;
- garantia informada pela BTB de 90 dias.

Removidos nesta evolução por ausência de revalidação documental suficiente:

- desconto à vista;
- parcelamento em até 12x;
- expressão genérica “profissionais qualificados”.

Nenhum rating, depoimento, volume de obras, prazo padrão ou preço foi criado.

## Mídia

`docs/portfolio/media-plans/btb-construcao.json` classifica explicitamente:

- `hero.png` = `GENERATED_CONTEXTUAL_MEDIA`, documentary=false;
- flyer = `OWNER_SUPPLIED_REFERENCE / EVIDENCE_ONLY`;
- capa/OG = composições editoriais, não prova documental;
- `logo.svg` legado não é apresentado como marca histórica/oficial.

Fotos reais do negócio continuam pendentes.

## SEO/entity

O JSON-LD da BTB deixa de usar o `Service` genérico da vertical 0WEB e passa a declarar um nó específico `GeneralContractor` com:

- nome BTB Construção;
- área atendida em nível seguro;
- ofertas correspondentes aos serviços documentados.

Não foram adicionados telefone público, endereço inventado, review ou aggregateRating.

## Funil e isolamento

- `clientKey = btb-construcao`;
- `funnelType = orcamento`;
- `contactMode = funnelOnly`;
- destino operacional preservado no registro do próprio client_key;
- status de provenance: `CONFIGURED_UNVERIFIED`;
- nenhum fallback institucional/cross-client introduzido.

## Resource Effort Ledger

O ledger completo está no creative brief v3. Destaques:

- flyer: USED;
- busca web/Maps/social: ATTEMPTED_BLOCKED;
- mídia real: ATTEMPTED_BLOCKED;
- mídia contextual: USED;
- decision aid: USED;
- context carryover: USED;
- SEO/entity específico: USED;
- simulador de preço: REJECTED;
- mapa geográfico: NOT_APPLICABLE;
- reviews/ratings: REJECTED sem evidência;
- 3D/vídeo pesado: REJECTED;
- contato direto público: REJECTED.

## Arquivos centrais

- `src/components/site/BtbConstrucaoPage.tsx`
- `src/components/site/BeautyBookingQuiz.tsx`
- `src/routes/portfolio.$slug.tsx`
- `src/config/portfolio-clients.json`
- `src/config/portfolio-discovery.json`
- `src/config/portfolio-funnel-context.json`
- `src/config/portfolio-funnel-destinations.json`
- `src/config/portfolio-motion-profiles.json`
- `src/config/portfolio-assets.json`
- `docs/portfolio/briefs/btb-construcao.md`
- `docs/portfolio/enrichment/btb-construcao.json`
- `docs/portfolio/media-plans/btb-construcao.json`
- `tests/portfolio/btb-construcao-r3.test.ts`

## Publicação

Este relatório é criado antes do merge. Estados de preview, gates finais, merge e produção só podem ser marcados como PASS depois de observados no head final da PR.

A BTB permanece fora do `portfolio-project-manifests.json` nesta evolução. Isso é deliberado: enrollment retroativo no lifecycle gerenciado exigiria registry/composition, quality matrix e readiness próprios e deve ser tratado como migração estrutural separada, não como efeito colateral de um redesign.
