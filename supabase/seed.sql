-- Requires pgcrypto (already enabled in schema.sql)
-- Seed: Admin user (securely hashed in-database)
insert into admins (email, password_hash, role)
values (
  'mikehelm@gmail.com',
  crypt('!2345', gen_salt('bf', 10)),  -- plain PW: !2345
  'super'
)
on conflict (email) do nothing;

-- Ensure admin also exists as a member (inviter)
with ins as (
  insert into users (email, display_name, status)
  values ('mikehelm@gmail.com', 'Mike Helm', 'active')
  on conflict (email) do nothing
  returning id
)
select * from ins;

-- Create private/public codes for Mike if missing
do $$
declare
  inviter_id uuid;
  priv_code  text := 'MHK1P7';   -- 6 chars, last is digit per constraints
  pub_code   text := 'MHK-1P7';  -- derived: dash after 3rd char
begin
  select id into inviter_id from users where email = 'mikehelm@gmail.com';

  if not exists (select 1 from private_codes where user_id = inviter_id) then
    insert into private_codes (user_id, code) values (inviter_id, priv_code);
  end if;

  if not exists (select 1 from public_codes where user_id = inviter_id) then
    insert into public_codes (user_id, code, active) values (inviter_id, pub_code, true);
  end if;
end $$;

-- Seed two ACTIVE users "under" Mike (inviter_user_id set)
do $$
declare
  inviter_id uuid;
begin
  select id into inviter_id from users where email = 'mikehelm@gmail.com';

  if not exists (select 1 from users where email='samantha@example.com') then
    insert into users (email, display_name, status, inviter_user_id)
    values ('samantha@example.com', 'Samantha Helm', 'active', inviter_id);
  end if;

  if not exists (select 1 from users where email='graham@example.com') then
    insert into users (email, display_name, status, inviter_user_id)
    values ('graham@example.com', 'Graham Brain', 'active', inviter_id);
  end if;
end $$;

-- Optional: create named invitees (pending) if you want to test that flow
-- do $$
-- declare inviter_id uuid;
-- begin
--   select id into inviter_id from users where email = 'mikehelm@gmail.com';
--   if not exists (select 1 from invitees where inviter_user_id = inviter_id and full_name = 'Jane Sample') then
--     insert into invitees (inviter_user_id, full_name, email, status, private_code_id)
--     values (
--       inviter_id,
--       'Jane Sample',
--       'jane@example.com',
--       'pending',
--       (select id from private_codes where user_id = inviter_id)
--     );
--   end if;
-- end $$;

-- Quick views (optional)
-- select * from admins;
-- select * from users order by created_at desc;
-- select * from private_codes;
-- select * from public_codes;
-- select * from invitees;
