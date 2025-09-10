'use client';

import { useEffect, useMemo, useState } from 'react';
import { isAnyCode } from '@/lib/codes';
import { resolveAffiliate, trackClick, createMember } from '@/lib/apiClient';

type Props = {
  initialCode?: string;
  invitee?: string;
};

export default function JoinExperience({ initialCode, invitee }: Props) {
  const [code, setCode] = useState(initialCode || '');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [resolving, setResolving] = useState(!!initialCode);
  const [resolved, setResolved] = useState<null | {
    valid: boolean;
    type?: 'public' | 'private';
    inviterDisplayName?: string | null;
    inviteeName?: string | null;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const codeIsValid = useMemo(() => (code ? isAnyCode(code) : true), [code]);

  useEffect(() => {
    if (!initialCode) return;
    const landingUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined;

    (async () => {
      setResolving(true);
      try {
        const out = await resolveAffiliate(initialCode, invitee);
        setResolved(out);
      } catch (e) {
        setResolved({ valid: false });
      } finally {
        setResolving(false);
      }

      try {
        await trackClick(initialCode, landingUrl, referrer);
      } catch {}
    })();
  }, [initialCode, invitee]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const codeToUse = code || initialCode || '';
    if (!isAnyCode(codeToUse)) {
      setError('Please enter a valid invite code.');
      return;
    }
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    try {
      await createMember({
        email,
        displayName: displayName || undefined,
        code: codeToUse,
        inviteeId: invitee || undefined,
      });
      setSuccessMsg('Welcome! Your account has been created.');
    } catch (e) {
      setError('Could not create your account. Please try again.');
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px' }}>
      {!!resolved?.valid && (
        <div style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <strong>Invited by {resolved.inviterDisplayName || 'a Founder Matching member'}</strong>
          {resolved.inviteeName ? <div>For: {resolved.inviteeName}</div> : null}
          <div style={{ fontSize: 12, opacity: 0.7 }}>Code type: {resolved.type}</div>
        </div>
      )}

      <h1 style={{ margin: '8px 0 16px' }}>Join Founder Matching</h1>
      <p style={{ margin: '0 0 16px' }}>
        Enter your details below. If you came here via a shared link, your code is already filled in.
      </p>

      {!initialCode && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Invite Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="e.g. X3tuA9 or X3t-uA9"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          {!codeIsValid && <div style={{ color: '#c00', fontSize: 12 }}>Invalid code format.</div>}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="you@example.com"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Display Name (optional)</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How you'd like your name to appear"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        {error && <div style={{ color: '#c00', marginBottom: 12 }}>{error}</div>}
        {successMsg && <div style={{ color: '#0a0', marginBottom: 12 }}>{successMsg}</div>}

        <button
          type="submit"
          disabled={resolving}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            fontWeight: 700,
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {resolving ? 'Checking…' : 'Join'}
        </button>
      </form>
    </div>
  );
}
