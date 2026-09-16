import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export function DomainsView() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: '', description: '' });

  const fetchDomains = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/domains`, { credentials: 'include' });
      if (res.ok) {
        setDomains(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newDomain)
      });
      if (res.ok) {
        setNewDomain({ name: '', description: '' });
        setIsAdding(false);
        fetchDomains();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/domains/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchDomains();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Domains & Specializations</h3>
        <button onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Domain
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 rounded-xl"></div>
          <div className="h-20 bg-slate-200 rounded-xl"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {domains.map(d => (
            <div key={d.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{d.name}</h4>
                  <p className="text-slate-500 text-sm mt-1">{d.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"><Edit className="h-4 w-4"/></button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="h-4 w-4"/></button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Specializations</span>
                  <button className="text-xs text-indigo-600 font-medium hover:underline">+ Add</button>
                </div>
                {/* Specializations list would go here */}
                <div className="text-sm text-slate-500 italic">No specializations added yet.</div>
              </div>
            </div>
          ))}
          {domains.length === 0 && (
            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              No domains configured. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Add New Domain</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required type="text" value={newDomain.name} onChange={e => setNewDomain({...newDomain, name: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5" placeholder="e.g. Full Stack Development" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={newDomain.description} onChange={e => setNewDomain({...newDomain, description: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5" placeholder="Domain description..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2"><Save className="h-4 w-4" /> Save Domain</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
