CREATE TABLE IF NOT EXISTS public.quiz_pixel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  quiz_key text NOT NULL,
  step_key text NOT NULL DEFAULT '',
  step_index integer NOT NULL DEFAULT 0,
  event_type text NOT NULL,
  answer_label text,
  page_path text,
  lead_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_pixel_events_created_idx ON public.quiz_pixel_events (created_at DESC);
CREATE INDEX IF NOT EXISTS quiz_pixel_events_session_idx ON public.quiz_pixel_events (session_key);
CREATE INDEX IF NOT EXISTS quiz_pixel_events_quiz_idx ON public.quiz_pixel_events (quiz_key, step_index);

GRANT INSERT ON public.quiz_pixel_events TO anon, authenticated;
GRANT ALL ON public.quiz_pixel_events TO service_role;

ALTER TABLE public.quiz_pixel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quiz_pixel_events_insert_public ON public.quiz_pixel_events;
CREATE POLICY quiz_pixel_events_insert_public
  ON public.quiz_pixel_events FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(session_key) BETWEEN 8 AND 64
    AND length(quiz_key) BETWEEN 2 AND 64
    AND event_type IN ('quiz_view','step_view','answer_click','step_complete','abandon','submit','whatsapp_intent','whatsapp_open')
    AND (answer_label IS NULL OR length(answer_label) <= 120)
    AND (page_path IS NULL OR length(page_path) <= 200)
  );
