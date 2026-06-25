import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { getCategoryBySlug, CATEGORIES } from '@/lib/categories';
import { getPlansByCategory } from '@/lib/plans';
import { PlanCard } from '@/components/plans/plan-card';
import { Button } from '@/components/ui/button';

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} Plans — CoverPath`,
    description: cat.description,
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) notFound();

  const plans = getPlansByCategory(cat.slug);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-blue-200 text-sm mb-6">
            <Link href="/plans" className="hover:text-white">Plans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{cat.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{cat.icon}</span>
            <div>
              <h1 className="text-4xl font-extrabold">{cat.name} Plans</h1>
              <p className="text-blue-200 mt-1 text-lg">{cat.description}</p>
            </div>
          </div>

          {/* Key benefits pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {cat.keyBenefits.map((b) => (
              <span key={b} className="bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* What is it */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">What is {cat.name} Insurance?</h2>
              <p className="text-slate-600 leading-relaxed">{cat.longDescription}</p>
            </section>

            {/* Plans */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Available Plans</h2>
                <span className="text-sm text-slate-500">{plans.length} options</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>

            {/* FAQs */}
            {cat.faqs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {cat.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Who needs it */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-3">Who Needs This Coverage?</h3>
              <ul className="space-y-2">
                {cat.whoNeedsIt.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <hr className="my-4 border-slate-200" />

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800 font-medium mb-3">Not sure which plan fits you?</p>
                <Link href="/quiz">
                  <Button size="sm" className="w-full">Take the Quiz</Button>
                </Link>
                <p className="text-xs text-slate-400 mt-2">Takes under 2 minutes</p>
              </div>
            </div>

            {/* Other categories */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3">Browse Other Plan Types</h3>
              <div className="space-y-1">
                {CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/plans/${c.slug}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 py-1.5 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span>{c.icon}</span>
                    {c.name}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
