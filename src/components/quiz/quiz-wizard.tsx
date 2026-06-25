'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check, Heart, Building2, Ribbon, Eye, Pill, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PlanCategory, QuizAnswers } from '@/types';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',
  IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',
  ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',
  MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',
  NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',
  ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',
  RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',
  UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',
  WI:'Wisconsin',WY:'Wyoming',
};

const COVERAGE_OPTIONS: { slug: PlanCategory; label: string; icon: React.ReactNode; desc: string }[] = [
  { slug: 'short-term-medical', label: 'Short Term Medical', icon: <Heart className="w-5 h-5" />, desc: 'Gap coverage for doctor visits & hospital' },
  { slug: 'hospital-indemnity', label: 'Hospital Indemnity', icon: <Building2 className="w-5 h-5" />, desc: 'Cash benefits during hospital stays' },
  { slug: 'cancer', label: 'Cancer Plans', icon: <Ribbon className="w-5 h-5" />, desc: 'Lump-sum payout on cancer diagnosis' },
  { slug: 'dental', label: 'Dental', icon: <AlertCircle className="w-5 h-5" />, desc: 'Cleanings, fillings, and major dental work' },
  { slug: 'vision', label: 'Vision', icon: <Eye className="w-5 h-5" />, desc: 'Eye exams, glasses, and contacts' },
  { slug: 'prescription', label: 'Prescription', icon: <Pill className="w-5 h-5" />, desc: 'Savings on generic and brand medications' },
  { slug: 'critical-illness', label: 'Critical Illness', icon: <Shield className="w-5 h-5" />, desc: 'Cash benefit for heart attack, stroke & more' },
];

const BUDGET_OPTIONS = [
  { label: 'Under $50/mo', value: 50 },
  { label: '$50–$100/mo', value: 100 },
  { label: '$100–$200/mo', value: 200 },
  { label: '$200–$350/mo', value: 350 },
  { label: '$350+/mo', value: 9999 },
];

const TOTAL_STEPS = 5;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>Step {step} of {TOTAL_STEPS}</span>
        <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function QuizWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({
    coverageTypes: [],
  });

  const toggleCoverage = (slug: PlanCategory) => {
    setAnswers((prev) => {
      const current = prev.coverageTypes ?? [];
      return {
        ...prev,
        coverageTypes: current.includes(slug)
          ? current.filter((c) => c !== slug)
          : [...current, slug],
      };
    });
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submitQuiz = () => {
    const params = new URLSearchParams({
      categories: (answers.coverageTypes ?? []).join(','),
      budget: String(answers.budget ?? 9999),
      state: answers.state ?? '',
      household: answers.householdSize ?? 'just-me',
      age: String(answers.age ?? 35),
    });
    router.push(`/plans?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
      <div className="p-6 sm:p-8">
        <ProgressBar step={step} />

        {/* Step 1: Coverage types */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">What type of coverage are you looking for?</h2>
            <p className="text-slate-500 text-sm mb-6">Select all that apply. You can always add more later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COVERAGE_OPTIONS.map((opt) => {
                const selected = answers.coverageTypes?.includes(opt.slug);
                return (
                  <button
                    key={opt.slug}
                    onClick={() => toggleCoverage(opt.slug)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150',
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700',
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500')}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {selected && <Check className="w-4 h-4 text-blue-600 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-3">Not sure? Leave blank and we&apos;ll show you all options.</p>
          </div>
        )}

        {/* Step 2: Household size */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Who needs coverage?</h2>
            <p className="text-slate-500 text-sm mb-6">This helps us find plans that cover everyone in your household.</p>
            <div className="space-y-3">
              {[
                { value: 'just-me', label: 'Just me', desc: 'Individual coverage only', emoji: '🧑' },
                { value: 'me-spouse', label: 'Me + spouse / partner', desc: 'Coverage for two adults', emoji: '👫' },
                { value: 'family', label: 'My family', desc: 'Coverage for adults and children', emoji: '👨‍👩‍👧‍👦' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers((p) => ({ ...p, householdSize: opt.value as QuizAnswers['householdSize'] }))}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150',
                    answers.householdSize === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{opt.label}</div>
                    <div className="text-sm text-slate-500">{opt.desc}</div>
                  </div>
                  {answers.householdSize === opt.value && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Age */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">How old are you?</h2>
            <p className="text-slate-500 text-sm mb-6">Your age affects plan pricing and availability.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[18, 21, 25, 30, 35, 40, 45, 50, 55, 60, 64].map((age) => (
                <button
                  key={age}
                  onClick={() => setAnswers((p) => ({ ...p, age }))}
                  className={cn(
                    'py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150',
                    answers.age === age
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50',
                  )}
                >
                  {age}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Or enter your age:</label>
              <input
                type="number"
                min={18}
                max={64}
                value={answers.age ?? ''}
                onChange={(e) => setAnswers((p) => ({ ...p, age: parseInt(e.target.value) || undefined }))}
                placeholder="e.g. 38"
                className="w-32 h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: State */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">What state do you live in?</h2>
            <p className="text-slate-500 text-sm mb-6">Plan availability and regulations vary by state.</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {US_STATES.map((state) => (
                <button
                  key={state}
                  onClick={() => setAnswers((p) => ({ ...p, state }))}
                  className={cn(
                    'py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                    answers.state === state
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50',
                  )}
                  title={STATE_NAMES[state]}
                >
                  {state}
                </button>
              ))}
            </div>
            {answers.state && (
              <p className="text-sm text-blue-600 font-medium mt-3">
                Selected: {STATE_NAMES[answers.state]} ({answers.state})
              </p>
            )}
          </div>
        )}

        {/* Step 5: Budget */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">What&apos;s your monthly budget?</h2>
            <p className="text-slate-500 text-sm mb-6">We&apos;ll prioritize plans that fit what you can afford.</p>
            <div className="space-y-3">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers((p) => ({ ...p, budget: opt.value }))}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-150',
                    answers.budget === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  <span className="font-semibold text-slate-900">{opt.label}</span>
                  {answers.budget === opt.value && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="border-t border-slate-100 p-4 sm:p-6 flex items-center justify-between bg-slate-50">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 1}
          className="text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button onClick={next} size="default">
            Continue <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={submitQuiz} size="default">
            See My Plans <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
