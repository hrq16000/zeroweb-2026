DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-sscons';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-sscons', 'Orçamento · S&S Construções', 'Funil individual da S&S Construções: carpintaria, obras, alvenaria, pintura, reforma e azulejo em Curitiba e Região Metropolitana', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · S&S Construções', description = 'Funil individual da S&S Construções: carpintaria, obras, alvenaria, pintura, reforma e azulejo em Curitiba e Região Metropolitana' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos planejar sua obra 🏗️', 'Da fundação ao acabamento: conte o serviço e receba um orçamento personalizado da S&S.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual serviço você precisa?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','carpintaria','label','Carpintaria'), jsonb_build_object('value','obras','label','Obras e construção'), jsonb_build_object('value','alvenaria','label','Alvenaria'), jsonb_build_object('value','pintura','label','Pintura'), jsonb_build_object('value','reforma','label','Reforma'), jsonb_build_object('value','azulejo','label','Azulejo e revestimentos'))),
    (v_form_id, 'tipo_obra', 'radio', 'Que tipo de obra é?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','nova','label','Construção nova'), jsonb_build_object('value','reforma-residencial','label','Reforma residencial'), jsonb_build_object('value','comercial','label','Obra comercial'), jsonb_build_object('value','manutencao','label','Manutenção ou reparo'))),
    (v_form_id, 'local', 'radio', 'Onde será a obra?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba','label','Curitiba'), jsonb_build_object('value','regiao-metropolitana','label','Região Metropolitana'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando pretende começar?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Preciso começar em breve'), jsonb_build_object('value','proximos-meses','label','Nos próximos meses'), jsonb_build_object('value','planejando','label','Ainda estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes da obra', 'Metragem, etapa atual, acabamento desejado e prazo ajudam a S&S a preparar o orçamento.', 'Descreva seu projeto', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'A equipe da S&S vai analisar o pedido e retornar com os próximos passos do orçamento.', NULL, 8, false, '[]'::jsonb);
END $$;