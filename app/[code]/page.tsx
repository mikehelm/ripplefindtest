import IntroWithCode from '@/components/intro/IntroWithCode';

export default function CodePage(
  { params }: { params: { code: string } }
) {
  const code = params.code;
  return <IntroWithCode initialCode={code} />;
}
