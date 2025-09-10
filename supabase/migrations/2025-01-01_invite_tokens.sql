-- 1. Add invite_token column if missing
alter table invitees add column if not exists invite_token text;

-- 2. Ensure uniqueness
create unique index if not exists invitees_invite_token_key on invitees (invite_token);

-- 3. Ensure inviter (Mike) exists
insert into users (email, display_name, status)
values ('mikehelm@gmail.com', 'Mike Helm', 'active')
on conflict (email) do nothing;

-- 4. Seed Samantha Helm with invite_token
do $$
declare inviter_id uuid;
begin
  select id into inviter_id from users where email = 'mikehelm@gmail.com';
  insert into invitees (inviter_user_id, full_name, email, status, invite_token)
  values (inviter_id, 'Samantha Helm', 'samantha@example.com', 'pending', 'AB7X9QK2')
  on conflict (inviter_user_id, full_name) do update
     set email = excluded.email,
         status = excluded.status,
         invite_token = excluded.invite_token;
end $$;

-- 5. Seed Graham Brain with invite_token
do $$
declare inviter_id uuid;
begin
  select id into inviter_id from users where email = 'mikehelm@gmail.com';
  insert into invitees (inviter_user_id, full_name, email, status, invite_token)
  values (inviter_id, 'Graham Brain', 'graham@example.com', 'pending', 'TX4V7JY3')
  on conflict (inviter_user_id, full_name) do update
     set email = excluded.email,
         status = excluded.status,
         invite_token = excluded.invite_token;
end $$;

-- 6. Verification queries (run manually)
-- select full_name, email, status, invite_token from invitees where full_name in ('Samantha Helm','Graham Brain');
