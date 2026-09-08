-- Funil individual; o destino operacional é resolvido apenas no servidor.
do $$ declare v_form_id uuid; begin
 select id into v_form_id from public.dynamic_forms where slug='funnel-your-brutus-burguer' limit 1;
 if v_form_id is null then insert into public.dynamic_forms(slug,name,status,description,config_json,whatsapp_config) values('funnel-your-brutus-burguer','Contato · Your Brutus Burguer','published','Intenção de pedido do Your Brutus Burguer · São José dos Pinhais','{"auto_advance_ms":300}'::jsonb,'{"enabled":true}'::jsonb) returning id into v_form_id; else update public.dynamic_forms set status='published',whatsapp_config=coalesce(whatsapp_config,'{}'::jsonb)||'{"enabled":true}'::jsonb where id=v_form_id; end if;
 delete from public.dynamic_form_conditions where form_id=v_form_id; delete from public.dynamic_form_questions where form_id=v_form_id;
 insert into public.dynamic_form_questions(form_id,key,type,label,hint,placeholder,required,order_index,options_json) values
 (v_form_id,'escolha','radio','O que você quer explorar?','O cardápio oficial traz as opções e condições do dia.',null,true,0,'[{"value":"burger","label":"Hambúrguer artesanal"},{"value":"combo","label":"Combo ou acompanhamento"},{"value":"cardapio","label":"Quero abrir o cardápio"}]'::jsonb),
 (v_form_id,'momento','radio','Para quando é seu pedido?',null,null,true,1,'[{"value":"agora","label":"Agora"},{"value":"hoje","label":"Hoje"},{"value":"planejando","label":"Estou planejando"}]'::jsonb),
 (v_form_id,'nome','short_text','Qual é o seu nome?',null,'Seu nome',true,2,'[]'::jsonb),
 (v_form_id,'whatsapp','phone','Qual WhatsApp devemos chamar?','Usamos somente para responder esta solicitação.','(00) 00000-0000',true,3,'[]'::jsonb);
end $$;
