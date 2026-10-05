const fs = require('fs');
let code = fs.readFileSync('src/routes/admin.tsx', 'utf-8').replace(/\r\n/g, '\n');

// 1. Change handleCreateSubmit and handleEditSubmit to accept optional event
code = code.replace(/const handleCreateSubmit = async \(e: React\.FormEvent\) => \{/, 'const handleCreateSubmit = async (e?: React.FormEvent) => {\n    if (e) e.preventDefault();');
code = code.replace(/const handleEditSubmit = async \(e: React\.FormEvent\) => \{/, 'const handleEditSubmit = async (e?: React.FormEvent) => {\n    if (e) e.preventDefault();');

// 2. Remove the form wrapping the project details
code = code.replace(/<form onSubmit=\{viewMode === 'create' \? handleCreateSubmit : handleEditSubmit\} className=\"space-y-4\">/, '<div className=\"space-y-4\">');

// 3. Replace the Save Project button at the end of the project details, and instead append the PROJECT ROADMAP section
const saveProjectBlock = `            <div className=\"pt-4\">
              <button disabled={isSubmitting} type=\"submit\" className=\"bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700\">
                {isSubmitting ? \"Saving...\" : \"Save Project\"}
              </button>
            </div>
          </form>`;

const updatedSaveProjectBlock = `          </div>

          {viewMode === 'edit' && selectedProject && (
            <div className=\"mt-12 border-t border-slate-200 pt-8\">
              <div className=\"mb-6 flex justify-between items-end\">
                <div>
                  <h3 className=\"text-xl font-bold text-slate-900\">PROJECT ROADMAP</h3>
                  <p className=\"text-sm text-slate-500 mt-1\">Define the phases students will follow to complete this project.</p>
                </div>
                <button type=\"button\" onClick={() => { setEditingPhaseId(\"\"); setPhaseTitle(\"\"); setPhaseDesc(\"\"); setPhaseInst(\"\"); setPhaseTopics([]); }} className=\"bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 flex items-center gap-2\">
                  <Plus className=\"w-4 h-4\" /> Add Phase
                </button>
              </div>
              <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">
                <div>
                  <h4 className=\"font-bold text-slate-800 mb-4\">Existing Phases</h4>
                  {(!selectedProject.phases || selectedProject.phases.length === 0) ? <p className=\"text-sm text-slate-500\">No phases have been added to this project yet.</p> : (
                    <div className=\"space-y-3\">
                      {[...(selectedProject.phases || [])].sort((a,b) => a.phaseOrder - b.phaseOrder).map((p: any, idx: number, arr: any[]) => (
                        <div key={p.id} className=\"border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-start justify-between\">
                          <div>
                            <h5 className=\"font-semibold text-slate-900\">Phase {idx + 1}: {p.title}</h5>
                            <p className=\"text-xs text-slate-500 mt-1\">{p.description}</p>
                            <p className=\"text-xs text-slate-400 font-semibold mt-1\">Topics to Know: {p.topics?.length || 0}</p>
                          </div>
                          <div className=\"flex items-center gap-2\">
                            <button type=\"button\" onClick={() => movePhase(p.id, 'up')} disabled={idx===0} className=\"p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30\"><ChevronUp className=\"w-4 h-4\"/></button>
                            <button type=\"button\" onClick={() => movePhase(p.id, 'down')} disabled={idx===arr.length-1} className=\"p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30\"><ChevronDown className=\"w-4 h-4\"/></button>
                            <button type=\"button\" onClick={() => {
                              setEditingPhaseId(p.id); setPhaseTitle(p.title); setPhaseDesc(p.description); setPhaseInst(p.instructions);
                              setPhaseTopics(p.topics ? JSON.parse(JSON.stringify(p.topics)) : []);
                            }} className=\"p-1 text-slate-400 hover:text-indigo-600\"><Edit className=\"w-4 h-4\"/></button>
                            <button type=\"button\" onClick={() => handleDeletePhase(p.id)} className=\"p-1 text-slate-400 hover:text-red-600\"><Trash2 className=\"w-4 h-4\"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className=\"font-bold text-slate-800 mb-4\">{editingPhaseId ? \"Edit Phase\" : \"Add New Phase\"}</h4>
                  <div className=\"space-y-4\">
                    <div>
                      <label className=\"block text-sm font-semibold text-slate-700 mb-1\">Title</label>
                      <input required type=\"text\" value={phaseTitle} onChange={e=>setPhaseTitle(e.target.value)} className=\"w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm\" />
                    </div>
                    <div>
                      <label className=\"block text-sm font-semibold text-slate-700 mb-1\">Description</label>
                      <textarea required value={phaseDesc} onChange={e=>setPhaseDesc(e.target.value)} rows={2} className=\"w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm\" />
                    </div>
                    <div>
                      <label className=\"block text-sm font-semibold text-slate-700 mb-1\">Instructions / Requirements</label>
                      <textarea required value={phaseInst} onChange={e=>setPhaseInst(e.target.value)} rows={4} className=\"w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm\" />
                    </div>
                    <div>
                      <div className=\"flex justify-between items-center mb-2\">
                        <label className=\"block text-sm font-semibold text-slate-700\">Topics to Know</label>
                        <button type=\"button\" onClick={() => setPhaseTopics([...phaseTopics, { title: '', description: '', blogUrl: '' }])} className=\"text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100\">+ Add Topic</button>
                      </div>
                      {phaseTopics.length === 0 ? <p className=\"text-xs text-slate-500\">No topics added.</p> : (
                        <div className=\"space-y-3\">
                          {phaseTopics.map((topic, idx) => (
                            <div key={idx} className=\"border border-slate-200 rounded-lg p-3 bg-white space-y-3\">
                              <div className=\"flex justify-between items-center\">
                                <h6 className=\"text-xs font-bold text-slate-700\">Topic {idx + 1}</h6>
                                <div className=\"flex items-center gap-1\">
                                  <button type=\"button\" onClick={() => {
                                    if(idx===0) return;
                                    const t = [...phaseTopics];
                                    [t[idx], t[idx-1]] = [t[idx-1], t[idx]];
                                    setPhaseTopics(t);
                                  }} disabled={idx===0} className=\"p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30\"><ChevronUp className=\"w-3 h-3\"/></button>
                                  <button type=\"button\" onClick={() => {
                                    if(idx===phaseTopics.length-1) return;
                                    const t = [...phaseTopics];
                                    [t[idx], t[idx+1]] = [t[idx+1], t[idx]];
                                    setPhaseTopics(t);
                                  }} disabled={idx===phaseTopics.length-1} className=\"p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30\"><ChevronDown className=\"w-3 h-3\"/></button>
                                  <button type=\"button\" onClick={() => {
                                    setPhaseTopics(phaseTopics.filter((_, i) => i !== idx));
                                  }} className=\"p-1 text-slate-400 hover:text-red-600\"><Trash2 className=\"w-3 h-3\"/></button>
                                </div>
                              </div>
                              <input required type=\"text\" placeholder=\"Topic Title\" value={topic.title} onChange={e => {
                                const t = [...phaseTopics]; t[idx].title = e.target.value; setPhaseTopics(t);
                              }} className=\"w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs\" />
                              <textarea placeholder=\"Short Description\" value={topic.description} onChange={e => {
                                const t = [...phaseTopics]; t[idx].description = e.target.value; setPhaseTopics(t);
                              }} rows={2} className=\"w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs\" />
                              <input required type=\"url\" placeholder=\"Blog/Resource URL\" value={topic.blogUrl} onChange={e => {
                                const t = [...phaseTopics]; t[idx].blogUrl = e.target.value; setPhaseTopics(t);
                              }} className=\"w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs\" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className=\"pt-4 flex justify-end\">
                      <button type=\"button\" onClick={(e) => handlePhaseSubmit(e)} className=\"bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700\">
                        {editingPhaseId ? \"Save Phase Changes\" : \"Save New Phase\"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className=\"pt-8 mt-8 border-t border-slate-200\">
            <button disabled={isSubmitting} type=\"button\" onClick={() => viewMode === 'create' ? handleCreateSubmit() : handleEditSubmit()} className=\"w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700\">
              {isSubmitting ? \"Saving...\" : \"Save Project\"}
            </button>
          </div>`;

code = code.replace(saveProjectBlock, updatedSaveProjectBlock);

// 4. Remove the unused 'phases' view entirely
const phasesBlockRegex = /  if \(viewMode === 'phases' && selectedProject\) \{[\s\S]*?        <\/div>\n      <\/div>\n    \);\n  \}/;
code = code.replace(phasesBlockRegex, '');

// 5. Remove Manage Phases button from project list
code = code.replace(/<button onClick=\{\(\) => \{ setSelectedProject\(p\); reloadSelectedProject\(p\.id\)\.then\(\(\) => setViewMode\('phases'\)\); \}\} className="text-slate-400 hover:text-indigo-600" title="Manage Phases"><ListChecks className="w-4 h-4"\/><\/button>\s*/, '');

fs.writeFileSync('src/routes/admin.tsx', code);
