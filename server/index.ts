import { config } from 'dotenv';
config({ path: '.env.local' });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import healthRouter from './routes/health';
import affiliatesRouter from './routes/affiliates';
import invitesRouter from './routes/invites';

const app = express();
const port = Number(process.env.PORT) || Number(process.env.API_PORT) || 4001;
// Build CORS origins from env or allow all
const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
  : '*';

// Middleware
app.use(cors({ origin: origins as any, credentials: true }));
app.use(helmet());
app.use(express.json());

// Log all requests
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Supabase admin client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Affiliates resolve endpoint (accepts ?code= or ?token=)
app.get('/api/affiliates/resolve', async (req, res) => {
  try {
    const identifier = (req.query.code as string) || (req.query.token as string) || '';
    if (!identifier) return res.status(400).json({ valid: false, error: 'missing_code' });

    // 1) Named invite via invitees.invite_token
    {
      const { data, error } = await supabase
        .from('invitees')
        .select('invite_token, full_name, status, inviter_user_id, users!invitees_inviter_user_id_fkey(display_name)')
        .eq('invite_token', identifier)
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return res.json({
          valid: true,
          type: 'named',
          inviterUserId: (data as any).inviter_user_id,
          inviterDisplayName: (data as any).users?.display_name ?? null,
          inviteeName: (data as any).full_name ?? null,
        });
      }
    }

    // 2) Private code via private_codes.code
    {
      const { data, error } = await supabase
        .from('private_codes')
        .select('code, user_id, users!private_codes_user_id_fkey(display_name)')
        .eq('code', identifier)
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return res.json({
          valid: true,
          type: 'private',
          inviterUserId: (data as any).user_id,
          inviterDisplayName: (data as any).users?.display_name ?? null,
          inviteeName: null,
        });
      }
    }

    // 3) Public code via public_codes.code
    {
      const { data, error } = await supabase
        .from('public_codes')
        .select('code, user_id, users!public_codes_user_id_fkey(display_name)')
        .eq('code', identifier)
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return res.json({
          valid: true,
          type: 'public',
          inviterUserId: (data as any).user_id,
          inviterDisplayName: (data as any).users?.display_name ?? null,
          inviteeName: null,
        });
      }
    }

    return res.status(404).json({ valid: false, error: 'not_found' });
  } catch (e) {
    console.error('resolve error', e);
    return res.status(500).json({ valid: false, error: 'server_error' });
  }
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/affiliates', affiliatesRouter);
app.use('/api/invites', invitesRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`API on :${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully');
  process.exit(0);
});
