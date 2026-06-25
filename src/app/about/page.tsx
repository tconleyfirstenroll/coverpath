import Link from 'next/link';
import { Shield, Users, Star, Globe, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATS = [
  { value: '2.1M+', label: 'People Covered', icon: Users },
  { value: '4.7★', label: 'Average Rating', icon: Star },
  { value: '50', label: 'States Served', icon: Globe },
  { value: '15+', label: 'Years of Experience', icon: Shield },
];

const TEAM = [
  { name: 'Sarah Mitchell', title: 'CEO & Co-Founder', bio: 'Former healthcare policy advisor with 20 years in insurance and employee benefits.' },
  { name: 'David Chen', title: 'Chief Product Officer', bio: 'Built and scaled health insurance platforms at two Fortune 500 carriers.' },
  { name: 'Priya Sharma', title: 'Head of Agent Success', bio: 'Licensed broker with a passion for making insurance simple and accessible.' },
  { name: 'Marcus Johnson', title: 'Chief Technology Officer', bio: 'Led digital transformation initiatives at leading health insurance companies.' },
];

const VALUES = [
  { emoji: '🔍', title: 'Transparency', desc: 'No hidden fees, no confusing jargon. We show you exactly what you get for what you pay.' },
  { emoji: '⚡', title: 'Speed', desc: 'Find and enroll in a plan in minutes — not hours. Coverage can start the next business day.' },
  { emoji: '🤝', title: 'Guidance', desc: 'Real licensed agents ready to answer any question, no pressure, no commission games.' },
  { emoji: '💡', title: 'Education', desc: 'We help you understand your options so you can make confident decisions for your family.' },
];

export const metadata = {
  title: 'About CoverPath — Our Story',
  description: 'CoverPath makes it easy to find, compare, and enroll in health insurance plans. Learn about our mission and team.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-teal-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-blue-200 font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h1 className="text-5xl font-extrabold mb-4">Insurance Made Human</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
            CoverPath was founded on a simple belief: finding health insurance shouldn&apos;t feel like navigating a labyrinth. We built the platform we wished existed.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="w-7 h-7 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Millions of Americans are uninsured or underinsured — not because they can&apos;t afford coverage, but because the process of finding it is so overwhelming they give up.
              </p>
              <p className="text-slate-600 leading-relaxed">
                CoverPath uses technology to simplify the search, comparison, and enrollment process while keeping human expertise front and center. Our licensed agents are partners in your health journey, not salespeople chasing commissions.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
              <blockquote className="text-lg italic text-slate-700 mb-4">
                &quot;We believe every American deserves access to quality health coverage — and the confidence to know they&apos;re making the right choice.&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">SM</div>
                <div>
                  <div className="font-semibold text-slate-900">Sarah Mitchell</div>
                  <div className="text-sm text-slate-500">CEO & Co-Founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">Leadership Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-2">{member.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-700 text-white py-14 text-center">
        <h2 className="text-3xl font-extrabold mb-3">Ready to Find Your Plan?</h2>
        <p className="text-blue-200 mb-6 text-lg">Join millions of Americans who found better coverage with CoverPath.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/quiz">
            <Button size="lg" variant="white" className="text-blue-700 font-bold">
              Take the Quiz <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Phone className="w-4 h-4 mr-1" /> Talk to an Agent
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
