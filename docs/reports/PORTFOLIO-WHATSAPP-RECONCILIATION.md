# PORTFOLIO — RECONCILIAÇÃO DE DESTINOS DE WHATSAPP

Atualizado: 2026-09-15 · Base: main atual (GitHub = Lovable)
Commit auditado: `6c1232fb`

## 1. Escopo e regras aplicadas

- Fontes de verdade admitidas: **secrets de ambiente** (`PORTFOLIO_WHATSAPP_*`
  e nomes legados mapeados em `portfolioWhatsAppEnvName`) e a **tabela privada
  autorizada** `portfolio_client_settings.funnel_recipient`.
- Nenhum número foi copiado de arte, screenshot, migration antiga ou de outro
  cliente. Nenhum destino foi inventado. Nenhum fallback institucional.
- Resolução permanece **server-side**; o bundle público continua sem contato
  operacional.

## 2. Classificação por clientKey (92 projetos canônicos)

| Estado | Qtde |
|---|---|
| CONFIGURED | 64 |
| MISSING | 28 |
| INVALID_FORMAT | 0 |
| CONFLICT | 0 |

- **CONFIGURED**: destino presente e em formato E.164 brasileiro válido
  (`^(55)?\d{10,11}$`). 12 clientes têm destino tanto em secret quanto na
  tabela privada — os 12 pares foram comparados por dígitos e **coincidem**
  (zero CONFLICT). Nenhum valor foi impresso em log, relatório ou chat.
- **MISSING**: sem evidência de número. Dividido em duas origens:
  - *config sem destino* (21 registros ativos): `almeida-torres`,
    `angel-mix-brecho`, `artesanatos-darleia-oliveira`, `bh-barreiro-marmitas`,
    `casa-nativa`, `fernanda-amaral-drywall`, `galileu-locacao-brinquedos`,
    `guaratuba-atelie-presentes`, `guaratuba-oficina-nautica`,
    `guaratuba-reparos-residenciais`, `guaratuba-sabores-da-baia`,
    `marido-de-aluguel` (único candidato era o número institucional — bloqueado),
    `mirassol-conserta-celular`, `mirassol-delicias-caseiras`, `pinturas-nunes`,
    `r-beauty`, `raphael-construcoes`, `santos-montador-de-moveis`, `ton-e-cor`,
    `uberlandia-eletrica-residencial`, `woodhouse-hamburgueres`.
  - *sem registro operacional* (7): `auto-socorro-dentinho`, `centro-mega`,
    `enoel-portas`, `kitutes-na-mesa`, `mania-de-limpeza`,
    `papelemi-personalizados`, `simone-lacerda-vaz`. A persistência do lead não
    depende desse registro; o comportamento é idêntico a UNRESOLVED.

## 3. Reconciliação numérica (sem dupla contagem)

- 92 páginas publicadas = 85 com registro ativo + 7 sem registro.
- Banco: 86 linhas = 85 ativas + 1 legado `jkl-marcenaria` (301 → `jkl-decor`).
- Destinos no banco: 64 preenchidos / 22 vazios (21 ativos + 1 legado).
- Números institucionais (final 2053) no banco: **0**.

## 4. Gates executados neste commit

| Gate | Resultado |
|---|---|
| `validate:portfolio-catalog` | OK — 92 itens / 92 clientes |
| `validate:portfolio-boundaries` | OK — 92 sites isolados |
| `validate:portfolio-meta` | OK — SEO próprio |
| `validate:portfolio-scaffold` | OK — 92 conformes |
| `validate:portfolio-performance` | OK — 0 avisos |
| `check:portfolio-projects` | OK — 92 COMPLETE, 0 bloqueante |
| `check:portfolio-project-readiness` | OK com avisos editoriais (ADHONEP) |
| `check:portfolio-funnel-operational` | OK — 12/12, 0 becos sem saída |
| `bun test` | OK — 500 testes, 0 falhas |
| `bun run build` | OK |
| `validate:client-privacy` | OK — bundle público limpo |
| `validate:dist-contact` | OK — 520 arquivos, nenhum contato/segredo |
| `test:e2e:portfolio-funnels` (RESOLVED, Route 66) | OK — desktop + mobile, redirect tokenizado válido |
| `test:e2e:portfolio-funnels` (MISSING, Angel Mix) | Falha esperada do harness — ver §5 |

## 5. Limitação conhecida do harness E2E

O script marca como falha qualquer projeto que não gere redirect tokenizado.
Para clientes MISSING isso é o **comportamento correto por contrato** (lead
salvo, contato de retorno solicitado, nenhum número inventado). O harness só
distingue os dois casos quando `funnelRecipientConfigured` está declarado no
registro, o que hoje não reflete os 64 destinos reais. Correção pertence ao
teste, não ao site — registrada como backlog, sem afrouxar produção. A execução
completa dos 184 cenários também esbarra no limite de taxa de admissão pública
(proteção intencional, não afrouxada).

## 6. Decisão de publicação

**PUBLICAÇÃO BLOQUEADA — INCOMPLETO.** Regra 8: existem 28 clientKeys MISSING.
Nenhum valor foi inventado para fechar a conta. Desbloqueio depende apenas de
evidência do titular de cada marca (número oficial confirmado), que então é
salvo como secret/registro privado — sem alteração de código.
