DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-santos-montador-de-moveis';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-santos-montador-de-moveis', 'Orçamento · Santos Montador de Móveis', 'Funil individual para montagem, pintura e reparos residenciais', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · Santos Montador de Móveis', description = 'Funil individual para montagem, pintura e reparos residenciais' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;

  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos organizar seu serviço 🛠️', 'Responda algumas perguntas rápidas para adiantar o orçamento.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'O que você precisa resolver?', NULL, NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','montagem','label','Montagem ou desmontagem de móveis'),
      jsonb_build_object('value','pintura','label','Pintura interna'),
      jsonb_build_object('value','eletrica','label','Reparo elétrico'),
      jsonb_build_object('value','caixa-agua','label','Limpeza de caixa d''água'),
      jsonb_build_object('value','cortina','label','Cortina ou persiana'),
      jsonb_build_object('value','outro','label','Outro reparo residencial'))),
    (v_form_id, 'local', 'radio', 'Onde será o atendimento?', NULL, NULL, 3, true, jsonb_build_array(
      jsonb_build_object('value','alphaville','label','Alphaville'),
      jsonb_build_object('value','curitiba','label','Curitiba'),
      jsonb_build_object('value','colombo','label','Colombo'),
      jsonb_build_object('value','outra','label','Outra região'))),
    (v_form_id, 'quando', 'radio', 'Quando deseja realizar?', NULL, NULL, 4, true, jsonb_build_array(
      jsonb_build_object('value','urgente','label','O quanto antes'),
      jsonb_build_object('value','semana','label','Nesta semana'),
      jsonb_build_object('value','planejando','label','Estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes', 'Fotos, quantidades e medidas ajudam no orçamento.', 'Descreva o serviço necessário', 5, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 6, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'Santos vai confirmar os próximos passos pelo WhatsApp.', NULL, 7, false, '[]'::jsonb);
END $$;
