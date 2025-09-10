-- Add a per-invite token to invitees
alter table invitees
add column if not exists invite_token text;

-- Ensure uniqueness and fast lookup
create unique index if not exists invitees_invite_token_key on invitees (invite_token);

-- For any existing invitees without a token, backfill a temporary random value
do $$
declare
  rec record;
  alphabet text := 'ABCDEFGHJKLMNPQRTUVWXYZabcdefghjkmnptuvxy234679';
  token_len int := 8;
  candidate text;
  tries int;
begin
  for rec in select id from invitees where invite_token is null loop
    tries := 0;
    loop
      candidate := '';
      for i in 1..token_len loop
        candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
      end loop;

      exit when not exists (select 1 from invitees where invite_token = candidate);
      tries := tries + 1;
      exit when tries > 10; -- give up if something is wrong
    end loop;

    update invitees set invite_token = candidate where id = rec.id and invite_token is null;
  end loop;
end $$;

-- Optional: make token required going forward
-- alter table invitees alter column invite_token set not null;
