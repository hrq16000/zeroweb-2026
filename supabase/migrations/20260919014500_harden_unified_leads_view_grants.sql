-- Least privilege for the admin-oriented unified leads view.
-- The view uses security_invoker=true, but anonymous callers do not need any
-- direct grant on it. Server-side lead screens query via service_role after
-- an explicit admin check.
REVOKE ALL ON TABLE public.vw_unified_leads FROM anon;
REVOKE ALL ON TABLE public.vw_unified_leads FROM authenticated;
GRANT SELECT ON TABLE public.vw_unified_leads TO authenticated;
GRANT SELECT ON TABLE public.vw_unified_leads TO service_role;
