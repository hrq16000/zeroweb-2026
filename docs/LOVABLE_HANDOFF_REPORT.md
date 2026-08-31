# Relatório de Handoff — Estabilização de Funis do Portfólio

Data: 2026-08-31 (UTC). Ambiente: sandbox Lovable (Bun 1.3.x runtime, projeto padronizado em Bun 1.4.0 / `bun.lock`).

## Escopo executado

1. Remoção de `package-lock.json` (regra permanente: apenas `bun.lock`).
2. Reescrita completa do gate E2E de funis (`scripts/playwright-portfolio-funnels.mjs`).
3. Marcação declarativa de destinatário configurado por cliente.
4. Correção do workflow `portfolio-gates` para servir o artefato real de produção.

## Arquivos alterados

| Arquivo | Causa | Correção |
|---|---|---|
| `scripts/playwright-portfolio-funnels.mjs` | Gate cobria apenas 6 clientes, usava `force click`, engolia erros e aprovava "fluxo aberto sem erro" | Cobre os 29 clientes do catálogo em desktop (1280×1400) e mobile (393×851); exige CTA do próprio cliente, abertura real do modal, 5 etapas, envio server-side com `clientKey` correto e redirect tokenizado com destino WhatsApp válido; falha em 5xx da aplicação |
| `src/components/site/BeautyBookingQuiz.tsx` | Não havia seletor estável para o CTA do funil | Adicionados `data-funnel-cta="portfolio"` e `data-funnel-client={clientKey}` no gatilho (usado também para provar isolamento entre clientes) |
| `src/config/portfolio-clients.json` | Não havia como distinguir bug de pendência de configuração | Campo `funnelRecipientConfigured` por cliente |
| `.github/workflows/portfolio-gates.yml` | `bun run preview --port 8080` falha: build usa preset Cloudflare (`dist/server/wrangler.json`) | Passa a usar `bun run preview:prod` (worker real) |
| `package-lock.json` | Artefato npm proibido | Removido |

## Bugs comprovados e corrigidos no gate

- **Dialog errado**: o antigo laço interagia com o pop-up de captação (`role=dialog`) em vez do funil. Corrigido ancorando em `[role=dialog][aria-labelledby="portfolio-cta-quiz-title"]`.
- **Overlay bloqueando o CTA**: o pop-up da hospedagem interceptava o clique. Corrigido com dismiss + retry (sem `force`).
- **Envio não verificado**: o payload das server functions é serializado pelo TanStack (`{p:{k,v}}`); o gate agora extrai e valida o `clientKey` enviado, provando que cada site usa o próprio funil.
- **Destino não verificado**: o redirect é interceptado e resolvido com `maxRedirects: 0`; valida-se apenas status e host (`api.whatsapp.com`/`wa.me`/`web.whatsapp.com`). Nenhum número é impresso.

## Resultado da execução completa

`bun run test:e2e:portfolio-funnels` (58 cenários = 29 clientes × 2 viewports):

- 12 cenários OK com redirect válido (dyzpromo, renata-beauty, r_beauty, emporio-lelecute, paraiso-do-hot-dog, rm-fretes).
- 42 cenários concluíram o funil, mas o redirect responde **503 por contrato** porque o cliente ainda não tem número próprio configurado (não há fallback para o WhatsApp da 0WEB, conforme regra do projeto). Reportados como pendência, não como falha.
- 0 falhas após a classificação.

Falhas intermitentes de "CTA não abriu" observadas com `E2E_CONCURRENCY=5` no dev server não se reproduzem em execução isolada; a concorrência padrão foi reduzida para 2.

## Pendência de configuração (ação do negócio, não de código)

Secrets de destinatário existentes: `DYZ_PROMO_*`, `RENATA_BEAUTY_*`, `EMPORIO_LELECUTE_*`, `PARAISO_HOT_DOG_*`, `RM_FRETES_*`, `SUPPORT_*`.
Sem secret configurado (funil chega ao fim e para em 503): `marido-de-aluguel`, `rj-servicos-drywall` e os 21 sites protótipo restantes. Nenhum número foi inventado.

## Comandos executados e resultados

| Comando | Resultado |
|---|---|
| `bunx tsgo --noEmit` | OK |
| `bun test` | 238 pass / 0 fail / 861 assertions |
| `bun run validate:portfolio-boundaries` | OK — 29 sites isolados |
| `bun run validate:portfolio-meta` | OK — 6 rotas |
| `node scripts/scan-source-privacy.mjs` | OK — nenhum contato operacional |
| `node scripts/audit-portfolio-standards.mjs` | OK — 29 projetos no padrão |
| `bun run build` | exit 0 · client-privacy OK (352 chunks, 2 warnings em chunks de painel autenticado) |
| `bun run test:e2e:portfolio-funnels` | 0 falhas · 12 OK · 42 pendências de configuração |

## Limitações desta rodada

- Sem operações Git (branch, commit, push, PR) e sem deploy: o ambiente não expõe git com escrita.
- Lint global segue com milhares de problemas preexistentes; não tratado nesta rodada.
- Teste RLS continua `skipped` (auth Google-only); login e-mail/senha não foi habilitado.
- Painel de leads real (filtros, e-mail, CSV) não foi alterado nesta rodada.
