'use client';
import { useState } from 'react';
import { Phone, Mail, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-14 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Get in Touch</h1>
        <p className="text-blue-200 text-lg">Our team is here to help. Reach us by phone, email, or the form below.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Call Us</div>
                  <div className="text-xs text-slate-500">Fastest response</div>
                </div>
              </div>
              <a href="tel:18005551234" className="text-blue-600 font-bold text-lg hover:text-blue-800">
                1-800-555-1234
              </a>
              <p className="text-xs text-slate-400 mt-1">Toll-free</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Email Us</div>
                  <div className="text-xs text-slate-500">Response within 24 hours</div>
                </div>
              </div>
              <a href="mailto:support@coverpath.com" className="text-blue-600 font-medium hover:underline text-sm">
                support@coverpath.com
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Hours</div>
                  <div className="text-xs text-slate-500">Agent availability</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Mon – Fri</span><span className="font-medium">8am – 8pm ET</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-medium">9am – 5pm ET</span></div>
                <div className="flex justify-between text-slate-400"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Live Chat</div>
                  <p className="text-sm text-blue-700">Available weekdays 9am–6pm ET. Click the chat bubble to get started.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-500 mb-4">
                    Thanks for reaching out, <strong>{form.name}</strong>. We&apos;ll respond to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <p className="text-sm text-slate-400">Need immediate help? Call us at 1-800-555-1234.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Send Us a Message</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Your Name" value={form.name} onChange={(v) => set('name', v)} placeholder="Jane Smith" required />
                    <FormField label="Email Address" value={form.email} onChange={(v) => set('email', v)} placeholder="jane@example.com" type="email" required />
                  </div>
                  <FormField label="Phone Number (optional)" value={form.phone} onChange={(v) => set('phone', v)} placeholder="(555) 555-5555" type="tel" />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => set('subject', e.target.value)}
                      className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a topic...</option>
                      <option>General Question</option>
                      <option>Plan Comparison Help</option>
                      <option>Enrollment Assistance</option>
                      <option>Billing Question</option>
                      <option>Claims Support</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>

                  <p className="text-xs text-center text-slate-400">
                    By submitting this form you agree to our <span className="underline cursor-pointer">Privacy Policy</span>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
