# Playbook oficial — novo site em `/portfolio/<slug>`

Status: **obrigatório**. Complementa `docs/PORTFOLIO_CLIENT_STANDARD.md`,
`docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md` e
`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md` (estrutura, seções,
parametrização e ordem narrativa da landing) e
`docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md` (pesquisa da entidade, fontes,
provas, mídia e `ENTITY_ENRICHMENT_GATE` — etapa anterior ao Blueprint).

Objetivo: todo projeto novo nasce tecnicamente completo **sem virar um template
visual da 0WEB**.

## 0. Regra de ouro

**Padronizar a engenharia, nunca a criatividade.**

Antes de criar JSX visual, executar:

```text
0web-skill-router
→ 0web-skill-discovery
→ 0web-portfolio-art-direction
→ 1 especialista landing/CRO adequado à intenção
→ 0web-design-system
→ especialistas de motion/a11y/perf necessários
→ 0web-ui-quality-gates
```

Criar e preencher `docs/portfolio/briefs/<slug>.md` conforme
`PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`.

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
| Roteamento privado WhatsApp | Plataforma | `/r/whatsapp/$token` + secret por cliente |
| Direção criativa | **Cliente/projeto** | creative brief + componente exclusivo |
| Paleta/tipografia/layout/motion | **Cliente/projeto** | tokens locais + componente + motion override |
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
2. Preencher o creative brief v2 antes do layout.
3. Registrar catálogo e `portfolio-site-registry.ts`.
4. Criar diretório exclusivo `public/images/<slug>/` e identidade própria.
5. Criar componente exclusivo em `src/components/site/<Cliente>Page.tsx`.
6. Usar tokens/tipografia escopados ao cliente quando a identidade exigir.
7. Declarar **override próprio** em `src/config/portfolio-motion-profiles.json`;
   default por segmento é fallback legado, não direção final de novo cliente.
8. Ligar a rota/lazy loader e completar metadata/OG/Twitter/JSON-LD.
9. Criar/preencher o funil `funnel-<slug>`.
10. Usar `FunnelCTAButton` com `clientKey`, `companySlug` e `formSlug` próprios.
11. Cadastrar o contato server-side pela convenção canônica:

```text
PORTFOLIO_WHATSAPP_<CLIENT_KEY_NORMALIZADO>
```

Ex.: `clientKey="sscons"` → `PORTFOLIO_WHATSAPP_SSCONS`.

12. Adicionar card/capa com crop válido para mobile e desktop.
13. Validar logo/ícone exclusivos e assets sem compartilhamento indevido.
14. Comparar originalidade contra os três portfolios mais próximos e registrar
    `antiTemplateDecisions` no brief.

Nenhum telefone, `wa.me` ou e-mail operacional pode existir no bundle público.

## 4. Conteúdo e prova

Não fabricar avaliações, depoimentos, estrelas, números de clientes, prêmios,
logos de clientes, urgência ou resultados apresentados como reais.

Para protótipo, conteúdo ilustrativo só pode aparecer visivelmente marcado como
`Exemplo`, `Demonstração` ou equivalente. Em produção, preferir evidência real:
processo, materiais, garantia real, escopo, metodologia, fotos oficiais, FAQ e
outras provas verificáveis.

## 5. Imagens

Prioridade:

1. logo/marca oficial;
2. fotos/produtos/trabalhos oficiais;
3. mídia licenciada ou gerada que funcione como **arte de marca**, sem fingir
   ser equipe, sede, cliente ou serviço executado;
4. composição abstrata/typographic brand art.

Usar `PortfolioImage`, dimensões explícitas, LCP controlado e lazy loading nas
imagens abaixo da dobra. Gerar derivados WebP quando útil sem apagar originais
importantes do cliente.

## 6. Portões automáticos

```bash
bun run validate:portfolio-scaffold
bun run validate:portfolio-boundaries
bun run validate:portfolio-meta
bun run validate:portfolio-logos
bun run audit:portfolio-skills
bun run check:portfolio-originality
bun run check:experience-standard
bun run validate:client-privacy
bun test
bun run build
node scripts/playwright-portfolio-funnels.mjs
```

Critério funcional: CTA → funil → lead → token → `/r/whatsapp/...` → redirect
correto quando o canal estiver `CONFIGURED`, sem contato exposto no bundle.

## 7. Revisão visual obrigatória

Validar pelo menos:

- mobile 393×852;
- tablet ~768px;
- desktop;
- teclado/foco;
- reduced motion;
- console;
- navegação;
- modal/lightbox quando houver;
- CTA/funil;
- contraste;
- crop das capas e imagens.

A revisão precisa responder: hero, section order, tipografia, tratamento de
imagem, motion e assinatura interativa são realmente diferentes dos portfolios
mais próximos?

## 8. Automação

```bash
bun run scaffold:portfolio -- --slug <slug> --name "Nome do Cliente"
bun run scaffold:portfolio -- --slug <slug> --name "Nome" --dry-run
```

Após o scaffold, o próximo passo **não** é publicar: é preencher o creative brief
e substituir o workbench por uma composição autoral.

## 9. Governança

Issue → branch → PR → checks → revisão → merge. Nunca publicar direto em `main`.

Herdados da plataforma: segurança do redirect, pop-up de captação, share,
breadcrumbs e infraestrutura SEO. O visual do cliente não é herdado.
