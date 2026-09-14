# Continuidade 0WEB — PR #101 "Restaura contrato ZERO_FUNNEL_DRIFT"

Contexto recuperado do handoff. Nada foi alterado nesta rodada.

## Estado confirmado localmente

- HEAD local: `995f9ea7` ("Resgatou estado do projeto") — posterior à base `229e27c9` citada.
- SHA do PR (`63a8a61...`) não existe no remoto local (armazenamento Lovable); checks do PR e conteúdo do SHA só podem ser confirmados no GitHub `hrq16000/zeroweb-2026`.
- `tests/leads/funnel-message-sync.test.ts` ausente e `buildPortfolioQuizMessage` ausente nesta cópia — a correção vive apenas no PR #101.
- Seed administrativo: 92 projetos (gap 92 catálogo × 86 settings confirmado como pendência).
- Fluxo canônico de destino presente: `src/lib/portfolio-destination-confirm.server.ts`, `src/routes/r.whatsapp.$token.ts`, `src/config/portfolio-funnel-destinations.json`.

## Próximos passos obrigatórios (ordem)

1. Confirmar os checks do SHA `63a8a61...` no GitHub Actions.
2. Mergear o PR #101 somente se os gates substantivos estiverem verdes (a ausência local das 3 credenciais Supabase inviabilizou a suíte completa — o teste RLS NÃO está aprovado).
3. Conferir deploy Vercel READY no SHA de merge e validar produção (prévia do funil idêntica à mensagem entregue).
4. Auditar paridade 92 catálogo × 86 `portfolio_client_settings`.
5. Investigar os 28 destinos vazios e os 51 sem revisão com evidência real; nunca usar 0WEB/••••2053 ou números inventados.
6. Toda promoção de destino passa por `src/lib/portfolio-destination-confirm.server.ts` (sem gravação direta).
7. Produzir matriz final honesta — não declarar 100% enquanto houver pendências.

## Fatos do banco (handoff, não reverificados agora)

- `portfolio_client_settings`: 86 registros, 70 publicados, 58 com destino, 28 vazios.
- Revisões: 33 VERIFIED/PASS, 1 INSUFFICIENT_EVIDENCE/FAIL, 1 INSUFFICIENT_EVIDENCE/REVOKED_POLICY_VIOLATION, 51 sem revisão.
- SEO Diff no GitHub falha por secrets `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY` vazios no Actions.

## Notas técnicas

- Runner de testes: `bun test` (não `bunx vitest`).
- Build de produção validado com 4 GB de heap.
- Nenhum número de WhatsApp é promovido sem evidência; mascaramento em UI/CSV é obrigatório.
