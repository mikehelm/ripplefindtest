import express from 'express';
import { supabaseAdmin } from '../supabase';

const router = express.Router();

// GET /api/affiliates/resolve?token=XYZ or ?code=ABC123
router.get('/resolve', async (req, res) => {
  try {
    const token = (req.query.token as string | undefined)?.trim();
    const code = (req.query.code as string | undefined)?.trim();

    if (!token && !code) {
      return res.status(400).json({ valid: false, error: 'missing_identifier' });
    }

    // 1) Token-first: invitees.invite_token
    if (token) {
      const { data: inviteeRows, error: inviteeErr } = await supabaseAdmin
        .from('invitees')
        .select('full_name, inviter_user_id')
        .eq('invite_token', token)
        .limit(1);

      if (inviteeErr) {
        console.error('resolve(token) invitee error:', inviteeErr);
        return res.status(500).json({ valid: false });
      }

      const invitee = inviteeRows && inviteeRows[0];
      if (invitee) {
        const { data: inviterRows, error: inviterErr } = await supabaseAdmin
          .from('users')
          .select('display_name')
          .eq('id', invitee.inviter_user_id)
          .limit(1);

        if (inviterErr) {
          console.error('resolve(token) inviter error:', inviterErr);
          return res.status(500).json({ valid: false });
        }

        const inviter = inviterRows && inviterRows[0];
        return res.json({
          valid: true,
          type: 'named',
          inviterDisplayName: inviter?.display_name ?? null,
          inviteeName: invitee.full_name ?? null,
        });
      }
    }

    // 2) Fallback: code (private or public)
    if (code) {
      // Try private code
      const { data: privRows, error: privErr } = await supabaseAdmin
        .from('private_codes')
        .select('user_id')
        .eq('code', code)
        .limit(1);

      if (privErr) {
        console.error('resolve(code) private error:', privErr);
        return res.status(500).json({ valid: false });
      }

      if (privRows && privRows[0]) {
        const userId = privRows[0].user_id;
        const { data: inviterRows, error: inviterErr } = await supabaseAdmin
          .from('users')
          .select('display_name')
          .eq('id', userId)
          .limit(1);
        if (inviterErr) {
          console.error('resolve(code) inviter error:', inviterErr);
          return res.status(500).json({ valid: false });
        }
        const inviter = inviterRows && inviterRows[0];
        return res.json({
          valid: true,
          type: 'private',
          inviterDisplayName: inviter?.display_name ?? null,
        });
      }

      // Try public code
      const { data: pubRows, error: pubErr } = await supabaseAdmin
        .from('public_codes')
        .select('user_id')
        .eq('code', code)
        .eq('active', true)
        .limit(1);

      if (pubErr) {
        console.error('resolve(code) public error:', pubErr);
        return res.status(500).json({ valid: false });
      }

      if (pubRows && pubRows[0]) {
        const userId = pubRows[0].user_id;
        const { data: inviterRows, error: inviterErr } = await supabaseAdmin
          .from('users')
          .select('display_name')
          .eq('id', userId)
          .limit(1);
        if (inviterErr) {
          console.error('resolve(code) inviter error:', inviterErr);
          return res.status(500).json({ valid: false });
        }
        const inviter = inviterRows && inviterRows[0];
        return res.json({
          valid: true,
          type: 'public',
          inviterDisplayName: inviter?.display_name ?? null,
        });
      }
    }

    return res.json({ valid: false });
  } catch (e) {
    console.error('resolve error:', e);
    return res.status(500).json({ valid: false });
  }
});

export default router;
