CREATE OR REPLACE FUNCTION public.is_active_provider(_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ select exists(select 1 from providers where id=_id and status='active') $$;
CREATE OR REPLACE FUNCTION public.is_active_company(_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ select exists(select 1 from companies where id=_id and status='active') $$;

DROP POLICY IF EXISTS "pc public read" ON public.provider_categories;
CREATE POLICY "pc public read" ON public.provider_categories FOR SELECT USING (public.is_active_provider(provider_id) OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "portfolio public read" ON public.provider_portfolio;
CREATE POLICY "portfolio public read" ON public.provider_portfolio FOR SELECT USING (public.is_active_provider(provider_id) OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "cc public read" ON public.company_categories;
CREATE POLICY "cc public read" ON public.company_categories FOR SELECT USING (public.is_active_company(company_id) OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "offers_read" ON public.offers;
CREATE POLICY "offers_read" ON public.offers FOR SELECT USING (active = true OR public.is_super_admin(auth.uid()));

-- consent_audit_log is only written server-side with the service role
DROP POLICY IF EXISTS "consent_audit_anyone_insert" ON public.consent_audit_log;

DROP POLICY IF EXISTS "anon_insert_gps_consent" ON public.gps_consent_log;
CREATE POLICY "anon_insert_gps_consent" ON public.gps_consent_log FOR INSERT TO anon, authenticated
WITH CHECK (decision IN ('accepted','declined','dismissed') AND coalesce(length(visitor_id),0) <= 100 AND coalesce(length(session_id),0) <= 100 AND coalesce(length(page),0) <= 500 AND coalesce(length(user_agent),0) <= 500);

DROP POLICY IF EXISTS "anon_insert_waf" ON public.wa_funnel_sessions;
DROP POLICY IF EXISTS "auth_insert_waf" ON public.wa_funnel_sessions;
DROP POLICY IF EXISTS "Allow anon insert wa_funnel_sessions" ON public.wa_funnel_sessions;
CREATE POLICY "Allow anon insert wa_funnel_sessions" ON public.wa_funnel_sessions FOR INSERT TO anon, authenticated
WITH CHECK (session_id IS NOT NULL AND length(session_id) <= 100 AND completed = false AND completed_at IS NULL AND current_step = 0 AND total_steps BETWEEN 0 AND 50 AND portal_id IS NULL);