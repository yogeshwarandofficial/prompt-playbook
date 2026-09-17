import React, { useState, useEffect } from "react";
import { Check, XCircle, Eye } from "lucide-react";

export function ApplicationsView() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const url = statusFilter !== 'ALL' 
        ? `${API_URL}/api/applications/admin?status=${statusFilter}`
        : `${API_URL}/api/applications/admin`;
        
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleReview = async (id: string, status: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/applications/admin/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchApplications();
        if (selectedApp?.id === id) {
          setSelectedApp(null);
        }
      } else {
        const err = await res.json();
        alert(`Failed to update application: ${err.message || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while updating application.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Student Applications</h3>
        <select 
          className="rounded-lg border-slate-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Applications</option>
          <option value="PENDING">Pending</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse h-64 bg-slate-200 rounded-xl"></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Education</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">{app.name}</div>
                    <div className="text-sm text-slate-500">{app.email}</div>
                    <div className="text-xs text-slate-400">{app.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{app.college || '-'}</div>
                    <div className="text-sm text-slate-500">{app.degree} {app.graduationYear ? `(${app.graduationYear})` : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="text-slate-400 hover:text-slate-700 mr-3" 
                      title="View details"
                    >
                      <Eye className="h-5 w-5"/>
                    </button>
                    {app.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleReview(app.id, 'SHORTLISTED')}
                          className="text-green-600 hover:text-green-900 mr-3" title="Shortlist"
                        >
                          <Check className="h-5 w-5"/>
                        </button>
                        <button 
                          onClick={() => handleReview(app.id, 'REJECTED')}
                          className="text-red-600 hover:text-red-900" title="Reject"
                        >
                          <XCircle className="h-5 w-5"/>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    No applications found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Application Details</h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Applicant Profile</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-500">Full Name</div>
                      <div className="font-semibold text-slate-900">{selectedApp.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Email Address</div>
                      <div className="font-medium text-slate-700">{selectedApp.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Phone Number</div>
                      <div className="font-medium text-slate-700">{selectedApp.phone || 'Not provided'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Education</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-500">College / Institution</div>
                      <div className="font-medium text-slate-700">{selectedApp.college || 'Not provided'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Degree & Year</div>
                      <div className="font-medium text-slate-700">
                        {selectedApp.degree || '-'} {selectedApp.graduationYear ? `(Class of ${selectedApp.graduationYear})` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Program Details</h4>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-indigo-400">Domain</div>
                      <div className="font-semibold text-indigo-900">{selectedApp.domainId || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-indigo-400">Specialization</div>
                      <div className="font-semibold text-indigo-900">{selectedApp.specializationId || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedApp.message && (
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Applicant Message</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedApp.message}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Resume Document</h4>
                {selectedApp.resumeUrl ? (
                  <a 
                    href={selectedApp.resumeUrl} 
                    download={`${selectedApp.name.replace(/\s+/g, '_')}_Resume`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    View / Download Resume
                  </a>
                ) : (
                  <div className="text-sm text-slate-500 italic">No resume uploaded</div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              {selectedApp.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleReview(selectedApp.id, 'REJECTED')}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleReview(selectedApp.id, 'SHORTLISTED')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Shortlist Application
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
