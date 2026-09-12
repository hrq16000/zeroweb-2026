ALTER TABLE public.lead_delivery_ledger
  ADD CONSTRAINT lead_delivery_ledger_lead_fk
  FOREIGN KEY (lead_id) REFERENCES public.dynamic_form_leads(id) ON DELETE CASCADE;

ALTER TABLE public.lead_delivery_ledger
  ADD CONSTRAINT lead_delivery_ledger_delivery_status_chk
  CHECK (delivery_status IN ('PENDING','DELIVERED','FAILED','DELIVERY_CONFIGURATION_REQUIRED'));

ALTER TABLE public.lead_delivery_ledger
  ADD CONSTRAINT lead_delivery_ledger_recoverability_chk
  CHECK (recoverability_status IN ('DELIVERED','RECOVERABLE','UNRECOVERABLE_LEGACY','DELIVERY_PENDING','DELIVERY_FAILED'));

ALTER TABLE public.lead_delivery_ledger
  ADD CONSTRAINT lead_delivery_ledger_consistency_chk
  CHECK (
    (delivery_status <> 'DELIVERED' OR recoverability_status = 'DELIVERED')
    AND (recoverability_status <> 'DELIVERED' OR delivery_status = 'DELIVERED')
    AND (recoverability_status <> 'RECOVERABLE' OR has_recoverable_contact)
    AND (recoverability_status <> 'UNRECOVERABLE_LEGACY' OR NOT has_recoverable_contact)
  );