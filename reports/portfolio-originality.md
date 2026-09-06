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
| Total | 72 |
| ORIGINAL | 0 |
| ACCEPTABLE | 27 |
| ATTENTION | 43 |
| HIGH_SIMILARITY | 2 |
| CLONE | 0 |
| SHARED_FALLBACK | 0 |
| Clusters | 0 |
| Logos placeholder | 0 |
| Logos ausentes | 0 |
| Capas sem arquivo no catálogo (legado) | 24 |
| Capas válidas (contrato canônico) | 35 |
| Capas pendentes (contrato canônico) | 37 |
| Capas usando imagem social | 10 |
| Capas compartilhadas | 0 |
| Crop severo | 19 |
| Assets de marca cruzados (inválidos) | 0 |
| Assets compartilhados suspeitos | 0 |

## Clusters

Nenhum cluster acima do limiar.

## Matriz de pares — top 20

| A | B | Score | Motivo | STRUCTURE | SECTION_ORDER | COMPONENT | STYLE | COPY | ASSET | IDENTITY |
|---|---|---|---|---|---|---|---|---|---|---|
| bruna-diarista | popys-conservacao-limpeza | 66 | NEAR_DUPLICATE_LAYOUT | 65.5 | 100 | 76.9 | 80.3 | 0 | 15 | 11.8 |
| aguia-sul-sinalizacao | diego-montador-moveis | 59 | SAME_FAMILY | 74 | 50 | 85.7 | 85.9 | 1.1 | 7.5 | 23.1 |
| aguia-sul-sinalizacao | mary-diarista | 59 | SAME_FAMILY | 78.7 | 50 | 71.4 | 92.5 | 0 | 7.5 | 9.4 |
| mp-festas-eventos | studio-de-cilios | 59 | SAME_FAMILY | 76.2 | 66.7 | 61.5 | 85 | 0.8 | 5 | 9.8 |
| acai-total-araucaria | aguia-sul-sinalizacao | 58 | SAME_FAMILY | 73.5 | 57.1 | 71.4 | 91.3 | 0 | 7.5 | 10.7 |
| aguia-sul-sinalizacao | bruna-diarista | 57 | SAME_FAMILY | 60 | 100 | 41.7 | 78.9 | 0 | 7.5 | 9.4 |
| confeitaria-chyrley | studio-de-cilios | 56 | SAME_FAMILY | 54 | 100 | 37.5 | 86.5 | 0.5 | 10 | 6.8 |
| mimo-salgados-doces | popys-conservacao-limpeza | 56 | SAME_FAMILY | 66.7 | 50 | 76.9 | 88.4 | 0 | 2.5 | 13.8 |
| acai-total-araucaria | mary-diarista | 55 | SAME_FAMILY | 76.1 | 37.5 | 71.4 | 92.5 | 0 | 3 | 10.3 |
| diego-montador-moveis | paulo-mestre-de-obras | 55 | SAME_FAMILY | 62.7 | 75 | 60 | 70.9 | 3 | 5 | 15.2 |
| acai-total-araucaria | ecommerce-on | 54 | SAME_FAMILY | 73.5 | 42.9 | 75 | 77.5 | 0 | 7.5 | 11.1 |
| liz-moraes-nail-designer | mp-festas-eventos | 54 | SAME_FAMILY | 56.7 | 66.7 | 72.7 | 72.4 | 0.4 | 2.1 | 13.3 |
| aguia-sul-sinalizacao | paulo-mestre-de-obras | 53 | SAME_FAMILY | 79.6 | 40 | 66.7 | 72.9 | 0.5 | 5 | 14.3 |
| bruna-diarista | mimo-salgados-doces | 53 | SAME_FAMILY | 67.3 | 50 | 69.2 | 82.2 | 0.6 | 2.5 | 10.7 |
| denise-gomes-psicologa | mp-festas-eventos | 53 | SAME_FAMILY | 39.7 | 100 | 57.1 | 68.4 | 0 | 2.1 | 14.3 |
| diego-montador-moveis | liz-moraes-nail-designer | 53 | SAME_FAMILY | 50 | 100 | 36.4 | 75 | 1.1 | 6 | 5.7 |
| mp-festas-eventos | vila-da-capivara | 53 | SAME_FAMILY | 67.6 | 50 | 61.5 | 88.6 | 0.8 | 6.4 | 10.7 |
| acai-total-araucaria | diego-montador-moveis | 52 | SAME_FAMILY | 75 | 37.5 | 62.5 | 85.9 | 0 | 3 | 11.5 |
| aguia-sul-sinalizacao | ecommerce-on | 52 | SAME_FAMILY | 95.6 | 22.2 | 55.6 | 79.7 | 0 | 4.3 | 7.5 |
| aguia-sul-sinalizacao | popys-conservacao-limpeza | 52 | SAME_FAMILY | 49.2 | 100 | 38.5 | 68.4 | 0.6 | 7.5 | 8.8 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| bruna-diarista | 66 | HIGH_SIMILARITY | popys-conservacao-limpeza (66) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| popys-conservacao-limpeza | 66 | HIGH_SIMILARITY | bruna-diarista (66) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 59 | ATTENTION | diego-montador-moveis (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| diego-montador-moveis | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 59 | ATTENTION | aguia-sul-sinalizacao (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 59 | ATTENTION | studio-de-cilios (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 59 | ATTENTION | mp-festas-eventos (59) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 58 | ATTENTION | aguia-sul-sinalizacao (58) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 56 | ATTENTION | studio-de-cilios (56) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mimo-salgados-doces | 56 | ATTENTION | popys-conservacao-limpeza (56) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 55 | ATTENTION | diego-montador-moveis (55) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 54 | ATTENTION | acai-total-araucaria (54) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| liz-moraes-nail-designer | 54 | ATTENTION | mp-festas-eventos (54) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 53 | ATTENTION | mp-festas-eventos (53) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 53 | ATTENTION | mp-festas-eventos (53) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 51 | ATTENTION | lk-alvenaria (51) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| confeitaria-sabor-da-realeza | 51 | ATTENTION | sos-presentes-cosmeticos (51) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 51 | ATTENTION | ag-electrical-services (51) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 51 | ATTENTION | confeitaria-sabor-da-realeza (51) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 50 | ATTENTION | eletrovale-eletromecanica (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletrovale-eletromecanica | 50 | ATTENTION | eletro-solucoes-eficazes (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 50 | ATTENTION | rj-servicos-drywall (50) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| refrigeracao-maresia | 50 | ATTENTION | liz-moraes-nail-designer (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| rj-servicos-drywall | 50 | ATTENTION | fernanda-amaral-drywall (50) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 49 | ATTENTION | liz-moraes-nail-designer (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| miro-tech | 49 | ATTENTION | mimo-salgados-doces (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-marcenaria | 46 | ATTENTION | eletro-solucoes-eficazes (46) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 46 | ATTENTION | woodhouse-hamburgueres (46) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 46 | ATTENTION | toquinho-de-gente-brecho (46) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 45 | ATTENTION | lj-cleaning (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 45 | ATTENTION | galileu-locacao-brinquedos (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| lucas-arruma-maquina-lavar | 44 | ATTENTION | denise-gomes-psicologa (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 44 | ATTENTION | sos-presentes-cosmeticos (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| clinica-integrada | 43 | ATTENTION | lk-alvenaria (43) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| angel-mix-brecho | 42 | ATTENTION | dlara-pizzaria (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 42 | ATTENTION | lk-alvenaria (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 42 | ATTENTION | angel-mix-brecho (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 42 | ATTENTION | no-brilho-higienizacao (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 42 | ATTENTION | eisenfer-tubos-acos (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 41 | ATTENTION | diego-montador-moveis (41) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| bh-barreiro-marmitas | 39 | ACCEPTABLE | miro-tech (39) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 39 | ACCEPTABLE | miro-tech (39) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| espaco-cih-luh | 38 | ACCEPTABLE | liz-moraes-nail-designer (38) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| heloa-gas | 38 | ACCEPTABLE | miro-tech (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 38 | ACCEPTABLE | confeitaria-sabor-da-realeza (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 38 | ACCEPTABLE | paulo-mestre-de-obras (38) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 37 | ACCEPTABLE | bh-barreiro-marmitas (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 36 | ACCEPTABLE | guaratuba-oficina-nautica (36) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 36 | ACCEPTABLE | casa-nativa (36) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 35 | ACCEPTABLE | mirassol-delicias-caseiras (35) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 35 | ACCEPTABLE | marido-de-aluguel (35) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| raphael-construcoes | 34 | ACCEPTABLE | ton-e-cor (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ton-e-cor | 34 | ACCEPTABLE | raphael-construcoes (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| hbk-iluminacao-led | 32 | ACCEPTABLE | jc-revestimentos (32) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 32 | ACCEPTABLE | hbk-iluminacao-led (32) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 32 | ACCEPTABLE | angel-mix-brecho (32) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| almeida-torres | 31 | ACCEPTABLE | guaratuba-atelie-presentes (31) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 30 | ACCEPTABLE | reuse-house-brecho (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-sabores-da-baia | 30 | ACCEPTABLE | heloa-gas (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 30 | ACCEPTABLE | jc-revestimentos (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 30 | ACCEPTABLE | beto-pasteis (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 29 | ACCEPTABLE | assistencia-microondas-santos (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 27 | ACCEPTABLE | bruna-diarista (27) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 25 | ACCEPTABLE | marido-de-aluguel (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| brecho-sao-francisco | 24 | ACCEPTABLE | toquinho-de-gente-brecho (24) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| paraiso-do-hot-dog | 24 | ACCEPTABLE | miro-tech (24) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| sscons | 24 | ACCEPTABLE | bruna-diarista (24) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |

## Regressão

Veredito: **FAIL**

- COUNTER: {"kind":"COUNTER","key":"highSimilarity","label":"projetos HIGH_SIMILARITY","before":0,"after":2}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"bruna-diarista","status":"HIGH_SIMILARITY","score":66,"nearestMatch":"popys-conservacao-limpeza"}
- NEW_PROJECT: {"kind":"NEW_PROJECT","slug":"popys-conservacao-limpeza","status":"HIGH_SIMILARITY","score":66,"nearestMatch":"bruna-diarista"}


