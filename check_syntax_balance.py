from pathlib import Path
import re

path = Path('client/pages/Analytics.tsx')
text = path.read_text(encoding='utf-8')

# Remove comments and string literals (approximate)
pattern = r'''(""".*?"""|'''.
    ???)}