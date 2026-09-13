-- Reforço: visitante anônimo só pode CRIAR pedido; nunca ler, alterar ou apagar.
REVOKE ALL ON public.dynamic_form_leads FROM anon;
GRANT INSERT ON public.dynamic_form_leads TO anon;

REVOKE ALL ON public.lead_submissions FROM anon;
GRANT INSERT ON public.lead_submissions TO anon;

REVOKE ALL ON public.lead_delivery_ledger FROM anon;
REVOKE ALL ON public.visitor_funnel_sessions FROM anon;

-- Autenticado sem papel de admin continua bloqueado pelas policies;
-- remove apenas privilégios destrutivos que nenhuma policy usa.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.dynamic_form_leads FROM authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.lead_submissions FROM authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER, INSERT, UPDATE, DELETE ON public.lead_delivery_ledger FROM authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER, INSERT, UPDATE, DELETE ON public.visitor_funnel_sessions FROM authenticated;

-- Serviço interno (servidor) mantém acesso completo: é ele que grava os pedidos.
GRANT ALL ON public.dynamic_form_leads TO service_role;
GRANT ALL ON public.lead_submissions TO service_role;
GRANT ALL ON public.lead_delivery_ledger TO service_role;
GRANT ALL ON public.visitor_funnel_sessions TO service_role;