revoke update on public.partners from authenticated;
grant update (
  name, company, email, phone, city, state, areas, specialties, bio, notes, kind, updated_at
) on public.partners to authenticated;
grant all on public.partners to service_role;