DO $$
DECLARE v_form uuid; v_step uuid;
BEGIN
  SELECT id INTO v_form FROM public.dynamic_forms WHERE slug = '0web-portfolio-captacao';
  IF v_form IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json)
    VALUES ('0web-portfolio-captacao', '0WEB · Captação via Portfólio',
            'Contatos gerados pelo pop-up comercial da 0WEB dentro das páginas /portfolio/:slug.',
            'published', '{"kind":"host_capture"}'::jsonb)
    RETURNING id INTO v_form;
  END IF;

  SELECT id INTO v_step FROM public.dynamic_form_steps WHERE form_id = v_form ORDER BY order_index LIMIT 1;
  IF v_step IS NULL THEN
    INSERT INTO public.dynamic_form_steps (form_id, order_index, title, cta_label)
    VALUES (v_form, 0, 'Fale com a 0WEB', 'Continuar no WhatsApp')
    RETURNING id INTO v_step;
  END IF;

  INSERT INTO public.dynamic_form_questions (form_id, step_id, key, type, label, order_index, required)
  SELECT v_form, v_step, q.key, q.qtype, q.label, q.idx, true
  FROM (VALUES
    ('nome','short_text','Nome',0),
    ('telefone','phone','WhatsApp',1),
    ('cidade','short_text','Cidade',2)
  ) AS q(key,qtype,label,idx)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.dynamic_form_questions x WHERE x.form_id = v_form AND x.key = q.key
  );
END $$;