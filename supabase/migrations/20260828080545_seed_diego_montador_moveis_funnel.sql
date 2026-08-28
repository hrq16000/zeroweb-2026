DO $$
DECLARE v_form_id uuid;
BEGIN
 SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug='funnel-diego-montador-moveis';
 IF v_form_id IS NULL THEN
  INSERT INTO public.dynamic_forms (slug,name,description,status,config_json,whatsapp_config) VALUES ('funnel-diego-montador-moveis','Orçamento · Diego Montador de Móveis','Funil individual para montagem, reparos e instalações residenciais','published','{"auto_advance_ms":250}'::jsonb,'{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
 ELSE
  UPDATE public.dynamic_forms SET status='published',name='Orçamento · Diego Montador de Móveis',description='Funil individual para montagem, reparos e instalações residenciais' WHERE id=v_form_id;
  DELETE FROM public.dynamic_form_conditions WHERE form_id=v_form_id; DELETE FROM public.dynamic_form_questions WHERE form_id=v_form_id;
 END IF;
 INSERT INTO public.dynamic_form_questions (form_id,key,type,label,hint,placeholder,order_index,required,options_json) VALUES
 (v_form_id,'welcome','statement','Vamos organizar seu serviço 🛠️','Conte o que precisa e receba um próximo passo claro.',NULL,0,false,'[]'::jsonb),
 (v_form_id,'nome','short_text','Qual é o seu nome?',NULL,'Seu nome',1,true,'[]'::jsonb),
 (v_form_id,'servico','radio','Qual serviço você precisa?',NULL,NULL,2,true,jsonb_build_array(jsonb_build_object('value','montagem','label','Montagem de móveis'),jsonb_build_object('value','desmontagem','label','Desmontagem e montagem'),jsonb_build_object('value','conserto','label','Conserto ou adaptação'),jsonb_build_object('value','instalacao','label','Instalação de TV, persianas ou varões'),jsonb_build_object('value','reparos','label','Tomadas, chuveiro ou torneira'))),
 (v_form_id,'projeto','radio','Que tipo de projeto?',NULL,NULL,3,true,jsonb_build_array(jsonb_build_object('value','quarto','label','Guarda-roupa, cama ou mesa'),jsonb_build_object('value','cozinha','label','Cozinha ou escritório'),jsonb_build_object('value','novo','label','Móvel novo ou seminovo'),jsonb_build_object('value','casa','label','Pequenos reparos em casa'))),
 (v_form_id,'local','radio','Onde será o atendimento?',NULL,NULL,4,true,jsonb_build_array(jsonb_build_object('value','sitio-cercado','label','Sítio Cercado'),jsonb_build_object('value','curitiba','label','Curitiba e região'),jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
 (v_form_id,'quando','radio','Quando deseja realizar?',NULL,NULL,5,true,jsonb_build_array(jsonb_build_object('value','breve','label','Preciso em breve'),jsonb_build_object('value','planejando','label','Estou planejando'),jsonb_build_object('value','avaliacao','label','Quero uma avaliação primeiro'))),
 (v_form_id,'detalhes','long_text','Mais detalhes','Fotos, medidas e referências ajudam no orçamento.','Descreva o que precisa',6,false,'[]'::jsonb),
 (v_form_id,'telefone','phone','Qual WhatsApp para retorno?',NULL,'(41) 99999-9999',7,true,'[]'::jsonb),
 (v_form_id,'confirmacao','statement','Solicitação recebida! ✅','Diego vai confirmar os próximos passos pelo WhatsApp.',NULL,8,false,'[]'::jsonb);
END $$;
