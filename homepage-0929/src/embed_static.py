"""Inline images/fonts into the Figma snapshots written by src/figma_static.js."""
import re, base64, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
MIME = {'.webp': 'image/webp', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}
cache = {}
def uri(p):
    if p not in cache: f = R/p; cache[p] = 'data:%s;base64,%s' % (MIME[f.suffix], base64.b64encode(f.read_bytes()).decode())
    return cache[p]
for name in ['figma-static.html', 'figma-static-hover.html']:
    f = R/'dist'/name; s = f.read_text()
    s = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', '', s)
    s = re.sub(r'(?<![\w/.-])(img[23]/[A-Za-z0-9._-]+\.(?:jpg|png|webp|ttf|svg))', lambda m: uri(m.group(1)), s)
    s = s.replace('http://127.0.0.1:8732/', '')
    f.write_text(s); print(name, round(len(s) / 1e6, 1), 'MB')
