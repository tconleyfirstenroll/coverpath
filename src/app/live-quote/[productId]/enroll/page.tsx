'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Loader2, User, UserPlus,
  Shield, ClipboardList, AlertCircle, ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface MemberForm {
  first_name: string; middle_name: string; last_name: string;
  address: string; city: string; state: string; zip: string;
  phone: string; email: string; ssn: string;
  dob: string; sex: string; height: string; weight: string;
  beneficiary_1: string; beneficiary_2: string;
}

interface SpouseForm {
  first_name: string; middle_name: string; last_name: string;
  phone: string; email: string; ssn: string;
  dob: string; sex: string; height: string; weight: string;
  beneficiary_1: string; beneficiary_2: string;
}

interface UWQuestions {
  q1_member: string; q1_spouse: string;
  q2_member: string; q2_spouse: string;
  q3_member: string; q3_spouse: string;
}

const EMPTY_MEMBER: MemberForm = {
  first_name: '', middle_name: '', last_name: '',
  address: '', city: '', state: '', zip: '',
  phone: '', email: '', ssn: '',
  dob: '', sex: '', height: '', weight: '',
  beneficiary_1: '', beneficiary_2: '',
};

const EMPTY_SPOUSE: SpouseForm = {
  first_name: '', middle_name: '', last_name: '',
  phone: '', email: '', ssn: '',
  dob: '', sex: '', height: '', weight: '',
  beneficiary_1: '', beneficiary_2: '',
};

const EMPTY_UW: UWQuestions = {
  q1_member: 'no', q1_spouse: 'no',
  q2_member: 'no', q2_spouse: 'no',
  q3_member: 'no', q3_spouse: 'no',
};

type Step = 1 | 2 | 3 | 4;

// ─────────────────────────────────────────────
// Field helpers
// ─────────────────────────────────────────────

const inputClass =
  'w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, required, type = 'text',
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={inputClass}
    />
  );
}

function SelectInput({
  value, onChange, options, required,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required={required} className={inputClass}>
      <option value="">Select…</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function MemberFields({ data, onChange }: {
  data: MemberForm; onChange: (field: keyof MemberForm, value: string) => void;
}) {
  const set = (k: keyof MemberForm) => (v: string) => onChange(k, v);
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="First Name" required><TextInput value={data.first_name} onChange={set('first_name')} required /></Field>
      <Field label="Middle Name"><TextInput value={data.middle_name} onChange={set('middle_name')} /></Field>
      <Field label="Last Name" required><TextInput value={data.last_name} onChange={set('last_name')} required /></Field>
      <Field label="Date of Birth" required><TextInput type="date" value={data.dob} onChange={set('dob')} required /></Field>
      <Field label="Sex at Birth" required>
        <SelectInput value={data.sex} onChange={set('sex')} required options={[
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
        ]} />
      </Field>
      <Field label="Email" required><TextInput type="email" value={data.email} onChange={set('email')} required /></Field>
      <Field label="Daytime Phone" required><TextInput type="tel" value={data.phone} onChange={set('phone')} required /></Field>
      <Field label="Social Security Number" required><TextInput value={data.ssn} onChange={set('ssn')} placeholder="XXX-XX-XXXX" required /></Field>
      <div className="sm:col-span-2">
        <Field label="Street Address" required><TextInput value={data.address} onChange={set('address')} required /></Field>
      </div>
      <Field label="City" required><TextInput value={data.city} onChange={set('city')} required /></Field>
      <Field label="State" required><TextInput value={data.state} onChange={set('state')} placeholder="GA" required /></Field>
      <Field label="Zip Code" required><TextInput value={data.zip} onChange={set('zip')} required /></Field>
      <Field label="Height (e.g. 5ft 10in)" required><TextInput value={data.height} onChange={set('height')} placeholder="5ft 10in" required /></Field>
      <Field label="Weight (lbs)" required><TextInput type="number" value={data.weight} onChange={set('weight')} required /></Field>
      <Field label="Beneficiary Name"><TextInput value={data.beneficiary_1} onChange={set('beneficiary_1')} /></Field>
      <Field label="Beneficiary Name #2"><TextInput value={data.beneficiary_2} onChange={set('beneficiary_2')} /></Field>
    </div>
  );
}

function SpouseFields({ data, onChange }: {
  data: SpouseForm; onChange: (field: keyof SpouseForm, value: string) => void;
}) {
  const set = (k: keyof SpouseForm) => (v: string) => onChange(k, v);
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="First Name" required><TextInput value={data.first_name} onChange={set('first_name')} required /></Field>
      <Field label="Middle Name"><TextInput value={data.middle_name} onChange={set('middle_name')} /></Field>
      <Field label="Last Name" required><TextInput value={data.last_name} onChange={set('last_name')} required /></Field>
      <Field label="Date of Birth" required><TextInput type="date" value={data.dob} onChange={set('dob')} required /></Field>
      <Field label="Sex at Birth" required>
        <SelectInput value={data.sex} onChange={set('sex')} required options={[
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
        ]} />
      </Field>
      <Field label="Email" required><TextInput type="email" value={data.email} onChange={set('email')} required /></Field>
      <Field label="Daytime Phone" required><TextInput type="tel" value={data.phone} onChange={set('phone')} required /></Field>
      <Field label="Social Security Number" required><TextInput value={data.ssn} onChange={set('ssn')} placeholder="XXX-XX-XXXX" required /></Field>
      <Field label="Height (e.g. 5ft 10in)" required><TextInput value={data.height} onChange={set('height')} placeholder="5ft 10in" required /></Field>
      <Field label="Weight (lbs)" required><TextInput type="number" value={data.weight} onChange={set('weight')} required /></Field>
      <Field label="Beneficiary Name"><TextInput value={data.beneficiary_1} onChange={set('beneficiary_1')} /></Field>
      <Field label="Beneficiary Name #2"><TextInput value={data.beneficiary_2} onChange={set('beneficiary_2')} /></Field>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

export default function ConsumerEnrollPage() {
  const { productId } = useParams<{ productId: string }>();
  const searchParams = useSearchParams();

  const planId = searchParams.get('plan_id') || '';
  const quoteId = searchParams.get('quote_id') || '';
  const planName = searchParams.get('plan_name') || 'Selected Plan';
  const rateStr = searchParams.get('rate') || '';
  const monthlyPremium = rateStr ? parseFloat(rateStr) : 0;
  const coverageAmount = planName.replace(' Coverage', '');

  const [step, setStep] = useState<Step>(1);
  const [member, setMember] = useState<MemberForm>({
    ...EMPTY_MEMBER,
    dob: searchParams.get('dob') || '',
    sex: searchParams.get('sex') || '',
  });
  const [addSpouse, setAddSpouse] = useState(false);
  const [spouse, setSpouse] = useState<SpouseForm>(EMPTY_SPOUSE);
  const [uwQ, setUwQ] = useState<UWQuestions>(EMPTY_UW);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ application_id: string; application_number: string; uw_hold: boolean } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateMember = (field: keyof MemberForm, value: string) =>
    setMember((prev) => ({ ...prev, [field]: value }));
  const updateSpouse = (field: keyof SpouseForm, value: string) =>
    setSpouse((prev) => ({ ...prev, [field]: value }));
  const updateUw = (field: keyof UWQuestions, value: string) =>
    setUwQ((prev) => ({ ...prev, [field]: value }));

  const stepLabels = ['Your Info', 'Spouse', 'Health Questions', 'Review'];

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body = {
        product_id: productId,
        plan_id: planId,
        quote_id: quoteId || undefined,
        monthly_premium: monthlyPremium,
        coverage_amount: coverageAmount,
        member,
        spouse: addSpouse ? spouse : null,
        uw_questions: {
          q1_member: uwQ.q1_member,
          q1_spouse: addSpouse ? uwQ.q1_spouse : undefined,
          q2_member: uwQ.q2_member,
          q2_spouse: addSpouse ? uwQ.q2_spouse : undefined,
          q3_member: uwQ.q3_member,
          q3_spouse: addSpouse ? uwQ.q3_spouse : undefined,
        },
      };

      const res = await fetch('/api/a360-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Enrollment failed');

      setResult(json);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Enrollment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Enrollment Submitted!</h2>
            <p className="text-slate-500 text-sm mt-1">Application #{result.application_number}</p>
          </div>

          {result.uw_hold ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left">
              <p className="font-semibold mb-1">Underwriting Review</p>
              <p>Your application has been received and is being reviewed by our underwriting team. We&apos;ll be in touch within 2–3 business days.</p>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-800 text-left">
              <p className="font-semibold mb-1">What Happens Next</p>
              <p>You&apos;ll receive an enrollment form by email to sign electronically. After signing, you&apos;ll complete your first month&apos;s payment to activate coverage.</p>
            </div>
          )}

          <Link
            href="/plans"
            className="inline-block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
          >
            Browse More Plans
          </Link>
        </div>
      </div>
    );
  }

  const cardClass = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Link href="/plans" className="hover:text-blue-600">Plans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/live-quote/${productId}`} className="hover:text-blue-600">Get My Rate</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium">Enroll</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Complete Your Enrollment</h1>
              <p className="text-slate-500 text-sm mt-1">
                {planName} · <span className="font-bold text-blue-700">${monthlyPremium.toFixed(2)}/month</span>
              </p>
            </div>
            <Link
              href={`/live-quote/${productId}`}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-1">
          {stepLabels.map((label, i) => {
            const n = (i + 1) as Step;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${done ? 'bg-teal-600 text-white' : active ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  {done ? '✓' : n}
                </div>
                <span className={`text-xs hidden sm:block ${active ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>{label}</span>
                {i < stepLabels.length - 1 && <div className="h-px w-6 bg-slate-200" />}
              </div>
            );
          })}
        </div>

        <div className={cardClass + ' space-y-6'}>
          {/* Step 1: Member */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Your Information</h2>
              </div>
              <MemberFields data={member} onChange={updateMember} />
              <button
                onClick={() => setStep(2)}
                disabled={!member.first_name || !member.last_name || !member.email || !member.dob || !member.sex}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Step 2: Spouse */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Add a Spouse?</h2>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setAddSpouse((v) => !v)}
                  className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${addSpouse ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`h-5 w-5 rounded-full bg-white absolute top-0.5 shadow transition-transform ${addSpouse ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Include my spouse in this enrollment</span>
              </label>

              {addSpouse && (
                <div className="border-t pt-4">
                  <SpouseFields data={spouse} onChange={updateSpouse} />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={addSpouse && (!spouse.first_name || !spouse.last_name || !spouse.email || !spouse.dob || !spouse.sex)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 3: Health questions */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Health Questions</h2>
              </div>

              <p className="text-sm text-slate-500">Please answer the following questions honestly for each applicant.</p>

              {[
                { key: 'q1', label: 'Is anyone proposed for coverage currently confined in a hospital or nursing home?' },
                { key: 'q2', label: 'Has a physician diagnosed anyone proposed for coverage as having less than 2 years to live?' },
                { key: 'q3', label: 'Will the coverage applied for replace, discontinue or change any existing life insurance coverage or annuities with this or any other company?' },
              ].map(({ key, label }, qi) => (
                <div key={key} className="rounded-xl border border-slate-200 p-4 space-y-3">
                  <p className="text-sm font-semibold text-slate-800">{qi + 1}. {label}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">You (Member)</p>
                      <div className="flex gap-4">
                        {['yes', 'no'].map((v) => (
                          <label key={v} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`${key}_member`}
                              value={v}
                              checked={uwQ[`${key}_member` as keyof UWQuestions] === v}
                              onChange={() => updateUw(`${key}_member` as keyof UWQuestions, v)}
                              className="accent-blue-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium capitalize">{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {addSpouse && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2 font-medium">Spouse</p>
                        <div className="flex gap-4">
                          {['yes', 'no'].map((v) => (
                            <label key={v} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`${key}_spouse`}
                                value={v}
                                checked={uwQ[`${key}_spouse` as keyof UWQuestions] === v}
                                onChange={() => updateUw(`${key}_spouse` as keyof UWQuestions, v)}
                                className="accent-blue-600 w-4 h-4"
                              />
                              <span className="text-sm font-medium capitalize">{v}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {Object.values(uwQ).some((v) => v === 'yes') && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">A &quot;Yes&quot; answer will require underwriting review before your coverage can be activated. Our team will contact you within 2&ndash;3 business days.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Review <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Review & Submit</h2>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-1">
                <p className="font-bold text-blue-900">{planName}</p>
                <p className="text-blue-700 text-sm">${monthlyPremium.toFixed(2)}/month · {coverageAmount}</p>
              </div>

              <div className="border rounded-xl overflow-hidden text-sm">
                <div className="bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Member</div>
                {[
                  ['Name', [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ')],
                  ['DOB', member.dob],
                  ['Sex', member.sex],
                  ['Email', member.email],
                  ['Phone', member.phone],
                  ['Coverage', coverageAmount],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between px-4 py-2.5 border-t">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>

              {addSpouse && (
                <div className="border rounded-xl overflow-hidden text-sm">
                  <div className="bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Spouse</div>
                  {[
                    ['Name', [spouse.first_name, spouse.last_name].filter(Boolean).join(' ')],
                    ['DOB', spouse.dob],
                    ['Email', spouse.email],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-4 py-2.5 border-t">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border rounded-xl overflow-hidden text-sm">
                <div className="bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Health Questions</div>
                {(['q1', 'q2', 'q3'] as const).map((k, i) => (
                  <div key={k} className="flex justify-between px-4 py-2.5 border-t">
                    <span className="text-slate-500">Question {i + 1} (Member)</span>
                    <span className={`font-bold ${uwQ[`${k}_member`] === 'yes' ? 'text-red-600' : 'text-teal-600'}`}>
                      {uwQ[`${k}_member`].toUpperCase()}
                    </span>
                  </div>
                ))}
                {addSpouse && (['q1', 'q2', 'q3'] as const).map((k, i) => (
                  <div key={`s${k}`} className="flex justify-between px-4 py-2.5 border-t">
                    <span className="text-slate-500">Question {i + 1} (Spouse)</span>
                    <span className={`font-bold ${uwQ[`${k}_spouse`] === 'yes' ? 'text-red-600' : 'text-teal-600'}`}>
                      {uwQ[`${k}_spouse`].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 text-center">
                By submitting, you authorize us to process your enrollment application. Your information is encrypted and secure.
              </p>

              {submitError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                  {submitting ? 'Submitting…' : 'Submit Enrollment'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
