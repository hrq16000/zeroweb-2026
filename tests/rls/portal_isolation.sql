-- LOCAL DISPOSABLE FIXTURE ONLY; NOT a production CI/RLS homologation.
-- psql must use -v ON_ERROR_STOP=1. The fixture supplies synthetic users with
-- an intact membership FK; no auth.users writes or constraint removal here.
BEGIN;
DO $$ BEGIN
 IF current_setting('zeroweb.disposable_fixture', true) IS DISTINCT FROM 'on' THEN
  RAISE EXCEPTION 'BLOCKED: requires a local disposable fixture';
 END IF;
END $$;

CREATE TEMP TABLE isolation_context AS SELECT
 '11111111-1111-1111-1111-111111111111'::uuid AS user_a,
 '22222222-2222-2222-2222-222222222222'::uuid AS user_b,
 gen_random_uuid() AS portal_a, gen_random_uuid() AS portal_b;
GRANT SELECT ON isolation_context TO authenticated;

INSERT INTO public.portals(id, slug, name, is_default)
 SELECT portal_a, 'synthetic-' || portal_a, 'Synthetic A', false FROM isolation_context
 UNION ALL SELECT portal_b, 'synthetic-' || portal_b, 'Synthetic B', false FROM isolation_context;
INSERT INTO public.portal_members(user_id, portal_id, role)
 SELECT user_a, portal_a, 'portal_admin' FROM isolation_context
 UNION ALL SELECT user_b, portal_b, 'portal_admin' FROM isolation_context;
INSERT INTO public.lead_submissions(portal_id, name, email, source)
 SELECT portal_a, 'Synthetic A', 'a@example.invalid', 'synthetic' FROM isolation_context
 UNION ALL SELECT portal_b, 'Synthetic B', 'b@example.invalid', 'synthetic' FROM isolation_context;
INSERT INTO public.analytics_events(portal_id, event_name)
 SELECT portal_a, 'synthetic_a' FROM isolation_context
 UNION ALL SELECT portal_b, 'synthetic_b' FROM isolation_context;
INSERT INTO public.visitantes_rastreio(ip_hash, day, portal_id, path)
 SELECT 'synthetic-' || portal_a, CURRENT_DATE, portal_a, '/synthetic-a' FROM isolation_context
 UNION ALL SELECT 'synthetic-' || portal_b, CURRENT_DATE, portal_b, '/synthetic-b' FROM isolation_context;

CREATE FUNCTION pg_temp.as_user(subject uuid) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
 PERFORM set_config('request.jwt.claim.sub', subject::text, true);
 PERFORM set_config('request.jwt.claims', json_build_object('sub', subject, 'role', 'authenticated')::text, true);
 PERFORM set_config('role', 'authenticated', true);
END $$;
CREATE FUNCTION pg_temp.assert_blocked(statement text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE denied boolean := false;
BEGIN
 BEGIN
  EXECUTE statement;
 EXCEPTION WHEN insufficient_privilege THEN denied := true;
 END;
 -- Sentinel OUTSIDE the exception block. Success/FK/CHECK/network/syntax
 -- failures never count as a correct denial; only SQLSTATE 42501 does.
 IF NOT denied THEN RAISE EXCEPTION 'FAIL: cross-portal write succeeded'; END IF;
END $$;
CREATE FUNCTION pg_temp.assert_isolated(own_portal uuid, other_portal uuid) RETURNS void LANGUAGE plpgsql AS $$
DECLARE table_name text; own_count integer; other_count integer;
BEGIN
 FOREACH table_name IN ARRAY ARRAY['lead_submissions', 'analytics_events', 'visitantes_rastreio'] LOOP
  EXECUTE format('SELECT count(*) FROM public.%I WHERE portal_id = $1', table_name) INTO own_count USING own_portal;
  EXECUTE format('SELECT count(*) FROM public.%I WHERE portal_id = $1', table_name) INTO other_count USING other_portal;
  IF own_count <> 1 THEN RAISE EXCEPTION 'FAIL: own % fixture missing', table_name; END IF;
  IF other_count <> 0 THEN RAISE EXCEPTION 'FAIL: cross-portal % read', table_name; END IF;
 END LOOP;
 PERFORM pg_temp.assert_blocked(format('INSERT INTO public.lead_submissions(portal_id,name,email,source) VALUES (%L,''synthetic forbidden'',''forbidden@example.invalid'',''synthetic'')', other_portal));
 PERFORM pg_temp.assert_blocked(format('INSERT INTO public.analytics_events(portal_id,event_name) VALUES (%L,''synthetic forbidden'')', other_portal));
 PERFORM pg_temp.assert_blocked(format('INSERT INTO public.visitantes_rastreio(ip_hash,day,portal_id,path) VALUES (''synthetic-forbidden-' || other_portal || ''',CURRENT_DATE,%L,''/synthetic-forbidden'')', other_portal));
END $$;

SELECT pg_temp.as_user(user_a) FROM isolation_context;
SELECT pg_temp.assert_isolated(portal_a, portal_b) FROM isolation_context;
RESET ROLE;
SELECT pg_temp.as_user(user_b) FROM isolation_context;
SELECT pg_temp.assert_isolated(portal_b, portal_a) FROM isolation_context;
RESET ROLE;
ROLLBACK;