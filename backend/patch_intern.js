const fs = require('fs');
const path = require('path');

const internFile = path.join(__dirname, '../src/routes/intern-portal.tsx');
let internContent = fs.readFileSync(internFile, 'utf8');

const projectsCode = fs.readFileSync(path.join(__dirname, 'intern_projects_view_code.tsx'), 'utf8');
const submissionsCode = fs.readFileSync(path.join(__dirname, 'intern_submissions_view_code.tsx'), 'utf8');

// Replace ProjectsView
const pRegex = /function ProjectsView\(\) \{[\s\S]*?return \([\s\S]*?\);\n\}/m;
internContent = internContent.replace(pRegex, projectsCode.replace('export function ProjectsView', 'function ProjectsView'));

// Replace SubmissionsView
const sRegex = /function SubmissionsView\(\) \{[\s\S]*?return \([\s\S]*?\);\n\}/m;
internContent = internContent.replace(sRegex, submissionsCode.replace('export function SubmissionsView', 'function SubmissionsView'));

fs.writeFileSync(internFile, internContent, 'utf8');
console.log('Successfully patched intern-portal.tsx');
