'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Loader2, ChevronRight, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Mail, Phone,
} from 'lucide-react';
import { isValidSSN, formatSSNInput, formatPhoneInput } from '@/lib/ssn';
import type {
  A360JourneyInfo, A360JourneyPhase, A360QuotingField, A360PlanCard, A360RefineResult,
} from '@/types/agent360';

// ─────────────────────────────────────────────
// Field-visibility logic — same rule coverpath's flat live-quote page uses
// (src/app/live-quote/[productId]/page.tsx's matchesDependency), reused
// here for phase 2's product_quoting_fields.
// ─────────────────────────────────────────────

function matchesDependency(field: A360QuotingField, values: Record<string, string>, zipState: string | null): boolean {
  if (field.depends_on_state && zipState !== field.depends_on_state) return false;
  if (!field.depends_on_field_key) return true;
  const allowed = field.depends_on_values ?? [];
  if (allowed.length === 0) return true;
  return allowed.includes(values[field.depends_on_field_key]);
}

const SELECT_OPTIONS: Record<string, { label: string; value: string }[]> = {
  sex: [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ],
};

const inputClass =
  'w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

type Step = 'loading' | 'not-found' | 1 | 2 | 3 | 'success';

export default function JourneyPage() {
  const { slug } = useParams<{ slug: string }>();

  const [step, setStep] = useState<Step>('loading');
  const [info, setInfo] = useState<A360JourneyInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quick, setQuick] = useState({ first_name: '', last_name: '', date_of_birth: '', sex: '' });
  const [zip, setZip] = useState('');
  const [zipState, setZipState] = useState<string | null>(null);
  const [cards, setCards] = useState<A360PlanCard[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<A360PlanCard | null>(null);

  const [refineAnswers, setRefineAnswers] = useState<Record<string, string>>({});
  const [refineResult, setRefineResult] = useState<A360RefineResult | null>(null);

  const [member, setMember] = useState({ email: '', phone: '', address: '', city: '', state: '', ssn: '' });
  const [spouse, setSpouse] = useState({ first_name: '', last_name: '' });
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/a360-journey/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: A360JourneyInfo | null) => {
        if (json) {
          setInfo(json);
          setStep(1);
        } else {
          setStep('not-found');
        }
      })
      .catch(() => setStep('not-found'));
  }, [slug]);

  const refinePhase: A360JourneyPhase | undefined = info?.journey.phases.find((p) => p.phase_type === 'refine');
  const quickPhase = info?.journey.phases.find((p) => p.phase_type === 'quick_quote');
  const identityPhase = info?.journey.phases.find((p) => p.phase_type === 'identity_submit');
  const hasSpouse = refineAnswers.has_spouse === 'true';

  async function submitQuickQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!info) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/a360-journey-quick-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, agent_id: info.agent_id, session_token: info.session_token,
          consumer_data: { ...quick, zip },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to get quotes');
      setCards(data.plans ?? []);
      setZipState(data.zip_state ?? null);
      setMember((m) => ({ ...m, state: data.zip_state ?? m.state }));
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A network error occurred. Please try again.');
    }
    setSubmitting(false);
  }

  function updateRefineField(key: string, value: string) {
    setRefineAnswers((prev) => {
      const next = { ...prev, [key]: value };
      for (const f of refinePhase?.fields ?? []) {
        if (f.depends_on_field_key === key && !matchesDependency(f, next, zipState)) {
          delete next[f.field_key];
        }
      }
      return next;
    });
  }

  async function submitRefine(e: React.FormEvent) {
    e.preventDefault();
    if (!info || !selectedPlan) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/a360-journey-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, agent_id: info.agent_id, session_token: info.session_token,
          selected_plan_id: selectedPlan.plan_id,
          consumer_data: { ...quick, zip, ...refineAnswers },
        }),
      });
      const data: A360RefineResult & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to compute rate');
      setRefineResult(data);
      if (!data.declined) setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A network error occurred. Please try again.');
    }
    setSubmitting(false);
  }

  async function submitFinalize(e: React.FormEvent) {
    e.preventDefault();
    if (!info) return;
    setSubmitting(true);
    setError(null);
    try {
      if (member.ssn && !isValidSSN(member.ssn)) throw new Error('Enter a valid 9-digit SSN (XXX-XX-XXXX).');
      const res = await fetch('/api/a360-journey-finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, agent_id: info.agent_id, session_token: info.session_token,
          member: {
            first_name: quick.first_name,
            last_name: quick.last_name,
            email: member.email,
            phone: member.phone || null,
            dob: quick.date_of_birth,
            sex: quick.sex,
            ssn: member.ssn || null,
            address: member.address || null,
            city: member.city || null,
            state: member.state || null,
            zip,
          },
          spouse: hasSpouse && spouse.first_name ? spouse : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to submit application');
      setApplicationNumber(data.application_number);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A network error occurred. Please try again.');
    }
    setSubmitting(false);
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (step === 'not-found' || !info) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-500 mb-4">This quote link is no longer available.</p>
          <Link href="/plans" className="text-blue-600 hover:underline text-sm font-medium">← Browse all plans</Link>
        </div>
      </div>
    );
  }

  const STEP_LABELS = ['Quick Quote', 'Refine', 'Apply', 'Done'];
  const stepIndex = step === 'success' ? 3 : (step as number) - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Link href="/plans" className="hover:text-blue-600">Plans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium">{info.journey.public_title || info.journey.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
              <Zap className="w-3 h-3" /> Guided Quote
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{info.journey.public_title || info.journey.name}</h1>
          {info.journey.public_description && <p className="text-slate-500 text-sm mt-1">{info.journey.public_description}</p>}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-1">
          {STEP_LABELS.map((label, idx) => (
            <div key={label} className="flex items-center shrink-0">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                stepIndex > idx ? 'bg-teal-600 text-white' : stepIndex === idx ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {stepIndex > idx ? '✓' : idx + 1}
              </div>
              <span className={`ml-1.5 text-xs hidden sm:block ${stepIndex === idx ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>{label}</span>
              {idx < STEP_LABELS.length - 1 && <div className="h-px w-4 sm:w-8 bg-slate-200 mx-1.5" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={submitQuickQuote} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">{quickPhase?.title || 'Quick Quote'}</h2>
            {quickPhase?.description && <p className="text-sm text-slate-500">{quickPhase.description}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                <input required className={inputClass} value={quick.first_name} onChange={(e) => setQuick({ ...quick, first_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                <input required className={inputClass} value={quick.last_name} onChange={(e) => setQuick({ ...quick, last_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                <input required type="date" className={inputClass} value={quick.date_of_birth} onChange={(e) => setQuick({ ...quick, date_of_birth: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sex at Birth <span className="text-red-500">*</span></label>
                <select required className={inputClass} value={quick.sex} onChange={(e) => setQuick({ ...quick, sex: e.target.value })}>
                  <option value="">Select…</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ZIP Code <span className="text-red-500">*</span></label>
                <input required inputMode="numeric" maxLength={5} className={inputClass} value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" /> Get My Rate</>}
            </button>
            <p className="text-center text-xs text-slate-400">No commitment required. Your information is kept private.</p>
          </form>
        )}

        {step === 2 && !selectedPlan && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900">
                {cards.length > 0 ? `We found ${cards.length} plan${cards.length !== 1 ? 's' : ''} for you` : 'No plans available for this ZIP code'}
              </h2>
              {cards.length === 0 && <p className="text-slate-500 text-sm mt-1">Please try a different ZIP code, or call an agent for assistance.</p>}
            </div>
            <div className="space-y-3">
              {cards.map((c) => (
                <button
                  key={c.plan_id}
                  onClick={() => setSelectedPlan(c)}
                  className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-400 transition-colors text-left flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{c.plan_name}</p>
                    <p className="text-xs text-slate-500">{c.term_days}-day term · {c.state}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-extrabold text-blue-700">${c.cheapest_rate.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">per month, starting at</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {step === 2 && selectedPlan && (
          <form onSubmit={submitRefine} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{refinePhase?.title || 'Refine Your Coverage'}</h2>
              <button type="button" onClick={() => { setSelectedPlan(null); setRefineResult(null); }} className="text-sm text-blue-600 hover:underline">
                Change plan
              </button>
            </div>
            <p className="text-sm text-slate-500">
              {refinePhase?.description} Selected: <strong className="text-slate-700">{selectedPlan.plan_name}</strong>
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {(refinePhase?.fields ?? [])
                .filter((f) => matchesDependency(f, refineAnswers, zipState))
                .map((f) => (
                  <div key={f.id} className={f.field_type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {f.field_label}{f.is_required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {f.field_type === 'boolean' ? (
                      <select required={f.is_required} className={inputClass} value={refineAnswers[f.field_key] ?? ''} onChange={(e) => updateRefineField(f.field_key, e.target.value)}>
                        <option value="">Select…</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : f.field_type === 'select' ? (
                      <select required={f.is_required} className={inputClass} value={refineAnswers[f.field_key] ?? ''} onChange={(e) => updateRefineField(f.field_key, e.target.value)}>
                        <option value="">Select…</option>
                        {(f.options?.length
                          ? (f.options as (string | { value: string; label: string })[]).map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
                          : SELECT_OPTIONS[f.field_key] ?? []
                        ).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type={f.field_type === 'date' ? 'date' : f.field_type === 'number' ? 'number' : 'text'}
                        required={f.is_required}
                        className={inputClass}
                        value={refineAnswers[f.field_key] ?? ''}
                        onChange={(e) => updateRefineField(f.field_key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
            </div>

            {refineResult?.declined && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{refineResult.declined_reason || 'This applicant is not eligible for coverage based on the answers provided.'}</p>
              </div>
            )}

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get My Real Rate <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {step === 3 && refineResult && !refineResult.declined && (
          <form onSubmit={submitFinalize} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">{identityPhase?.title || 'Complete Your Application'}</h2>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="font-bold text-blue-900">{selectedPlan?.plan_name}</p>
              <p className="text-blue-700 text-sm">${refineResult.rate.toFixed(2)}/month · {refineResult.issue_tier}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {info.journey.collect_email && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input required type="email" className={inputClass} value={member.email} onChange={(e) => setMember({ ...member, email: e.target.value })} />
                </div>
              )}
              {info.journey.collect_phone && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Daytime Phone</label>
                  <input type="tel" inputMode="numeric" className={inputClass} value={member.phone} onChange={(e) => setMember({ ...member, phone: formatPhoneInput(e.target.value) })} placeholder="(XXX) XXX-XXXX" />
                </div>
              )}
              {info.journey.collect_address && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Street Address</label>
                    <input className={inputClass} value={member.address} onChange={(e) => setMember({ ...member, address: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                    <input className={inputClass} value={member.city} onChange={(e) => setMember({ ...member, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                    <input className={inputClass} value={member.state} onChange={(e) => setMember({ ...member, state: e.target.value })} placeholder="2-letter code" />
                  </div>
                </>
              )}
              {info.journey.collect_ssn && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Social Security Number</label>
                  <input inputMode="numeric" maxLength={11} className={inputClass} value={member.ssn} onChange={(e) => setMember({ ...member, ssn: formatSSNInput(e.target.value) })} placeholder="XXX-XX-XXXX" />
                </div>
              )}
            </div>

            {hasSpouse && (
              <div className="border-t pt-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">Spouse</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                    <input className={inputClass} value={spouse.first_name} onChange={(e) => setSpouse({ ...spouse, first_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                    <input className={inputClass} value={spouse.last_name} onChange={(e) => setSpouse({ ...spouse, last_name: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center">
              By submitting, you authorize us to process your enrollment application. Your information is encrypted and secure.
            </p>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5" /> Submit Application</>}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && applicationNumber && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-5">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-teal-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Application Submitted!</h2>
              <p className="text-slate-500 text-sm mt-1">Application #{applicationNumber}</p>
            </div>
            {info.agent && (
              <div className="bg-slate-50 rounded-xl p-4 text-left space-y-1.5">
                <p className="text-xs text-slate-500">Your agent will be in touch:</p>
                <p className="font-semibold text-slate-900">{info.agent.first_name} {info.agent.last_name}</p>
                <p className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4" /> {info.agent.email}</p>
                {info.agent.phone && <p className="flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4" /> {info.agent.phone}</p>}
              </div>
            )}
            <Link href="/plans" className="inline-block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
              Browse More Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
