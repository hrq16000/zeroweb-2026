CREATE TABLE IF NOT EXISTS public.ops_job_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job text NOT NULL,
  status text NOT NULL DEFAULT 'running',
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  duration_ms integer,
  error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ops_job_runs_job_started_idx ON public.ops_job_runs (job, started_at DESC);

CREATE TABLE IF NOT EXISTS public.ops_job_control (
  job text PRIMARY KEY,
  paused boolean NOT NULL DEFAULT false,
  consecutive_failures integer NOT NULL DEFAULT 0,
  circuit_open_until timestamptz,
  running_since timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ops_job_runs TO authenticated;
GRANT ALL ON public.ops_job_runs TO service_role;
GRANT SELECT ON public.ops_job_control TO authenticated;
GRANT ALL ON public.ops_job_control TO service_role;

ALTER TABLE public.ops_job_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_job_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ops_job_runs_admin_read" ON public.ops_job_runs
  FOR SELECT TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "ops_job_control_admin_read" ON public.ops_job_control
  FOR SELECT TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE OR REPLACE FUNCTION public.ops_job_try_start(_job text, _stale_seconds integer DEFAULT 900)
RETURNS TABLE(allowed boolean, reason text, run_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ctl public.ops_job_control%ROWTYPE;
  new_run uuid;
BEGIN
  INSERT INTO public.ops_job_control (job) VALUES (_job)
  ON CONFLICT (job) DO NOTHING;

  SELECT * INTO ctl FROM public.ops_job_control WHERE job = _job FOR UPDATE;

  IF ctl.paused THEN
    RETURN QUERY SELECT false, 'paused'::text, NULL::uuid;
    RETURN;
  END IF;

  IF ctl.circuit_open_until IS NOT NULL AND ctl.circuit_open_until > now() THEN
    RETURN QUERY SELECT false, 'circuit_open'::text, NULL::uuid;
    RETURN;
  END IF;

  IF ctl.running_since IS NOT NULL AND ctl.running_since > now() - make_interval(secs => _stale_seconds) THEN
    RETURN QUERY SELECT false, 'already_running'::text, NULL::uuid;
    RETURN;
  END IF;

  INSERT INTO public.ops_job_runs (job, status) VALUES (_job, 'running')
  RETURNING id INTO new_run;

  UPDATE public.ops_job_control
     SET running_since = now(), updated_at = now()
   WHERE job = _job;

  RETURN QUERY SELECT true, 'ok'::text, new_run;
END;
$$;

CREATE OR REPLACE FUNCTION public.ops_job_finish(
  _run_id uuid,
  _status text,
  _metadata jsonb DEFAULT '{}'::jsonb,
  _error text DEFAULT NULL,
  _failure_threshold integer DEFAULT 3,
  _cooldown_seconds integer DEFAULT 3600
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jobname text;
BEGIN
  UPDATE public.ops_job_runs
     SET status = _status,
         finished_at = now(),
         duration_ms = GREATEST(0, (EXTRACT(EPOCH FROM (now() - started_at)) * 1000)::int),
         metadata = COALESCE(_metadata, '{}'::jsonb),
         error = _error
   WHERE id = _run_id
   RETURNING job INTO jobname;

  IF jobname IS NULL THEN
    RETURN;
  END IF;

  IF _status = 'ok' THEN
    UPDATE public.ops_job_control
       SET running_since = NULL, consecutive_failures = 0,
           circuit_open_until = NULL, updated_at = now()
     WHERE job = jobname;
  ELSE
    UPDATE public.ops_job_control
       SET running_since = NULL,
           consecutive_failures = consecutive_failures + 1,
           circuit_open_until = CASE
             WHEN consecutive_failures + 1 >= _failure_threshold
               THEN now() + make_interval(secs => _cooldown_seconds)
             ELSE circuit_open_until END,
           updated_at = now()
     WHERE job = jobname;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.ops_job_try_start(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ops_job_finish(uuid, text, jsonb, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ops_job_try_start(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.ops_job_finish(uuid, text, jsonb, text, integer, integer) TO service_role;