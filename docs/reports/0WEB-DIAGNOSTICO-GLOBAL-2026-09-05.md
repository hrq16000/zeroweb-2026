# 0WEB — Diagnóstico global pós-fechamento do /portfolio

Data: 2026-09-05 · Rodada **somente diagnóstica** · CODE_CHANGED = NO
(nenhuma correção implementada; apenas leitura, medição e priorização)

Janela de dados: últimos 30 dias · base completa desde 2026-06-04.

---

## 1. Estado atual do sistema

| Camada | Estado |
|---|---|
| Rotas | 137 arquivos em `src/routes` (113 páginas `.tsx` + 16 sitemaps + endpoints) |
| `/portfolio` | 68 projetos · 68 COMPLETE · STATIC 0 · clones 0 |
| `/servicos` | 28 serviços no banco · 27 ativos · 23 com preço · 16 categorias · checkout com Stripe implementado |
| Backend | `analytics_events` 76.835 linhas · `dynamic_form_leads` 245 · `whatsapp_redirect_tokens` 243 · `wa_funnel_sessions` 359 · **`orders` 0** · **`lead_submissions` 0** |
| Segurança | 0 finding crítico ativo (os 4 restantes já ignorados pelo usuário em decisão anterior) |
| SEO foundations | lint e http PASS (indexável, robots OK, SSR OK, `llms.txt` OK); `metadata_basics` ainda não escaneado |
| Build / Tests / Typecheck | PASS · 350 testes · bundle público limpo |

### Tráfego real (30 dias, por sessões distintas)

| Área | Sessões | Eventos |
|---|---:|---:|
| `/portfolio/*` | **5.931** | 11.886 |
| `/` (home) | 901 | 44.600 |
| `/servicos*` | **3** | 224 |

---

## 2. Problemas encontrados (somente com evidência)

### P-1 · A camada de medição não é confiável

Evidência direta no banco:

- `utm_source` = `"site"` em **56.637 de 56.643 eventos** (30d). Só 6 eventos
  com origem real (`ig`). Não existe atribuição de campanha.
- `referrer` vazio em **6.809 de ~6.900 sessões**. Referrers reais somam ~24
  sessões (lovable.dev, facebook, 0web.com.br).
- Desktop 6.300 sessões × mobile 426 — inversão implausível para tráfego local
  brasileiro; padrão compatível com crawler/bot inflando `/portfolio`.
- Não existe evento `page_view`. Não há como calcular view → CTA por página.

**Consequência:** as perguntas da Frente I (quais páginas geram CTA, quais
serviços convertem, origem dos leads) **não podem ser respondidas hoje**. Isto é
*dado ausente*, não performance ruim.

### P-2 · 68% da telemetria é ruído de um único evento

`social_proof_view` = **38.293 dos 56.612 eventos** dos últimos 30 dias
(55.222 no total histórico). A home dispara ~49 eventos por sessão.
`portfolio_view` inteiro tem 895 eventos.

Custo: tabela poluída, consultas caras, e qualquer análise futura começa tendo
que filtrar ruído.

### P-3 · `/servicos` é uma loja sem visitantes e sem um único pedido

- 3 sessões em 30 dias.
- `orders` = **0 linhas desde 2026-06-04** — o checkout (Stripe + handoff
  assistido) nunca produziu um pedido.
- `/servicos` não aparece entre os 15 caminhos mais acessados.
- Nenhum link de entrada relevante: o tráfego chega no portfólio e não circula.

Não é problema de design da loja — é problema de **ausência de demanda dirigida
até ela**.

### P-4 · O portfólio gera leads para os clientes, quase nada para a 0WEB

| Destino | Leads 30d |
|---|---:|
| `funnel-service` (clientes) | 218 |
| funis de projeto (`paraiso-hot-dog`, `rm-fretes`) | 18 |
| **`diagnostico-0web` (0WEB)** | **4** |
| `funnel-order-support` | 1 |

O `PortfolioUpsellPopup` teve **2.400 exibições** em 30 dias e converteu
**4 diagnósticos** (0,17%). O maior ativo de tráfego da empresa monetiza
terceiros e não a própria 0WEB.

### P-5 · Peso de imagem muito acima do razoável

- `public/images` = **176 MB / 378 arquivos**.
- **74 arquivos acima de 1 MB, somando 135 MB.**
- Piores casos servidos publicamente: `vila-da-capivara/revenda.png` 3,0 MB;
  `vila-da-capivara/capa.png` 2,8 MB; `reuse-house-brecho/capa.png` 2,7 MB;
  `brecho-sao-francisco/capa.png` 2,7 MB; `r-beauty-icon.png` 2,5 MB.
- 114 PNGs contra 78 WebP — capas e heróis em PNG onde WebP resolveria.

Medição objetiva de arquivo, não suposição: uma capa de 2,7 MB é o LCP da página
em rede móvel.

### P-6 · Chunk inicial de 1,6 MB

`dist/client/assets/index-*.js` = **1,6 MB** (total de assets 7,5 MB).
`generateCategoricalChart` (recharts, 369 KB) e `painel` (349 KB) estão em
chunks separados, ou seja, o 1,6 MB é o núcleo comum carregado por todo
visitante — inclusive nos sites de cliente do `/portfolio`.

### P-7 · Duas tabelas de lead, uma morta

`lead_submissions` = 0 linhas; `dynamic_form_leads` = 245. Há 30 referências a
`lead_submissions` no código. Duas fontes de verdade para o mesmo conceito, uma
delas sem nenhum dado — risco de lead cair na tabela errada.

### P-8 · `funnel_error` acontecendo em produção

17 eventos `funnel_error` nos últimos 30 dias, contra 279 conclusões. ~5,7% dos
funis registram erro. Baixo volume absoluto, mas é falha real em superfície de
conversão.

---

## 3. Top 5 oportunidades

Escala 1–5. Prioridade derivada de evidência, não de quantidade de features.

| # | Prio | Área | Problema | Evidência | Impacto | Esforço | Risco | Conf. |
|---|---|---|---|---|---|---|---|---|
| 1 | **P0** | Medição | Atribuição inexistente e telemetria 68% ruído — impossível decidir com dado | `utm_source='site'` em 56.637/56.643; referrer vazio em 6.809 sessões; `social_proof_view` 38.293/56.612; sem `page_view` | 5 | 2 | 1 | 5 |
| 2 | **P1** | Comercial | Portfólio com 5.931 sessões gera 4 diagnósticos para a 0WEB (2.400 popups → 0,17%) | `dynamic_form_leads` por form; `popup_view` 30d | 5 | 3 | 2 | 5 |
| 3 | **P1** | Performance | 74 imagens >1 MB (135 MB) servidas como capa/herói público | `find` em `public/images`; 176 MB totais | 4 | 2 | 1 | 5 |
| 4 | **P2** | Comercial | `/servicos` sem tráfego (3 sessões) e sem nenhum pedido (`orders`=0) | contagem por `path`; tabela `orders` vazia desde junho | 4 | 3 | 2 | 5 |
| 5 | **P2** | Dados | Duas tabelas de lead, `lead_submissions` vazia com 30 referências no código | contagem no banco + `rg` | 3 | 2 | 3 | 4 |

Fora do top 5, registrados: chunk inicial de 1,6 MB (P2, medir antes de agir) e
`funnel_error` a 5,7% (P2, investigar causa antes de mexer no funil).

---

## 4. Dívidas que NÃO existem mais

Registrado explicitamente para impedir que rodadas futuras reabram assunto
encerrado:

| Item | Estado |
|---|---|
| Clones visuais | **0** — não reabrir |
| Clones de motion | **0** — os 6 grupos são afinidade, não duplicação perceptível |
| `SHARED_FALLBACK` | **0** — eliminado |
| `NEEDS_CROP` | **0** — resolvido na Rodada 11 |
| Dívida técnica de capas | **0** — fonte de verdade única e canônica |
| Projetos incompletos | **0** — 68/68 COMPLETE |
| Páginas STATIC | **0** |
| Findings críticos de segurança | **0** ativos |
| Logos placeholder | **0** |

As **34 capas `PENDING` são dependência externa** (material oficial do cliente),
classificadas como `EDITORIAL_BACKLOG`. Não são dívida técnica, não bloqueiam
nada e não devem ser zeradas artificialmente.

Gates confirmados ainda ativos e cobrindo os casos:
`check:portfolio-projects`, `check:portfolio-originality`,
`check:experience-standard`, `validate:portfolio-boundaries`,
`validate:portfolio-scaffold`, etapa `client-privacy` do build,
testes RLS em `tests/rls/`. **Nenhum gate precisa ser criado ou alterado.**

---

## 5. Próxima frente recomendada — UMA

### `MEASUREMENT_TRUTH` — tornar a medição confiável antes de qualquer otimização

**Por quê.** Todas as perguntas comerciais da Frente I dependem de dados que hoje
não existem ou estão contaminados. Sem `page_view`, sem origem real e com 68% da
tabela ocupada por um único evento decorativo, qualquer decisão sobre conversão,
`/servicos` ou upsell seria palpite com aparência de dado. É também a frente mais
barata (esforço 2) e a de menor risco (1) do conjunto — e é pré-requisito das
oportunidades 2 e 4.

**Ganho esperado.** Poder responder, com número: quantas pessoas reais chegam,
de onde, em quais páginas, quantas clicam em CTA, quantas viram lead, e qual
parcela do tráfego do portfólio é humana. Isso define sozinho se a frente
seguinte é upsell, `/servicos` ou performance.

**Risco.** Baixo. Mexe em coleta, não em produto. Riscos a controlar: não enviar
nenhum PII para tracking; não quebrar os eventos que hoje já alimentam os painéis
de funil e leads; preservar histórico (não apagar dados antigos, apenas parar de
gerar ruído novo e marcar o corte).

**Escopo inicial proposto (rodada pequena, sem redesign):**

1. Corrigir a origem: `utm_source`/`referrer` reais em vez do literal `"site"`.
2. Introduzir `page_view` único por rota/sessão.
3. Reduzir `social_proof_view` a uma amostragem ou a um disparo por sessão.
4. Marcar tráfego não humano (user-agent de bot) para não contaminar contagem.
5. Uma consulta de leitura por página: sessões → CTA → lead → WhatsApp.

Sem novo painel: a leitura entra nos painéis existentes se e quando houver
necessidade operacional comprovada.

**Não iniciar agora:** upsell, `/servicos`, imagens, chunk, unificação de
tabelas de lead. Todas ficam registradas e esperam a medição.

---

## 6. Veredito

```text
PORTFOLIO_ORIGINALITY_AND_COVERS = CLOSED (não reabrir)
PORTFOLIO_STATUS                 = MAINTENANCE_MODE
CODE_CHANGED_THIS_ROUND          = NO
NEXT_FRONT_RECOMMENDED           = MEASUREMENT_TRUTH
NEXT_FRONT_STARTED               = NO
```
