const fs = require('fs');
const ts = require('./node_modules/typescript');
const source = fs.readFileSync('client/pages/Analytics.tsx', 'utf8');
const sf = ts.createSourceFile('Analytics.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const diagnostics = sf.parseDiagnostics;
if (diagnostics.length === 0) {
  console.log('No parse diagnostics');
  process.exit(0);
}
for (const d of diagnostics) {
  const { line, character } = sf.getLineAndCharacterOfPosition(d.start);
  const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
  console.log(`${line + 1}:${character + 1}: ${message}`);
}
