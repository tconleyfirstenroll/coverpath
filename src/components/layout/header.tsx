'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Phone, Menu, X, ChevronDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    label: 'Plans',
    href: '/plans',
    children: [
      { label: 'Short Term Medical', href: '/plans/short-term-medical' },
      { label: 'Hospital Indemnity', href: '/plans/hospital-indemnity' },
      { label: 'Cancer Plans', href: '/plans/cancer' },
      { label: 'Dental Plans', href: '/plans/dental' },
      { label: 'Vision Plans', href: '/plans/vision' },
      { label: 'Prescription Plans', href: '/plans/prescription' },
      { label: 'Critical Illness', href: '/plans/critical-illness' },
    ],
  },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About Us', href: '/about' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-blue-700 text-white text-xs py-1.5 text-center">
        <span className="font-medium">Licensed agents available Mon–Fri 8am–8pm ET</span>
        <span className="mx-3 opacity-40">|</span>
        <a href="tel:18005551234" className="font-bold hover:underline">1-800-555-1234</a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Cover<span className="text-blue-600">Path</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setPlansOpen(true)}
                  onMouseLeave={() => setPlansOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                    {link.label}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', plansOpen && 'rotate-180')} />
                  </button>
                  {plansOpen && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <Link href="/plans" className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                          Browse all plans →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:18005551234"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              1-800-555-1234
            </a>
            <Button asChild size="default">
              <Link href="/quiz">Find My Plan</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          <Link href="/plans" className="block px-3 py-2 text-sm font-semibold text-blue-600">Browse All Plans</Link>
          {NAV_LINKS[0].children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-2 text-sm text-slate-600 hover:text-blue-600"
            >
              {child.label}
            </Link>
          ))}
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href!}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <a href="tel:18005551234" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700">
              <Phone className="w-4 h-4" /> 1-800-555-1234
            </a>
            <Button asChild className="w-full mt-2">
              <Link href="/quiz">Find My Plan</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
