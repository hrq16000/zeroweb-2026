-- MODEL ONLY, local disposable PostgreSQL. Not the real/managed auth schema.
BEGIN;
CREATE ROLE authenticated;
CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
 SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
GRANT USAGE ON SCHEMA auth, public TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated, service_role;
CREATE TABLE public.fixture_users (id uuid PRIMARY KEY);
GRANT SELECT ON public.fixture_users TO authenticated;
GRANT ALL ON public.fixture_users TO service_role;
ALTER TABLE public.fixture_users ENABLE ROW LEVEL SECURITY;
INSERT INTO public.fixture_users VALUES ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222');
CREATE TABLE public.portals (id uuid PRIMARY KEY, slug text UNIQUE, name text, is_default boolean);
GRANT SELECT ON public.portals TO authenticated;
GRANT ALL ON public.portals TO service_role;
ALTER TABLE public.portals ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.portal_members (
 user_id uuid, portal_id uuid REFERENCES public.portals(id), role text,
 CONSTRAINT portal_members_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.fixture_users(id)
);
GRANT SELECT ON public.portal_members TO authenticated;
GRANT ALL ON public.portal_members TO service_role;
ALTER TABLE public.portal_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_membership ON public.portal_members FOR SELECT TO authenticated USING(user_id = auth.uid());
CREATE FUNCTION public.fixture_is_portal_member(portal uuid) RETURNS boolean
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public AS $$
 SELECT EXISTS(SELECT 1 FROM public.portal_members WHERE portal_id = portal AND user_id = auth.uid())
$$;
CREATE TABLE public.lead_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), portal_id uuid REFERENCES public.portals(id), name text, email text, source text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT ALL ON public.lead_submissions TO service_role;
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY fixture_portal_leads ON public.lead_submissions TO authenticated
 USING(public.fixture_is_portal_member(portal_id)) WITH CHECK(public.fixture_is_portal_member(portal_id));
CREATE TABLE public.analytics_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), portal_id uuid REFERENCES public.portals(id), event_name text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY fixture_portal_events ON public.analytics_events TO authenticated
 USING(public.fixture_is_portal_member(portal_id)) WITH CHECK(public.fixture_is_portal_member(portal_id));
CREATE TABLE public.visitantes_rastreio (
 ip_hash text, day date, portal_id uuid REFERENCES public.portals(id), path text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visitantes_rastreio TO authenticated;
GRANT ALL ON public.visitantes_rastreio TO service_role;
ALTER TABLE public.visitantes_rastreio ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX fixture_visitantes_path ON public.visitantes_rastreio(ip_hash, day, (COALESCE(path, '')));
CREATE POLICY fixture_portal_tracking ON public.visitantes_rastreio TO authenticated
 USING(public.fixture_is_portal_member(portal_id)) WITH CHECK(public.fixture_is_portal_member(portal_id));
SELECT set_config('zeroweb.disposable_fixture', 'on', false);
COMMIT;

-- RUN_LEGACY_TEST

DO $$ BEGIN
 IF (SELECT count(*) FROM public.portals) <> 0 OR (SELECT count(*) FROM public.lead_submissions) <> 0
 OR (SELECT count(*) FROM public.analytics_events) <> 0 OR (SELECT count(*) FROM public.visitantes_rastreio) <> 0
 THEN RAISE EXCEPTION 'FAIL: synthetic fixture not rolled back'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'portal_members_user_id_fkey') THEN
  RAISE EXCEPTION 'FAIL: FK was removed'; END IF;
END $$;
SELECT 'PASS: legacy SQL positive/negative isolation with intact FK and rollback' AS result;