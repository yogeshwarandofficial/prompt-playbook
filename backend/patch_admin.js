const fs = require('fs');
const path = require('path');

const adminFile = path.join(__dirname, '../src/routes/admin.tsx');
let adminContent = fs.readFileSync(adminFile, 'utf8');

const projectsCode = fs.readFileSync(path.join(__dirname, 'projects_view_code.tsx'), 'utf8');
const submissionsCode = fs.readFileSync(path.join(__dirname, 'submissions_view_code.tsx'), 'utf8');

// Strip out the imports from projectsCode since we already added them to admin.tsx
const projectsBody = projectsCode.replace(/import {.*?} from "lucide-react";\n/s, '')
  .replace(/import {.*?} from "react";\n/s, '');

// Replace ProjectsView
const pRegex = /function ProjectsView\(\) \{[\s\S]*?return \([\s\S]*?\);\n\}/m;
adminContent = adminContent.replace(pRegex, projectsBody);

// Replace SubmissionsView
const sRegex = /function SubmissionsView\(\) \{[\s\S]*?return \([\s\S]*?\);\n\}/m;
adminContent = adminContent.replace(sRegex, submissionsCode);

fs.writeFileSync(adminFile, adminContent, 'utf8');
console.log('Successfully patched admin.tsx');
