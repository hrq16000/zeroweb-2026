# Reconciliação final do WhatsApp dos portfolios — política SEM COFRE

Documento canônico da política: `docs/PORTFOLIO_WHATSAPP_POLICY.md`.

## Arquitetura final

Fonte única de verdade: `src/config/portfolio-whatsapp.json`, por `clientKey`.

O resolvedor faz apenas: `clientKey` → registro versionado → número ou `null`.

Removidos do caminho de resolução:

- `PORTFOLIO_WHATSAPP_*` (env/secret por portfolio);
- cofre/vault;
- `portfolio_client_settings` e `funnel_recipient` como fonte de destino;
- `portfolio_whatsapp_confirmations` (segunda fonte administrativa);
- fallback institucional 0WEB;
- fallback entre clientes ou destino compartilhado.

O painel `/app/portfolio/whatsapp` passou a ser **somente leitura**: exibe o
estado versionado por projeto. Alteração de número é feita no cadastro do
projeto, por revisão de código.

Gate antirregressão: `tests/portfolio/whatsapp-no-vault-gate.test.ts` falha se
qualquer uma dessas fontes voltar ao resolvedor ou ao painel, se algum
`clientKey` do catálogo ficar sem entrada explícita, ou se um mesmo número for
associado a dois projetos.

## Estado por clientKey

| Estado | Projetos |
| --- | --- |
| WhatsApp próprio configurado | 66 |
| `whatsapp: null` (lead-only) | 26 |
| **Total** | **92** |

`INVALID_FORMAT`: 0 · `CONFLICT`: 0 · `CROSS_CLIENT`: 0.

`whatsapp: null` é estado válido e suportado: o funil coleta os dados, salva o
lead, gera protocolo e encerra normalmente, sem redirect, sem erro e sem exigir
outro contato do visitante. Não é pendência operacional nem bloqueio de merge.

## Validação executada

- `bun test`: 512 aprovados, 0 falhas.
- `bun run build`: aprovado.
- Gates: `validate:portfolio-catalog`, `validate:portfolio-boundaries`,
  `validate:portfolio-meta`, `validate:portfolio-scaffold`,
  `validate:portfolio-performance`, `check:portfolio-projects`,
  `check:portfolio-funnel-operational`, `validate:brand-integrity`,
  `validate:client-privacy`, `validate:dist-contact`, `scan:source-privacy` —
  todos PASS.
- E2E real dos 92 portfolios, desktop e mobile (184 cenários, em lotes):
  132 concluíram com redirect válido para o WhatsApp do próprio cliente e
  52 concluíram em modo lead-only. 0 falhas reais, 0 bloqueios por antiabuso,
  0 cross-client. Woodhouse apresentou instabilidade de roteiro em lote e
  passou na repetição isolada.

Nenhum número foi inventado, pesquisado ou reaproveitado nesta execução.
