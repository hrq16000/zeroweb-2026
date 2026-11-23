# Roadmap

## Painel, suporte e publicação — pedido de 23/11/2026
- [x] Leads consolidados com protocolo persistido, status, filtros, paginação e coluna de metadados Jotform (importação pulada).
- [x] Histórico individual de funil com destino cadastrado e contagem de alertas pendentes/falhos.
- [x] Suporte com ajuda canônica, pedidos próprios e encaminhamento persistido; QA sintético end-to-end aprovado.
- [x] Administração de agentes por convite, nome/perfil e suspensão; login por senha separado implementado. Convite por e-mail e recuperação ainda não homologados com destinatário real.
- [x] Fotos/reativação da galeria: puladas expressamente pelo usuário; manter draft.
- [x] Espelho/importação Jotform Dona Garimpeira: pulados expressamente pelo usuário.
- [x] Banco confirma funil publicado; painel autenticado confirma destino exclusivo 5541995523363, sem alteração do cadastro.
- [ ] Publicar e verificar recomendações IA em produção.

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
