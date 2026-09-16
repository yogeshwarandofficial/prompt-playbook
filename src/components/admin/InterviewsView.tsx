import React, { useState, useEffect } from 'react';
import { Calendar, Video, CheckCircle2, XCircle, Clock, AlertTriangle, Plus, Mail } from 'lucide-react';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

/**
 * Sends interview invitation email to the applicant via the NestJS backend
 * /api/admin/interviews/notify route (which uses Resend).
 * Returns { success, message } — never throws so it cannot break the interview flow.
 */
async function sendInterviewNotification(params: {
  interviewId: string;
  applicantName: string;
  applicantEmail: string;   // from Application.email
  scheduledAt: string;
  meetingLink?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/admin/interviews/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.message ?? `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message ?? 'Network error' };
  }
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-slate-100 text-slate-600',
    NO_SHOW: 'bg-orange-100 text-orange-800',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

function resultBadge(result: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    SELECTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    ON_HOLD: 'bg-purple-100 text-purple-800',
  };
  return map[result] ?? 'bg-slate-100 text-slate-600';
}

interface ScheduleModalProps {
  applicationId: string;
  applicantName: string;
  onClose: () => void;
  /** Called with the full created interview object (includes application.email) */
  onScheduled: (interview: any) => void;
}

function ScheduleModal({ applicationId, applicantName, onClose, onScheduled }: ScheduleModalProps) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/interviews/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ applicationId, scheduledAt, meetingLink }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? 'Failed to schedule interview');
      }
      const interview = await res.json(); // full interview with application.email
      onScheduled(interview);             // pass full data up for email notification
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
        <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Interview</h3>
        <p className="text-sm text-slate-500 mb-5">Applicant: <span className="font-medium text-slate-700">{applicantName}</span></p>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link (optional)</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {loading ? 'Scheduling…' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface RecordResultModalProps {
  interview: any;
  onClose: () => void;
  onSaved: () => void;
}

function RecordResultModal({ interview, onClose, onSaved }: RecordResultModalProps) {
  const [result, setResult] = useState('SELECTED');
  const [feedback, setFeedback] = useState('');
  const [technicalScore, setTechnicalScore] = useState('');
  const [communicationScore, setCommunicationScore] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/interviews/${interview.id}/result`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          result,
          feedback: feedback || undefined,
          technicalScore: technicalScore ? parseInt(technicalScore) : undefined,
          communicationScore: communicationScore ? parseInt(communicationScore) : undefined,
          overallScore: overallScore ? parseInt(overallScore) : undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? 'Failed to record result');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Record Interview Result</h3>
        <p className="text-sm text-slate-500 mb-5">Applicant: <span className="font-medium">{interview.application?.name}</span></p>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Decision *</label>
            <select
              required
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="SELECTED">✅ Selected</option>
              <option value="REJECTED">❌ Rejected</option>
              <option value="ON_HOLD">⏸ On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Feedback / Notes</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Internal notes for admin use only..."
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Technical', technicalScore, setTechnicalScore], ['Communication', communicationScore, setCommunicationScore], ['Overall', overallScore, setOverallScore]].map(([label, val, setter]: any) => (
              <div key={label as string}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{label} /100</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving…' : 'Save Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CreateStudentModalProps {
  application: any;
  onClose: () => void;
  onCreated: () => void;
}

function CreateStudentModal({ application, onClose, onCreated }: CreateStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/applications/admin/${application.id}/create-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? 'Failed to create student account');
      }
      const data = await res.json();
      setSuccessData(data);
      onCreated(); // refresh parent
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4">
        {!successData ? (
          <>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Student Account</h3>
            <p className="text-sm text-slate-500 mb-5">Create portal credentials for the selected applicant.</p>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-500">Student Name</span>
                    <span className="font-medium text-slate-800">{application.name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Email</span>
                    <span className="font-medium text-slate-800">{application.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Phone</span>
                    <span className="font-medium text-slate-800">{application.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">College</span>
                    <span className="font-medium text-slate-800">{application.college || '—'}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="block text-xs text-slate-500">Applied Internship / Domain</span>
                    <span className="font-medium text-indigo-700">{application.domainId || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                * Student ID and temporary password will be generated automatically.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} disabled={loading} className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreate} disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Student Account Created</h3>
              <p className="text-sm text-slate-500">The account was successfully generated.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-slate-500">Name</span>
                  <span className="font-medium text-slate-800">{successData.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Email</span>
                  <span className="font-medium text-slate-800">{successData.email}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Student ID</span>
                  <span className="font-bold text-indigo-700">{successData.studentId}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Temporary Password</span>
                  <span className="font-mono font-medium text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">{successData.tempPassword}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-xs text-slate-500">Internship / Domain</span>
                  <span className="font-medium text-slate-800">{successData.domainId || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={onClose} className="px-8 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function InterviewsView() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('SCHEDULED');
  const [scheduleFor, setScheduleFor] = useState<{ id: string; name: string } | null>(null);
  const [recordFor, setRecordFor] = useState<any | null>(null);
  const [createStudentFor, setCreateStudentFor] = useState<any | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'interviews' | 'shortlist'>('interviews');
  // Email notification state
  const [emailAlert, setEmailAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'ALL'
        ? `${API_URL}/api/admin/interviews`
        : `${API_URL}/api/admin/interviews?status=${statusFilter}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) setInterviews(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchShortlistable = async () => {
    setAppsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/applications/admin?status=SHORTLISTED`, { credentials: 'include' });
      if (res.ok) setApplications(await res.json());
    } catch (e) { console.error(e); }
    setAppsLoading(false);
  };

  useEffect(() => { fetchInterviews(); }, [statusFilter]);
  useEffect(() => { if (activeTab === 'shortlist') fetchShortlistable(); }, [activeTab]);

  /** Called after ScheduleModal persists the interview — sends notification email */
  const handleInterviewScheduled = async (interview: any) => {
    fetchInterviews();
    if (activeTab === 'shortlist') fetchShortlistable();

    const applicantEmail = interview?.application?.email;
    const applicantName  = interview?.application?.name ?? 'Applicant';
    if (!applicantEmail) {
      setEmailAlert({ type: 'error', message: 'Interview saved, but applicant email not found — notification not sent.' });
      return;
    }

    const result = await sendInterviewNotification({
      interviewId:    interview.id,
      applicantName,
      applicantEmail,
      scheduledAt:    interview.scheduledAt,
      meetingLink:    interview.meetingLink,
    });

    if (result.success) {
      setEmailAlert({ type: 'success', message: `Interview scheduled! Invitation email sent to ${applicantEmail}.` });
    } else {
      setEmailAlert({ type: 'error', message: `Interview saved, but email failed: ${result.message}. Use "Resend Invitation" to retry.` });
    }
    // Auto-clear success after 8s
    if (result.success) setTimeout(() => setEmailAlert(null), 8000);
  };

  /** Resend invitation for an already-scheduled interview */
  const handleResendInvitation = async (interview: any) => {
    const applicantEmail = interview?.application?.email;
    const applicantName  = interview?.application?.name ?? 'Applicant';
    if (!applicantEmail) {
      setEmailAlert({ type: 'error', message: 'Cannot resend: applicant email not found on this interview.' });
      return;
    }
    setResendingId(interview.id);
    const result = await sendInterviewNotification({
      interviewId:    interview.id,
      applicantName,
      applicantEmail,
      scheduledAt:    interview.scheduledAt,
      meetingLink:    interview.meetingLink,
    });
    setResendingId(null);
    if (result.success) {
      setEmailAlert({ type: 'success', message: `Invitation resent to ${applicantEmail}.` });
      setTimeout(() => setEmailAlert(null), 8000);
    } else {
      setEmailAlert({ type: 'error', message: `Resend failed: ${result.message}` });
    }
  };

  const handleAction = async (id: string, action: string) => {
    if (!confirm(`Are you sure you want to mark this interview as ${action}?`)) return;
    try {
      await fetch(`${API_URL}/api/admin/interviews/${id}/${action}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      fetchInterviews();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Interview Management</h3>
      </div>

      {/* Email alert banner */}
      {emailAlert && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
          emailAlert.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex-1">
            {emailAlert.type === 'success'
              ? <CheckCircle2 className="inline h-4 w-4 mr-1.5 text-green-600" />
              : <AlertTriangle className="inline h-4 w-4 mr-1.5 text-amber-600" />}
            {emailAlert.message}
          </div>
          <button onClick={() => setEmailAlert(null)} className="text-slate-400 hover:text-slate-700 ml-2 shrink-0">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[['interviews', 'Scheduled Interviews'], ['shortlist', 'Shortlist Applicants']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'interviews' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {['SCHEDULED', 'COMPLETED', 'CANCELLED', 'ALL'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="animate-pulse h-40 bg-slate-200 rounded-xl" />
          ) : interviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <Calendar className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm">No {statusFilter.toLowerCase()} interviews found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {['Applicant', 'Scheduled At', 'Meeting', 'Status', 'Result', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interviews.map((iv) => (
                    <tr key={iv.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 text-sm">{iv.application?.name}</div>
                        <div className="text-xs text-slate-500">{iv.application?.email}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-5 py-4">
                        {iv.meetingLink ? (
                          <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 text-xs hover:underline">
                            <Video className="h-3.5 w-3.5" /> Join
                          </a>
                        ) : <span className="text-slate-400 text-xs">No link</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(iv.status)}`}>{iv.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        {iv.result && iv.result !== 'PENDING' ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${resultBadge(iv.result)}`}>{iv.result}</span>
                        ) : <span className="text-slate-400 text-xs">Pending</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {iv.status === 'SCHEDULED' && (
                            <>
                              <button
                                onClick={() => setRecordFor(iv)}
                                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium hover:bg-green-100 transition-colors"
                              >Record Result</button>
                              <button
                                onClick={() => handleResendInvitation(iv)}
                                disabled={resendingId === iv.id}
                                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-medium hover:bg-indigo-100 disabled:opacity-50 flex items-center gap-1"
                                title={`Resend interview invitation to ${iv.application?.email}`}
                              >
                                <Mail className="h-3 w-3" />
                                {resendingId === iv.id ? 'Sending…' : 'Resend Invite'}
                              </button>
                              <button
                                onClick={() => handleAction(iv.id, 'no-show')}
                                className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-lg font-medium hover:bg-orange-100"
                              >No Show</button>
                              <button
                                onClick={() => handleAction(iv.id, 'cancel')}
                                className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg font-medium hover:bg-red-100"
                              >Cancel</button>
                            </>
                          )}
                          {iv.status === 'COMPLETED' && iv.result === 'SELECTED' && (
                            iv.application?.createdUserId ? (
                              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-medium border border-slate-200 flex items-center">
                                Student Created
                              </span>
                            ) : (
                              <button
                                onClick={() => setCreateStudentFor(iv.application)}
                                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                              >
                                Create Student Account
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'shortlist' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {appsLoading ? <div className="animate-pulse h-40 bg-slate-100 m-4 rounded-xl" /> : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Applicant', 'Email', 'Applied On', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900 text-sm">{app.name}</td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{app.email}</td>
                    <td className="px-5 py-4 text-slate-500 text-sm">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 flex gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="View Application Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button
                        onClick={() => setScheduleFor({ id: app.id, name: app.name })}
                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-medium hover:bg-indigo-100"
                      ><Plus className="inline h-3 w-3 mr-0.5" />Schedule Interview</button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">No applications pending review.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {scheduleFor && (
        <ScheduleModal
          applicationId={scheduleFor.id}
          applicantName={scheduleFor.name}
          onClose={() => setScheduleFor(null)}
          onScheduled={handleInterviewScheduled}
        />
      )}
      {recordFor && (
        <RecordResultModal
          interview={recordFor}
          onClose={() => setRecordFor(null)}
          onSaved={fetchInterviews}
        />
      )}
      {createStudentFor && (
        <CreateStudentModal
          application={createStudentFor}
          onClose={() => setCreateStudentFor(null)}
          onCreated={fetchInterviews}
        />
      )}
      
      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
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
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    View / Download Resume
                  </a>
                ) : (
                  <div className="text-sm text-slate-500 italic">No resume uploaded</div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3">
              <div>
                <p className="text-xs text-slate-400">Invitation will be sent to: <span className="font-medium text-slate-600">{selectedApp.email}</span></p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setScheduleFor({ id: selectedApp.id, name: selectedApp.name }); setSelectedApp(null); }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
