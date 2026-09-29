# OpenAI Shared Gateway — padrão universal e econômico

## Objetivo

Disponibilizar IA de forma reutilizável no ecossistema sem duplicar chaves, código
ou consumo. A integração deve permanecer server-side e ser ativada somente em
fluxos onde a IA agrega valor real.

## Segredo

- O segredo canônico é `OPENAI_API_KEY`.
- Nunca usar prefixo `VITE_` para a chave.
- Nunca versionar a chave em `.env`, documentação, fixtures ou testes.
- Em Vercel, preferir Shared Environment Variable do tipo Sensitive.
- Sensitive deve ser vinculada somente a `Production` e `Preview`; desenvolvimento
  local usa segredo local fora do Git quando necessário.

## Política economy-first

1. Modelo padrão: `gpt-6-luna`, salvo necessidade comprovada de modelo superior.
2. Reasoning padrão: `none`; elevar apenas quando a tarefa justificar.
3. Saída padrão curta (400 tokens); chamadas maiores exigem opção explícita.
4. Hard cap no gateway para evitar respostas acidentalmente extensas.
5. `store: false` por padrão.
6. Ferramentas externas não são ativadas automaticamente.
7. Jobs de fundo/não urgentes podem usar `service_tier: flex`; interação humana usa
   `auto` para preservar confiabilidade.
8. Não criar chat público irrestrito. Toda superfície de consumo precisa de
   autenticação, rate limit, quota, cache ou outro controle proporcional ao risco.

## Universalidade com isolamento

O gateway é infraestrutura compartilhável, não personalidade compartilhada.
Cada portal/produto deve fornecer suas próprias instruções, contexto, limites e
permissões. Uma marca nunca deve herdar conteúdo ou identidade de outra.

## Ativação progressiva

A ordem operacional é:

1. confirmar `/api/public/ai-status` com `ready:true`;
2. executar uma chamada mínima real e registrar somente metadados seguros;
3. ligar o primeiro caso de uso interno/controlado;
4. medir consumo;
5. expandir para outros projetos somente quando houver utilidade comprovada.

## Regra de custo

Antes de adicionar IA a uma função já resolvida deterministicamente, comparar:
custo, latência, previsibilidade e manutenção. Se regra/código simples resolve
com qualidade equivalente, preferir a solução determinística.


## Vercel: ativação de variável compartilhada

Após criar ou vincular uma Shared Environment Variable a um projeto, é necessário
um novo deployment para que o runtime receba o segredo. Validar sempre no novo
deployment antes de considerar a integração ativa.
