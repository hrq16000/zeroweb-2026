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
| brecho-sao-francisco | toquinho-de-gente-brecho | toquinho-de-gente-brecho | 32 | 25 | -7 | não | METRIC_CORRECTION | 100 | 15 |
| toquinho-de-gente-brecho | woodhouse-hamburgueres | woodhouse-hamburgueres | 45 | 38 | -7 | não | METRIC_CORRECTION | 100 | 15 |
| angel-mix-brecho | woodhouse-hamburgueres | woodhouse-hamburgueres | 54 | 48 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| marmitaria-dom-diego | angel-mix-brecho | angel-mix-brecho | 36 | 30 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| raphael-construcoes | ton-e-cor | ton-e-cor | 40 | 34 | -6 | não | METRIC_CORRECTION | 100 | 10 |
| ton-e-cor | raphael-construcoes | raphael-construcoes | 40 | 34 | -6 | não | METRIC_CORRECTION | 100 | 10 |
| woodhouse-hamburgueres | angel-mix-brecho | angel-mix-brecho | 54 | 48 | -6 | não | METRIC_CORRECTION | 100 | 15 |
| hbk-iluminacao-led | jc-revestimentos | jc-revestimentos | 36 | 31 | -5 | não | METRIC_CORRECTION | 66.7 | 12 |
| jc-revestimentos | hbk-iluminacao-led | hbk-iluminacao-led | 36 | 31 | -5 | não | METRIC_CORRECTION | 66.7 | 12 |
| beto-pasteis | reuse-house-brecho | reuse-house-brecho | 40 | 36 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| enoel-portas | mania-de-limpeza | mania-de-limpeza | 53 | 49 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| lj-cleaning | galileu-locacao-brinquedos | galileu-locacao-brinquedos | 45 | 41 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| mania-de-limpeza | enoel-portas | enoel-portas | 53 | 49 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| maximos-cabeleireiros | kitutes-na-mesa | kitutes-na-mesa | 52 | 48 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| no-brilho-higienizacao | lucas-arruma-maquina-lavar | eisenfer-tubos-acos | 44 | 40 | -4 | SIM | METRIC_CORRECTION | 100 | 4.3 |
| reuse-house-brecho | beto-pasteis | beto-pasteis | 40 | 36 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| uberlandia-eletrica-residencial | bh-barreiro-marmitas | bh-barreiro-marmitas | 41 | 37 | -4 | não | METRIC_CORRECTION | 100 | 15 |
| carecas-infotec | jkl-decor | jkl-decor | 21 | 18 | -3 | não | METRIC_CORRECTION | 9.1 | 6.7 |
| casa-nativa | guaratuba-oficina-nautica | guaratuba-oficina-nautica | 40 | 37 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| dlara-pizzaria | angel-mix-brecho | angel-mix-brecho | 48 | 45 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-atelie-presentes | mirassol-delicias-caseiras | mirassol-delicias-caseiras | 45 | 42 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-oficina-nautica | casa-nativa | casa-nativa | 40 | 37 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-reparos-residenciais | bh-barreiro-marmitas | bh-barreiro-marmitas | 31 | 28 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| guaratuba-sabores-da-baia | uberlandia-eletrica-residencial | catharine-lima-studio | 35 | 32 | -3 | SIM | METRIC_CORRECTION | 100 | 3 |
| jkl-decor | moreira-auto-mecanica | moreira-auto-mecanica | 48 | 45 | -3 | não | METRIC_CORRECTION | 16.7 | 12.5 |
| manu-pasteis | miro-tech | miro-tech | 41 | 38 | -3 | não | METRIC_CORRECTION | 75 | 2.1 |
| mirassol-conserta-celular | mirassol-delicias-caseiras | mirassol-delicias-caseiras | 38 | 35 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| mirassol-delicias-caseiras | guaratuba-atelie-presentes | guaratuba-atelie-presentes | 45 | 42 | -3 | não | METRIC_CORRECTION | 100 | 15 |
| moreira-auto-mecanica | jkl-decor | jkl-decor | 48 | 45 | -3 | não | METRIC_CORRECTION | 16.7 | 12.5 |
| confeitaria-sabor-da-realeza | miro-tech | sos-presentes-cosmeticos | 52 | 50 | -2 | SIM | METRIC_CORRECTION | 100 | 5 |
| denise-gomes-psicologa | liz-moraes-nail-designer | liz-moraes-nail-designer | 47 | 45 | -2 | não | METRIC_CORRECTION | 60 | 7.5 |
| dona-lucy-salgados | mania-de-limpeza | bruna-diarista | 45 | 43 | -2 | SIM | METRIC_CORRECTION | 100 | 11.2 |
| eletro-solucoes-eficazes | eletrovale-eletromecanica | eletrovale-eletromecanica | 52 | 50 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| eletrovale-eletromecanica | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 52 | 50 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| galileu-locacao-brinquedos | lj-cleaning | eletro-solucoes-eficazes | 45 | 43 | -2 | SIM | METRIC_CORRECTION | 100 | 5 |
| lucas-arruma-maquina-lavar | no-brilho-higienizacao | aguia-sul-sinalizacao | 44 | 42 | -2 | SIM | METRIC_CORRECTION | 100 | 1.9 |
| miro-tech | kitutes-na-mesa | kitutes-na-mesa | 53 | 51 | -2 | não | METRIC_CORRECTION | 40 | 2.1 |
| pinturas-nunes | eletro-solucoes-eficazes | eletro-solucoes-eficazes | 48 | 46 | -2 | não | METRIC_CORRECTION | 37.5 | 9 |
| arildo-madeiras | autoescola-aptos | autoescola-aptos | 39 | 38 | -1 | não | METRIC_CORRECTION | 7.1 | 0 |
| artesanatos-darleia-oliveira | thays-camilla | lk-alvenaria | 43 | 42 | -1 | SIM | METRIC_CORRECTION | 100 | 7.5 |
| assistencia-microondas-santos | liz-moraes-nail-designer | liz-moraes-nail-designer | 50 | 49 | -1 | não | METRIC_CORRECTION | 42.9 | 7.5 |
| autoescola-aptos | arildo-madeiras | arildo-madeiras | 39 | 38 | -1 | não | METRIC_CORRECTION | 7.1 | 0 |
| bh-barreiro-marmitas | uberlandia-eletrica-residencial | your-brutus-burguer | 41 | 40 | -1 | SIM | METRIC_CORRECTION | 100 | 5 |
| btb-construcao | popys-conservacao-limpeza | embalar-embalagens | 45 | 44 | -1 | SIM | METRIC_CORRECTION | 37.5 | 4.3 |
| clinica-integrada | sos-presentes-cosmeticos | sos-presentes-cosmeticos | 46 | 45 | -1 | não | METRIC_CORRECTION | 27.3 | 6 |
| dona-garimpeira-brecho | assistencia-microondas-santos | assistencia-microondas-santos | 30 | 29 | -1 | não | METRIC_CORRECTION | 11.1 | 2.1 |
| eisenfer-tubos-acos | no-brilho-higienizacao | aguia-sul-sinalizacao | 41 | 40 | -1 | SIM | METRIC_CORRECTION | 11.1 | 3 |
| fernanda-amaral-drywall | rj-servicos-drywall | rj-servicos-drywall | 51 | 50 | -1 | não | METRIC_CORRECTION | 9.1 | 3.3 |
| kitutes-na-mesa | liz-moraes-nail-designer | liz-moraes-nail-designer | 55 | 54 | -1 | não | METRIC_CORRECTION | 40 | 9 |
| liz-moraes-nail-designer | kitutes-na-mesa | kitutes-na-mesa | 55 | 54 | -1 | não | METRIC_CORRECTION | 40 | 9 |
| lolipa-arte-em-festas | confeitaria-sabor-da-realeza | confeitaria-sabor-da-realeza | 38 | 37 | -1 | não | METRIC_CORRECTION | 20 | 7.5 |
| mary-diarista | liz-moraes-nail-designer | liz-moraes-nail-designer | 47 | 46 | -1 | não | METRIC_CORRECTION | 14.3 | 2.1 |
| mimo-salgados-doces | kitutes-na-mesa | kitutes-na-mesa | 45 | 44 | -1 | não | METRIC_CORRECTION | 14.3 | 5 |
| papelemi-personalizados | embalar-embalagens | embalar-embalagens | 44 | 43 | -1 | não | METRIC_CORRECTION | 28.6 | 3.8 |
| paraiso-do-hot-dog | refrigeracao-maresia | miro-tech | 25 | 24 | -1 | SIM | METRIC_CORRECTION | 33.3 | 2.1 |
| premium-envelopamentos | lolipa-arte-em-festas | jc-revestimentos | 31 | 30 | -1 | SIM | METRIC_CORRECTION | 27.3 | 10 |
| refrigeracao-maresia | liz-moraes-nail-designer | liz-moraes-nail-designer | 50 | 49 | -1 | não | METRIC_CORRECTION | 37.5 | 3.8 |
| rj-servicos-drywall | fernanda-amaral-drywall | fernanda-amaral-drywall | 51 | 50 | -1 | não | METRIC_CORRECTION | 9.1 | 3.3 |
| simone-lacerda-vaz | embalar-embalagens | embalar-embalagens | 43 | 42 | -1 | não | METRIC_CORRECTION | 37.5 | 1.9 |
| sscons | jc-revestimentos | jc-revestimentos | 25 | 24 | -1 | não | METRIC_CORRECTION | 13.3 | 3.3 |
| studio-de-cilios | vila-da-capivara | liz-moraes-nail-designer | 47 | 46 | -1 | SIM | METRIC_CORRECTION | 18.8 | 1.9 |
| vila-da-capivara | studio-de-cilios | studio-de-cilios | 47 | 46 | -1 | não | METRIC_CORRECTION | 18.8 | 3 |
| acai-total-araucaria | kitutes-na-mesa | kitutes-na-mesa | 49 | 49 | 0 | não | UNCHANGED | 0 | 6 |
| adhonep-curitiba | reuse-house-brecho | reuse-house-brecho | 27 | 27 | 0 | não | UNCHANGED | 0 | 2.5 |
| ag-electrical-services | lk-alvenaria | lk-alvenaria | 43 | 43 | 0 | não | UNCHANGED | 0 | 3.2 |
| aguia-sul-sinalizacao | mp-festas-eventos | mp-festas-eventos | 49 | 49 | 0 | não | UNCHANGED | 0 | 2.5 |
| almeida-torres | estrutura-nacional | estrutura-nacional | 35 | 35 | 0 | não | UNCHANGED | 16.7 | 6 |
| auto-socorro-dentinho | marido-de-aluguel | marido-de-aluguel | 38 | 38 | 0 | não | UNCHANGED | 0 | 2.5 |
| catharine-lima-studio | kitutes-na-mesa | kitutes-na-mesa | 47 | 47 | 0 | não | UNCHANGED | 0 | 2.5 |
| centro-mega | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 41 | 41 | 0 | não | UNCHANGED | 0 | 2.5 |
| confeitaria-chyrley | acai-total-araucaria | acai-total-araucaria | 45 | 45 | 0 | não | UNCHANGED | 9.1 | 4.3 |
| cris-presentes-colonia-rio-grande | js-eletrica-manutencao | js-eletrica-manutencao | 47 | 47 | 0 | não | UNCHANGED | 14.3 | 6 |
| dyzpromo | marido-de-aluguel | marido-de-aluguel | 25 | 25 | 0 | não | UNCHANGED | 0 | 1.7 |
| easy-clean | acai-total-araucaria | acai-total-araucaria | 47 | 47 | 0 | não | UNCHANGED | 11.1 | 6 |
| ecommerce-on | mary-diarista | mary-diarista | 44 | 44 | 0 | não | UNCHANGED | 20 | 3.8 |
| embalar-embalagens | popys-conservacao-limpeza | popys-conservacao-limpeza | 52 | 52 | 0 | não | UNCHANGED | 0 | 4.3 |
| emporio-lelecute | assistencia-microondas-santos | assistencia-microondas-santos | 28 | 28 | 0 | não | UNCHANGED | 0 | 2.1 |
| espaco-cih-luh | kitutes-na-mesa | kitutes-na-mesa | 39 | 39 | 0 | não | UNCHANGED | 0 | 4.3 |
| estrutura-nacional | pinturas-nunes | pinturas-nunes | 40 | 40 | 0 | não | UNCHANGED | 25 | 9 |
| heloa-gas | catharine-lima-studio | catharine-lima-studio | 41 | 41 | 0 | não | UNCHANGED | 0 | 3 |
| js-eletrica-manutencao | cris-presentes-colonia-rio-grande | cris-presentes-colonia-rio-grande | 47 | 47 | 0 | não | UNCHANGED | 14.3 | 6 |
| lk-alvenaria | clinica-integrada | sos-presentes-cosmeticos | 45 | 45 | 0 | SIM | UNCHANGED | 37.5 | 3.3 |
| marido-de-aluguel | auto-socorro-dentinho | auto-socorro-dentinho | 38 | 38 | 0 | não | UNCHANGED | 0 | 2.5 |
| mp-festas-eventos | aguia-sul-sinalizacao | aguia-sul-sinalizacao | 49 | 49 | 0 | não | UNCHANGED | 0 | 2.5 |
| pastelaria-route-66 | dona-lucy-salgados | dona-lucy-salgados | 34 | 34 | 0 | não | UNCHANGED | 0 | 1.7 |
| popys-conservacao-limpeza | embalar-embalagens | embalar-embalagens | 52 | 52 | 0 | não | UNCHANGED | 0 | 4.3 |
| r_beauty | renata-beauty | renata-beauty | 52 | 52 | 0 | não | UNCHANGED | 14.3 | 7.5 |
| renata-beauty | r_beauty | r_beauty | 52 | 52 | 0 | não | UNCHANGED | 14.3 | 7.5 |
| rm-fretes | marido-de-aluguel | marido-de-aluguel | 35 | 35 | 0 | não | UNCHANGED | 0 | 1.7 |
| salao-da-marcia | liz-moraes-nail-designer | liz-moraes-nail-designer | 47 | 47 | 0 | não | UNCHANGED | 7.1 | 1.9 |
| santos-montador-de-moveis | kitutes-na-mesa | kitutes-na-mesa | 39 | 39 | 0 | não | UNCHANGED | 11.1 | 7.5 |
| sos-presentes-cosmeticos | confeitaria-sabor-da-realeza | confeitaria-sabor-da-realeza | 50 | 50 | 0 | não | UNCHANGED | 7.7 | 5 |
| thays-camilla | cris-presentes-colonia-rio-grande | cris-presentes-colonia-rio-grande | 46 | 46 | 0 | não | UNCHANGED | 0 | 6 |
| your-brutus-burguer | bh-barreiro-marmitas | liz-moraes-nail-designer | 41 | 41 | 0 | SIM | UNCHANGED | 14.3 | 4.3 |
| bruna-diarista | diego-montador-moveis | diego-montador-moveis | 51 | 52 | 1 | não | METRIC_SENSITIVITY | 0 | 2.5 |
| diego-montador-moveis | bruna-diarista | bruna-diarista | 51 | 52 | 1 | não | METRIC_SENSITIVITY | 0 | 2.5 |
| paulo-mestre-de-obras | liz-moraes-nail-designer | liz-moraes-nail-designer | 45 | 46 | 1 | não | METRIC_SENSITIVITY | 0 | 1.7 |
