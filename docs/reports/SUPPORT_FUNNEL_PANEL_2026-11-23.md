# Painel de funis, suporte e agentes — 23/11/2026

## Escopo e skills
Dashboard/form/backend: 0web-design-system (tokens institucionais, densidade administrativa), 0web-ui-quality-gates (labels, estados, mobile e QA autenticado). Sem revisão visual de portfolios, sem mídia gerada, sem dependência externa nova. A composição usa bandas e tabela; nenhuma animação decorativa é aplicável ao acompanhamento operacional.

## Entrega
- `/app/funis/leads`: protocolos existentes em metadata_json.protocol (ID legado identificado quando ausente), filtros por funil/data/estágio/status, paginação em lotes de 200; coluna extra para metadata_json.jotform, sem importação inventada. Fim do período é exclusivo à meia-noite do dia seguinte.
- `/app/funis/$id/history`: histórico por funil e contagem exata de alertas pending/failed; número canônico resolvido no servidor, após validar admin, sem fallback. Status de alerta não é confirmação de leitura/envio de mensagem pelo WhatsApp.
- `/app/support`: chat fundamentado na mesma FAQ pública, seleção apenas de pedidos do próprio user_id, projeção sem dados pessoais dos pedidos, redaction de contatos nas mensagens enviadas à IA. Resposta sem fonte válida/confiança mínima cai na fila support_tickets; botão humano evita IA e persiste a conversa.
- `/app/agentes`: cadastro por convite, perfil, preferências e suspensão; suporte_agents separado de profiles e user_roles. Nenhum papel admin concedido ao agente. Login separado em `/agent-login`, convite `/agent-activate`, recuperação `/reset-password`; login público Google inalterado. Email/password habilitado somente como provedor necessário ao acesso solicitado.
- FAQ extraída byte-equivalente para módulo compartilhado; conteúdo público não foi alterado.

## Evidência
- 13 testes focados aprovados: protocolos, período inclusivo, origem Jotform, incerteza/fonte, número Dona Garimpeira e isolamento de destinos. Tests de servidor exigem preload que remove window porque bunfig global registra happy-dom; falha inicial era ambiente, não regra de destino.
- QA com conta do operador: lista de leads, filtro Dona Garimpeira, histórico, destino exato 5541995523363; cadastro de agentes desktop e mobile 390x844 sem overflow, zero pageerror.
- Conta temporária sintética: agente ativo lê apenas identidade; não-admin recusado na administração; pedido fictício BRL 123/pending é o único pedido listado; IA respondeu valor/status corretos. Conversa enviada para humano, relida em `/app/support/$id`.
- Administração: nome/perfil e suspensão do agente sintético salvos pelo painel e relidos após reload.
- Pedido, perfil e ticket sintéticos removidos por IDs exatos após teste. Nenhum convite/cobrança/WhatsApp real enviado.
- Observabilidade: último build automático OK em 04:58:52 UTC.

## Limitações explícitas
- Convite real por e-mail, definição da senha pelo link e recuperação não foram homologados ponta a ponta: nenhum destinatário real fornecido para essa validação.
- A ajuda disponível é a FAQ atual do site; não foi inventada uma central externa.
- Foto/logo/reativação da galeria e integração/importação Jotform foram puladas expressamente pelo usuário. Dona Garimpeira mantém catálogo draft e funil publicado existentes.
- Publicação e troca IA no domínio oficial serão verificadas separadamente após o deploy.

## Publicação e evidência no domínio oficial
- Publish solicitado para cf056de805d96c213b5fbf14c4aaad9581073bee. Ferramenta confirmou agendamento, não conclusão.
- Produção 0web.com.br: SEO, Loja Virtual e Automação com IA retornaram HTTP 200; observador DOM registrou listas diferentes antes/depois em todos os três carrosséis. Zero pageerror. Capturas de carrossel confirmam títulos e preços reais; imagens estavam lazy sem scroll, não foram homologadas nesta tarefa.
- Nova página /agent-login retornou 404 tanto em 0web.com.br quanto em zeroweb-growth-engine.lovable.app após a solicitação. Portanto não há prova de disponibilização das novas telas e não se declara publicação efetiva concluída. Não foram feitos redeploys repetidos nem alterações DNS.
- Git pode salvar este relatório após o commit candidato; não altera o conteúdo funcional solicitado para publicação.
