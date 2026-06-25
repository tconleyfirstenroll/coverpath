import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AgentCtaButton } from '@/components/layout/agent-cta-button';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CoverPath — Affordable Health Insurance Plans',
  description:
    'Find and compare short term medical, dental, vision, cancer, hospital indemnity, prescription, and critical illness plans. Get covered today.',
  keywords: 'health insurance, short term medical, dental plans, vision insurance, cancer insurance, critical illness',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AgentCtaButton />
      </body>
    </html>
  );
}
