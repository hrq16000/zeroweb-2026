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
| ACCEPTABLE | 24 |
| ATTENTION | 44 |
| HIGH_SIMILARITY | 0 |
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
| acai-total-araucaria | aguia-sul-sinalizacao | 59 | SAME_FAMILY | 73.5 | 57.1 | 71.4 | 91.3 | 0 | 20 | 11.1 |
| aguia-sul-sinalizacao | diego-montador-moveis | 59 | SAME_FAMILY | 74 | 50 | 85.7 | 85.9 | 1.1 | 0 | 23.1 |
| mp-festas-eventos | studio-de-cilios | 59 | SAME_FAMILY | 76.2 | 66.7 | 61.5 | 85 | 0.8 | 0 | 9.8 |
| aguia-sul-sinalizacao | mary-diarista | 58 | SAME_FAMILY | 78.7 | 50 | 71.4 | 92.5 | 0 | 0 | 9.4 |
| confeitaria-chyrley | studio-de-cilios | 56 | SAME_FAMILY | 53.8 | 100 | 42.9 | 86.5 | 0.5 | 0 | 6.8 |
| diego-montador-moveis | paulo-mestre-de-obras | 56 | SAME_FAMILY | 62.7 | 75 | 60 | 70.9 | 3 | 25 | 15.6 |
| acai-total-araucaria | mary-diarista | 55 | SAME_FAMILY | 76.1 | 37.5 | 71.4 | 92.5 | 0 | 0 | 10.7 |
| confeitaria-sabor-da-realeza | miro-tech | 55 | SAME_FAMILY | 54.9 | 66.7 | 55.6 | 79.2 | 0.5 | 100 | 14.3 |
| confeitaria-sabor-da-realeza | sos-presentes-cosmeticos | 55 | SAME_FAMILY | 46 | 100 | 60 | 72 | 0.7 | 0 | 11.4 |
| acai-total-araucaria | ecommerce-on | 54 | SAME_FAMILY | 73.5 | 42.9 | 75 | 77.5 | 0 | 10 | 11.8 |
| aguia-sul-sinalizacao | paulo-mestre-de-obras | 54 | SAME_FAMILY | 79.6 | 40 | 66.7 | 72.9 | 0.5 | 12.5 | 14.7 |
| denise-gomes-psicologa | liz-moraes-nail-designer | 54 | SAME_FAMILY | 53.1 | 66.7 | 58.3 | 68.1 | 2 | 100 | 14.7 |
| liz-moraes-nail-designer | miro-tech | 54 | SAME_FAMILY | 42.6 | 100 | 36.4 | 64.8 | 2.3 | 100 | 11.1 |
| liz-moraes-nail-designer | mp-festas-eventos | 54 | SAME_FAMILY | 56.7 | 66.7 | 72.7 | 72.4 | 0.4 | 0 | 13.6 |
| mp-festas-eventos | vila-da-capivara | 54 | SAME_FAMILY | 67.6 | 50 | 61.5 | 88.6 | 0.8 | 25 | 10.9 |
| toquinho-de-gente-brecho | woodhouse-hamburgueres | 54 | SAME_FAMILY | 13.8 | 100 | 100 | 27.3 | 0 | 100 | 100 |
| acai-total-araucaria | diego-montador-moveis | 53 | SAME_FAMILY | 75 | 37.5 | 62.5 | 85.9 | 0 | 16.7 | 12 |
| aguia-sul-sinalizacao | ecommerce-on | 53 | SAME_FAMILY | 95.6 | 22.2 | 55.6 | 79.7 | 0 | 12.5 | 7.7 |
| denise-gomes-psicologa | mp-festas-eventos | 53 | SAME_FAMILY | 39.7 | 100 | 57.1 | 68.4 | 0 | 0 | 14.6 |
| diego-montador-moveis | liz-moraes-nail-designer | 53 | SAME_FAMILY | 50 | 100 | 36.4 | 75 | 1.1 | 0 | 5.9 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| acai-total-araucaria | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 59 | ATTENTION | acai-total-araucaria (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| diego-montador-moveis | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 59 | ATTENTION | studio-de-cilios (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 59 | ATTENTION | mp-festas-eventos (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 58 | ATTENTION | aguia-sul-sinalizacao (58) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 56 | ATTENTION | studio-de-cilios (56) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 56 | ATTENTION | diego-montador-moveis (56) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-sabor-da-realeza | 55 | ATTENTION | miro-tech (55) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| miro-tech | 55 | ATTENTION | confeitaria-sabor-da-realeza (55) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 55 | ATTENTION | confeitaria-sabor-da-realeza (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 54 | ATTENTION | liz-moraes-nail-designer (54) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 54 | ATTENTION | acai-total-araucaria (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| liz-moraes-nail-designer | 54 | ATTENTION | denise-gomes-psicologa (54) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 54 | ATTENTION | woodhouse-hamburgueres (54) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 54 | ATTENTION | mp-festas-eventos (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 54 | ATTENTION | toquinho-de-gente-brecho (54) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| refrigeracao-maresia | 53 | ATTENTION | liz-moraes-nail-designer (53) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 51 | ATTENTION | liz-moraes-nail-designer (51) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 50 | ATTENTION | eletrovale-eletromecanica (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletrovale-eletromecanica | 50 | ATTENTION | eletro-solucoes-eficazes (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 49 | ATTENTION | lk-alvenaria (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| fernanda-amaral-drywall | 49 | ATTENTION | rj-servicos-drywall (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| lk-alvenaria | 49 | ATTENTION | ag-electrical-services (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| rj-servicos-drywall | 49 | ATTENTION | fernanda-amaral-drywall (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-marcenaria | 48 | ATTENTION | eletrovale-eletromecanica (48) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| lucas-arruma-maquina-lavar | 47 | ATTENTION | no-brilho-higienizacao (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 47 | ATTENTION | lucas-arruma-maquina-lavar (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 45 | ATTENTION | jkl-marcenaria (45) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 44 | ATTENTION | thays-camilla (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 44 | ATTENTION | eletro-solucoes-eficazes (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 44 | ATTENTION | miro-tech (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 44 | ATTENTION | toquinho-de-gente-brecho (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 44 | ATTENTION | artesanatos-darleia-oliveira (44) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| clinica-integrada | 43 | ATTENTION | confeitaria-sabor-da-realeza (43) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 43 | ATTENTION | galileu-locacao-brinquedos (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| espaco-cih-luh | 42 | ATTENTION | salao-da-marcia (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 42 | ATTENTION | diego-montador-moveis (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 41 | ATTENTION | mirassol-delicias-caseiras (41) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| angel-mix-brecho | 40 | ACCEPTABLE | reuse-house-brecho (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 40 | ACCEPTABLE | guaratuba-oficina-nautica (40) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 40 | ACCEPTABLE | casa-nativa (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| heloa-gas | 40 | ACCEPTABLE | miro-tech (40) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 40 | ACCEPTABLE | angel-mix-brecho (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 39 | ACCEPTABLE | reuse-house-brecho (39) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 39 | ACCEPTABLE | paulo-mestre-de-obras (39) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| bh-barreiro-marmitas | 38 | ACCEPTABLE | miro-tech (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| raphael-construcoes | 38 | ACCEPTABLE | ton-e-cor (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ton-e-cor | 38 | ACCEPTABLE | raphael-construcoes (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 38 | ACCEPTABLE | guaratuba-oficina-nautica (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 37 | ACCEPTABLE | confeitaria-sabor-da-realeza (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 36 | ACCEPTABLE | ton-e-cor (36) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 36 | ACCEPTABLE | marido-de-aluguel (36) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| hbk-iluminacao-led | 35 | ACCEPTABLE | jc-revestimentos (35) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| brecho-sao-francisco | 32 | ACCEPTABLE | woodhouse-hamburgueres (32) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| almeida-torres | 31 | ACCEPTABLE | guaratuba-atelie-presentes (31) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 31 | ACCEPTABLE | uberlandia-eletrica-residencial (31) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-sabores-da-baia | 31 | ACCEPTABLE | heloa-gas (31) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 29 | ACCEPTABLE | assistencia-microondas-santos (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 29 | ACCEPTABLE | jc-revestimentos (29) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 25 | ACCEPTABLE | marido-de-aluguel (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| paraiso-do-hot-dog | 25 | ACCEPTABLE | refrigeracao-maresia (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 22 | ACCEPTABLE | reuse-house-brecho (22) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |

## Regressão

Veredito: **PASS**

Nenhuma regressão em relação à baseline.

Melhorias:
- {"kind":"COUNTER","key":"highSimilarity","label":"projetos HIGH_SIMILARITY","before":14,"after":0}
- {"kind":"COUNTER","key":"missingCovers","label":"capas ausentes","before":27,"after":26}
- {"kind":"MODIFIED_PROJECT","slug":"ag-electrical-services","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"angel-mix-brecho","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"artesanatos-darleia-oliveira","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"brecho-sao-francisco","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"diego-montador-moveis","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"dlara-pizzaria","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"espaco-cih-luh","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"galileu-locacao-brinquedos","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"heloa-gas","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"lj-cleaning","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"lk-alvenaria","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"lolipa-arte-em-festas","before":"HIGH_SIMILARITY","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"lucas-arruma-maquina-lavar","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"miro-tech","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"no-brilho-higienizacao","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"premium-envelopamentos","before":"HIGH_SIMILARITY","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"reuse-house-brecho","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"salao-da-marcia","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"thays-camilla","before":"HIGH_SIMILARITY","after":"ATTENTION"}
