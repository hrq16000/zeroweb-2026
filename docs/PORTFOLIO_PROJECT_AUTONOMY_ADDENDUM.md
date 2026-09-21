# Adendo — Autonomia visual, identidade e completude dos novos projetos

Este adendo **soma** ao Portfolio Blueprint, Entity Enrichment, Media
Enrichment, Motion Standard, Quality Profile, Funnel Governance, Originality,
SEO, Lifecycle e aos gates existentes. Não substitui nenhum deles.

Aplica-se a projetos gerenciados com `contractVersion >= 3`. Legado permanece
sob os gates antigos.

## 1. Pesquisa automática faz parte do scaffold (§1–§2)

Depois do intake, o pipeline executa sozinho, conforme disponibilidade e
orçamento do provider:

```text
ENTITY_DISCOVERY → ENTITY_RESOLUTION → GOOGLE_MAPS → REVIEWS → PHOTOS
→ GOOGLE_SEARCH / KNOWLEDGE GRAPH → SOCIAL DISCOVERY → MEDIA DISCOVERY
```

Só há parada para intervenção humana em `CONFLICT`, `UNRESOLVED` relevante,
`PROVIDER_BLOCKED`, direito de uso incerto ou decisão editorial que mude fatos.
Pesquisar automaticamente **não** é publicar automaticamente: provenance,
confidence, direitos, coerência e quality gates continuam obrigatórios.

### 1.1 Contrato do pipeline autônomo R1 → R2

A entrada mínima oficial é `nome + localização`. O pipeline preserva duas
camadas independentes em `source_snapshot`:

```text
R1 research  → autonomous_research
R2 content   → autonomous_content
state        → autonomous_pipeline
```

**R1 — pesquisa factual** (`src/lib/portfolio-autonomous-research.server.ts`):
resolve entidade, procura Maps/web/redes, registra `providerCalls`, erros,
`facts[]`, mídia candidata, reviews e lacunas. Telefone público nunca vira
WhatsApp automaticamente.

**R2 — composição evidence-only** (`src/lib/portfolio-autonomous-content.ts`):
transforma apenas evidências suficientes em briefing, hero, sobre, CTA, SEO,
discovery, schema draft, FAQ e etapas. Serviços/diferenciais ausentes continuam
ausentes; não são derivados do segmento por conveniência.

Estados de R2:

```text
content_composed  → há evidência suficiente para conteúdo estruturado
content_partial   → conteúdo seguro gerado, mas faltam fatos importantes
blocked_identity  → conflito de entidade; não compor como se estivesse resolvido
blocked_provider  → provider indisponível; reexecutar pesquisa antes de avançar
```

`autonomous_pipeline.contract = 2` é o contrato vigente. A R1 é sempre
preservada e auditável; a R2 não substitui nem reescreve a proveniência.

Regra de promoção factual da R2: um item só entra em `services` ou
`differentials` quando existe como fato explícito com confiança suficiente.
Candidato, inferência de categoria, snippet ambíguo ou conhecimento genérico do
segmento não vira claim público.

### 1.2 Evidência estruturada de serviços

A R1 pode promover automaticamente um serviço para `facts[]` somente quando a
entidade já tiver confiança `>= 70` e a fonte resolvida trouxer um campo
estruturado explicitamente identificado como serviço/especialidade.

Allowlist canônica de chaves normalizadas:
`service`, `services`, `servico`, `servicos`, `specialty`,
`specialties`, `especialidade`, `especialidades`, `service_list`,
`services_list`.

Descrição livre, snippet, categoria, produto, inferência por segmento e flags
booleanas de conveniência não viram serviço. Se não houver campo elegível,
`verified_services` continua pendente.

### 1.3 Inteligência de landing antes da direção de arte

Depois da R2 factual e antes de escolher topologia visual, todo projeto novo deve
classificar a decisão comercial conforme
`docs/PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md`.

O pipeline registra/decide pelo menos: estágio do funil, audiência, trabalho
principal do visitante, conversão primária, risco da decisão, necessidade de
prova, profundidade de conteúdo, fricção do formulário, modos de prova,
estratégia do hero e continuidade pós-conversão.

Isso **soma** repertório aos gates atuais; não cria template. A narrativa pode
seguir arcos como serviço local, orçamento consultivo, B2B/software,
evento/curso, material rico, franquia, catálogo ou educação sensível. A ordem
das seções continua derivada da decisão real e da evidência do cliente.

Novos gates aditivos de decisão: `OFFER_SINGULARITY_GATE`,
`FIRST_FOLD_CLARITY_GATE`, `MESSAGE_MATCH_GATE`,
`CTA_INTENT_CONSISTENCY_GATE`, `FORM_FRICTION_GATE`,
`PROOF_PROXIMITY_GATE`, `DECISION_PACKET_GATE`,
`DELIVERABLE_PREVIEW_GATE`, `PRIVACY_CONSENT_GATE` e
`POST_CONVERSION_CONTINUITY_GATE`.

## 1.4 RESOURCE_UTILIZATION_GATE

Autonomia significa também **não esperar o operador pedir o óbvio depois**.
Todo projeto novo segue `docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md` e
tenta ativamente os recursos relevantes de pesquisa, mídia, skills, identidade,
decisão, interação, SEO, acessibilidade, performance, conversão, medição e QA.

O pipeline registra os recursos centrais utilizados e os que ficaram
`ATTEMPTED_BLOCKED`, `REJECTED` ou `NOT_APPLICABLE`. Ignorar recurso útil por
conveniência impede considerar a etapa autônoma concluída; ligar recurso sem
benefício também é falha.

## 2. IDENTITY_COMPLETENESS_GATE (§3–§6)

Toda landing declara uma decisão explícita de identidade:

`REAL_LOGO` · `NORMALIZED_LOGO` · `WORDMARK_CREATED` · `BRANDMARK_CREATED` ·
`TEXT_ONLY_INTENTIONAL`

- logo real encontrada → usar a real;
- logo ruim/fotografada → tentar normalização fiel;
- sem logo utilizável → é permitido **criar** identidade original (wordmark,
  símbolo, versão clara/escura, ícone social) a partir de nome, segmento,
  personalidade, paleta, contexto, público e posicionamento;
- identidade criada é registrada como `GENERATED_BRAND_ASSET`. Nunca alegar
  que era marca anterior, oficial ou fornecida pelo proprietário. Logo real
  posterior substitui o asset criado;
- `TEXT_ONLY_INTENTIONAL` exige justificativa editorial — falta de asset não é
  justificativa.

## 3. ABOVE_THE_FOLD_GATE (§7–§9)

A primeira dobra comunica identidade, segmento, proposta, ação e atmosfera.
Quando a atividade depende de contexto visual (oficina, restaurante, obra,
beleza, comércio, indústria, produto) e o enrichment encontrou mídia adequada,
a presença dessa mídia na primeira dobra é obrigatoriamente avaliada.

O media plan registra `heroMedia`:

```json
{ "asset": "", "source": "", "provenance": "", "narrativeRole": "",
  "crop": "", "focalPoint": "", "mobileStrategy": "" }
```

Hero não recebe "o que sobrou".

## 4. Conversão persistente (§10–§13)

`layout.floatingConversion` é decisão explícita: `enabled` (com rótulo
contextual) ou `disabled` com razão registrada. Quando
`contactMode = funnelOnly`, o destino é sempre `funnelResolver(slug)` —
nunca telefone ou WhatsApp. O rótulo tem nexo com o `funnelType`
("Agendar avaliação", "Descrever o problema"), não "Contato". No mobile:
respeita safe-area, não cobre conteúdo nem a navegação, sem CLS.

## 5. MOTION_PRESENCE_GATE (§14–§17)

Três estados distintos:

- `MOTION_DECLARED` — só configuração;
- `MOTION_IMPLEMENTED` — consumido pelo renderer (seções com `motion`,
  IntersectionObserver, transform/opacity, scroll progress, hover);
- `MOTION_OBSERVED` — verificado no runtime com navegador.

`READY` exige no mínimo `MOTION_IMPLEMENTED`; com navegador disponível,
`MOTION_OBSERVED`. O Hero avalia ao menos uma técnica contextual (text/image/
mask reveal, parallax leve, depth, stagger, entrada em camadas); nenhuma só com
justificativa editorial.

## 6. STRUCTURAL_SKELETON_SIMILARITY (§18–§22)

Originalidade não é só estilo. O gate extrai a topologia (sequência ordenada de
`type.variant`) do componente e compara com os demais projetos gerenciados
(`scripts/portfolio-skeleton.mjs`). Similaridade `>= 0.8` reprova; a partir de
`0.7` vira warning.

A topologia deriva da narrativa comercial da entidade — nunca de rotação
aleatória. `signatureMoments` precisam afetar composição, interação, scroll,
mídia, narrativa ou densidade; hover de ícone não é assinatura.

## 7. PORTFOLIO_EMBED_GATE (§23–§27)

A página precisa funcionar também dentro do visualizador do catálogo
(`/portfolio` → card → modal/iframe), com navegação anterior/próximo,
fechamento, compartilhamento, scroll interno e largura pequena.

Tela branca dentro do `/portfolio` com rota direta funcionando é
**P0 PORTFOLIO_EMBED_FAILURE** e reprova `stage=ready`. A correção acontece na
abstração (catálogo/visualizador/Blueprint), nunca em exceção por slug.

Card, modal, Hero, capa e OG formam uma identidade contínua (§28).

## 8. Fluxo de qualidade (§29) e readiness (§31)

```text
ENTITY → ENRICHMENT → IDENTITY → MEDIA → CREATIVE DIRECTION → BLUEPRINT
→ RESOURCE UTILIZATION → MOTION → FUNNEL → SEARCH → SEO → COVER → DIRECT QA → EMBED QA
→ QUALITY → READY
```

Um projeto novo não chega a `READY` enquanto falhar
`IDENTITY_COMPLETENESS_GATE`, `ABOVE_THE_FOLD_GATE`, `MOTION_PRESENCE_GATE`,
`STRUCTURAL_SKELETON_SIMILARITY` ou `PORTFOLIO_EMBED_GATE`.

## 9. Contrato de dados

`docs/portfolio/quality-matrix/<slug>.json` → bloco `autonomy`:

```json
{
  "identity": { "decision": "", "asset": "", "provenance": "", "evidence": "" },
  "aboveTheFold": { "status": "PASS", "visualStrategy": "", "notes": "" },
  "motionPresence": { "state": "MOTION_OBSERVED", "evidence": [] },
  "floatingConversion": { "mode": "enabled", "label": "", "destination": "funnel" },
  "embed": { "status": "PASS", "checkedAt": "", "notes": "" }
}
```

Gates executáveis: `bun run check:portfolio-landing-quality` e
`bun run check:portfolio-project-readiness`.

## 10. Regra de autonomia (§30)

Um projeto novo nasce completo sem que alguém precise pedir depois: procure
avaliações, procure fotos, encontre Instagram, crie logo, coloque imagem no
Hero, coloque CTA flutuante, adicione motion, deixe diferente do outro cliente,
corrija o iframe. A intervenção humana serve para aprovar, resolver conflito,
decidir exceção e elevar direção criativa.
