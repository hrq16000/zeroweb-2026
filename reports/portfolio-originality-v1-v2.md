# Originalidade — V1 x V2 (fingerprint de assets)

A v2 identifica assets por **conteúdo real** (hash), **referência canônica** e
perfil de mídia. Nome de arquivo (`hero.jpg`, `logo.svg`) deixou de ser prova
de duplicação. Queda de score aqui é **METRIC_CORRECTION**, não melhoria de
originalidade: nenhuma página pública mudou.

| Métrica | V1 | V2 |
|---|---|---|
| CLONES | 0 | 0 |
| HIGH_SIMILARITY | 0 | 0 |
| PROJECTS_OVER_60 | 0 | 0 |
| CLUSTERS | 0 | 0 |

| Projeto | Nearest V1 | Nearest V2 | V1 | V2 | Delta | Mudou vizinho? | Motivo | ASSET V1 | ASSET V2 |
|---|---|---|---|---|---|---|---|---|---|
| brecho-sao-francisco | toquinho-de-gente-brecho | toquinho-de-gente-brecho | 31 | 24 | -7 | não | METRIC_CORRECTION | 100 | 15 |
| hbk-iluminacao-led | jc-revestimentos | jc-revestimentos | 38 | 32 | -6 | não | METRIC_CORRECTION | 66.7 | 12 |
| jc-revestimentos | hbk-iluminacao-led | hbk-iluminacao-led | 38 | 32 | -6 | não | METRIC_CORRECTION | 66.7 | 12 |
| marmitaria-dom-diego | woodhouse-hamburgueres | woodhouse-hamburgueres | 37 | 31 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| raphael-construcoes | ton-e-cor | ton-e-cor | 40 | 34 | -6 | não | METRIC_CORRECTION | 100 | 10 |
| ton-e-cor | raphael-construcoes | raphael-construcoes | 40 | 34 | -6 | não | METRIC_CORRECTION | 100 | 10 |
| toquinho-de-gente-brecho | woodhouse-hamburgueres | woodhouse-hamburgueres | 52 | 46 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| woodhouse-hamburgueres | toquinho-de-gente-brecho | toquinho-de-gente-brecho | 52 | 46 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| angel-mix-brecho | dlara-pizzaria | dlara-pizzaria | 46 | 42 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| casa-nativa | guaratuba-oficina-nautica | guaratuba-oficina-nautica | 40 | 36 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| dlara-pizzaria | angel-mix-brecho | angel-mix-brecho | 46 | 42 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| dona-lucy-salgados | mania-de-limpeza | mania-de-limpeza | 48 | 44 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| enoel-portas | maximos-cabeleireiros | mania-de-limpeza | 55 | 51 | -4 | SIM | METRIC_CORRECTION | 100 | 15 |
| guaratuba-oficina-nautica | casa-nativa | casa-nativa | 40 | 36 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| maximos-cabeleireiros | enoel-portas | enoel-portas | 55 | 51 | -4 | não | METRIC_CORRECTION | 100 | 11.2 |
| reuse-house-brecho | angel-mix-brecho | beto-pasteis | 34 | 30 | -4 | SIM | METRIC_CORRECTION | 100 | 15 |
| beto-pasteis | reuse-house-brecho | reuse-house-brecho | 33 | 30 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| carecas-infotec | jkl-decor | jkl-decor | 21 | 18 | -3 | não | METRIC_CORRECTION | 9.1 | 6.7 |
| galileu-locacao-brinquedos | lj-cleaning | lj-cleaning | 48 | 45 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-atelie-presentes | mirassol-delicias-caseiras | mirassol-delicias-caseiras | 45 | 42 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-reparos-residenciais | bh-barreiro-marmitas | bh-barreiro-marmitas | 30 | 27 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| jkl-decor | moreira-auto-mecanica | moreira-auto-mecanica | 48 | 45 | -3 | não | METRIC_CORRECTION | 16.7 | 12.5 |
| lj-cleaning | galileu-locacao-brinquedos | galileu-locacao-brinquedos | 48 | 45 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| mania-de-limpeza | enoel-portas | enoel-portas | 54 | 51 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| manu-pasteis | miro-tech | miro-tech | 42 | 39 | -3 | não | METRIC_CORRECTION | 75 | 2.1 |
| mirassol-conserta-celular | mirassol-delicias-caseiras | mirassol-delicias-caseiras | 38 | 35 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| mirassol-delicias-caseiras | guaratuba-atelie-presentes | guaratuba-atelie-presentes | 45 | 42 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| moreira-auto-mecanica | jkl-decor | jkl-decor | 48 | 45 | -3 | não | METRIC_CORRECTION | 16.7 | 12.5 |
| uberlandia-eletrica-residencial | bh-barreiro-marmitas | bh-barreiro-marmitas | 40 | 37 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| assistencia-microondas-santos | liz-moraes-nail-designer | liz-moraes-nail-designer | 51 | 49 | -2 | não | METRIC_CORRECTION | 50 | 9 |
| denise-gomes-psicologa | liz-moraes-nail-designer | liz-moraes-nail-designer | 52 | 50 | -2 | não | METRIC_CORRECTION | 60 | 7.5 |
| eletro-solucoes-eficazes | eletrovale-eletromecanica | eletrovale-eletromecanica | 52 | 50 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| eletrovale-eletromecanica | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 52 | 50 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| kitutes-na-mesa | liz-moraes-nail-designer | liz-moraes-nail-designer | 55 | 53 | -2 | não | METRIC_CORRECTION | 40 | 9 |
| liz-moraes-nail-designer | kitutes-na-mesa | kitutes-na-mesa | 55 | 53 | -2 | não | METRIC_CORRECTION | 40 | 9 |
| miro-tech | kitutes-na-mesa | kitutes-na-mesa | 52 | 50 | -2 | não | METRIC_CORRECTION | 40 | 2.1 |
| simone-lacerda-vaz | enoel-portas | enoel-portas | 45 | 43 | -2 | não | METRIC_CORRECTION | 42.9 | 6 |
| almeida-torres | guaratuba-atelie-presentes | estrutura-nacional | 34 | 33 | -1 | SIM | METRIC_CORRECTION | 100 | 6 |
| btb-construcao | popys-conservacao-limpeza | popys-conservacao-limpeza | 45 | 44 | -1 | não | METRIC_CORRECTION | 37.5 | 15 |
| clinica-integrada | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 45 | 44 | -1 | não | METRIC_CORRECTION | 27.3 | 6 |
| confeitaria-chyrley | acai-total-araucaria | acai-total-araucaria | 42 | 41 | -1 | não | METRIC_CORRECTION | 9.1 | 4.3 |
| estrutura-nacional | pinturas-nunes | pinturas-nunes | 42 | 41 | -1 | não | METRIC_CORRECTION | 25 | 9 |
| fernanda-amaral-drywall | rj-servicos-drywall | rj-servicos-drywall | 50 | 49 | -1 | não | METRIC_CORRECTION | 9.1 | 3.3 |
| js-eletrica-manutencao | cris-presentes-colonia-rio-grande | cris-presentes-colonia-rio-grande | 48 | 47 | -1 | não | METRIC_CORRECTION | 14.3 | 6 |
| lolipa-arte-em-festas | confeitaria-sabor-da-realeza | confeitaria-sabor-da-realeza | 39 | 38 | -1 | não | METRIC_CORRECTION | 20 | 7.5 |
| mary-diarista | ecommerce-on | ecommerce-on | 48 | 47 | -1 | não | METRIC_CORRECTION | 20 | 3.8 |
| papelemi-personalizados | embalar-embalagens | embalar-embalagens | 44 | 43 | -1 | não | METRIC_CORRECTION | 28.6 | 3.8 |
| paraiso-do-hot-dog | confeitaria-chyrley | confeitaria-chyrley | 26 | 25 | -1 | não | METRIC_CORRECTION | 33.3 | 10 |
| pastelaria-route-66 | simone-lacerda-vaz | simone-lacerda-vaz | 32 | 31 | -1 | não | METRIC_CORRECTION | 25 | 5.6 |
| pinturas-nunes | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 47 | 46 | -1 | não | METRIC_CORRECTION | 37.5 | 9 |
| premium-envelopamentos | lolipa-arte-em-festas | jc-revestimentos | 31 | 30 | -1 | SIM | METRIC_CORRECTION | 27.3 | 10 |
| refrigeracao-maresia | liz-moraes-nail-designer | liz-moraes-nail-designer | 51 | 50 | -1 | não | METRIC_CORRECTION | 37.5 | 3.8 |
| rj-servicos-drywall | fernanda-amaral-drywall | fernanda-amaral-drywall | 50 | 49 | -1 | não | METRIC_CORRECTION | 9.1 | 3.3 |
| santos-montador-de-moveis | enoel-portas | enoel-portas | 37 | 36 | -1 | não | METRIC_CORRECTION | 11.1 | 9 |
| sscons | jc-revestimentos | jc-revestimentos | 25 | 24 | -1 | não | METRIC_CORRECTION | 13.3 | 3.3 |
| vila-da-capivara | studio-de-cilios | studio-de-cilios | 46 | 45 | -1 | não | METRIC_CORRECTION | 18.8 | 3 |
| acai-total-araucaria | easy-clean | easy-clean | 51 | 51 | 0 | não | UNCHANGED | 11.1 | 6 |
| adhonep-curitiba | r_beauty | r_beauty | 26 | 26 | 0 | não | UNCHANGED | 0 | 9 |
| ag-electrical-services | lk-alvenaria | lk-alvenaria | 51 | 51 | 0 | não | UNCHANGED | 0 | 3.2 |
| arildo-madeiras | autoescola-aptos | autoescola-aptos | 38 | 38 | 0 | não | UNCHANGED | 7.1 | 0 |
| artesanatos-darleia-oliveira | lk-alvenaria | lk-alvenaria | 42 | 42 | 0 | não | UNCHANGED | 8.3 | 7.5 |
| autoescola-aptos | arildo-madeiras | arildo-madeiras | 38 | 38 | 0 | não | UNCHANGED | 7.1 | 0 |
| bh-barreiro-marmitas | uberlandia-eletrica-residencial | your-brutus-burguer | 40 | 40 | 0 | SIM | UNCHANGED | 100 | 5 |
| bruna-diarista | diego-montador-moveis | diego-montador-moveis | 52 | 52 | 0 | não | UNCHANGED | 0 | 2.5 |
| catharine-lima-studio | kitutes-na-mesa | kitutes-na-mesa | 48 | 48 | 0 | não | UNCHANGED | 0 | 2.5 |
| centro-mega | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 41 | 41 | 0 | não | UNCHANGED | 0 | 2.5 |
| confeitaria-sabor-da-realeza | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 50 | 50 | 0 | não | UNCHANGED | 7.7 | 5 |
| cris-presentes-colonia-rio-grande | easy-clean | easy-clean | 49 | 49 | 0 | não | UNCHANGED | 11.1 | 11.2 |
| diego-montador-moveis | bruna-diarista | bruna-diarista | 52 | 52 | 0 | não | UNCHANGED | 0 | 2.5 |
| dyzpromo | marido-de-aluguel | marido-de-aluguel | 25 | 25 | 0 | não | UNCHANGED | 0 | 1.7 |
| easy-clean | acai-total-araucaria | acai-total-araucaria | 51 | 51 | 0 | não | UNCHANGED | 11.1 | 6 |
| ecommerce-on | mary-diarista | paulo-mestre-de-obras | 48 | 48 | 0 | SIM | UNCHANGED | 20 | 7.5 |
| eisenfer-tubos-acos | no-brilho-higienizacao | no-brilho-higienizacao | 43 | 43 | 0 | não | UNCHANGED | 11.1 | 4.3 |
| embalar-embalagens | popys-conservacao-limpeza | popys-conservacao-limpeza | 51 | 51 | 0 | não | UNCHANGED | 0 | 4.3 |
| emporio-lelecute | assistencia-microondas-santos | assistencia-microondas-santos | 29 | 29 | 0 | não | UNCHANGED | 0 | 2.5 |
| espaco-cih-luh | kitutes-na-mesa | kitutes-na-mesa | 39 | 39 | 0 | não | UNCHANGED | 0 | 4.3 |
| guaratuba-sabores-da-baia | heloa-gas | heloa-gas | 30 | 30 | 0 | não | UNCHANGED | 14.3 | 3 |
| heloa-gas | dona-lucy-salgados | dona-lucy-salgados | 42 | 42 | 0 | não | UNCHANGED | 12.5 | 15 |
| lk-alvenaria | ag-electrical-services | ag-electrical-services | 51 | 51 | 0 | não | UNCHANGED | 0 | 3.2 |
| lucas-arruma-maquina-lavar | easy-clean | easy-clean | 45 | 45 | 0 | não | UNCHANGED | 20 | 10 |
| marido-de-aluguel | auto-socorro-dentinho | auto-socorro-dentinho | 38 | 38 | 0 | não | UNCHANGED | 0 | 2.5 |
| mimo-salgados-doces | kitutes-na-mesa | kitutes-na-mesa | 51 | 51 | 0 | não | UNCHANGED | 14.3 | 5 |
| no-brilho-higienizacao | eisenfer-tubos-acos | eisenfer-tubos-acos | 43 | 43 | 0 | não | UNCHANGED | 11.1 | 4.3 |
| paulo-mestre-de-obras | ecommerce-on | ecommerce-on | 48 | 48 | 0 | não | UNCHANGED | 6.7 | 7.5 |
| popys-conservacao-limpeza | embalar-embalagens | embalar-embalagens | 51 | 51 | 0 | não | UNCHANGED | 0 | 4.3 |
| r_beauty | renata-beauty | renata-beauty | 51 | 51 | 0 | não | UNCHANGED | 14.3 | 7.5 |
| renata-beauty | r_beauty | r_beauty | 51 | 51 | 0 | não | UNCHANGED | 14.3 | 7.5 |
| rm-fretes | marido-de-aluguel | marido-de-aluguel | 35 | 35 | 0 | não | UNCHANGED | 0 | 1.7 |
| salao-da-marcia | liz-moraes-nail-designer | liz-moraes-nail-designer | 47 | 47 | 0 | não | UNCHANGED | 7.1 | 1.9 |
| sos-presentes-cosmeticos | confeitaria-sabor-da-realeza | confeitaria-sabor-da-realeza | 50 | 50 | 0 | não | UNCHANGED | 7.7 | 5 |
| studio-de-cilios | liz-moraes-nail-designer | liz-moraes-nail-designer | 47 | 47 | 0 | não | UNCHANGED | 12.5 | 1.9 |
| thays-camilla | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 46 | 46 | 0 | não | UNCHANGED | 14.3 | 2.1 |
| your-brutus-burguer | mimo-salgados-doces | mimo-salgados-doces | 45 | 45 | 0 | não | UNCHANGED | 0 | 7.5 |
| aguia-sul-sinalizacao | mp-festas-eventos | mp-festas-eventos | 51 | 52 | 1 | não | METRIC_SENSITIVITY | 0 | 2.5 |
| auto-socorro-dentinho | mimo-salgados-doces | mimo-salgados-doces | 39 | 40 | 1 | não | METRIC_SENSITIVITY | 0 | 5 |
| mp-festas-eventos | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 51 | 52 | 1 | não | METRIC_SENSITIVITY | 0 | 2.5 |
