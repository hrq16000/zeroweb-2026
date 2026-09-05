# Rodada 10 — Fonte de verdade das capas do /portfolio

Data: 2026-09-05 · Escopo: **somente inventário/status de capas**.

CODE_CHANGED = YES (governança) · PUBLIC_VISUAL_CHANGED = NO · PROJECT_LAYOUT_CHANGED = NO ·
SEO_CHANGED = NO · FUNNEL_CHANGED = NO · ROUTES_CHANGED = NO · DATABASE_CHANGED = NO ·
COVER_PUBLISHED = 0 · Fórmula/scores/limiares de originalidade inalterados.

## 1. Causa raiz da inconsistência

Existiam três contagens divergentes, nenhuma canônica:

1. **`missingCovers: 26`** no gate de originalidade media apenas "projeto sem campo `image`
   no catálogo". Não distinguia capa editorial de imagem social/OG, hero, logo ou placeholder,
   e não sabia se a imagem existia por decisão humana.
2. **`portfolio-visual-review.json`** (68 entradas, 33 `APPROVED` / 35 `NEEDS_REVIEW`) era o
   julgamento humano real, mas não era lido por nenhum gate.
3. **`scripts/report-portfolio-cover-inventory.mjs`** dizia usar a revisão humana, porém só
   listava linhas com `coverMaterial = HAS_SAFE_REAL_MATERIAL` — ou seja, reportava candidatos,
   nunca o inventário dos 68.

Resultado: 26 × 35 × "candidatos" eram números incomparáveis, e nada garantia que uma imagem
social contada como capa fosse realmente uma capa.

## 2. Correção

Contrato único em `src/lib/portfolio-cover-status.mjs`, materializado em
`src/config/portfolio-cover-status.json`, documentado em
`docs/PORTFOLIO_COVER_STATUS_CONTRACT.md`. `VALID` exige aprovação humana + arquivo existente +
asset editorial (nem OG, nem logo). Gate de originalidade, inventário, admin e testes passaram
a consumir esse mesmo contrato. Nenhum banco novo, nenhum inventário manual paralelo.

## 3. Inventário canônico (68 projetos)

| Status | Quantidade |
|---|---|
| VALID | 30 |
| NEEDS_CROP | 4 |
| CONTACT_OR_PII | 8 |
| PROMOTIONAL_MATERIAL | 2 |
| LOGO_ONLY | 10 |
| NO_REAL_ASSET | 14 |
| UNCERTAIN_ORIGIN | 0 |

Total 68 · válidas 30 · pendentes 38 · soma dos reason codes = pendentes (verificado em teste).

### VALID (30)

- `acai-total-araucaria` — aprovada em revisão humana
- `ag-electrical-services` — aprovada em revisão humana
- `angel-mix-brecho` — aprovada em revisão humana
- `assistencia-microondas-santos` — aprovada em revisão humana
- `beto-pasteis` — aprovada em revisão humana
- `brecho-sao-francisco` — aprovada em revisão humana
- `confeitaria-chyrley` — aprovada em revisão humana
- `diego-montador-moveis` — aprovada em revisão humana
- `dlara-pizzaria` — aprovada em revisão humana
- `dyzpromo` — aprovada em revisão humana
- `eletrovale-eletromecanica` — aprovada em revisão humana
- `galileu-locacao-brinquedos` — aprovada em revisão humana
- `heloa-gas` — aprovada em revisão humana
- `jkl-marcenaria` — aprovada em revisão humana
- `lj-cleaning` — aprovada em revisão humana
- `lolipa-arte-em-festas` — aprovada em revisão humana
- `lucas-arruma-maquina-lavar` — aprovada em revisão humana
- `manu-pasteis` — aprovada em revisão humana
- `marmitaria-dom-diego` — aprovada em revisão humana
- `no-brilho-higienizacao` — aprovada em revisão humana
- `paraiso-do-hot-dog` — aprovada em revisão humana
- `premium-envelopamentos` — aprovada em revisão humana
- `reuse-house-brecho` — aprovada em revisão humana
- `rj-servicos-drywall` — aprovada em revisão humana
- `rm-fretes` — aprovada em revisão humana
- `santos-montador-de-moveis` — aprovada em revisão humana
- `sos-presentes-cosmeticos` — aprovada em revisão humana
- `toquinho-de-gente-brecho` — aprovada em revisão humana
- `vila-da-capivara` — aprovada em revisão humana
- `woodhouse-hamburgueres` — aprovada em revisão humana

### LOGO_ONLY (10)

- `aguia-sul-sinalizacao` — Só existe marca/logo do cliente.
- `bh-barreiro-marmitas` — Só existe marca/logo do cliente.
- `guaratuba-atelie-presentes` — Só existe marca/logo do cliente.
- `guaratuba-oficina-nautica` — Só existe marca/logo do cliente.
- `guaratuba-reparos-residenciais` — Só existe marca/logo do cliente.
- `guaratuba-sabores-da-baia` — Só existe marca/logo do cliente.
- `marido-de-aluguel` — Só existe marca/logo do cliente.
- `mirassol-conserta-celular` — Só existe marca/logo do cliente.
- `mirassol-delicias-caseiras` — Só existe marca/logo do cliente.
- `uberlandia-eletrica-residencial` — Só existe marca/logo do cliente.

### NO_REAL_ASSET (14)

- `almeida-torres` — Sem material real adequado para capa editorial.
- `casa-nativa` — Sem material real adequado para capa editorial.
- `clinica-integrada` — Sem material real adequado para capa editorial.
- `denise-gomes-psicologa` — Sem material real adequado para capa editorial.
- `emporio-lelecute` — Não há fotografia ou material real apropriado.
- `hbk-iluminacao-led` — Sem material real adequado para capa editorial.
- `jc-revestimentos` — Sem material real adequado para capa editorial.
- `liz-moraes-nail-designer` — Não há fotografia ou material real apropriado.
- `lk-alvenaria` — Não há fotografia ou material real apropriado.
- `miro-tech` — Não há fotografia ou material real apropriado.
- `r_beauty` — Sem material real adequado para capa editorial.
- `raphael-construcoes` — Sem material real adequado para capa editorial.
- `salao-da-marcia` — Não há fotografia ou material real apropriado.
- `ton-e-cor` — Sem material real adequado para capa editorial.

### NEEDS_CROP (4)

- `artesanatos-darleia-oliveira` — Asset aprovado é imagem social (OG); precisa de recorte editorial de card.
- `eisenfer-tubos-acos` — Material real e seguro, mas enquadramento não aprovado.
- `refrigeracao-maresia` — Asset aprovado é imagem social (OG); precisa de recorte editorial de card.
- `thays-camilla` — Asset aprovado é imagem social (OG); precisa de recorte editorial de card.

### CONTACT_OR_PII (8)

- `confeitaria-sabor-da-realeza` — Material exibe contato ou endereço.
- `ecommerce-on` — Material exibe contato ou endereço.
- `eletro-solucoes-eficazes` — Material exibe contato ou endereço.
- `fernanda-amaral-drywall` — Material exibe contato ou endereço.
- `mary-diarista` — Material exibe contato ou endereço.
- `mp-festas-eventos` — Material exibe contato ou endereço.
- `paulo-mestre-de-obras` — Material exibe contato ou endereço.
- `studio-de-cilios` — Material exibe contato ou endereço.

### PROMOTIONAL_MATERIAL (2)

- `espaco-cih-luh` — Material é peça promocional com preço/campanha.
- `renata-beauty` — Material é peça promocional com preço/campanha.

## 4. Reconciliação com a Rodada 9

- Rodada 9 auditou 38 entradas, resolveu 3 (Paraíso do Hot Dog, RM Fretes, Heloá Gás) e deixou
  35 pendentes segundo a revisão humana. As três resolvidas aparecem como `VALID` (teste
  automatizado cobre isso).
- Diferença 35 → 38: três projetos antes contados como aprovados usavam **imagem social OG**
  como capa e foram reclassificados como `NEEDS_CROP`: `thays-camilla`,
  `artesanatos-darleia-oliveira`, `refrigeracao-maresia`.

### Falsos válidos (contados como capa, sem capa editorial aprovada)

Os 3 acima, mais os 24 projetos que possuem `image` no catálogo mas continuam pendentes na
revisão humana: `aguia-sul-sinalizacao`, `almeida-torres`, `casa-nativa`, `clinica-integrada`,
`denise-gomes-psicologa`, `ecommerce-on`, `eisenfer-tubos-acos`, `eletro-solucoes-eficazes`,
`emporio-lelecute`, `espaco-cih-luh`, `hbk-iluminacao-led`, `jc-revestimentos`, `lk-alvenaria`,
`marido-de-aluguel`, `mary-diarista`, `mp-festas-eventos`, `paulo-mestre-de-obras`, `r_beauty`,
`raphael-construcoes`, `refrigeracao-maresia`, `renata-beauty`, `salao-da-marcia`,
`studio-de-cilios`, `ton-e-cor`.

### Falsos ausentes (contados como "sem capa", mas com capa válida)

12 projetos sem campo `image` no catálogo que têm capa aprovada e existente:
`angel-mix-brecho`, `assistencia-microondas-santos`, `beto-pasteis`, `brecho-sao-francisco`,
`dlara-pizzaria`, `lolipa-arte-em-festas`, `manu-pasteis`, `marmitaria-dom-diego`,
`premium-envelopamentos`, `reuse-house-brecho`, `toquinho-de-gente-brecho`,
`woodhouse-hamburgueres`.

Nenhum asset seguro novo foi descoberto nesta rodada (`SAFE_ASSET_DISCOVERED = 0`) e nenhuma
capa foi publicada.

## 5. Arquivos

- `src/lib/portfolio-cover-status.mjs` (novo) — contrato canônico.
- `scripts/build-portfolio-cover-status.mjs` (novo) — gerador + modo `--check`.
- `src/config/portfolio-cover-status.json` (gerado).
- `scripts/report-portfolio-cover-inventory.mjs` — reescrito para inventário integral.
- `scripts/portfolio-originality.mjs` / `scripts/check-portfolio-originality.mjs` — expõem
  `coverValid` / `coverPending` e `canonicalCoverStatus`; score e clusters intactos.
- `src/routes/_authenticated/app.portfolio.originalidade.tsx` — bloco compacto "Capas".
- `tests/portfolio/cover-status.test.ts` (novo) — 13 casos.
- `docs/PORTFOLIO_COVER_STATUS_CONTRACT.md` (novo).

## 6. Inventário completo

| Slug | Cliente | Status | Asset | Motivo |
|---|---|---|---|---|
| `acai-total-araucaria` | Açaí Total | VALID | `public/images/acai-total-araucaria/acai.webp` | — |
| `ag-electrical-services` | A&G Electrical Services | VALID | `public/images/ag-electrical-services/laserway-2.webp` | — |
| `aguia-sul-sinalizacao` | Águia Sul Sinalização | LOGO_ONLY | `/images/aguia-sul-sinalizacao/logo.webp` | Só existe marca/logo do cliente. |
| `almeida-torres` | Almeida Torres Advocacia | NO_REAL_ASSET | `/images/almeida-torres/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `angel-mix-brecho` | Angel Mix Brechó | VALID | `public/images/angel-mix-brecho/capa.png` | — |
| `artesanatos-darleia-oliveira` | Artesanatos Darléia Oliveira | NEEDS_CROP | `public/images/artesanatos-darleia-oliveira/hero-og.png` | Asset aprovado é imagem social (OG); precisa de recorte editorial de card. |
| `assistencia-microondas-santos` | Assistência Técnica Microondas Santos | VALID | `public/images/assistencia-microondas-santos/hero.png` | — |
| `beto-pasteis` | Beto Pastéis | VALID | `public/images/beto-pasteis/capa.png` | — |
| `bh-barreiro-marmitas` | Marmitas do Barreiro | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `brecho-sao-francisco` | Brechó São Francisco | VALID | `public/images/brecho-sao-francisco/capa.png` | — |
| `casa-nativa` | Casa Nativa Bistrô | NO_REAL_ASSET | `/images/casa-nativa/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `clinica-integrada` | Clínica Integrada de Saúde | NO_REAL_ASSET | `/images/clinica-integrada/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `confeitaria-chyrley` | Chyrley Doces & Festas | VALID | `public/images/confeitaria-chyrley/bolos.webp` | — |
| `confeitaria-sabor-da-realeza` | Confeitaria Sabor da Realeza | CONTACT_OR_PII | — | Material exibe contato ou endereço. |
| `denise-gomes-psicologa` | Denise Gomes · Psicóloga | NO_REAL_ASSET | `/images/denise-gomes-psicologa/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `diego-montador-moveis` | Diego Montador de Móveis | VALID | `public/images/diego-montador-moveis/capa.webp` | — |
| `dlara-pizzaria` | D’Lara Pizzaria, Esfiharia e Hamburgueria | VALID | `public/images/dlara-pizzaria/capa.png` | — |
| `dyzpromo` | D.Y.Z Promo | VALID | `public/images/dyzpromo/faixa-equipe.jpeg` | — |
| `ecommerce-on` | Ecommerce On | CONTACT_OR_PII | `/images/ecommerce-on/servicos.webp` | Material exibe contato ou endereço. |
| `eisenfer-tubos-acos` | Eisenfer Tubos e Aços | NEEDS_CROP | `/images/eisenfer-tubos-acos/telhas.webp` | Material real e seguro, mas enquadramento não aprovado. |
| `eletro-solucoes-eficazes` | Eletro Soluções Eficazes | CONTACT_OR_PII | `/images/eletro-solucoes-eficazes/servicos.webp` | Material exibe contato ou endereço. |
| `eletrovale-eletromecanica` | Eletrovale Eletromecânica | VALID | `public/images/eletrovale-eletromecanica/equipamentos.webp` | — |
| `emporio-lelecute` | Empório LeleCute | NO_REAL_ASSET | `/images/emporio-lelecute/capa.webp` | Não há fotografia ou material real apropriado. |
| `espaco-cih-luh` | Espaço CIH & LUH | PROMOTIONAL_MATERIAL | `/images/espaco-cih-luh/promocao.webp` | Material é peça promocional com preço/campanha. |
| `fernanda-amaral-drywall` | Fernanda & Amaral — Instalação de Drywall | CONTACT_OR_PII | — | Material exibe contato ou endereço. |
| `galileu-locacao-brinquedos` | Galileu Locação de Brinquedos | VALID | `public/images/galileu-locacao-brinquedos/vitrine.png` | — |
| `guaratuba-atelie-presentes` | Ateliê Encanto da Baía | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `guaratuba-oficina-nautica` | Oficina Náutica Guaratuba | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `guaratuba-reparos-residenciais` | Reparos do Litoral | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `guaratuba-sabores-da-baia` | Sabores da Baía | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `hbk-iluminacao-led` | HBK Iluminação LED Atacadão | NO_REAL_ASSET | `/images/hbk-iluminacao-led/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `heloa-gas` | Heloá Gás | VALID | `public/images/heloa-gas/hero.jpg` | — |
| `jc-revestimentos` | JC Revestimentos | NO_REAL_ASSET | `/images/jc-revestimentos/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `jkl-marcenaria` | JKL Marcenaria | VALID | `public/images/jkl-marcenaria/cozinha.webp` | — |
| `liz-moraes-nail-designer` | Liz Moraes Nail Designer | NO_REAL_ASSET | — | Não há fotografia ou material real apropriado. |
| `lj-cleaning` | L&J Cleaning | VALID | `public/images/lj-cleaning/vitrine.png` | — |
| `lk-alvenaria` | LK Alvenaria | NO_REAL_ASSET | `/images/lk-alvenaria/portfolio.webp` | Não há fotografia ou material real apropriado. |
| `lolipa-arte-em-festas` | Lolipa Arte em Festas Decor | VALID | `public/images/lolipa-arte-em-festas/decoracao-branca.png` | — |
| `lucas-arruma-maquina-lavar` | Lucas Arruma Máquina de Lavar | VALID | `public/images/lucas-arruma-maquina-lavar/vitrine.png` | — |
| `manu-pasteis` | Manu Pastéis | VALID | `public/images/manu-pasteis/hero.png` | — |
| `marido-de-aluguel` | Mestre dos Serviços | LOGO_ONLY | `/images/mestre-dos-servicos-logo.jpg` | Só existe marca/logo do cliente. |
| `marmitaria-dom-diego` | Marmitaria Dom Diego | VALID | `public/images/marmitaria-dom-diego/capa.png` | — |
| `mary-diarista` | Mary Diarista | CONTACT_OR_PII | `/images/mary-diarista/servicos.webp` | Material exibe contato ou endereço. |
| `mirassol-conserta-celular` | Conserta Mirassol | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `mirassol-delicias-caseiras` | Delícias Caseiras Mirassol | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `miro-tech` | MIRO TECH | NO_REAL_ASSET | — | Não há fotografia ou material real apropriado. |
| `mp-festas-eventos` | MP Festas e Eventos | CONTACT_OR_PII | `/images/mp-festas-eventos/capa.webp` | Material exibe contato ou endereço. |
| `no-brilho-higienizacao` | No Brilho Higienização | VALID | `public/images/no-brilho-higienizacao/vitrine.png` | — |
| `paraiso-do-hot-dog` | Paraíso do Hot Dog | VALID | `public/images/paraiso-do-hot-dog/capa.png` | — |
| `paulo-mestre-de-obras` | Paulo Mestre de Obras | CONTACT_OR_PII | `/images/paulo-mestre-de-obras/social.jpg` | Material exibe contato ou endereço. |
| `premium-envelopamentos` | Premium Envelopamentos | VALID | `public/images/premium-envelopamentos/galeria-oficina.png` | — |
| `r_beauty` | R_Beauty Studio & Spa | NO_REAL_ASSET | `/images/r-beauty-cilios.jpg` | Sem material real adequado para capa editorial. |
| `raphael-construcoes` | Raphael Construções | NO_REAL_ASSET | `/images/raphael-construcoes/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `refrigeracao-maresia` | Refrigeração Maresia | NEEDS_CROP | `public/images/refrigeracao-maresia/hero-og.png` | Asset aprovado é imagem social (OG); precisa de recorte editorial de card. |
| `renata-beauty` | Renata Beauty Studio | PROMOTIONAL_MATERIAL | `/images/renata-beauty-promo.webp` | Material é peça promocional com preço/campanha. |
| `reuse-house-brecho` | REuse House Brechó | VALID | `public/images/reuse-house-brecho/capa.png` | — |
| `rj-servicos-drywall` | RJ Serviços de Drywall | VALID | `public/images/rj-servicos-drywall/hero-drywall.webp` | — |
| `rm-fretes` | RM Fretes | VALID | `public/images/rm-fretes/carroceria-carga.png` | — |
| `salao-da-marcia` | Salão da Marcia | NO_REAL_ASSET | `/images/salao-da-marcia/depilacao.webp` | Não há fotografia ou material real apropriado. |
| `santos-montador-de-moveis` | Santos Montador de Móveis | VALID | `public/images/santos-montador-de-moveis/hero.png` | — |
| `sos-presentes-cosmeticos` | SOS Presentes & Cosméticos | VALID | `public/images/sos-presentes-cosmeticos/caneca-eu-te-protejo.png` | — |
| `studio-de-cilios` | Studio de Cílios | CONTACT_OR_PII | `/images/studio-de-cilios/portfolio-1.webp` | Material exibe contato ou endereço. |
| `thays-camilla` | Thays Camilla | NEEDS_CROP | `public/images/thays-camilla/hero-og.png` | Asset aprovado é imagem social (OG); precisa de recorte editorial de card. |
| `ton-e-cor` | Ton & Cor · Pintura e Pequenas Reformas | NO_REAL_ASSET | `/images/ton-e-cor/hero-og.jpg` | Sem material real adequado para capa editorial. |
| `toquinho-de-gente-brecho` | Toquinho de Gente Brechó Adulto e Infantil | VALID | `public/images/toquinho-de-gente-brecho/capa.png` | — |
| `uberlandia-eletrica-residencial` | Elétrica Bairro Brasil | LOGO_ONLY | — | Só existe marca/logo do cliente. |
| `vila-da-capivara` | Vila da Capivara | VALID | `public/images/vila-da-capivara/capa.webp` | — |
| `woodhouse-hamburgueres` | Woodhouse Hambúrgueres | VALID | `public/images/woodhouse-hamburgueres/capa.png` | — |



## 7. Recomendação para a próxima rodada

Opção **A — fechar capas**: atacar primeiro `NEEDS_CROP` (4), que já tem material próprio e
seguro e só depende de recorte editorial; depois avaliar `LOGO_ONLY` (10) com composição de
marca aprovada. `CONTACT_OR_PII` (8) e `PROMOTIONAL_MATERIAL` (2) permanecem bloqueados até
haver material novo do cliente.

Opção **B — seguir originalidade**: retomar a dissolução dos scores 54–59.

Recomendação: **A**, limitada aos 4 `NEEDS_CROP`, por ser a menor rodada com ganho visível e
risco zero de PII.
