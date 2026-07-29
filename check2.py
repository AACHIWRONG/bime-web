import re

with open('style.css.bak', 'r', encoding='utf-8') as f:
    css = f.read()

blocks = re.findall(r'([^{}]+)\s*\{[^{}]*?background(?:-color)?\s*:\s*([^;}]+)', css)
for selector, bg in blocks:
    bg = bg.strip()
    print(f"{selector.strip()} -> {bg}")
