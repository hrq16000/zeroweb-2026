DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-enoel-portas';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-enoel-portas', 'Orçamento · Enoel Portas', 'Funil de orçamento para colocação, regulagem, vistas e caxilhos.', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · Enoel Portas' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos entender a entrada do seu projeto.', 'Escolha o serviço e conte o contexto para a equipe orientar o orçamento.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'O que você precisa resolver?', NULL, NULL, 1, true, jsonb_build_array(jsonb_build_object('value','colocacao','label','Colocação de portas de madeira'), jsonb_build_object('value','regulagem','label','Regulagem'), jsonb_build_object('value','vistas','label','Vistas e guarnições'), jsonb_build_object('value','caxilhos','label','Caxilhos em geral'), jsonb_build_object('value','avaliacao','label','Avaliar um projeto'))),
    (v_form_id, 'contexto', 'radio', 'Em qual contexto?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','casa','label','Casa ou apartamento'), jsonb_build_object('value','reforma','label','Reforma em andamento'), jsonb_build_object('value','obra','label','Obra nova'), jsonb_build_object('value','planejando','label','Ainda estou planejando'))),
    (v_form_id, 'local', 'short_text', 'Onde será o serviço?', 'Atendemos Curitiba e região.', 'Cidade e bairro', 3, true, '[]'::jsonb),
    (v_form_id, 'detalhes', 'long_text', 'Quer deixar algum detalhe?', 'Medida aproximada, quantidade, modelo ou fase da obra ajudam na orientação.', 'Conte um pouco mais', 4, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 5, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido!', 'A equipe Enoel Portas vai revisar os detalhes e retornar pelo WhatsApp.', NULL, 6, false, '[]'::jsonb);
END $$;
