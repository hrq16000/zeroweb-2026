# DIAGNÓSTICO DE CONVERSÃO DO /portfolio — 2026-09-05

Escopo: investigação com evidência dos gargalos GRUPO A (lead > 0, WhatsApp = 0) e
GRUPO B (visitas sem intenção). `MAINTENANCE_MODE` preservado: nenhuma alteração de
design, motion, SEO, capa, CTA, funil, tracker, base, painel ou rota.

---

## 1. GRUPO A — causa raiz encontrada (não é abandono do usuário)

O lead é gravado, o token é criado (~0,5 s depois, validade 24 h) e o usuário é
redirecionado para `/r/whatsapp/:token`. Nesse ponto o servidor precisa resolver o
número **privado do cliente** por `clientKey`. Quando esse número não está
configurado, a rota devolve a página **“Canal indisponível” (HTTP 503)** e **não
consome o token** — por isso `used_at` fica nulo e a métrica WHATSAPP marca 0.

Evidência direta, já registrada pelo próprio sistema em `anomaly_alerts`
(`kind = 'funnel_whatsapp_routing'`, `reason = missing_client_whatsapp_number`):

| clientKey | alertas | último |
|---|---:|---|
| marido-de-aluguel | 48 | 2026-08-31 |
| confeitaria-chyrley | 42 | 2026-08-31 |
| eisenfer-tubos-acos | 40 | 2026-09-05 (QA desta rodada) |
| rj-servicos-drywall · aguia-sul-sinalizacao · mp-festas-eventos · salao-da-marcia · mary-diarista · paulo-mestre-de-obras · acai-total-araucaria · jkl-marcenaria · lucas-arruma-maquina-lavar · diego-montador-moveis · eletro-solucoes-eficazes · ecommerce-on · eletrovale-eletromecanica · refrigeracao-maresia · no-brilho-higienizacao · espaco-cih-luh · ag-electrical-services | 36 cada | 2026-08-31 |
| lk-alvenaria · vila-da-capivara | 30 | 2026-08-31 |
| studio-de-cilios | 24 | 2026-08-31 |

Contraprova (controles saudáveis): os únicos projetos com número configurado —
`rm-fretes`, `paraiso-do-hot-dog`, `dyzpromo`, `renata-beauty`/`r_beauty`,
`emporio-lelecute`, `heloa-gas` — são exatamente os que apresentam tokens
consumidos (`rm-fretes` 26 tokens/56 usos; `paraiso` 20/36).

Verificação de código (leitura, sem alteração): o mapa de números privados em
`src/lib/whatsapp-redirect.server.ts` cobre 17 `clientKeys`, e apenas **6**
possuem o segredo correspondente provisionado. Para os demais 51 projetos, um
lead real nunca consegue abrir a conversa.

**Classificação por projeto do Grupo A:** `MISSING_CLIENT_WHATSAPP_NUMBER`
(configuração/provisionamento), **não** `USER_ABANDON`, **não** bug de UI,
**não** falha de token.

## 2. QA end-to-end executado (390 px e 1440 px)

Fluxo real em `marido-de-aluguel` e `eisenfer-tubos-acos`: CTA abre o quiz,
os 5 passos avançam, o envio grava o lead, cria o token e navega para
`/r/whatsapp/:token`. A cadeia cliente funciona nas duas larguras. O único ponto
de falha é o servidor não encontrar o número do cliente (503). Esse QA gerou
2 leads técnicos em 2026-09-05 — devem ser desconsiderados como demanda real.

## 3. Contaminação sintética confirmada (2026-08-31)

188 leads/tokens em 29 slugs, mesma identidade anonimizada (um único hash de IP,
nome/telefone repetidos, sem user-agent), em varredura sequencial. Esse lote
**não** representa demanda orgânica e não deve ser usado como base de decisão
comercial. Ele apenas evidenciou a falha de configuração acima.

## 4. GRUPO B — amostra insuficiente

`sos-presentes-cosmeticos` (48 views), `angel-mix-brecho` (30), `lolipa-arte-em-festas`
(20) e `heloa-gas` (19) têm 100% dos eventos **pré-cutover V2** (`metadata_json.tv`
nulo), concentrados em ~7 dias e com um visitante distinto por visita — padrão de
crawler/QA. **SAMPLE_SUFFICIENT = NO.** Nenhuma conclusão de UX/CTA é sustentável
antes de volume V2 humano.

## 5. Lacuna de medição registrada (não corrigida)

`FunnelCTAButton` emite `contact_cta_click`, evento que a função canônica de
métricas não conta (ela usa `funnel_open|wa_funnel_open`). Em 90 dias há apenas
4 desses eventos em 2 slugs, então hoje não altera nenhuma leitura. Fica como
`MEASUREMENT_GAP` observado, sem mudança de código.

## 6. Resultado

```text
GROUP_A_ROOT_CAUSE   = MISSING_CLIENT_WHATSAPP_NUMBER
GROUP_A_PROJECTS     = 23 (com alerta registrado)
UI_BUG               = NO
TOKEN_BUG            = NO
REDIRECT_BUG         = NO (comportamento correto diante de configuração ausente)
SYNTHETIC_BATCH      = 2026-08-31 (188 leads, 29 slugs)
GROUP_B_SUFFICIENT   = NO
CODE_CHANGED         = NO
NEXT_ACTION          = provisionar o WhatsApp real de cada cliente afetado
```

Próximo passo depende de dado externo: o número oficial de WhatsApp de cada
cliente. Não é possível inferir, gerar ou reaproveitar número de outro projeto.
