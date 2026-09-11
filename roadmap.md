# Roadmap — trabalhos ativos

## P0 Careca's — contato e mídia
- [x] Remover telefone clicável e confirmar todos os CTAs no funil próprio
- [x] Remover a placa da landing e aplicar mídia real do enrichment com atribuição
- [x] Endurecer CONTACT_FUNNEL_GATE e MEDIA_PURPOSE_GATE com regressões
- [x] Validar 390px, 768px, desktop, build e testes
- [ ] Publicar e executar smoke em produção

# Migração S&S Construções → /portfolio/sscons (issue #60)

## Concluído
- [x] Assets: 8 originais preservados em `public/images/sscons/` + derivados (webp, capa, social, logo BRAND_COMPOSITION)
- [x] Componente isolado `src/components/site/SsConsPage.tsx` (hero, serviços, galeria + lightbox, institucional, contato/funil, rodapé)
- [x] Rota compartilhada: lazy import, branch, head/JSON-LD
- [x] Registros canônicos (clients, catalog, assets, keys, registry, share-copy, funnel-context, motion, cover-plan/review, brand-review, global-config)
- [x] Arquivos gerados (quiz-configs, admin-seed, cover-status, experience-levels)
- [x] Migration `funnel-sscons` (`supabase/migrations/20260906045759_*.sql`)
- [x] Testes focados (`tests/portfolio/sscons-migration.test.ts`) + inventário 68→69
- [x] Gates estáticos, originality, experience, privacy, typecheck
- [x] QA em browser (1440/390/reduced-motion, lightbox teclado/ESC, CTA)
- [x] Relatório `docs/reports/PORTFOLIO-SSCONS-MIGRATION-2026-09-06.md` + `docs/skills/CHANGELOG.md`

## Pronto para a próxima sessão
- [ ] Confirmar build + `validate:client-privacy` sobre `dist/` no workflow `portfolio-gates.yml` (PR da branch de edição, mencionando #60)
- [ ] Smoke em produção de `/portfolio/sscons` após publicação (200, OG, JSON-LD, funil)

## Pendências externas
- Número oficial de WhatsApp da S&S (estado `NOT_CONFIGURED` até recebimento)
- Depoimentos só com fonte auditável (não migrados)
- Direitos das fotos do hero (pessoas identificáveis) — confirmar com o cliente ou substituir por material oficial
## Capas autorais — lote prioritário
- [x] Corrigir a composição vazia da capa Route 66 com pastel e café
- [x] Registrar focal point e fonte dedicada para Route 66, Pinturas Nunes, BTB, Easy Clean e Salão da Márcia
- [x] Validar capas, originalidade e fronteiras
- [x] Validar testes e build final
- [x] Publicação agendada após todos os gates passarem

## Capas reais — prioridade por visitas
- [x] Cruzar pendências editoriais com `portfolio_view` dos últimos 90 dias
- [x] Substituir a composição provisória da Route 66 pela foto real do interior
- [x] Criar capa editorial da Estrutura Nacional com a foto real tratada da sede
- [ ] Continuar somente quando houver foto oficial verificável e segura para cada cliente pendente

