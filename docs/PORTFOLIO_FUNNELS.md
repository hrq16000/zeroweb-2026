# Funis dos projetos em `/portfolio`

## Regra universal

O popup **“Quero meu site”** é o único funil universal da 0WEB dentro do universo `/portfolio`. Ele atende a conversão de novos clientes da 0WEB e pode usar o diagnóstico institucional.

## Regra dos projetos publicados

Todo CTA interno de um projeto publicado deve usar o contexto comercial do próprio cliente (`companySlug`) e o funil compatível com a ação:

- Mestre dos Serviços: orçamento de reparos e manutenção, com `companySlug: marido-de-aluguel`.
- Paraíso do Hot Dog: pedido comercial, com `companySlug: paraiso-do-hot-dog`.
- Demais clientes: devem declarar sua própria chave e intenção antes de abrir o funil.

Nenhum CTA interno pode herdar automaticamente o funil institucional da 0WEB. O componente `FunnelCTAButton` resolve a intenção do cliente antes de abrir o modal; o destinatário é resolvido apenas no servidor pelas variáveis privadas de cada cliente.

## Checklist para novos projetos

1. Definir uma chave em `src/lib/portfolio-client-keys.ts`.
2. Configurar a variável privada de WhatsApp no ambiente de produção.
3. Declarar `companySlug` e `purpose` no CTA ou no wrapper do funil.
4. Escolher perguntas próprias para o objetivo do projeto (orçamento, pedido, agendamento etc.).
5. Validar rotas, metadados e fluxo antes do deploy.

O texto “Protegido por 0WEB” identifica apenas a infraestrutura técnica; não transforma o funil do cliente em funil comercial da 0WEB.
