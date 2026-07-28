import Link from 'next/link';
import { Zap, ChevronRight, BadgeCheck, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { A360Product } from '@/types/agent360';

interface Agent360ProductCardProps {
  product: A360Product;
  showCategory?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  life: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  health: 'text-green-600 bg-green-50 border-green-100',
  auto: 'text-orange-600 bg-orange-50 border-orange-100',
  dental: 'text-amber-600 bg-amber-50 border-amber-100',
  vision: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  annuity: 'text-purple-600 bg-purple-50 border-purple-100',
};

const PLAN_HIGHLIGHTS: Record<string, string[]> = {
  life: ['Death benefit protection', 'Cash value options', 'Family security'],
  health: ['Comprehensive coverage', 'Network access', 'Preventive care'],
  dental: ['Preventive care covered', 'Major procedures', 'Large network'],
  vision: ['Annual eye exam', 'Frames & contacts', 'LASIK savings'],
  annuity: ['Guaranteed income', 'Tax-deferred growth', 'Principal protection'],
};

function getHighlights(product: A360Product): string[] {
  const custom = PLAN_HIGHLIGHTS[product.category];
  if (custom) return custom;
  const plans = product.plans.filter((p) => p.status === 'active').slice(0, 3);
  if (plans.length) return plans.map((p) => p.name);
  return ['Customized coverage', 'Live rated pricing', 'Apply in minutes'];
}

export function Agent360ProductCard({ product, showCategory = false }: Agent360ProductCardProps) {
  const highlights = getHighlights(product);
  const activePlans = product.plans.filter((p) => p.status === 'active');
  const lowestPremium = activePlans.reduce<number | null>((min, p) => {
    if (p.base_premium == null) return min;
    return min === null ? p.base_premium : Math.min(min, p.base_premium);
  }, null);

  const catColor = CATEGORY_COLORS[product.category] ?? 'text-blue-600 bg-blue-50 border-blue-100';

  return (
    <Card className="hover:shadow-card-hover transition-shadow duration-200 border-slate-200 ring-2 ring-blue-400/40 relative overflow-hidden">
      {/* Live rate banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1.5">
        <Zap className="w-3 h-3" />
        Live Rated Product
      </div>

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base leading-tight">{product.name}</h3>
            {product.carrier && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3 h-3 text-slate-400" />
                <p className="text-sm text-slate-500">{product.carrier.name}</p>
              </div>
            )}
            {showCategory && (
              <span className={cn('inline-block text-xs font-medium mt-1 px-2 py-0.5 rounded-full border capitalize', catColor)}>
                {product.category}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            {lowestPremium != null ? (
              <>
                <div className="text-2xl font-extrabold text-slate-900">${lowestPremium}</div>
                <div className="text-xs text-slate-500">from/month</div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-blue-600">Rate</div>
                <div className="text-xs text-slate-500">on request</div>
              </>
            )}
          </div>
        </div>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-4">
          {highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              {h}
            </li>
          ))}
        </ul>

        {/* Plan count */}
        {activePlans.length > 0 && (
          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-4">
            {activePlans.length} plan option{activePlans.length !== 1 ? 's' : ''} available
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/live-quote/${product.id}`} className="flex-1">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Get My Rate
            </button>
          </Link>
          <Link href={`/live-quote/${product.id}`}>
            <button className="border border-slate-200 hover:border-slate-300 p-2 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
