-- Funil individual de BTB Construção (funnel-btb-construcao).
DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-btb-construcao';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
    VALUES ('funnel-btb-construcao', 'Orçamento · BTB Construção', 'published',
      'Funil de qualificação para reformas internas e acabamentos da BTB Construção.',
      '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET name = 'Orçamento · BTB Construção', status = 'published',
      description = 'Funil de qualificação para reformas internas e acabamentos da BTB Construção.'
      WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos organizar sua reforma.', 'Conte o que quer transformar e a equipe BTB prepara o próximo passo.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'servico', 'checkbox', 'Quais serviços você precisa?', NULL, NULL, 1, true, jsonb_build_array(
      jsonb_build_object('value','pintura','label','Pintura'), jsonb_build_object('value','eletrica','label','Elétrica'),
      jsonb_build_object('value','hidraulica','label','Hidráulica'), jsonb_build_object('value','revestimentos','label','Pisos e revestimentos'),
      jsonb_build_object('value','drywall','label','Drywall e forro'), jsonb_build_object('value','acabamentos','label','Acabamentos e LED'))),
    (v_form_id, 'ambiente', 'radio', 'Que tipo de obra é?', NULL, NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','residencial','label','Reforma residencial'), jsonb_build_object('value','comercial','label','Ambiente comercial'),
      jsonb_build_object('value','nova','label','Construção nova'), jsonb_build_object('value','reparo','label','Manutenção ou reparo'))),
    (v_form_id, 'localizacao', 'short_text', 'Onde será o serviço?', NULL, 'Curitiba, bairro ou região', 3, true, '[]'::jsonb),
    (v_form_id, 'prazo', 'radio', 'Quando pretende começar?', NULL, NULL, 4, true, jsonb_build_array(
      jsonb_build_object('value','breve','label','Preciso começar em breve'), jsonb_build_object('value','meses','label','Nos próximos meses'),
      jsonb_build_object('value','planejando','label','Ainda estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes da transformação.', NULL, 'Ambientes, metragem aproximada e o que deseja mudar', 5, true, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 6, true, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retornarmos?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido!', 'A equipe BTB vai analisar os detalhes e retornar pelo canal oficial.', NULL, 8, false, '[]'::jsonb);
END $$;
