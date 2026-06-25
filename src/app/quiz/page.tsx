import { QuizWizard } from '@/components/quiz/quiz-wizard';

export const metadata = { title: 'Find My Plan — CoverPath' };

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Find Your Perfect Plan</h1>
          <p className="text-slate-500 mt-2">Answer 5 quick questions and we&apos;ll match you with the best options.</p>
        </div>
        <QuizWizard />
      </div>
    </div>
  );
}
