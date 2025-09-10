import express from 'express';
import { supabaseAdmin } from '../supabase';

const router = express.Router();

export function generateInviteToken(len = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRTUVWXYZabcdefghjkmnptuvxy234679';
  let s = '';
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

// POST /api/invites/named
// Body: { inviterUserId: string, privateCodeId: string, fullName: string, email?: string }
// Returns: { inviteeId, inviteToken, link }
router.post('/named', async (req, res) => {
  try {
    const { inviterUserId, privateCodeId, fullName, email } = req.body || {};
    if (!inviterUserId || !privateCodeId || !fullName) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    // Insert invitee
    const { data: insertRows, error: insertErr } = await supabaseAdmin
      .from('invitees')
      .insert({ inviter_user_id: inviterUserId, private_code_id: privateCodeId, full_name: fullName, email: email ?? null })
      .select('id, invite_token')
      .limit(1);

    if (insertErr) {
      console.error('insert invitee error:', insertErr);
      return res.status(500).json({ error: 'insert_failed' });
    }

    const invitee = insertRows && insertRows[0];
    if (!invitee) return res.status(500).json({ error: 'no_row' });

    let token: string | null = invitee.invite_token ?? null;

    // If no token, generate unique one
    if (!token) {
      // Try up to 10 times
      for (let tries = 0; tries < 10; tries++) {
        const candidate = generateInviteToken(8);
        const { data: existsRows, error: existsErr } = await supabaseAdmin
          .from('invitees')
          .select('id')
          .eq('invite_token', candidate)
          .limit(1);
        if (existsErr) {
          console.error('check token exists error:', existsErr);
          return res.status(500).json({ error: 'token_check_failed' });
        }
        if (!existsRows || existsRows.length === 0) {
          const { error: updateErr } = await supabaseAdmin
            .from('invitees')
            .update({ invite_token: candidate })
            .eq('id', invitee.id);
          if (updateErr) {
            console.error('update token error:', updateErr);
            return res.status(500).json({ error: 'token_update_failed' });
          }
          token = candidate;
          break;
        }
      }
    }

    if (!token) return res.status(500).json({ error: 'token_generation_failed' });

    return res.json({ inviteeId: invitee.id, inviteToken: token, link: `/${token}` });
  } catch (e) {
    console.error('named invite error:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
