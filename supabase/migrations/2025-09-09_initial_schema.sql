-- Enable needed extensions
create extension if not exists pgcrypto;

-- USERS (members)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  status text default 'active',
  inviter_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

-- ADMINS
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text default 'super',
  created_at timestamptz default now()
);

-- PRIVATE CODES (one per user)
create table if not exists public.private_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  code text unique not null,
  created_at timestamptz default now()
);
create unique index if not exists private_codes_user_id_key on public.private_codes(user_id);

-- PUBLIC CODES (one per user)
create table if not exists public.public_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  code text unique not null,
  active boolean default true,
  created_at timestamptz default now()
);
create unique index if not exists public_codes_user_id_key on public.public_codes(user_id);

-- INVITEES (named invites; one row per invited person)
create table if not exists public.invitees (
  id uuid primary key default gen_random_uuid(),
  inviter_user_id uuid not null references public.users(id) on delete cascade,
  full_name text not null,
  email text,
  status text default 'pending',
  invite_token text unique,
  private_code_id uuid references public.private_codes(id) on delete set null,
  created_at timestamptz default now()
);

-- Basic grants (service role key is used server-side, but keep objects visible)
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;

-- Seed core data for Mike + codes (idempotent)
insert into public.users (email, display_name, status)
values ('mikehelm@gmail.com', 'Mike Helm', 'active')
on conflict (email) do nothing;

do $$
declare
  inviter_id uuid;
begin
  select id into inviter_id from public.users where email = 'mikehelm@gmail.com';

  if not exists (select 1 from public.private_codes where user_id = inviter_id) then
    insert into public.private_codes (user_id, code) values (inviter_id, 'MHK1P7');
  end if;

  if not exists (select 1 from public.public_codes where user_id = inviter_id) then
    insert into public.public_codes (user_id, code, active) values (inviter_id, 'MHK-1P7', true);
  end if;
end $$;

-- Seed named invitees with per-invite tokens (Samantha & Graham)
do $$
declare
  inviter_id uuid;
begin
  select id into inviter_id from public.users where email = 'mikehelm@gmail.com';

  insert into public.invitees (inviter_user_id, full_name, email, status, invite_token, private_code_id)
  values (
    inviter_id, 'Samantha Helm', 'samantha@example.com', 'pending', 'AB7X9QK2',
    (select id from public.private_codes where user_id = inviter_id limit 1)
  )
  on conflict (inviter_user_id, full_name) do update
    set email = excluded.email,
        status = excluded.status,
        invite_token = excluded.invite_token;

  insert into public.invitees (inviter_user_id, full_name, email, status, invite_token, private_code_id)
  values (
    inviter_id, 'Graham Brain', 'graham@example.com', 'pending', 'TX4V7JY3',
    (select id from public.private_codes where user_id = inviter_id limit 1)
  )
  on conflict (inviter_user_id, full_name) do update
    set email = excluded.email,
        status = excluded.status,
        invite_token = excluded.invite_token;
end $$;

-- Verification (run manually in SQL editor):
-- select table_name from information_schema.tables where table_schema='public' and table_name in ('users','admins','private_codes','public_codes','invitees');
-- select full_name, invite_token from public.invitees where full_name in ('Samantha Helm','Graham Brain');
