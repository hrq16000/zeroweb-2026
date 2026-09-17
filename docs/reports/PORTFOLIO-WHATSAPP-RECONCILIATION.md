# PORTFOLIO — RECONCILIAÇÃO DE DESTINOS DE WHATSAPP

Atualizado: 2026-09-16 · Base: main + conteúdo da PR #106 (`fix/restore-portfolio-whatsapp-originals`, commit de política `2e784d4`)
Política vigente: **SEM COFRE** — `docs/PORTFOLIO_WHATSAPP_POLICY.md`

## 1. Escopo e regras aplicadas

- Fonte única de verdade: **dado versionado do próprio portfolio** em
  `src/config/portfolio-whatsapp.json` (`contacts[clientKey].whatsapp`:
  número ou `null`), resolvido por `resolveVersionedPortfolioWhatsApp`.
- **Não há** cofre/vault, secret/env obrigatório nem
  `portfolio_client_settings` no caminho de resolução.
- Nenhum número foi copiado de arte, screenshot, migration antiga ou de outro
  cliente. Nenhum destino inventado. Nenhum fallback institucional (2053).
- Resolução permanece **server-side** e o bundle público continua sem contato
  operacional (`validate:client-privacy` e `validate:dist-contact` verdes).

## 2. Classificação por clientKey (92 projetos canônicos)

| Estado | Qtde |
|---|---|
| CONFIGURED | 66 |
| MISSING | 16 |
| NOT_APPLICABLE | 10 |
| INVALID_FORMAT | 0 |
| CONFLICT | 0 |
| CROSS_CLIENT | 0 |

- **CONFIGURED (66)**: número versionado válido (10–15 dígitos) para o próprio
  clientKey. Nenhum valor impresso em log, relatório ou chat.
- **NOT_APPLICABLE (10)**: WhatsApp não é o canal real (amostras/demos):
  `angel-mix-brecho`, `bh-barreiro-marmitas`, `guaratuba-atelie-presentes`,
  `guaratuba-oficina-nautica`, `guaratuba-reparos-residenciais`,
  `guaratuba-sabores-da-baia`, `mirassol-conserta-celular`,
  `mirassol-delicias-caseiras`, `uberlandia-eletrica-residencial`,
  `papelemi-personalizados`.
- **MISSING (16)** — `BLOCKED_MISSING_OFFICIAL_CONTACT`, sem evidência
  inequívoca do próprio cliente: `marido-de-aluguel`,
  `santos-montador-de-moveis`, `woodhouse-hamburgueres`,
  `galileu-locacao-brinquedos`, `artesanatos-darleia-oliveira`,
  `fernanda-amaral-drywall`, `ton-e-cor`, `raphael-construcoes`,
  `almeida-torres`, `casa-nativa`, `kitutes-na-mesa`, `enoel-portas`,
  `mania-de-limpeza`, `centro-mega`, `auto-socorro-dentinho`,
  `pinturas-nunes`.

Sem número, o funil coleta os dados, **salva o lead/protocolo e encerra
normalmente** — sem erro, sem "canal indisponível" e sem redirecionamento.

## 3. Comportamento verificado

- Com número: CTA → funil do clientKey → lead salvo → token → resolução
  server-side → WhatsApp **do mesmo clientKey**.
- Sem número: CTA → funil → lead/protocolo → conclusão honesta, sem redirect.
- `renata-beauty` e `r-beauty` possuem números distintos; nenhum cruzamento
  entre clientes foi observado.

## 4. Testes executados

| Comando | Resultado |
|---|---|
| `bun test` | 506 aprovados · 0 falhas |
| `bun run build` | PASS |
| `validate:portfolio-catalog` | PASS |
| `validate:portfolio-boundaries` | PASS |
| `validate:portfolio-meta` | PASS |
| `validate:portfolio-scaffold` | PASS |
| `validate:portfolio-performance` | PASS |
| `check:portfolio-projects` | PASS |
| `check:portfolio-project-readiness` | PASS |
| `check:portfolio-funnel-operational` | PASS |
| `validate:brand-integrity` | PASS |
| `validate:client-privacy` | PASS |
| `validate:dist-contact` | PASS |

## 5. E2E real dos 92 portfolios (desktop + mobile)

`node scripts/playwright-portfolio-funnels.mjs` (E2E_CONCURRENCY=3, E2E_PACE_MS=400)

- 184 cenários · **132 OK com redirect tokenizado válido** (66 marcas)
- **52 com conclusão honesta e destino pendente** (26 marcas: 16 MISSING + 10 NOT_APPLICABLE)
- **0 falhas reais** · **0 cenários limitados pelo antiabuso** · **0 cross-client**

Relatório: `seo-reports/portfolio-funnels-e2e.{json,html}`

## 6. Veredito

**NÃO FINALIZADO — 16 DESTINOS OFICIAIS AINDA BLOQUEADOS** (lista em §2).
Os 16 bloqueios são pendência de dado/evidência do dono da marca, não falha do
funil. Nenhum número foi inventado para zerar a lista.
