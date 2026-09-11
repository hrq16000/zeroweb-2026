# Portfolio Entity Enrichment Standard

Status: **obrigatório**. Complementa `docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`
e `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`.

```text
ENTITY ENRICHMENT → descobre a verdade do negócio
BLUEPRINT         → organiza essa verdade numa experiência
RENDERER          → apresenta a experiência
```

Uma landing estruturalmente sofisticada alimentada por uma única foto recortada
várias vezes continua incompleta. Antes de criar `/portfolio/:slug` é obrigatória
a etapa **ENTITY RESEARCH & ENRICHMENT**.

## 1. Fluxo obrigatório

```text
novo cliente → identificação da entidade → pesquisa pública → confirmação de identidade
→ fontes oficiais → Google/Maps/avaliações → redes sociais → fotos reais
→ serviços/produtos → dados locais → provas → assets existentes
→ enriquecimento editorial → Blueprint → landing page
```

## 2. Pesquisa amplia, nunca inventa

Cada informação registrada carrega:

```ts
type EnrichedValue<T> = {
  value: T;
  source: string;
  sourceUrl?: string;
  sourceType: SourceType;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  verifiedAt: string;   // ISO
  usageRights?: string;
};

type SourceType =
  | "OWNER_SUPPLIED" | "OFFICIAL_WEBSITE" | "GOOGLE_PLACES" | "GOOGLE_BUSINESS"
  | "OFFICIAL_INSTAGRAM" | "OFFICIAL_FACEBOOK" | "OFFICIAL_SOCIAL"
  | "PUBLIC_DIRECTORY" | "PUBLIC_WEB" | "LICENSED_MEDIA" | "GENERATED_MEDIA"
  | "UNKNOWN";
```

Lacuna não preenchida vira `unverified[]`, nunca texto inventado.

## 2.1 Etapas independentes (discovery ≠ ingestion)

```text
ENTITY DISCOVERY     → localizar e confirmar a empresa
ENTITY RESOLUTION    → garantir que é a empresa correta
CONTENT INGESTION    → obter dados, reviews, fotos etc.
EDITORIAL ENRICHMENT → transformar dados confirmados em conteúdo
MEDIA ENRICHMENT     → selecionar/produzir mídia
BLUEPRINT            → compor a página
```

Um provider indisponível bloqueia **apenas** `CONTENT INGESTION`. Ele nunca
transforma retroativamente uma entidade resolvida em “não encontrada”. Entidade
resolvida sem provider registra:

```text
GOOGLE_ENTITY_RESOLVED
PLACE_ID_CONFIRMED
GOOGLE_CONTENT_IMPORT_PENDING_PROVIDER
```

Identificador estável é obrigatório e persistente:

```ts
google: { placeId: "…", status: "resolved" }
```

Provider ausente é documentado literalmente:

```text
provider: unavailable
requiredCapability: Google Places
placeId: <place id>
status: waiting_for_provider
```

Proibido scraper de HTML do Google e qualquer contorno de bloqueio.

## 2.2 Ledger obrigatório da pesquisa

Nenhuma pesquisa pode concluir “não encontrei” após poucas consultas. Cada eixo
(Google, Instagram, site, avaliações, mídia) registra separadamente:

```text
searched · found · resolved · verified · accessible · ingestable · usable
```

Exemplo válido:

```text
Google entity → FOUND yes · RESOLVED yes · VERIFIED yes · INGESTABLE no (provider ausente)
```

Estados distintos e não intercambiáveis:
`INSTAGRAM_PRESENT_BUT_HANDLE_UNRESOLVED` ≠ `NO_INSTAGRAM`;
`GOOGLE_CONTENT_IMPORT_PENDING_PROVIDER` ≠ `GOOGLE_PROFILE_NOT_FOUND`.

## 2.3 Evidência fornecida pelo proprietário

Captura de tela de ficha pública é `OWNER_SUPPLIED_PUBLIC_EVIDENCE`: serve para
auxiliar resolução, confirmar correspondência e listar dados a validar depois.
Não é API e não é dado verificado por provider — mas também não pode ser
descartada só porque a automação não reproduziu a consulta.

## 2.4 Contrato de ingestão, reviews e fotos

```ts
google = { placeId, name, rating, reviewCount, category, address, phone, hours,
           mapsUrl, reviews[], photos[], lastVerifiedAt };

reviews[] = { source, author, rating, text, publishedAt?, sourceUrl?, attribution? };

photos[]  = { source, reference, attribution, width?, height?, subject?,
              suggestedUsage?, lastVerifiedAt };
```

Campos dependentes de provider ficam `null`/vazios — nunca preenchidos
artificialmente. Resumo editorial não vira review; autor e comentário jamais são
fabricados. Foto do Google não é asset do cliente e não é versionada
permanentemente sem verificar o modelo de uso permitido.

## 3. Resolução da entidade

Confirmar por múltiplos sinais convergentes: nome exato, telefone, endereço,
cidade, logo, fotos, Instagram, site, categoria. Nome parecido **não** é
identidade. Sem convergência mínima de dois sinais, o resultado é `REJECTED`.

## 4. Providers (nunca um crawler monolítico)

```text
EntityEnrichment
 ├─ GooglePlacesProvider     (Places API New via connector google_maps)
 ├─ SearchProvider           (websearch)
 ├─ OfficialWebsiteProvider  (fetch do site confirmado)
 ├─ SocialDiscoveryProvider  (links vindos do Google/site oficial)
 ├─ PublicDirectoryProvider  (diretórios reputáveis)
 ├─ OwnerAssetsProvider      (material enviado pelo proprietário)
 └─ GeneratedMediaProvider   (imagens originais ilustrativas)
```

Falha de um provider não interrompe os demais; ela é registrada com status
`UNAVAILABLE`. Proibido raspar HTML de Google, Instagram ou Facebook como
arquitetura oficial. Quando a API não estiver disponível, registrar a URL/Place
ID confirmados para enriquecimento posterior.

## 5. Google: atribuição e cache

Dados de Places/Google Business só podem ser exibidos preservando atribuição,
autoria do autor da avaliação e link para a origem no Google Maps. Proibido
apresentar conteúdo Google como conteúdo próprio, remover atribuição ou baixar
fotos/reviews e convertê-los em assets permanentes ignorando as políticas de
cache da fonte. `rating`, `reviewCount` e `openingHours` são valores voláteis:
exibir sempre com `lastVerifiedAt`.

## 6. Camada de confiança

Prioridade em caso de conflito:

```text
OWNER_CONFIRMED / OFFICIAL > GOOGLE BUSINESS CONFIRMED > OFFICIAL SOCIAL
> REPUTABLE DIRECTORY > GENERAL WEB
```

Conflito nunca é resolvido em silêncio: registrar em `conflicts[]` com os valores
e as fontes.

## 7. Media enrichment

```ts
type MediaCandidate = {
  source: SourceType;
  sourceUrl?: string;
  type: MediaType;
  subject: string;
  owner: string;
  rights: string;
  attribution?: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  suggestedUsage: string;
};

type MediaType =
  | "REAL_BUSINESS_PHOTO" | "REAL_PROJECT_PHOTO" | "OFFICIAL_BRAND_ASSET"
  | "GOOGLE_PHOTO" | "SOCIAL_MEDIA_PHOTO" | "LICENSED_STOCK"
  | "GENERATED_ILLUSTRATION" | "GENERATED_CONTEXTUAL_IMAGE"
  | "UNKNOWN_RIGHTS" | "UNSUITABLE";
```

Prioridade de uso:

1. fotos reais do próprio negócio;
2. fotos reais de trabalhos/produtos do cliente;
3. identidade e materiais oficiais;
4. fotos oficiais de presença pública utilizáveis corretamente;
5. mídia licenciada relacionada;
6. imagens originais geradas para o projeto;
7. composição gráfica/SVG própria.

Resultado final **não pode** ser uma única foto reutilizada em vários crops.

Imagem gerada é sempre **ILUSTRATIVA**: nunca apresentada como fachada,
funcionário, loja, trabalho executado, cliente ou prova social. O metadata
interno precisa distinguir `FACT`, `REAL MEDIA`, `EXTERNAL MEDIA`,
`GENERATED MEDIA` e `EDITORIAL CONTENT`.

## 8. Estratégia visual por seção

Cada seção declara sua fonte: `REAL | GOOGLE | LICENSED | GENERATED | GRAPHIC |
NO_MEDIA_NEEDED`.

## 9. Capa

A capa nasce do media enrichment, com estratégia explícita: `real-photo |
brand-led | product-led | service-led | generated-editorial | hybrid`.

Gate semântico: sem ler a descrição, a capa responde “que tipo de empresa é
esta?”. Critérios: `brandMatch`, `segmentMatch`, `focalPoint`,
`smallCardLegibility`, `contrast`, `realAssetQuality`, `identityPresence`,
`genericAssetPenalty`, `duplicateAssetPenalty`.

## 10. Enrichment document

Cada projeto mantém um registro persistente em
`docs/portfolio/enrichment/<slug>.json` com:

```text
identity · sources · google · social · services · location · reviews
media · facts · unverified · conflicts · generatedAssets · lastResearchAt
```

## 11. ENTITY_ENRICHMENT_GATE

Um `/portfolio/:slug` não está pronto só porque compila e tem Blueprint, capa,
funil e SEO. Precisa passar por:

```text
[ ] entidade pesquisada        [ ] fotos pesquisadas
[ ] Google procurado           [ ] avaliações pesquisadas
[ ] redes sociais procuradas   [ ] identidade pesquisada
[ ] site procurado             [ ] fontes registradas
[ ] serviços confirmados       [ ] conflitos resolvidos
[ ] localização pesquisada     [ ] fatos não confirmados marcados
[ ] estratégia de mídia definida
[ ] capa semanticamente correta
```

Ausência de um dado não reprova. **Ausência de pesquisa reprova.**

## 12. Enriquecimento não é SEO spam

Proibido: cidades falsas, serviços não oferecidos, marcas não atendidas, FAQs
inventadas, avaliações artificiais, doorway pages e palavras-chave desconectadas
do negócio. O enriquecimento serve primeiro ao usuário.
