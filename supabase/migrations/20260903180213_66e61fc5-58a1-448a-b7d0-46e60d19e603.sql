-- 1. LOCAL PAGES ------------------------------------------------------------
CREATE TABLE public.local_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  city text NOT NULL,
  uf text NOT NULL,
  state text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  ddd text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  intro text,
  body text,
  published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.local_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.local_pages TO authenticated;
GRANT ALL ON public.local_pages TO service_role;

ALTER TABLE public.local_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "local_pages_public_read_published"
  ON public.local_pages FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "local_pages_admin_read"
  ON public.local_pages FOR SELECT TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "local_pages_admin_insert"
  ON public.local_pages FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "local_pages_admin_update"
  ON public.local_pages FOR UPDATE TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "local_pages_admin_delete"
  ON public.local_pages FOR DELETE TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE TRIGGER local_pages_touch_updated_at
  BEFORE UPDATE ON public.local_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. WHATSAPP DISPATCH -------------------------------------------------------
CREATE TABLE public.wa_dispatch_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  channel text NOT NULL DEFAULT 'simulated',
  template_name text,
  status text NOT NULL DEFAULT 'queued',
  total_count integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  skipped_count integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.wa_dispatch_batches TO authenticated;
GRANT ALL ON public.wa_dispatch_batches TO service_role;

ALTER TABLE public.wa_dispatch_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_batches_admin_all"
  ON public.wa_dispatch_batches FOR ALL TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE TRIGGER wa_dispatch_batches_touch_updated_at
  BEFORE UPDATE ON public.wa_dispatch_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wa_dispatch_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.wa_dispatch_batches(id) ON DELETE CASCADE,
  lead_id uuid,
  lead_source text,
  phone_e164 text NOT NULL,
  message_preview text,
  status text NOT NULL DEFAULT 'queued',
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX wa_dispatch_messages_batch_idx ON public.wa_dispatch_messages (batch_id);

GRANT SELECT, INSERT, UPDATE ON public.wa_dispatch_messages TO authenticated;
GRANT ALL ON public.wa_dispatch_messages TO service_role;

ALTER TABLE public.wa_dispatch_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_messages_admin_all"
  ON public.wa_dispatch_messages FOR ALL TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE TRIGGER wa_dispatch_messages_touch_updated_at
  BEFORE UPDATE ON public.wa_dispatch_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wa_optouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164 text NOT NULL UNIQUE,
  reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.wa_optouts TO authenticated;
GRANT ALL ON public.wa_optouts TO service_role;

ALTER TABLE public.wa_optouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_optouts_admin_all"
  ON public.wa_optouts FOR ALL TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));