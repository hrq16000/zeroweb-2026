-- 1. Column-level UPDATE grants: owners cannot touch moderation/metric columns
REVOKE UPDATE ON public.companies FROM authenticated;
GRANT UPDATE (slug, trade_name, legal_name, cnpj, logo_url, cover_url, description, phone, whatsapp, email, website, city, state, service_regions, categories, social, updated_at) ON public.companies TO authenticated;

REVOKE UPDATE ON public.providers FROM authenticated;
GRANT UPDATE (slug, display_name, headline, bio, avatar_url, cover_url, phone, whatsapp, email, city, state, service_regions, specialties, social, updated_at) ON public.providers TO authenticated;

REVOKE UPDATE ON public.partners FROM authenticated;
GRANT UPDATE (name, company, email, email_lower, phone, city, state, areas, specialties, bio, notes, updated_at) ON public.partners TO authenticated;

GRANT ALL ON public.companies TO service_role;
GRANT ALL ON public.providers TO service_role;
GRANT ALL ON public.partners TO service_role;

-- 2. Audit log: no direct client inserts
DROP POLICY IF EXISTS audit_insert ON public.audit_logs;
REVOKE INSERT, UPDATE, DELETE ON public.audit_logs FROM authenticated, anon;
GRANT ALL ON public.audit_logs TO service_role;