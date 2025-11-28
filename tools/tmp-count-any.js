const fs = require('fs');
const path = 'tools/lint-summary/apps-publimicro.json';
let data = '[]';
try { data = fs.readFileSync(path, 'utf8'); } catch (e) { console.error('ERROR: cannot read', path); process.exit(2); }
const d = JSON.parse(data || '[]');
const counts = {};
d.forEach(f => { (f.messages||[]).forEach(m => { if (m.ruleId === '@typescript-eslint/no-explicit-any') { counts[f.filePath] = (counts[f.filePath]||0) + 1 } }) });
const arr = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
if (arr.length===0) { console.log('No explicit-any entries found'); } else { arr.slice(0,50).forEach(([f,c]) => console.log(`${c}\t${f}`)); }
