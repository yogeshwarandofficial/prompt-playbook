import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { PageHeader } from './roadmaps';

export const Route = createFileRoute('/verify')({
  component: VerifyPage,
});

function VerifyPage() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // We navigate to the dynamic route to handle the API call and result display
    // It can handle both token/certNo and studentId (we'll check which it is in the loader or component)
    navigate({
      to: '/verify/$token',
      params: { token: input.trim() }
    });
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Verify Certificate' }]}
        title="Verify a Certificate"
        subtitle="Enter a Certificate Number, Verification Token, or Student ID to verify authenticity."
      />
      <section className="py-24 bg-slate-50 min-h-[50vh]">
        <div className="container-page max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Check Credential</h2>
            <p className="text-slate-500 mb-8">
              Every certificate issued by Infynux Academy is cryptographically verified and recorded in our database.
            </p>
            
            <form onSubmit={handleVerify} className="relative max-w-md mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., INFY-2026-12345 or Student ID"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
