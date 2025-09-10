## Seeding
- Open Supabase → **SQL Editor**
- Paste the contents of `supabase/seed.sql`
- Click **RUN**
- Admin created: `mikehelm@gmail.com` (password: `!2345`)
- Inviter/member created: `Mike Helm` (email: `mikehelm@gmail.com`)
- Codes for Mike: Private=`MHK1P7`, Public=`MHK-1P7`
- Test users set with inviter=`Mike Helm`:
  - `Samantha Helm` (email: `samantha@example.com`)
  - `Graham Brain` (email: `graham@example.com`)

### Verify (copy/paste in SQL Editor after running seed):
```sql
select email, role from admins;
select email, display_name, inviter_user_id from users order by created_at desc;
select code from private_codes pc join users u on u.id = pc.user_id and u.email='mikehelm@gmail.com';
select code from public_codes  pc join users u on u.id = pc.user_id and u.email='mikehelm@gmail.com';
```

## Migrations

### Invite Tokens (per-invite)
- Open Supabase → **SQL Editor**
- Paste the contents of `supabase/migrations/2025-01-01_invite_token.sql` to add the column and backfill random tokens if needed.
- Then paste the contents of `supabase/migrations/2025-01-01_invite_tokens.sql` to seed two named invitees with fixed tokens.
- Click **RUN** for each.

#### Verify
```sql
-- Column and uniqueness
select column_name from information_schema.columns where table_name='invitees' and column_name='invite_token';

-- Index exists
select indexname from pg_indexes where tablename='invitees' and indexname='invitees_invite_token_key';

-- Seeded named invitees
select full_name, email, status, invite_token from invitees where full_name in ('Samantha Helm','Graham Brain');
