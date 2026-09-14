# Handoff técnico 0WEB — snapshot de estado (14/09/2026, somente inspeção)

Nada foi alterado: sem edições de código, sem migrations, sem publicação.

## 1. Commit atual

- Branch ativa e `main` estão no mesmo ponto: **`229e27c9` "Criou telas e respostas"** (13/09/2026), igual a `origin/main`. Árvore limpa (`git status` vazio).
- Últimas rodadas em `main` (todas 13/09): `portfolio-confirmation-reply.ts` (resposta padrão copiável), `partners.functions.ts`, telas `app.parcerias.tsx`, `app.trafego.tsx`, `app.leads.marcas.tsx`, `app.resultados.tsx`, `app.tsx` (navegação), `routeTree.gen.ts`, relatórios `reports/portfolio-funnel-context.*`.
- Antes disso: série de commits de política — `#99 exclusividade visual obrigatória`, `zero-generic` (5 commits), `#98 discovery de skills e layout engineering`.

## 2. REGRESSÃO CRÍTICA CONFIRMADA — correção da mensagem do funil não está em `main`

A unificação prévia↔mensagem de WhatsApp existe apenas no commit **`5900fe2a` "Unificou geradores de texto"**, na branch `edit/edt-e2c4a509-...`. Verificado: `git merge-base --is-ancestor 5900fe2a main` → **NÃO**.

Consequência (fato, não hipótese):
- `tests/leads/funnel-message-sync.test.ts` **não existe** na árvore atual;
- `src/lib/portfolio-quiz-copy.ts` exporta só `buildPortfolioQuizPreviewMessage` (o gerador canônico `buildPortfolioQuizMessage` não está presente);
- `src/routes/r.whatsapp.$token.ts` **não contém** o bloco `isPortfolioQuizLead`.

Ou seja: em `main` — e portanto em produção — a divergência entre a prévia da página e o texto que chega no WhatsApp **provavelmente voltou a existir**. Arquivos do commit perdido: `portfolio-quiz-copy.ts`, `portfolio-quiz-copy.test.ts`, `whatsapp-redirect.helpers.ts`, `r.whatsapp.$token.ts`, `BeautyBookingQuiz.tsx`, `dynamic-funnel.functions.ts`, `docs/PORTFOLIO_GLOBAL_STANDARDS.md`, `tests/leads/funnel-message-sync.test.ts`.

## 3. `/portfolio/:slug` — o que mudou recentemente

- **ADHONEP Curitiba**: composição autoral em `src/components/site/AdhonepCuritibaPage.tsx`; assets próprios em `public/images/adhonep-curitiba/` (`capa.jpg` 72 KB, `hero-abstrato.jpg`, `hero-reuniao-executiva.svg`, `icone-abstrato.png`) e `src/assets/adhonep-curitiba-hero-editorial-v2.png.asset.json`. Capa registrada em `portfolio-cover-status.json` como `origin: VISUAL_REVIEW`, `reviewedAt: 2026-09-13`, `status: VALID`.
- Migrations do funil ADHONEP presentes: `20260913062811_seed_adhonep_curitiba_funnel.sql` e `20260913190000_seed_adhonep_curitiba_funnel_real.sql`.
- Telas administrativas novas (parcerias, tráfego, resultados, leads por marca) e resposta padrão copiável em `src/lib/portfolio-confirmation-reply.ts`.

## 4. Gates e políticas existentes

`prebuild` encadeia ~30 verificações, entre elas: `validate-brand-integrity`, `check-experience-skill-policy`, `validate-portfolio-boundaries/catalog/meta/scaffold/regional/presence-kit/logos/assets/icons/performance`, `scan-source-privacy`, `audit-portfolio-standards`, `sync-portfolio-quiz-configs --check`, `build-portfolio-admin-seed --check`, `check-portfolio-projects`, `check-portfolio-runtime-overrides`, `audit-portfolio-funnel-context --check`, `check:portfolio-blueprints`, `check:portfolio-originality`, `check:portfolio-uniqueness`, `check:portfolio-funnel-operational`, `check:portfolio-visual-quality:enforce`, `check-portfolio-landing-quality`, `check-portfolio-project-readiness`.

Configs relevantes em `src/config/`: `portfolio-zero-generic-policy.json`, `portfolio-structural-families.json`, `portfolio-originality.json`, `portfolio-visual-quality.json`, `portfolio-motion-profiles.json`, `global-motion-contract.json`, `motion-choreography.json`, `experience-capabilities.json`, `skill-marketplace-catalog.json`, `portfolio-funnel-destinations.json`, `portfolio-clients.json`, `portfolio-catalog.json`, `portfolio-global-config.json`, `portfolio-admin-seed.json`.

Relatórios já gerados (não precisam ser refeitos): `reports/portfolio-originality*`, `reports/portfolio-visual-quality*`, `reports/portfolio-funnel-context*`, `reports/experience-standard.json`, `seo-reports/portfolio-standards-report.json`, `seo-reports/client-privacy-report.*`, `seo-reports/source-privacy-report.*`.

## 5. Backend (Lovable Cloud / Supabase)

- Project Ref: `lxajhxocyqzwwbcfahya` (mesma instância para preview e publicado). Nenhum segredo exibido.
- `portfolio_client_settings`: **86 registros**, **70 publicados**, 86 com funil habilitado, **58 com destino gravado**, **27 com `seo_schema`**.
- `portfolio_destination_requests`: **tabela vazia** — nenhum envio foi registrado até agora, apesar da tela existir.
- Leads por marca (`dynamic_form_leads`), topo: rm-fretes 27, dyzpromo 16, r-beauty 13, paraiso-do-hot-dog 12, emporio-lelecute 12, renata-beauty 12, marido-de-aluguel 8, adhonep-curitiba 7 (último em 13/09 22:14).
- ADHONEP, `marido-de-aluguel` e `paulo-mestre-de-obras`: publicados, funil ativo, com destino — mas **sem `seo_title`/`seo_schema`** (ADHONEP e paulo com título vazio).

## 6. Destinos de WhatsApp — `src/config/portfolio-funnel-destinations.json`

19 entradas (o arquivo guarda proveniência, nunca números):
- **VERIFIED (5)**: carecas-infotec, moreira-auto-mecanica, jkl-decor, paraiso-do-hot-dog, adhonep-curitiba.
- **CONFLICT (1)**: marido-de-aluguel (candidato é o número institucional 0WEB → `INSTITUTIONAL_FORBIDDEN`).
- **INSUFFICIENT_EVIDENCE (8)**: dyzpromo, emporio-lelecute, estrutura-nacional, heloa-gas, r-beauty, renata-beauty, rm-fretes, sscons.
- **UNRESOLVED (5)**: ag-electrical-services, confeitaria-chyrley, rj-servicos-drywall, mp-festas-eventos, refrigeracao-maresia.

As demais marcas do catálogo não têm entrada = destino não verificado. Nenhum número novo foi encontrado por pesquisa pública; falta confirmação do próprio titular.

## 7. Pendências

Fatos confirmados:
- Correção da mensagem do funil ausente em `main` (item 2).
- `portfolio_destination_requests` vazia — a fila de envios existe mas nunca foi alimentada.
- 59 de 86 registros sem `seo_schema`; ADHONEP e paulo-mestre-de-obras sem `seo_title`.
- Mestre dos Serviços segue bloqueado por destino institucional.
- `roadmap.md` tem 7 rodadas atuais todas em aberto (telas vazias, consolidação de leads, QA de captação, propostas de destino, motion/SEO/mídia, publicação individual, gates finais).

Hipóteses (não verificadas nesta inspeção):
- Se a Vercel builda a partir de `main`, a produção está sem a correção da mensagem — não consegui inspecionar a Vercel daqui.
- A `SUPABASE_SERVICE_ROLE_KEY` na Vercel `zeroweb-2026` pode continuar ausente; não é acessível pelo Lovable Cloud.

## 8. Onde um novo agente deve começar a ler

1. `AGENTS.md` e `docs/0WEB_EXECUTION_CONTRACT.md`
2. `docs/PORTFOLIO_GLOBAL_STANDARDS.md`, `docs/PORTFOLIO_FUNNELS.md`, `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`
3. `src/lib/portfolio-funnel-config.ts`, `portfolio-quiz-copy.ts`, `whatsapp-redirect.helpers.ts`, `whatsapp-redirect.server.ts`, `src/routes/r.whatsapp.$token.ts`
4. `src/config/portfolio-funnel-destinations.json`, `portfolio-clients.json`, `portfolio-global-config.json`
5. `src/routes/portfolio.$slug.tsx` e `src/components/portfolio/PortfolioStandardShell.tsx`
6. `roadmap.md` + `.lovable/plan/plano-de-execução-zona-portfolio-2026-09-13.md`

## 9. Próximo passo sugerido (não executado)

Recuperar `5900fe2a` para `main` (cherry-pick/merge da branch `edit/edt-e2c4a509-...`), rodar `bun test` + `bun run build` e só então republicar. Nada disso foi feito nesta mensagem.
