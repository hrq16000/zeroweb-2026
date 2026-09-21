-- Funil individual de Autoescola APTOS (funnel-autoescola-aptos).
-- Scaffold V2: nasce DRAFT. Preencha perguntas reais e só então publique.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-autoescola-aptos', 'Autoescola APTOS', 'draft', 'Funil individual de Autoescola APTOS')
on conflict (slug) do update
  set name = excluded.name,
      status = excluded.status,
      description = excluded.description;

-- TODO: inserir etapas reais em public.dynamic_form_questions.
-- TODO: depois de validar o fluxo, alterar o status para 'published'.
