# 0WEB — Delivery Menu & Pricing Contract (Rodada 3/8)

**Status:** `SPEC_COMPLETE / ENGINE_NOT_IMPLEMENTED / REFERENCE_NOT_INTERACTIVELY_VERIFIED`  
**Versão:** 1.0 (especificação) · **Data:** 2026-11-01  
**Norma principal:** [DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md](./DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md)  
**UX/estados:** [DELIVERY_STOREFRONT_UX_STATE_MATRIX.md](./DELIVERY_STOREFRONT_UX_STATE_MATRIX.md)  
**Casos de preço:** [PRICE_CALCULATION_FIXTURES.v1.json](./delivery/PRICE_CALCULATION_FIXTURES.v1.json)

## 1. Decisão de produto

Um catálogo de delivery não pode ser apenas array estático com nomes, imagens e preços. O catálogo deve ser **versionado, gerenciável pelo próprio estabelecimento, validável no servidor e executável para pedidos reais**. O lojista define seu cardápio; a 0WEB fornece a infraestrutura e valida todas as escolhas. Conteúdo de referência do PDV Slim/Juma é inspiração funcional, não fonte de dados nem software copiado.

**Não vender, oferecer ou publicar como integrado** qualquer módulo que esteja somente especificado. O texto abaixo é um contrato para a implementação futura e testes por loja.

### Invariantes

1. Um produto pertence a uma loja; nunca compartilhar preço, foto, adicionais, promoções ou estoque entre tenants por engano.
2. A loja é fonte comercial de produtos/preços/horários. A API autenticada é fonte técnica de versões e permissões. O browser só visualiza e sugere configurações.
3. Nenhum preço é inventado, estimado silenciosamente ou copiado de outro estabelecimento.
4. Preço apresentado ao cliente é o preço gerado pelo motor autoritativo para uma configuração válida, com breakdown e validade.
5. Checkout exige nova validação de preços, disponibilidade, horário, cobertura, promoções e mínimo de pedido.
6. O mesmo SKU com sabores/tamanhos/observações diferentes deve gerar linhas de carrinho distintas.
7. Produto indisponível, opção esgotada e cotação expirada não se transformam em pedido confirmado.
8. Opções da interface devem coincidir com as configurações de catálogo habilitadas no backoffice da loja.
9. O lojista precisa poder alterar produto, complemento e status sem editar código; mudanças não reescrevem snapshots históricos de pedidos.
10. Toda publicação requer DELIVERY_OPERATIONAL_GATE. Não confundir cobertura de testes documentais com implantação.

## 2. Entidades e contrato mínimo

### Estabelecimento (Store)

- `storeId` imutável e não enumerável nas APIs públicas; `tenantId` isolado; `clientKey` da 0WEB para identidade/projeto; `slug`/domínio tratados como roteamento, não autorização.
- `timezone` por loja, ex. America/Sao_Paulo; `currency` definida (MVP BRL); `catalogVersion` monotônica; `publishedCatalogVersion`.
- `fulfillmentModes` só modalidades realmente atendidas, `openingHours`, `specialClosures`, `minimumOrderCents`, `serviceZones` e `deliveryFeePolicy` versionados.
- `orderEnabled` não pode habilitar pedidos até a validação operacional e onboarding de dados reais.

### Categoria (Category)

- `categoryId`, `storeId`, `slug` por loja, `name`, `description?`, `sortOrder`, `visibility`, `availableFrom/Until?`.
- Categoria vazia pode ser ocultada sem quebrar links; categorias não podem compartilhar produtos de outra loja.

### Produto (Product)

- `productId`, `storeId`, `sku?`, `categoryIds`, `name`, `description`, `photoAssets` com procedência, `allergens?` verificados, `visibility`, `availability`, `version`, `sortOrder`, `productType`.
- Tipos mínimos: `SIMPLE`, `CONFIGURABLE`, `PIZZA`, `COMBO`.
- `taxTreatment`/regras fiscais apenas quando configuradas e homologadas; nunca derivar carga tributária de suposição.
- `basePriceCents` pode ser nulo **somente** quando a seleção de variante resolve o preço; produto sem valor e sem variante configurada não pode ser vendido.
- `visibility`: DRAFT / PUBLISHED / HIDDEN. `availability`: AVAILABLE / TEMP_UNAVAILABLE / SOLD_OUT / SCHEDULED (quando aplicável).
- Fotos reais pertencentes ao estabelecimento; imagem ausente recebe placeholder neutro, não foto genérica apresentada como produto real.

### Variante (Variant)

- `variantId`, `productId`, `name`, `priceCents`, `available`, `sortOrder`, `sku?`, `sizeCode?`.
- Uma pizza P/M/G pode ter preços de sabores **específicos por tamanho**, não escalar automaticamente valores de outro tamanho.
- A regra de capacidade (número máximo de sabores, bordas, opções) pode variar por tamanho.

### Grupo de opções (OptionGroup)

- `groupId`, `storeId`, `productId` ou `variantId`, `name`, `required`, `minSelect`, `maxSelect`, `minQuantityPerOption`, `maxQuantityPerOption`, `selectionMode`, `sortOrder`, `available`.
- `selectionMode`: SINGLE, MULTI, QUANTITY, FRACTION (quando Pizza).
- Grupos e opções devem ter IDs estáveis. `required` é derivável de `minSelect > 0` e não pode contradizê-lo.
- O grupo pode conter `displayPriceMode`: NO_PRICE / DELTA / ABSOLUTE, conforme regras de catálogo.
- Cada opção tem `optionId`, `name`, `priceDeltaCents` ou regra de preço própria, `available`, `maxQuantity`, `sortOrder`.
- Contraindicações e alergênicos exigem informação oficial; não inferir segurança de consumo.

### Combo (Bundle)

- `comboId`, `storeId`, `bundleBasePriceCents`, `slots` (por exemplo: principal, acompanhamento, bebida), `slotMin`, `slotMax`, `allowedProducts/variants`, `upgradePriceCents`, `eligibility`.
- **O preço base já inclui os itens designados do combo.** Não somar novamente os preços individuais dos filhos do combo. Somar apenas upgrades/adicionais explicitamente configurados.
- Combos não podem conter recursão infinita; no MVP proibir combo dentro de combo. Estoque é validado para cada item escolhido.
- Opções obrigatórias de cada slot bloqueiam botão "Adicionar" até serem preenchidas.
- Foto de combo não prova conteúdo: conteúdo real deve ser exibido como texto editável e versionado.

### Promoção/Cupom

- `promotionId`, `storeId`, `type` (FIXED_CENTS / PERCENT_BPS), `value`, `startsAt`, `endsAt`, `usageLimit`, `customerLimit` quando aplicável, `eligibleProducts`, `eligibleModes`, `stackingPolicy`, `minMerchandiseCents`.
- `PERCENT_BPS` usa base de 10.000 pontos: 1.000 = 10%, não número flutuante 0.10.
- Cupom nunca reduz subtotal elegível abaixo de zero e não pode aplicar-se a frete, taxas ou gorjetas sem regra comercial expressa.
- Promoção expirada, esgotada ou não elegível responde com erro claro e novo preço, sem alterar pedido já confirmado.

## 3. Modelo de configurador e identificador de linha

### Caminho

1. Cliente escolhe categoria e produto.
2. Escolhe variante obrigatória (por exemplo, pizza G).
3. Escolhe sabores (até limite real para o tamanho), borda, ponto, extras, trocas e observações.
4. A UI valida limites locais e mostra preço **provisório**, sempre sujeito ao servidor.
5. Cotação no servidor valida todos os IDs, versões, limites, opções disponíveis e retorna linha com valor canônico.
6. Item é registrado no carrinho com identificador por combinação de produto + variante + frações + opções/quantidades + observação, não por produto apenas.
7. Ao editar, manter a linha original até confirmar a substituição; recalcular cotação. Nunca "aplicar a todos" silenciosamente.

### Identidade de configuração

`lineKey = stableHash(storeId, productId, variantId, canonicalSortedFractionSelections, canonicalSortedOptionQuantities, normalizedNote)`.

- Canonicalização: ordenar por IDs estáveis; quantidades inteiras positivas; frações em representação racional reduzida; notas em texto normalizado com limite de caracteres e sanitização.
- Itens com mesma configuração **podem** combinar quantidades; observações diferentes ou grupos diferentes **não** combinam.
- Não usar hash de forma que exponha dado pessoal ou autorize acesso a pedidos; a hash só identifica linha do carrinho.
- A persistência do draft de carrinho precisa tolerar atualização de catálogo: revalidar preço/opções quando recuperar a sessão.

## 4. Política de pizza (não inferir regras da referência)

A loja define **uma política explícita por família/tamanho**. Exemplo ilustrativo em BRL:

- Sabor A: R$ 42,00 (4.200 centavos)
- Sabor B: R$ 54,00 (5.400 centavos)
- Borda adicional: R$ 9,00 (900 centavos), cobrada uma vez por pizza
- Pizza 50% A + 50% B

| Política | Fórmula | Preço unitário sem borda | Com borda |
|---|---|---:|---:|
| `MAX_SELECTED_FLAVOR` | maior preço dentre sabores efetivamente escolhidos | 5.400 | 6.300 |
| `WEIGHTED_FRACTIONS` | arredondar(4.200 × 1/2 + 5.400 × 1/2) | 4.800 | 5.700 |
| `BASE_PLUS_FLAVOR_SURCHARGES` | base fixa + adicional fracionado por sabor | depende da base e da sobretaxa real | + 900 |

**Exemplo adicional de BASE_PLUS_FLAVOR_SURCHARGES:** base R$ 40,00 + metade de sobretaxa de R$ 6,00 + metade de R$ 8,00 = R$ 47,00 sem borda. Essa política **não** aplica automaticamente o preço de sabores como valor total; ela exige campos próprios de sobretaxa.

### Restrições obrigatórias

- Para pizza fracionada, soma exata das frações = 1: duas metades, três terços ou combinações permitidas pelo lojista.
- `allowedFractions` e `maxDistinctFlavors` por tamanho; não permitir 3 sabores em uma pizza cuja configuração real aceita 2.
- Cada sabor permitido somente se `flavorAvailableForVariant = true` e preço da variante verificado.
- Preço é calculado com frações racionais inteiras: numerador e denominador, nunca `0.3333` aproximado em float.
- `MAX_SELECTED_FLAVOR` usa maior preço apenas entre sabores selecionados e disponíveis, independentemente da proporção, se essa for a regra cadastrada.
- `WEIGHTED_FRACTIONS` aplica soma de frações e arredonda **uma vez no nível do preço-base da pizza**, antes de adicionar complementos inteiros, não por fração separada.
- Adicionais devem declarar `PER_PIZZA`, `PER_PORTION` ou `PER_ORDER`. Cobrar borda duas vezes em pizza meio a meio é erro P0.
- Uma pizza metade A/metade B é **uma linha configurada**, não duas pizzas independentes.
- A UI deve mostrar regra de preço de modo inteligível antes de confirmar adição.
- Se uma loja não vender pizza fracionada, todo esse caminho é NOT_APPLICABLE; não obrigar feature vazia.

## 5. Aritmética financeira e distribuição de descontos

Usar inteiro em centavos, sem `number` de ponto flutuante para totais monetários nem `toFixed` como motor. Multiplicação, soma e divisão racionais devem ser executadas com aritmética inteira segura e overflow controlado; tratar overflow como erro, nunca aproximar silenciosamente.

- `unitBaseCents = priceConfiguredForVariantOrPizzaSelection`.
- `unitAddonsCents = sum(configured PER_UNIT/PER_PIZZA/PER_COMBO modifiers)`.
- `itemLineCents = (unitBaseCents + unitAddonsCents) × integerQuantity`.
- `itemsSubtotalCents = sum(itemLineCents)`.
- `eligibleSubtotalCents = sum(eligible line amounts)` para a promoção determinada.
- `discountCents = clamp(roundHalfUp(eligibleSubtotalCents × basisPoints / 10000), 0, eligibleSubtotalCents)` para cupom percentual.
- `finalMerchandiseCents = itemsSubtotalCents - discountCents`.
- `totalCents = finalMerchandiseCents + deliveryFeeCents + authorizedOtherChargesCents` (cobranças adicionais só se legalmente e comercialmente configuradas).
- `minimumOrder` é aplicado **sobre mercadoria após desconto**, excluindo entrega, salvo política da loja expressamente configurada e mostrada.
- `roundHalfUpPositive(a / b) = floor((2 × a + b) / (2 × b))` com inteiros não negativos (e checagem de overflow); cálculo final em centavos arredondado uma vez por unidade/linha conforme etapa definida.
- Valor total nunca pode ser negativo; quantidade 0 ou negativa deve falhar; desconto nunca ultrapassa seu subtotal elegível.
- Frete só é exibido como final depois de resolver endereço/modalidade/área de entrega; sem endereço exibir "frete a calcular".

### Exemplo: dois combos + entrega e cupom

- Preço base do combo: R$ 32,99; upgrade: R$ 3,00; quantidade 2.
- Subtotal: (3.299 + 300) × 2 = **7.198 centavos (R$ 71,98)**.
- Desconto de 10% na mercadoria elegível: `roundHalfUp(7198 × 1000 / 10000) = 720` centavos.
- Frete: R$ 7,50. Total: `7198 - 720 + 750 = 7228` centavos = **R$ 72,28**.
- Não somar preço dos componentes internos do combo outra vez.

### Exemplo de múltiplos sabores e quantidade

- Pizza metade A/B sob `MAX_SELECTED_FLAVOR`: 5.400 + 900 = 6.300 centavos por pizza.
- Duas pizzas idênticas: 12.600 centavos.
- Entrega autorizada: 550 centavos; total 13.150 centavos (R$ 131,50).
- Mesma pizza sob `WEIGHTED_FRACTIONS`: 4.800 + 900 = 5.700 centavos por unidade, duas unidades 11.400 centavos.

## 6. Matriz de verdade e erros bloqueantes

| Caso | Resultado do servidor | UX |
|---|---|---|
| Produto sem preço nem variante precificada | `PRODUCT_NOT_PRICED` | indisponível; lojista precisa configurar |
| Grupo `minSelect=1` sem opção | `REQUIRED_OPTION_MISSING` | focar grupo e explicar |
| `maxSelect=2` recebendo 3 escolhas | `OPTION_LIMIT_EXCEEDED` | manter rascunho e corrigir |
| Opção indisponível | `OPTION_UNAVAILABLE` | retirar da cotação só após aceite do cliente |
| Pizza com frações que não somam 1 | `INVALID_FRACTION_SUM` | impedir adição ao carrinho |
| Sabor indisponível para tamanho | `FLAVOR_VARIANT_UNAVAILABLE` | oferecer tamanhos realmente disponíveis |
| Subtotal após desconto inferior ao mínimo | `BELOW_MINIMUM_ORDER` | informar diferença e manter carrinho |
| Quantidade maior que estoque/preparo permitido | `INSUFFICIENT_AVAILABILITY` | informar limite permitido sem alterar silenciosamente |
| Catálogo ou variante alterados desde o draft | `CATALOG_CHANGED` | mostrar diff e pedir reconfirmação |
| Preço mudou desde a cotação | `REQUOTE_REQUIRED` | apresentar preço correto e aceitar/voltar |
| `quoteExpiresAt` passou | `QUOTE_EXPIRED` | cotar novamente, nunca confirmar preço vencido |
| Cupom expirado ou não elegível | `PROMOTION_NOT_ELIGIBLE` | exibir explicação, permitir pedido sem cupom |
| Pedido fora do horário/região | `STORE_CLOSED` / `DELIVERY_ZONE_UNSUPPORTED` | não aceitar pedido imediato |
| Loja/tenant divergente | `TENANT_SCOPE_INVALID` | bloquear e auditar; não revelar dados de outra loja |

**Erro de validação nunca gera "pedido recebido".** Toda mensagem usa resposta tipada, com `requestId`, sem exposição de regras internas, tokens ou dados de outro tenant.

## 7. Versionamento e atualização pelo lojista

- Separar **rascunho de catálogo** de **catálogo publicado**; publicar valida IDs, grupo obrigatório, preços, fotos, disponibilidade e horários.
- Versão publicada é imutável para fins de cotação histórica; alterações futuras criam versão nova sem reescrever pedidos.
- Mudança de preço/estoque impede finalizar cotação anterior sem revalidar. Não cobrar preço antigo ou novo silenciosamente.
- Horários e status de esgotado podem alterar disponibilidade sem republicar todo o layout; devem possuir `lastVerifiedAt` e políticas de expiração.
- Só responsáveis autorizados alteram preço, disponibilidade ou promoção. Toda alteração deve registrar `actorId`, `storeId`, `changedFields`, `before/after`, `timestamp` sem PII desnecessária.
- Conteúdo publicável em SEO da loja não deve expor dados de conta, pedidos privados nem preço desatualizado marcado como atual.
- Para migração do catálogo `ParaisoHotDogPage`, mapear preços ao painel como **dados a confirmar com o lojista**, nunca certificar os valores hardcoded como vigentes.

## 8. Contrato de API alvo (detalhes transacionais na R4)

### Entrada de seleção de linha

    {
      "storeId": "opaque-store-id",
      "productId": "prod-pizza-001",
      "variantId": "pizza-g",
      "quantity": 2,
      "fractions": [
        {"flavorId":"margherita","numerator":1,"denominator":2},
        {"flavorId":"frango","numerator":1,"denominator":2}
      ],
      "selectedOptions": [
        {"groupId":"bordas","optionId":"catupiry","quantity":1}
      ],
      "note": "Sem cebola"
    }

Os IDs são ilustrativos, não dados de produto/cliente verificados. O backend resolve preço do produto, do tamanho e das opções por `storeId` e versão de catálogo. `priceCents` enviado pelo browser **não** é aceito como fonte de verdade.

### Resposta mínima de linha cotada

    {
      "catalogVersion": 17,
      "currency": "BRL",
      "itemUnitCents": 6300,
      "quantity": 2,
      "itemsLineCents": 12600,
      "pricePolicy": "MAX_SELECTED_FLAVOR",
      "status": "VALID",
      "quoteExpiresAt": "EXAMPLE_TIMESTAMP_FROM_SERVER"
    }

Este payload é exemplo de formato; `quoteExpiresAt` recebe timestamp real do servidor, não valor literal. A quote completa deve agregar descontos, taxa de entrega, total e disponibilidade da loja; a R4 especifica isso.

## 9. Casos de aceitação e fixtures

O arquivo [PRICE_CALCULATION_FIXTURES.v1.json](./delivery/PRICE_CALCULATION_FIXTURES.v1.json) registra 12 cenários, incluindo:
- simples × quantidade;
- pizza meia/meia com preço de maior sabor;
- pizza meia/meia por média ponderada;
- pizza com base + sobretaxa fracionada;
- pizza em terços com arredondamento;
- variante e adicional obrigatório;
- combo com upgrade, cupom 10% e entrega;
- mínimo de pedido, quote expirada, grupo obrigatório, estoque esgotado e frações inválidas.

**Verificação feita na autoria:** as 7 expectativas numéricas foram recalculadas por uma função de checagem temporária, e as demais 5 descrevem bloqueios esperados. **Isso não é teste de runtime da 0WEB, não foi incorporado ao CI e não demonstra feature implementada.**

### Testes executáveis exigidos na R7

1. Converter fixtures em testes de domínio contra a implementação real, sem mocks de função de preço.
2. Testar políticas por tamanho e em combinações de fração/variante; fuzz de somas e limites.
3. Validar catálogo e promoções cross-tenant, concorrência, alterações de versão e consistência do snapshot.
4. Testar cada opção/extra na UI mobile e no servidor, cobrindo erros, acessibilidade e price diff.
5. Repetir cotação em múltiplos carrinhos e confirmar reconciliação após refresh.
6. Validar subtotal e total com dinheiro em centavos; nenhuma diferença silenciosa entre front, quote, pedido e painel.

## 10. Plano de adoção sem regressão

**Não alterar o runtime nesta micro-rodada.** O motor deve ser criado como capacidade opt-in, atrás de `orderEnabled=false` por padrão, com transição por projeto e validação de `DELIVERY_OPERATIONAL_GATE`.

- Landings atuais, títulos, imagens, SEO, links e funis continuam intactos.
- R4 define cotações, pedidos, entrega, pagamentos e idempotência com este schema como premissa.
- R5 define painel e fila operacional com snapshots de linha e estados.
- R6 estabelece segurança/isolamento e dados.
- R7 executa testes.
- R8 insere gates e onboarding no scaffold, manifests, skills e documentação da 0WEB.

**Definição de completo da R3:** regras de negócio, fórmulas, dados, erros, exemplos e fixtures documentados e revisados via PR; não declarar cardápio live ou checkout funcional até integrar, executar e homologar as fases posteriores.
