# Reconciliação privada de WhatsApp dos portfolios

Data: 2026-09-14
Base Git auditada: `598dae65` (`main` remota)

## Resultado consolidado

| Estado | Total | Regra aplicada |
|---|---:|---|
| `CONFIGURED` | 64 | Destino privado presente, normalizável e com funil habilitado. |
| `MISSING` | 27 | Sem número/documento inequívoco para configurar. |
| `INVALID_FORMAT` | 0 | Nenhum destino privado presente fora do formato aceito após normalização. |
| `CONFLICT` | 1 | Referência encontrada, porém pertence ao canal institucional e não pode ser reutilizada. |

O escopo é de 92 `clientKey`s canônicos. O destino efetivo permanece privado:
o runtime tenta o segredo específico do cliente e, apenas depois, a configuração
privada `portfolio_client_settings`; ambos são resolvidos somente no servidor.

## Referências reconciliadas nesta conversa

Os seguintes cadastros possuem fonte explícita no briefing, imagem ou oferta do
titular e foram comparados à configuração privada. O valor não é reproduzido
neste repositório.

| Client key | Referência usada | Estado final |
|---|---|---|
| `acai-total-araucaria` | briefing e identidade do Açaí Total | `CONFIGURED` |
| `ag-electrical-services` | briefing A&G | `CONFIGURED` |
| `aguia-sul-sinalizacao` | briefing Águia Sul | `CONFIGURED` |
| `confeitaria-chyrley` | briefing da proprietária | `CONFIGURED` |
| `diego-montador-moveis` | briefing Diego Montador | `CONFIGURED` |
| `ecommerce-on` | briefing institucional Curitiba | `CONFIGURED` |
| `eisenfer-tubos-acos` | material Eisenfer | `CONFIGURED` |
| `eletro-solucoes-eficazes` | briefing Eletro Soluções | `CONFIGURED` |
| `eletrovale-eletromecanica` | apresentação Eletrovale | `CONFIGURED` |
| `espaco-cih-luh` | oferta e perfil oficial CIH & LUH | `CONFIGURED` |
| `jkl-decor` | briefing JKL Decor | `CONFIGURED` |
| `lk-alvenaria` | material visual LK Alvenaria | `CONFIGURED` — normalizado |
| `lucas-arruma-maquina-lavar` | material MaquinTec/Lucas | `CONFIGURED` |
| `mary-diarista` | material visual Mary Diarista | `CONFIGURED` |
| `mp-festas-eventos` | material MP Festas | `CONFIGURED` |
| `no-brilho-higienizacao` | briefing No Brilho | `CONFIGURED` |
| `paulo-mestre-de-obras` | material Paulo Mestre de Obras | `CONFIGURED` |
| `refrigeracao-maresia` | material Refrigeração Maresia | `CONFIGURED` |
| `renata-beauty` | oferta oficial Renata Beauty | `CONFIGURED` — normalizado |
| `rj-servicos-drywall` | briefing RJ Serviços de Drywall | `CONFIGURED` |
| `salao-da-marcia` | material Salão da Márcia | `CONFIGURED` |
| `studio-de-cilios` | material visual oficial do estúdio | `CONFIGURED` |
| `vila-da-capivara` | briefing Vila da Capivara | `CONFIGURED` |

As normalizações desta rodada foram registradas em
`portfolio_destination_revisions` com fonte `CLIENT_SUPPLIED` e resultado
`PASS`, sem gravar o número nesta documentação.

## Pendências que não podem ser adivinhadas

### `MISSING`

`almeida-torres`, `angel-mix-brecho`, `artesanatos-darleia-oliveira`,
`auto-socorro-dentinho`, `bh-barreiro-marmitas`, `casa-nativa`, `centro-mega`,
`enoel-portas`, `fernanda-amaral-drywall`, `galileu-locacao-brinquedos`,
`guaratuba-atelie-presentes`, `guaratuba-oficina-nautica`,
`guaratuba-reparos-residenciais`, `guaratuba-sabores-da-baia`,
`kitutes-na-mesa`, `mania-de-limpeza`, `mirassol-conserta-celular`,
`mirassol-delicias-caseiras`, `papelemi-personalizados`, `pinturas-nunes`,
`r-beauty`, `raphael-construcoes`, `santos-montador-de-moveis`,
`simone-lacerda-vaz`, `ton-e-cor`, `uberlandia-eletrica-residencial`,
`woodhouse-hamburgueres`.

### `CONFLICT`

`marido-de-aluguel` (Mestre dos Serviços): a única referência histórica é o
canal institucional da 0WEB. O funil permanece sem redirecionamento automático
até o titular fornecer um destino próprio.

## Privacidade e integridade

- Nenhum telefone, token, URL `wa.me` ou e-mail operacional aparece neste
  relatório, em `portfolio-clients`, catálogo ou assets públicos.
- Não houve fallback para o atendimento institucional da 0WEB.
- A pesquisa foi limitada a histórico Git, migrations, documentação, contratos
  de clientKey, fonte de proveniência e configuração privada existente.
- Itens sem prova continuam pendentes: nenhum número foi inventado, truncado ou
  reutilizado entre clientes.
