# R10/10 — consolidação e publicação controlada

Escopo autorizado: estabilizar e publicar o que estiver apto, sem novos projetos, sem Max Lovable, sem alterações de DNS, dados, contratos comerciais ou redução de gates. R9 #565 mantida na mesma branch. Base `fa26ec28808babca950832cbcaa20ec6c8ccdb80`; candidato R9 `f0cbb028379182533e75ad209e8bd9347a04b153`. Diretriz anti-genérica de #563 incorporada em AGENTS.md e docs/skills/ANTI_GENERIC_EXPERIENCE.md sem tocar dependências ou runtime adicional.

## Correções objetivas da 0WEB
- `mergeProject`: bloqueios versionados de aprovação técnica/comercial prevalecem sobre overrides obsoletos de publicação. Preservar arquivado e demais campos, sem mudar catálogo, estado comercial ou dados existentes. Testes mantidos e adicionados.
- `portfolio-cover-status.json`: regenerado pela ferramenta oficial (106 projetos, 51 válidos, 55 pendentes; a existência de pendência de capa não é aprovada pela regeneração).
- `portfolio-project-dates.json`: somente Garagem & Girassol recebe data real do histórico Git. Todos os arquivos dedicados foram adicionados em `bb8e969ce546dbc32f52d7c50ac053c8c7e4b5c8`, autoria 2026-11-26T21:41:11-03:00 (2026-11-27T00:41:11.000Z). Histórico aprofundado em 30 commits antes da criação e verificação dos paths; não inventar data, não reordenar o inventário.
- Angel Mix: `sizes="100vw"` compatível com hero de largura integral, mantendo variantes responsivas existentes e prioridade do LCP.
- Gate focal: 44/44; suíte geral 1313 pass, 6 skip por ambiente, 0 fail. Datas 107/107 incluindo standalone; cover-status --check PASS. Scope visual oficial resolve angel-mix-brecho, dlara-pizzaria, r_beauty, rj-servicos-drywall; nenhum limiar/baseline aprovado artificialmente.

## R3 e R9
Não incorporar silenciosamente o diff antigo de #561: CI anterior falhou com 41 divergências visuais no gate global e Lighthouse; a proposta permanece isolada em sua própria branch. R9 mantém as três identidades, testes e imagens de evidência. Validação de SSR, Lighthouse, funis e regressão deve ocorrer no CI desta versão antes de release. O deploy Vercel verificado no início de R10 para 0WEB está em bb8e969... e o domínio público na R9 mostrou 404 para três slugs; não confundir alias e READY com comprovação de disponibilidade de todos os portfólios. Nenhum status de catálogo alterado.

## Produção já confirmada no início da rodada
| Projeto | Host | SHA | Vercel deployment |
| --- | --- | --- | --- |
| Encontre um Técnico | www.encontreumtecnico.com.br | 5f4e4c0f45e4280dd12d625f819c817f2e598723 | dpl_BioC3gPQCCMLKq9aVrJ7xKbvWstg |
| Encontre Um | encontreum.online | 273eebad76dc1160a4f4b567575404fde7cc859a | dpl_6KHMwdZYsFh4J91qmmzQWGDCKWXz |
| MyHostVIP | myhostvip.vercel.app | cdc4636d1929c4f27d1b4872d46ecee02e28d80d | dpl_9hPtkiWiBPVgr1wwqk2vhuo6hjeU |
| PapeLemi | www.papelemi.com.br | 972ec096f293362789f573c24a92155e999f079b | dpl_D1Sq8hrRVuzoJvpHqq3jkghtkkRx |

Técnico Curitiba 2026 #15 (CI Security/Internal links/ci PASS) integrado somente docs em 5657d9440f10c846ae948363ffc3d2a0b8bbfd9f. Não declarar alteração pública de UI por merge documental.
