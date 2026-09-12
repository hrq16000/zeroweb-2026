CREATE TABLE public.lead_delivery_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE,
  lead_table text NOT NULL DEFAULT 'dynamic_form_leads',
  slug text,
  client_key text,
  destination_status text NOT NULL DEFAULT 'UNKNOWN',
  delivery_status text NOT NULL DEFAULT 'PENDING',
  recoverability_status text NOT NULL DEFAULT 'DELIVERY_PENDING',
  has_recoverable_contact boolean NOT NULL DEFAULT false,
  attempted_at timestamptz,
  delivered_at timestamptz,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lead_delivery_ledger_client_key_idx ON public.lead_delivery_ledger (client_key);
CREATE INDEX lead_delivery_ledger_status_idx ON public.lead_delivery_ledger (delivery_status, recoverability_status);
CREATE INDEX lead_delivery_ledger_created_idx ON public.lead_delivery_ledger (created_at DESC);

GRANT SELECT ON public.lead_delivery_ledger TO authenticated;
GRANT ALL ON public.lead_delivery_ledger TO service_role;

ALTER TABLE public.lead_delivery_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_delivery_ledger_admin_read" ON public.lead_delivery_ledger
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER lead_delivery_ledger_touch
  BEFORE UPDATE ON public.lead_delivery_ledger
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();