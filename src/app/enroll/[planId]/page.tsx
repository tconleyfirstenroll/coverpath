import { notFound } from 'next/navigation';
import { getPlanById } from '@/lib/plans';
import { EnrollForm } from './_components/enroll-form';

interface Props {
  params: { planId: string };
}

export async function generateMetadata({ params }: Props) {
  const plan = await getPlanById(params.planId);
  if (!plan) return {};
  return { title: `Enroll in ${plan.name} — CoverPath` };
}

export default async function EnrollPage({ params }: Props) {
  const plan = await getPlanById(params.planId);
  if (!plan) notFound();
  return <EnrollForm plan={plan} />;
}
