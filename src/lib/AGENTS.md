
## Leads por cliente de portfólio

- Central de leads de um cliente grava em `lead_submissions` com `source = 'portfolio:<clientKey>'` e toda função confere essa origem antes de ler ou escrever. Por quê: isola o cliente sem criar tabela nova e mantém o CRM geral e o histórico funcionando.
- Interações de lead passam por `persistCrmHistoryAtomic`. Por quê: nota e última interação são gravadas juntas e leads encerrados ficam preservados.
- O status exibido de uma medição Lighthouse vem só de `measurementState`; o filtro do servidor em `listLhciRuns` deve seguir o mesmo critério. Por quê: lista e filtro não podem discordar.
