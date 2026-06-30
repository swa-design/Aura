from pathlib import Path

for filepath in [Path('client/pages/Family.tsx'), Path('client/pages/Learning.tsx')]:
    text = filepath.read_text(encoding='utf-8')
    brace = paren = bracket = 0
    in_str = None
    escape = False
    print('---', filepath)
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
            # remove rest of line
            next_nl = text.find('\n', i)
            if next_nl == -1:
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
        if brace < 0 or paren < 0 or bracket < 0:
            line = text.count('\n', 0, i) + 1
            print('underflow at char', i, 'line', line, 'brace', brace, 'paren', paren, 'bracket', bracket)
            break
    else:
        print('final counts brace', brace, 'paren', paren, 'bracket', bracket)
