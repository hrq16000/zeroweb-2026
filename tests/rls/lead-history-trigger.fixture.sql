-- LOCAL DISPOSABLE DATABASE ONLY. Never run this fixture against Lovable Cloud.
-- The local runner substitutes -- APPLY_CANDIDATE with the reviewed candidate.
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
GRANT USAGE ON SCHEMA auth, public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated, service_role;

CREATE TABLE public.lead_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), status text DEFAULT 'new',
  source text, assignee text, last_interaction timestamptz, updated_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT ALL ON public.lead_submissions TO service_role;
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY parent_admin ON public.lead_submissions TO authenticated
  USING (auth.uid() = '11111111-1111-1111-1111-111111111111')
  WITH CHECK (auth.uid() = '11111111-1111-1111-1111-111111111111');

CREATE TABLE public.lead_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.lead_submissions(id) ON DELETE CASCADE,
  kind text NOT NULL, from_value text, to_value text, note text, actor text,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Reproduce the existing table grants and SELECT-deny policy exactly.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_history TO anon, authenticated;
GRANT ALL ON public.lead_history TO service_role;
ALTER TABLE public.lead_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY lead_history_locked ON public.lead_history FOR SELECT TO authenticated USING (false);

CREATE FUNCTION public.leads_after_change() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.lead_history(lead_id, kind, to_value, note, actor)
    VALUES (NEW.id, 'created', NEW.status, COALESCE('Origem: ' || NEW.source, 'Lead criado'), 'system');
    IF NEW.assignee IS NOT NULL THEN
      INSERT INTO public.lead_history(lead_id, kind, to_value, actor) VALUES (NEW.id, 'assignment', NEW.assignee, 'system');
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.lead_history(lead_id, kind, from_value, to_value, actor)
    VALUES (NEW.id, 'status_change', OLD.status, NEW.status, 'admin');
    NEW.last_interaction := now();
  END IF;
  IF NEW.assignee IS DISTINCT FROM OLD.assignee THEN
    INSERT INTO public.lead_history(lead_id, kind, from_value, to_value, actor)
    VALUES (NEW.id, 'assignment', OLD.assignee, NEW.assignee, 'admin');
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_leads_after_insert AFTER INSERT ON public.lead_submissions
  FOR EACH ROW EXECUTE FUNCTION public.leads_after_change();
CREATE TRIGGER trg_leads_before_update BEFORE UPDATE ON public.lead_submissions
  FOR EACH ROW EXECUTE FUNCTION public.leads_after_change();
INSERT INTO public.lead_submissions(id, source)
  VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'synthetic');

-- BEFORE: authorized parent UPDATE must reproduce the real history failure.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
DO $$
DECLARE denied boolean := false;
BEGIN
  BEGIN
    UPDATE public.lead_submissions SET status = 'em_atendimento' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'BEFORE did not reproduce history RLS failure'; END IF;
END;
$$;
RESET ROLE;

-- APPLY_CANDIDATE

-- AFTER: authorized update persists and appends exactly one history entry.
SET ROLE authenticated;
UPDATE public.lead_submissions SET status = 'em_atendimento' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
DO $$
DECLARE count_rows int;
BEGIN
  SELECT count(*) INTO count_rows FROM public.lead_history;
  IF count_rows <> 0 THEN RAISE EXCEPTION 'Admin directly reads locked history'; END IF;
  BEGIN
    INSERT INTO public.lead_history(lead_id, kind, actor)
      VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'status_change', 'forged');
    RAISE EXCEPTION 'Admin forged history';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;
DO $$
BEGIN
  IF (SELECT status FROM public.lead_submissions WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') <> 'em_atendimento' THEN
    RAISE EXCEPTION 'Authorized status not persisted';
  END IF;
  IF (SELECT count(*) FROM public.lead_history WHERE kind = 'status_change' AND from_value = 'new' AND to_value = 'em_atendimento' AND actor = 'admin') <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one authentic status history row';
  END IF;
  IF has_function_privilege('anon', 'public.leads_after_change()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.leads_after_change()', 'EXECUTE') THEN
    RAISE EXCEPTION 'Trigger function remains callable by public roles';
  END IF;
END;
$$;

-- A regular authenticated subject cannot mutate the parent lead or forge history.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
DO $$
DECLARE affected int;
BEGIN
  UPDATE public.lead_submissions SET status = 'forged' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Ordinary subject updated protected lead'; END IF;
  BEGIN
    INSERT INTO public.lead_history(lead_id, kind) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'created');
    RAISE EXCEPTION 'Ordinary subject forged history';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;
SET ROLE anon;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.lead_history) <> 0 THEN RAISE EXCEPTION 'Anonymous history disclosure'; END IF;
  BEGIN
    INSERT INTO public.lead_history(lead_id, kind) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'created');
    RAISE EXCEPTION 'Anonymous history forgery';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;
SELECT 'PASS local history candidate: reproduction, persistence, single audit, no disclosure/forgery, no public EXECUTE' AS result;