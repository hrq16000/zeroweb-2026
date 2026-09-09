# Originalidade — V1 x V2 (fingerprint de assets)

A v2 identifica assets por **conteúdo real** (hash), **referência canônica** e
perfil de mídia. Nome de arquivo (`hero.jpg`, `logo.svg`) deixou de ser prova
de duplicação. Queda de score aqui é **METRIC_CORRECTION**, não melhoria de
originalidade: nenhuma página pública mudou.

| Métrica | V1 | V2 |
|---|---|---|
| CLONES | 0 | 0 |
| HIGH_SIMILARITY | 6 | 6 |
| PROJECTS_OVER_60 | 6 | 6 |
| CLUSTERS | 0 | 0 |

| Projeto | Nearest V1 | Nearest V2 | V1 | V2 | Delta | Mudou vizinho? | Motivo | ASSET V1 | ASSET V2 |
|---|---|---|---|---|---|---|---|---|---|
| brecho-sao-francisco | toquinho-de-gente-brecho | toquinho-de-gente-brecho | 31 | 24 | -7 | não | METRIC_CORRECTION | 100 | 15 |
| hbk-iluminacao-led | jc-revestimentos | jc-revestimentos | 38 | 32 | -6 | não | METRIC_CORRECTION | 66.7 | 12 |
| jc-revestimentos | hbk-iluminacao-led | hbk-iluminacao-led | 38 | 32 | -6 | não | METRIC_CORRECTION | 66.7 | 12 |
| marmitaria-dom-diego | angel-mix-brecho | angel-mix-brecho | 38 | 32 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| raphael-construcoes | ton-e-cor | ton-e-cor | 40 | 34 | -6 | não | METRIC_CORRECTION | 100 | 10 |
| ton-e-cor | raphael-construcoes | raphael-construcoes | 40 | 34 | -6 | não | METRIC_CORRECTION | 100 | 10 |
| toquinho-de-gente-brecho | woodhouse-hamburgueres | woodhouse-hamburgueres | 52 | 46 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| woodhouse-hamburgueres | toquinho-de-gente-brecho | toquinho-de-gente-brecho | 52 | 46 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| angel-mix-brecho | dlara-pizzaria | dlara-pizzaria | 46 | 42 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| btb-construcao | easy-clean | easy-clean | 73 | 69 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| casa-nativa | guaratuba-oficina-nautica | guaratuba-oficina-nautica | 40 | 36 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| dlara-pizzaria | angel-mix-brecho | angel-mix-brecho | 46 | 42 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| dona-lucy-salgados | mania-de-limpeza | mania-de-limpeza | 48 | 44 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| easy-clean | btb-construcao | btb-construcao | 73 | 69 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-oficina-nautica | casa-nativa | casa-nativa | 40 | 36 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| reuse-house-brecho | angel-mix-brecho | beto-pasteis | 34 | 30 | -4 | SIM | METRIC_CORRECTION | 100 | 15 |
| beto-pasteis | reuse-house-brecho | reuse-house-brecho | 33 | 30 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| centro-mega | mania-de-limpeza | mania-de-limpeza | 48 | 45 | -3 | não | METRIC_CORRECTION | 100 | 11.2 |
| embalar-embalagens | maximos-cabeleireiros | maximos-cabeleireiros | 64 | 61 | -3 | não | METRIC_CORRECTION | 80 | 7.5 |
| galileu-locacao-brinquedos | lj-cleaning | lj-cleaning | 48 | 45 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-atelie-presentes | mirassol-delicias-caseiras | mirassol-delicias-caseiras | 45 | 42 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-reparos-residenciais | bh-barreiro-marmitas | bruna-diarista | 30 | 27 | -3 | SIM | METRIC_CORRECTION | 100 | 6 |
| lj-cleaning | galileu-locacao-brinquedos | galileu-locacao-brinquedos | 48 | 45 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| manu-pasteis | miro-tech | miro-tech | 42 | 39 | -3 | não | METRIC_CORRECTION | 75 | 2.1 |
| maximos-cabeleireiros | embalar-embalagens | embalar-embalagens | 64 | 61 | -3 | não | METRIC_CORRECTION | 80 | 7.5 |
| mirassol-conserta-celular | mirassol-delicias-caseiras | mirassol-delicias-caseiras | 38 | 35 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| mirassol-delicias-caseiras | guaratuba-atelie-presentes | guaratuba-atelie-presentes | 45 | 42 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| uberlandia-eletrica-residencial | bh-barreiro-marmitas | bh-barreiro-marmitas | 40 | 37 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| assistencia-microondas-santos | liz-moraes-nail-designer | liz-moraes-nail-designer | 51 | 49 | -2 | não | METRIC_CORRECTION | 50 | 9 |
| eletro-solucoes-eficazes | eletrovale-eletromecanica | eletrovale-eletromecanica | 52 | 50 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| eletrovale-eletromecanica | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 52 | 50 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| kitutes-na-mesa | liz-moraes-nail-designer | liz-moraes-nail-designer | 55 | 53 | -2 | não | METRIC_CORRECTION | 40 | 9 |
| miro-tech | kitutes-na-mesa | kitutes-na-mesa | 52 | 50 | -2 | não | METRIC_CORRECTION | 40 | 2.1 |
| acai-total-araucaria | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 59 | 58 | -1 | não | METRIC_CORRECTION | 20 | 7.5 |
| almeida-torres | guaratuba-atelie-presentes | estrutura-nacional | 34 | 33 | -1 | SIM | METRIC_CORRECTION | 100 | 11.2 |
| bruna-diarista | easy-clean | popys-conservacao-limpeza | 67 | 66 | -1 | SIM | METRIC_CORRECTION | 66.7 | 15 |
| clinica-integrada | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 45 | 44 | -1 | não | METRIC_CORRECTION | 27.3 | 6 |
| fernanda-amaral-drywall | rj-servicos-drywall | rj-servicos-drywall | 50 | 49 | -1 | não | METRIC_CORRECTION | 9.1 | 3.3 |
| jkl-marcenaria | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 47 | 46 | -1 | não | METRIC_CORRECTION | 37.5 | 9 |
| liz-moraes-nail-designer | kitutes-na-mesa | mp-festas-eventos | 55 | 54 | -1 | SIM | METRIC_CORRECTION | 40 | 2.1 |
| lolipa-arte-em-festas | confeitaria-sabor-da-realeza | confeitaria-sabor-da-realeza | 39 | 38 | -1 | não | METRIC_CORRECTION | 20 | 7.5 |
| papelemi-personalizados | embalar-embalagens | embalar-embalagens | 50 | 49 | -1 | não | METRIC_CORRECTION | 28.6 | 3.8 |
| paraiso-do-hot-dog | refrigeracao-maresia | kitutes-na-mesa | 25 | 24 | -1 | SIM | METRIC_CORRECTION | 33.3 | 9 |
| paulo-mestre-de-obras | diego-montador-moveis | diego-montador-moveis | 56 | 55 | -1 | não | METRIC_CORRECTION | 20 | 4.3 |
| pinturas-nunes | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 47 | 46 | -1 | não | METRIC_CORRECTION | 37.5 | 9 |
| popys-conservacao-limpeza | bruna-diarista | bruna-diarista | 67 | 66 | -1 | não | METRIC_CORRECTION | 50 | 15 |
| premium-envelopamentos | lolipa-arte-em-festas | jc-revestimentos | 31 | 30 | -1 | SIM | METRIC_CORRECTION | 27.3 | 10 |
| refrigeracao-maresia | liz-moraes-nail-designer | liz-moraes-nail-designer | 51 | 50 | -1 | não | METRIC_CORRECTION | 37.5 | 3.8 |
| rj-servicos-drywall | fernanda-amaral-drywall | fernanda-amaral-drywall | 50 | 49 | -1 | não | METRIC_CORRECTION | 9.1 | 3.3 |
| santos-montador-de-moveis | diego-montador-moveis | diego-montador-moveis | 42 | 41 | -1 | não | METRIC_CORRECTION | 12.5 | 2.1 |
| simone-lacerda-vaz | embalar-embalagens | embalar-embalagens | 49 | 48 | -1 | não | METRIC_CORRECTION | 37.5 | 1.9 |
| sscons | jc-revestimentos | bruna-diarista | 25 | 24 | -1 | SIM | METRIC_CORRECTION | 13.3 | 1.7 |
| vila-da-capivara | mp-festas-eventos | mp-festas-eventos | 54 | 53 | -1 | não | METRIC_CORRECTION | 20 | 5.6 |
| ag-electrical-services | lk-alvenaria | lk-alvenaria | 51 | 51 | 0 | não | UNCHANGED | 0 | 3.2 |
| aguia-sul-sinalizacao | acai-total-araucaria | diego-montador-moveis | 59 | 59 | 0 | SIM | UNCHANGED | 20 | 7.5 |
| artesanatos-darleia-oliveira | lk-alvenaria | lk-alvenaria | 42 | 42 | 0 | não | UNCHANGED | 8.3 | 7.5 |
| bh-barreiro-marmitas | uberlandia-eletrica-residencial | your-brutus-burguer | 40 | 40 | 0 | SIM | UNCHANGED | 100 | 5 |
| confeitaria-sabor-da-realeza | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 50 | 50 | 0 | não | UNCHANGED | 7.7 | 5 |
| denise-gomes-psicologa | mp-festas-eventos | mp-festas-eventos | 53 | 53 | 0 | não | UNCHANGED | 0 | 4.3 |
| diego-montador-moveis | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 59 | 59 | 0 | não | UNCHANGED | 0 | 7.5 |
| dyzpromo | marido-de-aluguel | marido-de-aluguel | 25 | 25 | 0 | não | UNCHANGED | 0 | 1.7 |
| ecommerce-on | acai-total-araucaria | acai-total-araucaria | 54 | 54 | 0 | não | UNCHANGED | 10 | 7.5 |
| eisenfer-tubos-acos | no-brilho-higienizacao | no-brilho-higienizacao | 42 | 42 | 0 | não | UNCHANGED | 11.1 | 4.3 |
| emporio-lelecute | assistencia-microondas-santos | assistencia-microondas-santos | 29 | 29 | 0 | não | UNCHANGED | 0 | 2.5 |
| enoel-portas | btb-construcao | btb-construcao | 56 | 56 | 0 | não | UNCHANGED | 11.1 | 11.2 |
| espaco-cih-luh | kitutes-na-mesa | kitutes-na-mesa | 39 | 39 | 0 | não | UNCHANGED | 0 | 4.3 |
| estrutura-nacional | pinturas-nunes | pinturas-nunes | 41 | 41 | 0 | não | UNCHANGED | 12.5 | 5 |
| guaratuba-sabores-da-baia | heloa-gas | heloa-gas | 30 | 30 | 0 | não | UNCHANGED | 14.3 | 3 |
| heloa-gas | dona-lucy-salgados | dona-lucy-salgados | 42 | 42 | 0 | não | UNCHANGED | 12.5 | 15 |
| js-eletrica-manutencao | maximos-cabeleireiros | maximos-cabeleireiros | 60 | 60 | 0 | não | UNCHANGED | 14.3 | 9 |
| lk-alvenaria | ag-electrical-services | ag-electrical-services | 51 | 51 | 0 | não | UNCHANGED | 0 | 3.2 |
| lucas-arruma-maquina-lavar | denise-gomes-psicologa | denise-gomes-psicologa | 44 | 44 | 0 | não | UNCHANGED | 10 | 8.6 |
| mania-de-limpeza | enoel-portas | js-eletrica-manutencao | 54 | 54 | 0 | SIM | UNCHANGED | 100 | 11.2 |
| marido-de-aluguel | paulo-mestre-de-obras | paulo-mestre-de-obras | 38 | 38 | 0 | não | UNCHANGED | 10 | 1.9 |
| mary-diarista | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 58 | 58 | 0 | não | UNCHANGED | 0 | 2.5 |
| mp-festas-eventos | studio-de-cilios | studio-de-cilios | 59 | 59 | 0 | não | UNCHANGED | 0 | 4.3 |
| no-brilho-higienizacao | eisenfer-tubos-acos | eisenfer-tubos-acos | 42 | 42 | 0 | não | UNCHANGED | 11.1 | 4.3 |
| pastelaria-route-66 | mp-festas-eventos | mp-festas-eventos | 32 | 32 | 0 | não | UNCHANGED | 0 | 5.6 |
| r_beauty | renata-beauty | renata-beauty | 51 | 51 | 0 | não | UNCHANGED | 14.3 | 7.5 |
| renata-beauty | r_beauty | r_beauty | 51 | 51 | 0 | não | UNCHANGED | 14.3 | 7.5 |
| rm-fretes | marido-de-aluguel | marido-de-aluguel | 35 | 35 | 0 | não | UNCHANGED | 0 | 1.7 |
| salao-da-marcia | liz-moraes-nail-designer | liz-moraes-nail-designer | 47 | 47 | 0 | não | UNCHANGED | 7.1 | 1.9 |
| sos-presentes-cosmeticos | confeitaria-sabor-da-realeza | confeitaria-sabor-da-realeza | 50 | 50 | 0 | não | UNCHANGED | 7.7 | 5 |
| studio-de-cilios | mp-festas-eventos | mp-festas-eventos | 59 | 59 | 0 | não | UNCHANGED | 0 | 4.3 |
| thays-camilla | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 46 | 46 | 0 | não | UNCHANGED | 14.3 | 2.1 |
| your-brutus-burguer | mimo-salgados-doces | mimo-salgados-doces | 45 | 45 | 0 | não | UNCHANGED | 0 | 7.5 |
| auto-socorro-dentinho | mimo-salgados-doces | mimo-salgados-doces | 37 | 38 | 1 | não | METRIC_SENSITIVITY | 0 | 5 |
| confeitaria-chyrley | studio-de-cilios | studio-de-cilios | 55 | 56 | 1 | não | METRIC_SENSITIVITY | 0 | 8.6 |
| mimo-salgados-doces | popys-conservacao-limpeza | popys-conservacao-limpeza | 55 | 56 | 1 | não | METRIC_SENSITIVITY | 0 | 5 |
