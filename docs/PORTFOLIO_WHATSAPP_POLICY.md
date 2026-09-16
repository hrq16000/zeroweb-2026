# Política definitiva de WhatsApp nos portfolios 0WEB

## Objetivo

Simplificar definitivamente o fluxo de contato dos projetos em `/portfolio/:slug`.

## Regra canônica

O número de WhatsApp é um dado operacional comum do próprio portfolio, assim como nome, endereço, cidade, links e demais dados do projeto. Ele **não é segredo**, não deve depender de cofre/vault e não exige secret de ambiente para funcionar.

Cada portfolio deve possuir um campo de contato próprio, por `clientKey`, com uma destas duas situações:

- `whatsapp: "<numero>"` quando existir número operacional do próprio cliente;
- `whatsapp: null` quando o projeto não possuir número disponível ou quando WhatsApp não for aplicável.

## Fluxo obrigatório do funil

### Portfolio com WhatsApp

1. visitante abre o funil do próprio portfolio;
2. preenche os dados;
3. o lead é persistido antes de qualquer redirecionamento;
4. o sistema lê o WhatsApp pertencente ao mesmo `clientKey`;
5. monta a mensagem;
6. abre o WhatsApp daquele cliente.

### Portfolio sem WhatsApp

1. visitante abre o funil normalmente;
2. preenche os dados;
3. o lead é persistido integralmente;
4. o fluxo encerra com confirmação/protocolo;
5. nenhum erro de "canal indisponível" deve bloquear a conclusão;
6. nenhum número de outro cliente ou da 0WEB pode ser usado como fallback.

## Proibições

- não usar cofre/vault para armazenar WhatsApp de portfolio;
- não tornar variável de ambiente requisito para o número do cliente;
- não tornar `portfolio_client_settings` a fonte obrigatória do destino;
- não compartilhar número entre `clientKey`s;
- não usar WhatsApp institucional da 0WEB como fallback de portfolio;
- não impedir a conclusão do funil porque o portfolio está sem número;
- não inventar ou completar números ausentes;
- não alterar design, copy, imagens, SEO, motion ou identidade para executar esta migração.

## Migração do estado legado

A remoção do mecanismo antigo deve ocorrer sem derrubar projetos já funcionais:

1. recuperar/copiar os destinos que já estão funcionando hoje;
2. gravar cada número no cadastro canônico do respectivo portfolio;
3. validar isolamento por `clientKey`;
4. validar funil com número e funil sem número;
5. só então remover consultas obrigatórias a env/secrets/vault e `portfolio_client_settings` do caminho de resolução.

Não apagar a fonte antiga antes de migrar os números que ainda dependem dela.

## Estados válidos

- **COM_WHATSAPP**: possui número próprio e abre esse número após salvar o lead;
- **SEM_WHATSAPP**: salva o lead e encerra sem redirecionamento;
- **EXTERNAL_STORE / OUTRO_CANAL**: segue o canal real do projeto, sem exigir WhatsApp;
- **DEMO / AMOSTRA**: pode permanecer sem número.

Ausência de WhatsApp deixa de ser falha estrutural do portfolio.

## Critério de aceite

A migração está concluída quando:

- nenhum portfolio depende de cofre/vault para WhatsApp;
- os números existentes estão associados ao próprio portfolio;
- portfolios sem número concluem o funil e registram o lead;
- não existe fallback cross-client;
- todos os gates de isolamento, privacidade, build e E2E ficam verdes;
- nenhuma mudança visual/editorial foi introduzida por esta correção.
