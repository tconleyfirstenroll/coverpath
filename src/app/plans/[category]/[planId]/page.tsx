import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, CheckCircle2, XCircle, ChevronRight, Shield, Phone } from 'lucide-react';
import { getPlanById, getPlansByCategory, PLANS } from '@/lib/plans';
import { getCategoryBySlug } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlanCard } from '@/components/plans/plan-card';
import { cn } from '@/lib/utils';

interface Props {
  params: { category: string; planId: string };
}

export function generateStaticParams() {
  return PLANS.map((p) => ({ category: p.category, planId: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const plan = getPlanById(params.planId);
  if (!plan) return {};
  return {
    title: `${plan.name} — ${plan.carrier} | CoverPath`,
    description: plan.tagline,
  };
}

export default function PlanDetailPage({ params }: Props) {
  const plan = getPlanById(params.planId);
  if (!plan || plan.category !== params.category) notFound();

  const cat = getCategoryBySlug(plan.category);
  const relatedPlans = getPlansByCategory(plan.category)
    .filter((p) => p.id !== plan.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Link href="/plans" className="hover:text-blue-600">Plans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/plans/${plan.category}`} className="hover:text-blue-600">{cat?.name ?? plan.category}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium">{plan.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan header card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  {plan.badge && <Badge variant="teal" className="mb-2">{plan.badge}</Badge>}
                  {plan.popular && <Badge variant="popular" className="mb-2 ml-1">Most Popular</Badge>}
                  <h1 className="text-2xl font-extrabold text-slate-900">{plan.name}</h1>
                  <p className="text-slate-500">{plan.carrier}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn('w-4 h-4', i < Math.floor(plan.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-slate-700">{plan.rating}</span>
                    <span className="text-sm text-slate-400">({plan.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <p className="text-slate-600 italic mt-3">&quot;{plan.tagline}&quot;</p>
                </div>
                <div className="sm:text-right">
                  <div className="text-3xl font-extrabold text-blue-600">${plan.monthlyPremium}</div>
                  <div className="text-sm text-slate-500">/month</div>
                  {plan.annualDeductible !== undefined && (
                    <div className="text-xs text-slate-500 mt-1">
                      ${plan.annualDeductible.toLocaleString()} annual deductible
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {plan.highlights.map((h) => (
                  <span key={h} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Coverage Details</h2>
              <div className="divide-y divide-slate-100">
                {plan.benefits.map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      {b.included
                        ? <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                        : <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                      }
                      <span className={cn('text-sm', b.included ? 'text-slate-700' : 'text-slate-400')}>{b.label}</span>
                    </div>
                    <span className={cn('text-sm font-semibold text-right max-w-[180px]', b.included ? 'text-slate-900' : 'text-slate-400')}>
                      {b.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional details */}
              {(plan.coinsurance || plan.waitingPeriod || plan.maxBenefit) && (
                <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-3 gap-4">
                  {plan.coinsurance && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Coinsurance</div>
                      <div className="font-bold text-slate-900">{plan.coinsurance}</div>
                    </div>
                  )}
                  {plan.waitingPeriod && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Waiting Period</div>
                      <div className="font-bold text-slate-900">{plan.waitingPeriod}</div>
                    </div>
                  )}
                  {plan.maxBenefit && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Max Benefit</div>
                      <div className="font-bold text-slate-900 text-sm">{plan.maxBenefit}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* State availability */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" /> Availability
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                This plan is available in <strong>{plan.availableStates.length}</strong> states.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {plan.availableStates.map((s) => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{s}</span>
                ))}
              </div>
            </div>

            {/* Related plans */}
            {relatedPlans.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Other {cat?.shortName ?? ''} Plans</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {relatedPlans.map((p) => (
                    <PlanCard key={p.id} plan={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              {/* Enroll CTA */}
              <div className="bg-white rounded-2xl border border-blue-200 shadow-card p-5 text-center">
                <div className="text-3xl font-extrabold text-blue-600 mb-0.5">${plan.monthlyPremium}<span className="text-lg font-normal text-slate-400">/mo</span></div>
                <p className="text-xs text-slate-500 mb-4">All prices are estimates. Final rate based on age and state.</p>
                <Link href={`/enroll/${plan.id}`}>
                  <Button size="lg" className="w-full mb-2">Enroll Now</Button>
                </Link>
                <p className="text-xs text-slate-400">No commitment • Cancel anytime</p>
              </div>

              {/* Talk to agent */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
                <Phone className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-teal-900 mb-1">Have questions?</p>
                <p className="text-xs text-teal-700 mb-3">Our licensed agents are available Mon–Fri 8am–8pm ET</p>
                <a href="tel:18005551234">
                  <Button variant="secondary" size="sm" className="w-full">
                    Call 1-800-555-1234
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
