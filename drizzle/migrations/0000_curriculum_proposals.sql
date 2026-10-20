create type public.app_role as enum ('admin', 'moderator', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.curriculum_proposals (
  id uuid primary key default gen_random_uuid(),
  university_id text not null,
  institute_id text not null,
  major_name text not null,
  semesters jsonb not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
grant select, insert on public.curriculum_proposals to anon;
grant select, insert, update, delete on public.curriculum_proposals to authenticated;
grant all on public.curriculum_proposals to service_role;
alter table public.curriculum_proposals enable row level security;
create policy "Anyone can submit pending proposals" on public.curriculum_proposals for insert to anon, authenticated
  with check (status = 'pending' and reviewed_at is null and length(university_id) between 1 and 128 and length(institute_id) between 1 and 128 and length(major_name) between 1 and 200 and jsonb_typeof(semesters) = 'array' and pg_column_size(semesters) <= 65536);
create policy "Anyone reads approved proposals" on public.curriculum_proposals for select to anon, authenticated using (status = 'approved');
create policy "Admins read all proposals" on public.curriculum_proposals for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins review proposals" on public.curriculum_proposals for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (status in ('pending','approved','rejected'));
create policy "Admins delete proposals" on public.curriculum_proposals for delete to authenticated using (public.has_role(auth.uid(), 'admin'));