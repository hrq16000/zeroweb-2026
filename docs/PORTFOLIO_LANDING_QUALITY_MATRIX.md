# PORTFOLIO LANDING QUALITY MATRIX

Camada de avaliação **editorial e visual** de um `/portfolio/:slug`.
Complementa — não substitui — `docs/PORTFOLIO_PROJECT_LIFECYCLE.md`,
`docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md` e
`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md` e
`docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md`.

> Projetos com `compositionContract >= 1` também respondem ao
> `PROJECT_UNIQUENESS_GATE` de
> `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`: fingerprint, comparação
> perceptual em 390/1440 e NO-BRAND/GREYSCALE test.

Não é um sistema paralelo: a matriz é uma etapa do lifecycle, executada
**depois da implementação e antes de `readiness` / `publish`**.

```text
research → evidence → media inventory → media plan → blueprint →
implementation → QUALITY MATRIX → fix gaps → readiness → publish
```

Registro por projeto: `docs/portfolio/quality-matrix/<slug>.json`.
Gate: `bun run check:portfolio-landing-quality` (também consumido pelo
readiness). Legado sem manifesto nunca é avaliado.

---

## 1. Dimensões

`ENTITY · CONTENT · MEDIA · VISUAL_COMPOSITION · ORIGINALITY · DISCOVERY ·
SEO · CONVERSION · PROOF · RESPONSIVENESS · PERFORMANCE · ACCESSIBILITY · QA`

Cada dimensão recebe um único status:

| Status | Significado |
|---|---|
| `PASS` | atende o padrão |
| `WARNING` | aceitável, com dívida registrada |
| `FAIL` | reprova o projeto |
| `NOT_APPLICABLE` | não se aplica a este negócio |

`FAIL` em qualquer dimensão reprova, independentemente do score.

## 2. Entity research matrix

Todo projeto novo deve **tentar** descobrir: Google Business/Maps, avaliações
Google, fotos Google, site oficial, Instagram, Facebook, TikTok, YouTube e
LinkedIn quando pertinentes, diretórios públicos, telefone, WhatsApp, endereço,
horário, serviços, produtos, categorias, identidade, fotos e demais evidências.

> A ausência de uma rede social **não** é falha. A ausência de pesquisa é falha.

Ledger obrigatório por alvo: `searched · found · resolved · verified ·
accessible · ingestable · usable`.

## 3. Search escalation ladder

**Nível 1 — identificadores conhecidos:** nome exato, aliases, telefone,
cidade, endereço, domínio, nome + categoria.

**Nível 2 — pesquisa expandida:** nome + Instagram/Facebook/avaliações/Google
Maps, telefone + rede, endereço + nome, `site:instagram.com`,
`site:facebook.com`, diretório relevante + nome.

**Nível 3 — providers:** Google Places, Maps, APIs oficiais, providers
autorizados (ex.: SerpApi server-side).

Nunca concluir "não existe" porque um provider não está conectado. Nesse caso:
resolver por pesquisa pública, guardar o `placeId`, registrar evidências e
marcar `ingestion = waiting_for_provider`.

## 4. Regra global de Google

Procurar sempre: `placeId · rating · reviewCount · address · phone · hours ·
photos · reviews · mapsUrl`. Com provider conectado, ingerir com política e
atribuição. Sem provider, resolver a entidade mesmo assim e registrar
`waiting_for_provider`.

## 5. Redes sociais

Resolver perfil por sinais combinados (nome, telefone, endereço, logo, cidade,
site, links vindos do Google). Homônimo por nome **não** resolve.
Registrar: `platform · handle · url · confidence · evidence · status`.

Perfil oficial confirmado alimenta a landing: identidade visual, produtos,
serviços, fotos, ambiente, trabalhos, linguagem, categorias, FAQ e
diferenciais — como conhecimento, e como mídia apenas conforme direitos.

## 6. Coverage visual matrix

Para cada bloco relevante da landing registrar:
`section · visualRole · mediaDecision · asset · provenance · quality · status`.

`mediaDecision ∈ REAL_BUSINESS_MEDIA · GOOGLE_MEDIA · OFFICIAL_SOCIAL_MEDIA ·
LICENSED_MEDIA · GENERATED_CONTEXTUAL_MEDIA · GRAPHIC_MEDIA ·
STRUCTURED_ICONOGRAPHY · EDITORIAL_TYPOGRAPHY · NO_MEDIA_NEEDED`.

A regra **não** é "toda seção precisa de foto". É: **toda seção relevante
precisa de uma solução visual deliberada** — tipografia, diagrama, ícones,
composição editorial, números, processo, motion, imagem ou ilustração. O que
não pode existir é a sensação de "faltou colocar alguma coisa aqui".

### 6.1 VISUAL_DEAD_ZONE

Avaliar em `390px`, `768px` e desktop. Sinais de problema:

- grande área vazia sem função compositiva;
- coluna enorme ocupada só por um ícone pequeno;
- background sem conteúdo;
- desequilíbrio excessivo entre colunas;
- seção que parece incompleta;
- card gigante com pouca informação;
- mídia ausente onde a composição claramente esperava mídia.

Vazio intencional é permitido — desde que tenha função compositiva clara.

### 6.2 Densidade e distribuição

Avaliar `visualDensity · sectionRhythm · mediaDistribution ·
compositionVariety`. Não concentrar todos os recursos visuais em uma seção
(hero + 6 blocos de texto + uma galeria = ritmo ruim). Não há número fixo de
imagens; há obrigação de alternância entre mídia, texto, cards, composição,
processo, prova e CTA, evitando longas sequências de blocos idênticos.

### 6.3 Media source mix

Registrar a distribuição: `real · external_verified · licensed · generated ·
graphic`. Evitar landing 100% stock ou 100% gerada quando existe material real
utilizável — e evitar o inverso, usar fotos reais ruins em toda posição só
porque são reais (ver lifecycle §7.1).

### 6.4 Experience-role / rhythm review

Para projetos novos e para redesign material, avaliar também:

`roleGraph · mediaCadence · interactionLoci · decisionAidPlacement ·
densityRhythm · mobileCompositionStrategy`.

Quando o usuário forneceu um site de referência, anexar ao brief a decomposição:

`ROLE_MATRIX · COMPOSITION_MATRIX · RHYTHM_MEDIA_MATRIX · ANTI_COPY_MATRIX`.

A revisão editorial deve responder:

- os papéis da página mudaram a arquitetura ou apenas preencheram o mesmo skeleton?
- oferta, prova, localidade, processo e objeções receberam peso conforme a decisão real?
- a mídia tem funções diferentes ou repete o mesmo card/crop?
- existe uma ajuda de decisão específica quando a incerteza do visitante pede isso?
- a página mantém variedade de densidade, contenção, contraste e relação mídia/texto?
- no mobile a composição foi redesenhada, não apenas empilhada?
- a referência externa foi traduzida em princípios, sem reprodução de silhueta?

`SAME_JOURNEY_DIFFERENT_COPY`, `MEDIA_RHYTHM_REUSED` ou
`REFERENCE_USED_AS_TEMPLATE` tornam `editorialPass = false`.


### 6.5 Experience engine review

Para projeto novo, revisar a `EXPERIENCE_ENGINE_MATRIX` declarada no creative
brief.

Perguntas obrigatórias:

- existe um `primaryEngine` sustentado por evidência do cliente/jornada?
- o contraponto, quando existe, realmente cria contraste útil?
- a página evita três ou mais motores disputando a mesma hierarquia?
- o motor alterou ao menos dois eixos entre ordem narrativa, composição, mídia,
  interação, CTA ou tradução mobile?
- o motor foi escolhido pela decisão real, e não pelo segmento?
- removendo logo/cor/copy, ainda é possível perceber a lógica dominante?

Falhas bloqueantes:

`ENGINELESS_COMPLETE_SITE` · `ENGINE_STACKING` ·
`SEGMENT_ENGINE_DEFAULT` · `ENGINE_DECORATIVE_ONLY`.

Essas falhas tornam `editorialPass = false`, mesmo quando todos os blocos
isoladamente parecem “bons”.


### 6.6 Interaction signature / consolidated-provider review

Quando o projeto usar uma interaction signature do corpus, a revisão editorial
deve confirmar que ela **muda a jornada ou preserva contexto útil**. Selector,
tabs ou wizard sem consequência real são decoração e devem ser removidos.

Perguntas obrigatórias:

- a assinatura resolve uma incerteza real do visitante?
- a escolha altera conteúdo, elegibilidade, modalidade, unidade, escopo,
  logística, preço factual ou contexto do funil?
- o estado escolhido sobrevive até o lead/handoff quando isso for relevante?
- no mobile a interação continua clara, acessível e sem duplicar passos?
- disponibilidade, cobertura, urgência e preço usados pela assinatura têm
  freshness/evidência quando forem mutáveis?

Para `CONSOLIDATED_PROVIDER_LED` / `MULTI_NEED_SCOPE_BUILDER`:

- “fornecedor único”, “um contrato” ou equivalente só pode ser usado quando o
  cliente realmente entrega as frentes declaradas sob a mesma coordenação;
- cada frente selecionável precisa ter evidência de escopo/capacidade;
- múltiplas necessidades devem chegar ao **mesmo briefing/funil individual**
  com contexto preservado;
- a seleção não pode prometer execução simultânea, disponibilidade, SLA ou preço
  antes da confirmação;
- prova física, processo, compliance e limites devem ficar próximos das claims
  que sustentam;
- CTA direto/WhatsApp não pode bypassar o funil 0WEB.

Falhas devem reutilizar blockers já existentes sempre que possível:
`SCOPE_OVERCLAIM`, `ENGINE_DECORATIVE_ONLY`,
`VOLATILE_CLAIM_WITHOUT_SOURCE`, `FAKE_LIVE_AVAILABILITY` ou
`FUNCTIONAL_DIVERSITY_MISSING`.

Não criar blocker novo apenas para renomear uma falha já coberta.


## 7. Hero matrix

Avaliado separadamente: `brandMatch · segmentMatch · visualImpact ·
premiumFeel · legibility · contrast · composition · mediaQuality ·
CTAVisibility · mobileCrop · desktopCrop · originality`.

`FAIL` se parecer banner fotografado, parecer placeholder, imagem muito
desfocada, texto disputando com o fundo ou mídia que não representa o segmento.

## 8. Cover matrix

`identityMatch · segmentMatch · smallCardReadability · contrast · focalPoint ·
crop · visualQuality · genericPenalty · duplicatePenalty` **+
`portfolioRecognition`**: "esse card é reconhecível entre dezenas de outros?"

## 9. Content depth

A landing responde: quem é? o que oferece? que necessidades resolve? para quem?
como funciona? por que considerar? quais evidências existem? como contratar?
quais dúvidas precisam de resposta? Não inventar conteúdo para completar a
matriz — lacuna sem fonte vira `WARNING` + `ownerRequired`.

## 10. Proof matrix


### 9.1 Scope truth / freshness matrix

A revisão editorial também verifica:

- claims de escopo não extrapolam o que a empresa realmente executa;
- limitações materiais estão visíveis antes da conversão quando afetam a decisão;
- preço, estoque, agenda, prazo, promoção e contagens variáveis têm fonte e
  `verifiedAt`;
- dado vencido não é apresentado como atual;
- fallback para informação volátil é honesto e funcional;
- “consultar disponibilidade” não substitui informação estável que já é conhecida;
- ausência de atualização não é mascarada com urgência artificial.

Falhas bloqueantes:

`SCOPE_OVERCLAIM` · `MATERIAL_LIMIT_HIDDEN` · `STALE_DECISION_DATA` ·
`FAKE_LIVE_AVAILABILITY` · `VOLATILE_CLAIM_WITHOUT_SOURCE`.


Pesquisar reviews Google, depoimentos reais, cases, fotos reais, certificações,
projetos, clientes e números comprováveis. Sem prova: `NOT_APPLICABLE` ou
`NOT_AVAILABLE`. **Nunca** gerar prova artificial.

## 11. Discovery / SEO / Conversion

**Discovery:** testar nome, alias, segmento, serviço, produto/equipamento,
problema, localização e consultas negativas. Índice não testado não publica.

**SEO:** `title · description · H1 · canonical · OG · alt · schema · entity
consistency · locality · sameAs · services · internal links · sitemap`. Dado
externo variável carrega `lastVerifiedAt`.

**Conversion:** CTA principal, CTA intermediário, `funnelType`, contexto de
WhatsApp server-side, tracking, acessibilidade mobile do CTA, mensagem coerente
e contexto de localização quando disponível.

## 12. Mobile quality

Não basta "sem overflow". Avaliar hierarquia, leitura, crop, cards, CTA, espaço
vazio, sticky, botão flutuante, menu, altura das seções e ritmo. Caber em 390px
não é qualidade.

## 13. Score (auditoria, não gamificação)

`Entity 10 · Content 10 · Media 15 · Visual 15 · Originality 10 · Discovery 10 ·
SEO 10 · Conversion 10 · Responsive/QA 10 = 100`.

O score existe para comparar auditorias no tempo. **Não maximizar número**: um
P0 reprova com qualquer nota.

## 14. P0 — FAIL imediato

- capa semanticamente errada;
- hero claramente inadequado;
- entidade não pesquisada;
- serviço inventado;
- review fictício;
- mídia gerada apresentada como real;
- funil ou CTA quebrado;
- busca que não indexa o projeto;
- overflow grave;
- asset importante ausente;
- seção claramente incompleta (dead zone).

## 15. TECHNICAL PASS ≠ EDITORIAL PASS

O gate separa:

- `technicalPass` — build, types, testes, rotas, gates, readiness técnico;
- `editorialPass` — entity, content, media, visual, originality, proof.

`READY` exige **os dois**. Build PASS nunca significa landing pronta.

## 16. Contrato do registro

```jsonc
{
  "slug": "<slug>",
  "matrixVersion": 1,
  "evaluatedAt": "YYYY-MM-DD",
  "technicalPass": true,
  "editorialPass": true,
  "score": { "total": 0, "byDimension": { "MEDIA": 0 } },
  "dimensions": { "ENTITY": { "status": "PASS", "notes": "" } },
  "hero": { "status": "PASS", "criteria": {} },
  "cover": { "status": "PASS", "criteria": {} },
  "coverage": [
    { "section": "", "visualRole": "", "mediaDecision": "", "asset": "",
      "provenance": "", "quality": "", "status": "PASS" }
  ],
  "deadZones": [],
  "mediaSourceMix": { "real": 1, "generated": 4, "graphic": 1 },
  "p0": [],
  "warnings": [],
  "ownerRequired": []
}
```

## 17. Owner required

Só pedir ao proprietário o que não pode ser resolvido por pesquisa, fontes
oficiais, redes, Google, mídia licenciada, geração contextual ou composição
gráfica. Não criar dependência desnecessária.

## 18. Gate de contato (dimensão CONVERSION)

```text
[ ] CTA principal aponta para o funil correto
[ ] CTAs intermediários preservam o contexto do projeto
[ ] telefone não possui link `tel:` por padrão
[ ] WhatsApp direto não bypassa o funil
[ ] mensagem final contém contexto coletado
[ ] nenhum componente genérico criou contato paralelo
```

Qualquer item reprovado é **P0** em CONVERSION. CTA genérico ("Entrar em
contato", "Fale conosco", "Chamar no WhatsApp") quando existe ação contextual
possível é WARNING mínimo.

## 19. Gate de mídia (dimensões MEDIA e VISUAL COMPOSITION)

```text
[ ] nenhuma imagem de referência fraca domina a página sem justificativa
[ ] fotos reais de melhor qualidade foram priorizadas
[ ] crops repetidos não simulam variedade
[ ] mídia gerada está corretamente classificada
[ ] capa representa o segmento
[ ] Hero utiliza o melhor asset disponível
[ ] material de placa/banner não está sendo usado apenas porque foi fornecido primeiro
```

Cada asset do `coverage` declara `purpose` entre `EVIDENCE_ONLY`,
`BRAND_REFERENCE`, `REAL_BUSINESS_MEDIA`, `EDITORIAL_MEDIA`, `COVER_MEDIA`,
`OG_MEDIA`, `GENERATED_CONTEXTUAL_MEDIA`. Asset `EVIDENCE_ONLY` ou
`BRAND_REFERENCE` em Hero, capa ou bloco visual dominante é P0 quando existe
alternativa melhor pela prioridade de `PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`
§22.2.

## 20. Avaliação editorial de encantamento

`editorialPass` só é `true` se a resposta for sim: *a página transmite um site
profissional, rico, autêntico e criado especificamente para aquele negócio?*
Avaliar impacto visual, riqueza de mídia, ritmo, composição, hierarquia,
profundidade, identidade, variedade, motion, coerência e percepção premium.
Passar nos testes não substitui esta avaliação.

## 21. Dimensões de experiência (adendo)

Definidas em `docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md`:

```text
CONTENT_DEPTH · VISUAL_RHYTHM · MEDIA_NARRATIVE · SECTION_VARIETY ·
SIGNATURE_MOMENTS · PROOF_DENSITY · CONVERSION_CONTINUITY
```

Mesmos estados das demais dimensões. `FAIL` reprova sempre. Ausência de
avaliação é **warning** enquanto o manifesto tiver `contractVersion < 3` e
**FAIL** a partir de `contractVersion >= 3`, evitando reprovar retroativamente
projetos já aprovados.

Complementos avaliados nessas dimensões: `experience.visualRhythm`,
`experience.signatureMoments[]`, `mediaNarrative` por asset, `qualityProfile` e
continuidade de conversão (CTA contextual em todos os pontos, sempre pelo funil
individual).

## 22. Dimensão de motion (adendo)

Definida em `docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md`:

```text
MOTION_DESIGN
```

Além da dimensão, `docs/portfolio/quality-matrix/<slug>.json` passa a conter o
bloco `motion` com `profile` (motion profile do projeto), `narrativeRoles`,
`gate` (MOTION_QUALITY_GATE, 13 itens) e `qualityProfile` de motion
(`motionIntensity`, `motionPurpose`, `interactionDensity`, `scrollExperience`,
`microinteractionQuality`, `reducedMotionCoverage`, `motionPerformance`).

Ausência ou checklist incompleta é **warning** com `contractVersion < 3` e
**FAIL** a partir de `contractVersion >= 3`. Nenhum projeto legado é migrado
por causa desta dimensão.
