# Migração dos destinos WhatsApp dos portfolios — 2026-09-15/16

## Motivo

A arquitetura anterior passou a depender de env/secret e de
`portfolio_client_settings` para resolver o WhatsApp dos portfolios. Isso fez
contatos históricos desaparecerem da operação e transformou um dado simples do
cliente em configuração externa obrigatória.

A decisão definitiva desta PR é diferente: **WhatsApp é dado comum do próprio
portfolio**, assim como endereço e demais informações de contato.

## Fotografia operacional usada na migração

Em 2026-09-16 foi lida diretamente a configuração existente do projeto Lovable:

- registros em `portfolio_client_settings`: **86**;
- registros com `funnel_recipient` preenchido: **64**;
- registros sem número: **22**.

Os 64 destinos existentes foram copiados para o cadastro versionado por
`clientKey`. Nenhum número novo foi inventado para preencher lacunas.

Dois destinos já comprovados/versionados durante a própria PR foram preservados:

- `r-beauty`: `554196048639`;
- `simone-lacerda-vaz`: `5541995129384`.

## Estado canônico da branch

Fonte: `src/config/portfolio-whatsapp.json`.

- portfolios cadastrados: **92**;
- portfolios com WhatsApp: **66**;
- portfolios com `whatsapp: null`: **26**.

`null` não é erro. É o modo **lead-only**: o funil coleta e salva o lead,
gera protocolo e termina normalmente sem redirecionamento.

## Arquitetura definitiva

1. Cada `clientKey` possui sua própria entrada de contato.
2. O lead é salvo antes de qualquer tentativa de redirect.
3. Se houver WhatsApp válido, o redirect usa somente o número daquele mesmo
   `clientKey`.
4. Se o WhatsApp for `null`, o funil encerra após registrar o lead/protocolo.
5. Não existe fallback para outro cliente nem para o WhatsApp institucional da
   0WEB.
6. O resolvedor de portfolio não consulta `PORTFOLIO_WHATSAPP_*` nem
   `portfolio_client_settings`.
7. O gate `check:portfolio-funnel-operational` falha se essas dependências forem
   reintroduzidas.

## Escopo preservado

Nenhum layout, texto comercial, imagem, SEO, animação ou identidade visual foi
alterado por esta migração. `/servicos` permanece fora deste escopo.

Documento canônico da decisão: `docs/PORTFOLIO_WHATSAPP_POLICY.md`.
