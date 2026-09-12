import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderGit2 } from "lucide-react";

export function CurriculumView() {
  const [curricula, setCurricula] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurricula = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/curriculum`, { credentials: 'include' });
      if (res.ok) {
        setCurricula(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurricula();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Curriculum Engine</h3>
        <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" /> Create Curriculum
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse h-40 bg-slate-200 rounded-xl"></div>
      ) : (
        <div className="grid gap-6">
          {curricula.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-indigo-500" />
                    {c.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">{c.domain?.name} {c.specialization ? `/ ${c.specialization.name}` : ''}</p>
                </div>
                <button className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Edit Details</button>
              </div>
              <div className="p-5">
                <h5 className="text-sm font-bold text-slate-700 mb-3">Versions</h5>
                {c.versions?.length > 0 ? (
                  <div className="space-y-2">
                    {c.versions.map((v: any) => (
                      <div key={v.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-indigo-600">{v.version}</span>
                          <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                            v.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                            v.status === 'DRAFT' ? 'bg-slate-100 text-slate-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                        <button className="text-sm text-slate-500 hover:text-indigo-600">Open Editor →</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">No versions created yet.</div>
                )}
                <button className="mt-4 text-sm text-indigo-600 font-medium hover:underline">+ New Version</button>
              </div>
            </div>
          ))}
          {curricula.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <FolderGit2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-medium text-slate-900">No curricula</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by creating a new curriculum template.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
