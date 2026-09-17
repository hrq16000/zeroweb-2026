CREATE TABLE public.portfolio_whatsapp_confirmations (
  client_key text PRIMARY KEY,
  whatsapp_digits text NOT NULL CHECK (whatsapp_digits ~ '^[0-9]{10,15}$'),
  evidence text NOT NULL,
  confirmed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

GRANT SELECT ON public.portfolio_whatsapp_confirmations TO authenticated;
GRANT ALL ON public.portfolio_whatsapp_confirmations TO service_role;

ALTER TABLE public.portfolio_whatsapp_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read portfolio whatsapp confirmations"
ON public.portfolio_whatsapp_confirmations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.is_super_admin(auth.uid()));

CREATE TRIGGER portfolio_whatsapp_confirmations_updated_at
BEFORE UPDATE ON public.portfolio_whatsapp_confirmations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();