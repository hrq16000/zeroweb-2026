# Relatório final — ciclo 4 do catálogo `/portfolio`

Data: 2026-08-28 · Base: branch `codex/portfolio-catalog-cycle4` integrada ao workspace,
preservando as alterações existentes.

## 1. Entregas

| Item | Estado | Evidência |
|---|---|---|
| Migration `20260828001000_create_portfolio_web_vitals.sql` | aplicada | tabela `public.portfolio_web_vitals` com RLS ativa, `anon`/`authenticated` revogados, leitura/escrita só por `service_role`, índices `(slug, metric, captured_at desc)` e por data |
| `/api/public/portfolio-vitals` | ativo | valida `name` (LCP/CLS/INP), `value` finito ≤ 120000, `id` ≤ 80, `slug` por regex, `path` ≤ 200; sem PII; persiste no banco com fallback em memória e responde 204 mesmo em falha durável |
| Fonte canônica `src/config/portfolio-catalog.json` | ativa | 10 itens canônicos, 7 clientes registrados (`validate:portfolio-catalog`) |
| Cards, filtros, busca, ordenação, paginação | ativos | filtros persistidos na URL (`segment`, `type`, `q`, `sort`), carregamento progressivo, estados vazio/carregando/erro, mobile-first, `prefers-reduced-motion` |
| Isolamento e privacidade dos clientes | preservados | `validate:portfolio-boundaries`, `validate:portfolio-meta`, `validate:portfolio-scaffold`, `client-privacy` |
| `PortfolioUpsellPopup`, `PortfolioHostCredit`, funis individuais | preservados | E2E de pop-up e de funis nos 7 sites |
| Painel `/painel-web-vitals` | novo | p75 de LCP/CLS/INP por slug, amostras e alertas contra budgets 2500 ms / 0,1 / 200 ms, restrito a administradores |
| Lighthouse CI | corrigido | `LHCI_TARGET_URL` aponta para o domínio real; relatórios JSON/HTML publicados como artefato |

## 2. Portões executados

```
tsgo --noEmit                       OK
bun test                            230 pass / 0 fail / 650 assertions
validate:portfolio-catalog          OK — 10 itens, 7 clientes
validate:portfolio-boundaries       OK — 7 sites isolados
validate:portfolio-meta             OK — 6 rotas
validate:portfolio-scaffold         OK — 7 projetos conformes
bun run build                       OK — bundle público limpo (2 avisos em chunks administrativos)
validate-no-public-contact-dist     OK — 311 arquivos, nenhum contato ou segredo
audit:a11y                          OK — nenhuma violação serious/critical
test:e2e:portfolio-popup            OK — 7 sites, pop-up único
test:e2e:portfolio-funnels          OK — todos os funis, redirect WhatsApp 302
test:visual                         OK — 16 capturas, 0,00% de diferença
```

A regressão visual era instável (±3% por carregamento de imagens). A captura passou a
aguardar rede ociosa e imagens decodificadas; as baselines foram regravadas com o layout
atual e agora o gate roda determinístico.

## 3. Lighthouse real (medição de campo, produção)

Execução `lhci autorun` contra o site publicado, 2 execuções por URL, preset desktop.

| URL | Performance | Observação |
|---|---|---|
| `/` | 0,83 | abaixo do budget 0,90 |
| `/blog` | 0,82 | LCP 2533 ms (budget 2500 ms) |
| `/blog/3-palavras-...` | ok | apenas avisos de imagem |
| `/servicos` | ok | avisos de imagem |
| `/servicos/criacao-de-sites` | 0,85 | abaixo do budget |
| `/portfolio` | ok | — |
| `/portfolio/dyzpromo` | ok | — |
| `/portfolio/renata-beauty` | ok | — |
| `/portfolio/r_beauty` | 0,85 | acessibilidade 0,90 |
| `/portfolio/emporio-lelecute` | ok | — |
| `/portfolio/marido-de-aluguel` | ok | — |
| `/portfolio/paraiso-do-hot-dog` | 0,78 | LCP 3252 ms, cache TTL |
| `/portfolio/rm-fretes` | ok | cache TTL |

Correções já aplicadas a partir dessa medição, no site do cliente `r_beauty`:
contraste do botão de reserva, ordem de títulos (h3 → h2) e nome acessível do link do
mapa; contraste do texto auxiliar do feed de Instagram.

## 4. Pendências abertas (não mascaradas)

1. Performance abaixo do budget em `/`, `/blog`, `/servicos/criacao-de-sites`,
   `/portfolio/r_beauty` e `/portfolio/paraiso-do-hot-dog`. Causas medidas: imagens sem
   variante moderna/responsiva e cache TTL curto em assets de terceiros. Os budgets
   permanecem no valor original — nenhum gate foi afrouxado.
2. LCP acima de 2500 ms em `/blog` e `/portfolio/paraiso-do-hot-dog`.
3. Linter de segurança do banco reporta 85 achados preexistentes (views e funções
   `SECURITY DEFINER`, materialized views expostas). A tabela nova é intencionalmente
   service-role-only; a remediação dos achados legados continua pendente.
4. Duplicação residual entre o catálogo canônico e os itens legados da rota `/portfolio`
   segue marcada para migração incremental.
5. Não houve merge em `main`: as mudanças estão no workspace do projeto e devem ser
   revisadas em PR próprio.
