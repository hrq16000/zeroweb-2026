DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-ag-electrical-services';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-ag-electrical-services', 'Orçamento técnico · A&G Electrical Services', 'Funil de orçamento para elétrica, redes e CFTV', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento técnico · A&G Electrical Services', description = 'Funil de orçamento para elétrica, redes e CFTV' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos organizar sua infraestrutura ⚡', 'Conte o projeto e a equipe orienta o próximo passo.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual solução você precisa?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','eletrica','label','Elétrica geral'), jsonb_build_object('value','infra','label','Infraestrutura para redes'), jsonb_build_object('value','utp','label','Cabeamento estruturado UTP'), jsonb_build_object('value','cftv','label','Sistema CFTV'), jsonb_build_object('value','implantacao','label','Implantação de redes'), jsonb_build_object('value','rack','label','Montagem e organização de rack'))),
    (v_form_id, 'ambiente', 'radio', 'Em qual ambiente será executado?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','residencial','label','Residencial'), jsonb_build_object('value','comercial','label','Comercial'), jsonb_build_object('value','predial','label','Predial / condomínio'), jsonb_build_object('value','industrial','label','Industrial'))),
    (v_form_id, 'local', 'radio', 'Onde será o serviço?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba','label','Curitiba'), jsonb_build_object('value','regiao','label','Região Metropolitana'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando você precisa?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','urgente','label','Preciso avaliar com urgência'), jsonb_build_object('value','dias','label','Nos próximos dias'), jsonb_build_object('value','planejando','label','Estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte detalhes do projeto', 'Quantidade de pontos, tamanho do rack, câmeras ou tipo de instalação.', 'Descreva o que precisa ser feito', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'A A&G Electrical Services vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
