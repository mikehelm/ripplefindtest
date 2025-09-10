const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!API_BASE) {
  throw new Error(
    'Missing NEXT_PUBLIC_API_BASE environment variable. Set it in .env.local to your Render base URL, e.g., https://<your-service>.onrender.com'
  );
}

export type ResolveResponse = {
  valid: boolean;
  type?: 'public' | 'private' | 'named';
  inviterUserId?: string | null;
  inviterDisplayName?: string | null;
  inviteeName?: string | null;
};

export async function resolveAffiliate(code: string, invitee?: string): Promise<ResolveResponse> {
  console.debug('[resolveAffiliate] base:', API_BASE);
  const url = new URL('/api/affiliates/resolve', API_BASE);
  url.searchParams.set('code', code);
  if (invitee) url.searchParams.set('invitee', invitee);
  console.debug('[resolveAffiliate] url:', url.toString());
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { valid: false };
  const data = await res.json();
  console.debug('[resolveAffiliate] data:', data);
  return data;
}

export async function trackClick(code: string, landingUrl?: string, referrer?: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/affiliates/track-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, landingUrl, referrer })
  });
  if (!res.ok) return { ok: false };
  return res.json();
}

export async function createMember(input: { email: string; displayName?: string; code?: string; inviteeId?: string }) {
  const res = await fetch(`${API_BASE}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('create_member_failed');
  return res.json();
}

export async function resolveAny(identifier: string): Promise<ResolveResponse> {
  // Try token first
  let url = new URL('/api/affiliates/resolve', API_BASE);
  url.searchParams.set('token', identifier);
  let res = await fetch(url.toString(), { cache: 'no-store' });
  if (res.ok) {
    const out = await res.json();
    if (out?.valid) return out;
  }
  // Fallback to code
  url = new URL('/api/affiliates/resolve', API_BASE);
  url.searchParams.set('code', identifier);
  res = await fetch(url.toString(), { cache: 'no-store' });
  if (res.ok) return res.json();
  return { valid: false };
}
