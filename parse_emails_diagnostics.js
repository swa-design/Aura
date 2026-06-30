const fs = require('fs');
const ts = require('./node_modules/typescript');
const source = fs.readFileSync('client/pages/Emails.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Emails.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const diagnostics = sourceFile.parseDiagnostics;
if (!diagnostics.length) {
  console.log('no diagnostics');
  process.exit(0);
}
for (const d of diagnostics) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(d.start);
  let message = d.messageText;
  if (typeof message !== 'string') {
    message = ts.flattenDiagnosticMessageText(message, '\n');
  }
  console.log(`${line + 1}:${character + 1}: ${message}`);
}
