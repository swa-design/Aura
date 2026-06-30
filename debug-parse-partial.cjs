const ts = require('typescript');
const fs = require('fs');
const path = process.argv[2];
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
let accum = '';
for (let i = 0; i < lines.length; i++) {
  accum += lines[i] + '\n';
  try {
    ts.createSourceFile(path, accum, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX);
  } catch (e) {
    console.log('parse failed at line', i + 1);
    console.log('error:', e.message);
    process.exit(1);
  }
}
console.log('parse success full file');
