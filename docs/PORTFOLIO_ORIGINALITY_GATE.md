# Gate de originalidade do portfólio

Complementa — não substitui — `docs/PORTFOLIO_CLIENT_STANDARD.md`,
`docs/PORTFOLIO_CONVERSION_NARRATIVE_STANDARD.md` e
`docs/PORTFOLIO_PROJECT_CONFORMANCE_GATE.md`. Nenhuma regra anterior foi removida.

## Princípio

**COMPLETE ≠ ORIGINAL.** O gate de conformidade verifica *presença* (logo, capa,
CTA, SEO, componente). Este gate verifica *exclusividade da composição final
percebida pelo visitante*. Um projeto pode ser `COMPLETE` e, ao mesmo tempo,
`ORIGINALITY_STATUS = CLONE`. As duas dimensões são independentes e coexistem.

## O que pode e o que não pode ser compartilhado

| Camada | Regra |
|---|---|
| **Shared infrastructure** | Pode e deve ser reutilizada: `PortfolioStandardShell`, pop-up comercial da 0WEB, `PortfolioCTAQuiz`, `PortfolioImage`, `LazySection`, primitivos de UI, helpers de SEO, analytics, tokens, acessibilidade. Excluída do fingerprint — reutilizar **não** penaliza. |
| **Brand identity** | Individual e inegociável: paleta, tipografia, logo, fotografia, voz. |
| **Page composition** | Não pode ser clone cosmético. Trocar cor, ícone, título, cidade ou foto **não** torna um layout idêntico em original. |
| **Cover** | Deve representar o projeto. Imagem social (`hero-og.jpg`) e logo não são capa. |
| **Logo** | Autêntica do cliente ou explicitamente marcada como pendente (`LOGO_PLACEHOLDER`). |
| **Fallback de vertical** | Pode existir tecnicamente, mas **não qualifica o projeto como autoral**: recebe `SHARED_FALLBACK`. |

## Fórmula

Contrato único: `scripts/portfolio-originality.mjs`.

```
score = 0.30·STRUCTURE_SIMILARITY
      + 0.25·SECTION_ORDER_SIMILARITY
      + 0.20·COMPONENT_SIMILARITY
      + 0.15·STYLE_SIMILARITY
      + 0.07·ASSET_PATTERN_SIMILARITY
      + 0.03·IDENTITY_SIMILARITY
```

Cada dimensão é um índice de Jaccard sobre conjuntos derivados por análise
estática do componente efetivamente renderizado:

- **STRUCTURE** — trigramas da sequência de tags de bloco (`section > div > h2 …`).
- **SECTION_ORDER** — bigramas do papel inferido de cada seção (hero, services, gallery, proof, faq, cta, footer…).
- **COMPONENT** — componentes próprios do projeto, com a infraestrutura compartilhada removida.
- **STYLE** — classes Tailwind **estruturais** (grid, flex, gap, aspect, max-w…), com toda classe de cor descartada.
- **ASSET_PATTERN** — nomes normalizados dos arquivos em `public/images/<slug>/`.
- **IDENTITY** — hexadecimais e ícones. Peso deliberadamente mínimo.

Além do score, dois hashes detectam duplicação quase exata:
`skeletonHash` (fonte sem strings, sem texto JSX, sem hex) e `structureHash`.

O cálculo é **determinístico**: os mesmos arquivos produzem sempre o mesmo resultado.
Custo: análise estática por regex, um parse por arquivo, sem renderizar páginas.

## Faixas e status

| Score | Status | Leitura |
|---|---|---|
| 0–20 | `ORIGINAL` | Fortemente distinto |
| 21–40 | `ACCEPTABLE` | Mesma família, personalizado |
| 41–60 | `ATTENTION` | Similaridade relevante |
| 61–80 | `HIGH_SIMILARITY` | Excessivamente semelhante |
| 81–100 | `CLONE` | Clone estrutural ou quase |
| — | `SHARED_FALLBACK` | Sem componente próprio: renderiza landing de vertical |

## Reason codes

`IDENTICAL_COMPONENT_STRUCTURE` · `NEAR_DUPLICATE_LAYOUT` · `COPY_ONLY_VARIATION` ·
`COLOR_ONLY_VARIATION` · `ICON_ONLY_VARIATION` · `SHARED_VERTICAL_FALLBACK` ·
`SAME_FAMILY` · `DISTINCT`

## Sinais secundários

Capa: `COVER_MISSING`, `COVER_IS_SOCIAL_IMAGE`, `COVER_IS_LOGO`, `COVER_SHARED_ASSET`,
`COVER_RATIO_MISMATCH`, `COVER_SEVERE_CROP`, `COVER_NO_FOCAL_POINT`.

Logo: `LOGO_MISSING`, `LOGO_PLACEHOLDER`, `LOGO_SHARED`, `LOGO_OUTSIDE_ASSETS_DIR`,
`LOGO_NO_CONTRAST_VARIANT`.

Aparecem no relatório e no admin; não pontuam a estrutura.

## Comandos

```bash
bun run check:portfolio-originality           # report-only, grava reports/ e a visão do admin
bun run check:portfolio-originality:enforce   # falha apenas em REGRESSÃO
bun run check:portfolio-originality:baseline  # regrava a baseline (mudança intencional)
```

Saídas: `reports/portfolio-originality.json`, `reports/portfolio-originality.md`
e `src/config/portfolio-originality.json` (consumida por `/app/portfolio/originalidade`).
Não há tabela nova no banco.

## Política progressiva

- **REPORT_ONLY** (prebuild, hoje): o passivo histórico é reportado, nunca quebra build ou deploy.
- **NEW_OR_MODIFIED** (`--enforce`, CI de PR): falha quando uma alteração **piora** o estado em
  relação a `reports/portfolio-originality.baseline.json` — projeto novo entrando como
  `CLONE`/`HIGH_SIMILARITY`/`SHARED_FALLBACK`, projeto existente piorando de status, ou aumento
  no número de clones, fallbacks, logos placeholder, capas ausentes ou compartilhadas.

`existing debt != new regression`. Reduzir qualquer contador é melhoria e passa.
Regravar a baseline é um ato deliberado e versionado.

## Q3A — dimensões, copy e assets (atualização)

### Dimensões medidas

`STRUCTURE_SIMILARITY`, `SECTION_ORDER_SIMILARITY`, `COMPONENT_SIMILARITY`,
`STYLE_SIMILARITY`, `COPY_SIMILARITY`, `ASSET_PATTERN_SIMILARITY`,
`IDENTITY_SIMILARITY`. Nenhuma é condensada em score opaco: todas aparecem no
relatório, na matriz de pares e no admin.

Pesos atuais: estrutura 0.28 · ordem de seções 0.22 · componentes 0.18 ·
estilo 0.13 · copy 0.12 · padrão de assets 0.04 · identidade 0.03.

### Copy: boilerplate excluído

`COPY_BOILERPLATE` remove do cálculo editorial o popup da 0WEB, crédito de
hospedagem, avisos legais, rótulos técnicos e CTAs institucionais comuns.
Só a copy específica do cliente é comparada (trigramas de palavras).

### Infraestrutura compartilhada

`SHARED_INFRA` continua fora do fingerprint: shell, popup, quiz, botões,
imagem, seções lazy e primitivos de UI não geram similaridade.

### Assets percebidos

Marca, capa e imagem social são comparadas por hash de conteúdo entre clientes:

- `ASSET_EXPECTED_SHARED` — arte compartilhada por contrato (0WEB/system).
- `ASSET_SUSPICIOUS_SHARED` — capa ou imagem social repetida entre clientes.
- `ASSET_INVALID_CROSS_CLIENT` — logo de um cliente aparecendo em outro (bloqueante).

### Novos reason codes

`EXCESSIVE_COPY_SIMILARITY` e `VISUAL_COMPOSITION_CLONE`.

### Matriz de pares

`reports/portfolio-originality.md` traz o top 20 de pares com todas as
dimensões, e `reports/portfolio-originality.json` inclui `pairMatrix.nearest`
com os três vizinhos mais próximos de cada projeto.

## Q3B — aprendizados do cluster de comida

Cluster confirmado: `CLUSTER_01` (`beto-pasteis`, `dlara-pizzaria`,
`marmitaria-dom-diego`, `woodhouse-hamburgueres`), par 88,
`IDENTICAL_COMPONENT_STRUCTURE`, com STRUCTURE/ORDER/COMPONENT/STYLE/ASSET/
IDENTITY todos em 100 e COPY em 0.

Leituras confirmadas em duas rodadas:

- **Copy diferente não salva página clonada.** COPY_SIMILARITY 0 e ainda assim
  score 88: as dimensões estruturais dominam o clone percebido.
- **O que mais move o número** é, nesta ordem: esqueleto de blocos, ordem das
  seções, conjunto de componentes próprios e vocabulário de classes.
- **Trocar cor, capa ou logo não dissolve cluster.** Só muda IDENTITY, peso 0.03.
- **O que dissolveu bem** (brechós e comida): mudar o eixo de leitura (coluna
  lateral, disco central, imagem sangrada, caderno), trocar o elemento que
  apresenta a oferta (lista com fio pontilhado, colunas divididas, lista
  numerada, blocos em escada) e variar a posição do CTA na narrativa.
- **Segmento não é estilo.** Quatro negócios de comida receberam registros
  distintos: balcão de bairro, forno noturno, caderno de cozinha e casa
  noturna urbana.

## Q3C — núcleo técnico/industrial

Núcleo confirmado sem cluster formal: quatro projetos com pares 78/78/75/75 e
`IDENTICAL_COMPONENT_STRUCTURE` / `VISUAL_COMPOSITION_CLONE` —
`eisenfer-tubos-acos`, `eletro-solucoes-eficazes`, `eletrovale-eletromecanica`
e `jkl-marcenaria`. Dimensões causadoras: STRUCTURE 84–100, SECTION_ORDER 100,
COMPONENT 83–100, STYLE 91–96. COPY, ASSET e IDENTITY já eram baixos.

Registros aplicados (linguagens novas, sem repetir Q3A/Q3B):

- `eisenfer-tubos-acos` — tabela de estoque siderúrgico: linhas técnicas com
  código, faixa letterbox de imagem e aplicações em `dl` numerada.
- `eletro-solucoes-eficazes` — quadro de disjuntores em fundo claro: hero
  centrado, serviços como circuitos em trilho, etapas em faixa contínua.
- `eletrovale-eletromecanica` — ordem de serviço: ficha fixa lateral com CTA
  persistente e laudo rolando à direita, em cinza-bancada.
- `jkl-marcenaria` — prancha cotada: réguas tracejadas, ambientes com código
  A-01..A-04 e imagem única em faixa vertical.

Resultado: HIGH_SIMILARITY 21 → 14, MAX_PAIR 78 → 76, clones e clusters seguem
em 0. Os quatro caíram para 45–50 (`ATTENTION`, `SAME_FAMILY`) e
`aguia-sul-sinalizacao` caiu de 73 para 59 por efeito indireto.

Aprendizado adicional: quando SECTION_ORDER está em 100 entre vários projetos,
o ganho maior vem de mudar o **eixo do layout** (coluna fixa, tabela, painel)
antes de mexer em cor ou tipografia.

## Q3D — revisão perceptual e encerramento da frente

### Par máximo revisado

`espaco-cih-luh` × `salao-da-marcia`, score 76, `VISUAL_COMPOSITION_CLONE`.
Dimensões: STRUCTURE 100 · SECTION_ORDER 100 · COMPONENT 70 · STYLE 97,3 ·
COPY 0 · ASSET 0 · IDENTITY 12,5.

`PERCEPTUAL_CLONE = YES`. Em 390 e 1440 as duas páginas tinham o mesmo cabeçalho,
o mesmo hero dividido texto/imagem, o mesmo rótulo "Menu de cuidados", os mesmos
quatro cards numerados com ícone e a mesma seção de experiência com imagem à
esquerda. Só a paleta mudava.

Ação: dois registros novos, sem tocar em texto, endereço, SEO, funil, CTA,
WhatsApp, capa ou imagem social.

- `espaco-cih-luh` — coluna de marca fixa à esquerda e cartela de esmaltes:
  cada cuidado é uma faixa horizontal com amostra de cor; oferta em bilhete
  tracejado.
- `salao-da-marcia` — caderno editorial centrado: capa com título ao centro,
  serviços em colunas com filete, citação editorial e mosaico de imagens.

Resultado: par 76 → 43/47 (`ATTENTION`, `SAME_FAMILY`); MAX_PAIR global
76 → 66; HIGH_SIMILARITY 14 → 12; CLONES 0; GROUPS 0.

### Reclassificação dos casos restantes de alta semelhança

| Projeto | Score | Vizinho | Estado |
|---|---|---|---|
| galileu-locacao-brinquedos | 66 | lj-cleaning | `REQUIRES_REDESIGN` |
| lj-cleaning | 66 | galileu-locacao-brinquedos | `REQUIRES_REDESIGN` |
| lucas-arruma-maquina-lavar | 66 | lk-alvenaria | `REQUIRES_REDESIGN` |
| no-brilho-higienizacao | 65 | lucas-arruma-maquina-lavar | `REQUIRES_REDESIGN` |
| lk-alvenaria | 66 | lucas-arruma-maquina-lavar | `ACCEPTED_SHARED_FAMILY` |
| ag-electrical-services | 64 | lk-alvenaria | `ACCEPTED_SHARED_FAMILY` |
| diego-montador-moveis | 63 | lucas-arruma-maquina-lavar | `ACCEPTED_SHARED_FAMILY` |
| miro-tech | 61 | lj-cleaning | `ACCEPTED_SHARED_FAMILY` |
| lolipa-arte-em-festas | 63 | premium-envelopamentos | `ACCEPTED_SHARED_FAMILY` |
| premium-envelopamentos | 63 | lolipa-arte-em-festas | `ACCEPTED_SHARED_FAMILY` |
| artesanatos-darleia-oliveira | 63 | thays-camilla | `FALSE_POSITIVE` |
| thays-camilla | 63 | artesanatos-darleia-oliveira | `FALSE_POSITIVE` |

`NEEDS_HUMAN_REVIEW`: nenhum. Todos os 12 têm interpretação registrada.

`FALSE_POSITIVE` no par de artesanato: ASSET_PATTERN 100 vem apenas da convenção
de nomes de arquivo (`capa`, `og`), não de arte compartilhada; tipografia,
paleta e ritmo editorial são distintos na revisão em 1440.

`ACCEPTED_SHARED_FAMILY` = engenharia compartilhada legítima (shell, quiz,
popup, primitivos) somada a marca, copy, fotos e paleta próprias, com leitura
distinguível por uma pessoa.

### Encerramento

`CLONES = 0` · `GROUPS = 0` · `MAX_PAIR = 66` · nenhum caso sem interpretação.

**A frente de redesign por originalidade fica ENCERRADA.** Os quatro
`REQUIRES_REDESIGN` seguem para a fila de qualidade — dois deles
(`lucas-arruma-maquina-lavar`, `no-brilho-higienizacao`) são exatamente os
`NEEDS_UPGRADE` restantes. Score de similaridade deixa de ser meta: novos
projetos continuam medidos pelo gate em modo report-only e pela baseline.
