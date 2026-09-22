# PORTFOLIO_AUTONOMOUS_CREATION — nome + localização → página pronta

Status: pipeline incremental. Cada rodada só avança após validação da anterior.

## Objetivo

O operador informa apenas **nome do negócio** e **localização**. O sistema deve
pesquisar, resolver identidade, montar evidências, criar conteúdo, direção
visual, mídias, funil, SEO, QA e publicar somente quando todos os gates passam.

A ausência de Google Business Profile, site ou rede social **não é erro**. Ela
muda a estratégia: menos afirmações factuais e mais composição editorial
contextual, sem fingir que imagem gerada é foto do estabelecimento.

## Rodadas

### R1 — Intake mínimo + pesquisa autônoma multissinal — IMPLEMENTADA

Entrada: nome + endereço/bairro/cidade.

Pesquisa em escada:
1. Google Maps / candidatos locais;
2. resolução determinística por nome + localidade;
3. enrichment completo quando a entidade resolve com confiança;
4. fallback Google Web quando não existe ficha local;
5. buscas direcionadas para Instagram, Facebook e TikTok;
6. escada de mídia pública: site → redes oficiais → embeds públicos → marketplace/seller → busca pública → mirrors/indexadores; bloqueio de um provider não encerra a pesquisa;
7. ingestão/versionamento de mídia real resolvida com provenance quando tecnicamente possível;
8. ledger compacto em `source_snapshot.autonomous_research`.

Saída sempre `draft`. Telefone público nunca vira WhatsApp automaticamente.
`NONE` (nenhuma presença digital) é resultado válido; `PROVIDER_BLOCKED`
exige reexecução e nunca é confundido com “empresa não existe”.

### R2 — Fatos → conteúdo completo + SEO + arquitetura de página

Gerar briefing editorial, categorias, seções, FAQ, copy, discovery index,
SEO/schema e tipo de funil usando apenas fatos verificados + inferências
editoriais explicitamente marcadas. Implementar política de confiança por campo
e remover do texto qualquer alegação que dependa de evidência ausente.

### R3 — Direção criativa + mídia autônoma

Classificar mídia real encontrada, direitos/proveniência e adequação de hero.
Seguir `PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`: antes de declarar falta de
mídia, esgotar as fontes públicas aplicáveis, inclusive redes oficiais, embeds,
marketplaces/seller, busca e mirrors/indexadores. `PROVIDER_BLOCKED` não equivale
a ausência de mídia. Versionar assets acessíveis de forma estável e preservar a
origem. Para loja/catálogo, foto real de produto é obrigatória quando resolvível.
Somente depois dessa escada, quando faltar mídia utilizável, gerar hero/capa/OG/
editoriais contextuais. Nunca gerar “foto falsa da loja”; mídia gerada representa
o segmento/ocasião, não evidência do negócio.

### R4 — Composição autoral automática

Escolher família estrutural, ritmo, variantes, microinterações e composição a
partir do negócio e do inventário de mídia. Comparar fingerprint com portfolios
próximos e rejeitar composição genérica ou excessivamente semelhante.

### R5 — QA autônomo e autocorreção

Executar 390/768/1440, acessibilidade, crop, hero, capa, OG, funil, isolamento,
SEO, performance e quality matrix. Falha corrigível volta automaticamente para
a etapa correspondente. `PASS` precisa de evidência real; nunca presumido.

### R6 — Publicação confiável + pós-publicação

READY somente com todos os gates. Publicar, validar URL real, sitemap, metadata,
funil e observabilidade. Pós-publicação gera relatório curto e mantém revalidação
de dados externos separada da renderização pública.

## Regra de autonomia

O sistema pergunta ao operador apenas quando existe **conflito factual real**
que possa trocar a identidade do negócio ou quando uma ação irreversível exigir
aprovação. “Não achei Google/Instagram/site” não gera pergunta: o pipeline segue
com estratégia para baixa presença digital.
