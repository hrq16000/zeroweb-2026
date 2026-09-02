import { createFileRoute } from '@tanstack/react-router';

const REQUIRED_TABLES = [
  'projects',
  'support_tickets',
  'notifications',
  'profiles',
  'user_roles',
  'lead_submissions',
  'services',
];

export const Route = createFileRoute('/api/public/health-db')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        const url = new URL(request.url);
        const wantsReload = url.searchParams.get('reload') === '1';

        // O reload do cache de schema é privilegiado: exige o mesmo segredo
        // usado pelos hooks de manutenção. Sem ele, apenas o health-check roda.
        let reload = false;
        if (wantsReload) {
          const { requireCronSecret } = await import('./hooks/_cron-auth');
          const unauth = requireCronSecret(request);
          if (unauth) return unauth;
          reload = true;
          await supabaseAdmin.rpc('pgrst_reload_schema' as never);
        }


        const { data, error } = await supabaseAdmin.rpc(
          'db_required_tables_check' as never,
          { _tables: REQUIRED_TABLES } as never,
        );

        if (error) {
          return Response.json(
            { ok: false, error: error.message, required: REQUIRED_TABLES },
            { status: 500 },
          );
        }

        const rows = (data as Array<{ tbl: string; present: boolean }>) ?? [];
        const missing = rows.filter((r) => !r.present).map((r) => r.tbl);
        const ok = missing.length === 0;

        return Response.json(
          {
            ok,
            checked_at: new Date().toISOString(),
            required: REQUIRED_TABLES,
            missing,
            reloaded: reload,
          },
          { status: ok ? 200 : 503, headers: { 'cache-control': 'no-store' } },
        );
      },
    },
  },
});
