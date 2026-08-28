DROP POLICY IF EXISTS "Allow anon insert analytics_events" ON public.analytics_events;
CREATE POLICY "Allow anon insert analytics_events"
  ON public.analytics_events FOR INSERT TO anon, authenticated
  WITH CHECK (event_name IS NOT NULL AND length(event_name) <= 128);

DROP POLICY IF EXISTS "Allow anon insert wa_funnel_sessions" ON public.wa_funnel_sessions;
CREATE POLICY "Allow anon insert wa_funnel_sessions"
  ON public.wa_funnel_sessions FOR INSERT TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT INSERT ON public.wa_funnel_sessions TO anon, authenticated;