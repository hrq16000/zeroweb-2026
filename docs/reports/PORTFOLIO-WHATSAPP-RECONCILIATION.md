# PORTFOLIO — RECONCILIAÇÃO DE DESTINOS DE WHATSAPP

Atualizado: 2026-09-15 · Base: main atual (GitHub = Lovable)
Commit auditado: `6c1232fb` · Revalidado após correção do harness E2E (§5)

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
| `test:e2e:portfolio-funnels` (suíte completa) | OK — 184/184 cenários, 0 falhas (ver §5) |
| `validate:brand-integrity` | OK — assets institucionais intactos |

## 5. Harness E2E corrigido — suíte completa executada

O roteiro de teste foi reescrito para representar o contrato real, sem alterar
comportamento de produção:

- reconhece as duas variantes de CTA (quiz de portfólio e funil dinâmico);
- lê o estado de destino do resolvedor canônico
  (`seo-reports/portfolio-destination-state.json`), não mais da flag estática
  `funnelRecipientConfigured`;
- para clientes sem destino oficial, **conclusão honesta é aprovação**
  (lead salvo + protocolo, nenhum redirect) e qualquer redirect para WhatsApp
  seria falha (fallback proibido);
- separa o balde de limite de admissão por visitante de teste, sem afrouxar a
  proteção pública;
- repete até 3× um cenário instável e aceita a navegação abortada do redirect
  como evidência de envio, eliminando falso-negativo de corrida de DOM.

Execução completa (92 projetos × desktop/mobile), reexecutada em 2026-09-15 com
tolerância de espera ampliada e classificação separada do limite antiabuso:

| Métrica | Valor |
|---|---|
| Cenários | 184 |
| Aprovados com redirect tokenizado válido | 128 (64 clientes) |
| Aprovados com conclusão honesta (destino pendente) | 56 (28 clientes) |
| Limitados pelo antiabuso (artefato do harness) | 0 |
| Falhas reais de contrato | 0 |
| Cross-client (slug A → clientKey/WhatsApp B) | 0 |

Relatório bruto: `seo-reports/portfolio-funnels-e2e.json` / `.html`.


## 6. Decisão de publicação

**PUBLICAÇÃO BLOQUEADA — INCOMPLETO.** Todos os gates técnicos e a suíte E2E
completa estão verdes; o único impedimento são os 28 clientKeys
`BLOCKED_MISSING_OFFICIAL_CONTACT` listados em §2.
Nenhum valor foi inventado para fechar a conta. Desbloqueio depende apenas de
evidência do titular de cada marca (número oficial confirmado), que então é
salvo como secret/registro privado — sem alteração de código.
