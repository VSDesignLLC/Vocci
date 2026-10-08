"""Font trial page: the desktop static snapshot + a switcher for five open-source (SIL OFL 1.1) brand pairings."""
import pathlib
R = pathlib.Path(__file__).resolve().parent.parent
s = (R / 'figma' / 'vocci-1007-desktop-1440.html').read_text()
OPTS = [
 ('0', '现状 · IBM Plex Sans + IBM Plex Mono', "'IBM Plex Sans'", "'IBM Plex Sans'", "'IBM Plex Mono'",
  '当前线上字体，作为对照。工程感、理性，Mono 与 Sans 同一家族。'),
 ('1', 'Inter + JetBrains Mono', "'Inter'", "'Inter'", "'JetBrains Mono'",
  '最中性、最通用的界面字体，屏幕/印刷/App 都稳定；JetBrains Mono 做标签和系统类信息，偏开发者语境。'),
 ('2', 'Geist + Geist Mono', "'Geist'", "'Geist'", "'Geist Mono'",
  '同一家族的 Sans 与 Mono，只算"一套"字体，最容易统一；几何感更强，偏 AI / 科技产品调性。'),
 ('3', 'Manrope + IBM Plex Mono', "'Manrope'", "'Manrope'", "'IBM Plex Mono'",
  '字形更圆润温和，贴近"戴在手上的饰品"这层亲和感；Mono 沿用现有 Plex Mono，改动最小。'),
 ('4', 'Instrument Sans + Instrument Serif（仅大标题）+ DM Mono', "'Instrument Sans'", "'Instrument Sans'", "'DM Mono'",
  '正文无衬线、大标题用衬线，最有"精品/编辑"气质，适合印刷与视频；代价是三种字体，衬线只能用在大标题。'),
 ('5', 'Hanken Grotesk + Fragment Mono', "'Hanken Grotesk'", "'Hanken Grotesk'", "'Fragment Mono'",
  '偏瑞士国际主义的 Grotesk，克制、精致，接近高端硬件品牌的感觉；Fragment Mono 线条细，做系统/模型类物料的点缀。'),
]
css = ''.join("html[data-f=\"%s\"]{--font-body:%s,Helvetica,Arial,sans-serif;--font-word:%s,sans-serif;--font-display:%s,Helvetica,Arial,sans-serif;--font-mono:%s,ui-monospace,monospace}\n" % (k, b, b, d, m) for k, _, b, d, m, _ in OPTS)
css += """html[data-f="4"] .pn h1,html[data-f="4"] .pn h2{font-family:'Instrument Serif',Georgia,serif!important;font-weight:400!important;letter-spacing:-.01em!important}
#ft{position:fixed;right:20px;bottom:20px;z-index:9999;width:340px;background:#fff;border:1px solid rgba(20,20,22,.14);border-radius:14px;padding:14px;font:13px/1.45 system-ui,-apple-system,sans-serif;color:#141416;box-shadow:0 12px 40px rgba(0,0,0,.12)}
#ft b.t{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#55555c;margin-bottom:8px}
#ft button{display:block;width:100%;text-align:left;border:1px solid rgba(20,20,22,.12);background:#fff;border-radius:9px;padding:8px 10px;margin:0 0 6px;font:inherit;cursor:pointer;color:#141416}
#ft button[aria-pressed="true"]{background:#141416;color:#fff;border-color:#141416}
#ft p{margin:8px 0 0;color:#55555c;font-size:12px}
#ft .x{float:right;border:0;background:none;width:auto;padding:0;margin:0;color:#55555c}
#ft.min button:not(.x),#ft.min p{display:none}
"""
fam = 'family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Manrope:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif&family=DM+Mono:wght@400;500&family=Hanken+Grotesk:wght@400;500;600&family=Fragment+Mono&display=swap'
head = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?%s"><style id="font-trial">%s</style>' % (fam, css))
btns = ''.join('<button data-k="%s" aria-pressed="false">%s</button>' % (k, n) for k, n, *_ in OPTS)
notes = {k: n for k, *_, n in OPTS}
panel = ('<div id="ft"><button class="x" aria-label="收起">–</button><b class="t">字体方案 · 全部 SIL OFL 1.1</b>%s<p id="ftn"></p></div>'
         '<script>(function(){var N=%r,ft=document.getElementById("ft"),bs=ft.querySelectorAll("button[data-k]");'
         'function set(k){document.documentElement.dataset.f=k;bs.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.k===k)});document.getElementById("ftn").textContent=N[k];try{history.replaceState(null,"","#f="+k)}catch(e){}}'
         'bs.forEach(function(b){b.onclick=function(){set(b.dataset.k)}});ft.querySelector(".x").onclick=function(){ft.classList.toggle("min")};'
         'var m=/f=(\\d)/.exec(location.hash);set(m?m[1]:"0");})();</script>') % (btns, notes)
s = s.replace('</head>', head + '</head>', 1).replace('</body>', panel + '</body>', 1)
s = s.replace('<title>Vocci Homepage · desktop-1440</title>', '<title>Vocci Font Trial</title>', 1)
(R / 'figma' / 'font-trial.html').write_text(s); print('font-trial', round(len(s) / 1e6, 1), 'MB')
