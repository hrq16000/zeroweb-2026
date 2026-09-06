-- Funil individual de Easy Clean Higienização a Seco (funnel-easy-clean).
DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-easy-clean';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
    VALUES ('funnel-easy-clean', 'Orçamento · Easy Clean', 'published',
      'Funil de qualificação para higienização a seco e impermeabilização.',
      '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET name = 'Orçamento · Easy Clean', status = 'published',
      description = 'Funil de qualificação para higienização a seco e impermeabilização.'
      WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos cuidar do seu conforto.', 'Conte qual peça precisa de higienização e receba um próximo passo claro.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'servico', 'checkbox', 'O que precisa higienizar?', NULL, NULL, 1, true, jsonb_build_array(
      jsonb_build_object('value','estofado','label','Sofá ou estofado'), jsonb_build_object('value','colchao','label','Colchão'),
      jsonb_build_object('value','poltrona','label','Poltrona, cadeira ou puff'), jsonb_build_object('value','carro','label','Banco ou teto de carro'),
      jsonb_build_object('value','impermeabilizacao','label','Impermeabilização'))),
    (v_form_id, 'ambiente', 'radio', 'Onde será o atendimento?', NULL, NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','casa','label','Minha casa'), jsonb_build_object('value','empresa','label','Empresa ou escritório'),
      jsonb_build_object('value','veiculo','label','Veículo'), jsonb_build_object('value','condominio','label','Condomínio'))),
    (v_form_id, 'localizacao', 'short_text', 'Qual região?', NULL, 'Curitiba ou bairro', 3, true, '[]'::jsonb),
    (v_form_id, 'prazo', 'radio', 'Quando deseja o atendimento?', NULL, NULL, 4, true, jsonb_build_array(
      jsonb_build_object('value','breve','label','Preciso agendar em breve'), jsonb_build_object('value','dias','label','Nos próximos dias'),
      jsonb_build_object('value','planejando','label','Ainda estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes.', NULL, 'Quantidade de peças, tecido e impermeabilização', 5, true, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 6, true, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retornarmos?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido!', 'A equipe Easy Clean vai analisar os detalhes e retornar pelo canal oficial.', NULL, 8, false, '[]'::jsonb);
END $$;
