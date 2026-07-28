import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, HelpCircle, Zap } from 'lucide-react';
import { getCategoryBySlug, CATEGORY_SLUGS } from '@/lib/categories';
import { getPlansByCategory } from '@/lib/plans';
import { fetchA360Products } from '@/lib/agent360';
import { PlanCard } from '@/components/plans/plan-card';
import { Agent360ProductCard } from '@/components/plans/agent360-product-card';
import { Button } from '@/components/ui/button';
import type { A360Product } from '@/types/agent360';

export const dynamic = 'force-dynamic';

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: Props) {
  const cat = await getCategoryBySlug(params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} Plans — CoverPath`,
    description: cat.description,
  };
}

function matchesCategory(product: A360Product, slug: string): boolean {
  const pc = product.category.toLowerCase();
  const sc = slug.toLowerCase();
  return pc === sc || pc.includes(sc) || sc.includes(pc);
}

export default async function CategoryPage({ params }: Props) {
  const [cat, plans, { data: allLive }] = await Promise.all([
    getCategoryBySlug(params.category),
    getPlansByCategory(params.category),
    fetchA360Products(),
  ]);

  if (!cat) notFound();

  const liveProducts = allLive.filter((p) => matchesCategory(p, params.category));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="lg:col-span-2">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">What is {cat.name} Insurance?</h2>
              <p className="text-slate-600 leading-relaxed">{cat.longDescription}</p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Available Plans</h2>
                <span className="text-sm text-slate-500">{plans.length} option{plans.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>

            {liveProducts.length > 0 && (
              <section className="mt-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Live Rated Products</h2>
                </div>
                <p className="text-slate-500 text-sm mb-5">
                  These products are priced in real time based on your details — get an accurate rate in seconds.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {liveProducts.map((product) => (
                    <Agent360ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

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

          <div className="space-y-6">
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

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3">Browse Other Plan Types</h3>
              <div className="space-y-1">
                {CATEGORY_SLUGS.filter((s) => s !== cat.slug).map((slug) => (
                  <Link
                    key={slug}
                    href={`/plans/${slug}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 py-1.5 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
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
