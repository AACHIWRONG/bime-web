import json
import re

transcript_path = r'C:\Users\Aaron\.gemini\antigravity-ide\brain\1b7d3cef-2c85-486d-8116-73a26f611d1a\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    data = json.loads(line)
    if data.get('type') == 'CODE_ACTION' and 'style.css' in data.get('content', ''):
        content = data['content']
        match = re.search(r'\[diff_block_start\](.*?)\[diff_block_end\]', content, re.DOTALL)
        if match:
            diff = match.group(1)
            recovered_lines = []
            for d_line in diff.split('\n'):
                if d_line.startswith('+'):
                    recovered_lines.append(d_line[1:])
                elif d_line.startswith(' '):
                    recovered_lines.append(d_line[1:])
            
            with open('recovered_bottom.css', 'w', encoding='utf-8') as out:
                out.write('\n'.join(recovered_lines))
            print('Recovered bottom CSS to recovered_bottom.css! Lines: ' + str(len(recovered_lines)))
            break
