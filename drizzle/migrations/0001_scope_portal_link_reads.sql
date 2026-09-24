drop policy if exists pc_read on public.portal_companies;
create policy pc_read on public.portal_companies for select to public
using (exists (select 1 from public.portals p where p.id = portal_id and p.status = 'active') or public.is_super_admin(auth.uid()));
drop policy if exists pp_read on public.portal_providers;
create policy pp_read on public.portal_providers for select to public
using (exists (select 1 from public.portals p where p.id = portal_id and p.status = 'active') or public.is_super_admin(auth.uid()));