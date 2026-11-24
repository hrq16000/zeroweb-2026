# Roadmap

## Conferência dos caminhos relacionados — complemento RLS/Lighthouse
- [x] Conferir 19 caminhos diretos de leads/histórico, entradas dinâmicas, planilha, automações, 12 composições Lighthouse e relatórios/decisões alternativas.
- [x] Registrar conformidade por trechos lidos e reproduzir em isolamento ingestão sem métricas/TBT ignorado e consolidação que omite reprovação; nenhum dado ou configuração alterado.
- [x] Documentar complementos em RLS_LIGHTHOUSE_FLOW_SWEEP_2026-11-24.md; preservar registros encerrados, permissões, exemplos e agentes, sem publicar.
- [ ] Preparar correções adicionais de ingestão/painel Lighthouse, planilha/notas CRM e teste SQL legado: aguarda escolha do usuário na pergunta aberta.
- [ ] Preparar proteção da deduplicação/ledger para encerrados e separação de clientes: aguarda autorização na pergunta aberta, sem aplicar SQL.

## RLS e Lighthouse — preparação autorizada em 24/11/2026 às 06:00 UTC
- [x] Reproduzir os dois testes RLS e conferir metadata: timeout de 5 s escondia constraint inválida em visitantes e INSERT de histórico negado; nenhum scanner novo.
- [x] Corrigir testes/runner com requisições limitadas e asserts positivos/negativos; isolamento real PASS. Preparar SQL fora de migrations: fixture PostgreSQL local + mutações PASS, sem aplicar no backend.
- [x] Ler 24 LHR existentes dos 12 portfólios, corrigir parser LCP aninhado e preparar matriz por cliente; páginas, thresholds, composição e agentes intocados, sem LHCI rerun.
- [x] Testes auxiliares PASS; suíte 1187 PASS / 1 FAIL real de histórico; brand/boundaries PASS, harness build OK. Relatório/CSV e SQL preparados para Git, sem merge/publicação/DNS.
- Aplicação e homologação não executadas: histórico real aguarda autorização para migrar; gate remoto aguarda método seguro no runner; Lighthouse aguarda implementação/QA do candidato; #548 continua fora desta preparação.

## Growth Engine 360° — Rodada 1 autorizada em 24/11/2026 às 05:37 UTC
- [x] Reconciliar main/PRs/branches/issues, workflows e Vercel reais: main 66a30f7d, 47 PRs (18 Draft), 566 branches, 17 issues sem PR, 27 deployments; preservar todos os deltas, sem fetch/merge/deploy.
- [x] Inventariar 7 novas entidades fora da main + Dona Garimpeira draft; descobrir implementação Relopar 14288e4f fora da PR de pesquisa. Moreira/São Francisco são reconciliações de existentes, não sites novos; 87 overrides legacy e zero Managed.
- [x] Confirmar bloqueios atuais: #548 agora 7 PASS/2 SKIP e mergeable clean, mas Draft/divergente (3 exclusivos/5 atrás); #530 individual PASS, 12 outras páginas nos 3 shards e 38 diferenças globais; #539 parcial (Angel Mix 85/90); RLS remoto bloqueado no preflight, sem repetir testes.
- [x] Relatório GROWTH_ENGINE_360_R1_2026-11-24.md + CSVs completos; NO-GO, main ainda com gates em andamento. Build/RLS/Lighthouse pesados encaminhados ao GitHub/Codex; zero mudança de aplicação/publicação nesta rodada.
Rodadas 2–4 (ordenação, evolução do painel, recuperação e publicação) não autorizadas automaticamente nesta execução; nenhuma implementação ou deployment dessas frentes.

## Reconexão, publicação e correções — pedido de 24/11/2026 às 04:58 UTC
- [x] Acesso Vercel restaurado por reconexão segura: projeto/equipe exatos e histórico HTTP 200; tentativa de criar token via credencial anterior foi recusada 403, não gerou token.
- [ ] Publicação exata 873a1938 falhou: dpl_2p37yyDbFFFhbKw55y2hWv11QFBX, ERROR/module_not_found, aliasAssigned=false; logs finais confirmam cloudflare:workers. Bloqueio: adaptar esse runtime via #548, ainda não integrada; não alterar SHA documental nem repetir deploy. Último Production READY: 58032d30, dpl_FcL5kPsArmdCToF47oCzeRu61GGA.
- [x] Link /sobre → /cases e identificação das seis fotos ilustrativas de redes sociais corrigidos; navegação, imagens reais carregadas e aviso conferidos no navegador.
- [ ] Publicar correções/painel após gates: suíte local 1174 PASS / 2 FAIL; RLS existente falha em lead_history e teste multi-tenant tem timeout. Não alterar políticas ou reduzir gates fora deste escopo; nova publicação aguarda essas dependências.
- [x] PR #530 HEAD 6cf27155 revalidada: gate individual Doce Coração e QA 390/768/1440 PASS; três shards globais falham em 12 outros portfolios, sem alteração da cliente ou desativação de MCP.
- [ ] Release #530 depende de remediação externa dos gates globais e regressão visual existentes; não reabrir 12 outros clientes implicitamente nem repetir workflows.
- [x] Página /app/publicacao autorizada: commits reais da main, checks, status Vercel e histórico; seleção/cópia de SHA sem deploy automático. QA com conta admin, visitante bloqueado, 390px sem overflow, zero pageerror; 14 testes focados PASS.

## Recuperação definitiva — continuidade híbrida autorizada às 04:01 UTC de 24/11/2026
- [x] Reconciliar referências: main 747c1f9b, #548 9d496e16, #547 b8b25830 e #530 6cf27155; inventário de PRs recuperado sem repetir workflows.
- [x] Revisar a correção nova do Codex na #548: adaptador auditado do leitor de ambiente preserva transporte/OAuth, sem 404/503 ou mocks; descrição da PR atualizada.
- [x] Validar CI equivalente Vercel existente: Node 24.22.3/Bun 1.4.0, build completo, output e três testes reais PASS; conferência isolada Node 22.23.5 e guardas do adaptador PASS.
- [x] Recuperar acesso Vercel: reconexão segura concluída; projeto/equipe/histórico HTTP 200 em 24/11/2026. IDs e último READY confirmados no relatório de publicação administrativa.
- [ ] Integrar/publicar #548 na rodada autorizada: compatibilidade e gate compartilhado PASS em 9d496e16; main tem cinco commits posteriores, candidatos devem ser reconciliados e RLS/publicação continuam pendentes. Nenhum merge/deploy da candidata iniciado.
- [ ] Avançar na primeira candidata após infraestrutura: #530 atual em homologação; BPL/Fran/Marli têm checks reprovados nos HEADs consultados.
- [x] Registrar handoff em docs/reports/VERCEL_MCP_RECOVERY_HANDOFF_2026-11-24.md; 747c1f9b é documental, sem correções de cases/fotos.

## Estabilização e publicação — rodada autorizada de 24/11/2026
- [x] Recuperar os nove workflows existentes da PR #530 sem repetir runs; logo 149726 → 87136 bytes, -41,80%, dimensões/RGBA idênticos.
- [x] Identificar a cadeia de `cloudflare:workers`; teste isolado Node/esbuild PASS, sem presumir compatibilidade Vercel.
- [x] Registrar checkpoint na PR #548 e em `docs/reports/PUBLICATION_HYBRID_CHECKPOINT_2026-11-24.md`; preservar trabalho Codex sem duplicar #547/#548.
- [x] Obter logs/configuração Vercel: após reconexão, logs HTTP 200 confirmam cloudflare:workers como causa da falha histórica 45ea4abe; correção #548 continua não integrada.
- [x] Correção MCP evoluiu na #548: o estado 503 histórico foi substituído por adaptação Node auditada; validação funcional/compilação Vercel PASS, ainda sem integração.
- [ ] Homologar/publicar na rodada própria: compatibilidade e gate compartilhado da #548 PASS; acesso Vercel liberado, publicação 873a1938 ERROR. Reconciliar main e gates de release, sem reescrever histórico.
- [ ] Avançar na primeira candidata: #530 tem novo HEAD 6cf27155 e homologação em andamento; as três falhas Lighthouse/46 diferenças pertencem à rodada anterior, não inferir estado atual.

### Backlog consolidado — não executar nesta rodada
Administração de portfólios; funis/contatos oficiais; leads/Jotform; SEO/blog; métricas reais; preços/cases/comissões; aquisição regional; homologação administrativa em produção. Reutilizar contratos existentes, sem catálogo concorrente, sem novas funcionalidades durante a estabilização e sem SQL/migrações no banco real.

## Painel, suporte e publicação — pedido de 23/11/2026
- [x] Leads consolidados com protocolo persistido, status, filtros, paginação e coluna de metadados Jotform (importação pulada).
- [x] Histórico individual de funil com destino cadastrado e contagem de alertas pendentes/falhos.
- [x] Suporte com ajuda canônica, pedidos próprios e encaminhamento persistido; QA sintético end-to-end aprovado.
- [x] Administração de agentes por convite, nome/perfil e suspensão; login por senha separado implementado. Convite por e-mail e recuperação ainda não homologados com destinatário real.
- [x] Fotos/reativação da galeria: puladas expressamente pelo usuário; manter draft.
- [x] Espelho/importação Jotform Dona Garimpeira: pulados expressamente pelo usuário.
- [x] Banco confirma funil publicado; painel autenticado confirma destino exclusivo 5541995523363, sem alteração do cadastro.
- [x] IA em produção: troca real confirmada em SEO, Loja Virtual e Automação com IA, HTTP 200 e zero pageerror.
- [ ] Publicação das novas telas: solicitada no commit cf056de8; /agent-login ainda 404 nos dois hosts. Bloqueio externo de disponibilização, sem conclusão comprovada.
- [ ] Homologar convite/senha/recuperação de agente com destinatário autorizado; nenhum e-mail real fornecido para teste.

## Integrações de agentes — escopo desta rodada
- [x] Publicar a versão salva e homologar MCP e IA em produção; rotas MCP/consent e troca IA confirmadas em 0web.com.br em 23/11/2026.
- [ ] Ativar espelhos Jotform de Agropet FILT e Cantinho da Tia Mari (ambos autorizados); bloqueado por contrato/endpoint `jotform-mirror` ausente do Git atual, antes de solicitar segredos ou criar registros.
- Preferência registrada: funil individual com WhatsApp como padrão dos portfolios; não substituir os formulários independentes nesta ativação opcional.
- [x] Preparar MCP protegido com OAuth e consultas ao catálogo, sem alterar funis ou leads.
- [x] Preservar retorno do login e adicionar consentimento e consulta browser-local.
- [x] Extrair catálogo de ferramentas; build OK, 11 testes focados aprovados, acesso anônimo/token de sessão recusados.
- [x] Republicar e validar approve/deny e consulta OAuth na origem autorizada; PASS no site público, sem mudar allow-list.

- [x] Rodada 1: corrigir listagem de projetos, consolidar qualidade, publicação unitária e menu de contatos
- [x] Rodada 2: revisar Mestre dos Serviços no Blueprint; bloquear publicação sem destino próprio comprovado
- [x] Rodada 3: criar landing de captação factual com três entradas e rastreamento por marca
- [x] Rodada 4: reavaliar propostas existentes e confirmar somente vínculos comprovados
- [x] Rodada 5: criar tela segura de geração e download de imagens
- [x] Executar gates, testes visuais e publicar alterações aprovadas uma por vez

## Rodadas atuais

- [ ] Rodada 1: corrigir telas administrativas vazias e separar projetos de conta do catálogo de portfólio
- [ ] Rodada 2: consolidar leads, recuperabilidade, solicitações de número e histórico com filtros
- [ ] Rodada 3: validar a captação nas três entradas e sua chegada no painel administrativo
- [ ] Rodada 4: revisar economicamente propostas de destinos e confirmar somente vínculos inequívocos
- [ ] Rodada 5: consolidar motion, SEO e mídia no editor de cada landing existente
- [ ] Rodada 6: publicar individualmente um projeto real após gates; manter Mestre dos Serviços bloqueado sem destino comprovado
- [ ] Executar testes, gates, QA autenticado e publicação por lote validado

## Autoescola APTOS

- [ ] Pesquisar e registrar entidade, evidências e proveniência oficial
- [ ] Criar identidade, mídia e composição autoral mobile-first
- [ ] Integrar catálogo, registros, funil individual, destino e SEO/schema
- [ ] Executar gates, QA visual/runtime e publicar em 0web.com.br
- [x] Seção 'Você também pode gostar' com IA em /servicos/$slug
