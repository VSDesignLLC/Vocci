"""Build a single self-contained file: dist/vocci-homepage-standalone.html
Every image/font becomes a data: URI; the 3D bundle and model/light data are inlined
(the bundle is kept as text and started from a blob URL, so it still loads only on desktop).
External links (Google Fonts, Lenis CDN) are dropped — local fonts already cover the type.
Run after src/patch.py:  python3 src/embed.py"""
import re, base64, mimetypes, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
s = (R/'index.html').read_text()
s = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', '', s)
s = re.sub(r'<script src="https://cdn\.jsdelivr\.net/npm/lenis[^>]*></script>', '', s)
m = re.search(r"'(vendor/how3d\.[a-f0-9]+\.js)'", s); assert m
bundle = (R/m.group(1)).read_text(); assets = (R/'vendor/how3d-assets.js').read_text()
s = s.replace("'%s'" % m.group(1), "URL.createObjectURL(new Blob([document.getElementById('how3d-src').textContent],{type:'text/javascript'}))")
MIME = {'.webp': 'image/webp', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}
cache = {}
def uri(p):
    if p not in cache:
        f = R/p; cache[p] = 'data:%s;base64,%s' % (MIME.get(f.suffix, mimetypes.guess_type(f.name)[0]), base64.b64encode(f.read_bytes()).decode())
    return cache[p]
s = re.sub(r'(?<![\w/.-])(img[23]/[A-Za-z0-9._-]+\.(?:jpg|png|webp|ttf|svg))', lambda mm: uri(mm.group(1)), s)
left = re.findall(r'["\'(]((?:img[23]|vendor)/[A-Za-z0-9._-]+)', s)   # quoted / url() refs only; code comments may mention paths
left = [x for x in left if x != "vendor/how3d.js"]   # only mentioned in comments
assert not left, left
s = s.replace('<main class="page gridall"', '<script>' + assets + '</script><script type="text/plain" id="how3d-src">' + bundle + '</script><main class="page gridall"', 1)   # before motion.js runs
(R/'dist').mkdir(exist_ok=True); out = R/'dist/vocci-homepage-standalone.html'; out.write_text(s)
print(out, round(out.stat().st_size / 1e6, 1), 'MB,', len(cache), 'files inlined')
