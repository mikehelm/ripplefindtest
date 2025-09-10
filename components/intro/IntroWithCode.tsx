import Intro from './Intro';
import { resolveAffiliate } from '@/lib/apiClient';

type Props = { initialCode: string };

export default async function IntroWithCode({ initialCode }: Props) {
  const resp = await resolveAffiliate(initialCode);
  console.debug('[IntroWithCode] resolved:', resp);

  const inviterName = resp?.inviterDisplayName ?? undefined;
  const inviteeName = resp?.inviteeName ?? undefined;
  const ctaHref = `/join/${encodeURIComponent(initialCode)}`;

  return <Intro inviterName={inviterName} inviteeName={inviteeName} code={initialCode} ctaHref={ctaHref} />;
}

