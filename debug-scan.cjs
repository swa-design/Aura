const ts = require('typescript');
const fs = require('fs');
const path = 'client/pages/Family.tsx';
const source = fs.readFileSync(path, 'utf8');
const lines = source.split(/\r?\n/);
const line = 230;
const pos = lines.slice(0, line-1).reduce((sum, l) => sum + l.length + 1, 0);
console.log('line230 text:', JSON.stringify(lines[line-1]));
console.log('pos', pos);
const scanner = ts.createScanner(ts.ScriptTarget.ES2020, true, ts.LanguageVariant.JSX, source);
let tok;
let i=0;
while (true) {
  tok = scanner.scan();
  if (tok === ts.SyntaxKind.EndOfFileToken) break;
  const start = scanner.getTextPos() - scanner.getTokenText().length;
  if (start >= pos - 100 && start <= pos + 50) {
    console.log('tok', start, ts.SyntaxKind[tok], JSON.stringify(scanner.getTokenText()));
  }
}
