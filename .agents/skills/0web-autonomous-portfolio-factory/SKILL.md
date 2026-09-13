---
name: 0web-autonomous-portfolio-factory
description: >
  Orquestra criação, pesquisa, direção criativa, ownership, edição, publicação e promoção de domínio
  de projetos /portfolio/:slug. Use em qualquer tarefa de novo site autônomo, seller live mode,
  client self-service, auditoria de ownership, pesquisa de destino ou evolução do gerador de sites.
---

# 0WEB Autonomous Portfolio Factory

Fonte normativa principal: `docs/PORTFOLIO_AUTONOMOUS_FACTORY_STANDARD.md`.

Leia também, conforme a tarefa:

- `docs/PORTFOLIO_PROJECT_LIFECYCLE.md`;
- `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`;
- `docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`;
- `.agents/skills/0web-portfolio-art-direction/SKILL.md`;
- `.agents/skills/0web-landing-experience/SKILL.md`;
- `docs/PORTFOLIO_FUNNELS.md`;
- `docs/PORTFOLIO_CLIENT_STANDARD.md`.

## Objetivo operacional

Transformar uma entrada curta em um projeto de cliente completo, factual, único, editável e promovível a domínio próprio, sem depender de criação manual de um novo conjunto de arquivos a cada cliente.

```text
few words
→ resolve entity
→ research/evidence
→ ask only unresolved critical facts
→ generate divergent creative directions
→ uniqueness preflight
→ project composition
→ content/media/motion/funnel/SEO
→ QA
→ preview
→ owner approval
→ publish
→ self-service editing
→ custom domain promotion
```

## Regras duras

1. **Research before questions.** Pesquise primeiro; pergunte apenas o gap crítico que restar.
2. **Evidence before claim.** Não invente telefone, endereço, horário, preço, avaliação, garantia, prêmio, cliente, foto factual ou resultado.
3. **Engineering shared, composition unique.** Primitives podem ser compartilhadas; a página final não pode ser skin de outro projeto.
4. **No template by segment.** “Oficina”, “confeitaria”, “advocacia” etc. não escolhem automaticamente um esqueleto visual.
5. **Three divergent directions internally.** Antes da composição final, explore direções materialmente distintas e descarte as semelhantes ao catálogo.
6. **Build pass is insufficient.** READY exige qualidade técnica e editorial/criativa.
7. **Tenant isolation is server-side.** Owner/editor só acessa clientKeys atribuídos; UI escondida não é segurança.
8. **Same project, new host.** Domínio próprio promove o mesmo project id; não recrie conteúdo/site.
9. **Every edit is auditable/reversible.** Registrar ator, projeto, revisão, timestamp e before/after quando sensível.
10. **Never use 0WEB contact as client fallback.** Lead sem destino verificado é salvo e recuperável.

## WhatsApp/destino

- DDD + 8 locais = válido.
- DDD + 9 locais = válido.
- Fixo ou celular = válido.
- Nunca adicionar/remover/inferir 9.
- Entidade/evidência decide; tipo de linha não bloqueia.
- Institucional 0WEB é proibido para cliente.
- Não compartilhar entre marcas sem prova/ack.
- Mudança de VERIFIED exige proteção de troca.
- Relatórios usam máscara/fingerprint.
- Alvo canônico editorial: `portfolio_client_settings` + confirmação/revisão canônica.

## Creative Director

Para cada novo projeto, derive do negócio:

`businessTruth`, `audience`, `singleGoal`, `brandPersonality`, `visualMetaphor`, `spatialLanguage`, `heroConcept`, `navigationConcept`, `contentRhythm`, `mediaNarrative`, `typeStrategy`, `colorMateriality`, `motionNarrative`, `signatureInteraction`, `conversionNarrative`.

Produza múltiplas hipóteses antes de escolher. Não comece por `hero + cards + FAQ + CTA`.

### Reprovação automática conceitual

Se dois projetos compartilharem materialmente:

`heroGeometry + firstThreeChapters + gridTopology + typographyStrategy + mediaNarrative + motionGrammar + ctaDistribution`

então regenere a composição.

A diferença não pode depender principalmente de logo, cor, copy ou foto.

## Ownership / RBAC

Papéis-alvo:

- `super_admin`: tudo; atribui owner; aprova publish/domain.
- `seller`: cria draft/preview e edita projetos atribuídos.
- `client_owner`: edita e vê somente seus projetos.
- `client_editor`: escopos delegados.
- `visitor`: conteúdo público publicado.

Cadastro não significa ownership. Toda autorização sensível deve ser aplicada server-side/RLS por `projectId/clientKey`.

## Editor do cliente

A experiência deve privilegiar linguagem natural + controles estruturados. Permitir texto, mídia, serviços, dados comerciais próprios, SEO assistido, preview, version history e rollback sem expor complexidade de código.

Não permitir que uma edição quebre deliberadamente a11y, privacidade, funil, segurança ou isolamento.

## Seller live mode

O vendedor deve conseguir, diante do cliente:

```text
nome/descrição
→ pesquisar
→ confirmar gaps
→ gerar preview
→ ajustar conversando
→ compartilhar
→ aprovar/vender
```

Git, deploy e infraestrutura são invisíveis ao vendedor.

## Domain promotion

`/portfolio/:slug` e domínio próprio são hosts do mesmo projeto. Promover significa mapear domínio + canonical/SEO/SSL/política da rota anterior, preservando conteúdo, assets, revision history, analytics, owner e funil.

## Benchmark rule

Landingsite.ai, UX Pilot, LeadSite, Faroleads e similares são referências de **capacidade e velocidade**, nunca fontes para copiar visual, templates, textos ou assets.

Capacidades que vale superar: few-word intake, geração completa, pesquisa/enrichment, edição por chat, alternativas de layout, versioning, preview público, operação de agência, domínio próprio e publicação rápida.

## Fechamento

Ao concluir qualquer tarefa desta skill, reporte:

```text
CAPABILITY: IMPLEMENTED | PARTIAL | PLANNED | BLOCKED
PROJECTS_AFFECTED:
EVIDENCE_USED:
OWNERSHIP_IMPACT:
DESTINATION_IMPACT:
CREATIVE_ORIGINALITY:
SECURITY/RLS:
QA:
DEPLOYMENT:
OPEN_BLOCKERS:
```

Nunca declarar a fábrica “pronta” apenas porque uma landing renderiza.
