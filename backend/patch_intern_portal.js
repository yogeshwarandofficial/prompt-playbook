const fs = require('fs');
const path = require('path');

const portalFile = path.join(__dirname, '../src/routes/intern-portal.tsx');
let portalContent = fs.readFileSync(portalFile, 'utf8');

// 1. Update ViewState
portalContent = portalContent.replace(
  "type ViewState = 'dashboard' | 'projects' | 'submissions';",
  "type ViewState = 'dashboard' | 'learning' | 'tasks' | 'projects' | 'submissions' | 'progress' | 'certificate';"
);

// 2. Add enrollment state and fetch logic
const oldFetch = `        // Fetch student's assigned courses
        const fetchMyCourses = async () => {
          try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(\`\${API_URL}/api/student/courses\`, {
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              setCourses(data);
            }
          } catch (err) {
            console.error("Failed to fetch courses:", err);
          } finally {
            setLoading(false);
          }
        };
        
        fetchMyCourses();`;

const newFetch = `        // Fetch student's curriculum enrollment
        const fetchEnrollment = async () => {
          try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(\`\${API_URL}/api/student/curriculum/enrollment\`, {
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              setCourses(data ? [data] : []);
            }
          } catch (err) {
            console.error("Failed to fetch curriculum:", err);
          } finally {
            setLoading(false);
          }
        };
        
        fetchEnrollment();`;
portalContent = portalContent.replace(oldFetch, newFetch);

// 3. Add LearningView component 
const dashboardPlaceholderRegex = /\{\/\* Workspace Placeholder \/ Assigned Courses \*\/\}([\s\S]*?)<\/div>\n              <\/>\n            \)\}/;

const updatedDashboard = `{/* Curriculum Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">My Curriculum</h3>
                  {courses.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {courses.map(enroll => (
                        <div key={enroll.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-xs font-bold text-indigo-600 mb-1 tracking-wider uppercase">Active Batch</div>
                              <h4 className="text-xl font-bold text-slate-900">{enroll.batch?.name}</h4>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md uppercase">
                              {enroll.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Curriculum:</span>
                              <span className="font-medium text-slate-900">{enroll.curriculumVersion?.curriculum?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Domain:</span>
                              <span className="font-medium text-slate-900">{enroll.batch?.domain?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Progress:</span>
                              <span className="font-medium text-indigo-600">
                                {enroll.phaseProgress?.filter((p: any) => p.status === 'COMPLETED').length || 0} / {enroll.phaseProgress?.length || 0} Phases
                              </span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => setCurrentView('learning')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                          >
                            Continue Learning
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                      <h4 className="text-slate-900 font-medium">Not Enrolled</h4>
                      <p className="text-slate-500 text-sm mt-1">You are not currently enrolled in any curriculum batches.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {currentView === 'learning' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                 <h3 className="text-xl font-bold text-slate-900 mb-6">Curriculum Roadmap</h3>
                 {courses[0]?.phaseProgress?.map((progress: any, i: number) => (
                    <div key={progress.id} className={\`mb-4 border rounded-xl p-5 \${progress.status === 'LOCKED' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-indigo-100 shadow-sm'}\`}>
                       <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-lg text-slate-800">Phase {i+1}: {progress.phase.title}</h4>
                          <span className={\`text-xs font-bold px-2 py-1 rounded \${
                             progress.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                             progress.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                             progress.status === 'AVAILABLE' ? 'bg-indigo-100 text-indigo-700' :
                             'bg-slate-200 text-slate-600'
                          }\`}>{progress.status}</span>
                       </div>
                       <p className="text-slate-600 text-sm mb-4">{progress.phase.description}</p>
                       
                       {progress.status !== 'LOCKED' && progress.phase.resources?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <h5 className="text-sm font-bold text-slate-700 mb-2">Learning Resources</h5>
                            <ul className="space-y-2">
                               {progress.phase.resources.map((res: any) => (
                                 <li key={res.id} className="flex items-center gap-2 text-sm">
                                   <BookOpen className="h-4 w-4 text-indigo-500" />
                                   <a href={res.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{res.title}</a>
                                 </li>
                               ))}
                            </ul>
                          </div>
                       )}
                    </div>
                 ))}
                 {!courses[0] && <div className="text-slate-500 text-center py-10">No active curriculum.</div>}
              </div>
            )}`;

portalContent = portalContent.replace(dashboardPlaceholderRegex, updatedDashboard);

fs.writeFileSync(portalFile, portalContent, 'utf8');
console.log('Successfully patched intern-portal.tsx');
