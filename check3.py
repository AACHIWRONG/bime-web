import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

for m in re.finditer(r'([^{}]+)\s*\{([^{}]*?(?:#000|black|rgba\(0|rgba\(17|#111|#222)[^{}]*?)\}', css):
    selector = m.group(1).strip()
    props = m.group(2).strip()
    print(f"SELECTOR: {selector}")
    # print(f"PROPS: {props}\n")
