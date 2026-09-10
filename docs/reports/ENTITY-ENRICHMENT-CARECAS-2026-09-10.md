# Relatório de Entity Enrichment — Careca's Infotec (2026-09-10)

Rodada de pesquisa apenas. Nenhum redesign, geração de imagens em massa,
migração, CMS, painel ou publicação foi executado.

## 1. Correção da rodada anterior

A conclusão anterior ("nenhuma presença digital encontrada") está **retirada**.
Ela foi produzida por pesquisa insuficiente e não constitui evidência de
ausência. Este registro passa a ser a fonte de verdade
(`docs/portfolio/enrichment/carecas-infotec.json`).

## 2. Resultado da pesquisa desta rodada

| Item | Status |
|---|---|
| Conector oficial `google_maps` | **Indisponível** — nenhuma conexão vinculada ao projeto |
| Places API (Place ID, nota, avaliações, fotos, telefone, endereço, horário) | Não consultado — sem conexão |
| Busca web `"Careca's Infotec"` | Sem correspondência: só homônimos (Infotec São Caetano, Mogi Guaçu, Breves/PA, Cachoeirinha/RS, Arapongas/PR, Peru/Índia) |
| Busca web + cidade | Retorna apenas `INFOTEC - Soluções Tecnológicas` (CNPJ 43.362.951/0001-13, Afonso Pena, SJP) — **empresa distinta**, consultoria em TI, não Careca's |
| Instagram | Nenhum perfil atribuível encontrado por busca |
| Site oficial | Não encontrado |
| Avaliações públicas | Nenhuma atribuível encontrada |

Regra aplicada: nome parecido não é identidade. Sem dois sinais convergentes,
o candidato é rejeitado.

## 3. O que o proprietário afirma (lead, não fato)

Nota 4,9 · 43 avaliações · categoria assistência técnica de informática ·
endereço, telefone, horário e fotos públicos · Instagram vinculado.
Registrado como `REPORTED_BY_OWNER_PENDING_API_VERIFICATION`. Nada disso pode
aparecer na landing antes de resolução por Places API ou envio do link do perfil.

## 4. Desbloqueio necessário (uma das duas opções)

1. Vincular o conector Google Maps Platform ao projeto — resolvo Place ID, nota,
   número de avaliações, endereço, telefone, horário, fotos e reviews com
   atribuição correta ao Google Maps.
2. O proprietário enviar o link do perfil no Google Maps (ou o Place ID) e o
   @ do Instagram.

## 5. Mapa seção → fonte → evidência

| Seção | Fonte | Conteúdo | Evidência |
|---|---|---|---|
| Hero | REAL | manchete + arte oficial | `banner.webp` (proprietário) |
| Equipamentos atendidos | GENERATED + FACT | 8 itens confirmados | banner |
| Quando procurar | GENERATED + EDITORIAL | sinais de falha por equipamento | conhecimento técnico genérico, sem alegar caso real |
| Como funciona | GRAPHIC + EDITORIAL | avaliação → orçamento → reparo | escopo declarado no banner |
| Loja e identidade | REAL (pendente) | fachada/bancada | requer foto oficial |
| Prova social | GOOGLE | nota, contagem, reviews com autoria e link | **bloqueado** até resolver Places |
| CTA | GRAPHIC | funil próprio | funil `funnel-carecas-infotec` |

## 6. Estratégia definitiva de capa

`brand-led`. A capa atual (`capa.jpg`, composição autoral 1200×630) permanece
válida e é semanticamente legível como assistência técnica. Ela só deve ser
substituída por `real-photo` quando existir fotografia oficial de fachada,
bancada ou atendimento — nunca por imagem gerada apresentada como foto real.

## 7. Mídia gerada planejada (ilustrativa)

Bancada técnica contextual, notebook aberto em manutenção, placa eletrônica em
detalhe e smartphone em diagnóstico — todas marcadas como ilustrativas, jamais
apresentadas como fachada, equipe, loja ou serviço executado.

## 8. Fim da rodada

Entregue: `docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md`,
`docs/portfolio/enrichment/carecas-infotec.json` e este relatório.
