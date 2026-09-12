const fs = require('fs');
const path = require('path');

const adminFile = path.join(__dirname, '../src/routes/admin.tsx');
let adminContent = fs.readFileSync(adminFile, 'utf8');

// 1. Add new ViewState values
const oldViewState = "type ViewState = 'dashboard' | 'students' | 'courses' | 'events' | 'projects' | 'submissions';";
const newViewState = "type ViewState = 'dashboard' | 'applications' | 'mentors' | 'students' | 'batches' | 'domains' | 'curriculum' | 'courses' | 'events' | 'projects' | 'interviews' | 'certificates' | 'analytics' | 'submissions';";
adminContent = adminContent.replace(oldViewState, newViewState);

// 2. Add imports
const importsToAdd = `
import { DomainsView } from "../components/admin/DomainsView";
import { BatchesView } from "../components/admin/BatchesView";
import { CurriculumView } from "../components/admin/CurriculumView";
import { ApplicationsView } from "../components/admin/ApplicationsView";
`;
adminContent = adminContent.replace('import { getSession, signOut, type AdminSession } from "@/lib/auth";', importsToAdd + '\nimport { getSession, signOut, type AdminSession } from "@/lib/auth";');

// 3. Add to Switch in main container
const newViews = `
            {currentView === 'domains' && <DomainsView />}
            {currentView === 'batches' && <BatchesView />}
            {currentView === 'curriculum' && <CurriculumView />}
            {currentView === 'applications' && <ApplicationsView />}
            {currentView === 'mentors' && <div className="p-8 text-center text-slate-500">Mentors view coming soon</div>}
            {currentView === 'interviews' && <div className="p-8 text-center text-slate-500">Interviews view coming soon</div>}
            {currentView === 'certificates' && <div className="p-8 text-center text-slate-500">Certificates view coming soon</div>}
            {currentView === 'analytics' && <div className="p-8 text-center text-slate-500">Analytics view coming soon</div>}
`;
adminContent = adminContent.replace("{currentView === 'students' && (", newViews + "\n            {currentView === 'students' && (");

// 4. Update the SidebarNav function completely
const sidebarNavRegex = /function SidebarNav\(\{[\s\S]*?\}\) \{[\s\S]*?return \([\s\S]*?    <\/div>\n  \);\n\}/m;

const newSidebarNav = `function SidebarNav({ 
  handleLogout, 
  currentView, 
  setCurrentView 
}: { 
  handleLogout: () => void,
  currentView: ViewState,
  setCurrentView: (view: ViewState) => void
}) {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <li>
      <button
        type="button"
        onClick={() => setCurrentView(view)}
        className={\`group flex w-full items-center gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-all \${
          currentView === view
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }\`}
      >
        <Icon className={\`h-5 w-5 shrink-0 \${currentView === view ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}\`} />
        {label}
      </button>
    </li>
  );

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 py-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-6">
          <li>
            <ul role="list" className="space-y-1">
              <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">People</div>
            <ul role="list" className="space-y-1">
              <NavItem view="applications" icon={UserPlus} label="Applications" />
              <NavItem view="students" icon={Users} label="Students" />
              <NavItem view="mentors" icon={UserCheck} label="Mentors" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">Academy</div>
            <ul role="list" className="space-y-1">
              <NavItem view="domains" icon={CheckCircle2} label="Domains" />
              <NavItem view="batches" icon={Briefcase} label="Batches" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">Content</div>
            <ul role="list" className="space-y-1">
              <NavItem view="curriculum" icon={ClipboardList} label="Curriculum" />
              <NavItem view="projects" icon={Briefcase} label="Projects" />
              <NavItem view="courses" icon={BookOpen} label="Courses" />
              <NavItem view="events" icon={BookOpen} label="Events" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">Evaluation</div>
            <ul role="list" className="space-y-1">
              <NavItem view="submissions" icon={ListChecks} label="Submissions" />
              <NavItem view="interviews" icon={MessageSquare} label="Interviews" />
              <NavItem view="certificates" icon={CheckCircle2} label="Certificates" />
            </ul>
          </li>

          <li className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-x-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-slate-300" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}`;

adminContent = adminContent.replace(sidebarNavRegex, newSidebarNav);

fs.writeFileSync(adminFile, adminContent, 'utf8');
console.log('Successfully patched admin.tsx navigation and views');
