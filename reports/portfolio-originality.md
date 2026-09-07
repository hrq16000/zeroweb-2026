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
| Total | 85 |
| ORIGINAL | 0 |
| ACCEPTABLE | 27 |
| ATTENTION | 52 |
| HIGH_SIMILARITY | 6 |
| CLONE | 0 |
| SHARED_FALLBACK | 0 |
| Clusters | 0 |
| Logos placeholder | 24 |
| Logos ausentes | 0 |
| Capas sem arquivo no catálogo (legado) | 24 |
| Capas válidas (contrato canônico) | 45 |
| Capas pendentes (contrato canônico) | 40 |
| Capas usando imagem social | 9 |
| Capas compartilhadas | 0 |
| Crop severo | 21 |
| Assets de marca cruzados (inválidos) | 0 |
| Assets compartilhados suspeitos | 0 |

## Clusters

Nenhum cluster acima do limiar.

## Matriz de pares — top 20

| A | B | Score | Motivo | STRUCTURE | SECTION_ORDER | COMPONENT | STYLE | COPY | ASSET | IDENTITY |
|---|---|---|---|---|---|---|---|---|---|---|
| btb-construcao | easy-clean | 69 | VISUAL_COMPOSITION_CLONE | 85.1 | 100 | 69.2 | 74.7 | 1.8 | 15 | 9.7 |
| bruna-diarista | popys-conservacao-limpeza | 66 | NEAR_DUPLICATE_LAYOUT | 65.5 | 100 | 76.9 | 80.3 | 0 | 15 | 11.1 |
| bruna-diarista | easy-clean | 65 | NEAR_DUPLICATE_LAYOUT | 74 | 100 | 69.2 | 68.2 | 2.6 | 15 | 8.6 |
| easy-clean | popys-conservacao-limpeza | 62 | NEAR_DUPLICATE_LAYOUT | 63.6 | 100 | 64.3 | 70.7 | 2.2 | 15 | 8.1 |
| bruna-diarista | btb-construcao | 61 | NEAR_DUPLICATE_LAYOUT | 66 | 100 | 57.1 | 69 | 0 | 15 | 6.3 |
| embalar-embalagens | maximos-cabeleireiros | 61 | NEAR_DUPLICATE_LAYOUT | 89.1 | 57.1 | 58.3 | 88.6 | 5.9 | 7.5 | 4.5 |
| js-eletrica-manutencao | maximos-cabeleireiros | 60 | SAME_FAMILY | 73.1 | 85.7 | 54.5 | 77.1 | 0.9 | 9 | 1.9 |
| aguia-sul-sinalizacao | diego-montador-moveis | 59 | SAME_FAMILY | 74 | 50 | 85.7 | 85.9 | 1.1 | 7.5 | 23.1 |
| aguia-sul-sinalizacao | easy-clean | 59 | SAME_FAMILY | 61.1 | 100 | 54.5 | 71.6 | 1.1 | 2.5 | 12.5 |
| mp-festas-eventos | studio-de-cilios | 59 | SAME_FAMILY | 76.2 | 66.7 | 61.5 | 85 | 0.8 | 4.3 | 9.6 |
| acai-total-araucaria | aguia-sul-sinalizacao | 58 | SAME_FAMILY | 73.5 | 57.1 | 71.4 | 91.3 | 0 | 7.5 | 10.7 |
| aguia-sul-sinalizacao | mary-diarista | 58 | SAME_FAMILY | 78.7 | 50 | 71.4 | 92.5 | 0 | 2.5 | 9.1 |
| aguia-sul-sinalizacao | bruna-diarista | 57 | SAME_FAMILY | 60 | 100 | 41.7 | 78.9 | 0 | 2.5 | 9.1 |
| btb-construcao | enoel-portas | 56 | SAME_FAMILY | 58.6 | 100 | 50 | 56.7 | 4.1 | 11.2 | 12 |
| btb-construcao | popys-conservacao-limpeza | 56 | SAME_FAMILY | 56.9 | 100 | 53.3 | 61.6 | 1.1 | 15 | 5.9 |
| confeitaria-chyrley | studio-de-cilios | 56 | SAME_FAMILY | 54 | 100 | 37.5 | 86.5 | 0.5 | 8.6 | 6.7 |
| mimo-salgados-doces | popys-conservacao-limpeza | 56 | SAME_FAMILY | 66.7 | 50 | 76.9 | 88.4 | 0 | 5 | 13.3 |
| acai-total-araucaria | mary-diarista | 55 | SAME_FAMILY | 76.1 | 37.5 | 71.4 | 92.5 | 0 | 6 | 10 |
| aguia-sul-sinalizacao | btb-construcao | 55 | SAME_FAMILY | 60 | 100 | 41.7 | 64.3 | 0.6 | 2.5 | 10.3 |
| diego-montador-moveis | paulo-mestre-de-obras | 55 | SAME_FAMILY | 62.7 | 75 | 60 | 70.9 | 3 | 4.3 | 15.2 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| btb-construcao | 69 | HIGH_SIMILARITY | easy-clean (69) | VISUAL_COMPOSITION_CLONE | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| easy-clean | 69 | HIGH_SIMILARITY | btb-construcao (69) | VISUAL_COMPOSITION_CLONE | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| bruna-diarista | 66 | HIGH_SIMILARITY | popys-conservacao-limpeza (66) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| popys-conservacao-limpeza | 66 | HIGH_SIMILARITY | bruna-diarista (66) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| embalar-embalagens | 61 | HIGH_SIMILARITY | maximos-cabeleireiros (61) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| maximos-cabeleireiros | 61 | HIGH_SIMILARITY | embalar-embalagens (61) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| js-eletrica-manutencao | 60 | ATTENTION | maximos-cabeleireiros (60) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 59 | ATTENTION | diego-montador-moveis (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| diego-montador-moveis | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 59 | ATTENTION | studio-de-cilios (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 59 | ATTENTION | mp-festas-eventos (59) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| acai-total-araucaria | 58 | ATTENTION | aguia-sul-sinalizacao (58) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 58 | ATTENTION | aguia-sul-sinalizacao (58) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| confeitaria-chyrley | 56 | ATTENTION | studio-de-cilios (56) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| enoel-portas | 56 | ATTENTION | btb-construcao (56) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mimo-salgados-doces | 56 | ATTENTION | popys-conservacao-limpeza (56) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 55 | ATTENTION | diego-montador-moveis (55) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 54 | ATTENTION | acai-total-araucaria (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| liz-moraes-nail-designer | 54 | ATTENTION | mp-festas-eventos (54) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mania-de-limpeza | 54 | ATTENTION | js-eletrica-manutencao (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 53 | ATTENTION | mp-festas-eventos (53) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_PLACEHOLDER | — |
| kitutes-na-mesa | 53 | ATTENTION | liz-moraes-nail-designer (53) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 53 | ATTENTION | mp-festas-eventos (53) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| ag-electrical-services | 51 | ATTENTION | lk-alvenaria (51) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| confeitaria-sabor-da-realeza | 51 | ATTENTION | sos-presentes-cosmeticos (51) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 51 | ATTENTION | ag-electrical-services (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 51 | ATTENTION | confeitaria-sabor-da-realeza (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 50 | ATTENTION | eletrovale-eletromecanica (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| eletrovale-eletromecanica | 50 | ATTENTION | eletro-solucoes-eficazes (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| miro-tech | 50 | ATTENTION | kitutes-na-mesa (50) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| refrigeracao-maresia | 50 | ATTENTION | liz-moraes-nail-designer (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 49 | ATTENTION | liz-moraes-nail-designer (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 49 | ATTENTION | rj-servicos-drywall (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| papelemi-personalizados | 49 | ATTENTION | embalar-embalagens (49) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rj-servicos-drywall | 49 | ATTENTION | fernanda-amaral-drywall (49) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| simone-lacerda-vaz | 48 | ATTENTION | embalar-embalagens (48) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| salao-da-marcia | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| jkl-marcenaria | 46 | ATTENTION | eletro-solucoes-eficazes (46) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| toquinho-de-gente-brecho | 46 | ATTENTION | woodhouse-hamburgueres (46) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 46 | ATTENTION | toquinho-de-gente-brecho (46) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| centro-mega | 45 | ATTENTION | mania-de-limpeza (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 45 | ATTENTION | lj-cleaning (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 45 | ATTENTION | galileu-locacao-brinquedos (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| dona-lucy-salgados | 44 | ATTENTION | mania-de-limpeza (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lucas-arruma-maquina-lavar | 44 | ATTENTION | denise-gomes-psicologa (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 44 | ATTENTION | sos-presentes-cosmeticos (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| clinica-integrada | 43 | ATTENTION | lk-alvenaria (43) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| angel-mix-brecho | 42 | ATTENTION | dlara-pizzaria (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 42 | ATTENTION | lk-alvenaria (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 42 | ATTENTION | angel-mix-brecho (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 42 | ATTENTION | no-brilho-higienizacao (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| heloa-gas | 42 | ATTENTION | dona-lucy-salgados (42) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| no-brilho-higienizacao | 42 | ATTENTION | eisenfer-tubos-acos (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 41 | ATTENTION | diego-montador-moveis (41) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| bh-barreiro-marmitas | 39 | ACCEPTABLE | miro-tech (39) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| espaco-cih-luh | 39 | ACCEPTABLE | kitutes-na-mesa (39) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 39 | ACCEPTABLE | miro-tech (39) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 38 | ACCEPTABLE | confeitaria-sabor-da-realeza (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 38 | ACCEPTABLE | paulo-mestre-de-obras (38) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 37 | ACCEPTABLE | bh-barreiro-marmitas (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 36 | ACCEPTABLE | guaratuba-oficina-nautica (36) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 36 | ACCEPTABLE | casa-nativa (36) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 35 | ACCEPTABLE | mirassol-delicias-caseiras (35) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 35 | ACCEPTABLE | marido-de-aluguel (35) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| raphael-construcoes | 34 | ACCEPTABLE | ton-e-cor (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_PLACEHOLDER | — |
| ton-e-cor | 34 | ACCEPTABLE | raphael-construcoes (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| hbk-iluminacao-led | 32 | ACCEPTABLE | jc-revestimentos (32) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 32 | ACCEPTABLE | hbk-iluminacao-led (32) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 32 | ACCEPTABLE | angel-mix-brecho (32) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| pastelaria-route-66 | 32 | ACCEPTABLE | mp-festas-eventos (32) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| almeida-torres | 31 | ACCEPTABLE | guaratuba-atelie-presentes (31) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 30 | ACCEPTABLE | reuse-house-brecho (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-sabores-da-baia | 30 | ACCEPTABLE | heloa-gas (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| premium-envelopamentos | 30 | ACCEPTABLE | jc-revestimentos (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 30 | ACCEPTABLE | beto-pasteis (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 29 | ACCEPTABLE | assistencia-microondas-santos (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 27 | ACCEPTABLE | bruna-diarista (27) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| dyzpromo | 25 | ACCEPTABLE | marido-de-aluguel (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| brecho-sao-francisco | 24 | ACCEPTABLE | toquinho-de-gente-brecho (24) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| paraiso-do-hot-dog | 24 | ACCEPTABLE | kitutes-na-mesa (24) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| sscons | 24 | ACCEPTABLE | bruna-diarista (24) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |

## Regressão

Veredito: **FAIL**

- COUNTER: {"kind":"COUNTER","key":"highSimilarity","label":"projetos HIGH_SIMILARITY","before":0,"after":6}
- COUNTER: {"kind":"COUNTER","key":"placeholderLogos","label":"logos placeholder","before":0,"after":24}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"bruna-diarista","status":"HIGH_SIMILARITY","score":66,"nearestMatch":"popys-conservacao-limpeza"}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"btb-construcao","status":"HIGH_SIMILARITY","score":69,"nearestMatch":"easy-clean"}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"easy-clean","status":"HIGH_SIMILARITY","score":69,"nearestMatch":"btb-construcao"}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"embalar-embalagens","status":"HIGH_SIMILARITY","score":61,"nearestMatch":"maximos-cabeleireiros"}
- MODIFIED_PROJECT: {"kind":"MODIFIED_PROJECT","slug":"heloa-gas","before":"ACCEPTABLE","after":"ATTENTION","beforeScore":38,"afterScore":42}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"maximos-cabeleireiros","status":"HIGH_SIMILARITY","score":61,"nearestMatch":"embalar-embalagens"}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"popys-conservacao-limpeza","status":"HIGH_SIMILARITY","score":66,"nearestMatch":"bruna-diarista"}


