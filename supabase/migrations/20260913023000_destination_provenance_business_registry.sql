-- Permite registrar com honestidade evidência pública empresarial forte sem
-- reclassificá-la artificialmente como Google/site/social.
-- Não contém números de telefone nem altera destinos existentes.

ALTER TABLE public.portfolio_destination_revisions
  DROP CONSTRAINT IF EXISTS portfolio_destination_revisions_source_chk;

ALTER TABLE public.portfolio_destination_revisions
  ADD CONSTRAINT portfolio_destination_revisions_source_chk
  CHECK (
    provenance_source = ANY (
      ARRAY[
        'OWNER_CONFIRMED'::text,
        'CLIENT_SUPPLIED'::text,
        'OFFICIAL_GOOGLE'::text,
        'OFFICIAL_WEBSITE'::text,
        'OFFICIAL_SOCIAL'::text,
        'PUBLIC_BUSINESS_REGISTRY'::text,
        'EXISTING_VERIFIED_RECORD'::text
      ]
    )
  );
