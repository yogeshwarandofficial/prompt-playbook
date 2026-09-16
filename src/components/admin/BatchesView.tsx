import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export function BatchesView() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);
  const [newBatch, setNewBatch] = useState({ name: '', domainId: '', startDate: '', durationWeeks: 12, status: 'ACTIVE' });

  const fetchBatches = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/batches`, { credentials: 'include' });
      if (res.ok) {
        setBatches(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/domains`, { credentials: 'include' });
      if (res.ok) setDomains(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchBatches();
    fetchDomains();
  }, []);

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({...newBatch, durationWeeks: Number(newBatch.durationWeeks), startDate: new Date(newBatch.startDate).toISOString()})
      });
      if (res.ok) {
        setNewBatch({ name: '', domainId: '', startDate: '', durationWeeks: 12, status: 'ACTIVE' });
        setIsAdding(false);
        fetchBatches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/batches/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) fetchBatches();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Batch Management</h3>
        <button onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" /> Create Batch
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse h-40 bg-slate-200 rounded-xl"></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {batches.map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{b.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{b.domain?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      b.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{b._count?.enrollments || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit className="h-4 w-4"/></button>
                    <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    No batches found. Create one to assign students.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Create New Batch</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleAddBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Batch Name</label>
                <input required type="text" value={newBatch.name} onChange={e => setNewBatch({...newBatch, name: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5" placeholder="e.g. Winter 2024" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
                <select required value={newBatch.domainId} onChange={e => setNewBatch({...newBatch, domainId: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5">
                  <option value="">Select a Domain</option>
                  {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input required type="date" value={newBatch.startDate} onChange={e => setNewBatch({...newBatch, startDate: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Weeks)</label>
                  <input required type="number" min="1" value={newBatch.durationWeeks} onChange={e => setNewBatch({...newBatch, durationWeeks: Number(e.target.value)})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select required value={newBatch.status} onChange={e => setNewBatch({...newBatch, status: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5">
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2"><Save className="h-4 w-4" /> Create Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
