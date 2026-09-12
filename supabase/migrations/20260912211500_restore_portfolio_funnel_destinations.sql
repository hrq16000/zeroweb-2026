-- Restauração cirúrgica dos destinos de WhatsApp dos projetos de /portfolio.
--
-- Objetivo: recuperar EXATAMENTE o último número válido já pertencente ao
-- client_key quando o destino atual foi apagado/zerado. Nenhum número é
-- inventado, inferido por slug, compartilhado entre clientes ou impresso em
-- logs. O número institucional da 0WEB é explicitamente proibido como destino
-- de cliente.
--
-- Fonte de recuperação: portfolio_client_settings_history, que guarda o valor
-- anterior/novo por campo e client_key. A restauração só usa histórico do
-- MESMO client_key.

DO $$
BEGIN
  IF to_regclass('public.portfolio_client_settings') IS NULL THEN
    RAISE EXCEPTION 'portfolio_client_settings ausente';
  END IF;
  IF to_regclass('public.portfolio_client_settings_history') IS NULL THEN
    RAISE EXCEPTION 'portfolio_client_settings_history ausente';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.normalize_portfolio_whatsapp_digits(p_value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT regexp_replace(p_value, '[^0-9]', '', 'g');
$$;

CREATE OR REPLACE FUNCTION public.is_valid_portfolio_whatsapp_candidate(p_value text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_value IS NULL THEN false
    ELSE length(public.normalize_portfolio_whatsapp_digits(p_value)) BETWEEN 10 AND 15
      -- WhatsApp institucional da 0WEB: nunca pode virar destino de cliente.
      AND public.normalize_portfolio_whatsapp_digits(p_value) <> '5541997452053'
  END;
$$;

-- Mantemos uma função reexecutável para recuperação operacional futura.
-- Ela devolve SOMENTE contagem; jamais números.
CREATE OR REPLACE FUNCTION public.restore_portfolio_funnel_destinations_from_history()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_restored integer := 0;
BEGIN
  WITH history_candidates AS (
    SELECT
      h.client_key,
      h.created_at,
      CASE
        WHEN public.is_valid_portfolio_whatsapp_candidate(h.new_value)
          THEN public.normalize_portfolio_whatsapp_digits(h.new_value)
        WHEN public.is_valid_portfolio_whatsapp_candidate(h.old_value)
          THEN public.normalize_portfolio_whatsapp_digits(h.old_value)
        ELSE NULL
      END AS digits
    FROM public.portfolio_client_settings_history h
    WHERE h.field = 'funnel_recipient'
  ),
  latest_valid AS (
    SELECT DISTINCT ON (client_key)
      client_key,
      digits
    FROM history_candidates
    WHERE digits IS NOT NULL
    ORDER BY client_key, created_at DESC
  ),
  repaired AS (
    UPDATE public.portfolio_client_settings s
    SET
      funnel_recipient = l.digits,
      funnel_enabled = true,
      updated_at = now()
    FROM latest_valid l
    WHERE s.client_key = l.client_key
      AND (
        NOT public.is_valid_portfolio_whatsapp_candidate(s.funnel_recipient)
        OR public.normalize_portfolio_whatsapp_digits(s.funnel_recipient) = '5541997452053'
      )
    RETURNING s.client_key
  )
  SELECT count(*) INTO v_restored FROM repaired;

  RETURN v_restored;
END;
$$;

REVOKE ALL ON FUNCTION public.restore_portfolio_funnel_destinations_from_history() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restore_portfolio_funnel_destinations_from_history() TO service_role;

-- Executa a recuperação agora. O retorno não é exibido nem persistido.
DO $$
DECLARE
  v_count integer;
BEGIN
  SELECT public.restore_portfolio_funnel_destinations_from_history() INTO v_count;
  -- Não imprimir números. Apenas a contagem é segura, mas nem ela é necessária
  -- no log de migração para o funcionamento.
END $$;

-- Evita que a função de validação auxiliar fique exposta como superfície
-- operacional; ela é usada apenas internamente e pelo reparo acima.
REVOKE ALL ON FUNCTION public.normalize_portfolio_whatsapp_digits(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_valid_portfolio_whatsapp_candidate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.normalize_portfolio_whatsapp_digits(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_valid_portfolio_whatsapp_candidate(text) TO service_role;
