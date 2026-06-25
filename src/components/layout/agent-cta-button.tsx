'use client';
import { Phone } from 'lucide-react';

export function AgentCtaButton() {
  return (
    <a
      href="tel:18005551234"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
      aria-label="Call a licensed agent"
    >
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <Phone className="w-4 h-4" />
      </div>
      <span className="hidden sm:block">Talk to an Agent</span>
    </a>
  );
}
