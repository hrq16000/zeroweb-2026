# PORTFOLIO UNIQUE COMPOSITION STANDARD

Documento canônico e permanente. Vale para **todo** `/portfolio/:slug` criado a
partir desta data. Substitui qualquer interpretação de que existe um
"esqueleto visual do portfólio", um "modelo de landing" ou um conjunto fechado
de layouts a preencher.

> Regra de uma linha:
> **infraestrutura compartilhada = sim; composição visual compartilhada = não.**

---

## 1. Princípio canônico

Cada `/portfolio/:slug` é o site de um cliente diferente e deve ser concebido
visualmente do zero.

Teste permanente (**NO-BRAND TEST**): remova nome, logo, cores, textos e fotos.
Se a página A ainda for perceptivelmente diferente da página B, PASS. Se virar
a mesma página, FAIL — mesmo que cores, copy, fotos e animações difiram.

O teste se aplica a: primeira dobra, silhueta, geometria, distribuição de
conteúdo, ritmo, hierarquia, relação imagem/texto, provas, conversão,
movimento e encerramento.

## 2. Não existe esqueleto de portfólio

Proibido como processo de criação:

- `template → preencher dados → trocar cores → trocar foto → publicar`;
- `layoutFamily → escolher uma composição preexistente → preencher cliente`.

`layoutFamily`, `heroFamily` e afins continuam existindo **apenas como metadata
analítica** para comparação entre projetos. Não podem determinar a estrutura
final da página.

## 3. O que continua compartilhado (infraestrutura)

Rota `/portfolio/:slug`; `PortfolioStandardShell`; popup institucional 0WEB;
`PortfolioHostCredit`; funnel engine; destination resolver; lead
recoverability; analytics; provenance; contratos de SEO/schema; performance;
acessibilidade; safety responsiva; tokens e primitivas de motion;
reduced-motion; gates; segurança; admin; viewer/modal da galeria.

Infraestrutura **não** determina composição.

## 4. O que deixa de ser molde compartilhado

Header comum, barra superior comum, hero split "texto à esquerda + imagem à
direita", título gigante padrão, mesmos cards, mesma grade, mesma sequência de
provas, mesma posição das avaliações, mesmo bloco de endereço, FAQ sempre no
fim, CTA largo padrão, mesma alternância claro/escuro, mesmo encerramento,
mesma topologia de seções.

Componentes atômicos (botão, imagem, reveal, card primitivo) podem ser
reutilizados. A **composição** deles, não.

## 5. Blueprint muda de função

O Blueprint deixa de ser layout renderer e passa a ser **contrato de conteúdo e
capacidades**: entidade, fatos, serviços, provas, mídias, CTA, funil, SEO,
dados locais, capacidades de motion e regras de negócio.

O Blueprint **não** decide onde cada elemento aparece, qual grid, qual hero,
qual ordem nem qual geometria.

`PortfolioBlueprintRenderer` fica congelado como motor legado dos três pilotos
(`carecas-infotec`, `moreira-auto-mecanica`, `jkl-decor`). **Nenhum projeto
novo entra no registry do renderer.**

## 6. PROJECT COMPOSITION

Camada nova e autoral por projeto (`src/lib/portfolio-composition.ts` +
`PortfolioCompositionRoot`). A raiz de composição fornece só infraestrutura:
escopo de motion, tema do cliente, marcadores de auditoria, camada
institucional e CTA de funil. Ela **não** renderiza header, seções, grid nem
ordem. O JSX da página é autoral.

### CREATIVE COMPOSITION BRIEF (obrigatório antes de qualquer JSX)

`businessPersonality`, `creativeConcept`, `visualMetaphor`, `spatialLanguage`,
`heroConcept`, `navigationConcept`, `contentRhythm`, `mediaNarrative`,
`proofNarrative`, `conversionNarrative`, `motionNarrative`,
`signatureMoments`, `compositionFingerprint`.

Derivados de: empresa → mercado → público → provas → mídias disponíveis →
personalidade → objetivo comercial → contexto local → criatividade. Nunca
escolhidos de uma lista fechada.

## 7. Hero autoral

Não se assume headline à esquerda + imagem à direita + CTA abaixo + trust
strip. O hero nasce da ideia criativa do negócio e pode nem parecer uma hero
section. Não existe formato obrigatório.

## 8. Seções são conteúdo, não blocos obrigatórios

Serviços, provas, avaliações, endereço e FAQ são **conteúdos**. Podem aparecer
integrados ao hero, entre imagens, dentro de narrativa, ao lado de um serviço,
flutuando ou como rodapé editorial. A sequência
`hero → serviços → diferenciais → avaliações → endereço → FAQ → CTA` não é
obrigatória e, repetida, é reprovação.

## 9. DOM e topologia devem variar

Trocar classes CSS mantendo o mesmo DOM é skin swap = FAIL. O gate observa
quantidade e tipo de regiões, nesting, ordem, topologia de grid, full-width vs
contained, sobreposições, regiões sticky, densidade, fronteiras de seção,
razão imagem/texto, posicionamento de CTA e geometria do hero.

## 10. Composition fingerprint

Cada projeto declara: `heroGeometry`, `headerTreatment`, `sectionGraph`,
`contentOrder`, `gridTopology`, `mediaDistribution`, `backgroundRhythm`,
`proofPlacement`, `ctaDistribution`, `navigationPattern`, `motionSignature`,
`closingStructure`. Comparado contra os projetos recentes antes de READY.

## 11. Comparação perceptual

Metadata não basta. Antes de READY: screenshots em 390px e 1440px, comparação
com os projetos recentes e o NO-BRAND/GREYSCALE TEST do §1.

## 12. PROJECT_UNIQUENESS_GATE

Sucessor do `STRUCTURAL_ORIGINALITY_GATE`. Avalia separadamente:

`CONTENT_UNIQUENESS`, `STRUCTURAL_UNIQUENESS`, `COMPOSITION_UNIQUENESS`,
`HERO_UNIQUENESS`, `MEDIA_NARRATIVE_UNIQUENESS`, `MOTION_UNIQUENESS`,
`CONVERSION_PRESENTATION_UNIQUENESS`, `PERCEPTUAL_UNIQUENESS`.

Mudar texto e assets não aprova. O gate é **bloqueante** para projetos com
`compositionContract >= 1`; legados geram warning e servem de baseline.

Runner: `bun run check:portfolio-uniqueness`.

## 13. Skills como caixa de ferramentas

Editorial design, motion, storytelling, grid avançado, scroll interactions,
SVG, tipografia, galeria, bento, parallax, sticky storytelling,
microinterações, product showcase, SEO local, conversão, acessibilidade.
Escolher por projeto. Não repetir o mesmo subconjunto. Não usar efeito só para
demonstrar skill.

## 14. Assinatura do projeto

Cada projeto precisa de decisões compositivas reconhecíveis como dele —
navegação integrada ao ambiente, mídia que atravessa seções, composição
baseada no produto, linha gráfica do ofício, interação ligada ao serviço,
geometria da marca, narrativa espacial. A assinatura emerge do cliente.

## 15. Esta norma não é template

Nada aqui obriga "1 hero diferente + 3 signature moments + 1 sticky + 1
gallery". São regras de **originalidade**, não de composição.

## 16. Scaffold

O scaffold de novo projeto **não** gera landing visual pronta. Ele gera dados,
brief, slots/capacidades e estado incompleto (`COMPOSITION_BRIEF_REQUIRED`). A
composição só nasce depois do Creative Composition Brief.

## 17. READY / PUBLISH

READY exige: `ENTITY`, `ENRICHMENT`, `MEDIA`, `FUNNEL`,
`DESTINATION/RECOVERABILITY`, `SEO`, `MOTION`, `PROJECT_UNIQUENESS` e
`VISUAL_QA` = PASS. `PROJECT_UNIQUENESS` é bloqueante.

## 18. Legado

Careca's Infotec, Moreira Auto Mecânica e JKL Decor são **pilotos funcionais**,
não padrão estético. Não são ponto de partida visual e não serão redesenhados
em massa. Migração dos 90 projetos não acontece por esta norma.

## Referências

`docs/PORTFOLIO_PROJECT_LIFECYCLE.md` · `docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md` ·
`docs/PORTFOLIO_STRUCTURAL_ORIGINALITY_ADDENDUM.md` (histórico) ·
`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md` (contrato de conteúdo) ·
`scripts/portfolio-project-uniqueness.mjs`.
