import re

html_content = open('index.html', 'r', encoding='utf-8').read()
css_content = open('style.css', 'r', encoding='utf-8').read()
js_content = open('script.js', 'r', encoding='utf-8').read()

# Extract from HTML
html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))
html_classes = set()
for c in re.findall(r'class=["\']([^"\']+)["\']', html_content):
    html_classes.update(c.split())

# Extract from CSS
css_ids = set(re.findall(r'#([a-zA-Z0-9_-]+)', css_content))
css_classes = set(re.findall(r'\.([a-zA-Z0-9_-]+)', css_content))

# Extract from JS
js_ids = set(re.findall(r'getElementById\(["\']([^"\']+)["\']\)', js_content))
js_qs = re.findall(r'(?:querySelector(?:All)?|to|from|fromTo|tl\.to)\(\s*(?:\[)?["\']([^"\']+)["\']', js_content)
js_classes_used = set()
js_ids_used = set(js_ids)
for q in js_qs:
    for sel in q.split(','):
        sel = sel.strip()
        if sel.startswith('.'):
            js_classes_used.add(sel[1:])
        elif sel.startswith('#'):
            js_ids_used.add(sel[1:])

print("=== Mismatches ===")
print("\n[CSS -> HTML] Classes in CSS but NOT in HTML:")
for c in sorted(css_classes - html_classes):
    # filter out pseudo-classes or typical CSS stuff that might be caught
    if c not in ['bime-works__title-area', 'work-card', 'bime-works__sticky', 'bime-works', 'bime-dna__bg']: # Will do full dump
        pass
print(", ".join(sorted(css_classes - html_classes - {'com'})))

print("\n[CSS -> HTML] IDs in CSS but NOT in HTML:")
print(", ".join(sorted(css_ids - html_ids)))

print("\n[JS -> HTML] IDs in JS but NOT in HTML:")
print(", ".join(sorted(js_ids_used - html_ids)))

print("\n[JS -> HTML] Classes in JS but NOT in HTML:")
print(", ".join(sorted(js_classes_used - html_classes)))

