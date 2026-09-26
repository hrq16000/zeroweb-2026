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
| ACCEPTABLE | 32 |
| ATTENTION | 63 |
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
| kitutes-na-mesa | liz-moraes-nail-designer | 53 | SAME_FAMILY | 50.8 | 100 | 50 | 56.4 | 0 | 9 | 12.1 |
| aguia-sul-sinalizacao | mp-festas-eventos | 52 | SAME_FAMILY | 50 | 100 | 40 | 61.1 | 0 | 2.5 | 10 |
| bruna-diarista | diego-montador-moveis | 52 | SAME_FAMILY | 43 | 100 | 50 | 65.5 | 0.9 | 2.5 | 12.1 |
| acai-total-araucaria | easy-clean | 51 | SAME_FAMILY | 52.9 | 66.7 | 55.6 | 83.7 | 0.9 | 6 | 11.8 |
| ag-electrical-services | lk-alvenaria | 51 | SAME_FAMILY | 47.4 | 100 | 58.3 | 40.4 | 0 | 3.2 | 5.6 |
| embalar-embalagens | popys-conservacao-limpeza | 51 | SAME_FAMILY | 35.4 | 100 | 61.5 | 56.1 | 0 | 4.3 | 14.3 |
| enoel-portas | mania-de-limpeza | 51 | SAME_FAMILY | 44.4 | 85.7 | 53.3 | 69.1 | 0 | 15 | 15.4 |
| enoel-portas | maximos-cabeleireiros | 51 | SAME_FAMILY | 45.3 | 100 | 46.2 | 57.3 | 0.8 | 11.2 | 5.9 |
| kitutes-na-mesa | mimo-salgados-doces | 51 | SAME_FAMILY | 49.2 | 100 | 40 | 58.1 | 0 | 5 | 7.7 |
| r_beauty | renata-beauty | 51 | SAME_FAMILY | 52.6 | 100 | 40.9 | 47.7 | 1.5 | 7.5 | 10.2 |
| confeitaria-sabor-da-realeza | sos-presentes-cosmeticos | 50 | SAME_FAMILY | 27.9 | 100 | 57.1 | 70.9 | 0.9 | 5 | 8.8 |
| denise-gomes-psicologa | liz-moraes-nail-designer | 50 | SAME_FAMILY | 53.1 | 66.7 | 58.3 | 68.1 | 2 | 7.5 | 13.9 |
| diego-montador-moveis | easy-clean | 50 | SAME_FAMILY | 63.2 | 50 | 50 | 88 | 0.9 | 2.5 | 12.9 |
| eletro-solucoes-eficazes | eletrovale-eletromecanica | 50 | SAME_FAMILY | 23.4 | 100 | 85.7 | 44.2 | 0.8 | 9 | 9.1 |
| kitutes-na-mesa | miro-tech | 50 | SAME_FAMILY | 31.3 | 100 | 66.7 | 51 | 0 | 2.1 | 25 |
| liz-moraes-nail-designer | refrigeracao-maresia | 50 | SAME_FAMILY | 56.1 | 83.3 | 26.7 | 82.5 | 0.6 | 3.8 | 4.7 |
| assistencia-microondas-santos | liz-moraes-nail-designer | 49 | SAME_FAMILY | 53.8 | 62.5 | 46.2 | 85 | 1.6 | 9 | 10.8 |
| cris-presentes-colonia-rio-grande | easy-clean | 49 | SAME_FAMILY | 32.1 | 100 | 44.4 | 68.5 | 0.4 | 11.2 | 9.4 |
| fernanda-amaral-drywall | rj-servicos-drywall | 49 | SAME_FAMILY | 64.6 | 62.5 | 35.7 | 74.8 | 2.4 | 3.3 | 33.3 |
| mimo-salgados-doces | miro-tech | 49 | SAME_FAMILY | 43.9 | 100 | 40 | 54.5 | 1.6 | 5 | 9.5 |

## Compartilhamento de assets entre clientes

Nenhum asset percebido compartilhado entre clientes.

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
| kitutes-na-mesa | 53 | ATTENTION | liz-moraes-nail-designer (53) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| liz-moraes-nail-designer | 53 | ATTENTION | kitutes-na-mesa (53) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| aguia-sul-sinalizacao | 52 | ATTENTION | mp-festas-eventos (52) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| bruna-diarista | 52 | ATTENTION | diego-montador-moveis (52) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| diego-montador-moveis | 52 | ATTENTION | bruna-diarista (52) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| mp-festas-eventos | 52 | ATTENTION | aguia-sul-sinalizacao (52) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| acai-total-araucaria | 51 | ATTENTION | easy-clean (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| ag-electrical-services | 51 | ATTENTION | lk-alvenaria (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| easy-clean | 51 | ATTENTION | acai-total-araucaria (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| embalar-embalagens | 51 | ATTENTION | popys-conservacao-limpeza (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| enoel-portas | 51 | ATTENTION | mania-de-limpeza (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lk-alvenaria | 51 | ATTENTION | ag-electrical-services (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| mania-de-limpeza | 51 | ATTENTION | enoel-portas (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| maximos-cabeleireiros | 51 | ATTENTION | enoel-portas (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mimo-salgados-doces | 51 | ATTENTION | kitutes-na-mesa (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| popys-conservacao-limpeza | 51 | ATTENTION | embalar-embalagens (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| r_beauty | 51 | ATTENTION | renata-beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT | — | — |
| renata-beauty | 51 | ATTENTION | r_beauty (51) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-sabor-da-realeza | 50 | ATTENTION | sos-presentes-cosmeticos (50) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| denise-gomes-psicologa | 50 | ATTENTION | liz-moraes-nail-designer (50) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_PLACEHOLDER | — |
| eletro-solucoes-eficazes | 50 | ATTENTION | eletrovale-eletromecanica (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| eletrovale-eletromecanica | 50 | ATTENTION | eletro-solucoes-eficazes (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| miro-tech | 50 | ATTENTION | kitutes-na-mesa (50) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| refrigeracao-maresia | 50 | ATTENTION | liz-moraes-nail-designer (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| sos-presentes-cosmeticos | 50 | ATTENTION | confeitaria-sabor-da-realeza (50) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| assistencia-microondas-santos | 49 | ATTENTION | liz-moraes-nail-designer (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| cris-presentes-colonia-rio-grande | 49 | ATTENTION | easy-clean (49) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| fernanda-amaral-drywall | 49 | ATTENTION | rj-servicos-drywall (49) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| rj-servicos-drywall | 49 | ATTENTION | fernanda-amaral-drywall (49) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| catharine-lima-studio | 48 | ATTENTION | kitutes-na-mesa (48) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| ecommerce-on | 48 | ATTENTION | paulo-mestre-de-obras (48) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| paulo-mestre-de-obras | 48 | ATTENTION | ecommerce-on (48) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| js-eletrica-manutencao | 47 | ATTENTION | cris-presentes-colonia-rio-grande (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mary-diarista | 47 | ATTENTION | ecommerce-on (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| salao-da-marcia | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| studio-de-cilios | 47 | ATTENTION | liz-moraes-nail-designer (47) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| pinturas-nunes | 46 | ATTENTION | eletro-solucoes-eficazes (46) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| thays-camilla | 46 | ATTENTION | sos-presentes-cosmeticos (46) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| toquinho-de-gente-brecho | 46 | ATTENTION | woodhouse-hamburgueres (46) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| woodhouse-hamburgueres | 46 | ATTENTION | toquinho-de-gente-brecho (46) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| galileu-locacao-brinquedos | 45 | ATTENTION | lj-cleaning (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| jkl-decor | 45 | ATTENTION | moreira-auto-mecanica (45) | EXCESSIVE_COPY_SIMILARITY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lj-cleaning | 45 | ATTENTION | galileu-locacao-brinquedos (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| lucas-arruma-maquina-lavar | 45 | ATTENTION | easy-clean (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| moreira-auto-mecanica | 45 | ATTENTION | jkl-decor (45) | EXCESSIVE_COPY_SIMILARITY | COVER_IS_LOGO, COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| vila-da-capivara | 45 | ATTENTION | studio-de-cilios (45) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| your-brutus-burguer | 45 | ATTENTION | mimo-salgados-doces (45) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| btb-construcao | 44 | ATTENTION | popys-conservacao-limpeza (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| clinica-integrada | 44 | ATTENTION | sos-presentes-cosmeticos (44) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dona-lucy-salgados | 44 | ATTENTION | mania-de-limpeza (44) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| eisenfer-tubos-acos | 43 | ATTENTION | no-brilho-higienizacao (43) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| no-brilho-higienizacao | 43 | ATTENTION | eisenfer-tubos-acos (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| papelemi-personalizados | 43 | ATTENTION | embalar-embalagens (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| simone-lacerda-vaz | 43 | ATTENTION | enoel-portas (43) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| angel-mix-brecho | 42 | ATTENTION | dlara-pizzaria (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| artesanatos-darleia-oliveira | 42 | ATTENTION | lk-alvenaria (42) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| dlara-pizzaria | 42 | ATTENTION | angel-mix-brecho (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-atelie-presentes | 42 | ATTENTION | mirassol-delicias-caseiras (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| heloa-gas | 42 | ATTENTION | dona-lucy-salgados (42) | SAME_FAMILY | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| mirassol-delicias-caseiras | 42 | ATTENTION | guaratuba-atelie-presentes (42) | SAME_FAMILY | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| centro-mega | 41 | ATTENTION | aguia-sul-sinalizacao (41) | SAME_FAMILY | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| confeitaria-chyrley | 41 | ATTENTION | acai-total-araucaria (41) | SAME_FAMILY | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| estrutura-nacional | 41 | ATTENTION | pinturas-nunes (41) | SAME_FAMILY | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| auto-socorro-dentinho | 40 | ACCEPTABLE | mimo-salgados-doces (40) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| bh-barreiro-marmitas | 40 | ACCEPTABLE | your-brutus-burguer (40) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| espaco-cih-luh | 39 | ACCEPTABLE | kitutes-na-mesa (39) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| manu-pasteis | 39 | ACCEPTABLE | miro-tech (39) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| arildo-madeiras | 38 | ACCEPTABLE | autoescola-aptos (38) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT | — |
| autoescola-aptos | 38 | ACCEPTABLE | arildo-madeiras (38) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| lolipa-arte-em-festas | 38 | ACCEPTABLE | confeitaria-sabor-da-realeza (38) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marido-de-aluguel | 38 | ACCEPTABLE | auto-socorro-dentinho (38) | DISTINCT | COVER_IS_LOGO, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| uberlandia-eletrica-residencial | 37 | ACCEPTABLE | bh-barreiro-marmitas (37) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| casa-nativa | 36 | ACCEPTABLE | guaratuba-oficina-nautica (36) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-oficina-nautica | 36 | ACCEPTABLE | casa-nativa (36) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| santos-montador-de-moveis | 36 | ACCEPTABLE | enoel-portas (36) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| mirassol-conserta-celular | 35 | ACCEPTABLE | mirassol-delicias-caseiras (35) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| rm-fretes | 35 | ACCEPTABLE | marido-de-aluguel (35) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| raphael-construcoes | 34 | ACCEPTABLE | ton-e-cor (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_PLACEHOLDER | — |
| ton-e-cor | 34 | ACCEPTABLE | raphael-construcoes (34) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | — | — |
| almeida-torres | 33 | ACCEPTABLE | estrutura-nacional (33) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| hbk-iluminacao-led | 32 | ACCEPTABLE | jc-revestimentos (32) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| jc-revestimentos | 32 | ACCEPTABLE | hbk-iluminacao-led (32) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| marmitaria-dom-diego | 31 | ACCEPTABLE | woodhouse-hamburgueres (31) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| pastelaria-route-66 | 31 | ACCEPTABLE | simone-lacerda-vaz (31) | DISTINCT | COVER_NO_FOCAL_POINT | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| beto-pasteis | 30 | ACCEPTABLE | reuse-house-brecho (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-sabores-da-baia | 30 | ACCEPTABLE | heloa-gas (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| premium-envelopamentos | 30 | ACCEPTABLE | jc-revestimentos (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| reuse-house-brecho | 30 | ACCEPTABLE | beto-pasteis (30) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| emporio-lelecute | 29 | ACCEPTABLE | assistencia-microondas-santos (29) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | LOGO_NO_CONTRAST_VARIANT | — |
| guaratuba-reparos-residenciais | 27 | ACCEPTABLE | bh-barreiro-marmitas (27) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT, LOGO_PLACEHOLDER | — |
| adhonep-curitiba | 26 | ACCEPTABLE | r_beauty (26) | DISTINCT | COVER_IS_SOCIAL_IMAGE, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| dyzpromo | 25 | ACCEPTABLE | marido-de-aluguel (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH, COVER_SEVERE_CROP | — | — |
| paraiso-do-hot-dog | 25 | ACCEPTABLE | confeitaria-chyrley (25) | DISTINCT | COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
| brecho-sao-francisco | 24 | ACCEPTABLE | toquinho-de-gente-brecho (24) | DISTINCT | COVER_MISSING, COVER_NO_FOCAL_POINT, COVER_RATIO_MISMATCH | LOGO_NO_CONTRAST_VARIANT | — |
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
