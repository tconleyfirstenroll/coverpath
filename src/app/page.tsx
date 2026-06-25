import Link from 'next/link';
import {
  ArrowRight, Shield, Star, Check, Phone,
  ClipboardList, Search, CreditCard,
  Heart, Eye, Pill, AlertCircle, Building2, Ribbon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/categories';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'short-term-medical': <Heart className="w-6 h-6" />,
  'hospital-indemnity': <Building2 className="w-6 h-6" />,
  'cancer': <Ribbon className="w-6 h-6" />,
  'dental': <AlertCircle className="w-6 h-6" />,
  'vision': <Eye className="w-6 h-6" />,
  'prescription': <Pill className="w-6 h-6" />,
  'critical-illness': <Shield className="w-6 h-6" />,
};

const TRUST_STATS = [
  { value: '2.1M+', label: 'Americans covered' },
  { value: '4.7★', label: 'Average rating' },
  { value: '50', label: 'States licensed' },
  { value: '$0', label: 'Cost to compare' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'Austin, TX',
    plan: 'Short Term Medical',
    rating: 5,
    text: 'Found a plan in under 10 minutes that cost 60% less than COBRA. The comparison tool made it easy to see exactly what was covered.',
  },
  {
    name: 'James R.',
    location: 'Denver, CO',
    plan: 'Dental + Vision',
    rating: 5,
    text: 'After losing my job, I needed affordable coverage fast. CoverPath walked me through my options and I was covered the next day.',
  },
  {
    name: 'Patricia L.',
    location: 'Nashville, TN',
    plan: 'Critical Illness',
    rating: 5,
    text: 'My family has a history of heart disease so I wanted extra protection. The agent I spoke with was incredibly knowledgeable and patient.',
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              Rated #1 for Plan Transparency
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find the Right Health Plan
              <span className="block text-teal-200">in Minutes, Not Hours.</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
              Compare short term medical, dental, vision, cancer, and supplemental plans from top carriers — side by side, with no hidden fees and no spam.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="xl" variant="white">
                <Link href="/quiz">
                  Find My Plan
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="xl"
                className="border-2 border-white/50 text-white bg-transparent hover:bg-white/10"
              >
                <Link href="/plans">Browse All Plans</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-300" />
              No obligation. No spam. Free to compare.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 80L1440 80L1440 20C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Trust stats */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Coverage for Every Need
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From temporary gap coverage to supplemental plans that protect your savings — we offer 7 types of health-related insurance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/plans/${cat.slug}`}
                className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-card-hover transition-all duration-200"
              >
                <div className={`w-12 h-12 ${cat.bgColor} ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {CATEGORY_ICONS[cat.slug]}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
                  View plans <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-6 flex flex-col justify-between text-white">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Not sure what you need?</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Answer a few quick questions and we&apos;ll recommend the best plans for your situation.
                </p>
              </div>
              <Button asChild variant="white" className="mt-6 w-full">
                <Link href="/quiz">Take the Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Coverage in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              From browsing to enrolled — it takes most people less than 15 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-blue-100 z-0" />
            {[
              { step: '1', icon: <ClipboardList className="w-7 h-7" />, title: 'Tell us about yourself', desc: 'Answer a few questions about your coverage needs, household size, and budget. No personal info required to see options.' },
              { step: '2', icon: <Search className="w-7 h-7" />, title: 'Compare your options', desc: 'See plans from top carriers side by side. Filter by price, coverage type, and benefits. Compare up to 3 plans at once.' },
              { step: '3', icon: <CreditCard className="w-7 h-7" />, title: 'Enroll in minutes', desc: 'Select your plan and complete the simple online enrollment. Coverage can begin as early as tomorrow.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center z-10">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  {item.icon}
                </div>
                <div className="absolute top-0 left-1/2 ml-4 -translate-y-1 w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/quiz">Get Started Free <ArrowRight className="w-5 h-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Trusted by Over 2 Million Americans
            </h2>
            <p className="text-lg text-slate-500">Real stories from real CoverPath members.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.location}</div>
                  </div>
                  <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{t.plan}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent CTA banner */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Prefer to talk to a real person?</h2>
          <p className="text-blue-200 mb-8 text-lg">Our licensed agents are standing by to help you find the right coverage and answer any questions — at no cost to you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:18005551234" className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-md">
              <Phone className="w-5 h-5" /> 1-800-555-1234
            </a>
            <Button asChild className="border-2 border-white/50 text-white bg-transparent hover:bg-white/10" size="lg">
              <Link href="/contact">Send a Message</Link>
            </Button>
          </div>
          <p className="mt-4 text-blue-300 text-sm">Mon–Fri 8am–8pm ET · Sat 9am–5pm ET</p>
        </div>
      </section>

      {/* Why CoverPath */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">Why thousands choose CoverPath</h2>
              <div className="space-y-5">
                {[
                  { title: 'Transparent pricing', desc: 'See the full cost of every plan upfront — no surprise fees after you enroll.' },
                  { title: 'No spam, ever', desc: 'We never sell your information. Your data is used only to show you relevant plans.' },
                  { title: 'Licensed in all 50 states', desc: 'Whether you\'re in California or Vermont, we have plan options available for your state.' },
                  { title: 'Expert agent support', desc: 'Real licensed agents available by phone, ready to answer your questions at no charge.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">4.7</div>
                <div className="flex justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-200 text-amber-200'}`} />
                  ))}
                </div>
                <div className="text-slate-500 text-sm mb-8">Based on 18,400+ verified reviews</div>
                <div className="space-y-3 text-left">
                  {[
                    { label: '5 stars', pct: 72 },
                    { label: '4 stars', pct: 19 },
                    { label: '3 stars', pct: 6 },
                    { label: '2 stars', pct: 2 },
                    { label: '1 star', pct: 1 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-500 w-12 shrink-0">{row.label}</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-slate-500 w-8 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to find your plan?</h2>
          <p className="text-blue-100 text-lg mb-8">It takes less than 5 minutes to compare options and get covered.</p>
          <Button asChild size="xl" variant="white">
            <Link href="/quiz">Start My Free Quote <ArrowRight className="w-5 h-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
