'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Zap, Loader2 } from 'lucide-react';
import { PlanCard } from '@/components/plans/plan-card';
import { Agent360ProductCard } from '@/components/plans/agent360-product-card';
import { PlanFilters, type FilterState } from '@/components/plans/plan-filters';
import { getAllPlans } from '@/lib/plans';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';
import type { Plan, PlanCategory } from '@/types';
import type { A360Product } from '@/types/agent360';

function PlansContent() {
  const searchParams = useSearchParams();
  const allPlans = getAllPlans();

  const [liveProducts, setLiveProducts] = useState<A360Product[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    fetch('/api/a360-products')
      .then((r) => r.json())
      .then((json) => setLiveProducts(json.data ?? []))
      .catch(() => setLiveProducts([]))
      .finally(() => setLiveLoading(false));
  }, []);

  const initialCategories = useMemo(() => {
    const cats = searchParams.get('categories');
    if (!cats) return [] as PlanCategory[];
    return cats.split(',').filter(Boolean) as PlanCategory[];
  }, [searchParams]);

  const initialBudget = useMemo(() => {
    const b = searchParams.get('budget');
    return b ? parseInt(b) : null;
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategories,
    maxBudget: initialBudget,
    sort: 'popular',
  });
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let plans: Plan[] = allPlans;

    if (filters.categories.length > 0) {
      plans = plans.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.maxBudget !== null && filters.maxBudget < 9999) {
      plans = plans.filter((p) => p.monthlyPremium <= filters.maxBudget!);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      plans = plans.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.carrier.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q),
      );
    }

    switch (filters.sort) {
      case 'price-asc':
        plans = [...plans].sort((a, b) => a.monthlyPremium - b.monthlyPremium);
        break;
      case 'price-desc':
        plans = [...plans].sort((a, b) => b.monthlyPremium - a.monthlyPremium);
        break;
      case 'rating':
        plans = [...plans].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        plans = [...plans].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    return plans;
  }, [allPlans, filters, search]);

  // Filter live products by search term (category filters don't apply — different taxonomy)
  const filteredLive = useMemo(() => {
    if (!search.trim()) return liveProducts;
    const q = search.toLowerCase();
    return liveProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.carrier?.name ?? '').toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [liveProducts, search]);

  const totalShown = filtered.length + filteredLive.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Browse All Plans</h1>
          <p className="text-slate-500 mt-1">
            Compare {allPlans.length}+ plans across 7 coverage categories
            {liveProducts.length > 0 && ` · ${liveProducts.length} live rated product${liveProducts.length !== 1 ? 's' : ''} available`}
          </p>

          {/* Category quick links */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/plans/${cat.slug}`}
                className="text-xs font-medium px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-full transition-colors border border-slate-200"
              >
                {cat.shortName}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <PlanFilters filters={filters} onChange={setFilters} totalCount={totalShown} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search plans, carriers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <span className="text-sm text-slate-500 self-center whitespace-nowrap">
                {totalShown} plan{totalShown !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Static plans grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} showCategory />
                ))}
              </div>
            ) : (
              !liveLoading && filteredLive.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold text-slate-600">No plans match your filters</p>
                  <p className="text-sm mt-1">Try adjusting your budget or removing a filter</p>
                </div>
              )
            )}

            {/* Live Rated Products section */}
            {(liveLoading || filteredLive.length > 0) && (
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">Live Rated Products</h2>
                  <span className="text-xs text-slate-500 bg-blue-50 border border-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded-full">
                    Real-time pricing
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-5">
                  These products are rated live based on your personal details — get an accurate quote in seconds.
                </p>

                {liveLoading ? (
                  <div className="flex items-center gap-3 py-8 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading live products…</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredLive.map((product) => (
                      <Agent360ProductCard key={product.id} product={product} showCategory />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <PlansContent />
    </Suspense>
  );
}
