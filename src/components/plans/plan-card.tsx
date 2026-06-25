import Link from 'next/link';
import { Star, Shield, ChevronRight, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  showCategory?: boolean;
}

export function PlanCard({ plan, showCategory = false }: PlanCardProps) {
  return (
    <Card className={cn('hover:shadow-card-hover transition-shadow duration-200 border-slate-200', plan.popular && 'ring-2 ring-blue-500')}>
      {plan.popular && (
        <div className="bg-blue-600 text-white text-xs font-bold text-center py-1.5 rounded-t-xl tracking-wide uppercase">
          Most Popular
        </div>
      )}
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {plan.badge && (
              <Badge variant="teal" className="mb-1.5 text-xs">{plan.badge}</Badge>
            )}
            <h3 className="font-bold text-slate-900 text-base leading-tight">{plan.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{plan.carrier}</p>
            {showCategory && (
              <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                {plan.category.replace(/-/g, ' ')}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-extrabold text-slate-900">${plan.monthlyPremium}</div>
            <div className="text-xs text-slate-500">/month</div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn('w-3.5 h-3.5', i < Math.floor(plan.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-700">{plan.rating}</span>
          <span className="text-xs text-slate-400">({plan.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-slate-600 mb-3 italic">&quot;{plan.tagline}&quot;</p>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-4">
          {plan.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              {h}
            </li>
          ))}
        </ul>

        {/* Key stat */}
        {plan.annualDeductible !== undefined && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-4">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Annual deductible: <strong className="text-slate-700">${plan.annualDeductible.toLocaleString()}</strong></span>
          </div>
        )}
        {plan.maxBenefit !== undefined && !plan.annualDeductible && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-4">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Max benefit: <strong className="text-slate-700">{plan.maxBenefit}</strong></span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/enroll/${plan.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              Enroll Now
            </Button>
          </Link>
          <Link href={`/plans/${plan.category}/${plan.id}`}>
            <Button variant="outline" size="sm" className="px-3">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
