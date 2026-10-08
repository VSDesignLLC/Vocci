"""Figma-import snapshots of homepage-1007 at 1440 / 768 / 390.
Input: frozen DOM dumps (see src/figma_freeze.js, run in a browser at each width, POSTed to snap/).
Per width: resolve every @media rule for that viewport (keep + unwrap or drop), turn vw/vh/svh into px,
pin the page width, and inline images/fonts so each file is one self-contained HTML page."""
import re, sys, base64, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
SNAP = pathlib.Path(sys.argv[1])
SIZES = {'desktop-1440': (1440, 900, True), 'tablet-768': (768, 1024, False), 'mobile-390': (390, 844, False)}
MIME = {'.webp': 'image/webp', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}
cache = {}
def uri(p):
    if p not in cache:
        f = R / p; cache[p] = 'data:%s;base64,%s' % (MIME[f.suffix], base64.b64encode(f.read_bytes()).decode()) if f.exists() else p
    return cache[p]

def cond_ok(c, W, H, hover):
    c = c.strip()
    if c in ('all', 'screen', ''): return True
    for part in c.split(','):                       # comma = OR
        ok = True
        for f in re.findall(r'\(([^)]*)\)', part):
            k, _, v = [x.strip() for x in f.partition(':')]
            n = float(re.sub(r'[^\d.]', '', v) or 0)
            ok &= {'max-width': W <= n, 'min-width': W >= n, 'max-height': H <= n, 'min-height': H >= n,
                   'hover': (v == 'hover') == hover, 'pointer': (v == 'fine') == hover,
                   'prefers-reduced-motion': v != 'reduce', 'prefers-color-scheme': v == 'light'}.get(k, True)
        if ok: return True
    return False

def resolve(css, W, H, hover):
    out, i = [], 0
    while True:
        j = css.find('@media', i)
        if j < 0: out.append(css[i:]); break
        out.append(css[i:j]); b = css.index('{', j); cond = css[j + 6:b]
        d, k = 1, b + 1
        while d:
            d += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        body = css[b + 1:k - 1]
        if cond_ok(cond, W, H, hover): out.append(resolve(body, W, H, hover))
        i = k
    return ''.join(out)

for name, (W, H, hover) in SIZES.items():
    s = (SNAP / (name + '.html')).read_text()
    # scroll effects frozen mid-way leave inline filter/scale on images (e.g. the hero dims + zooms as it leaves); inline style serialises as "prop: value;"
    s = re.sub(r'(style="[^"]*?)filter: brightness\([^)]*\);?\s*', r'\1', s)
    s = re.sub(r'(style="[^"]*?)scale: [\d.]+;?\s*', r'\1', s)
    s = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + resolve(m.group(2), W, H, hover) + m.group(3), s, flags=re.S)
    unit = lambda m: '%gpx' % round(float(m.group(1)) * (W if m.group(2) == 'vw' else H) / 100, 2)
    s = re.sub(r'(?<![\w.-])(\d+(?:\.\d+)?)(vw|vh|svh|dvh|lvh)\b', unit, s)
    s = re.sub(r'<meta name="viewport"[^>]*>', '<meta name="viewport" content="width=%d">' % W, s)
    s = s.replace('</head>', '<style id="figma-frame">html,body{width:%dpx!important;min-width:%dpx;max-width:%dpx;margin:0 auto;overflow-x:hidden}.marquee__track{animation:none!important;transform:none!important}</style></head>' % (W, W, W), 1)
    s = re.sub(r'(?<![\w/.-])((?:img[23]?|vendor)/[A-Za-z0-9._-]+\.(?:jpg|png|webp|ttf|svg))', lambda m: uri(m.group(1)), s)
    s = re.sub(r'<title>.*?</title>', '<title>Vocci Homepage · %s</title>' % name, s, count=1, flags=re.S)
    (R / 'figma' / ('vocci-1007-%s.html' % name)).write_text(s)
    left = re.findall(r'@media', s); print(name, W, round(len(s) / 1e6, 1), 'MB', 'media left:', len(left))
