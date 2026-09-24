# Padrão de direção criativa — `/portfolio/<slug>`

Status: **normativo para projetos novos e redesigns materiais a partir de 2026-09-06**.
Projetos existentes não são redesenhados automaticamente por esta regra; quando
forem materialmente alterados, passam pelo contrato abaixo.

## Princípio

A 0WEB padroniza a engenharia, segurança, SEO, performance, acessibilidade,
funil e observabilidade. **Não padroniza a composição visual do cliente.**

Um site novo deve parecer uma criação específica para aquele negócio. Cor e
logo diferentes sobre o mesmo esqueleto não contam como identidade própria.

## 1. Creative brief obrigatório

Antes do primeiro componente visual, criar `docs/portfolio/briefs/<slug>.md`
com os campos abaixo preenchidos:

```text
businessTruth:
audience:
singleGoal:
brandPersonality:
visualMetaphor:
layoutTopology:
heroArchetype:
navigationArchetype:
sectionRhythm:
typePairing:
colorRoles:
imageStrategy:
iconStrategy:
motionGrammar:
interactionSignature:
conversionNarrative:
proofStrategy:
nearestPortfolioRisks:
antiTemplateDecisions:
resourceEffortLedger:
experienceEnginePrimary:
experienceEngineCounterpoint:
experienceEngineEvidence:
experienceEngineRejected:
```

Para projeto publicado, nenhum campo pode permanecer como `[PREENCHER]`.

## 1.1 Decision brief obrigatório — antes da composição

O Creative DNA visual não começa no vácuo. Para projeto novo, anexar ao brief o
perfil de decisão definido em
`docs/PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md` e no ledger R2.

Campos mínimos:

```text
trafficIntent:
trafficSource:
offerType:
decisionComplexity:
decisionRiskDimensions:
uncertainties:
decisionSupport:
valueDemonstration:
formStrategy:
transparencyPlan:
locationRequirement:
sourceContinuity:
crossChannelContinuity:
postConversionPlan:
measurementPlan:
```

Primeiro se decide **qual incerteza comercial precisa ser removida**; depois se
decide como isso vira composição, mídia e motion. Nenhum campo pode ser
preenchido por conhecimento genérico do segmento quando faltar evidência.

A extensão aditiva `LandingDecisionProfileV3` também é obrigatoriamente avaliada
antes da composição, conforme o Anexo R3 de
`docs/PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md`. Ela acrescenta
`pageMode`, velocidade de decisão, information scent, auto-segmentação,
context carryover, commitment ladder, claim→evidence, persuasão ajustada ao
risco, estados da jornada, escalada humana, contrato de resposta, freshness,
navigation leakage, mobile decision budget e experiment readiness. **SOME:** V3
não substitui V2; só amplia a decisão.

## 1.2 Resource effort obrigatório

Antes da composição final, o brief precisa registrar os principais recursos
considerados conforme `docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`.
Recursos materialmente relevantes recebem `USED`, `REJECTED`,
`ATTEMPTED_BLOCKED` ou `NOT_APPLICABLE`, com motivo/evidência. O agente não
pode usar “não precisei” como atalho se o recurso melhoraria de forma material a
verdade, a decisão, a identidade ou a conversão.

## 2. Competências obrigatórias

As categorias abaixo são capacidades, não obrigação de trocar a stack:

| Camada | Competências aplicadas no 0WEB |
|---|---|
| Estrutura web | HTML5 semântico via JSX/TSX, landmarks, headings, acessibilidade |
| CSS/layout | Tailwind v4, CSS Grid/Flexbox, custom properties escopadas, responsive/mobile-first |
| Interatividade | React 19, eventos React, state, modais, carrosséis, lightboxes e APIs quando necessárias |
| Build | Vite + Bun, TypeScript, lint/format, code splitting e bundling |
| UX/UI | direção visual, wireframe mental/Figma quando houver, hierarquia, navegação, microinterações |
| Acessibilidade | WCAG, teclado, foco, contraste, touch targets, reduced motion |
| Backend | TanStack Start/server functions + Supabase/Lovable Cloud quando a feature exigir |
| SEO | metadata própria, canonical, Open Graph/Twitter, JSON-LD, sitemap e conteúdo semântico |
| Performance | `PortfolioImage`, WebP/JPG, lazy loading, dimensões, LCP controlado, cache/CDN da plataforma |
| Versionamento | issue → branch → PR → revisão → merge; nunca alteração direta em `main` |
| Qualidade | testes, build, browser QA, Lighthouse/Pagespeed quando aplicável, console limpo |

Sass/Less, Vue, Angular, Webpack ou Babel não são adicionados só porque aparecem
em uma referência genérica. O equivalente deve ser aplicado na stack real do
0WEB, salvo necessidade técnica concreta e aprovada.

## 3. Skill stack em camadas

Para um novo portfolio/landing comercial:

```text
0web-skill-router
→ 0web-skill-discovery
→ 0web-portfolio-art-direction
→ 1 especialista de landing/CRO adequado à intenção
→ 0web-design-system (engenharia visual, identidade local do cliente)
→ motion/accessibility/performance especialistas quando relevantes
→ 0web-ui-quality-gates
→ browser + funnel + originality QA
```

O objetivo é usar **máximo de competências úteis**, não máximo de dependências
nem máximo de contexto. Skills redundantes são descartadas.

## 4. Diversidade visual real

Todo projeto novo precisa decidir conscientemente:

- topologia de layout;
- composição do hero;
- tipografia;
- sistema de cor;
- linguagem de bordas/radius;
- ritmo vertical e densidade;
- tratamento de imagem;
- linguagem de ícones/decoração;
- gramática de motion;
- assinatura interativa;
- narrativa de conversão.

Não usar automaticamente:

`navbar padrão → hero split → cards 3 colunas → benefícios → depoimentos → FAQ → CTA`.

Essa ordem só é permitida se o briefing justificar cada bloco e a composição
resultante continuar materialmente distinta do portfólio existente.

## 4.1 Matriz de papéis da experiência — antes do wireframe

Além do Creative DNA, toda landing nova deve transformar conteúdo bruto em uma
**matriz de papéis** antes de escolher seções ou componentes:

| Campo | Pergunta |
|---|---|
| `role` | Qual função este conteúdo cumpre na decisão? |
| `visitorQuestion` | Qual pergunta real do visitante ele responde? |
| `priority` | É essencial na primeira dobra, cedo, no meio, perto do fechamento ou apenas complementar? |
| `evidence` | Qual fato, mídia ou fonte sustenta o bloco? |
| `visualTreatment` | Que linguagem espacial faz sentido para este papel e esta marca? |
| `mediaRole` | A mídia demonstra produto, trabalho, processo, localidade, identidade, contexto ou prova? |
| `interaction` | Precisa ser leitura, seleção, comparação, filtro, galeria, simulador, diagnóstico, formulário ou nenhuma interação? |
| `mobileTranslation` | Como a composição muda no mobile sem virar desktop simplesmente empilhado? |

Papéis possíveis incluem: orientação, descoberta de oferta, conversão rápida,
demonstração de valor, inventário/catálogo, redução de risco, apoio à decisão,
prova, localidade/viabilidade, processo, educação e continuidade pós-ação.

**Papéis não são seções obrigatórias.** Podem ser combinados, fragmentados,
movidos ou incorporados à navegação, hero, mídia, prova e fechamento.

## 4.2 Matriz de ritmo, mídia e silhueta

Antes do JSX, desenhar a cadência macro com pelo menos estes eixos:

`density | mediaWeight | containment | contrast | interaction | proofLevel`

Exemplos de estados: `AIRY/DENSE`, `MEDIA_DOMINANT/TEXT_DOMINANT/BALANCED`,
`FULL_BLEED/CONTAINED/OVERLAPPED`, `QUIET/CONTRASTED`,
`STATIC/INTERACTIVE`.

A intenção não é alternar mecanicamente os estados. É impedir que a página seja
uma fila de regiões com o mesmo container, mesma largura, mesmo card, mesma
relação imagem/texto e o mesmo encerramento.

Três ou mais capítulos principais com combinação perceptiva praticamente
idêntica exigem justificativa explícita no brief. Se a silhueta continuar igual
a um vizinho depois de remover marca/copy/assets, a composição deve ser refeita.

### Papéis narrativos de mídia

Toda imagem dominante recebe uma função: `IDENTITY`, `PRODUCT`, `CRAFT`,
`PROCESS`, `PLACE`, `PROOF`, `CONTEXT`, `EDITORIAL` ou `CLOSING`.

Repetir “imagem retangular + texto ao lado” como tratamento universal não
satisfaz estratégia de mídia. A mesma landing pode combinar, quando fizer
sentido, imagem editorial singular, full bleed, recorte sobreposto, mosaico,
product shelf, mídia atravessando capítulos, galeria, prova visual junto da
claim e imagem física de localidade.

## 4.3 Referência auditada — FFIX (2026-09-22)

Fonte pública estudada: `https://ffix.com.br/` e rotas internas públicas
relacionadas a assistência, TV, aparelhos usados, proteção de tela e notebooks.

A referência foi absorvida como **gramática de decisão e composição**, nunca
como layout a copiar:

| Contexto observado | O que muda na arquitetura | Lição para 0WEB |
|---|---|---|
| Home multioferta | orçamento/configuração aparece cedo; catálogo, oficina real, usados, processo, diagnóstico, prova social e loja física recebem pesos diferentes | misturar descoberta, utilidade, prova e conversão em ritmos distintos |
| Serviço específico | explicação do problema e taxonomia do serviço ganham precedência | o conteúdo específico deve alterar os primeiros capítulos da página |
| Estoque de usados | vitrine/availability domina; depois entram busca, segurança da compra, inspeção e troca/venda | intenção de produto exige jornada de produto, não skeleton de serviço |
| Reparo de TV | a dúvida “consertar ou trocar?” vira apoio à decisão | transformar objeção importante em módulo decisório no ponto certo |
| Oferta com garantia forte | a garantia sobe na hierarquia | diferenciais reais podem reordenar a composição |

Padrões de mídia absorvidos: oficina real como prova de ofício, foto de produto
como centro da vitrine, loja física como prova de localidade e mídia de CTA
apenas quando fortalece o fechamento. A regra resultante é **mídia por função**,
não “uma foto por seção”.

Quando uma referência externa for fornecida pelo usuário, registrar no brief:
`referenceUrl`, `reviewedRoutes`, `rolePatterns`, `mediaPatterns`,
`rhythmPatterns`, `interactionPatterns`, `decisionPatterns`,
`transferablePrinciples`, `doNotCopy` e `projectSpecificTranslation`.

Se o agente apenas reproduzir a ordem, silhueta ou composição distintiva da
referência, isso é `REFERENCE_USED_AS_TEMPLATE` e reprova a direção.

## 4.4 Truth/freshness pass — obrigatório antes de fechar a narrativa

Depois da matriz de papéis e antes do wireframe final, revisar:

1. **Escopo** — o que o negócio faz, não faz e faz somente sob condição;
2. **Volatilidade** — quais claims podem envelhecer;
3. **Consequência visual** — onde limite, disponibilidade ou incerteza precisam
   aparecer para ajudar a decisão;
4. **Fallback** — o que a página mostra quando o dado atual não está disponível.

Registrar no brief:

`scopeTruthMatrix` · `freshnessMatrix` · `volatileClaims` ·
`staleFallbacks`.

Isso pode alterar a composição. Exemplo: inventário mutável pode pedir vitrine +
“consultar disponibilidade”; atendimento por região pode pedir coverage checker;
serviço com exclusões relevantes pode pedir comparação de escopo; orçamento
dependente de diagnóstico pode pedir fluxo de triagem em vez de preço falso.

Não transformar transparência em bloco padrão. A forma continua autoral.



## 4.5 Corpus de referências — seleção por modo de decisão

Além das quatro matrizes de referência, novos briefs devem consultar
`src/config/portfolio-reference-pattern-library.json` e, quando relevante, os
ledgers em `docs/research/PORTFOLIO_REFERENCE_CORPUS_*.md`.

Não selecionar referência por rótulo de segmento (“é assistência, então use
site de assistência”). Selecionar pelas necessidades reais:

- diagnóstico/incerteza;
- prova física;
- múltiplas unidades;
- serviço único;
- confiança na pessoa/fundador;
- planos/preço configurável;
- risco profissional/regulatório;
- demonstração de produto;
- múltiplas ofertas independentes.

Registrar no brief:

`referenceClusters | referenceUseClasses | interactionEvidence |
selectedInteractionSignatures | motionEvidence | rejectedReferencePatterns |
skillTranslation`

### REFERENCE_SIGNAL_MATRIX

`source | route | businessMode | visitorJob | compositionSignal |
mediaSignal | interactionSignal | proofSignal | localitySignal |
motionEvidence | useClass | transferablePrinciple | antiPattern | confidence`

### Regra anti-alucinação de motion

Sem observação visual/browser, não declarar que a referência usa parallax,
stagger, easing, clip reveal, sticky choreography ou qualquer efeito específico.
Pode-se registrar apenas `DERIVED_MOTION_CANDIDATE`, com implementação própria
e `prefers-reduced-motion`.

### Skill translation

Cada padrão selecionado precisa puxar competências correspondentes. Exemplos:

- diagnóstico/comparison → decision intelligence + CRO + funnel carryover;
- multi-location → entity research + local SEO + location UX;
- prova física → media ingestion + provenance;
- planos/configurador → truth/freshness + form/commerce state;
- product demo → frontend interaction + performance;
- motion → experience-design-max + reduced-motion + accessibility.

O objetivo é impedir que referências virem apenas “prints bonitos” sem alterar a
qualidade do processo de criação.

## 4.6 EXPERIENCE_ENGINE_MATRIX — motor dominante da experiência

Depois de selecionar referências e antes do wireframe final, todo projeto novo
deve declarar **qual lógica governa a experiência**. Isso existe para impedir o
anti-padrão “usar todas as boas práticas” e terminar novamente em uma landing
completa/genérica.

Campos obrigatórios:

`primaryEngine | counterpointEngine | visitorJob | decisiveUncertainty |
evidence | compositionConsequence | mediaAnchor | interactionLocus |
motionCandidate | mobileExpression | rejectedEngines | reason`

Motores disponíveis no corpus machine-readable:

- `PROBLEM_TO_DIAGNOSIS`;
- `CRAFT_AND_PHYSICAL_PROOF`;
- `LOCATION_AND_NETWORK`;
- `PRODUCT_OR_SERVICE_FINDER`;
- `PROCESS_AND_TRANSPARENCY`;
- `PLAN_OR_SCOPE_CONFIGURATION`;
- `FOUNDER_OR_SPECIALIST_TRUST`;
- `INVENTORY_OR_PRODUCT_BROWSING`;
- `URGENT_FAST_PATH`;
- `EDUCATION_AND_RISK_REDUCTION`.

### Regra primary + counterpoint

1. declarar **um** motor primário;
2. usar no máximo **um** contraponto forte quando houver razão decisória;
3. capacidades adicionais permanecem subordinadas;
4. o motor precisa alterar ordem narrativa, composição, mídia ou interação;
5. não escolher motor pelo rótulo do segmento;
6. se a página final continuar com a mesma silhueta/jornada de um vizinho, o
   campo declarado não vale como evidência.

Exemplos válidos são combinações de gramáticas, não presets:

- especialista técnico de alto risco:
  `FOUNDER_OR_SPECIALIST_TRUST + PROCESS_AND_TRANSPARENCY`;
- rede com produto compatível por veículo:
  `PRODUCT_OR_SERVICE_FINDER + LOCATION_AND_NETWORK`;
- assistência com laboratório forte:
  `CRAFT_AND_PHYSICAL_PROOF + PROBLEM_TO_DIAGNOSIS`;
- campanha para defeito específico:
  `URGENT_FAST_PATH + PROBLEM_TO_DIAGNOSIS`.

Falhas:

- `ENGINELESS_COMPLETE_SITE` — página contém tudo, mas nada governa;
- `ENGINE_STACKING` — três ou mais motores competem com o mesmo peso;
- `SEGMENT_ENGINE_DEFAULT` — escolha baseada só em “é oficina/assistência/etc.”;
- `ENGINE_DECORATIVE_ONLY` — motor existe no brief, mas não muda a página.

O ledger de pesquisa R2 está em
`docs/research/PORTFOLIO_REFERENCE_CORPUS_R2_2026-09-23.md`.

Ledgers adicionais:
- `docs/research/PORTFOLIO_REFERENCE_CORPUS_R3_2026-09-23.md` — interaction signatures;
- `docs/research/PORTFOLIO_REFERENCE_CORPUS_R4_2026-09-23.md` — facilities e consolidação operacional;
- `docs/research/PORTFOLIO_REFERENCE_CORPUS_R5_2026-09-24.md` — avaliação/diagnóstico → autorização explícita;
- `docs/research/PORTFOLIO_REFERENCE_CORPUS_R6_2026-09-24.md` — rotas locais e resolução de fontes sem novo engine.

Interaction signature não substitui experience engine. Ela resolve uma decisão
local dentro do motor dominante. Para facilities/multisserviços,
`MULTI_NEED_SCOPE_BUILDER` só entra quando o cliente realmente consegue
consolidar múltiplas necessidades em uma mesma avaliação/orçamento.

Quando avaliação/diagnóstico e execução são compromissos distintos,
`ASSESSMENT_TO_AUTHORIZATION` só entra se houver evidência de um ponto real de
aprovação antes do trabalho pago. A landing/funil não pode tratar pedido de
avaliação como consentimento automático para executar o serviço.





## 5. Tipografia e tokens do cliente

Os tokens globais existem para a plataforma. Dentro de um site de cliente,
crie escopo local (`data-client-theme`, classe raiz ou custom properties locais)
quando isso for necessário para preservar identidade.

Não forçar Space Grotesk/Inter. Fontes podem variar por cliente desde que sejam
licenciadas/permitidas, performáticas e possuam fallback adequado.

## 6. Imagens e mídia

Cada cliente tem diretório próprio. Priorizar materiais oficiais.

Quando não houver foto real suficiente, pode-se criar composição de marca,
ilustração ou fotografia conceitual que **não seja apresentada como prova
factual** do cliente. Não fabricar equipe, sede, cliente, obra executada,
resultado, antes/depois ou produto inexistente como se fossem reais.

Capas devem manter leitura em mobile e desktop, contraste suficiente e crop
coerente com a identidade do projeto.

## 7. Prova social

Depoimentos, avaliações, estrelas, prêmios, contadores, logos de clientes e
resultados publicados precisam de evidência. Conteúdo fictício para protótipo é
permitido somente se estiver explicitamente rotulado como exemplo/demonstração.

Prova social ausente não é motivo para inventar: usar processo, garantias reais,
escopo, materiais, FAQ, metodologia, fotos oficiais ou outra evidência legítima.

## 8. Motion

Todo projeto novo v2 precisa de override próprio em
`src/config/portfolio-motion-profiles.json`. Defaults por segmento são fallback
legado e ponto de inspiração, nunca direção final de um cliente novo.

Motion deve traduzir o negócio. Máximo usual: três signature moments, um
parallax, um stagger por viewport e um loop, sempre respeitando
`prefers-reduced-motion` e budgets de performance.

## 9. Anti-template gate humano + automático

Antes do PR:

1. rodar `check:portfolio-originality`;
2. comparar o novo projeto com seus três vizinhos mais próximos;
3. revisar hero, section order, components, style, copy, assets e identity;
4. registrar no creative brief quais decisões evitam semelhança.

Se a diferença depender principalmente de cor, logo ou troca de fotos, a
direção criativa ainda está incompleta.

## 10. WhatsApp e conversão

Todo cliente usa `clientKey`, funil individual e contato privado server-side.
Para novos clientes, a convenção canônica é:

```text
PORTFOLIO_WHATSAPP_<CLIENT_KEY_NORMALIZADO>
```

Ex.: `clientKey="sscons"` → `PORTFOLIO_WHATSAPP_SSCONS`.

Nenhum `wa.me`, telefone ou e-mail operacional entra no bundle público.

## 11. Definição de pronto

Novo projeto só pode ficar `published` quando:

- creative brief v2 estiver preenchido;
- componente não tiver marcador de scaffold pendente;
- identidade e assets forem próprios;
- motion override for próprio;
- funil e contato server-side estiverem configurados ou o estado operacional
  estiver explicitamente documentado;
- SEO, a11y, performance, privacidade, build e browser QA passarem;
- originalidade for revisada contra o portfólio real.


Ledger adicional: `docs/research/PORTFOLIO_REFERENCE_CORPUS_R7_2026-09-24.md` — profissões regulamentadas e limites de conteúdo/prova/formulário.


### PROFESSIONAL_COMPLIANCE_BOUNDARY_MATRIX

Para profissão regulamentada, registrar antes da composição:
`profession | jurisdiction | officialAuthority | officialSources | rulesVerifiedAt |
credentialDisplay | allowedProof | conditionalProof | forbiddenProof |
pricingTreatment | promotionalClaimLimits | testimonialPolicy | caseResultPolicy |
sensitiveDataBoundary | formFieldPolicy | contactHandoffPolicy |
requiredDisclosures | unresolvedQuestions | implementationNotes`.

Referência comercial não substitui fonte oficial. Regra de uma profissão não
pode ser transplantada para outra por analogia.
