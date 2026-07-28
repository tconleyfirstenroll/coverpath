import { getAllPlans } from '@/lib/plans';
import { getCategories } from '@/lib/categories';
import { PlansContent } from './_components/plans-content';

export default async function PlansPage() {
  const [initialPlans, categories] = await Promise.all([getAllPlans(), getCategories()]);
  return <PlansContent initialPlans={initialPlans} categories={categories} />;
}
