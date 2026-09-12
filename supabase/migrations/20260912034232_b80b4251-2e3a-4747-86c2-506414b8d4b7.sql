CREATE TABLE public.portfolio_destination_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key text NOT NULL,
  slug text,
  previous_status text,
  new_status text NOT NULL,
  provenance_source text NOT NULL,
  evidence text,
  destination_masked text,
  destination_fingerprint text,
  shared_with_ack boolean NOT NULL DEFAULT false,
  confirmed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  validated_at timestamptz,
  validation_result text
);

CREATE INDEX portfolio_destination_revisions_key_idx
  ON public.portfolio_destination_revisions (client_key, confirmed_at DESC);

ALTER TABLE public.portfolio_destination_revisions
  ADD CONSTRAINT portfolio_destination_revisions_status_chk
  CHECK (new_status IN ('VERIFIED','CHANGE_PENDING','CONFIGURATION_ERROR','UNRESOLVED','INSUFFICIENT_EVIDENCE','CONFLICT'));

ALTER TABLE public.portfolio_destination_revisions
  ADD CONSTRAINT portfolio_destination_revisions_source_chk
  CHECK (provenance_source IN ('OWNER_CONFIRMED','CLIENT_SUPPLIED','OFFICIAL_GOOGLE','OFFICIAL_WEBSITE','OFFICIAL_SOCIAL','EXISTING_VERIFIED_RECORD'));

GRANT SELECT ON public.portfolio_destination_revisions TO authenticated;
GRANT ALL ON public.portfolio_destination_revisions TO service_role;

ALTER TABLE public.portfolio_destination_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_destination_revisions_admin_read"
  ON public.portfolio_destination_revisions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_super_admin(auth.uid()));