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
| Total | 96 |
| ORIGINAL | 1 |
| ACCEPTABLE | 33 |
| ATTENTION | 62 |
| HIGH_SIMILARITY | 0 |
| CLONE | 0 |
| SHARED_FALLBACK | 0 |
| Clusters | 0 |
| Logos placeholder | 26 |
| Logos ausentes | 0 |
| Capas sem arquivo no catálogo (legado) | 24 |
| Capas válidas (contrato canônico) | 48 |
| Capas pendentes (contrato canônico) | 48 |
| Capas usando imagem social | 14 |
| Capas compartilhadas | 0 |
| Crop severo | 19 |
| Assets de marca cruzados (inválidos) | 0 |
| Assets compartilhados suspeitos | 0 |

## Clusters

Nenhum cluster acima do limiar.

## Matriz de pares — top 20

| A | B | Score | Motivo | STRUCTURE | SECTION_ORDER | COMPONENT | STYLE | COPY | ASSET | IDENTITY |
|---|---|---|---|---|---|---|---|---|---|---|
| kitutes-na-mesa | liz-moraes-nail-designer | 53 | SAME_FAMILY | 51.6 | 100 | 50 | 54.8 | 0 | 9 | 12.1 |
| bruna-diarista | diego-montador-moveis | 52 | SAME_FAMILY | 41.4 | 100 | 50 | 64.1 | 1 | 2.5 | 12.1 |
| embalar-embalagens | popys-conservacao-limpeza | 52 | SAME_FAMILY | 36.6 | 100 | 66.7 | 58.2 | 0 | 4.3 | 12.2 |
| enoel-portas | mania-de-limpeza | 51 | SAME_FAMILY | 44.4 | 85.7 | 53.3 | 69.1 | 0 | 15 | 15.4 |
| kitutes-na-mesa | miro-tech | 51 | SAME_FAMILY | 34.3 | 100 | 66.7 | 50 | 0 | 2.1 | 25 |
| r_beauty | renata-beauty | 51 | SAME_FAMILY | 52.6 | 100 | 40.9 | 47.7 | 1.5 | 7.5 | 10.2 |
| confeitaria-sabor-da-realeza | sos-presentes-cosmeticos | 50 | SAME_FAMILY | 33.8 | 100 | 50 | 70 | 0.6 | 5 | 8.8 |
| eletro-solucoes-eficazes | eletrovale-eletromecanica | 50 | SAME_FAMILY | 23.4 | 100 | 85.7 | 44.2 | 0.8 | 9 | 9.1 |
| fernanda-amaral-drywall | rj-servicos-drywall | 50 | SAME_FAMILY | 67.7 | 62.5 | 35.7 | 76.6 | 1.5 | 3.3 | 33.3 |
| liz-moraes-nail-designer | refrigeracao-maresia | 50 | SAME_FAMILY | 56.1 | 83.3 | 26.7 | 82.5 | 0.6 | 3.8 | 4.7 |
| acai-total-araucaria | kitutes-na-mesa | 49 | SAME_FAMILY | 35.4 | 100 | 54.5 | 53.6 | 1.2 | 6 | 12.9 |
| aguia-sul-sinalizacao | mp-festas-eventos | 49 | SAME_FAMILY | 46.8 | 100 | 33.3 | 60.9 | 0 | 2.5 | 10 |
| confeitaria-sabor-da-realeza | miro-tech | 49 | SAME_FAMILY | 46 | 66.7 | 58.3 | 76.5 | 0.3 | 15 | 13 |
| acai-total-araucaria | liz-moraes-nail-designer | 48 | SAME_FAMILY | 23.8 | 100 | 66.7 | 51.5 | 0 | 2.5 | 10.5 |
| angel-mix-brecho | woodhouse-hamburgueres | 48 | SAME_FAMILY | 8.7 | 100 | 100 | 37.7 | 0.4 | 15 | 0 |
| assistencia-microondas-santos | liz-moraes-nail-designer | 48 | SAME_FAMILY | 51.4 | 62.5 | 46.2 | 81 | 2 | 9 | 10.8 |
| enoel-portas | kitutes-na-mesa | 48 | SAME_FAMILY | 60.7 | 50 | 66.7 | 54.6 | 0.7 | 11.2 | 16.7 |
| kitutes-na-mesa | maximos-cabeleireiros | 48 | SAME_FAMILY | 48 | 62.5 | 61.5 | 67.9 | 0.5 | 15 | 14.3 |
| mania-de-limpeza | maximos-cabeleireiros | 48 | SAME_FAMILY | 40.5 | 100 | 33.3 | 62 | 0 | 11.2 | 5 |
| acai-total-araucaria | easy-clean | 47 | SAME_FAMILY | 52.7 | 50 | 55.6 | 80 | 0.8 | 6 | 11.8 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| kitutes-na-mesa | 53 | ATTENTION | liz-moraes-nail-designer (53) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| liz-moraes-nail-designer | 53 | ATTENTION | kitutes-na-mesa (53) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| bruna-diarista | 52 | ATTENTION | diego-montador-moveis (52) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| diego-montador-moveis | 52 | ATTENTION | bruna-diarista (52) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| embalar-embalagens | 52 | ATTENTION | popys-conservacao-limpeza (52) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| popys-conservacao-limpeza | 52 | ATTENTION | embalar-embalagens (52) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| enoel-portas | 51 | ATTENTION | mania-de-limpeza (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mania-de-limpeza | 51 | ATTENTION | enoel-portas (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| miro-tech | 51 | ATTENTION | kitutes-na-mesa (51) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-sabor-da-realeza | 50 | ATTENTION | sos-presentes-cosmeticos (50) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eletro-solucoes-eficazes | 50 | ATTENTION | eletrovale-eletromecanica (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| eletrovale-eletromecanica | 50 | ATTENTION | eletro-solucoes-eficazes (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| fernanda-amaral-drywall | 50 | ATTENTION | rj-servicos-drywall (50) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| refrigeracao-maresia | 50 | ATTENTION | liz-moraes-nail-designer (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| rj-servicos-drywall | 50 | ATTENTION | fernanda-amaral-drywall (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| sos-presentes-cosmeticos | 50 | ATTENTION | confeitaria-sabor-da-realeza (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 49 | ATTENTION | kitutes-na-mesa (49) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 49 | ATTENTION | mp-festas-eventos (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| mp-festas-eventos | 49 | ATTENTION | aguia-sul-sinalizacao (49) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| angel-mix-brecho | 48 | ATTENTION | woodhouse-hamburgueres (48) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 48 | ATTENTION | liz-moraes-nail-designer (48) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| maximos-cabeleireiros | 48 | ATTENTION | kitutes-na-mesa (48) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 48 | ATTENTION | angel-mix-brecho (48) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| catharine-lima-studio | 47 | ATTENTION | kitutes-na-mesa (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| cris-presentes-colonia-rio-grande | 47 | ATTENTION | js-eletrica-manutencao (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| easy-clean | 47 | ATTENTION | acai-total-araucaria (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| js-eletrica-manutencao | 47 | ATTENTION | cris-presentes-colonia-rio-grande (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| salao-da-marcia | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| studio-de-cilios | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| paulo-mestre-de-obras | 46 | ATTENTION | liz-moraes-nail-designer (46) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| pinturas-nunes | 46 | ATTENTION | eletro-solucoes-eficazes (46) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| thays-camilla | 46 | ATTENTION | cris-presentes-colonia-rio-grande (46) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| clinica-integrada | 45 | ATTENTION | sos-presentes-cosmeticos (45) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 45 | ATTENTION | acai-total-araucaria (45) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 45 | ATTENTION | liz-moraes-nail-designer (45) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_PLACEHOLDER | — |
| dlara-pizzaria | 45 | ATTENTION | angel-mix-brecho (45) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 45 | ATTENTION | lj-cleaning (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-decor | 45 | ATTENTION | moreira-auto-mecanica (45) | EXCESSIVE_COPY_SIMILARITY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 45 | ATTENTION | galileu-locacao-brinquedos (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 45 | ATTENTION | sos-presentes-cosmeticos (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| moreira-auto-mecanica | 45 | ATTENTION | jkl-decor (45) | EXCESSIVE_COPY_SIMILARITY | COVER_IS_LOGO, COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 45 | ATTENTION | studio-de-cilios (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| btb-construcao | 44 | ATTENTION | embalar-embalagens (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| dona-lucy-salgados | 44 | ATTENTION | mania-de-limpeza (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 44 | ATTENTION | liz-moraes-nail-designer (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| mimo-salgados-doces | 44 | ATTENTION | kitutes-na-mesa (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 43 | ATTENTION | lk-alvenaria (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| papelemi-personalizados | 43 | ATTENTION | embalar-embalagens (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| simone-lacerda-vaz | 43 | ATTENTION | enoel-portas (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| artesanatos-darleia-oliveira | 42 | ATTENTION | lk-alvenaria (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 42 | ATTENTION | no-brilho-higienizacao (42) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| heloa-gas | 42 | ATTENTION | dona-lucy-salgados (42) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lucas-arruma-maquina-lavar | 42 | ATTENTION | aguia-sul-sinalizacao (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| no-brilho-higienizacao | 42 | ATTENTION | eisenfer-tubos-acos (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| centro-mega | 41 | ATTENTION | aguia-sul-sinalizacao (41) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| ecommerce-on | 41 | ATTENTION | liz-moraes-nail-designer (41) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| estrutura-nacional | 41 | ATTENTION | pinturas-nunes (41) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| your-brutus-burguer | 41 | ATTENTION | liz-moraes-nail-designer (41) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| bh-barreiro-marmitas | 40 | ACCEPTABLE | your-brutus-burguer (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| espaco-cih-luh | 39 | ACCEPTABLE | kitutes-na-mesa (39) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| arildo-madeiras | 38 | ACCEPTABLE | autoescola-aptos (38) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| auto-socorro-dentinho | 38 | ACCEPTABLE | marido-de-aluguel (38) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| autoescola-aptos | 38 | ACCEPTABLE | arildo-madeiras (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 38 | ACCEPTABLE | miro-tech (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 38 | ACCEPTABLE | auto-socorro-dentinho (38) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 38 | ACCEPTABLE | woodhouse-hamburgueres (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 37 | ACCEPTABLE | guaratuba-oficina-nautica (37) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 37 | ACCEPTABLE | casa-nativa (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 37 | ACCEPTABLE | confeitaria-sabor-da-realeza (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 37 | ACCEPTABLE | bh-barreiro-marmitas (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| beto-pasteis | 36 | ACCEPTABLE | reuse-house-brecho (36) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 36 | ACCEPTABLE | beto-pasteis (36) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 36 | ACCEPTABLE | enoel-portas (36) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| almeida-torres | 35 | ACCEPTABLE | estrutura-nacional (35) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-conserta-celular | 35 | ACCEPTABLE | mirassol-delicias-caseiras (35) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 35 | ACCEPTABLE | marido-de-aluguel (35) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| raphael-construcoes | 34 | ACCEPTABLE | ton-e-cor (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_PLACEHOLDER | — |
| ton-e-cor | 34 | ACCEPTABLE | raphael-construcoes (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| hbk-iluminacao-led | 32 | ACCEPTABLE | jc-revestimentos (32) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 32 | ACCEPTABLE | hbk-iluminacao-led (32) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| pastelaria-route-66 | 31 | ACCEPTABLE | simone-lacerda-vaz (31) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| guaratuba-sabores-da-baia | 30 | ACCEPTABLE | heloa-gas (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| marmitaria-dom-diego | 30 | ACCEPTABLE | angel-mix-brecho (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| premium-envelopamentos | 30 | ACCEPTABLE | jc-revestimentos (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 29 | ACCEPTABLE | assistencia-microondas-santos (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| adhonep-curitiba | 27 | ACCEPTABLE | reuse-house-brecho (27) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 27 | ACCEPTABLE | bh-barreiro-marmitas (27) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| brecho-sao-francisco | 25 | ACCEPTABLE | toquinho-de-gente-brecho (25) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 25 | ACCEPTABLE | marido-de-aluguel (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| paraiso-do-hot-dog | 24 | ACCEPTABLE | miro-tech (24) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| sscons | 24 | ACCEPTABLE | jc-revestimentos (24) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| carecas-infotec | 18 | ORIGINAL | jkl-decor (18) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |

## Regressão

Veredito: **PASS**

Nenhuma regressão em relação à baseline.

Melhorias:
- {"kind":"COUNTER","key":"highSimilarity","label":"projetos HIGH_SIMILARITY","before":5,"after":0}
- {"kind":"MODIFIED_PROJECT","slug":"bruna-diarista","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"easy-clean","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"embalar-embalagens","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"maximos-cabeleireiros","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"popys-conservacao-limpeza","before":"HIGH_SIMILARITY","after":"ATTENTION"}
- {"kind":"MODIFIED_PROJECT","slug":"santos-montador-de-moveis","before":"ATTENTION","after":"ACCEPTABLE"}
- {"kind":"MODIFIED_PROJECT","slug":"toquinho-de-gente-brecho","before":"ATTENTION","after":"ACCEPTABLE"}
