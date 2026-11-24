CREATE TABLE public.support_agents (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 display_name text NOT NULL,
 preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
 is_active boolean NOT NULL DEFAULT true,
 created_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_agents TO authenticated;
GRANT ALL ON public.support_agents TO service_role;
ALTER TABLE public.support_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY support_agents_read ON public.support_agents FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_super(auth.uid()));
CREATE POLICY support_agents_admin_write ON public.support_agents FOR ALL TO authenticated USING (public.is_admin_or_super(auth.uid())) WITH CHECK (public.is_admin_or_super(auth.uid()));