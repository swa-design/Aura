from pathlib import Path
import re
for filepath in [Path('client/pages/Family.tsx'), Path('client/pages/Learning.tsx')]:
    print('===', filepath)
    text = filepath.read_text(encoding='utf-8')
    brace = paren = bracket = 0
    in_str = None
    escape = False
    for i, ch in enumerate(text, start=1):
        if in_str:
            if escape:
                escape = False
                continue
            if ch == '\\':
                escape = True
                continue
            if ch == in_str:
                in_str = None
            continue
        if ch in "'\"`":
            in_str = ch
            continue
        if ch == '/' and text[i:i+1] == '/':
            # Skip rest of line
            nl = text.find('\n', i)
            if nl == -1:
                break
            continue
        if ch == '/' and text[i:i+1] == '*':
            end = text.find('*/', i+1)
            if end == -1:
                break
            continue
        if ch == '{':
            brace += 1
        elif ch == '}':
            brace -= 1
        elif ch == '(':
            paren += 1
        elif ch == ')':
            paren -= 1
        elif ch == '[':
            bracket += 1
        elif ch == ']':
            bracket -= 1
        line = text.count('\n', 0, i) + 1
        if line >= 220 and line <= 233:
            print(f'{line}: brace={brace} paren={paren} bracket={bracket} char={ch}')
    print('FINAL', brace, paren, bracket)
