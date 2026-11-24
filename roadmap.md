# Roadmap

## Recuperação definitiva — continuidade híbrida autorizada às 04:01 UTC de 24/11/2026
- [x] Reconciliar referências: main 747c1f9b, #548 9d496e16, #547 b8b25830 e #530 6cf27155; inventário de PRs recuperado sem repetir workflows.
- [x] Revisar a correção nova do Codex na #548: adaptador auditado do leitor de ambiente preserva transporte/OAuth, sem 404/503 ou mocks; descrição da PR atualizada.
- [x] Validar CI equivalente Vercel existente: Node 24.22.3/Bun 1.4.0, build completo, output e três testes reais PASS; conferência isolada Node 22.23.5 e guardas do adaptador PASS.
- [ ] Recuperar acesso Vercel: listas de projetos vazias no escopo solicitado; proprietário precisa confirmar conta/membership e token restrito a msolus/zeroweb-2026. Não presumir escopo pela falha de listagem de equipe.
- [ ] Concluir gates e publicar: #548 tem build/hidratação/estáticos/compatibilidade aprovados, gate compartilhado em andamento; último READY/rollback/configuração real inacessíveis. Nenhum merge/deploy iniciado.
- [ ] Avançar na primeira candidata após infraestrutura: #530 atual em homologação; BPL/Fran/Marli têm checks reprovados nos HEADs consultados.
- [x] Registrar handoff em docs/reports/VERCEL_MCP_RECOVERY_HANDOFF_2026-11-24.md; 747c1f9b é documental, sem correções de cases/fotos.

## Estabilização e publicação — rodada autorizada de 24/11/2026
- [x] Recuperar os nove workflows existentes da PR #530 sem repetir runs; logo 149726 → 87136 bytes, -41,80%, dimensões/RGBA idênticos.
- [x] Identificar a cadeia de `cloudflare:workers`; teste isolado Node/esbuild PASS, sem presumir compatibilidade Vercel.
- [x] Registrar checkpoint na PR #548 e em `docs/reports/PUBLICATION_HYBRID_CHECKPOINT_2026-11-24.md`; preservar trabalho Codex sem duplicar #547/#548.
- [ ] Obter logs/configuração Vercel: conexão autorizada retorna 403 para equipe e 404 para projeto/deployment alvo; operador precisa liberar acesso correto ou fornecer logs sanitizados.
- [x] Correção MCP evoluiu na #548: o estado 503 histórico foi substituído por adaptação Node auditada; validação funcional/compilação Vercel PASS, ainda sem integração.
- [ ] Homologar/publicar: compatibilidade da candidata confirmada no CI, gate compartilhado e acesso Vercel pendentes; READY/SHA publicado não confirmados.
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
