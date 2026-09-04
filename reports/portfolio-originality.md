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
| ACCEPTABLE | 17 |
| ATTENTION | 30 |
| HIGH_SIMILARITY | 21 |
| CLONE | 0 |
| SHARED_FALLBACK | 0 |
| Clusters | 0 |
| Logos placeholder | 0 |
| Logos ausentes | 0 |
| Capas ausentes | 27 |
| Capas usando imagem social | 11 |
| Capas compartilhadas | 0 |
| Crop severo | 22 |
| Assets de marca cruzados (inválidos) | 0 |
| Assets compartilhados suspeitos | 0 |

## Clusters

Nenhum cluster acima do limiar.

## Matriz de pares — top 20

| A | B | Score | Motivo | STRUCTURE | SECTION_ORDER | COMPONENT | STYLE | COPY | ASSET | IDENTITY |
|---|---|---|---|---|---|---|---|---|---|---|
| eisenfer-tubos-acos | eletro-solucoes-eficazes | 78 | IDENTICAL_COMPONENT_STRUCTURE | 100 | 100 | 83.3 | 95.6 | 1.5 | 0 | 11.5 |
| eisenfer-tubos-acos | eletrovale-eletromecanica | 78 | VISUAL_COMPOSITION_CLONE | 90.5 | 100 | 100 | 95.6 | 0.7 | 0 | 11.5 |
| espaco-cih-luh | salao-da-marcia | 76 | VISUAL_COMPOSITION_CLONE | 100 | 100 | 70 | 97.3 | 0 | 0 | 12.5 |
| eisenfer-tubos-acos | jkl-marcenaria | 75 | VISUAL_COMPOSITION_CLONE | 90.5 | 100 | 83.3 | 95.5 | 1.2 | 0 | 11.5 |
| eletro-solucoes-eficazes | eletrovale-eletromecanica | 75 | VISUAL_COMPOSITION_CLONE | 90.5 | 100 | 83.3 | 91.5 | 2.4 | 0 | 12 |
| eletrovale-eletromecanica | jkl-marcenaria | 74 | VISUAL_COMPOSITION_CLONE | 86.4 | 100 | 83.3 | 91.3 | 1.9 | 20 | 12 |
| aguia-sul-sinalizacao | eletrovale-eletromecanica | 73 | VISUAL_COMPOSITION_CLONE | 84.8 | 100 | 83.3 | 94.2 | 1.3 | 0 | 10.7 |
| eletro-solucoes-eficazes | jkl-marcenaria | 73 | VISUAL_COMPOSITION_CLONE | 90.5 | 100 | 71.4 | 94.1 | 3.9 | 0 | 12 |
| aguia-sul-sinalizacao | eisenfer-tubos-acos | 72 | VISUAL_COMPOSITION_CLONE | 80.4 | 100 | 83.3 | 92.6 | 1.3 | 0 | 18.5 |
| aguia-sul-sinalizacao | eletro-solucoes-eficazes | 70 | VISUAL_COMPOSITION_CLONE | 80.4 | 100 | 71.4 | 91.4 | 2.7 | 0 | 10.7 |
| aguia-sul-sinalizacao | jkl-marcenaria | 70 | NEAR_DUPLICATE_LAYOUT | 77.1 | 100 | 71.4 | 97 | 1.7 | 0 | 10.7 |
| espaco-cih-luh | lucas-arruma-maquina-lavar | 70 | VISUAL_COMPOSITION_CLONE | 100 | 100 | 41.7 | 96.1 | 0 | 0 | 7.5 |
| lucas-arruma-maquina-lavar | salao-da-marcia | 69 | VISUAL_COMPOSITION_CLONE | 100 | 100 | 38.5 | 93.4 | 0.7 | 0 | 7.3 |
| eletro-solucoes-eficazes | mary-diarista | 66 | NEAR_DUPLICATE_LAYOUT | 92.7 | 50 | 71.4 | 92.6 | 2.3 | 100 | 10.3 |
| galileu-locacao-brinquedos | lj-cleaning | 66 | NEAR_DUPLICATE_LAYOUT | 94.7 | 57.1 | 55.6 | 96.8 | 1.9 | 100 | 10.7 |
| lk-alvenaria | lucas-arruma-maquina-lavar | 66 | NEAR_DUPLICATE_LAYOUT | 78.4 | 100 | 53.8 | 89.9 | 2 | 0 | 11.6 |
| lucas-arruma-maquina-lavar | no-brilho-higienizacao | 65 | IDENTICAL_COMPONENT_STRUCTURE | 100 | 50 | 50 | 94.7 | 1.5 | 100 | 11.1 |
| ag-electrical-services | lk-alvenaria | 64 | NEAR_DUPLICATE_LAYOUT | 74.1 | 100 | 57.1 | 83.1 | 1 | 0 | 11.4 |
| eisenfer-tubos-acos | mary-diarista | 64 | NEAR_DUPLICATE_LAYOUT | 92.7 | 50 | 83.3 | 93.9 | 0 | 0 | 10 |
| jkl-marcenaria | mary-diarista | 64 | NEAR_DUPLICATE_LAYOUT | 97.6 | 50 | 71.4 | 95.4 | 1.3 | 0 | 10.3 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| eisenfer-tubos-acos | 78 | HIGH_SIMILARITY | eletro-solucoes-eficazes (78) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 78 | HIGH_SIMILARITY | eisenfer-tubos-acos (78) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletrovale-eletromecanica | 78 | HIGH_SIMILARITY | eisenfer-tubos-acos (78) | VISUAL_COMPOSITION_CLONE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| espaco-cih-luh | 76 | HIGH_SIMILARITY | salao-da-marcia (76) | VISUAL_COMPOSITION_CLONE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 76 | HIGH_SIMILARITY | espaco-cih-luh (76) | VISUAL_COMPOSITION_CLONE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-marcenaria | 75 | HIGH_SIMILARITY | eisenfer-tubos-acos (75) | VISUAL_COMPOSITION_CLONE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 73 | HIGH_SIMILARITY | eletrovale-eletromecanica (73) | VISUAL_COMPOSITION_CLONE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| lucas-arruma-maquina-lavar | 70 | HIGH_SIMILARITY | espaco-cih-luh (70) | VISUAL_COMPOSITION_CLONE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 66 | HIGH_SIMILARITY | lj-cleaning (66) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 66 | HIGH_SIMILARITY | galileu-locacao-brinquedos (66) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 66 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (66) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 66 | HIGH_SIMILARITY | eletro-solucoes-eficazes (66) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 65 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (65) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 64 | HIGH_SIMILARITY | lk-alvenaria (64) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| artesanatos-darleia-oliveira | 63 | HIGH_SIMILARITY | thays-camilla (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| diego-montador-moveis | 63 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (63) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 63 | HIGH_SIMILARITY | premium-envelopamentos (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 63 | HIGH_SIMILARITY | lolipa-arte-em-festas (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 63 | HIGH_SIMILARITY | artesanatos-darleia-oliveira (63) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 62 | HIGH_SIMILARITY | eletrovale-eletromecanica (62) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| miro-tech | 61 | HIGH_SIMILARITY | lj-cleaning (61) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| brecho-sao-francisco | 60 | ATTENTION | toquinho-de-gente-brecho (60) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| liz-moraes-nail-designer | 60 | ATTENTION | salao-da-marcia (60) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 60 | ATTENTION | brecho-sao-francisco (60) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-sabor-da-realeza | 59 | ATTENTION | lolipa-arte-em-festas (59) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 59 | ATTENTION | studio-de-cilios (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 59 | ATTENTION | mp-festas-eventos (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 58 | ATTENTION | premium-envelopamentos (58) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 58 | ATTENTION | brecho-sao-francisco (58) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 58 | ATTENTION | lucas-arruma-maquina-lavar (58) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 56 | ATTENTION | studio-de-cilios (56) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 56 | ATTENTION | espaco-cih-luh (56) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| woodhouse-hamburgueres | 56 | ATTENTION | brecho-sao-francisco (56) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 55 | ATTENTION | thays-camilla (55) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| refrigeracao-maresia | 55 | ATTENTION | ag-electrical-services (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 55 | ATTENTION | confeitaria-sabor-da-realeza (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 54 | ATTENTION | mp-festas-eventos (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 49 | ATTENTION | rj-servicos-drywall (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| rj-servicos-drywall | 49 | ATTENTION | fernanda-amaral-drywall (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 49 | ATTENTION | no-brilho-higienizacao (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 48 | ATTENTION | toquinho-de-gente-brecho (48) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 44 | ATTENTION | marmitaria-dom-diego (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 44 | ATTENTION | miro-tech (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| clinica-integrada | 43 | ATTENTION | confeitaria-sabor-da-realeza (43) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| angel-mix-brecho | 41 | ATTENTION | brecho-sao-francisco (41) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| heloa-gas | 41 | ATTENTION | lj-cleaning (41) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 41 | ATTENTION | mirassol-delicias-caseiras (41) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 40 | ACCEPTABLE | guaratuba-oficina-nautica (40) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 40 | ACCEPTABLE | casa-nativa (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
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
| paraiso-do-hot-dog | 25 | ACCEPTABLE | lucas-arruma-maquina-lavar (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 24 | ACCEPTABLE | brecho-sao-francisco (24) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |

## Regressão

Veredito: **PASS**

Nenhuma regressão em relação à baseline.

Melhorias:
- {"kind":"COUNTER","key":"clone","label":"clones","before":4,"after":0}
- {"kind":"MODIFIED_PROJECT","slug":"beto-pasteis","before":"CLONE","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"dlara-pizzaria","before":"CLONE","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"marmitaria-dom-diego","before":"CLONE","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"woodhouse-hamburgueres","before":"CLONE","after":"ATTENTION"}
