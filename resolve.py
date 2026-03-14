import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'<<<<<<< HEAD.*?=======\s+>>>>>>> [a-f0-9]+ \(.*?\)\s+', '', text, flags=re.DOTALL)
text = re.sub(r'<<<<<<< HEAD.*?VSCode.*?=======\s+(<span class="software-card__text"> VSCode</span>)\s+>>>>>>> [a-f0-9]+ \(.*?\)', r'\1', text, flags=re.DOTALL)
text = re.sub(r'<<<<<<< HEAD.*?<<<<<<< HEAD.*?=======\s+(<p class="ui-section__text"><a href="https://www.instagram.com.*?</p>)\s+>>>>>>> [a-f0-9]+ .*?=======\s+<p class="ui-section__text">.*?</p>\s+>>>>>>> [a-f0-9]+ \(.*?\)', r'\1', text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
