# 0WEB — Reference Corpus R6 · resolução de rotas e enriquecimento sem novo engine

Status: **research ledger oficial / aditivo**  
Data: **2026-09-24**  
Escopo: micro-rodada de referências para novas `/portfolio/:slug`.

Esta rodada resolve duas URLs antes incompletas e confirma três URLs que ainda
não podem alimentar padrões. **Não cria experience engine nem interaction
signature nova.**

Princípio:

> **ENRIQUECER EVIDÊNCIA SEM RENOMEAR PADRÕES JÁ EXISTENTES.**

## 1. Fontes resolvidas nesta rodada

### Grupo RDM — São José dos Pinhais

URL:
https://grupordmcuritiba.com.br/sjp/

A rota SJP confirma que uma página local pode mudar verdade operacional e não
apenas trocar o nome da cidade. A página expõe:

- unidade/endereço e horário específicos de São José dos Pinhais;
- modalidade em domicílio e serviço de busca/entrega;
- cobertura por bairros;
- taxonomia de sintomas;
- jornada específica para empresas;
- orçamento/diagnóstico antes do reparo;
- prova de transparência pelo serviço acompanhado pelo cliente.

Tradução 0WEB:

- `LOCATION_AND_NETWORK` quando localidade muda atendimento/cobertura;
- `SERVICE_MODE_SELECTOR` quando loja, domicílio ou retirada mudam logística;
- `SYMPTOM_TO_SERVICE_MODE` quando sintoma e modalidade ajudam a rotear;
- conteúdo local precisa conter diferença operacional real para não virar
  doorway/skin local.

Nenhum desses padrões é novo. A rota adiciona evidência de combinação.

### Infocase — landing comercial

URL:
https://vendas.infocaseinformatica.com.br/

A página comercial foi recuperada via índice público mesmo com timeout no fetch
direto. Ela organiza a oferta como sistema empresarial/fiscal integrado e
apresenta:

- emissão de múltiplos documentos fiscais;
- gestão financeira e estoque;
- aplicativo mobile;
- suporte técnico/remoto;
- bloco problema → solução;
- atendimento humano e atualização fiscal como redução de risco;
- continuidade para o site institucional;
- duas localizações operacionais.

Tradução 0WEB:

- `PRODUCT_OR_SERVICE_FINDER` como lógica de entendimento da oferta, sem exigir
  um widget visual de finder;
- `PROCESS_AND_TRANSPARENCY` para suporte/operação;
- `PRODUCTIZED_SERVICE` quando um sistema reúne capacidades distintas;
- `MULTI_OFFER_ECOSYSTEM` quando software + suporte + operação coexistem;
- problema→capacidade pode organizar narrativa sem criar novo engine.

Claims quantitativos da referência não devem ser importados sem validação própria.

## 2. Fontes que continuam não resolvidas

### Nova Geração Informática

URL exata:
https://novageracaoinformatica.com.br/?page_id=9

O crawler não conseguiu resolver a URL. Resultados públicos encontrados em
outros domínios com nomes semelhantes **não substituem** esta fonte.

Estado: `UNRESOLVED_CURRENT_CRAWL`.

### Assistência Rose

URL exata:
https://assistencia-rose.vercel.app/

A URL segue inacessível no crawler. Resultados para outros produtos/serviços
"Rose" são entidades distintas e não podem ser usados como substitutos.

Estado: `UNRESOLVED_CURRENT_CRAWL`.

### iRepair

URL exata:
https://irepair.com.br/

O domínio exato respondeu com erro no fetch. Foram encontrados outros domínios
com marca/nome semelhante, mas a identidade não foi comprovada como sendo a
mesma entidade da URL original.

Estado: `UNRESOLVED_CURRENT_CRAWL`.

## 3. REFERENCE_SIGNAL_MATRIX — R6

| Fonte | Sinal útil | Padrões já existentes | Tradução 0WEB | Classe |
|---|---|---|---|---|
| Grupo RDM / SJP | unidade local + cobertura por bairros + domicílio/retirada + sintomas + B2B | LOCATION_AND_NETWORK · SERVICE_MODE_SELECTOR · SYMPTOM_TO_SERVICE_MODE | página local deve alterar verdade operacional, não só cidade/copy | USE |
| Infocase vendas | sistema integrado + problema→solução + suporte + mobile + fiscal | PRODUCT_OR_SERVICE_FINDER · PROCESS_AND_TRANSPARENCY | organizar capacidades pela decisão do negócio sem criar novo engine | ADAPT |
| Nova Geração Informática | URL não resolvida | — | não substituir por domínio semelhante | REJECT |
| Assistência Rose | URL não resolvida | — | não substituir por entidade “Rose” encontrada em busca | REJECT |
| iRepair | domínio exato não resolvido | — | não assumir identidade a partir de iRepair com outro domínio | REJECT |

## 4. Local route ≠ city-name swap

A rota SJP reforça uma regra já existente no 0WEB:

Uma página local só merece existir separadamente quando pelo menos parte do
seguinte muda de forma verdadeira:

- unidade/endereço;
- horário;
- cobertura;
- logística;
- modalidade;
- disponibilidade;
- prova local;
- restrições;
- CTA/contexto de atendimento;
- conteúdo necessário para aquela decisão.

Se a única mudança é substituir “Curitiba” por “São José dos Pinhais”, não há
evidência suficiente para uma rota local autônoma.

## 5. Software/comercial ≠ catálogo genérico de features

A Infocase reforça que produto/software pode ser organizado por:

`PAIN → CAPABILITY → OPERATIONAL_FIT → SUPPORT → PROOF → HUMAN_HANDOFF`

Isso não cria novo engine. É uma composição possível dentro de
`PRODUCT_OR_SERVICE_FINDER` + `PROCESS_AND_TRANSPARENCY`.

## 6. Motion

`motionObserved = NOT_VERIFIED`.

Nenhuma animação/easing/parallax foi atribuída às referências sem inspeção
visual confiável.

## 7. Resultado da micro-rodada

Delta real:

- **+2 fontes/rotas resolvidas e úteis**;
- **+0 experience engines**;
- **+0 interaction signatures**;
- **+0 motion observado**;
- **3 URLs continuam bloqueadas por identidade/fetch**, sem substituição;
- reforço da regra de que **rota local precisa alterar verdade operacional**.

Regra preservada:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**
