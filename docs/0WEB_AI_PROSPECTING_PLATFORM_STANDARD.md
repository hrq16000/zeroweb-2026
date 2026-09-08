# 0WEB — padrão cumulativo de descoberta e entrega de presença digital

Status: **normativo para prospecção, novos clientes e evolução de `/portfolio/<slug>`**. Complementa `PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`, `PORTFOLIO_CLIENT_STANDARD.md`, `PORTFOLIO_CONVERSION_INTELLIGENCE_STANDARD.md` e `0WEB_EXECUTION_CONTRACT.md`.

## 1. Somar, não substituir

Uma nova ferramenta, fonte ou rodada de IA **agrega capacidade** ao contrato existente; nunca pode remover silenciosamente identidade, funil individual, SEO local, assets, acessibilidade, privacidade, conteúdo factual, Kit de Presença, motion próprio ou busca regional já aprovados.

Toda ferramenta, inclusive Lovable, deve: sincronizar `origin/main`; trabalhar apenas no estado atual do repositório oficial; preservar fatos, assets e decisões aprovadas; validar antes de publicar; integrar em `main`; e terminar sem artefatos, cópias ou estado local obsoleto.

Nenhuma entrega pode ser considerada “mais simples” à custa de transformar um site comercial em card, scaffold, texto genérico ou funil de outro negócio.

## 2. Entrada por nome e pesquisa factual

O operador pode iniciar a descoberta somente com o nome do negócio. Cidade/bairro ajudam a desambiguar. A IA realiza pesquisa proporcional e verificável nas fontes públicas mais relevantes; ela não promete uma busca literalmente exaustiva de toda a internet.

Ordem de confiança:

1. material fornecido pelo operador ou cliente: fotos, menu, logo, serviços e observação presencial;
2. site, cardápio, agenda, Google Business Profile e rede social oficial;
3. perfis oficiais vinculados entre si;
4. diretórios e menções de terceiros, apenas como corroboramento;
5. inferência de IA, somente para linguagem, estrutura e arte de marca — nunca como prova factual.

Em conflito, a fonte oficial mais recente ou a confirmação do operador vence. Informação sem fonte continua como desconhecida; nunca vira preço, horário, cobertura, avaliação, certificação, promessa ou contato inventado.

## 3. Dossiê obrigatório antes da página

Cada novo slug registra no creative brief v2 ou em `docs/portfolio/research/`:

```text
businessName / aliases:
resolvedLocation: cidade, estado, bairro e endereço somente se confirmado
category + serviços confirmados:
officialLinks: site, menu, Instagram, Facebook, agenda, quando existentes
hours / delivery / booking: somente se confirmado
officialAssets: logo, fotos, cardápio, vídeo, origem
operatorEvidence: observação presencial ou material enviado, com data
factsWithConfidence: confirmado | provável | desconhecido
publicationState: client-approved | public-prospect-preview | internal-research
recommendedProduct: simple | complete | animated | system
conversionGoal + funnel intent:
localSEO: cidade, bairro e região realmente atendida
gapsAndDoNotClaim:
sourcesReviewed: URL/fonte + data de checagem
```

`client-approved` exige autorização de representação oficial. `public-prospect-preview` pode exibir uma proposta para um negócio real, sem fingir propriedade, parceria, avaliação ou aprovação. `internal-research` nunca é publicado.

## 4. Página rica, não “toco”

Para negócio real aprovado, o resultado mínimo é landing page específica, não um card de catálogo. A composição vem do creative brief e do ramo, mas contempla, quando relevante:

- identidade própria: logo preservada ou conceito explicitamente marcado até aprovação; favicon, OG e capa próprios;
- hero factual: oferta, público e localização real;
- serviços, produtos ou cardápio concretos e confirmados;
- contexto, funcionamento, entrega, retirada, agenda ou visita apenas quando confirmados;
- prova legítima: fotos oficiais, processo, materiais ou escopo; nunca avaliações, métricas ou depoimentos fabricados;
- CTA e funil exclusivos; pedido nunca vira orçamento genérico e CTA de cliente nunca cai no funil da 0WEB;
- próximo passo com objeção real; Kit de Presença com ilustração de cartão/panfleto e rótulo de conceito quando necessário;
- SEO local, JSON-LD compatível, canonical, OG, sitemap, breadcrumbs e conteúdo útil a pessoas, buscadores e LLMs;
- motion, acessibilidade, mobile e performance proporcionais à marca, com fallback sem JS e `prefers-reduced-motion`.

`/portfolio` é a camada de descoberta: indexa categoria, subcategoria, cidade, estado, bairro/região e atributos verdadeiros, mas jamais reduz o site individual a uma prévia.

## 5. Pacotes por necessidade real

| Produto | Quando recomendar | Capacidades mínimas |
|---|---|---|
| **Site simples** | presença inicial e uma decisão principal | página autoral, SEO local, CTA/funil, OG e link público |
| **Site completo** | serviços, catálogo, portfólio ou narrativa rica | simples + blocos específicos, galeria/FAQ/processo factuais, edição estruturada e métricas de funil |
| **Site animado** | a primeira impressão ganha valor com movimento | completo + hero/motion com propósito, budget de performance e reduced motion |
| **Sistema** | o cliente precisa operar pedidos, agenda, reserva ou dados | completo + discovery de regras, painel, autenticação, RLS, estados, auditoria e privacidade |

Scripts de abordagem, link público, animações, agenda, dashboard, CSV, busca por bairro/município, pixels e marca d'água são capacidades selecionáveis. Não entram indiscriminadamente: dependem de objetivo, dados, segurança e aceite. Pixels Meta/Google e Analytics respeitam consentimento. CSV, painel, equipe e agenda exigem autenticação, permissões por `clientKey`, RLS e coleta mínima.

Metas comerciais como volume mensal de leads/edições/equipe não são anunciadas como funcionalidade ativa sem implementação, medição e operação configurada.

## 6. Fluxo operacional

```text
nome do negócio
  → resolução de entidade e fontes públicas
  → dossiê factual + evidência classificada
  → pacote e objetivo de conversão
  → creative brief / direção visual única
  → página, assets, SEO e funil individuais
  → testes de dados, privacidade, UI e browser
  → GitHub/main → deploy oficial → link público
  → histórico e melhoria por dados reais
```

Scripts de abordagem são artefatos internos da 0WEB e usam o dossiê para explicar uma oportunidade verdadeira. Não podem misturar ramo, cidade, imagens, contatos ou promessas de outro negócio.

## 7. Referências externas e LocalSite-ai

Plataformas de geração de landing pages inspiram velocidade de discovery, preview, edição e proposta; não definem nossa arquitetura nem autorizam copiar templates. `weise25/LocalSite-ai` é **REFERENCE_ONLY**: sua geração por texto, preview responsivo e edição são repertório útil, porém seu stack atual é SvelteKit/Deno e providers configuráveis. Ele não substitui React/TanStack/Bun, segurança, funis ou gates da 0WEB. A referência também alerta para dependência histórica comprometida; qualquer adoção futura requer revisão de segurança independente. [Repositório original](https://github.com/weise25/LocalSite-ai).

## 8. Gates e encerramento limpo

```bash
git fetch origin --prune
git pull --ff-only origin main
bun run validate:portfolio-boundaries
bun run validate:portfolio-catalog
bun run validate:portfolio-conversion-profiles
bun run validate:portfolio-assets
bun run validate:portfolio-logos
bun run check:portfolio-funnel-context
bun run check:portfolio-originality
bun run check:portfolio-visual-quality:enforce
bun run check:experience-standard:enforce
bun test
bun run build
```

Depois da publicação: registrar commit/validação e conferir `git status -sb`. Saídas temporárias de build, relatórios recriáveis, stashes, worktrees, branches locais e cópias externas não podem ficar como fonte paralela.

## 9. Baseline auditado em 2026-09-08

No `main` sincronizado: 85 clientes, logos, assets e funis passaram nos contratos estruturais. A fila a evoluir ficou explícita: 40 capas requerem revisão material de legibilidade/originalidade; 6 pares têm alta similaridade; 1 projeto está `NEEDS_UPGRADE`; há 74 itens P1 e 137 P2 de qualidade visual; grupos de motion ainda compartilham assinatura perceptível. Esses achados definem ciclos de correção por risco/ramo — não devem ser mascarados nem removidos do contrato.
