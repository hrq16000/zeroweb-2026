# Adoção da política SEM COFRE (PR #106 / docs/PORTFOLIO_WHATSAPP_POLICY.md)

## Pré-condição (bloqueio atual)
O commit `2e784d4` da branch `fix/restore-portfolio-whatsapp-originals` ainda não está acessível neste ambiente (topo local `00ef18d5`; sem o documento nem o catálogo versionado). A PR #106 precisa estar mesclada na `main` do GitHub (ou a branch enviada ao remote visível) para que a sincronização traga o conteúdo. Sem isso, nada é implementado — não reconstruir a política por conta própria nem inventar números.

## Regras a adotar (já recebidas e confirmadas)
- WhatsApp de portfolio é dado comum do próprio clientKey (como endereço/contato), nunca segredo/vault.
- Fonte canônica: `src/config/portfolio-whatsapp.json` — `whatsapp` por clientKey, número ou `null`.
- Sem env/secret obrigatório; sem `portfolio_client_settings` como fonte obrigatória.
- Com número: funil → lead salvo primeiro → WhatsApp do mesmo clientKey.
- Sem número: funil → lead/protocolo → encerra normalmente, sem erro, sem "canal indisponível", sem redirect.
- Nunca outro cliente nem institucional 0WEB (2053) como fallback.
- external_store/demos/amostras podem ficar sem WhatsApp quando não é o canal real.
- Migração: copiar números que já funcionam → validar isolamento → só depois retirar env/secrets/vault/tabela do caminho de resolução, sem quebrar portfolios bons.
- NÃO alterar design, textos, imagens, SEO, motion, identidade; NÃO tocar /servicos.

## Passos (após a sincronização chegar)
1. Sincronizar com a `main` oficial do GitHub e confirmar o SHA recebido (inclusive `2e784d4` na história). Nada é editado antes dessa confirmação.
2. Ler `docs/PORTFOLIO_WHATSAPP_POLICY.md` e o resolvedor atualizado no estado recebido; mapear o que a PR já fez.
3. Corrigir apenas o necessário para build/gates/E2E verdes sob a nova política:
   - `bun install --frozen-lockfile`; `bun test`; `bun run build`.
   - Gates: validate:portfolio-catalog, -boundaries, -meta, -scaffold, -performance, check:portfolio-projects, -readiness, -funnel-operational, validate:client-privacy, validate:dist-contact, validate:brand-integrity.
   - E2E dos funis (harness atual, em lotes com concorrência controlada); atualizar o harness apenas se a fonte de verdade de destinatário mudou (portfolio-whatsapp.json substitui o estado anterior), mantendo o contrato: redirect tokenizado válido = OK; sem número = conclusão honesta (lead + protocolo, sem redirect) = OK; fallback inventado = falha.
4. Verificar isolamento (clientKey correto, sem cross-client, sem institucional, número fora do bundle público) e reconciliar contagens CONFIGURED/MISSING conforme o novo catálogo versionado — sem inventar números.
5. Atualizar `docs/reports/PORTFOLIO-WHATSAPP-RECONCILIATION.md` com o estado pós-política.
6. Publicação somente com todos os gates e E2E verdes, via PR → main; relatório em português com veredito exato.

## Fora de escopo
Vercel/DNS/hosting; /servicos; redesign de landings; inventar números; reintroduzir vault/secrets para WhatsApp de cliente.
