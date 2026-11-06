import React, { useState, useEffect } from 'react';
import { CheckCircle2, Award, Download, Search, AlertCircle, XCircle, Mail, Send } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Course (Domain) *</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Auto-select assigned course --</option>
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
  const [showEventModal, setShowEventModal] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-800">Certificates Management</h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowEventModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2 shadow-sm"
          >
            <Download className="h-4 w-4" /> Event Certificate
          </button>
          <button
            onClick={() => setShowIssueModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
          >
            <Award className="h-4 w-4" /> Issue Certificate
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Cert No, Student Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-base sm:text-sm focus:ring-1 focus:ring-indigo-500"
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
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full divide-y divide-slate-200">
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
          </div>
        )}
      </div>

      {showIssueModal && (
        <IssueModal
          onClose={() => setShowIssueModal(false)}
          onIssued={fetchCertificates}
        />
      )}
      {showEventModal && (
        <EventCertModal
          onClose={() => setShowEventModal(false)}
        />
      )}
    </div>
  );
}

function EventCertModal({ onClose }: { onClose: () => void }) {
  const [studentName, setStudentName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('A 24-HOUR ONLINE HACKATHON ORGANIZED BY INFYNUX ACADEMY');
  const [eventContent, setEventContent] = useState('in recognition of their participation, dedication, and efforts in developing a solution to a real-world technology challenge.');
  const [date, setDate] = useState('');
  const [certificateCode, setCertificateCode] = useState('');
  
  const [sendEmail, setSendEmail] = useState(true);
  const [downloadCopy, setDownloadCopy] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ message: string; emailSent?: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessInfo(null);
    try {
      if (!downloadCopy && (!sendEmail || !recipientEmail.trim())) {
        throw new Error('Please choose at least one option: either download the copy or provide an email to send it to.');
      }

      const payload: any = { 
        studentName: studentName.trim(), 
        eventName: eventName.trim(), 
        eventDescription: eventDescription.trim(), 
        eventContent: eventContent.trim(),
        download: downloadCopy,
      };
      if (date.trim()) payload.date = date.trim();
      if (certificateCode.trim()) payload.certificateCode = certificateCode.trim();
      if (sendEmail && recipientEmail.trim()) {
        payload.recipientEmail = recipientEmail.trim();
      }
      
      const res = await fetch(`${API_URL}/api/admin/certificates/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = 'Failed to generate event certificate';
        try {
          const errData = await res.json();
          if (errData.message) errMsg = errData.message;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const emailHeader = res.headers.get('X-Email-Sent');
      const emailSent = emailHeader === 'true';

      if (downloadCopy) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_certificate_${studentName.trim().replace(/\s+/g, '_')}.png`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        if (data.emailError) {
          setError(`Certificate generated, but email delivery issue occurred: ${data.emailError}`);
          return;
        }
      }

      const willEmail = sendEmail && !!recipientEmail.trim();
      const successMsg = willEmail
        ? `Certificate successfully generated and emailed to ${recipientEmail.trim()}!`
        : `Certificate successfully generated and downloaded!`;

      setSuccessInfo({
        message: successMsg,
        emailSent: emailSent || willEmail,
      });

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Generate Event Certificate
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div className="font-medium">{successInfo.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student Name *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Recipient Email <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (e.target.value && !sendEmail) setSendEmail(true);
                  }}
                  placeholder="student@example.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Name *</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. INFYHACKATHON 2.0 2026"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Description</label>
            <input
              type="text"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="e.g. A 24-HOUR ONLINE HACKATHON ORGANIZED BY INFYNUX ACADEMY"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Content</label>
            <textarea
              rows={2}
              value={eventContent}
              onChange={(e) => setEventContent(e.target.value)}
              placeholder="e.g. in recognition of their participation..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 31/10/2026 (Defaults to Today)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Code</label>
              <input
                type="text"
                value={certificateCode}
                onChange={(e) => setCertificateCode(e.target.value)}
                placeholder="Auto-generated if empty"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Delivery Options */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Delivery Options
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={downloadCopy}
                onChange={(e) => setDownloadCopy(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Download certificate copy to computer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                disabled={!recipientEmail.trim()}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 disabled:opacity-40"
              />
              <span className={!recipientEmail.trim() ? 'text-slate-400' : ''}>
                Email high-res certificate directly to student {recipientEmail.trim() ? `(${recipientEmail.trim()})` : '(enter email above)'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!downloadCopy && (!sendEmail || !recipientEmail.trim()))}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
            >
              {loading ? (
                'Processing…'
              ) : sendEmail && recipientEmail.trim() ? (
                <>
                  <Send className="h-4 w-4" />
                  {downloadCopy ? 'Generate, Download & Email' : 'Generate & Email'}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generate & Download
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
