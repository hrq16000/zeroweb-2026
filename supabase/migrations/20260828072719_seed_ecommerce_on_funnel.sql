DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-ecommerce-on';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-ecommerce-on', 'Diagnóstico · Ecommerce On', 'Funil individual para estratégia digital, SEO e e-commerce', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Diagnóstico · Ecommerce On', description = 'Funil individual para estratégia digital, SEO e e-commerce' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos falar sobre o crescimento da sua marca 🚀', 'Conte o desafio e receba um próximo passo estratégico.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual frente você quer acelerar?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','seo','label','SEO e posicionamento'), jsonb_build_object('value','ecommerce','label','Loja virtual ou site institucional'), jsonb_build_object('value','social','label','Gestão de redes sociais'), jsonb_build_object('value','trafego','label','Tráfego pago'), jsonb_build_object('value','conteudo','label','Conteúdo, vídeos e reels'), jsonb_build_object('value','ia','label','Estratégia e automação com IA'))),
    (v_form_id, 'momento', 'radio', 'Em que momento está seu negócio?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','online','label','Já tenho um negócio online'), jsonb_build_object('value','comecando','label','Estou começando agora'), jsonb_build_object('value','escala','label','Quero escalar vendas'), jsonb_build_object('value','organizar','label','Preciso organizar a comunicação'))),
    (v_form_id, 'local', 'radio', 'Onde sua empresa atua?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba','label','Curitiba — PR'), jsonb_build_object('value','joinville','label','Joinville — SC'), jsonb_build_object('value','outra','label','Outra cidade'), jsonb_build_object('value','confirmar','label','Vou confirmar a região'))),
    (v_form_id, 'quando', 'radio', 'Quando quer começar?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Quero começar em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','analise','label','Quero uma análise primeiro'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte o contexto do projeto', 'Site atual, produto, público, meta de vendas e canais ajudam na conversa.', 'Descreva seu desafio', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'A Ecommerce On vai confirmar os próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
