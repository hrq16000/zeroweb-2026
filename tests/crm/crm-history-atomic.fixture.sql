-- LOCAL DISPOSABLE DATABASE ONLY; all records and roles are synthetic.
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role BYPASSRLS;
CREATE TABLE public.lead_submissions (
  id uuid PRIMARY KEY, portal_id uuid, status text,
  last_interaction timestamptz NOT NULL DEFAULT '2000-01-01T00:00:00Z'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT ALL ON public.lead_submissions TO service_role;
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.lead_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id uuid REFERENCES public.lead_submissions(id),
  kind text NOT NULL, note text, actor text
);
GRANT SELECT, INSERT ON public.lead_history TO authenticated;
GRANT ALL ON public.lead_history TO service_role;
ALTER TABLE public.lead_history ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO service_role, authenticated, anon;
INSERT INTO public.lead_submissions(id, portal_id, status) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'novo'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'novo');

-- APPLY_CANDIDATE

SET ROLE service_role;
SELECT public.crm_add_history_atomic('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'note', 'synthetic note', 'fixture');
DO $$ BEGIN
 IF (SELECT count(*) FROM public.lead_history WHERE lead_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND note = 'synthetic note') <> 1
    OR (SELECT last_interaction FROM public.lead_submissions WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') = '2000-01-01T00:00:00Z'::timestamptz
 THEN RAISE EXCEPTION 'FAIL: note and interaction must persist together'; END IF;
END $$;
RESET ROLE;

-- Force UPDATE failure AFTER the history INSERT; exception must roll both back.
CREATE FUNCTION public.fixture_fail_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'synthetic update rejection' USING ERRCODE = '23514'; END $$;
CREATE TRIGGER synthetic_update_failure BEFORE UPDATE ON public.lead_submissions
 FOR EACH ROW EXECUTE FUNCTION public.fixture_fail_update();
SET ROLE service_role;
DO $$ DECLARE denied boolean := false; BEGIN
 BEGIN
  PERFORM public.crm_add_history_atomic('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'note', 'must rollback', 'fixture');
 EXCEPTION WHEN check_violation THEN denied := true; END;
 IF NOT denied THEN RAISE EXCEPTION 'FAIL: update failure was swallowed'; END IF;
 IF (SELECT count(*) FROM public.lead_history WHERE lead_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') <> 0
 OR (SELECT last_interaction FROM public.lead_submissions WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') <> '2000-01-01T00:00:00Z'::timestamptz
 THEN RAISE EXCEPTION 'FAIL: partially persisted interaction'; END IF;
END $$;
RESET ROLE;
DROP TRIGGER synthetic_update_failure ON public.lead_submissions;

-- Force INSERT failure; interaction must remain unchanged too.
CREATE FUNCTION public.fixture_fail_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'synthetic history rejection' USING ERRCODE = '23514'; END $$;
CREATE TRIGGER synthetic_history_failure BEFORE INSERT ON public.lead_history
 FOR EACH ROW EXECUTE FUNCTION public.fixture_fail_history();
SET ROLE service_role;
DO $$ DECLARE denied boolean := false; BEGIN
 BEGIN
  PERFORM public.crm_add_history_atomic('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'note', 'must rollback', 'fixture');
 EXCEPTION WHEN check_violation THEN denied := true; END;
 IF NOT denied OR (SELECT last_interaction FROM public.lead_submissions WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') <> '2000-01-01T00:00:00Z'::timestamptz
 THEN RAISE EXCEPTION 'FAIL: failed history changed interaction'; END IF;
END $$;
RESET ROLE;
DROP TRIGGER synthetic_history_failure ON public.lead_history;

-- Five terminal states: no new note, no changed timestamp, no reopened lead.
DO $$ DECLARE terminal text; denied boolean; BEGIN
 FOREACH terminal IN ARRAY ARRAY['fechado', 'perdido', 'arquivado', 'won', 'lost'] LOOP
  UPDATE public.lead_submissions SET status = terminal WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  denied := false;
  BEGIN
   PERFORM public.crm_add_history_atomic('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'note', 'terminal forbidden', 'fixture');
  EXCEPTION WHEN object_not_in_prerequisite_state THEN denied := true; END;
  IF NOT denied OR (SELECT status FROM public.lead_submissions WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') <> terminal
  OR (SELECT last_interaction FROM public.lead_submissions WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') <> '2000-01-01T00:00:00Z'::timestamptz
  OR (SELECT count(*) FROM public.lead_history WHERE lead_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') <> 0
  THEN RAISE EXCEPTION 'FAIL: terminal % mutated', terminal; END IF;
 END LOOP;
END $$;
SET ROLE service_role;
DO $$ DECLARE denied boolean := false; BEGIN
 BEGIN
  PERFORM public.crm_add_history_atomic('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'note', 'wrong portal', 'fixture');
 EXCEPTION WHEN no_data_found THEN denied := true; END;
 IF NOT denied THEN RAISE EXCEPTION 'FAIL: cross-portal note'; END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
 IF has_function_privilege('anon', 'public.crm_add_history_atomic(uuid,uuid,text,text,text)', 'EXECUTE')
 OR has_function_privilege('authenticated', 'public.crm_add_history_atomic(uuid,uuid,text,text,text)', 'EXECUTE')
 THEN RAISE EXCEPTION 'FAIL: atomic writer publicly callable'; END IF;
 IF (SELECT count(*) FROM public.lead_history) <> 1 THEN RAISE EXCEPTION 'FAIL: extra history'; END IF;
END $$;
SELECT 'PASS: atomic note, rollback, terminals, portal and restricted execution' AS result;