# Roadmap — Migração S&S Construções → /portfolio/sscons (issue #60)

## Em andamento
- [ ] Assets: 8 originais preservados em `public/images/sscons/` + derivados (webp, capa, social, logo BRAND_COMPOSITION)
- [ ] Componente isolado `src/components/site/SsConsPage.tsx` (hero, serviços, galeria + lightbox, institucional, contato/funil, rodapé)
- [ ] Rota compartilhada: lazy import, branch, head/JSON-LD/fonte Playfair
- [ ] Registros canônicos (clients, catalog, assets, keys, registry, share-copy, funnel-context, motion, cover-plan/review)
- [ ] Arquivos gerados (quiz-configs, admin-seed, cover-status, experience-levels)
- [ ] Migration `funnel-sscons`
- [ ] Testes focados (`tests/portfolio/sscons.test.ts`)
- [ ] Gates: boundaries, scaffold, catalog, meta, perf, originality, experience, privacy, typecheck, bun test, build
- [ ] QA em browser (390/768/1440, reduced-motion, lightbox teclado/ESC, CTA)
- [ ] Relatório `docs/reports/PORTFOLIO-SSCONS-MIGRATION-2026-09-06.md` + `docs/skills/CHANGELOG.md`

## Pendências externas
- Número oficial de WhatsApp da S&S (estado `NOT_CONFIGURED` até recebimento)
- Depoimentos só com fonte auditável (não migrados)
- Abertura do PR em branch própria mencionando #60 (git é gerenciado pela plataforma)
