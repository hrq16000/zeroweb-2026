# 0WEB · Runbook de saída do Lovable Cloud (preflight sem mutação)

**Projeto:** `hrq16000/zeroweb-2026` · **Controle:** [Issue #469](https://github.com/hrq16000/zeroweb-2026/issues/469).
**Modo desta rodada:** somente preparação. NÃO houve export, novo banco, restore, DNS, Vercel env ou corte.

## O que está comprovado
- GitHub/Vercel Production e editor Lovable no mesmo commit em 31/10/2026: `48b4a8b9347bc2c68c4e8ab963c3ac6c5f08787a`. **Não prova** a versão servida pelo domínio `0web.com.br`.
- Lovable Cloud usa Supabase gerenciado, sem acesso administrativo independente pelo conector atual. `supabase/config.toml` declara um ref histórico que não está autorizado no conector; NÃO apontar o destino a esse ref.
- Último inventário de metadados da base Lovable: 133 tabelas `public`, 65 funções, 235 políticas, 77 triggers; 76 contas de autenticação, 2 buckets e 9 objetos Storage. São **referências observadas**, não números fixos nem prova de backup completo.
- Vercel lista apenas `OPENAI_API_KEY` em produção; `SUPABASE_SERVICE_ROLE_KEY` ausente. A captação de leads depende do backend e NÃO foi aprovada para troca de tráfego.

## Gate 0 — preparar export SEM comprometer a origem
1. O proprietário inicia o export oficial em Lovable: **More → Database → Manage → Settings → Export project data → Export data → Database → Export → Start export**. Baixar do **More → Storage**, em pasta privada sob seu controle. O export PostgreSQL é `.backup` (custom format, zstd), possivelmente dentro de ZIP. O conector disponível NÃO inicia este export.
2. Backup de Storage é separado: exportar **todos os arquivos reais**, ACLs e estrutura dos 2 buckets; banco armazena metadados, **não** os bytes dos arquivos.
3. Nunca colocar `.backup`, `.dump`, arquivos de Storage privados, tokens, senhas ou `.env` em commits, GitHub issues, PRs, chat ou CI público.
4. Guardar data/hora UTC de início e fim do export; enquanto houver novos leads, a cópia será desatualizada. Considerar retenção/export cadence antes da janela final.

## Gate 1 — analisar o arquivo OFFLINE, sem credenciais ou rede
Instalar ferramentas PostgreSQL com suporte a zstd e testar a versão. `pg_restore --list` examina o índice: NÃO executa SQL, não conecta a qualquer banco.

```sh
pg_restore --version
pg_restore --list /caminho/privado/export.backup > /caminho/privado/export.toc
node scripts/inspect-lovable-backup-toc.mjs --archive /caminho/privado/export.backup
# Alternativa para um índice já extraído:
node scripts/inspect-lovable-backup-toc.mjs --toc-file /caminho/privado/export.toc
node --test tests/infra/lovable-backup-toc.test.mjs
```

O script só relata totais e tabelas contratuais ausentes. **Não interpreta contagem do TOC como número de linhas ou estado do Storage**. Falha se faltar tabela/dados críticos; mesmo `ok=true` não libera restauração.

## Gate 2 — ambiente de destino (depende de projeto Supabase PROPRIETÁRIO autorizado)
1. Só após aprovação explícita de conta, região e custos, criar um projeto Supabase NOVO sob titularidade do usuário. Não usar projetos de terceiros ou o `config.toml` histórico. Configurar isolamento, acesso administrativo, backups, políticas de RLS e extensões compatíveis.
2. Fazer **ensaio num banco descartável do próprio destino**, com o `pg_restore --list` revisado por especialista. Escolher objetos/ordem com `pg_restore --use-list`; considerar `auth`, `storage`, roles, funções, ownership, extensions, seeds e `supabase/migrations/` para evitar aplicar DDL duas vezes.
3. NÃO rodar `pg_restore --clean`, `--create`, DROP/DDL nem `supabase db push` cegamente. O dump custom não se aplica via SQL editor. O script desta rodada NÃO contém comando de restauração.
4. Verificar quantitativos reais de tabelas, grants, RLS, functions, triggers, sequências, relações, registros, hashes de contas e objetos; exportar Storage separadamente e conferir checksums. Reconfigurar Auth/OAuth/SMTP, redirects e cron/webhooks/Edge Functions conforme uso real.
5. Usuários podem manter senhas se as contas/hash forem restauradas de forma compatível; sessões anteriores NÃO migram e exigem novo login. Testar login com conta de teste autorizada, jamais com dados reais extraídos em log.

## Gate 3 — backend Vercel sem afetar produção
- Em **Preview isolado**, configurar via secret manager `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (somente servidor), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (públicos) e integrações realmente ativas. Não habilitar service role no cliente.
- Rebuild obrigatório para variáveis VITE embutidas; nunca copiar valores para docs/CI. Testar healthcheck, SSR, autenticação/RLS, políticas, redirects, mídia, checkout e funil **lead salvo ANTES de WhatsApp** sem gravar leads fictícios no banco ativo. Verificar provedor WhatsApp, webhooks, secrets e jobs.
- Comparar `/servicos`, `/portfolio`, 96 portfólios, 301s, sitemap, canonical, robots e SEO do preview com domínio ativo. Nenhuma mudança de index ou DNS.

## Gate 4 — plano de cutover e rollback, somente após gates 0–3 aprovados
- **Janela controlada de congelamento de escritas** dos dois lados: pausar entradas de lead e jobs com comunicação adequada, backup final consistente, conciliar diferenças desde export, importar incremental/final, verificar 0 perda de leads; não fazer dual-write sem idempotência e validação.
- Com aprovação explícita para DNS e certificado, promover destino e testar app/login/SSL/cookies/301/SEO/leads no domínio; monitorar e manter origem para rollback.
- **Rollback exige estratégia de dados**, não apenas reverter DNS: os leads escritos após corte precisam reconciliar antes da volta.
- Não remover o backend original nem despublicar Lovable até concluir validação funcional e retenção de backup.

**Referências verificadas:**
- https://docs.lovable.dev/tips-tricks/external-deployment-hosting
- https://docs.lovable.dev/features/database-backups
- https://supabase.com/docs/guides/platform/migrating-within-supabase
- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore
