js = open('script.js', 'r', encoding='utf-8').read()
html = open('index.html', 'r', encoding='utf-8').read()

import re

# All getElementById calls
all_ids = re.findall(r'getElementById\(["\']([^"\']+)["\']\)', js)
# All querySelector / gsap selectors  
all_qs_raw = re.findall(r'["\']([#.][^"\']+)["\']', js)

print('=== IDs in JS vs HTML ===')
for id_ in sorted(set(all_ids)):
    in_html = f'id="{id_}"' in html or f"id='{id_}'" in html
    print(f"  {'OK' if in_html else '** MISSING **'} #{id_}")

print()
print('=== Key Classes in JS vs HTML ===')
for sel in sorted(set(all_qs_raw)):
    for part in re.findall(r'\.([a-zA-Z0-9_-]+)', sel):
        if len(part) > 4:  # skip short utility names
            in_html = f'class="{part}"' in html or f' {part}' in html or f'"{part}' in html
            print(f"  {'OK' if in_html else '** MISSING **'}  .{part}")
