import Link from 'next/link';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

const PLAN_LINKS = [
  { label: 'Short Term Medical', href: '/plans/short-term-medical' },
  { label: 'Hospital Indemnity', href: '/plans/hospital-indemnity' },
  { label: 'Cancer Plans', href: '/plans/cancer' },
  { label: 'Dental Plans', href: '/plans/dental' },
  { label: 'Vision Plans', href: '/plans/vision' },
  { label: 'Prescription Plans', href: '/plans/prescription' },
  { label: 'Critical Illness', href: '/plans/critical-illness' },
];

const COMPANY_LINKS = [
  { label: 'About CoverPath', href: '/about' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Cover<span className="text-blue-400">Path</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Helping Americans find affordable health insurance coverage since 2020. Licensed in all 50 states.
            </p>
            <div className="space-y-3 text-sm">
              <a href="tel:18005551234" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-blue-400" />
                1-800-555-1234
              </a>
              <a href="mailto:support@coverpath.com" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-blue-400" />
                support@coverpath.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>123 Insurance Plaza, Suite 400<br />Nashville, TN 37201</span>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plan Types</h3>
            <ul className="space-y-2">
              {PLAN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Talk to an agent */}
          <div>
            <h3 className="text-white font-semibold mb-4">Talk to an Agent</h3>
            <p className="text-sm text-slate-400 mb-4">
              Our licensed agents are ready to help you find the right coverage.
            </p>
            <div className="bg-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-xs text-slate-400">Available hours</div>
              <div className="text-sm text-white font-medium">Mon–Fri: 8am – 8pm ET</div>
              <div className="text-sm text-white font-medium">Sat: 9am – 5pm ET</div>
              <a
                href="tel:18005551234"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg py-2.5 transition-colors mt-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} CoverPath Insurance Services. All rights reserved. CoverPath is not an insurance company. Plans are offered by licensed insurance carriers. Coverage, eligibility, and availability may vary by state.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded font-medium">Licensed in 50 States</span>
              <span className="bg-emerald-900/40 text-emerald-300 px-2 py-1 rounded font-medium">A+ BBB Rating</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
