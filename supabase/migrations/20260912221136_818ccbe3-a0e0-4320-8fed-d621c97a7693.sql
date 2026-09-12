CREATE TABLE public.portfolio_destination_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  client_key text NOT NULL,
  candidate_name text,
  candidate_address text,
  candidate_category text,
  place_id text,
  maps_url text,
  phone_digits text NOT NULL,
  match_strength text NOT NULL DEFAULT 'WEAK',
  source text NOT NULL DEFAULT 'OFFICIAL_GOOGLE',
  query text,
  status text NOT NULL DEFAULT 'PENDING',
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, phone_digits)
);

GRANT SELECT, INSERT, UPDATE ON public.portfolio_destination_proposals TO authenticated;
GRANT ALL ON public.portfolio_destination_proposals TO service_role;

ALTER TABLE public.portfolio_destination_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage destination proposals"
ON public.portfolio_destination_proposals
FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()))
WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE TRIGGER trg_portfolio_destination_proposals_updated_at
BEFORE UPDATE ON public.portfolio_destination_proposals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();