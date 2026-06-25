'use client';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Shield, Phone, User, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';
import { getPlanById } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Confirmation', icon: CheckCircle2 },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, idx) => {
        const done = step.id < current;
        const active = step.id === current;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors',
                done ? 'bg-blue-600 border-blue-600 text-white' :
                active ? 'bg-white border-blue-500 text-blue-600' :
                'bg-white border-slate-300 text-slate-400',
              )}>
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={cn('text-xs mt-1 font-medium hidden sm:block', active ? 'text-blue-600' : done ? 'text-slate-600' : 'text-slate-400')}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-2', done ? 'bg-blue-500' : 'bg-slate-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  nameOnCard: string;
  agreeTerms: boolean;
}

const EMPTY_FORM: FormData = {
  firstName: '', lastName: '', email: '', phone: '', dob: '', gender: '',
  address: '', city: '', state: '', zip: '',
  cardNumber: '', cardExpiry: '', cardCvc: '', nameOnCard: '',
  agreeTerms: false,
};

// Enrollment form rendered client-side; planId resolved via props
function EnrollForm({ planId }: { planId: string }) {
  const plan = getPlanById(planId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  if (!plan) return notFound();

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = () => {
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href={`/plans/${plan.category}/${plan.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to plan details
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
              <StepIndicator current={step} />

              {/* Step 1: Personal */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-5">Personal Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="First Name" value={form.firstName} onChange={(v) => set('firstName', v)} placeholder="Jane" />
                    <Field label="Last Name" value={form.lastName} onChange={(v) => set('lastName', v)} placeholder="Smith" />
                    <Field label="Email Address" value={form.email} onChange={(v) => set('email', v)} placeholder="jane@example.com" type="email" />
                    <Field label="Phone Number" value={form.phone} onChange={(v) => set('phone', v)} placeholder="(555) 555-5555" type="tel" />
                    <Field label="Date of Birth" value={form.dob} onChange={(v) => set('dob', v)} placeholder="MM/DD/YYYY" />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => set('gender', e.target.value)}
                        className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-5">Home Address</h2>
                  <div className="space-y-4">
                    <Field label="Street Address" value={form.address} onChange={(v) => set('address', v)} placeholder="123 Main Street" />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <Field label="City" value={form.city} onChange={(v) => set('city', v)} placeholder="Springfield" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                        <select
                          value={form.state}
                          onChange={(e) => set('state', e.target.value)}
                          className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {US_STATES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <Field label="ZIP Code" value={form.zip} onChange={(v) => set('zip', v)} placeholder="12345" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Payment Information</h2>
                  <p className="text-sm text-slate-500 mb-5">Your first payment of ${plan.monthlyPremium} will be charged today.</p>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800 flex items-start gap-2">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>This is a demo enrollment. No real charges will be made. Do not enter real card details.</span>
                  </div>

                  <div className="space-y-4">
                    <Field label="Name on Card" value={form.nameOnCard} onChange={(v) => set('nameOnCard', v)} placeholder="Jane Smith" />
                    <Field label="Card Number" value={form.cardNumber} onChange={(v) => set('cardNumber', v)} placeholder="•••• •••• •••• ••••" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiration (MM/YY)" value={form.cardExpiry} onChange={(v) => set('cardExpiry', v)} placeholder="12/28" />
                      <Field label="CVC" value={form.cardCvc} onChange={(v) => set('cardCvc', v)} placeholder="•••" />
                    </div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => set('agreeTerms', e.target.checked)}
                        className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600">
                        I agree to the <Link href="/faq" className="text-blue-600 underline">Terms of Service</Link> and authorize CoverPath to charge my payment method ${plan.monthlyPremium}/month.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">You&apos;re Covered!</h2>
                  <p className="text-slate-500 mb-2">
                    Your enrollment in <strong>{plan.name}</strong> is confirmed.
                  </p>
                  <p className="text-sm text-slate-400 mb-6">
                    A confirmation email has been sent to <strong>{form.email || 'your email'}</strong>.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6">
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Enrollment Summary</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-semibold text-slate-900">{plan.name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Carrier</span><span>{plan.carrier}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Monthly Premium</span><span className="font-semibold text-blue-600">${plan.monthlyPremium}/mo</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Effective Date</span><span>Next business day</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/plans">
                      <Button variant="outline">Browse More Plans</Button>
                    </Link>
                    <a href="tel:18005551234">
                      <Button variant="secondary">
                        <Phone className="w-4 h-4 mr-1" /> Talk to an Agent
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {step < 4 && (
                <div className="flex justify-between mt-8 pt-5 border-t border-slate-100">
                  {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="text-slate-600">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  ) : <div />}
                  {step < 3 ? (
                    <Button onClick={() => setStep((s) => s + 1)}>
                      Continue <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={!form.agreeTerms}>
                      Complete Enrollment <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Your Selection</div>
                {plan.badge && <Badge variant="teal" className="mb-2">{plan.badge}</Badge>}
                <h3 className="font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.carrier}</p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Monthly premium</span>
                    <span className="font-bold text-blue-600">${plan.monthlyPremium}</span>
                  </div>
                  {plan.annualDeductible !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Annual deductible</span>
                      <span className="font-semibold">${plan.annualDeductible.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-2">Key highlights</div>
                  <ul className="space-y-1">
                    {plan.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-800 font-medium mb-1">Questions?</p>
                <p className="text-xs text-blue-600 mb-2">Talk to a licensed agent</p>
                <a href="tel:18005551234" className="text-sm font-bold text-blue-700 hover:text-blue-900">
                  1-800-555-1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// Next.js page export — must be default server component, EnrollForm is client
export default function EnrollPage({ params }: { params: { planId: string } }) {
  return <EnrollForm planId={params.planId} />;
}
