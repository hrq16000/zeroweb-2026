# Originalidade do portfólio

Gerado por `bun run check:portfolio-originality --report`. Determinístico: mesmos
arquivos produzem o mesmo resultado. Modo atual: **REPORT_ONLY**.

## Fórmula

`score = 0.28·structure + 0.22·sectionOrder + 0.18·component + 0.13·style + 0.12·copy + 0.04·assetPattern + 0.03·identity`

Cada dimensão é um índice de Jaccard sobre conjuntos derivados do componente
renderizado (n-gramas de estrutura, ordem de seções, componentes próprios,
classes de layout sem cor, padrão de assets, cor/ícone). Infraestrutura
compartilhada é excluída do fingerprint — reutilizá-la não penaliza.

Limiares: 0–20 ORIGINAL · 21–40 ACCEPTABLE · 41–60 ATTENTION · 61–80 HIGH_SIMILARITY · 81–100 CLONE.

## Summary

| Métrica | Valor |
|---|---|
| Total | 68 |
| ORIGINAL | 0 |
| ACCEPTABLE | 18 |
| ATTENTION | 44 |
| HIGH_SIMILARITY | 6 |
| CLONE | 0 |
| SHARED_FALLBACK | 0 |
| Clusters | 0 |
| Logos placeholder | 0 |
| Logos ausentes | 0 |
| Capas ausentes | 26 |
| Capas usando imagem social | 10 |
| Capas compartilhadas | 0 |
| Crop severo | 20 |
| Assets de marca cruzados (inválidos) | 0 |
| Assets compartilhados suspeitos | 0 |

## Clusters

Nenhum cluster acima do limiar.

## Matriz de pares — top 20

| A | B | Score | Motivo | STRUCTURE | SECTION_ORDER | COMPONENT | STYLE | COPY | ASSET | IDENTITY |
|---|---|---|---|---|---|---|---|---|---|---|
| ag-electrical-services | lk-alvenaria | 64 | NEAR_DUPLICATE_LAYOUT | 74.1 | 100 | 57.1 | 83.1 | 1 | 0 | 11.4 |
| artesanatos-darleia-oliveira | thays-camilla | 63 | NEAR_DUPLICATE_LAYOUT | 80.4 | 66.7 | 50 | 97.4 | 2.8 | 100 | 8.9 |
| lolipa-arte-em-festas | premium-envelopamentos | 63 | NEAR_DUPLICATE_LAYOUT | 62.7 | 100 | 62.5 | 79.7 | 0 | 27.3 | 10.3 |
| brecho-sao-francisco | toquinho-de-gente-brecho | 60 | SAME_FAMILY | 25.8 | 100 | 100 | 40.7 | 2.2 | 100 | 100 |
| miro-tech | premium-envelopamentos | 60 | SAME_FAMILY | 62.7 | 62.5 | 85.7 | 78.8 | 0.6 | 60 | 18.2 |
| acai-total-araucaria | aguia-sul-sinalizacao | 59 | SAME_FAMILY | 73.5 | 57.1 | 71.4 | 91.3 | 0 | 20 | 11.1 |
| aguia-sul-sinalizacao | diego-montador-moveis | 59 | SAME_FAMILY | 74 | 50 | 85.7 | 85.9 | 1.1 | 0 | 23.1 |
| confeitaria-sabor-da-realeza | lolipa-arte-em-festas | 59 | SAME_FAMILY | 61.2 | 57.1 | 100 | 77.9 | 2 | 20 | 20 |
| mp-festas-eventos | studio-de-cilios | 59 | SAME_FAMILY | 76.2 | 66.7 | 61.5 | 85 | 0.8 | 0 | 9.8 |
| aguia-sul-sinalizacao | mary-diarista | 58 | SAME_FAMILY | 78.7 | 50 | 71.4 | 92.5 | 0 | 0 | 9.4 |
| assistencia-microondas-santos | premium-envelopamentos | 58 | SAME_FAMILY | 52.4 | 100 | 54.5 | 67.8 | 1.1 | 57.1 | 12.9 |
| brecho-sao-francisco | marmitaria-dom-diego | 58 | SAME_FAMILY | 21.2 | 100 | 100 | 35.5 | 0 | 100 | 100 |
| artesanatos-darleia-oliveira | assistencia-microondas-santos | 57 | SAME_FAMILY | 60.7 | 62.5 | 61.5 | 85.4 | 0 | 83.3 | 13.2 |
| brecho-sao-francisco | woodhouse-hamburgueres | 56 | SAME_FAMILY | 20 | 100 | 100 | 28.6 | 0 | 100 | 100 |
| confeitaria-chyrley | studio-de-cilios | 56 | SAME_FAMILY | 53.8 | 100 | 42.9 | 86.5 | 0.5 | 0 | 6.8 |
| diego-montador-moveis | lk-alvenaria | 56 | SAME_FAMILY | 60.7 | 100 | 38.5 | 71.1 | 2.1 | 0 | 7.7 |
| diego-montador-moveis | paulo-mestre-de-obras | 56 | SAME_FAMILY | 62.7 | 75 | 60 | 70.9 | 3 | 25 | 15.6 |
| acai-total-araucaria | mary-diarista | 55 | SAME_FAMILY | 76.1 | 37.5 | 71.4 | 92.5 | 0 | 0 | 10.7 |
| ag-electrical-services | refrigeracao-maresia | 55 | SAME_FAMILY | 66.7 | 83.3 | 42.9 | 75 | 3.2 | 10 | 7.3 |
| confeitaria-sabor-da-realeza | miro-tech | 55 | SAME_FAMILY | 54.9 | 66.7 | 55.6 | 79.2 | 0.5 | 100 | 14.3 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| ag-electrical-services | 64 | HIGH_SIMILARITY | lk-alvenaria (64) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| lk-alvenaria | 64 | HIGH_SIMILARITY | ag-electrical-services (64) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 63 | HIGH_SIMILARITY | thays-camilla (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 63 | HIGH_SIMILARITY | premium-envelopamentos (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 63 | HIGH_SIMILARITY | lolipa-arte-em-festas (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 63 | HIGH_SIMILARITY | artesanatos-darleia-oliveira (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| brecho-sao-francisco | 60 | ATTENTION | toquinho-de-gente-brecho (60) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| miro-tech | 60 | ATTENTION | premium-envelopamentos (60) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 60 | ATTENTION | brecho-sao-francisco (60) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 59 | ATTENTION | acai-total-araucaria (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| confeitaria-sabor-da-realeza | 59 | ATTENTION | lolipa-arte-em-festas (59) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| diego-montador-moveis | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 59 | ATTENTION | studio-de-cilios (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 59 | ATTENTION | mp-festas-eventos (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 58 | ATTENTION | premium-envelopamentos (58) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 58 | ATTENTION | brecho-sao-francisco (58) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 58 | ATTENTION | aguia-sul-sinalizacao (58) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 56 | ATTENTION | studio-de-cilios (56) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 56 | ATTENTION | diego-montador-moveis (56) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 56 | ATTENTION | brecho-sao-francisco (56) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 55 | ATTENTION | thays-camilla (55) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| refrigeracao-maresia | 55 | ATTENTION | ag-electrical-services (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 55 | ATTENTION | confeitaria-sabor-da-realeza (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 54 | ATTENTION | acai-total-araucaria (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| liz-moraes-nail-designer | 54 | ATTENTION | artesanatos-darleia-oliveira (54) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 54 | ATTENTION | mp-festas-eventos (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 50 | ATTENTION | eletrovale-eletromecanica (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletrovale-eletromecanica | 50 | ATTENTION | eletro-solucoes-eficazes (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 49 | ATTENTION | rj-servicos-drywall (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| rj-servicos-drywall | 49 | ATTENTION | fernanda-amaral-drywall (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-marcenaria | 48 | ATTENTION | eletrovale-eletromecanica (48) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 48 | ATTENTION | toquinho-de-gente-brecho (48) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lucas-arruma-maquina-lavar | 47 | ATTENTION | no-brilho-higienizacao (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 47 | ATTENTION | lucas-arruma-maquina-lavar (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 45 | ATTENTION | jkl-marcenaria (45) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 44 | ATTENTION | marmitaria-dom-diego (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 44 | ATTENTION | eletro-solucoes-eficazes (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 44 | ATTENTION | miro-tech (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| clinica-integrada | 43 | ATTENTION | confeitaria-sabor-da-realeza (43) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 43 | ATTENTION | galileu-locacao-brinquedos (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| espaco-cih-luh | 42 | ATTENTION | salao-da-marcia (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 42 | ATTENTION | diego-montador-moveis (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| angel-mix-brecho | 41 | ATTENTION | brecho-sao-francisco (41) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 41 | ATTENTION | mirassol-delicias-caseiras (41) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 40 | ACCEPTABLE | guaratuba-oficina-nautica (40) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 40 | ACCEPTABLE | casa-nativa (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| heloa-gas | 40 | ACCEPTABLE | miro-tech (40) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 39 | ACCEPTABLE | lk-alvenaria (39) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| bh-barreiro-marmitas | 38 | ACCEPTABLE | miro-tech (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| raphael-construcoes | 38 | ACCEPTABLE | ton-e-cor (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ton-e-cor | 38 | ACCEPTABLE | raphael-construcoes (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 38 | ACCEPTABLE | guaratuba-oficina-nautica (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 36 | ACCEPTABLE | ton-e-cor (36) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 36 | ACCEPTABLE | marido-de-aluguel (36) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| hbk-iluminacao-led | 35 | ACCEPTABLE | jc-revestimentos (35) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| almeida-torres | 31 | ACCEPTABLE | guaratuba-atelie-presentes (31) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 31 | ACCEPTABLE | uberlandia-eletrica-residencial (31) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-sabores-da-baia | 31 | ACCEPTABLE | heloa-gas (31) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 29 | ACCEPTABLE | assistencia-microondas-santos (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 25 | ACCEPTABLE | marido-de-aluguel (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| paraiso-do-hot-dog | 25 | ACCEPTABLE | refrigeracao-maresia (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 24 | ACCEPTABLE | brecho-sao-francisco (24) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |

## Regressão

Veredito: **PASS**

Nenhuma regressão em relação à baseline.

Melhorias:
- {"kind":"COUNTER","key":"highSimilarity","label":"projetos HIGH_SIMILARITY","before":14,"after":6}
- {"kind":"COUNTER","key":"missingCovers","label":"capas ausentes","before":27,"after":26}
- {"kind":"MODIFIED_PROJECT","slug":"diego-montador-moveis","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"espaco-cih-luh","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"galileu-locacao-brinquedos","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"heloa-gas","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"lj-cleaning","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"lucas-arruma-maquina-lavar","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"miro-tech","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"no-brilho-higienizacao","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"salao-da-marcia","before":"HIGH_SIMILARITY","after":"ATTENTION"}
