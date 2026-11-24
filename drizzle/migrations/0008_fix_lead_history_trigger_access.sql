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