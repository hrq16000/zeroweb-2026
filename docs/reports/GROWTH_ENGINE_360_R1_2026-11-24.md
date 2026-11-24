# 0WEB Growth Engine 360° — Rodada 1: reconciliação e inventário

**Pedido:** documento recebido em 24/11/2026 às 05:37 UTC. **Escopo executado:** exclusivamente Rodada 1; consultas de leitura, inventário e documentação. Nenhum merge, deploy, migração, teste repetido, nova auditoria, alteração de agentes, portfólio, painel, DNS ou configuração. Rodadas 2–4 não iniciadas.

## 1. Reconciliação canônica

| Item | Resultado confirmado |
| --- | --- |
| HEAD inicial e reconfirmado do GitHub main | `66a30f7d74dfbe52e05dda0b65ed2d9b39ab2951`; igual ao checkout antes da documentação desta rodada |
| Melhorias posteriores a 873a1938 | `d5532be4` documental; `9e4c2fa8` painel/cases/identificação das fotos; `6958cfa3` tratamento de erro; `66a30f7d` fechamento. Preservadas, não reimplementadas |
| Conexões usadas | Henrique's GitHub API e Vercel API já vinculadas, acessíveis; nenhuma reconexão ou novo segredo |
| Último Production READY na Vercel | `58032d30991b9203ebdadb4501d83acaafd1a3a8`, deployment `dpl_FcL5kPsArmdCToF47oCzeRu61GGA`, criado em 10/11/2026; URL `https://zeroweb-2026-mpxqpkdsd-msolus.vercel.app` |
| Última tentativa Production | `873a1938`, `dpl_2p37yyDbFFFhbKw55y2hWv11QFBX`: **ERROR/module_not_found**, sem alias atribuído. Não repetida |
| Histórico Vercel | Paginação completa: 27 deployments, `next=null`; 13 Production READY, 4 Production ERROR, 2 Production CANCELED; 8 sem target explícito (6 READY, 1 ERROR, 1 CANCELED), não confundidos com produção |
| PRs abertas | **47**, sendo **18 Draft** e **29 não Draft**; uma página de 100 suficiente |
| Branches | **566 distintas**, seis páginas: 100/100/100/100/100/66 |
| Issues abertas sem PR | **17**, separadas das 47 PRs que também aparecem no endpoint de issues |
| GO/NO-GO Production | **NO-GO**: correção #548 ainda não integrada, gates da main em andamento, evidência RLS insuficiente e candidatas com bloqueios próprios |

O domínio `https://0web.com.br` foi consultado separadamente da Vercel. HTTP 200 no domínio não permite atribuir-lhe o SHA 58032d30 ou 66a30f7d sem evidência do host. Nenhuma alteração de origem/DNS.

## 2. PR #548 — bloqueio atual real

HEAD `9d496e16e7f7a8ca0212c70b8ebca0bd0769f717`, branch `fix/vercel-mcp-runtime-isolation-20261124`, **Draft/não integrada**.

- **Atualização importante:** o gate `Pop-up, funis, acessibilidade e regressão visual` terminou em **SUCCESS** às 04:20:53 UTC. Não continua pendente como dizia o checkpoint histórico.
- **7 checks SUCCESS, 2 SKIPPED:** build, estáticos, hidratação, detecção de novos portfólios, detecção de impacto, compatibilidade Vercel e gate compartilhado aprovaram. Lighthouse e gate de novos portfólios foram pulados por escopo; isso não é PASS universal.
- Job existente de compatibilidade: [138207248889](https://github.com/hrq16000/zeroweb-2026/actions/runs/45323447190/job/138207248889). Evidência reaproveitada de Bun 1.4.0, Node 24, `VERCEL=1`, preset Vercel e três testes reais MCP/OAuth. Nenhum rerun.
- Comparação com main 66a30f7d: **diverged, 3 commits exclusivos na candidata, 5 na main**. GitHub reconfirmou `mergeable=true`, `mergeable_state=clean`; estar atrás não equivale a conflito Git, mas exige preservar os cinco commits posteriores.
- Delta de quatro arquivos: `.github/workflows/build-validate.yml`, `package.json`, `scripts/prepare-vercel-mcp-runtime.mjs`, `tests/mcp/vercel-runtime.test.mjs`. Nenhum arquivo do painel/cases/fotos entra nesse delta.
- A causa do ERROR Vercel é a resolução de `cloudflare:workers` no SDK MCP. A adaptação auditada já existe na candidata; não desativar agentes nem reproduzir o patch em outra branch.
- **Próxima ação GitHub/Codex:** reconciliar #548 com a main atual preservando deltas, validar somente o que efetivamente mudou e preparar integração revisada. Não houve autorização nesta Rodada 1 para merge/deploy. #547 é alternativa histórica, não integrar junto automaticamente.

## 3. Contagens de portfólios — não confundir entidades com branches

| Fonte / definição | Total | Significado |
| --- | ---: | --- |
| Catálogo versionado | 99 | 98 `published`, 1 `draft` (Dona Garimpeira); zero slugs duplicados |
| Registro de clientes | 98 | Todos os publicados do catálogo; Dona Garimpeira fora do registry ativo |
| Admin seed | 99 | 98 published + 1 não publicado. `COMPLETE` de conformidade em todos não significa que todos passaram pelo lifecycle ou estejam publicados |
| Banco administrativo existente | 87 | Todos `project_kind=legacy`, `lifecycle_status=published`, `published=true`; **zero Managed**. É override/registro legado, não catálogo concorrente |
| Manifestos de lifecycle | 8 | 7 `published`; Moreira `ready` com `publish=not_started`. Projetos legados sem manifesto não são automaticamente pendentes |
| Novas entidades fora da main | **7** | Doce Coração, BPL, Fran, Marli, Toop, Letícia e Relopar; seis PRs de implementação + Relopar em branch exclusiva e PR separada de pesquisa |
| Reativação de ficha draft | **1** | Dona Garimpeira; não confundir com os sete novos |
| Fila de criação/reativação | **8** | 7 novas entidades + 1 ficha draft; não são 3 ou 5 |
| Reconciliações adicionais identificadas | **2** | Moreira (lifecycle) e São Francisco Pet Center (site público fora do catálogo); já existem, não são sites novos |
| Pendência operacional adicional | **2** | Agropet e Cantinho: issue #521 e homologação do destino/leads; páginas públicas existentes, não novos sites |
| Protótipo fora de clientes | **1** | CRM/B2B, #544, `/lab/portfolio-comercial`; não somado ao total de clientes |

**Limite explícito:** inventário paginado das 566 branches foi concluído; não foi feita uma auditoria de equivalência de cada commit histórico. Branches antigas de clientes que já possuem rota/catálogo não foram contadas como novos sites, nem declaradas descartáveis. Nenhuma branch foi excluída ou encerrada.

## 4. Inventário individual da fila de criação/reativação

Todas as sete novas rotas abaixo retornaram **404 no domínio oficial**. Isso confirma ausência da versão pública, não inexistência de implementação nas branches.

| Portfólio | PR / branch / HEAD | Preview existente | Pendência real / bloqueio | Próxima ação |
| --- | --- | --- | --- | --- |
| Panificadora Doce Coração, Santo Antônio | [#530](https://github.com/hrq16000/zeroweb-2026/pull/530), `feat/portfolio-doce-coracao-santo-antonio-20261119`, `6cf27155` | `https://zeroweb-2026-1ujtmk943-msolus.vercel.app` READY **em 9b139413, anterior ao HEAD** | QA individual 390/768/1440 e gate de novos portfolios SUCCESS; 3 shards Lighthouse globais FAIL e gate compartilhado FAIL com **38 diferenças**. Continua Draft; não promover com base no preview antigo | Preservar a implementação e QA individual; separar regressões próprias de falhas herdadas e reconciliar gates globais/contratos antes da promoção |
| BPL Locações de Brinquedos | [#543](https://github.com/hrq16000/zeroweb-2026/pull/543), `feat/portfolio-bpl-locacoes-20261123`, `2d78b56d` | Nenhum deployment Vercel encontrado para esta branch; existe QA local de CI | BPL 390/768/1440 + NO-BRAND SUCCESS, build/estáticos/hidratação SUCCESS; 4 shards globais e gate compartilhado FAIL. Draft/design/noindex ainda não promovidos | Aproveitar evidências próprias e corrigir gates comprovados, depois homologar readiness e entrega do funil sem atribuir contato não confirmado |
| Salgados da Fran | [#542](https://github.com/hrq16000/zeroweb-2026/pull/542), `feat/portfolio-salgados-da-fran-20261123`, `f09bdfd3` | Nenhum deployment da branch encontrado | Capturas Chromium 390/768/1440 SUCCESS; **build, estáticos e hidratação FAIL**, quatro shards FAIL; gate compartilhado SKIPPED. Draft/design/noindex | Encaminhar causas de build/validação ao Codex, reaproveitando a página e capturas; não considerar capturas suficientes para publicar |
| Espaço Marli Nails, Guaratuba | [#536](https://github.com/hrq16000/zeroweb-2026/pull/536), `feat/portfolio-espaco-marli-guaratuba-r1`, `923a11d8` | `https://zeroweb-2026-ls60n7aqh-msolus.vercel.app` **CANCELED** no mesmo SHA | Build/hidratação SUCCESS; estáticos e quatro shards FAIL; gate compartilhado SKIPPED. Consulta Jotform declarada verificada na proposta; WhatsApp do cliente não confirmado | Reconciliar validação e readiness da candidata; não usar cancelamento de preview nem comentário Vercel verde como publicação |
| Toop Assados | [#511](https://github.com/hrq16000/zeroweb-2026/pull/511), `feat/portfolio-toop-assados-proposta-20261107`, `fea828bb` | `https://zeroweb-2026-hcxgp9apb-msolus.vercel.app` READY em **c8bbc66f, anterior ao HEAD** | QA individual 390/768/1440 SUCCESS; **build, estáticos e hidratação FAIL**, quatro shards FAIL; Draft/design, proposta não oficial, LEAD_ONLY e condições operacionais não confirmadas | Preservar a candidata; tratar build/CI e prontidão editorial/comercial, sem inventar estoque, preço, horários ou canal |
| Letícia Reiche | [#512](https://github.com/hrq16000/zeroweb-2026/pull/512), `feat/portfolio-leticia-reiche-r1`, `53d59f60` | `https://zeroweb-2026-1p4gdshvp-msolus.vercel.app` READY **no mesmo SHA** | Build/estáticos/hidratação SUCCESS; quatro shards e gate compartilhado FAIL. PR pede contratos de catálogo/manifests v4/discovery/OG/brand/sitemap após readiness; canal e mídia próprios não comprovados | Reaproveitar o protótipo existente, completar contratos e homologação necessários; não chamar solicitação de agendamento de reserva confirmada |
| Relopar | Pesquisa [#497](https://github.com/hrq16000/zeroweb-2026/pull/497), `research/relopar-curitiba-20261106`, `31e00c10`; **implementação exclusiva** `feat/relopar-portfolio-20261106`, `14288e4f` | `https://zeroweb-2026-216v98fdu-msolus.vercel.app` READY **apenas da pesquisa** | #497 adiciona somente dois documentos, não o site. Descoberta branch de implementação com ReloparPage, rota e registries, **14 commits exclusivos / 93 atrás**, zero checks e zero PRs associadas retornados para o HEAD. Endereço/escopo/mídia precisam de reconciliação | Recuperar a implementação original; não publicar o PR de pesquisa como página nem criar segunda implementação. Revisar delta exclusivo e abrir trilha de integração apenas na rodada autorizada |
| Dona Garimpeira | Catálogo da main `draft`; branch histórica `feat/portfolio-dona-garimpeira-preparacao-20261102`, `227644fa` | URL oficial retornou **200**, mas isso não comprova publicação do SHA atual | Registry ativo ausente, seed `published=false`; material real para reativação continua pendente. Fonte principal e destino de funil não alterados; draft do catálogo não retira automaticamente uma versão antiga já servida | Manter temporariamente draft; receber/validar logo e duas fotos reais e reconciliar futura reativação. Não tocar no funil nesta rodada |

Rotas preservadas das candidatas: `/portfolio/panificadora-doce-coracao-santo-antonio`, `/portfolio/bpl-locacoes-de-brinquedos`, `/portfolio/salgados-da-fran`, `/portfolio/espaco-marli-nails-guaratuba`, `/portfolio/toop-assados`, `/portfolio/leticia-reiche`, `/portfolio/relopar`.

## 5. Publicados, reconciliações e artefatos que não são novos clientes

| Entidade / artefato | Evidência | Classificação / próxima ação |
| --- | --- | --- |
| Moreira Auto Mecânica | URL oficial 200, catálogo published, admin publicado; manifesto `ready`, `publish=not_started`, sem blockers | **Fechamento documental divergente**, não site novo nem redeploy obrigatório. Reconciliar evidência do host/SHA antes de atualizar manifesto |
| São Francisco Pet Center | URL oficial 200 e presente no sitemap; rota própria na main; ausente dos 99 registros do catálogo e do seed | **Publicado fora da listagem canônica**. Gate de listagem da Rodada 2; não adicionar ficha nesta Rodada 1 |
| Agropet FILT | Catálogo published, URL oficial 200; [#503](https://github.com/hrq16000/zeroweb-2026/pull/503) ainda Draft em `952c12a2`, preview READY no mesmo SHA; issue [#521](https://github.com/hrq16000/zeroweb-2026/issues/521) aberta | **Manutenção/homologação de cliente existente**, não 100º site novo. Reconciliar patch remanescente e contrato de persistência/LEAD_ONLY sem interromper Jotform operacional |
| Cantinho da Tia Mari | Catálogo published e URL oficial 200; issue #521 conjunta ainda aberta | **Homologação operacional pendente**, não página ausente. Não recriar site ou espelho nesta rodada |
| S&S Construções | `/portfolio/sscons` retornou 200; slug sscons já está no catálogo; issue [#60](https://github.com/hrq16000/zeroweb-2026/issues/60) continua aberta | Pedido histórico **não prova site pendente**. Conferir escopo residual da issue, não somar como cliente novo |
| JKL | Banco conserva `jkl-marcenaria`; catálogo usa `jkl-decor`. Ambas URLs retornaram 200 com a mesma identidade | **Alias/legado**, não novo cliente nem prova de duplicação pública; preservar os dois caminhos e reconciliar override na rodada própria |
| ADHONEP, Águia Sul, Kitutes na Mesa, Autoescola APTOS | PRs antigas #93, #204, #212/#216, #214 abertas; entidades já cadastradas/publicadas | **Deltas antigos de experiência/mídia/ownership**, não novos sites. Não mesclar automaticamente nem refazer identidades; #212/#216 referem-se à mesma entidade |
| CRM/B2B visual | [#544](https://github.com/hrq16000/zeroweb-2026/pull/544), `f1abd0e6`, `/lab/portfolio-comercial`, 404 público; build/estáticos/hidratação SUCCESS, shards/gate compartilhado FAIL | **Protótipo não funcional**, não cliente real. Fora das contagens de portfólios; preservar noindex e rótulos de demonstração |
| Batch de próximos projetos | `feat/portfolio-batch-next-pending-20261106`, `11ad1d57`; comparação identificou somente scaffold e teste | Ferramenta/plano, **não portfólio adicional** |

Doze publicados do catálogo não têm linha própria no banco de overrides: Agropet, Arildo, Auto Socorro Dentinho, Cantinho, Catharine, Centro Mega, Cris Presentes, Enoel, Kitutes, Mania de Limpeza, Papelemi e Simone. O painel usa o seed como fallback; **não são doze páginas ausentes nem exigem duplicar registros**. Não executar importação para corrigir uma contagem.

## 6. Lighthouse — três shards, não três páginas

Logs reais existentes da #530 foram lidos, sem rerun. O gate individual da Doce Coração aprova; as reprovações de performance dos shards globais atingem **12 outros portfolios**:

| Shard | Página | Score encontrado | Piso | Outro bloqueio |
| --- | --- | ---: | ---: | --- |
| 0 | refrigeracao-maresia | 87 | 90 | — |
| 0 | embalar-embalagens | 87 | 90 | — |
| 0 | mania-de-limpeza | 89 | 90 | — |
| 0 | your-brutus-burguer | 87 | 90 | — |
| 0 | carecas-infotec | 89 | 90 | — |
| 1 | paulo-mestre-de-obras | 88 | 90 | — |
| 1 | dlara-pizzaria | 88 | 90 | — |
| 1 | angel-mix-brecho | 83 | 90 | LCP 2671,8413 ms > 2500 ms |
| 1 | auto-socorro-dentinho | 88 | 90 | — |
| 2 | marmitaria-dom-diego | 89 | 90 | — |
| 2 | centro-mega | 89 | 90 | — |
| 2 | jkl-decor | 88 | 90 | — |

Logs: [shard 0](https://github.com/hrq16000/zeroweb-2026/actions/runs/45323530198/job/138207524408) / [shard 1](https://github.com/hrq16000/zeroweb-2026/actions/runs/45323530198/job/138207524442) / [shard 2](https://github.com/hrq16000/zeroweb-2026/actions/runs/45323530198/job/138207524478). IDs e URLs conferidos diretamente nos checks da API.

### PR #539 — aproveitamento parcial, não solução pronta

HEAD `c8a8d25e9a625fe125db955da9349a386c136a6a`; **Draft**, divergente da main (**4 exclusivos / 12 atrás**). Altera somente AngelMixBrechoPage, RBeautyEditorialView e dois testes.

- Mantém H1 visível no SSR/LCP e ajusta sizes da imagem Angel Mix: ideia pequena e pertinente, sem necessidade de reconstruir páginas.
- Build/estáticos/hidratação SUCCESS, mas seu próprio Lighthouse e gate compartilhado FAIL. Log de Angel Mix encontrou **85/90**; portanto não considerar essa PR suficiente para resolver os 12 portfolios.
- Diagnóstico existente também aponta JavaScript não utilizado no chunk global (~224 KiB), imagens sem dimensionamento/formato adequado e recursos compartilhados de CSS/fontes. São pistas medidas, não prova de que uma única otimização fará todos passar.
- Recursos institucionais congelados e arquivos compartilhados não serão alterados nesta Rodada 1. Encaminhar ao Codex a otimização pontual com comparação contra HEAD atual, sem reduzir 90, excluir páginas ou atualizar baselines sem revisão.
- Gate compartilhado da #530 registra **38 diferenças visuais**, além de falhas de contratos de experiência/originalidade na saída. Não reduzir o teste a “somente Lighthouse” nem assumir que tudo é regressão da Doce Coração.

## 7. Segurança — distinguir histórico local de gate remoto

- Histórico recente documentado: `bun test` **1174 PASS / 2 FAIL**; arquivos de testes não alterados, suíte não repetida.
- `tests/rls/portal_isolation.test.ts`: timeout de 5000 ms; não declarar isolamento validado nem atribuir causa definitiva à latência sem reprodução.
- `tests/rls/sensitive_tables.test.ts`: atualização admin de `lead_submissions` rejeitada ao inserir `lead_history`.
- Consulta de metadata no banco confirmou que `lead_history` tem somente política `lead_history_locked` de **SELECT com predicate=false**, sem política INSERT. `trg_leads_before_update` chama `leads_after_change` como **SECURITY INVOKER**. Esse conjunto é compatível com o erro histórico; não afrouxado nem reconfigurado.
- Último workflow remoto RLS: [45282038451](https://github.com/hrq16000/zeroweb-2026/actions/runs/45282038451), 23/11/2026, SHA 45ea4abe: **FAIL antes dos testes** em `Verificar credencial obrigatória do gate`, com `RLS BLOCKED_MISSING_SECRET`; ambos testes RLS SKIPPED. Não confundir isso com os dois FAIL locais.
- Lovable Cloud não fornece a chave de serviço citada pelo workflow legado; não pedir ao usuário para obtê-la, fabricar valor ou trocar de banco. Encaminhar ao GitHub/Codex a adequação do método autorizado de homologação/contrato do gate e a correção mínima de histórico, mantendo isolamento e privacidade.
- Resultados de scanners existentes consultados, sem nova execução: scanner MCP atual concluído/sem findings; demais scanners desatualizados ou unknown, ainda que sem findings retornados. **Não declarar segurança geral limpa**.

## 8. Listagem e painel — achados apenas, Rodada 2 não iniciada

- Fonte pública: portfolio-catalog versionado + Managed publicados; banco retornou zero Managed. Painel: projeção seed + overrides existentes. Preservar esse contrato, não criar terceira fonte.
- Código atual oferece **Mais recentes e Nome A–Z**, não um modo Aleatório. “Recentes” usa proximidade e posição no array, não data real de publicação; catálogo não tem campos de datas. Com busca ativa, prevalece relevância. Achados anotados para Rodada 2, sem correção nesta rodada.
- Sitemap contém **141 locs**, mas apenas **99 URLs leaf `/portfolio/:slug`**; 42 são outras superfícies. Essas 99 representam 98 publicados do catálogo + São Francisco Pet Center; Dona Garimpeira não está no sitemap. Não chamar 141 de total de clientes.
- HTML de `/portfolio` contém 99 links leaf de entidades do catálogo, inclusive Dona Garimpeira. Links gerais/SEO não provam 99 cards elegíveis; contagem bruta do array e filtros live devem ser reconciliados na Rodada 2.
- `/app/publicacao` existente preservado; nenhuma ampliação de informação/ações de deploy iniciada. Seu loader continua autenticado/admin, mecanismo de seleção em leitura não foi convertido em botão de publicação.
- Nenhuma alteração de preço, SEO, fotos, contato ou fluxo dos clientes; nenhuma dependência nova.

## 9. Entrega, limites e próxima decisão

**Nenhuma correção de aplicação era necessária para concluir o inventário.** Corrigir build compartilhado, segurança, gates globais, ordenação e promoção de clientes abriria as rodadas seguintes ou arquivos concorrentes; itens foram preservados e encaminhados, não “ignorados como aprovados”.

Prioridade preparada, sem execução: #548 reconciliada → gate RLS e regressões/performance → Doce/BPL (QA própria já aproveitável) → Fran/Marli/Toop/Letícia → Relopar (branch original sem checks) → reativação Dona após material real; São Francisco e Moreira são reconciliações próprias, não rebuilds.

Snapshots completos sem PII/credenciais:

- [47 PRs](GROWTH_ENGINE_360_R1_PRS_2026-11-24.csv): número, título, draft, HEAD, branch e URL.
- [566 branches](GROWTH_ENGINE_360_R1_BRANCHES_2026-11-24.csv): nome, HEAD, PR aberta associada e preservação do delta não auditado.
- Evidências anteriores reaproveitadas: `PUBLICATION_ADMIN_RECONNECTION_2026-11-24.md`, `VERCEL_MCP_RECOVERY_HANDOFF_2026-11-24.md`.

Main 66a30f7d reconfirmada antes da documentação; no snapshot final seus **7 checks SUCCESS, 1 SKIPPED, 4 shards em andamento + gate compartilhado em andamento** ainda não autorizam Production. Commit de fechamento documental será emitido pelo Git, sem alterar o HEAD de candidatas nem publicar o site. Consumo de créditos não medido isoladamente nesta rodada; zero builds/testes/auditorias/deployments disparados pelo agente. **NO-GO para publicação; Rodada 1 encerrada com inventário e bloqueios, não com promessa de execução automática posterior.**