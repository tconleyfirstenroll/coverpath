'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    faqs: [
      {
        q: 'What types of plans does CoverPath offer?',
        a: 'CoverPath offers seven types of supplemental and standalone health coverage: Short Term Medical, Hospital Indemnity, Cancer, Dental, Vision, Prescription, and Critical Illness plans. You can purchase one plan or bundle multiple plans to build a comprehensive coverage package.',
      },
      {
        q: 'How do I choose the right plan?',
        a: 'Take our 2-minute quiz at coverpath.com/quiz to get personalized plan recommendations based on your budget, household size, and coverage priorities. You can also browse all plans by category or call one of our licensed agents.',
      },
      {
        q: 'Are these real insurance plans?',
        a: 'This is a demonstration website showcasing how a modern health insurance marketplace could look and function. The plans, carriers, and pricing shown are illustrative examples only. No actual coverage will be issued.',
      },
      {
        q: 'Is CoverPath available in my state?',
        a: 'Plan availability varies by state due to local regulations. Most plans are available in 46+ states. Check individual plan pages for availability in your specific state.',
      },
    ],
  },
  {
    title: 'Coverage & Plans',
    faqs: [
      {
        q: 'What is a short term medical plan?',
        a: 'Short term medical plans provide temporary health coverage during gaps in your insurance — such as between jobs, before employer benefits begin, or if you miss open enrollment. They typically cover doctor visits, urgent care, emergency services, and hospitalization at a lower premium than traditional insurance.',
      },
      {
        q: 'What is the difference between hospital indemnity and major medical insurance?',
        a: 'Major medical insurance pays your providers directly (subject to deductibles and copays). Hospital indemnity pays you — the insured — a fixed daily or lump-sum cash benefit when you\'re hospitalized. You can use the cash for anything: medical bills, mortgage, groceries, or anything else. Hospital indemnity is meant to supplement, not replace, major medical coverage.',
      },
      {
        q: 'Can I have multiple plans at the same time?',
        a: 'Yes! Many customers stack plans for comprehensive protection. For example: a short term medical plan + a dental plan + a vision plan gives you coverage similar to a full benefits package. Some employers even use this approach for employee benefits.',
      },
      {
        q: 'Are pre-existing conditions covered?',
        a: 'Coverage for pre-existing conditions varies by plan type. Short term medical plans typically exclude pre-existing conditions. Supplemental plans like dental, vision, and prescription usually don\'t have pre-existing exclusions. Cancer and critical illness plans may have a 30-day waiting period. Always review the plan\'s Summary of Benefits before enrolling.',
      },
    ],
  },
  {
    title: 'Enrollment & Pricing',
    faqs: [
      {
        q: 'When does coverage start?',
        a: 'Most plans can start as soon as the next business day after your application is approved. Some plans (like cancer and critical illness) have a 30-day waiting period before certain benefits become payable.',
      },
      {
        q: 'Can I cancel my plan?',
        a: 'Yes. Most plans can be cancelled at any time without a penalty. Coverage ends at the end of the month in which you cancel. Some plans offer a free-look period of 10–30 days during which you can receive a full refund.',
      },
      {
        q: 'How is my monthly premium determined?',
        a: 'Premiums are based on several factors including your age, location (state), plan tier, and number of covered individuals. Short term medical premiums may also consider tobacco use. The prices shown on our site are starting estimates — your actual rate is displayed after entering your personal details.',
      },
      {
        q: 'Is there an enrollment period?',
        a: 'Unlike ACA marketplace plans, most plans on CoverPath do not have open enrollment restrictions. You can apply any time during the year. Short term medical plans, in particular, are designed to be available year-round.',
      },
    ],
  },
  {
    title: 'Using Your Coverage',
    faqs: [
      {
        q: 'How do I find an in-network provider?',
        a: 'After enrolling, you will receive a member ID card with your plan\'s provider network name. Use the carrier\'s online directory to find in-network doctors, dentists, or pharmacies near you. Using in-network providers typically results in lower out-of-pocket costs.',
      },
      {
        q: 'How do I file a claim?',
        a: 'Most carriers offer online claim filing through their member portal or mobile app. You can also call the member services number on your ID card. For hospital indemnity, cancer, and critical illness plans, simply submit proof of hospitalization or diagnosis to trigger your cash benefit.',
      },
      {
        q: 'What is a deductible?',
        a: 'A deductible is the amount you pay out of pocket before your insurance begins sharing costs. For example, with a $2,500 deductible, you pay the first $2,500 in covered medical expenses each year. After meeting your deductible, your plan typically pays a percentage (coinsurance) of remaining costs.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors"
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-semibold text-slate-900 text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </div>
      {open && (
        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50">
          {a}
        </div>
      )}
    </button>
  );
}

export default function FaqPage() {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? FAQ_SECTIONS.map((s) => ({
        ...s,
        faqs: s.faqs.filter(
          (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter((s) => s.faqs.length > 0)
    : FAQ_SECTIONS;

  const totalCount = filtered.reduce((acc, s) => acc + s.faqs.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-blue-200 text-lg mb-6">Everything you need to know about CoverPath and our plans</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {totalCount === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-600">No results for &quot;{search}&quot;</p>
            <p className="text-sm mt-1">Try different keywords or <button onClick={() => setSearch('')} className="text-blue-600 underline">clear the search</button></p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{section.title}</h2>
                <div className="space-y-2">
                  {section.faqs.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 text-center">
          <Phone className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Still have questions?</h3>
          <p className="text-slate-500 text-sm mb-4">Our licensed agents are available Monday through Friday, 8am–8pm ET.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:18005551234">
              <Button size="lg">Call 1-800-555-1234</Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg">Send a Message</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
