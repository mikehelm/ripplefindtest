import JoinExperience from '@/components/join/JoinExperience';

export default async function JoinPage({ searchParams }: { searchParams: { code?: string; invitee?: string } }) {
  return <JoinExperience initialCode={searchParams?.code} invitee={searchParams?.invitee} />;
}
