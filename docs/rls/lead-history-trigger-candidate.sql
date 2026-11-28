-- PREPARED ONLY: not an applied migration. Review before promoting into migrations.
-- Keep existing lead_history SELECT-deny policy and parent lead_submissions RLS.
-- A trigger needs to append history even when its caller cannot directly do so.
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE oid = 'public.leads_after_change()'::regprocedure
      AND prorettype = 'trigger'::regtype
      AND pg_get_userbyid(proowner) = 'postgres'
  ) THEN
    RAISE EXCEPTION 'Unexpected lead history trigger owner/type; review required';
  END IF;
END;
$$;

ALTER FUNCTION public.leads_after_change() SECURITY DEFINER;
ALTER FUNCTION public.leads_after_change() SET search_path = pg_catalog, public;
REVOKE EXECUTE ON FUNCTION public.leads_after_change() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.leads_after_change() TO service_role;

-- No direct INSERT/SELECT grants or new policies; no changes to function body,
-- triggers, lead values, membership helpers, auth providers, or agent roles.
COMMIT;