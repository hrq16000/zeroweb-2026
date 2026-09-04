# Originalidade do portfólio

Gerado por `bun run check:portfolio-originality --report`. Determinístico: mesmos
arquivos produzem o mesmo resultado. Modo atual: **REPORT_ONLY**.

## Fórmula

`score = 0.3·structure + 0.25·sectionOrder + 0.2·component + 0.15·style + 0.07·assetPattern + 0.03·identity`

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
| ACCEPTABLE | 7 |
| ATTENTION | 16 |
| HIGH_SIMILARITY | 30 |
| CLONE | 15 |
| SHARED_FALLBACK | 0 |
| Clusters | 3 |
| Logos placeholder | 11 |
| Logos ausentes | 0 |
| Capas ausentes | 27 |
| Capas usando imagem social | 11 |
| Capas compartilhadas | 0 |
| Crop severo | 22 |

## Clusters

### CLUSTER_01 — NEAR_DUPLICATE_LAYOUT (média 91, risco ALTO)
Base: `src/components/site/AngelMixBrechoPage.tsx`
Membros: angel-mix-brecho, beto-pasteis, brecho-sao-francisco, dlara-pizzaria, marmitaria-dom-diego, reuse-house-brecho, toquinho-de-gente-brecho, woodhouse-hamburgueres

### CLUSTER_02 — NEAR_DUPLICATE_LAYOUT (média 82, risco ALTO)
Base: `src/components/site/AguiaSulSinalizacaoPage.tsx`
Membros: aguia-sul-sinalizacao, eisenfer-tubos-acos, eletro-solucoes-eficazes, eletrovale-eletromecanica, jkl-marcenaria

### CLUSTER_03 — NEAR_DUPLICATE_LAYOUT (média 84, risco ALTO)
Base: `src/components/site/EspacoCihLuhPage.tsx`
Membros: espaco-cih-luh, salao-da-marcia

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| angel-mix-brecho | 100 | CLONE | brecho-sao-francisco (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 100 | CLONE | dlara-pizzaria (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| brecho-sao-francisco | 100 | CLONE | angel-mix-brecho (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 100 | CLONE | beto-pasteis (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 100 | CLONE | beto-pasteis (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 100 | CLONE | angel-mix-brecho (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 100 | CLONE | angel-mix-brecho (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 100 | CLONE | beto-pasteis (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 87 | CLONE | eletrovale-eletromecanica (87) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletrovale-eletromecanica | 87 | CLONE | eisenfer-tubos-acos (87) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 86 | CLONE | eisenfer-tubos-acos (86) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| espaco-cih-luh | 84 | CLONE | salao-da-marcia (84) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 84 | CLONE | espaco-cih-luh (84) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-marcenaria | 83 | CLONE | eisenfer-tubos-acos (83) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 82 | CLONE | eletrovale-eletromecanica (82) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| lucas-arruma-maquina-lavar | 78 | HIGH_SIMILARITY | espaco-cih-luh (78) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 76 | HIGH_SIMILARITY | lj-cleaning (76) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 76 | HIGH_SIMILARITY | galileu-locacao-brinquedos (76) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 76 | HIGH_SIMILARITY | eletro-solucoes-eficazes (76) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 74 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (74) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 73 | HIGH_SIMILARITY | thays-camilla (73) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 73 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (73) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 73 | HIGH_SIMILARITY | artesanatos-darleia-oliveira (73) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| diego-montador-moveis | 72 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (72) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 71 | HIGH_SIMILARITY | lk-alvenaria (71) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| lolipa-arte-em-festas | 70 | HIGH_SIMILARITY | premium-envelopamentos (70) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| miro-tech | 70 | HIGH_SIMILARITY | lj-cleaning (70) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 70 | HIGH_SIMILARITY | lolipa-arte-em-festas (70) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 68 | HIGH_SIMILARITY | eletrovale-eletromecanica (68) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| hbk-iluminacao-led | 68 | HIGH_SIMILARITY | jc-revestimentos (68) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 68 | HIGH_SIMILARITY | hbk-iluminacao-led (68) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| raphael-construcoes | 68 | HIGH_SIMILARITY | ton-e-cor (68) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ton-e-cor | 68 | HIGH_SIMILARITY | raphael-construcoes (68) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 66 | HIGH_SIMILARITY | premium-envelopamentos (66) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-sabor-da-realeza | 66 | HIGH_SIMILARITY | lolipa-arte-em-festas (66) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| liz-moraes-nail-designer | 66 | HIGH_SIMILARITY | salao-da-marcia (66) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 65 | HIGH_SIMILARITY | studio-de-cilios (65) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 65 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (65) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 65 | HIGH_SIMILARITY | mp-festas-eventos (65) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 64 | HIGH_SIMILARITY | thays-camilla (64) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 63 | HIGH_SIMILARITY | studio-de-cilios (63) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 62 | HIGH_SIMILARITY | espaco-cih-luh (62) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| sos-presentes-cosmeticos | 62 | HIGH_SIMILARITY | confeitaria-sabor-da-realeza (62) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| refrigeracao-maresia | 61 | HIGH_SIMILARITY | ag-electrical-services (61) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 61 | HIGH_SIMILARITY | mp-festas-eventos (61) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 57 | ATTENTION | renata-beauty (57) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 57 | ATTENTION | r_beauty (57) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 55 | ATTENTION | rj-servicos-drywall (55) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| rj-servicos-drywall | 55 | ATTENTION | fernanda-amaral-drywall (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 55 | ATTENTION | no-brilho-higienizacao (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 53 | ATTENTION | miro-tech (53) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 51 | ATTENTION | mirassol-delicias-caseiras (51) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| mirassol-delicias-caseiras | 51 | ATTENTION | guaratuba-atelie-presentes (51) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| clinica-integrada | 49 | ATTENTION | confeitaria-sabor-da-realeza (49) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| mirassol-conserta-celular | 49 | ATTENTION | mirassol-delicias-caseiras (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| uberlandia-eletrica-residencial | 49 | ATTENTION | hbk-iluminacao-led (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| casa-nativa | 48 | ATTENTION | guaratuba-oficina-nautica (48) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| guaratuba-oficina-nautica | 48 | ATTENTION | casa-nativa (48) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| heloa-gas | 47 | ATTENTION | lj-cleaning (47) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| bh-barreiro-marmitas | 45 | ATTENTION | uberlandia-eletrica-residencial (45) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| marido-de-aluguel | 44 | ATTENTION | lk-alvenaria (44) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 40 | ACCEPTABLE | marido-de-aluguel (40) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 37 | ACCEPTABLE | uberlandia-eletrica-residencial (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| guaratuba-sabores-da-baia | 36 | ACCEPTABLE | uberlandia-eletrica-residencial (36) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| almeida-torres | 34 | ACCEPTABLE | guaratuba-atelie-presentes (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| emporio-lelecute | 33 | ACCEPTABLE | mp-festas-eventos (33) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paraiso-do-hot-dog | 29 | ACCEPTABLE | lucas-arruma-maquina-lavar (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 28 | ACCEPTABLE | marido-de-aluguel (28) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |

## Regressão

Veredito: **FAIL**

- COUNTER: {"kind":"COUNTER","key":"highSimilarity","label":"projetos HIGH_SIMILARITY","before":26,"after":30}

Melhorias:
- {"kind":"COUNTER","key":"clone","label":"clones","before":19,"after":15}
- {"kind":"MODIFIED_PROJECT","slug":"hbk-iluminacao-led","before":"CLONE","after":"HIGH_SIMILARITY"}
- {"kind":"MODIFIED_PROJECT","slug":"jc-revestimentos","before":"CLONE","after":"HIGH_SIMILARITY"}
- {"kind":"MODIFIED_PROJECT","slug":"raphael-construcoes","before":"CLONE","after":"HIGH_SIMILARITY"}
- {"kind":"MODIFIED_PROJECT","slug":"ton-e-cor","before":"CLONE","after":"HIGH_SIMILARITY"}
