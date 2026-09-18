# Modo amostra dos portfolios sem WhatsApp

Decisão definitiva (18/09/2026). Fecha o assunto: não reabrir, não auditar
novamente, não procurar números para estes projetos.

## Regra

Um `/portfolio/<slug>` cujo `clientKey` tem `whatsapp: null` em
`src/config/portfolio-whatsapp.json` é uma **amostra** — site publicado como
demonstração, sem canal de atendimento direto do cliente.

Nesses projetos:

1. O funil funciona normalmente e **salva o lead** com protocolo.
2. **Nunca** se pede um WhatsApp de retorno ao visitante
   (`requiresRecoveryContact` é sempre `false` quando há `clientKey`).
3. A tela final informa, com clareza, que o site é uma amostra/demonstração e
   que o atendimento direto não está disponível.
4. Não existe fallback: nem número da 0WEB, nem de outro cliente, nem número
   derivado/aproximado.
5. O contato recebido é acompanhado no painel, em
   **Painel → Pedidos por portfólio** e no bloco de amostras em
   **Painel → Parcerias**.

## Onde isso vive no código

| Item | Arquivo |
|---|---|
| Cadastro por `clientKey` (número ou `null`) | `src/config/portfolio-whatsapp.json` |
| Resolução server-side, sem cofre | `src/lib/portfolio-whatsapp-registry.server.ts` |
| Conclusão lead-only do funil | `src/lib/dynamic-funnel.functions.ts` |
| Aviso de amostra na tela final | `src/components/site/BeautyBookingQuiz.tsx` |
| Acompanhamento das requisições | `src/lib/portfolio-requests.functions.ts` · `/app/leads/por-portfolio` |

## Casos futuros

Portfolio novo sem número comprovado nasce em modo amostra. Para sair do modo
amostra basta uma coisa: o número oficial do próprio cliente ser cadastrado no
`clientKey` correspondente. Nenhuma outra mudança de arquitetura é necessária,
e nenhuma nova auditoria deve ser aberta por causa disso.
