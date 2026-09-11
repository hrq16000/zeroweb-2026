# PORTFOLIO LANDING QUALITY MATRIX

Camada de avaliação **editorial e visual** de um `/portfolio/:slug`.
Complementa — não substitui — `docs/PORTFOLIO_PROJECT_LIFECYCLE.md`,
`docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md` e
`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`.

Não é um sistema paralelo: a matriz é uma etapa do lifecycle, executada
**depois da implementação e antes de `readiness` / `publish`**.

```text
research → evidence → media inventory → media plan → blueprint →
implementation → QUALITY MATRIX → fix gaps → readiness → publish
```

Registro por projeto: `docs/portfolio/quality-matrix/<slug>.json`.
Gate: `bun run check:portfolio-landing-quality` (também consumido pelo
readiness). Legado sem manifesto nunca é avaliado.

---

## 1. Dimensões

`ENTITY · CONTENT · MEDIA · VISUAL_COMPOSITION · ORIGINALITY · DISCOVERY ·
SEO · CONVERSION · PROOF · RESPONSIVENESS · PERFORMANCE · ACCESSIBILITY · QA`

Cada dimensão recebe um único status:

| Status | Significado |
|---|---|
| `PASS` | atende o padrão |
| `WARNING` | aceitável, com dívida registrada |
| `FAIL` | reprova o projeto |
| `NOT_APPLICABLE` | não se aplica a este negócio |

`FAIL` em qualquer dimensão reprova, independentemente do score.

## 2. Entity research matrix

Todo projeto novo deve **tentar** descobrir: Google Business/Maps, avaliações
Google, fotos Google, site oficial, Instagram, Facebook, TikTok, YouTube e
LinkedIn quando pertinentes, diretórios públicos, telefone, WhatsApp, endereço,
horário, serviços, produtos, categorias, identidade, fotos e demais evidências.

> A ausência de uma rede social **não** é falha. A ausência de pesquisa é falha.

Ledger obrigatório por alvo: `searched · found · resolved · verified ·
accessible · ingestable · usable`.

## 3. Search escalation ladder

**Nível 1 — identificadores conhecidos:** nome exato, aliases, telefone,
cidade, endereço, domínio, nome + categoria.

**Nível 2 — pesquisa expandida:** nome + Instagram/Facebook/avaliações/Google
Maps, telefone + rede, endereço + nome, `site:instagram.com`,
`site:facebook.com`, diretório relevante + nome.

**Nível 3 — providers:** Google Places, Maps, APIs oficiais, providers
autorizados (ex.: SerpApi server-side).

Nunca concluir "não existe" porque um provider não está conectado. Nesse caso:
resolver por pesquisa pública, guardar o `placeId`, registrar evidências e
marcar `ingestion = waiting_for_provider`.

## 4. Regra global de Google

Procurar sempre: `placeId · rating · reviewCount · address · phone · hours ·
photos · reviews · mapsUrl`. Com provider conectado, ingerir com política e
atribuição. Sem provider, resolver a entidade mesmo assim e registrar
`waiting_for_provider`.

## 5. Redes sociais

Resolver perfil por sinais combinados (nome, telefone, endereço, logo, cidade,
site, links vindos do Google). Homônimo por nome **não** resolve.
Registrar: `platform · handle · url · confidence · evidence · status`.

Perfil oficial confirmado alimenta a landing: identidade visual, produtos,
serviços, fotos, ambiente, trabalhos, linguagem, categorias, FAQ e
diferenciais — como conhecimento, e como mídia apenas conforme direitos.

## 6. Coverage visual matrix

Para cada bloco relevante da landing registrar:
`section · visualRole · mediaDecision · asset · provenance · quality · status`.

`mediaDecision ∈ REAL_BUSINESS_MEDIA · GOOGLE_MEDIA · OFFICIAL_SOCIAL_MEDIA ·
LICENSED_MEDIA · GENERATED_CONTEXTUAL_MEDIA · GRAPHIC_MEDIA ·
STRUCTURED_ICONOGRAPHY · EDITORIAL_TYPOGRAPHY · NO_MEDIA_NEEDED`.

A regra **não** é "toda seção precisa de foto". É: **toda seção relevante
precisa de uma solução visual deliberada** — tipografia, diagrama, ícones,
composição editorial, números, processo, motion, imagem ou ilustração. O que
não pode existir é a sensação de "faltou colocar alguma coisa aqui".

### 6.1 VISUAL_DEAD_ZONE

Avaliar em `390px`, `768px` e desktop. Sinais de problema:

- grande área vazia sem função compositiva;
- coluna enorme ocupada só por um ícone pequeno;
- background sem conteúdo;
- desequilíbrio excessivo entre colunas;
- seção que parece incompleta;
- card gigante com pouca informação;
- mídia ausente onde a composição claramente esperava mídia.

Vazio intencional é permitido — desde que tenha função compositiva clara.

### 6.2 Densidade e distribuição

Avaliar `visualDensity · sectionRhythm · mediaDistribution ·
compositionVariety`. Não concentrar todos os recursos visuais em uma seção
(hero + 6 blocos de texto + uma galeria = ritmo ruim). Não há número fixo de
imagens; há obrigação de alternância entre mídia, texto, cards, composição,
processo, prova e CTA, evitando longas sequências de blocos idênticos.

### 6.3 Media source mix

Registrar a distribuição: `real · external_verified · licensed · generated ·
graphic`. Evitar landing 100% stock ou 100% gerada quando existe material real
utilizável — e evitar o inverso, usar fotos reais ruins em toda posição só
porque são reais (ver lifecycle §7.1).

## 7. Hero matrix

Avaliado separadamente: `brandMatch · segmentMatch · visualImpact ·
premiumFeel · legibility · contrast · composition · mediaQuality ·
CTAVisibility · mobileCrop · desktopCrop · originality`.

`FAIL` se parecer banner fotografado, parecer placeholder, imagem muito
desfocada, texto disputando com o fundo ou mídia que não representa o segmento.

## 8. Cover matrix

`identityMatch · segmentMatch · smallCardReadability · contrast · focalPoint ·
crop · visualQuality · genericPenalty · duplicatePenalty` **+
`portfolioRecognition`**: "esse card é reconhecível entre dezenas de outros?"

## 9. Content depth

A landing responde: quem é? o que oferece? que necessidades resolve? para quem?
como funciona? por que considerar? quais evidências existem? como contratar?
quais dúvidas precisam de resposta? Não inventar conteúdo para completar a
matriz — lacuna sem fonte vira `WARNING` + `ownerRequired`.

## 10. Proof matrix

Pesquisar reviews Google, depoimentos reais, cases, fotos reais, certificações,
projetos, clientes e números comprováveis. Sem prova: `NOT_APPLICABLE` ou
`NOT_AVAILABLE`. **Nunca** gerar prova artificial.

## 11. Discovery / SEO / Conversion

**Discovery:** testar nome, alias, segmento, serviço, produto/equipamento,
problema, localização e consultas negativas. Índice não testado não publica.

**SEO:** `title · description · H1 · canonical · OG · alt · schema · entity
consistency · locality · sameAs · services · internal links · sitemap`. Dado
externo variável carrega `lastVerifiedAt`.

**Conversion:** CTA principal, CTA intermediário, `funnelType`, contexto de
WhatsApp server-side, tracking, acessibilidade mobile do CTA, mensagem coerente
e contexto de localização quando disponível.

## 12. Mobile quality

Não basta "sem overflow". Avaliar hierarquia, leitura, crop, cards, CTA, espaço
vazio, sticky, botão flutuante, menu, altura das seções e ritmo. Caber em 390px
não é qualidade.

## 13. Score (auditoria, não gamificação)

`Entity 10 · Content 10 · Media 15 · Visual 15 · Originality 10 · Discovery 10 ·
SEO 10 · Conversion 10 · Responsive/QA 10 = 100`.

O score existe para comparar auditorias no tempo. **Não maximizar número**: um
P0 reprova com qualquer nota.

## 14. P0 — FAIL imediato

- capa semanticamente errada;
- hero claramente inadequado;
- entidade não pesquisada;
- serviço inventado;
- review fictício;
- mídia gerada apresentada como real;
- funil ou CTA quebrado;
- busca que não indexa o projeto;
- overflow grave;
- asset importante ausente;
- seção claramente incompleta (dead zone).

## 15. TECHNICAL PASS ≠ EDITORIAL PASS

O gate separa:

- `technicalPass` — build, types, testes, rotas, gates, readiness técnico;
- `editorialPass` — entity, content, media, visual, originality, proof.

`READY` exige **os dois**. Build PASS nunca significa landing pronta.

## 16. Contrato do registro

```jsonc
{
  "slug": "<slug>",
  "matrixVersion": 1,
  "evaluatedAt": "YYYY-MM-DD",
  "technicalPass": true,
  "editorialPass": true,
  "score": { "total": 0, "byDimension": { "MEDIA": 0 } },
  "dimensions": { "ENTITY": { "status": "PASS", "notes": "" } },
  "hero": { "status": "PASS", "criteria": {} },
  "cover": { "status": "PASS", "criteria": {} },
  "coverage": [
    { "section": "", "visualRole": "", "mediaDecision": "", "asset": "",
      "provenance": "", "quality": "", "status": "PASS" }
  ],
  "deadZones": [],
  "mediaSourceMix": { "real": 1, "generated": 4, "graphic": 1 },
  "p0": [],
  "warnings": [],
  "ownerRequired": []
}
```

## 17. Owner required

Só pedir ao proprietário o que não pode ser resolvido por pesquisa, fontes
oficiais, redes, Google, mídia licenciada, geração contextual ou composição
gráfica. Não criar dependência desnecessária.
