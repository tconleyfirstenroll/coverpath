'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Agent360ProductCard } from '@/components/plans/agent360-product-card';
import Link from 'next/link';
import type { CategoryMeta } from '@/types';
import type { A360Product } from '@/types/agent360';

interface PlansContentProps {
  initialPlans: unknown[];
  categories: CategoryMeta[];
}

function PlansInner({ categories }: PlansContentProps) {
  const [liveProducts, setLiveProducts] = useState<A360Product[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/a360-products')
      .then((r) => r.json())
      .then((json) => setLiveProducts(json.data ?? []))
      .catch(() => setLiveProducts([]))
      .finally(() => setLiveLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Browse All Plans</h1>
          <p className="text-slate-500 mt-1">
            Real-time rated products — get an accurate quote in seconds
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
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
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, carriers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          {!liveLoading && (
            <span className="text-sm text-slate-500 self-center whitespace-nowrap">
              {filteredLive.length} product{filteredLive.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div>

            {liveLoading ? (
              <div className="flex items-center gap-3 py-8 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading products…</span>
              </div>
            ) : filteredLive.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredLive.map((product) => (
                  <Agent360ProductCard key={product.id} product={product} showCategory />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-slate-600">No products match your search</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export function PlansContent(props: PlansContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <PlansInner {...props} />
    </Suspense>
  );
}
