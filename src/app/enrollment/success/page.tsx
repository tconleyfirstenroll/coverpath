'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Shield, Mail, ArrowRight, Loader2, FileText } from 'lucide-react';

interface ApplicationSummary {
  application_number: string;
  plan_name: string | null;
  product_name: string | null;
  monthly_premium: number | null;
  customer_first_name: string | null;
}

export default function EnrollmentSuccessPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('application_id');

  const [app, setApp] = useState<ApplicationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) { setLoading(false); return; }
    fetch(`/api/a360-application/${applicationId}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setApp(d); })
      .finally(() => setLoading(false));
  }, [applicationId]);

  const firstName = app?.customer_first_name;
  const premium = app?.monthly_premium ? `$${app.monthly_premium.toFixed(2)}/mo` : null;

  return (
    <div className="min-h-[calc(100vh-130px)] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Success card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Blue brand bar */}
          <div className="bg-blue-600 px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <CheckCircle2 className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Payment Successful!</h1>
            {firstName && (
              <p className="text-blue-100 mt-1 text-sm">Thank you, {firstName}. You&apos;re all set.</p>
            )}
          </div>

          <div className="px-8 py-7 space-y-6">

            {/* Application reference */}
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              </div>
            ) : app ? (
              <div className="rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-200 text-sm">
                {app.product_name && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-slate-500">Product</span>
                    <span className="font-semibold text-slate-900">{app.product_name}</span>
                  </div>
                )}
                {app.plan_name && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-slate-500">Plan</span>
                    <span className="font-semibold text-slate-900">{app.plan_name}</span>
                  </div>
                )}
                {premium && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-slate-500">Monthly Premium</span>
                    <span className="font-bold text-blue-600">{premium}</span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Application #</span>
                  <span className="font-mono font-semibold text-slate-900 text-xs tracking-wide">
                    {app.application_number}
                  </span>
                </div>
              </div>
            ) : null}

            {/* What happens next */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">What happens next</p>

              <div className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Policy certificate on its way</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Your policy certificate is being generated and will arrive in your inbox shortly via email.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Coverage is active</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Your first month&apos;s premium payment has been received and your coverage is now in effect.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Keep your application number</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Save your application number for your records. Our team is available if you have any questions.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/plans"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
              >
                Browse More Plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Trust footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Questions? Call us at{' '}
          <a href="tel:18005551234" className="text-blue-600 font-semibold hover:underline">
            1-800-555-1234
          </a>
          {' '}Mon–Fri 8am–8pm ET
        </p>
      </div>
    </div>
  );
}
