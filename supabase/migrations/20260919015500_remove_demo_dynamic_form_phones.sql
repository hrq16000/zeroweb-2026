-- Remove seed/demo phone fields from the institutional diagnostic form.
-- Runtime contact resolution is server-only and canonical; templates/provider remain.
UPDATE public.dynamic_forms
SET
  whatsapp_config =
    CASE
      WHEN whatsapp_config->>'redirect_phone' = '+5511999999999' THEN
        (CASE
          WHEN whatsapp_config->>'alert_phone' = '+5511988887777'
            THEN whatsapp_config - 'alert_phone'
          ELSE whatsapp_config
        END) - 'redirect_phone'
      WHEN whatsapp_config->>'alert_phone' = '+5511988887777' THEN
        whatsapp_config - 'alert_phone'
      ELSE whatsapp_config
    END,
  updated_at = now()
WHERE slug = 'diagnostico-0web'
  AND (
    whatsapp_config->>'alert_phone' = '+5511988887777'
    OR whatsapp_config->>'redirect_phone' = '+5511999999999'
  );
