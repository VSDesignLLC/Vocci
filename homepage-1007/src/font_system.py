"""Vocci font options · compact type system for the six trial pairings. Static, fixed 1440 wide, Figma-import friendly."""
import pathlib, html
R = pathlib.Path(__file__).resolve().parent.parent
GF = 'https://fonts.google.com/specimen/'
OPTS = [
 dict(n='01', name='Inter + JetBrains Mono', sans='Inter', disp=None, mono='JetBrains Mono', fam='2 种字体',
      tone='中性 · 通用 · 理性',
      about='Inter 是为屏幕界面设计的无衬线体，几乎在任何尺寸和介质下都稳定清晰；JetBrains Mono 是为代码阅读设计的等宽字体，字形开阔，做标签和系统信息很利落。整体最"安全"，个性最弱。',
      fit='适合想要稳定、不出错、跨平台一致性最高的方向。', risk='辨识度偏低，与大量科技产品雷同。'),
 dict(n='02', name='Geist + Geist Mono', sans='Geist', disp=None, mono='Geist Mono', fam='1 个家族',
      tone='几何 · 现代 · AI 科技感',
      about='Geist 由 Vercel 发布，Sans 与 Mono 同一家族、同一套骨架，等宽版本只是把字宽统一，因此全套视觉最统一。几何感明显，偏 AI / 开发者产品。',
      fit='最符合"品牌字体越少越好"，一个家族覆盖网页、App、视频和系统物料。', risk='较新，部分印刷场景需自行安装字体文件；气质偏冷。'),
 dict(n='03', name='Manrope + IBM Plex Mono', sans='Manrope', disp=None, mono='IBM Plex Mono', fam='2 种字体',
      tone='圆润 · 温和 · 亲和',
      about='Manrope 字形更圆、更开放，弱化工程感，贴近"戴在手上的饰品"的亲和与日常；标签沿用现在的 IBM Plex Mono，和现有设计衔接最顺。',
      fit='想在科技感之外增加温度、面向更广泛的日常用户。', risk='小字号正文略宽，长段落需注意行长。'),
 dict(n='04', name='DM Sans + Newsreader + DM Mono', sans='DM Sans', disp='Newsreader', mono='DM Mono', fam='3 种字体（衬线仅大标题）',
      tone='编辑感 · 精品 · 叙事',
      about='正文和标签用同一家族的 DM Sans / DM Mono；大标题用 Newsreader，一款为屏幕阅读设计、带光学尺寸的衬线体，对比适中，有杂志式的叙事感。',
      fit='品牌想强调"真实生活、人与对话"，印刷物料和视频片头表现力最强。', risk='三种字体，规则必须严格：衬线只用于 H1/H2。'),
 dict(n='05', name='Hanken Grotesk + Fragment Mono', sans='Hanken Grotesk', disp=None, mono='Fragment Mono', fam='2 种字体',
      tone='克制 · 精致 · 瑞士风',
      about='Hanken Grotesk 是偏国际主义风格的 Grotesk，比例紧凑、细节克制，接近高端硬件品牌的气质；Fragment Mono 线条细，适合做系统 / 模型类信息的点缀。',
      fit='希望品牌更像高端硬件，而非 App 或互联网产品。', risk='Fragment Mono 只有常规字重，标签层级靠字号和颜色区分。'),
 dict(n='06', name='DM Sans + Source Serif 4 + DM Mono', sans='DM Sans', disp='Source Serif 4', mono='DM Mono', fam='3 种字体（衬线仅大标题）',
      tone='素净 · 理性 · 可信',
      about='与方案 04 同结构，大标题换成 Adobe 出品的 Source Serif 4：更素净、结构更理性，书卷气更少，和科技产品更搭，同时保留衬线带来的可信与质感。',
      fit='想要衬线的质感，但不想太文艺。', risk='同方案 04，需严格限制衬线的使用范围。'),
]
ROLES = [  # role, which font, size/weight/line/tracking, sample, css
 ('H1 / H2 大标题', 'disp', '33 / 500 / 1.12 / -2.2%', 'Your real life. Context for your AI.', 'font-size:33px;font-weight:500;line-height:1.12;letter-spacing:-.022em'),
 ('引言 Pull quote', 'disp', '26 / 400 / 1.35 / -1%', '“This AI Ring Ditches Health Tracking To Be A Voice Recorder”', 'font-size:26px;font-weight:400;line-height:1.35;letter-spacing:-.01em'),
 ('H3 小标题', 'sans', '21.6 / 500 / 1.22 / -1.8%', 'The most elegant way to record.', 'font-size:21.6px;font-weight:500;line-height:1.22;letter-spacing:-.018em'),
 ('正文 Body', 'sans', '14 / 400 / 1.5 / 0', 'Double-click to record. Click once during recording to highlight a moment.', 'font-size:14px;font-weight:400;line-height:1.5'),
 ('导航 Nav', 'sans', '14 / 500 / 1 / 0', 'About   How it works   Stories   FAQ   Store', 'font-size:14px;font-weight:500;white-space:pre'),
 ('标签 Label', 'mono', '11 / 500 / 1.2 / +14% · 大写', '01 · Noisy rooms', 'font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase'),
 ('按钮 Button', 'mono', '12 / 500 / 1 / +14% · 大写', 'Buy now', 'font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase'),
 ('卖点 Feature', 'mono', '11.5 / 500 / 1.35 / +6% · 大写', '8 hours of continuous recording', 'font-size:11.5px;font-weight:500;letter-spacing:.06em;text-transform:uppercase'),
]
def ff(f, kind): return "'%s',%s" % (f, 'Georgia,serif' if kind == 'serif' else ('ui-monospace,monospace' if kind == 'mono' else 'Helvetica,Arial,sans-serif'))
def board(o):
    sans, mono, disp = ff(o['sans'], 'sans'), ff(o['mono'], 'mono'), ff(o['disp'], 'serif') if o['disp'] else ff(o['sans'], 'sans')
    dweight = '500'
    fams = [('主字体 Primary', o['sans'], 'sans', '正文、小标题、导航；无衬线方案中也用于大标题与引言')]
    if o['disp']: fams.append(('标题字体 Display', o['disp'], 'serif', '仅 H1 / H2 大标题与引言，其他地方一律不用'))
    fams.append(('系统字体 Mono', o['mono'], 'mono', '标签、编号、按钮、卖点、参数等系统 / 模型类信息'))
    cards = ''.join('<div class="fc"><span class="lb">%s</span><div class="aa" style="font-family:%s">Aa</div><b style="font-family:%s">%s</b><p>%s</p><p class="lic">SIL Open Font License 1.1 · <a href="%s%s">Google Fonts</a></p></div>'
                    % (r, ff(f, k), ff(f, k), f, html.escape(u), GF, f.replace(' ', '+')) for r, f, k, u in fams)
    rows = ''.join('<tr><td class="role">%s</td><td class="fn">%s</td><td class="spec">%s</td><td class="smp" style="font-family:%s;%s">%s</td></tr>'
                   % (r, {'disp': (o['disp'] or o['sans']), 'sans': o['sans'], 'mono': o['mono']}[w], s, {'disp': disp, 'sans': sans, 'mono': mono}[w], css, html.escape(t)) for r, w, s, t, css in ROLES)
    spec = ('<div class="mock"><div class="mc"><span class="ml" style="font-family:%s">Recording</span><h3 style="font-family:%s">Two things, done properly.</h3>'
            '<p style="font-family:%s">The AI wearable built to close the loop between your real life and your AI tool.</p>'
            '<ul style="font-family:%s"><li>Clear pickup in noisy rooms</li><li>5-meter voice pickup</li><li>8 hours of continuous recording</li></ul>'
            '<span class="mb" style="font-family:%s">Buy now</span></div>'
            '<div class="mc dark"><span class="ml" style="font-family:%s">04 · AI agent takes over</span><h3 style="font-family:%s">Ask anywhere. Context comes with it.</h3>'
            '<p style="font-family:%s">Thursday — as long as Ray ships the sizing-kit flow by Wednesday noon.</p><span class="ml" style="font-family:%s">← context via Vocci MCP</span></div></div>') % (mono, disp, sans, mono, mono, mono, disp, sans, mono)
    return ('<section class="bd"><header><span class="no">方案 %s</span><h2 style="font-family:%s;font-weight:%s">%s</h2><div class="tags"><span>%s</span><span>%s</span><span>全部 SIL OFL 1.1 · 可商用</span></div></header>'
            '<div class="intro"><p>%s</p><p><b>适合：</b>%s</p><p><b>注意：</b>%s</p></div>'
            '<h4>字体 Fonts</h4><div class="fcs">%s</div><h4>网页中的应用 Type scale（桌面 1440）</h4><table><thead><tr><th>角色</th><th>字体</th><th>字号 / 字重 / 行高 / 字距</th><th>示例</th></tr></thead><tbody>%s</tbody></table>'
            '<h4>组合示例 In context</h4>%s<p class="fp">整页效果见本页下方 <a href="#fo-%s">方案 %s · 整页</a>（单独页面：<a href="font-option-%s.html">font-option-%s.html</a>）</p></section>') % (o['n'], disp, dweight, o['name'], o['tone'], o['fam'], html.escape(o['about']), html.escape(o['fit']), html.escape(o['risk']), cards, rows, spec, o['n'], o['n'], o['n'], o['n'])

# ---------- per-option full pages: desktop static snapshot locked to one pairing (each is its own Figma-import URL) ----------
BASE = (R / 'figma' / 'vocci-1007-desktop-1440.html').read_text()
def gfam(f):
    q = f.replace(' ', '+')
    return {'DM Sans': 'DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600', 'Newsreader': 'Newsreader:opsz,wght@6..72,400;6..72,500',
            'Source Serif 4': 'Source+Serif+4:opsz,wght@8..60,400;8..60,500', 'Fragment Mono': 'Fragment+Mono'}.get(f, q + ':wght@400;500;600')
for o in OPTS:
    fams = [o['sans'], o['mono']] + ([o['disp']] if o['disp'] else [])
    link = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?%s&display=swap">' % '&'.join('family=' + gfam(f) for f in fams)
    css = ":root,html *{--font-body:%s!important;--font-word:%s!important;--font-display:%s!important;--font-mono:%s!important}" % (ff(o['sans'], 'sans'), ff(o['sans'], 'sans'), ff(o['sans'], 'sans'), ff(o['mono'], 'mono'))
    if o['disp']: css += ".pn h1,.pn h2{font-family:%s!important;font-weight:500!important;letter-spacing:-.015em!important}" % ff(o['disp'], 'serif')
    page_o = BASE.replace('</head>', link + '<style id="font-option">' + css + '</style></head>', 1)
    page_o = page_o.replace('<title>Vocci Homepage · desktop-1440</title>', '<title>Vocci · Font option %s</title>' % o['n'], 1)
    (R / 'figma' / ('font-option-%s.html' % o['n'])).write_text(page_o)
fam = 'family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Manrope:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=DM+Mono:wght@400;500&family=Hanken+Grotesk:wght@400;500;600&family=Fragment+Mono&family=IBM+Plex+Sans:wght@400;500;600&display=swap'
CSS = """*{box-sizing:border-box}html,body{margin:0;width:1440px;background:#f5f5f3;color:#141416;font:15px/1.6 'IBM Plex Sans',system-ui,sans-serif}
a{color:inherit}.wrap{width:1440px}
.cover{padding:96px 80px 72px;border-bottom:1px solid #d6d6d2;background:#fff}
.cover .lb,.lb{font:500 11px/1.2 'IBM Plex Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#55555c}
.cover h1{font-size:56px;line-height:1.05;letter-spacing:-.025em;font-weight:500;margin:16px 0 20px}
.cover p{max-width:820px;color:#55555c;margin:0 0 10px}
.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px}
.rules div{background:#f5f5f3;border:1px solid #e3e3df;border-radius:14px;padding:20px 22px}
.rules b{display:block;margin-bottom:6px}.rules p{margin:0;font-size:14px}
.ov{width:100%;border-collapse:collapse;margin-top:36px;font-size:14px}
.ov th,.ov td{text-align:left;padding:12px 14px;border-bottom:1px solid #e3e3df}.ov th{font:500 11px/1.2 'IBM Plex Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:#55555c}
.bd{padding:72px 80px 80px;border-bottom:1px solid #d6d6d2}
.bd:nth-child(odd){background:#fff}
.bd header{display:flex;flex-direction:column;gap:10px}
.no{font:500 12px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;color:#D9551F}
.bd h2{font-size:44px;line-height:1.08;letter-spacing:-.02em;margin:0}
.tags{display:flex;gap:8px;flex-wrap:wrap}.tags span{font:500 11px/1 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;border:1px solid #d6d6d2;border-radius:99px;padding:7px 11px;color:#3a3a3f}
.intro{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:32px;margin:28px 0 8px}.intro p{margin:0;color:#3a3a3f;font-size:14.5px}
h4{font:500 11px/1.2 'IBM Plex Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#55555c;margin:44px 0 16px;padding-top:20px;border-top:1px solid #e3e3df}
.fcs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.fc{border:1px solid #e3e3df;border-radius:14px;padding:22px;background:#fafaf8}
.fc .aa{font-size:96px;line-height:1;letter-spacing:-.03em;margin:14px 0 10px}
.fc b{display:block;font-size:20px;font-weight:500}.fc p{margin:8px 0 0;font-size:13.5px;color:#55555c}.fc .lic{font-size:12px}
table:not(.ov){width:100%;border-collapse:collapse}
table:not(.ov) th{text-align:left;font:500 11px/1.2 'IBM Plex Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:#55555c;padding:0 14px 10px;border-bottom:1px solid #d6d6d2}
table:not(.ov) td{padding:16px 14px;border-bottom:1px solid #e3e3df;vertical-align:middle}
.role{width:190px;font-size:14px;font-weight:500}.fn{width:200px;font-size:13.5px;color:#3a3a3f}.spec{width:260px;font:500 12px/1.4 'IBM Plex Mono',monospace;color:#55555c}
.smp{color:#141416}
.mock{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mc{border:1px solid #e3e3df;border-radius:14px;padding:32px;background:#fff;display:flex;flex-direction:column;gap:12px;min-height:300px}
.mc .ml{font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#55555c}
.mc h3{margin:0;font-size:33px;font-weight:500;line-height:1.12;letter-spacing:-.022em}
.mc p{margin:0;font-size:14px;line-height:1.5;color:#55555c;max-width:46ch}
.mc ul{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
.mc li{font-size:11.5px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;border:1px solid rgba(20,20,22,.08);border-radius:10px;padding:10px 12px;background:#fafaf8;width:max-content}
.mc .mb{margin-top:auto;align-self:flex-start;background:#141416;color:#fff;border-radius:8px;padding:14px 22px;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
.mc.dark{background:#17181c;border-color:#17181c}.mc.dark h3{color:#ececf1}.mc.dark p{color:#c9c9d2}.mc.dark .ml{color:#F47546}
.fp{margin:0 0 14px;font-size:13.5px;color:#55555c}.fp a{font-family:'IBM Plex Mono',monospace}
.cn{padding:64px 80px 96px;background:#fff}.cn p{max-width:900px;color:#3a3a3f}
"""
ov = ''.join('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>' % (o['n'], o['name'], o['tone'], o['fam'], o['fit']) for o in OPTS)
cover = ('<section class="cover"><span class="lb">Vocci · Brand type options · 2026-10</span><h1>品牌字体方案 · 六选一</h1>'
 '<p>六组候选全部为 SIL Open Font License 1.1 开源字体：可免费用于网页、印刷、App、视频、广告等商业用途，可嵌入软件与文件，唯一限制是不能单独售卖字体文件本身。</p>'
 '<p>每个方案下方是它在当前官网中的具体用法（桌面 1440 的真实字号），可直接作为字体规范的起点。</p>'
 '<div class="rules"><div><b>贯穿所有物料</b><p>选定后，网页、印刷、App、视频统一使用同一套字体与层级。</p></div>'
 '<div><b>品牌字体 ≤ 2–3 种</b><p>主字体覆盖绝大多数文字；Mono 只做系统信息；衬线（方案 04 / 06）只用于大标题。</p></div>'
 '<div><b>特殊字体小范围使用</b><p>Mono 用于标签、编号、参数、模型 / 系统类物料，不用于正文与长段落。</p></div></div>'
 '<table class="ov"><thead><tr><th>#</th><th>组合</th><th>调性</th><th>字体数量</th><th>适合</th></tr></thead><tbody>%s</tbody></table></section>') % ov
cn = ('<section class="cn"><h4 style="border:0;margin-top:0;padding-top:0">中文配套 Chinese</h4><p>六个方案都建议搭配 <b>思源黑体 / Noto Sans SC</b>（SIL OFL 1.1，可商用）作为中文字体；方案 04 / 06 的中文大标题可搭配 <b>思源宋体 / Noto Serif SC</b>（同为 OFL）。中文字体在本页未做展示。</p></section>')
import re
def scope(css):  # prefix every selector of the doc stylesheet with .fs so it cannot touch the stacked site pages
    out = []
    for rule in css.split('}'):
        if '{' not in rule: continue
        sel, body = rule.split('{', 1)
        sels = [x.strip() for x in sel.split(',') if x.strip()]
        if sels and sels[0] in ('*', 'html', 'body'):
            out.append('.fs,.fs *{box-sizing:border-box}' if sels[0] == '*' else ''); continue
        out.append(','.join('.fs ' + x for x in sels) + '{' + body + '}')
    return ''.join(out)
LINKED = (R / 'figma' / '_desktop-1440.linked.html').read_text()
head = re.search(r'<head>(.*?)</head>', LINKED, re.S).group(1)
head = re.sub(r'<title>.*?</title>', '<title>Vocci Font Options</title>', head, flags=re.S)
body = re.search(r'<body[^>]*>(.*)</body>', LINKED, re.S).group(1)
optcss = ''
for o in OPTS:
    k = '.fo-' + o['n']
    optcss += "%s,%s *{--font-body:%s!important;--font-word:%s!important;--font-display:%s!important;--font-mono:%s!important}" % (k, k, ff(o['sans'], 'sans'), ff(o['sans'], 'sans'), ff(o['sans'], 'sans'), ff(o['mono'], 'mono'))
    if o['disp']: optcss += "%s .pn h1,%s .pn h2{font-family:%s!important;font-weight:500!important;letter-spacing:-.015em!important}" % (k, k, ff(o['disp'], 'serif'))
optcss += (".fo{position:relative;width:1440px;overflow:hidden;background:#fff}"
           ".fo-bar{display:flex;align-items:baseline;gap:20px;padding:40px 80px 32px;background:#141416;color:#fff;font:500 15px/1.4 'IBM Plex Sans',sans-serif}"
           ".fo-bar span{font:500 12px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;color:#F47546}.fo-bar b{font-size:28px;font-weight:500;letter-spacing:-.02em}.fo-bar i{font-style:normal;color:#a9a9b2;margin-left:auto}")
stack = ''.join('<div class="fo-bar" id="fo-%s"><span>方案 %s · 整页</span><b>%s</b><i>桌面 1440 · %s</i></div><div class="fo fo-%s">%s</div>'
                % (o['n'], o['n'], html.escape(o['name']), o['tone'], o['n'], body) for o in OPTS)
page = ('<!doctype html><html lang="zh-CN"><head>%s<link rel="stylesheet" href="https://fonts.googleapis.com/css2?%s"><style id="font-system">%s%s</style></head>'
        '<body><div class="fs">%s%s%s</div>%s</body></html>') % (head, fam, scope(CSS), optcss, cover, ''.join(board(o) for o in OPTS), cn, stack)
page = re.sub(r'<title>.*?</title>', '', page, flags=re.S).replace('<head>', '<head><title>Vocci Font Options</title>', 1)
(R / 'figma' / 'font-system.html').write_text(page); print('font-system', len(page))
