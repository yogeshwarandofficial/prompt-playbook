import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from './roadmaps';
import { ShieldCheck, XCircle, Calendar, Award, User, Hash } from 'lucide-react';
import { format } from 'date-fns';

export const Route = createFileRoute('/verify_/$token')({
  loader: async ({ params }) => {
    const query = params.token;
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001';
      
      // 1. Try as a token or certificate No
      const res = await fetch(`${baseUrl}/api/public/certificates/verify/${query}`);
      if (res.ok) {
        const cert = await res.json();
        return { certificates: [cert], error: null };
      }
      
      // 2. Try as a student ID
      const resStudent = await fetch(`${baseUrl}/api/public/certificates/student/${query}`);
      if (resStudent.ok) {
        const certs = await resStudent.json();
        return { certificates: certs, error: null };
      }

      // If both fail, check error from the first response
      if (res.status === 400) {
         const err = await res.json();
         return { certificates: [], error: 'Invalid Certificate', message: err.message };
      }

      return { certificates: [], error: 'Not Found', message: 'We could not find any active certificates matching this ID.' };
    } catch (e) {
      return { certificates: [], error: 'Connection Error', message: 'Failed to verify. Please try again later.' };
    }
  },
  component: VerifyResultPage,
});

function VerifyResultPage() {
  const { certificates, error, message } = Route.useLoaderData();
  const { token } = Route.useParams();

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Verify', to: '/verify' }, { label: 'Result' }]}
        title="Verification Result"
        subtitle={`Checking credentials for: ${token}`}
      />
      <section className="py-24 bg-slate-50 min-h-[50vh]">
        <div className="container-page max-w-3xl mx-auto">
          {error ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-red-100 text-center">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{error}</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">{message}</p>
              <Link to="/verify" className="inline-block px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition-colors">
                Try Another Search
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {certificates.map((cert: any) => (
                <div key={cert.id} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                      <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                          Verified Authentic
                        </span>
                        <span className="text-sm text-slate-400 font-medium font-mono">{cert.certificateNo}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">{cert.domain}</h3>
                      <p className="text-slate-500 mb-6">Successfully completed the remote internship program.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Awarded To</p>
                            <p className="font-medium text-slate-800">{cert.student?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Student ID</p>
                            <p className="font-medium text-slate-800 font-mono">{cert.student?.studentId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Issued Date</p>
                            <p className="font-medium text-slate-800">{format(new Date(cert.issuedAt), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Status</p>
                            <p className="font-medium text-green-600">Active</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {certificates.length > 1 && (
                <div className="text-center">
                  <p className="text-sm text-slate-500">Found {certificates.length} verified certificates for this student.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
