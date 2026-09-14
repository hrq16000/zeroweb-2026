# Reconciliação de destinos WhatsApp — portfolios

Auditoria da `main` em 14/09/2026. Nenhum número, token ou valor secreto é exibido.

## Resumo

- Total auditado: **92 clientKeys**.
- CONFIGURED: **4**.
- MISSING: **88**.
- INVALID_FORMAT: **0** (os valores secretos não foram lidos/expostos).
- CONFLICT: **0** entre clientKeys; existem nomes de secrets de ambiente sem clientKey correspondente, tratados como órfãos e não associados automaticamente.
- Auditoria de funil existente: **92 PASS, 0 WARNING, 0 FAIL** em `reports/portfolio-funnel-context.json`.

## ClientKeys configurados

| clientKey | status | fonte da confirmação |
| --- | --- | --- |
| `refrigeracao-maresia` | CONFIGURED | secret de ambiente Sites (nome verificado; valor oculto) |
| `maximos-cabeleireiros` | CONFIGURED | secret de ambiente Sites (nome verificado; valor oculto) |
| `embalar-embalagens` | CONFIGURED | secret de ambiente Sites (nome verificado; valor oculto) |
| `simone-lacerda-vaz` | CONFIGURED | secret de ambiente Sites (nome verificado; valor oculto) |

## ClientKeys ausentes ou conflitantes

| clientKey | status | fonte consultada / ação |
| --- | --- | --- |
| `sos-presentes-cosmeticos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `dyzpromo` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `renata-beauty` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `r-beauty` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `marido-de-aluguel` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `emporio-lelecute` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `paraiso-do-hot-dog` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `rm-fretes` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `rj-servicos-drywall` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `confeitaria-chyrley` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `mp-festas-eventos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `studio-de-cilios` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `ag-electrical-services` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `vila-da-capivara` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `lk-alvenaria` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `lucas-arruma-maquina-lavar` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `paulo-mestre-de-obras` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `ecommerce-on` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `no-brilho-higienizacao` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `salao-da-marcia` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `espaco-cih-luh` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `diego-montador-moveis` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `aguia-sul-sinalizacao` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `eletrovale-eletromecanica` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `eletro-solucoes-eficazes` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `eisenfer-tubos-acos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `mary-diarista` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `acai-total-araucaria` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `santos-montador-de-moveis` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `marmitaria-dom-diego` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `beto-pasteis` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `woodhouse-hamburgueres` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `dlara-pizzaria` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `toquinho-de-gente-brecho` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `reuse-house-brecho` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `brecho-sao-francisco` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `angel-mix-brecho` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `lolipa-arte-em-festas` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `confeitaria-sabor-da-realeza` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `premium-envelopamentos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `miro-tech` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `galileu-locacao-brinquedos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `lj-cleaning` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `manu-pasteis` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `liz-moraes-nail-designer` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `assistencia-microondas-santos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `artesanatos-darleia-oliveira` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `thays-camilla` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `fernanda-amaral-drywall` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `denise-gomes-psicologa` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `ton-e-cor` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `raphael-construcoes` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `jc-revestimentos` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `hbk-iluminacao-led` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `heloa-gas` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `almeida-torres` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `bh-barreiro-marmitas` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `casa-nativa` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `clinica-integrada` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `guaratuba-atelie-presentes` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `guaratuba-oficina-nautica` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `guaratuba-reparos-residenciais` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `guaratuba-sabores-da-baia` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `mirassol-conserta-celular` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `mirassol-delicias-caseiras` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `uberlandia-eletrica-residencial` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `sscons` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `mimo-salgados-doces` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `popys-conservacao-limpeza` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `bruna-diarista` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `btb-construcao` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `easy-clean` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `js-eletrica-manutencao` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `papelemi-personalizados` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `kitutes-na-mesa` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `enoel-portas` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `mania-de-limpeza` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `dona-lucy-salgados` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `centro-mega` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `pastelaria-route-66` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `your_brutus_burguer` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `auto-socorro-dentinho` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `pinturas-nunes` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `estrutura-nacional` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `carecas-infotec` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `moreira-auto-mecanica` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `jkl-decor` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |
| `adhonep-curitiba` | MISSING | nenhuma fonte operacional com valor disponível; migrations/contexto apenas definem o clientKey; nenhum número foi inferido, reutilizado ou promovido a secret. |

## Fontes e reconciliação

- `src/config/portfolio-clients.json`: lista canônica de 92 clientKeys e contrato técnico.
- `src/config/portfolio-catalog.json`: catálogo de descoberta e slugs.
- `reports/portfolio-funnel-context.json`: contexto de CTA/funil; 92/92 PASS.
- migrations Supabase e documentação do projeto: usadas apenas para confirmar identidade do clientKey e do funil; não foram usadas para inventar destinos.
- secrets do ambiente Sites: somente nomes/chaves foram enumerados; valores permaneceram ocultos.
- Histórico/documentação fornecidos anteriormente: quando havia um número associado a um cliente (por exemplo, o material do Santos), ele foi reconhecido como fonte de origem, mas não foi marcado CONFIGURED sem secret operacional correspondente.

## Privacidade

Nenhum contato, número, token ou valor secreto foi incluído neste relatório. A validação de privacidade do bundle público permanece obrigatória; nenhum valor de secret deve ser colocado em código, HTML, JS público ou migrations.
