# Relatório de Entity Enrichment — Careca's Infotec

Rodada inicial: 2026-09-10. **Correção aplicada em 2026-09-11.**
Nenhum redesign, geração de imagens, migração, CMS, painel ou publicação foi executado.

## 1. Correção da conclusão anterior

A conclusão `GOOGLE_PROFILE_NOT_FOUND` está **retirada e proibida** para este projeto.
A entidade foi localizada e resolvida externamente. O estado correto é:

```text
GOOGLE_ENTITY_RESOLVED
PLACE_ID_CONFIRMED
GOOGLE_CONTENT_IMPORT_PENDING_PROVIDER
```

Provider indisponível bloqueia **CONTENT INGESTION**; não converte entidade
resolvida em “não encontrada”.

## 2. Entidade confirmada

| Campo | Valor | Origem |
|---|---|---|
| Nome | Careca´s Infotec | ficha pública + faixa oficial |
| Place ID | `ChIJjxhi67_73JQRgGgv4G2-G18` | confirmado |
| Categoria | Assistência Técnica de Informática | ficha pública |
| Avaliação observada | 4.9 · 43 avaliações | `OWNER_SUPPLIED_PUBLIC_EVIDENCE` |
| Telefone | +55 41 99507-2700 | ficha pública (server-side, nunca no bundle) |
| Endereço | Rua Margarida Petrelli Fogiatto, 118 — Santo Antônio — SJP/PR — 83020-600 | ficha pública |
| Horário | seg–sex 08:00–18:00 · sáb 09:00–18:00 | ficha pública |

Sinais convergentes: nome, categoria, telefone, endereço, horário e correspondência
com a evidência visual do proprietário.

## 3. Ledger de pesquisa

```text
Google entity  → FOUND yes · RESOLVED yes · VERIFIED yes · INGESTABLE no (provider ausente)
Instagram      → FOUND yes (link na ficha) · RESOLVED no · handle não confirmado
Website        → FOUND no
Mídia real     → FOUND yes, porém insuficiente (1 fotografia)
```

## 4. Capacidade de acesso ao Google Places

Conexões disponíveis no workspace: Resend, Google Search Console e Google Sheets.
Nenhuma conexão Google Maps/Places.

```text
provider: unavailable
requiredCapability: Google Places
placeId: ChIJjxhi67_73JQRgGgv4G2-G18
status: waiting_for_provider
```

Proibido scraper de HTML do Google ou contorno de bloqueios. Desbloqueio: vincular
o conector Google Maps Platform.

## 5. Instagram

`INSTAGRAM_PRESENT_BUT_HANDLE_UNRESOLVED`. Buscas por nome, telefone e endereço
retornaram apenas homônimos (Infotec de Londrina, Linhares, Barbacena e a
INFOTEC — Soluções Tecnológicas de SJP, CNPJ 43.362.951/0001-13, empresa distinta).
Nenhum perfil homônimo será associado.

## 6. Contrato de ingestão preparado

O registro `docs/portfolio/enrichment/carecas-infotec.json` já contém os campos
`google.ingestion.contract` (placeId, name, rating, reviewCount, category, address,
phone, hours, mapsUrl, reviews[], photos[], lastVerifiedAt) com `null`/vazio, além
dos schemas de `reviews[]` e `photos[]`. Nada preenchido artificialmente.

## 7. Mídia

`MEDIA_ENRICHMENT_INCOMPLETE`. Existe uma única fotografia real (`banner.webp`).
Media mix alvo registrado por seção no enrichment (hero real, equipamentos e
problemas com mídia contextual gerada, como-funciona gráfico, reviews como
evidência Google, CTA brand graphic).

## 8. Capacidade de geração de imagens

`IMAGE_GENERATION_CAPABILITY_AVAILABLE` — ferramenta de geração/edição de imagem
do ambiente, gravando arquivo utilizável direto no projeto (jpg/png, 512–1920 px;
capa 1200×630). Provenance registrado como `GENERATED_CONTEXTUAL_MEDIA` com data e
uso pretendido. **Nenhuma imagem foi gerada nesta rodada.**

## 9. Capa

Estratégia definitiva: `BRAND_LED + SERVICE_LED (HYBRID)` — logo/mascote real,
carvão + amarelo, informática reconhecível, boa leitura pequena, sem telefone e sem
endereço. Proposta pendente, não executada.

## 10. Fim da rodada

Sem publicação, sem redesign, sem alteração em outros projetos.
