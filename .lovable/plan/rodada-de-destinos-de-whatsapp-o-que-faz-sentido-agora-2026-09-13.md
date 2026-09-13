# Rodada de destinos de WhatsApp — o que faz sentido agora

Muitos itens do pedido já existem no sistema (tela de destinos, tela de números por funil, tela de leads por cliente, gate de integridade). Esta rodada executa só o que ainda falta e é comprovável, sem tocar em design, conteúdo, SEO, motion ou rotas públicas.

## 1. Publicar a regra de número (DDD+8 e DDD+9)
A regra já está implementada e testada, mas ainda não foi ao ar. Rodar verificação completa (tipos, testes, build, portas de qualidade) e publicar. Depois disso, número fixo passa a ser destino válido e o funil deixa de travar em tela morta por causa do formato.

## 2. Gravar os dois destinos que o próprio cliente confirma
Pelo fluxo oficial de confirmação, com registro de prova e sem alterar dígitos:
- **LK Alvenaria** — número que aparece igual em três peças do próprio cliente (print do WhatsApp do titular e portfólio), gravado exatamente como impresso.
- **HBK Iluminação LED** — fixo oficial da loja Atacadão, com a ficha oficial da marca e o site como prova; registrado como fixo, sem afirmar que é WhatsApp.

Em seguida, encerrar as sugestões pendentes desses dois na tela de confirmação (marcadas como substituídas, com o motivo).

## 3. Reavaliar as sugestões pendentes sob a nova regra
Vários candidatos ficaram parados só porque eram fixos ou tinham 8 dígitos. Revarrer a fila de sugestões e separar:
- as que agora passam com prova forte (nome + cidade idênticos à ficha oficial) → aparecem no topo da tela para um clique;
- as ambíguas ou conflitantes → continuam retidas, sem gravação automática.

Nada é gravado automaticamente nesta etapa, exceto os dois itens do passo 2.

## 4. Filtro por cidade na tela de revisão
A tela de destinos já lista todos os clientes com status e máscara. Acrescentar o filtro por cidade pedido, mantendo o resto igual.

## 5. Texto padrão de solicitação de número
Gerar o texto pronto (nome da marca, cidade, motivo e identificação interna) para LK Alvenaria, Assistência Microondas Santos e R Beauty, além de um modelo reaproveitável para os demais sem número. O texto fica disponível para você copiar e enviar — não faço o envio, porque não existe e-mail de contato desses clientes cadastrado no sistema.

## 6. Fechamento com números
Ao final: quantos clientes com destino ativo, quantos ainda sem, quais sugestões ficaram esperando sua decisão e confirmação de que nenhum número institucional da 0WEB foi usado, nenhum dígito foi inventado e nenhum número foi repetido entre marcas.

## Fora desta rodada
- **Redes sociais nas páginas de portfólio**: é mudança de conteúdo/layout das landings e precisa de direção própria por cliente; proponho em rodada separada.
- **Envio real de e-mail aos clientes**: sem endereços verificados no sistema, enviar seria inventar destinatário.
- **Pedido de teste real em landing publicada**: faço depois da publicação do passo 1, em uma marca com destino resolvido, só se você quiser um lead de teste registrado no painel.

## Detalhe técnico
Fonte única continua `portfolio_client_settings`; gravação apenas por `confirmDestination`, com trilha em `portfolio_destination_revisions`. Sem PATCH direto, sem segunda fonte de verdade, sem exposição de número completo em log ou resposta.
