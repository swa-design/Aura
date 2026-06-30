const ts = require('typescript');
const fs = require('fs');
const files = ['client/pages/Family.tsx', 'client/pages/Learning.tsx'];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  console.log('FILE', file);
  sf.parseDiagnostics.forEach((d) => {
    const start = d.start || 0;
    const { line, character } = sf.getLineAndCharacterOfPosition(start);
    console.log(`${line + 1}:${character + 1} ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
  });
}
