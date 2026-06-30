const fs = require('fs');
const ts = require('./node_modules/typescript');
const source = fs.readFileSync('client/pages/Emails.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Emails.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
if (sourceFile.parseDiagnostics.length === 0) {
  console.log('No parse diagnostics');
  process.exit(0);
}
for (const d of sourceFile.parseDiagnostics) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(d.start);
  const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
  console.log(`${line+1}:${character+1}: ${message}`);
}
