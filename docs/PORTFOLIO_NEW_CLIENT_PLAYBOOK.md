# Playbook oficial — novo site em `/portfolio/<slug>`

Status: **obrigatório**. Complementa `docs/PORTFOLIO_CLIENT_STANDARD.md`,
`docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`,
`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`,
`docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`,
`docs/EXPERIENCE_DESIGN_MAX_STANDARD.md`, `docs/LAYOUT_ENGINEERING_STANDARD.md`
e `docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md`.

Objetivo: todo projeto novo nasce tecnicamente completo **sem virar um template
visual da 0WEB** e sem depender de uma lista estática de skills que envelhece.

## 0. Regra de ouro

**Padronizar a engenharia, nunca a criatividade.**

Antes de criar JSX visual, executar:

```text
0web-skill-router
→ 0web-skill-discovery
→ revisar skill-marketplace-catalog
→ pesquisar fontes originais + LobeHub + AwesomeSkill Search quando aplicável
→ 0web-experience-design-max
→ 0web-portfolio-art-direction
→ especialista landing/CRO adequado à intenção
→ 0web-design-system
→ layout engineering (Flexbox/Grid/intrinsic sizing)
→ especialistas não redundantes de motion/a11y/React/perf/SEO/conteúdo/browser QA
→ 0web-ui-quality-gates
```

Criar e preencher `docs/portfolio/briefs/<slug>.md` conforme
`PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`.

O resultado do discovery precisa ser registrado: skills usadas, rejeitadas,
`NOT_APPLICABLE`, fonte original quando resolvida e motivo. **Instalar todas as
skills encontradas não é objetivo; cobrir todas as competências relevantes é.**

## 1. Camadas — quem garante o quê

### Contrato de catálogo

Todo cliente deve possuir metadados de descoberta: `segment`, `subsegments`,
`projectType`, `city`, `state`, `services`, `technologies`, `tags`, `status`,
`publishedAt`, `featured`, resumo curto e imagem do card.

Todo projeto criado pelo scaffold v2 também registra `creativeContractVersion: 2`
e `creativeBriefFile` em `portfolio-clients.json`.

O contrato de consistência exige rota resolvível, componente e assets próprios,
slug único, canonical próprio, sitemap, funil próprio e identidade própria.

| Camada | Quem garante | Onde |
|---|---|---|
| Pop-up de captação 0WEB | Plataforma | rota compartilhada |
| Compartilhamento | Plataforma | rota compartilhada |
| SEO base/canonical/JSON-LD/breadcrumb | Plataforma + dados do cliente | `head()`/registry |
| Roteamento privado WhatsApp | Plataforma | `/r/whatsapp/$token` + destino server-side |
| Skill discovery / quality stack | Plataforma + tarefa | registry/catalog + PR/changelog |
| Direção criativa | **Cliente/projeto** | creative brief + componente exclusivo |
| Layout | **Cliente/projeto** | Flexbox/Grid/intrinsic strategy + componente |
| Paleta/tipografia/motion | **Cliente/projeto** | tokens locais + componente + motion override |
| Funil | **Cliente** | `dynamic_forms` publicado |
| Prova social | Cliente | somente conteúdo verificável |
| Crédito de hospedagem | Plataforma com estilo compatível | `PortfolioHostCredit` |

## 2. Scaffold é infraestrutura, não template

`scaffold:portfolio` não deve produzir uma landing genérica pronta para
publicação. Ele cria:

- registros técnicos;
- componente workbench com marcador de direção criativa pendente;
- diretório de assets;
- migration do funil;
- creative brief v2.

O marcador de scaffold deve ser removido quando a composição real do cliente
for implementada. Projeto `published` com marcador pendente falha no gate.

Nunca partir do componente de outro cliente para “ganhar tempo”. Consulte outros
projetos apenas para **evitar** semelhança.

## 3. Checklist de lançamento

1. Rodar o scaffold ou registrar manualmente os mesmos contratos.
2. Executar discovery de skills conforme `SKILL_MARKETPLACE_DISCOVERY_STANDARD` e registrar o stack.
3. Pesquisar/resolver a entidade e evidências; pesquisa não realizada é bloqueio, dado honestamente ausente não.
4. Gerar pelo menos direções criativas substancialmente divergentes e selecionar a que melhor equilibra identidade, conversão, evidência e originalidade.
5. Preencher o creative brief v2 antes do layout final.
6. Registrar catálogo e `portfolio-site-registry.ts`.
7. Criar diretório exclusivo `public/images/<slug>/` e identidade própria.
8. Criar componente exclusivo em `src/components/site/<Cliente>Page.tsx`.
9. Definir macro-layout próprio e documentar Flexbox/Grid/híbrido, wrapping, sizing e comportamento 390/768/1440.
10. Usar tokens/tipografia escopados ao cliente quando a identidade exigir.
11. Declarar **override próprio** em `src/config/portfolio-motion-profiles.json`; default por segmento é fallback legado, não direção final de novo cliente.
12. Avaliar as 14 capacidades de motion como `REQUIRED`, `OPTIONAL` ou `NOT_APPLICABLE`; motion não pode ser a mesma coreografia reaplicada a todos.
13. Ligar rota/lazy loader e completar metadata/OG/Twitter/JSON-LD próprios do projeto, sem herdar descrição de outro vertical.
14. Criar/preencher o funil `funnel-<slug>`.
15. Usar `FunnelCTAButton` com `clientKey`, `companySlug` e `formSlug` próprios.
16. Cadastrar destino real somente no mecanismo server-side canônico quando houver evidência confiável; número não confirmado permanece `UNRESOLVED` e o lead deve continuar sendo salvo com recuperação/callback.
17. Criar `hero`, `catalogCover`, `social/OG` e `preview` próprios/resolvidos; um hero novo não deixa a capa velha válida automaticamente.
18. Validar logo/ícone exclusivos e assets sem compartilhamento indevido.
19. Comparar originalidade contra os portfolios mais próximos e registrar `antiTemplateDecisions`/fingerprint.
20. Fazer browser/runtime QA antes de publicar.

Nenhum telefone, `wa.me` ou e-mail operacional pode existir no bundle público.

## 4. Conteúdo e prova

Não fabricar avaliações, depoimentos, estrelas, números de clientes, prêmios,
logos de clientes, urgência ou resultados apresentados como reais.

Para protótipo, conteúdo ilustrativo só pode aparecer visivelmente marcado como
`Exemplo`, `Demonstração` ou equivalente. Em produção, preferir evidência real:
processo, materiais, garantia real, escopo, metodologia, fotos oficiais, FAQ e
outras provas verificáveis.

Pesquisa/conteúdo pode usar skills especializadas selecionadas no discovery,
mas toda afirmação comercial/local continua `evidence-first`.

## 5. Imagens

Prioridade:

1. logo/marca oficial;
2. fotos/produtos/trabalhos oficiais;
3. mídia licenciada ou gerada que funcione como **arte de marca**, sem fingir
   ser equipe, sede, cliente ou serviço executado;
4. composição abstrata/typographic brand art.

Usar `PortfolioImage`, dimensões explícitas, LCP controlado e lazy loading nas
imagens abaixo da dobra. Gerar derivados WebP/AVIF quando útil sem apagar
originais importantes do cliente.

Cada projeto precisa distinguir finalidade dos assets. `hero`, `catalogCover`,
`social/OG` e `preview` podem compartilhar uma matriz criativa, mas são entregas
com proporção/crop/função próprias e precisam ser verificadas separadamente.

## 6. Layout engineering

Seguir `docs/LAYOUT_ENGINEERING_STANDARD.md`.

- **Flexbox:** alinhamento/distribuição/wrap unidimensional; verificar main axis,
  cross axis, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`,
  `gap`, grow/shrink/basis e `min-width: 0` quando necessário.
- **Grid:** macrocomposição bidimensional, mosaicos e topologias editoriais.
- **Intrinsic sizing:** preferir `minmax`, `clamp`, `max-width`, `aspect-ratio` e
  comportamento orientado ao conteúdo a larguras rígidas.
- A ordem do DOM/foco deve continuar semântica; não usar `order`/reverse para
  esconder uma estrutura ruim.
- Nenhuma decisão de Flexbox/Grid torna duas composições visualmente iguais aceitáveis.

## 7. Portões automáticos

```bash
bun run check:experience-skill-policy
bun run validate:portfolio-scaffold
bun run validate:portfolio-boundaries
bun run validate:portfolio-meta
bun run validate:portfolio-logos
bun run audit:portfolio-skills
bun run check:portfolio-originality
bun run check:portfolio-uniqueness
bun run check:experience-standard
bun run validate:client-privacy
bun test
bun run build
node scripts/playwright-portfolio-funnels.mjs
```

Critério funcional: CTA → funil → lead → token → `/r/whatsapp/...` → redirect
correto quando o canal estiver `CONFIGURED`; quando `UNRESOLVED`, o lead continua
salvo e recebe fluxo de recuperação sem ser enviado ao WhatsApp institucional.

## 8. Revisão visual obrigatória

Validar pelo menos:

- mobile 390/393px;
- tablet ~768px;
- desktop 1440px;
- teclado/foco;
- reduced motion;
- console;
- navegação;
- modal/lightbox/embed do catálogo quando houver;
- CTA/funil;
- contraste;
- crop de `hero`, `catalogCover`, `social/OG` e `preview`;
- estados `BEFORE → DURING → AFTER` de signature moments quando aplicável.

A revisão precisa responder: hero, section graph/order, tipografia, tratamento de
imagem, grid topology, media distribution, CTA, fechamento, motion e assinatura
interativa são realmente diferentes dos portfolios mais próximos?

## 9. Automação

```bash
bun run scaffold:portfolio -- --slug <slug> --name "Nome do Cliente"
bun run scaffold:portfolio -- --slug <slug> --name "Nome" --dry-run
```

Após o scaffold, o próximo passo **não** é publicar: é pesquisa + discovery +
creative direction + composição autoral + mídia + funil + QA.

## 10. Governança

Issue → branch → PR → checks → revisão → merge. Nunca publicar direto em `main`.

Herdados da plataforma: segurança do redirect, pop-up de captação, share,
breadcrumbs, observabilidade e infraestrutura SEO. O visual do cliente não é herdado.

## 11. Contato e mídia (obrigatório)

Antes de considerar um cliente novo pronto:

**Contato** — todo CTA aponta para o funil individual, com rótulo contextual ao
negócio (Solicitar avaliação, Solicitar orçamento, Fazer pedido, Agendar
atendimento…). O destino real permanece server-side por `clientKey`; não expor
`tel:`, botão “Ligar”, `wa.me`, e-mail operacional ou número comercial no bundle.
Sem destino verificado, salvar lead e coletar contato de retorno — nunca usar o
WhatsApp institucional da 0WEB como fallback do cliente.

**Mídia** — todo asset declara finalidade (`EVIDENCE_ONLY`, `BRAND_REFERENCE`,
`REAL_BUSINESS_MEDIA`, `EDITORIAL_MEDIA`, `COVER_MEDIA`, `OG_MEDIA`,
`GENERATED_CONTEXTUAL_MEDIA`). Foto de placa/banner/panfleto enviada pelo
proprietário pode ser referência ou mídia real conforme contexto; não deve ser
promovida automaticamente a hero sem direção editorial. Seguir a prioridade
visual de `PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md` §22.2.

Gates: `CONTACT_FUNNEL_GATE` (§21.4) e `MEDIA_PURPOSE_GATE` (§22.5) do Blueprint
Standard, mais a avaliação editorial de encantamento (§22.4).
