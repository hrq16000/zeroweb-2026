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
| ACCEPTABLE | 3 |
| ATTENTION | 10 |
| HIGH_SIMILARITY | 25 |
| CLONE | 19 |
| SHARED_FALLBACK | 11 |
| Clusters | 5 |
| Logos placeholder | 11 |
| Logos ausentes | 0 |
| Capas ausentes | 27 |
| Capas usando imagem social | 11 |
| Capas compartilhadas | 0 |
| Crop severo | 22 |

## Clusters

### CLUSTER_01 — COPY_ONLY_VARIATION (média 100, risco ALTO)
Base: `src/routes/sites.$vertical.tsx`
Membros: almeida-torres, bh-barreiro-marmitas, casa-nativa, clinica-integrada, guaratuba-atelie-presentes, guaratuba-oficina-nautica, guaratuba-reparos-residenciais, guaratuba-sabores-da-baia, mirassol-conserta-celular, mirassol-delicias-caseiras, uberlandia-eletrica-residencial

### CLUSTER_02 — NEAR_DUPLICATE_LAYOUT (média 91, risco ALTO)
Base: `src/components/site/AngelMixBrechoPage.tsx`
Membros: angel-mix-brecho, beto-pasteis, brecho-sao-francisco, dlara-pizzaria, marmitaria-dom-diego, reuse-house-brecho, toquinho-de-gente-brecho, woodhouse-hamburgueres

### CLUSTER_03 — NEAR_DUPLICATE_LAYOUT (média 82, risco ALTO)
Base: `src/components/site/AguiaSulSinalizacaoPage.tsx`
Membros: aguia-sul-sinalizacao, eisenfer-tubos-acos, eletro-solucoes-eficazes, eletrovale-eletromecanica, jkl-marcenaria

### CLUSTER_04 — IDENTICAL_COMPONENT_STRUCTURE (média 100, risco ALTO)
Base: `src/components/site/HbkIluminacaoLedPage.tsx`
Membros: hbk-iluminacao-led, jc-revestimentos, raphael-construcoes, ton-e-cor

### CLUSTER_05 — NEAR_DUPLICATE_LAYOUT (média 84, risco ALTO)
Base: `src/components/site/EspacoCihLuhPage.tsx`
Membros: espaco-cih-luh, salao-da-marcia

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| almeida-torres | 100 | SHARED_FALLBACK | bh-barreiro-marmitas (100) | SHARED_VERTICAL_FALLBACK | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | juridico |
| angel-mix-brecho | 100 | CLONE | brecho-sao-francisco (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 100 | CLONE | dlara-pizzaria (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| bh-barreiro-marmitas | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | restaurantes |
| brecho-sao-francisco | 100 | CLONE | angel-mix-brecho (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | services |
| clinica-integrada | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | saude |
| dlara-pizzaria | 100 | CLONE | beto-pasteis (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | comercios |
| guaratuba-oficina-nautica | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | services |
| guaratuba-reparos-residenciais | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | services |
| guaratuba-sabores-da-baia | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | restaurantes |
| hbk-iluminacao-led | 100 | CLONE | jc-revestimentos (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 100 | CLONE | hbk-iluminacao-led (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 100 | CLONE | beto-pasteis (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | services |
| mirassol-delicias-caseiras | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | restaurantes |
| raphael-construcoes | 100 | CLONE | hbk-iluminacao-led (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 100 | CLONE | angel-mix-brecho (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ton-e-cor | 100 | CLONE | hbk-iluminacao-led (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 100 | CLONE | angel-mix-brecho (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 100 | SHARED_FALLBACK | almeida-torres (100) | SHARED_VERTICAL_FALLBACK | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | services |
| woodhouse-hamburgueres | 100 | CLONE | beto-pasteis (100) | IDENTICAL_COMPONENT_STRUCTURE | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 87 | CLONE | eletrovale-eletromecanica (87) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| eletrovale-eletromecanica | 87 | CLONE | eisenfer-tubos-acos (87) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 86 | CLONE | eisenfer-tubos-acos (86) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| espaco-cih-luh | 84 | CLONE | salao-da-marcia (84) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 84 | CLONE | espaco-cih-luh (84) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-marcenaria | 83 | CLONE | eisenfer-tubos-acos (83) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 82 | CLONE | eletrovale-eletromecanica (82) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| lucas-arruma-maquina-lavar | 78 | HIGH_SIMILARITY | espaco-cih-luh (78) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 76 | HIGH_SIMILARITY | eletro-solucoes-eficazes (76) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 75 | HIGH_SIMILARITY | lj-cleaning (75) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 75 | HIGH_SIMILARITY | galileu-locacao-brinquedos (75) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 74 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (74) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 74 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (74) | IDENTICAL_COMPONENT_STRUCTURE | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 72 | HIGH_SIMILARITY | thays-camilla (72) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| diego-montador-moveis | 72 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (72) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| thays-camilla | 72 | HIGH_SIMILARITY | artesanatos-darleia-oliveira (72) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 71 | HIGH_SIMILARITY | lk-alvenaria (71) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| miro-tech | 70 | HIGH_SIMILARITY | lj-cleaning (70) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 69 | HIGH_SIMILARITY | premium-envelopamentos (69) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 69 | HIGH_SIMILARITY | lolipa-arte-em-festas (69) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 68 | HIGH_SIMILARITY | eletrovale-eletromecanica (68) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-sabor-da-realeza | 67 | HIGH_SIMILARITY | lolipa-arte-em-festas (67) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| liz-moraes-nail-designer | 66 | HIGH_SIMILARITY | salao-da-marcia (66) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 65 | HIGH_SIMILARITY | premium-envelopamentos (65) | NEAR_DUPLICATE_LAYOUT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 65 | HIGH_SIMILARITY | thays-camilla (65) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| paulo-mestre-de-obras | 65 | HIGH_SIMILARITY | lucas-arruma-maquina-lavar (65) | NEAR_DUPLICATE_LAYOUT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 64 | HIGH_SIMILARITY | studio-de-cilios (64) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| studio-de-cilios | 64 | HIGH_SIMILARITY | mp-festas-eventos (64) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 62 | HIGH_SIMILARITY | studio-de-cilios (62) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 62 | HIGH_SIMILARITY | espaco-cih-luh (62) | NEAR_DUPLICATE_LAYOUT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| refrigeracao-maresia | 61 | HIGH_SIMILARITY | liz-moraes-nail-designer (61) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 61 | HIGH_SIMILARITY | confeitaria-sabor-da-realeza (61) | NEAR_DUPLICATE_LAYOUT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 60 | ATTENTION | mp-festas-eventos (60) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| heloa-gas | 57 | ATTENTION | hbk-iluminacao-led (57) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 57 | ATTENTION | renata-beauty (57) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 57 | ATTENTION | r_beauty (57) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 55 | ATTENTION | no-brilho-higienizacao (55) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 53 | ATTENTION | rj-servicos-drywall (53) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| rj-servicos-drywall | 53 | ATTENTION | fernanda-amaral-drywall (53) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 52 | ATTENTION | miro-tech (52) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 44 | ATTENTION | lucas-arruma-maquina-lavar (44) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 42 | ATTENTION | marido-de-aluguel (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 32 | ACCEPTABLE | mp-festas-eventos (32) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| paraiso-do-hot-dog | 29 | ACCEPTABLE | lucas-arruma-maquina-lavar (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 27 | ACCEPTABLE | paulo-mestre-de-obras (27) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |

## Regressão

Veredito: **PASS**

Nenhuma regressão em relação à baseline.


