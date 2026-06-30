import fs from 'fs';
import ts from 'typescript';
for (const path of ['client/pages/Family.tsx', 'client/pages/Learning.tsx']) {
  const source = fs.readFileSync(path, 'utf8');
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX);
  const diags = file.parseDiagnostics;
  console.log('FILE', path);
  if (diags.length === 0) {
    console.log('  no parse diagnostics');
  } else {
    diags.forEach(d => {
      const pos = file.getLineAndCharacterOfPosition(d.start);
      const snippet = source.slice(Math.max(0, d.start - 40), d.start + 40).replace(/\n/g, '\\n');
      console.log(`  ${pos.line+1}:${pos.character+1} ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
      console.log('   snippet:', snippet);
    });
  }
}
