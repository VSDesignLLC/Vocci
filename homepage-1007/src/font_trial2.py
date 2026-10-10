"""Font trial round 2: Manrope-like primaries (round, geometric, warm) on the desktop static page. Two families only: sans + IBM Plex Mono."""
import pathlib, json
R = pathlib.Path(__file__).resolve().parent.parent
s = (R / 'figma' / 'vocci-1007-desktop-1440.html').read_text()
MONO = "'IBM Plex Mono'"
OPTS = [
 ('0', 'Manrope（对照）', "'Manrope'", 'SIL OFL · Google Fonts',
  '上一轮选定的方向，作为对照。O 接近正圆，字面偏宽，整体温和。'),
 ('1', 'Satoshi', "'Satoshi'", 'ITF Free Font License · Fontshare（免费商用）',
  '现代几何无衬线，O 是正圆，比 Manrope 更紧凑利落，细节更精致；在设计圈常见但远没有 Inter / Geist 那么泛滥。'),
 ('2', 'General Sans', "'General Sans'", 'ITF Free Font License · Fontshare（免费商用）',
  '几何骨架加上人文的笔画收尾，比 Satoshi 更柔和、更有温度；字面略窄，小字号正文阅读性好，适合 App 长文本。'),
 ('3', 'Outfit', "'Outfit'", 'SIL OFL · Google Fonts',
  '最"正圆"的一款，几何感最强，字形简单干净，接近 logo 的圆环；风格偏年轻，正文段落略显松。'),
]
css = ''.join("html[data-f=\"%s\"],html[data-f=\"%s\"] *{--font-body:%s,'Inter',sans-serif!important;--font-word:%s,sans-serif!important;--font-display:%s,'Inter',sans-serif!important;--font-mono:%s,ui-monospace,monospace!important}\n" % (k, k, f, f, f, MONO) for k, _, f, *_ in OPTS)
css += """#ft{position:fixed;right:20px;bottom:20px;z-index:9999;width:360px;max-height:calc(100vh - 40px);overflow:auto;background:#fff;border:1px solid rgba(20,20,22,.14);border-radius:14px;padding:14px;font:13px/1.45 system-ui,-apple-system,sans-serif;color:#141416;box-shadow:0 12px 40px rgba(0,0,0,.12)}
#ft b.t{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#55555c;margin-bottom:8px}
#ft button{display:block;width:100%;text-align:left;border:1px solid rgba(20,20,22,.12);background:#fff;border-radius:9px;padding:8px 10px;margin:0 0 6px;font:inherit;cursor:pointer;color:#141416}
#ft button span{display:block;font-size:11px;color:#77777f}
#ft button[aria-pressed="true"]{background:#141416;color:#fff;border-color:#141416}#ft button[aria-pressed="true"] span{color:#bbb}
#ft p{margin:8px 0 0;color:#55555c;font-size:12px}
#ft .x{float:right;border:0;background:none;width:auto;padding:0;margin:0;color:#55555c}
#ft details{margin-top:10px;border-top:1px solid #e3e3df;padding-top:8px;font-size:12px;color:#3a3a3f}#ft summary{cursor:pointer;font-weight:600}
#ft details li{margin:6px 0}#ft details a{color:#141416}
#ft .spec{margin-top:8px;font-size:40px;line-height:1;letter-spacing:-.02em}
#ft.min button:not(.x),#ft.min p,#ft.min details,#ft.min .spec{display:none}
"""
links = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Outfit:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap">'
         '<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500,600&display=swap">')
PAID = [
 ('Euclid Circular A / B', 'Swiss Typefaces', 'https://www.swisstypefaces.com/fonts/euclid/', '正圆 O、几何又带一点人文，最接近"Manrope 的精致付费版"'),
 ('TT Norms Pro', 'TypeType', 'https://typetype.org/fonts/tt-norms-pro/', '几何圆润，字重和字宽齐全，App 与印刷都好用，价格相对友好'),
 ('Aeonik', 'CoType Foundry', 'https://cotypefoundry.com/our-fonts/aeonik', '几何但克制，偏高端硬件/科技品牌气质'),
 ('Gilroy', 'Radomir Tinkov', 'https://www.tinkov.info/gilroy.html', '正圆几何，亲和、偏消费品；使用较广，辨识度一般'),
]
paid = ''.join('<li><a href="%s">%s</a> · %s<br>%s</li>' % (u, n, f, d) for n, f, u, d in PAID)
btns = ''.join('<button data-k="%s" aria-pressed="false">%s<span>%s</span></button>' % (k, n, lic) for k, n, _, lic, _ in OPTS)
notes = {k: n for k, *_, n in OPTS}
fams = {k: f for k, _, f, *_ in OPTS}
panel = ('<div id="ft"><button class="x" aria-label="收起">–</button><b class="t">主字体候选 · 第二轮（+ IBM Plex Mono）</b>%s<div class="spec" id="fts">Oo Vocci 08</div><p id="ftn"></p>'
         '<details><summary>付费候选（需授权 / 试用文件后才能放进页面对比）</summary><ul>%s</ul></details></div>'
         '<script>(function(){var N=%s,F=%s,ft=document.getElementById("ft"),bs=ft.querySelectorAll("button[data-k]");'
         'function set(k){document.documentElement.dataset.f=k;bs.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.k===k)});document.getElementById("ftn").textContent=N[k];document.getElementById("fts").style.fontFamily=F[k];try{history.replaceState(null,"","#f="+k)}catch(e){}}'
         'bs.forEach(function(b){b.onclick=function(){set(b.dataset.k)}});ft.querySelector(".x").onclick=function(){ft.classList.toggle("min")};'
         'var m=/f=(\\d)/.exec(location.hash);set(m?m[1]:"1");})();</script>') % (btns, paid, json.dumps(notes, ensure_ascii=False), json.dumps(fams))
s = s.replace('</head>', links + '<style id="font-trial-2">' + css + '</style></head>', 1).replace('</body>', panel + '</body>', 1)
s = s.replace('<title>Vocci Homepage · desktop-1440</title>', '<title>Vocci Font Trial · Round 2</title>', 1)
(R / 'figma' / 'font-trial-2.html').write_text(s); print('font-trial-2', round(len(s) / 1e6, 1), 'MB')
