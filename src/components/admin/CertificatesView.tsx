import React, { useState, useEffect } from 'react';
import { CheckCircle2, Award, Download, Search, AlertCircle, XCircle } from 'lucide-react';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

function statusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    REVOKED: 'bg-red-100 text-red-800',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

interface IssueModalProps {
  onClose: () => void;
  onIssued: () => void;
}

function IssueModal({ onClose, onIssued }: IssueModalProps) {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/admin/courses`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/certificates/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          studentId,
          courseId: courseId || undefined
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? 'Failed to issue certificate');
      }
      onIssued();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-600" />
          Issue Certificate
        </h3>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student ID *</label>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Database UUID of the Student"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Course (Domain) *</label>
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Select a Course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Select which course to issue this certificate for.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {loading ? 'Issuing…' : 'Issue Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CertificatesView() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/certificates`, { credentials: 'include' });
      if (res.ok) setCertificates(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchCertificates(); }, []);

  const handleRevoke = async (id: string) => {
    const reason = prompt('Enter reason for revocation (required):');
    if (!reason) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/certificates/${id}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });
      if (res.ok) fetchCertificates();
      else alert('Failed to revoke certificate');
    } catch (e) { console.error(e); }
  };

  const filtered = certificates.filter(c => 
    c.certificateNo.toLowerCase().includes(search.toLowerCase()) || 
    c.studentCourse?.student?.name.toLowerCase().includes(search.toLowerCase()) ||
    c.studentCourse?.student?.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Certificates Management</h3>
        <button
          onClick={() => setShowIssueModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
        >
          <Award className="h-4 w-4" /> Issue Certificate
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Cert No, Student Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading certificates...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 m-4">
            <Award className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No certificates found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Certificate No</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project / Batch</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Issued At</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-xs font-medium text-slate-700">{cert.certificateNo}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900 text-sm">{cert.studentCourse?.student?.name}</div>
                    <div className="text-xs text-slate-500">{cert.studentCourse?.student?.studentId}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-slate-700 truncate max-w-xs">{cert.studentCourse?.course?.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Assigned</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(cert.status)}`}>{cert.status}</span>
                    {cert.status === 'REVOKED' && cert.revokedReason && (
                      <div className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={cert.revokedReason}>
                        {cert.revokedReason}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {cert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleRevoke(cert.id)}
                          className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg font-medium hover:bg-red-100"
                        >Revoke</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showIssueModal && (
        <IssueModal
          onClose={() => setShowIssueModal(false)}
          onIssued={fetchCertificates}
        />
      )}
    </div>
  );
}
