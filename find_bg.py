import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Find all blocks: selector { ... background: ... }
blocks = re.findall(r'([^{}]+)\s*\{[^{}]*?background(?:-color)?\s*:\s*([^;}]+)', css)
for selector, bg in blocks:
    bg = bg.strip()
    if not ('transparent' in bg or '#fff' in bg or '#fcfcfc' in bg or 'var(--bg-color)' in bg or 'white' in bg):
        print(f"{selector.strip()} -> {bg}")
