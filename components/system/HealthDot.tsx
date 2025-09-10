'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// Tiny API health indicator dot
// States: checking (white), up (green), down (red)
// Polls `${NEXT_PUBLIC_API_BASE}/api/health` on mount, every 20s, and on tab visibility
export default function HealthDot({ className = '' }: { className?: string }) {
  const base = useMemo(() => {
    // In Next.js client, NEXT_PUBLIC_* envs are inlined at build time
    return process.env.NEXT_PUBLIC_API_BASE;
  }, []);

  const [status, setStatus] = useState<'checking' | 'up' | 'down'>(() => (base ? 'checking' : 'down'));
  const lastLoggedRef = useRef<'checking' | 'up' | 'down' | null>(null);

  // Log only on state transitions (optional)
  useEffect(() => {
    if (lastLoggedRef.current !== status) {
      // console.debug('[HealthDot] status ->', status);
      lastLoggedRef.current = status;
    }
  }, [status]);

  // Ping function with 4s timeout
  const ping = async () => {
    try {
      if (!base) {
        setStatus('down');
        return;
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const url = new URL('/api/health', base);
      const res = await fetch(url.toString(), { cache: 'no-store', signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        setStatus('down');
        return;
      }
      // If not JSON, treat as down
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        setStatus('down');
        return;
      }
      if (json && json.status === 'ok') {
        setStatus('up');
      } else {
        setStatus('down');
      }
    } catch {
      setStatus('down');
    }
  };

  useEffect(() => {
    if (!base) return; // guard when missing base
    let interval: any;
    // initial check
    ping();
    // poll every 20s
    interval = setInterval(ping, 20000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        ping();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  const colorClass =
    status === 'checking' ? 'bg-white' : status === 'up' ? 'bg-[#22c55e]' : 'bg-[#ef4444]';

  // If no API base configured, render nothing
  if (!base) return null;

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colorClass} ring-1 ring-white/30 dark:ring-white/20 align-middle ${className}`}
      aria-label={`API status: ${status}`}
      title={`API status: ${status}`}
    />
  );
}
