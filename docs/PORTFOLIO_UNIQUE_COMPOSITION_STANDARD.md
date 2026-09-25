# PORTFOLIO UNIQUE COMPOSITION STANDARD

Documento canônico e permanente. Vale para **todo** `/portfolio/:slug`, atual ou futuro, e para todas as suas variantes e superfícies derivadas. Substitui qualquer interpretação de que existe um "esqueleto visual do portfólio", um "modelo de landing" ou um conjunto fechado de layouts a preencher.

> Regra de uma linha:
> **infraestrutura compartilhada = sim; composição visual compartilhada = não.**

A política de zero tolerância complementar está em `docs/PORTFOLIO_ZERO_GENERIC_STANDARD.md` e é obrigatória.

---

## 1. Princípio canônico

Cada `/portfolio/:slug` é o site de um cliente diferente e deve ser concebido visualmente do zero.

Teste permanente (**NO-BRAND TEST**): remova nome, logo, cores, textos e fotos. Se a página A ainda for perceptivelmente diferente da página B, PASS. Se virar a mesma página, FAIL — mesmo que cores, copy, fotos e animações difiram.

O teste se aplica a: primeira dobra, silhueta, geometria, distribuição de conteúdo, ritmo, hierarquia, relação imagem/texto, provas, conversão, movimento e encerramento.

## 2. Não existe esqueleto de portfólio

Proibido como processo de criação:

- `template → preencher dados → trocar cores → trocar foto → publicar`;
- `layoutFamily → escolher uma composição preexistente → preencher cliente`.

`layoutFamily`, `heroFamily` e afins continuam existindo **apenas como metadata analítica** para comparação entre projetos. Não podem determinar a estrutura final da página.

## 3. O que continua compartilhado (infraestrutura)

Rota `/portfolio/:slug`; popup institucional 0WEB; `PortfolioHostCredit`; funnel engine; destination resolver; lead recoverability; analytics; provenance; contratos de SEO/schema; performance; acessibilidade; safety responsiva; tokens e primitivas de motion; reduced-motion; gates; segurança; admin; viewer/modal da galeria.

Infraestrutura **não** determina composição. Qualquer shell compartilhado deve se limitar a infraestrutura e não pode injetar um mesmo bloco visual/narrativo em todos os clientes.

## 4. O que deixa de ser molde compartilhado

Header comum, barra superior comum, hero split "texto à esquerda + imagem à direita", título gigante padrão, mesmos cards, mesma grade, mesma sequência de provas, mesma posição das avaliações, mesmo bloco de endereço, FAQ sempre no fim, CTA largo padrão, mesma alternância claro/escuro, mesmo encerramento, mesma topologia de seções.

Componentes atômicos (botão, imagem, reveal, card primitivo) podem ser reutilizados. A **composição** deles, não.

## 5. Blueprint muda de função

O Blueprint deixa de ser layout renderer e passa a ser **contrato de conteúdo e capacidades**: entidade, fatos, serviços, provas, mídias, CTA, funil, SEO, dados locais, capacidades de motion e regras de negócio.

O Blueprint **não** decide onde cada elemento aparece, qual grid, qual hero, qual ordem nem qual geometria.

`PortfolioBlueprintRenderer` fica congelado como motor legado dos três pilotos (`carecas-infotec`, `moreira-auto-mecanica`, `jkl-decor`). **Nenhum projeto novo entra no registry do renderer.** Os pilotos não são referência estética.

## 6. PROJECT COMPOSITION

Camada nova e autoral por projeto (`src/lib/portfolio-composition.ts` + `PortfolioCompositionRoot`). A raiz de composição fornece só infraestrutura: escopo de motion, tema do cliente, marcadores de auditoria, camada institucional e CTA de funil. Ela **não** renderiza header, seções, grid nem ordem. O JSX da página é autoral.

### CREATIVE COMPOSITION BRIEF (obrigatório antes de qualquer JSX)

`businessPersonality`, `creativeConcept`, `visualMetaphor`, `spatialLanguage`, `heroConcept`, `navigationConcept`, `contentRhythm`, `mediaNarrative`, `proofNarrative`, `conversionNarrative`, `motionNarrative`, `signatureMoments`, `compositionFingerprint`.

Derivados de: empresa → mercado → público → provas → mídias disponíveis → personalidade → objetivo comercial → contexto local → criatividade. Nunca escolhidos de uma lista fechada.

Antes da direção final, devem ser consideradas pelo menos **três direções substancialmente divergentes**, conforme `PORTFOLIO_ZERO_GENERIC_STANDARD.md`. Se forem variações do mesmo esqueleto, devem ser rejeitadas.

## 7. Hero autoral

Não se assume headline à esquerda + imagem à direita + CTA abaixo + trust strip. O hero nasce da ideia criativa do negócio e pode nem parecer uma hero section. Não existe formato obrigatório.

## 8. Seções são conteúdo, não blocos obrigatórios

Serviços, provas, avaliações, endereço e FAQ são **conteúdos**. Podem aparecer integrados ao hero, entre imagens, dentro de narrativa, ao lado de um serviço, flutuando ou como rodapé editorial. A sequência `hero → serviços → diferenciais → avaliações → endereço → FAQ → CTA` não é obrigatória e, repetida, é reprovação.

## 9. DOM e topologia devem variar

Trocar classes CSS mantendo o mesmo DOM é skin swap = FAIL. O gate observa quantidade e tipo de regiões, nesting, ordem, topologia de grid, full-width vs contained, sobreposições, regiões sticky, densidade, fronteiras de seção, razão imagem/texto, posicionamento de CTA e geometria do hero.

## 10. Composition fingerprint

Cada projeto declara: `heroGeometry`, `headerTreatment`, `sectionGraph`, `contentOrder`, `gridTopology`, `mediaDistribution`, `backgroundRhythm`, `proofPlacement`, `ctaDistribution`, `navigationPattern`, `motionSignature`, `closingStructure`. Comparado contra os projetos recentes antes de READY e em toda manutenção material.

### 10.1 Experience-role fingerprint

O fingerprint passa a registrar também **como a página funciona**, não só como
ela se parece:

`roleGraph` · `mediaCadence` · `interactionLoci` ·
`decisionAidPlacement` · `densityRhythm` · `mobileCompositionStrategy`.

- `roleGraph`: papéis de decisão presentes, ordem relativa e quais foram
  fundidos no mesmo capítulo;
- `mediaCadence`: onde mídia domina, apoia, comprova ou desaparece para dar
  respiro;
- `interactionLoci`: pontos em que o visitante escolhe, compara, filtra,
  diagnostica, configura ou converte;
- `decisionAidPlacement`: onde incertezas importantes são resolvidas;
- `densityRhythm`: alternância deliberada de densidade, contraste e contenção;
- `mobileCompositionStrategy`: transformações reais de composição no mobile.

Dois projetos com cores, textos e assets distintos, mas com
`roleGraph + mediaCadence + interactionLoci` essencialmente equivalentes, devem
ser tratados como risco de `SAME_JOURNEY_DIFFERENT_COPY` e passar por revisão
autoral antes de READY.


## 11. Comparação perceptual

Metadata não basta. Antes de READY ou de considerar uma manutenção visual concluída: screenshots em 390px, 768px e 1440px, comparação com os projetos recentes e NO-BRAND/GREYSCALE TEST do §1.

## 12. PROJECT_UNIQUENESS_GATE

Sucessor do `STRUCTURAL_ORIGINALITY_GATE`. Avalia separadamente:

`CONTENT_UNIQUENESS`, `STRUCTURAL_UNIQUENESS`, `COMPOSITION_UNIQUENESS`, `HERO_UNIQUENESS`, `MEDIA_NARRATIVE_UNIQUENESS`, `MOTION_UNIQUENESS`, `CONVERSION_PRESENTATION_UNIQUENESS`, `PERCEPTUAL_UNIQUENESS`.

Mudar texto e assets não aprova. O gate é **bloqueante** para projetos com `compositionContract >= 1`. Projetos legados podem permanecer online durante a remediação, mas não são considerados visualmente concluídos e entram integralmente na norma quando houver manutenção material.

Runner: `bun run check:portfolio-uniqueness`.

## 13. Skills como caixa de ferramentas obrigatória

Editorial design, motion, storytelling, Grid/Flexbox avançado, scroll interactions, SVG, tipografia, galeria, bento, parallax, sticky storytelling, microinterações, product showcase, SEO local, conversão, acessibilidade, React/performance e browser QA são repertório a selecionar por projeto.

Antes de nova criação ou manutenção material, `0web-skill-discovery` é obrigatório e deve consultar catálogo local, fontes originais, LobeHub e AwesomeSkill Search quando houver ganho possível. O objetivo é o **máximo de competências relevantes e não redundantes**, nunca o máximo de efeitos ou pacotes executados cegamente.

Não repetir o mesmo subconjunto sem justificativa. Não usar efeito só para demonstrar skill.

## 14. Assinatura do projeto

Cada projeto precisa de decisões compositivas reconhecíveis como dele — navegação integrada ao ambiente, mídia que atravessa seções, composição baseada no produto, linha gráfica do ofício, interação ligada ao serviço, geometria da marca, narrativa espacial. A assinatura emerge do cliente.

`NO_SIGNATURE_MOMENT` é falha de qualidade.

## 15. Esta norma não é template

Nada aqui obriga "1 hero diferente + 3 signature moments + 1 sticky + 1 gallery". São regras de **originalidade**, não de composição.

## 16. Scaffold

O scaffold de novo projeto **não** gera landing visual pronta. Ele gera dados, brief, slots/capacidades e estado incompleto (`COMPOSITION_BRIEF_REQUIRED`). A composição só nasce depois do Creative Composition Brief, skill discovery e pesquisa de entidade/mercado.

## 17. READY / PUBLISH

READY exige: `ENTITY`, `ENRICHMENT`, `MEDIA`, `FUNNEL`, `DESTINATION/RECOVERABILITY`, `SEO`, `MOTION`, `PROJECT_UNIQUENESS` e `VISUAL_QA` = PASS. `PROJECT_UNIQUENESS` é bloqueante.

Também exige coerência entre landing, card/capa do catálogo, preview/modal/viewer, OG/social, mobile/tablet/desktop, reduced-motion e eventual promoção para domínio próprio. `PREVIEW_ASSET_DRIFT`, `CATALOG_COVER_GENERIC` ou `OG_DIRECTION_DRIFT` impedem considerar o projeto visualmente concluído.

## 18. Variantes e derivados

A composição autoral governa **toda a família visual do mesmo projeto**, incluindo:

- `/portfolio/<slug>`;
- card/capa em `/portfolio`;
- preview/modal/viewer/iframe;
- preview de editor/PR/Vercel;
- hero, thumbnail, social/OG e share media;
- funil visual integrado;
- mobile/tablet/desktop e reduced-motion;
- futuras variantes A/B ou campanhas;
- versão promovida para domínio próprio/alias.

Nenhuma dessas superfícies pode carregar uma direção genérica, antiga ou desconectada do projeto principal.

## 19. Legado sem anistia

Careca's Infotec, Moreira Auto Mecânica e JKL Decor continuam sendo **pilotos funcionais**, não padrão estético. Os demais projetos antigos também não recebem anistia visual: podem permanecer publicados durante a remediação para não interromper negócio, porém não podem ser chamados de visualmente concluídos só por serem legados.

A remediação deve convergir o catálogo inteiro para `PORTFOLIO_ZERO_GENERIC_STANDARD.md`, em ondas, priorizando `HIGH_SIMILARITY`, `ATTENTION`, capa/mídia fraca, hero genérico e ausência de assinatura. Qualquer manutenção material ativa integralmente esta norma.

## 20. Critério zero-generic

São bloqueadores conceituais: `GENERIC_COMPOSITION`, `SHARED_VISUAL_SKELETON`, `SKIN_SWAP`, `DEFAULT_SECTION_ORDER`, `REPEATED_GRID_TOPOLOGY`, `REPEATED_MOTION_GRAMMAR`, `NO_SIGNATURE_MOMENT`, `MEDIA_STARVATION`, `NO_BRAND_TEST_FAIL`, `HIGH_SIMILARITY_UNRESOLVED` e `VISUAL_QA_MISSING`.

Build verde não transforma esses estados em PASS.

## Referências

`docs/PORTFOLIO_ZERO_GENERIC_STANDARD.md` · `src/config/portfolio-zero-generic-policy.json` · `docs/PORTFOLIO_PROJECT_LIFECYCLE.md` · `docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md` · `docs/PORTFOLIO_STRUCTURAL_ORIGINALITY_ADDENDUM.md` (histórico) · `docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md` (contrato de conteúdo) · `scripts/portfolio-project-uniqueness.mjs`.

---

## Adendo 2026-09-25 — paridade de criação e anti-template executável

A origem do projeto não altera o contrato criativo. Novo portfolio criado por
painel/Managed, pipeline autônomo, scaffold, agente, Codex ou edição manual deve
chegar ao mesmo estado final: composição própria, derivada do negócio e
comparada contra o catálogo.

### A. Preset é workbench, não produto final

`PortfolioManagedView`, `PRESET_HERO` e o campo `preset` podem existir como
compatibilidade e preview rápido. Para projeto novo, eles não qualificam uma
superfície como `READY` ou `PUBLISHED`.

Antes de publicar, o projeto deve ser promovido para uma composição autoral em
`PortfolioCompositionRoot` ou para um futuro composition graph que descreva a
topologia específica daquele cliente. Um composition graph não pode ser uma
lista fechada de templates por segmento.

### B. Três direções realmente divergentes

Antes do JSX/composition graph final, o Creative Composition Brief registra pelo
menos três hipóteses materialmente diferentes. As hipóteses devem divergir em
eixo de leitura, geometria do hero/abertura, primeiros capítulos, topologia de
grid, distribuição de mídia, prova, conversão e gramática de motion. Três skins
do mesmo DOM contam como uma única hipótese.

A direção escolhida registra também quais padrões dos portfolios mais próximos
foram deliberadamente evitados.

### C. Prova tripla de originalidade

Nenhum único sinal é suficiente. `READY/PUBLISH` exige as três camadas:

1. **declared** — Creative Composition Brief + composition fingerprint completos;
2. **structural** — análise do código/DOM real pelo gate de originalidade, sem
   depender apenas do fingerprint autodeclarado;
3. **perceptual** — screenshots mobile/desktop + NO-BRAND TEST comparados com os
   vizinhos mais próximos.

Se a declaração disser que é diferente, mas código ou percepção mostrarem o
mesmo esqueleto, prevalece o resultado mais restritivo.

### D. Fail closed para projeto novo

Qualquer caminho de criação que não consiga produzir/evidenciar composição
autoral permanece em `draft/composing`. Velocidade de geração não autoriza
publicar `hero + cards + galeria + passos + sobre + FAQ` apenas com nova cor,
logo, texto ou foto.

### E. Legado protegido

Esta regra é forward-only para evitar redesign em massa sem gatilho. Projetos
publicados antes deste adendo permanecem disponíveis; ao sofrerem redesign
material, entram no contrato vigente. A dívida histórica continua mensurada e
pode ser reduzida por ondas.

### F. Composition graph Managed

O canal Managed implementa uma camada intermediária entre workbench e JSX
manual: `src/lib/portfolio-managed-composition.ts`. Ela gera três direções,
seleciona um graph por projeto e persiste a decisão no `source_snapshot`.

O graph não pode usar `segment -> preset`. A base inclui identidade textual,
localidade, serviços e disponibilidade real dos papéis editoriais. A assinatura
selecionada é comparada com as composições Managed existentes e deve ficar
abaixo do teto de similaridade definido pelo planner. O runtime final é
`PortfolioManagedAuthorialView`; `PortfolioManagedView` só usa preset quando
não há plano válido, situação que continua bloqueante para projeto novo marcado
com `authorial_composition.required=true`.

