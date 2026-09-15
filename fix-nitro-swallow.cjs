const fs = require('fs');
const path = '.output/server/_libs/h3+rou3+srvx.mjs';

if (fs.existsSync(path)) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/this\.serve\(\)\.catch\(\(\) => \{\}\)/g, "this.serve().catch(e => { console.error('FATAL NITRO ERROR:', e); process.exit(1); })");
  fs.writeFileSync(path, code);
  console.log('Successfully patched Nitro server to throw errors instead of swallowing them.');
} else {
  console.log('Nitro server file not found, skipping patch.');
}
