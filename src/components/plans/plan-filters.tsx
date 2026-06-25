'use client';
import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PlanCategory } from '@/types';

const CATEGORIES: { slug: PlanCategory; label: string }[] = [
  { slug: 'short-term-medical', label: 'Short Term Medical' },
  { slug: 'hospital-indemnity', label: 'Hospital Indemnity' },
  { slug: 'cancer', label: 'Cancer' },
  { slug: 'dental', label: 'Dental' },
  { slug: 'vision', label: 'Vision' },
  { slug: 'prescription', label: 'Prescription' },
  { slug: 'critical-illness', label: 'Critical Illness' },
];

const BUDGET_OPTIONS = [
  { label: 'Under $50', value: 50 },
  { label: '$50–$100', value: 100 },
  { label: '$100–$200', value: 200 },
  { label: '$200–$350', value: 350 },
  { label: '$350+', value: 9999 },
];

export interface FilterState {
  categories: PlanCategory[];
  maxBudget: number | null;
  sort: 'price-asc' | 'price-desc' | 'rating' | 'popular';
}

interface PlanFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalCount: number;
}

export function PlanFilters({ filters, onChange, totalCount }: PlanFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (slug: PlanCategory) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  const setBudget = (value: number | null) => {
    onChange({ ...filters, maxBudget: value === filters.maxBudget ? null : value });
  };

  const activeCount =
    filters.categories.length + (filters.maxBudget !== null ? 1 : 0);

  const resetFilters = () =>
    onChange({ categories: [], maxBudget: null, sort: 'popular' });

  const filterPanel = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-2 uppercase tracking-wide">Sort By</h3>
        <div className="space-y-1">
          {[
            { value: 'popular', label: 'Most Popular' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, sort: opt.value as FilterState['sort'] })}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                filters.sort === opt.value
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-2 uppercase tracking-wide">Plan Type</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={cn(
                'w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition-colors',
                filters.categories.includes(cat.slug)
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                filters.categories.includes(cat.slug) ? 'bg-blue-600 border-blue-600' : 'border-slate-300',
              )}>
                {filters.categories.includes(cat.slug) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-2 uppercase tracking-wide">Monthly Budget</h3>
        <div className="space-y-1">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBudget(opt.value)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                filters.maxBudget === opt.value
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full text-slate-500">
          <X className="w-3.5 h-3.5 mr-1" /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-slate-800">Filters</span>
            {activeCount > 0 && (
              <Badge variant="default" className="text-xs">{activeCount}</Badge>
            )}
          </div>
          {filterPanel}
        </div>
      </div>

      {/* Mobile filter button + drawer */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {activeCount > 0 && <Badge variant="default" className="text-xs">{activeCount}</Badge>}
        </Button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Filters</h2>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterPanel}
              <Button onClick={() => setMobileOpen(false)} className="w-full mt-6">
                View {totalCount} Plans
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
