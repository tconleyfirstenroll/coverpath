'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Loader2, Building2, AlertCircle,
  CheckCircle2, RotateCcw, Phone, ChevronRight,
} from 'lucide-react';
import type { A360Product, A360QuoteResult } from '@/types/agent360';

type Step = 'loading' | 'not-found' | 'form' | 'calculating' | 'results' | 'error';

const CATEGORY_LABELS: Record<string, string> = {
  life: 'Life Insurance',
  health: 'Health Insurance',
  dental: 'Dental Insurance',
  vision: 'Vision Insurance',
  auto: 'Auto Insurance',
  home: 'Home Insurance',
  annuity: 'Annuity',
};

export default function LiveQuotePage() {
  const { productId } = useParams<{ productId: string }>();

  const [step, setStep] = useState<Step>('loading');
  const [product, setProduct] = useState<A360Product | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [quoteResult, setQuoteResult] = useState<A360QuoteResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/a360-products/${productId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setProduct(json.data);
          setStep('form');
        } else {
          setStep('not-found');
        }
      })
      .catch(() => setStep('not-found'));
  }, [productId]);

  const sortedFields = [...(product?.quoting_fields ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('calculating');
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/a360-quote/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consumer_data: formValues }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error ?? 'Unable to calculate rate. Please try again.');
        setStep('error');
        return;
      }
      setQuoteResult(json);
      setStep('results');
      // Fire-and-forget — capture lead in agent360; never block or fail the UI
      fetch('/api/a360-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          product_name: product?.name ?? null,
          consumer_data: formValues,
          quote_result: json,
        }),
      }).catch(() => {});
    } catch {
      setErrorMessage('A network error occurred. Please check your connection and try again.');
      setStep('error');
    }
  };

  const reset = () => {
    setStep('form');
    setFormValues({});
    setQuoteResult(null);
    setErrorMessage(null);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (step === 'not-found' || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-500 mb-4">This product is no longer available.</p>
          <Link href="/plans" className="text-blue-600 hover:underline text-sm font-medium">
            ← Browse all plans
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Link href="/plans" className="hover:text-blue-600">Plans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium">Get My Rate</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  <Zap className="w-3 h-3" /> Live Rated
                </span>
                <span className="text-xs text-slate-500 capitalize">{categoryLabel}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{product.name}</h1>
              {product.carrier && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">{product.carrier.name}</span>
                </div>
              )}
            </div>
            {step !== 'form' && step !== 'calculating' && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start over
              </button>
            )}
          </div>
        </div>

        {/* ── Step: Form ──────────────────────────────────────────────────── */}
        {(step === 'form' || step === 'calculating') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Get Your Personal Rate</h2>
            <p className="text-slate-500 text-sm mb-6">
              Fill in your details below and we&apos;ll calculate your rate instantly.
            </p>

            {sortedFields.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No additional information required. Please contact us for pricing.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {sortedFields.map((field) => (
                    <div key={field.id} className={field.field_type === 'textarea' ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {field.field_label}
                        {field.is_required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.field_type === 'boolean' ? (
                        <select
                          value={formValues[field.field_key] ?? ''}
                          onChange={(e) => setFormValues((p) => ({ ...p, [field.field_key]: e.target.value }))}
                          required={field.is_required}
                          className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Select…</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : field.field_type === 'textarea' ? (
                        <textarea
                          value={formValues[field.field_key] ?? ''}
                          onChange={(e) => setFormValues((p) => ({ ...p, [field.field_key]: e.target.value }))}
                          required={field.is_required}
                          rows={3}
                          placeholder={field.field_label}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                      ) : (
                        <input
                          type={
                            field.field_type === 'date' ? 'date'
                            : field.field_type === 'number' ? 'number'
                            : field.field_type === 'email' ? 'email'
                            : field.field_type === 'phone' ? 'tel'
                            : 'text'
                          }
                          value={formValues[field.field_key] ?? ''}
                          onChange={(e) => setFormValues((p) => ({ ...p, [field.field_key]: e.target.value }))}
                          required={field.is_required}
                          placeholder={field.field_label}
                          className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={step === 'calculating'}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-base"
                >
                  {step === 'calculating' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Calculating your rate…</>
                  ) : (
                    <><Zap className="w-5 h-5" /> Calculate My Rate</>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  No commitment required. Your information is kept private.
                </p>
              </form>
            )}
          </div>
        )}

        {/* ── Step: Error ──────────────────────────────────────────────────── */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="font-semibold text-slate-900">We couldn&apos;t calculate your rate</p>
            <p className="text-sm text-slate-500">{errorMessage}</p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </button>
          </div>
        )}

        {/* ── Step: Results ────────────────────────────────────────────────── */}
        {step === 'results' && quoteResult && (
          <div className="space-y-5">
            {/* Rate result */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Your Rate is Ready</span>
                </div>
                {quoteResult.rate ? (
                  <>
                    <div className="text-5xl font-extrabold mt-2">
                      ${quoteResult.rate.final_rate.toFixed(2)}
                    </div>
                    <div className="text-blue-200 text-sm mt-1">estimated monthly premium</div>
                  </>
                ) : (
                  <p className="text-blue-100 mt-2 text-sm">
                    Rate calculated — see available plans below
                  </p>
                )}
              </div>

              {/* Rating factors */}
              {quoteResult.rate && quoteResult.rate.factors.length > 0 && (
                <div className="p-5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Rating Factors</p>
                  <div className="divide-y divide-slate-100">
                    {quoteResult.rate.factors.map((f, i) => (
                      <div key={i} className="flex justify-between py-2.5 text-sm">
                        <span className="text-slate-600">{f.label}</span>
                        <span className="font-semibold text-slate-900">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Available plans */}
            {quoteResult.plans.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">Available Plans</p>
                <div className="space-y-2">
                  {quoteResult.plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-800">{plan.name}</span>
                      {plan.base_premium != null && (
                        <span className="text-sm font-bold text-blue-700">
                          ${plan.base_premium.toFixed(2)}/mo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-teal-500 mx-auto" />
              <div>
                <p className="font-bold text-slate-900 text-lg">Ready to enroll?</p>
                <p className="text-slate-500 text-sm mt-1">
                  Speak with a licensed agent to complete your application in minutes.
                </p>
              </div>
              <a
                href="tel:18005551234"
                className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call 1-800-555-1234
              </a>
              <p className="text-xs text-slate-400">
                Licensed agents available Mon–Fri 8am–8pm ET
              </p>
              <button
                onClick={reset}
                className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Recalculate with different details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
