# 1011 round · run from patch.py (shares `s`, `re`, `R`) before the 3.0 reorder.
# Checklist 1–7 (fonts, grid, labels, caps, icons, nav dropdown, footer) + the 3.0 framework blocks.

def _sec(sid):
    m = re.search(r'<section id="%s"[^>]*>.*?</section>' % re.escape(sid), s, re.S); assert m, sid
    return m
def _put(sid, new):
    global s
    m = _sec(sid); s = s[:m.start()] + new + s[m.end():]
def _lines(t, drop=()):
    """the grid lines (vl / hl / sqr) of a section, minus the vertical lines at the given lefts"""
    out = re.findall(r'<i class="(?:vl|hl|sqr)[^"]*" style="[^"]*"></i>', t)
    return ''.join(x for x in out if not any(('left:%s"' % d) in x or ('left:%s;' % d) in x for d in drop))
def _sub(old, new, count=1):
    global s
    assert old in s, old[:80]; s = s.replace(old, new, count)

# ---------- 1 · two fonts: Manrope + IBM Plex Mono ----------
_sub('family=IBM+Plex+Sans:wght@300..700&family=IBM+Plex+Mono:wght@400;500;600', 'family=Manrope:wght@300..800&family=IBM+Plex+Mono:wght@400;500;600')
s = s.replace("'IBM Plex Sans',Helvetica,Arial,sans-serif", "'Manrope',Helvetica,Arial,sans-serif").replace("--font-word:'IBM Plex Sans',sans-serif", "--font-word:'Manrope',sans-serif")
assert 'IBM Plex Sans' not in s

# ---------- 3 · no small labels above the big titles ----------
for _a in ['<span class="label">Recording</span>', '<span class="label">Voice to AI</span>', '<span class="label"><span data-label>Team meetings</span></span>']:
    _sub(_a, '')

# ---------- 6 · nav: four dropdowns (links from vocci.ai) ----------
_CH = '<svg class="nd-c" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>'
NAV = [
    ('Shop', [('Vocci Ring', 'Four finishes in titanium', '#colors'), ('Sizing kit', 'Find your fit before you buy', 'https://vocci.ai/products/vocci-ring'),
              ('Membership', 'Vocci AI Pro', 'https://vocci.ai/pages/membership')]),
    ('Product', [('How it works', 'Record, ask, connect', '#how'), ('Vocci AI', 'Agents on your fingertip', '#scenes'),
                 ('Tech', 'What’s inside the ring', 'https://vocci.ai/pages/tech'), ('Trust Center', 'Privacy and security', 'https://trust.vocci.ai/')]),
    ('Connect your AI', [('Connect your AI', 'Claude, ChatGPT, Gemini and more', 'https://vocci.ai/pages/connect-your-ai'),
                         ('Dev Community', 'Build on Vocci with MCP', 'https://vocci.ai/pages/developer'), ('Webinar', 'Live walkthroughs with the team', '#why-b')]),
    ('Company', [('About us', 'The team behind Vocci', 'https://vocci.ai/pages/about-us'), ('Blog', 'News and stories', 'https://vocci.ai/blogs/news'),
                 ('Support Center', 'Guides and answers', 'https://support.vocci.ai/'), ('Contact us', 'Talk to the team', 'https://support.vocci.ai/hc/en-us/requests/new')]),
]
_nav = ''.join('<div class="nd"><button class="nd-t" type="button" aria-expanded="false"><span>%s</span>%s</button><div class="nd-m"><div class="nd-in">%s</div></div></div>'
               % (g, _CH, ''.join('<a href="%s"><span>%s</span><small>%s</small></a>' % (h, a, b) for a, b, h in items)) for g, items in NAV)
_n = re.search(r'<span class="nav-sp"></span>.*?(?=<a class="cart")', s, re.S); assert _n
s = s[:_n.start()] + '<span class="nav-sp"></span>' + _nav + s[_n.end():]
s = s.replace('href="#finishes"', 'href="#colors"')

# ---------- 7 · footer: same content as vocci.ai ----------
_SOC = [('Facebook', 'https://www.facebook.com/profile.php?id=61583450473364'), ('Instagram', 'https://www.instagram.com/vocci.ai/'), ('YouTube', 'https://www.youtube.com/@vocci-ai'),
        ('X', 'https://x.com/vocci_ai'), ('LinkedIn', 'https://www.linkedin.com/company/gygeslabs/'), ('Discord', 'https://discord.gg/2KZKzdpvN3')]
def _grp(h, links):
    return '<div class="fg"><h5>%s</h5><ul class="fl">%s</ul></div>' % (h, ''.join('<li><a href="%s">%s</a></li>' % (u, a) for a, u in links))
_m = re.search(r'<footer id="footer".*?</footer>', s, re.S); _t = _m.group()
_k = _t.index('<p class="end" style="color:var(--ink)">Real life, carried forward.</p></div>')
_head = _t[:_k]
_t = (_head + '<form class="end f-sub" onsubmit="return false"><label for="f-mail">Subscribe to our emails</label><span class="f-in"><input id="f-mail" type="email" placeholder="Enter your email" autocomplete="email"><button type="submit" aria-label="Subscribe">→</button></span>'
      '<small>By signing up, I agree with the data protection policy of Vocci.</small></form>'
      '<ul class="f-soc">' + ''.join('<li><a href="%s">%s</a></li>' % (u, a) for a, u in _SOC) + '</ul></div>'
      '<div class="pn f-col" style="--gc:3/span 1;--gr:1/span 1;--tc:1/span 1;--tr:2/span 1">'
      + _grp('Store', [('Shop', 'https://vocci.ai/products/vocci-ring'), ('Membership', 'https://vocci.ai/pages/membership')])
      + _grp('For developers', [('Connect your AI', 'https://vocci.ai/pages/connect-your-ai'), ('Dev Community', 'https://vocci.ai/pages/developer')])
      + _grp('Company', [('About us', 'https://vocci.ai/pages/about-us'), ('Contact us', 'https://support.vocci.ai/hc/en-us/requests/new'), ('Tech', 'https://vocci.ai/pages/tech'),
                         ('Trust Center', 'https://trust.vocci.ai/'), ('Blog', 'https://vocci.ai/blogs/news')]) + '</div>'
      '<div class="pn f-col" style="--gc:4/span 1;--gr:1/span 1;--tc:2/span 1;--tr:2/span 1">'
      + _grp('Support', [('Support Center', 'https://support.vocci.ai/'), ('Shipping and return', 'https://vocci.ai/policies/shipping-policy'), ('Refund policy', 'https://vocci.ai/policies/refund-policy'),
                         ('Privacy policy', 'https://vocci.ai/policies/privacy-policy'), ('Terms of service', 'https://vocci.ai/policies/terms-of-service'),
                         ('Product warranty', 'https://vocci.ai/pages/product-warranty'), ('Cookie policy', 'https://vocci.ai/pages/cookie-policy')])
      + '<p class="end f-copy">© 2026, Vocci</p></div></div></footer>')
s = s[:_m.start()] + _t + s[_m.end():]

# ================= 3.0 framework =================
# #2 · full workflow: record → it's ready for AI → press and hold to ask → connected apps
for _a, _b in [('<h3>Transcribed automatically</h3><p class="end">Speaker labels, a summary and the moments you marked, minutes later.</p>',
                '<h3>Ready for AI</h3><p class="end">A transcript and summary, with the moments you marked along the way.</p>'),
               ('<h3>Press and hold to send</h3><p class="end">Hold the button and say what you need. Your request travels with the context.</p>',
                '<h3>Press and hold to ask</h3><p class="end">Tell Vocci AI what you need. Your request carries the conversation’s context.</p>'),
               ('<h3>AI agent takes over</h3><p class="end">Your AI drafts the follow-up inside the tools you already use.</p>',
                '<h3>Your AI apps take it from there</h3><p class="end">Claude, ChatGPT, Slack and more turn it into clear next steps.</p>'),
               ('02 · Transcribed automatically', '02 · Ready for AI'), ('03 · Press and hold to send', '03 · Press and hold to ask'), ('04 · AI agent takes over', '04 · Your AI apps')]:
    _sub(_a, _b)

# #3 · AI note-taking: the four numbers (battery, pickup, noise, languages)
_m = _sec('why'); _t = _m.group()
_t = re.sub(r'<ul class="feats">.*?</ul>', '<dl class="params end"><div><dt>8 h</dt><dd>Continuous recording</dd></div><div><dt>5 m</dt><dd>Voice pickup range</dd></div>'
            '<div><dt>AI</dt><dd>Noise reduction in busy rooms</dd></div><div><dt>100+</dt><dd>Languages transcribed</dd></div></dl>', _t, count=1, flags=re.S)
_t = _t.replace('<h3>The most elegant way to record.</h3><p>Double-click to record. Click once during recording to highlight a moment. No phone on the table, no app to open.</p>',
                '<h3>The most elegant way to record.</h3><p>Double-click to record, click once to highlight. No phone on the table, no app to open.</p>')
_put('why', _t)

# #4 · Vocci AI: agents on your fingertip (the old "three moments" grid)
_m = _sec('scenes'); _t = _m.group()
_new = [('Press and hold', 'A task on your mind? Just ask Vocci AI.', 'Press and hold the ring and say what you need.', 'img3/step-hand-ring.jpg', '50% 50%'),
        ('Works with your apps', 'Keep the work moving.', 'Vocci AI carries out tasks in your connected apps—like sending a follow-up in Slack.', 'img3/ai-work.jpg', '50% 50%'),
        ('You stay in control', 'Review, then confirm.', 'Check what Vocci AI prepared in the app before anything goes out.', 'img3/ai-review.jpg', '50% 50%')]
_t = _t.replace('<h2>Three moments people worry about.</h2>', '<h2>Agents on your fingertip.</h2><p class="end">Vocci AI turns what you say into work that gets done.</p>')
_pics = re.findall(r'<div class="pn pic"[^>]*><img[^>]*></div>', _t)
for _p, (_l, _h, _c, _src, _pos) in zip(_pics, _new):
    _t = _t.replace(_p, re.sub(r'src="[^"]+" alt="" style="object-position:[^"]+"', 'src="%s" alt="" style="object-position:%s"' % (_src, _pos), _p), 1)
_txt = re.findall(r'<div class="pn lazy "[^>]*>.*?</p></div>', _t, re.S); assert len(_txt) == 3
for _x, (_l, _h, _c, _src, _pos) in zip(_txt, _new):
    _n = re.search(r'<b>(\d+)</b>', _x).group(1)
    _t = _t.replace(_x, re.sub(r'(<div class="pn lazy "[^>]*>).*', r'\1', _x, flags=re.S) + '<span class="label"><b>%s</b> · %s</span><h3>%s</h3><p class="scn-sub">%s</p></div>' % (_n, _l, _h, _c), 1)
_put('scenes', _t)

# #5 · AI workflow: real-world context in the AI tools you use + webinar
_m = _sec('why-b'); _t = _m.group()
_t = _t.replace('<h3>Real-world context for your AI.</h3><p>Press and hold the ring, say what you need, and it goes straight to the AI you already use.</p>',
                '<h3>Integrate real-world context into your AI workflow.</h3><p>Connect Vocci once with MCP. Your conversations become context in the AI tools you already use.</p>')
_t = re.sub(r'<li><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.2"/><circle cx="10" cy="10" r="7.2"/></svg><span>Press and hold to send</span></li>', '', _t, count=1)
_t = _t.replace('<span>Your request carries the conversation’s context</span>', '<span>No copying and pasting</span>')
_t = re.sub(r'(<ul class="feats">.*?</ul>)', r'\1<div class="end btns"><a class="btn" href="https://vocci.ai/pages/connect-your-ai">Connect your AI</a><a class="tlink" href="#">Join a webinar</a></div>', _t, count=1, flags=re.S)
_put('why-b', _t)

# #7 · colours: one full-screen image, finish tabs + view switch (on hand / ring / charging case)
_FIN = [('lumen', 'Lumen', 'Mirror silver', '#e9e8e4'), ('midnight', 'Midnight', 'Matte black', '#1c1c1f'), ('dawn', 'Dawn', 'Mirror gold', '#c9a063'),
        ('lux', 'Lux', 'Black & silver', 'linear-gradient(135deg,#1c1c1f 55%,#cfcfd2 55%)')]
_VIEWS = [('wear', 'On hand', 'img3/wear-%s.jpg'), ('ring', 'Ring', 'img3/finish-%s.png'), ('case', 'Charging case', 'img3/box-%s.png')]
_t = _sec('finishes').group()
_imgs = ''.join('<img class="fnx-img fnx-%s%s" data-f="%s" data-v="%s" loading="lazy" decoding="async" src="%s" alt="Vocci ring in %s, %s">'
                % (v, ' on' if (f == 'lumen' and v == 'wear') else '', f, v, src % f, name, lab.lower()) for f, name, sub, sw in _FIN for v, lab, src in _VIEWS)
_imgs = ''.join('<img class="fnx-img fnx-wearbg%s" data-f="%s" data-v="wear" loading="lazy" decoding="async" src="img3/wear-%s.jpg" alt="" aria-hidden="true">' % (' on' if f == 'lumen' else '', f, f) for f, name, sub, sw in _FIN) + _imgs
_tabs = ''.join('<button class="fnx-f%s" type="button" role="tab" aria-selected="%s" data-f="%s"><i class="fn-sw" style="background:%s"></i><span><b>%s</b>%s</span></button>'
                % (' on' if f == 'lumen' else '', 'true' if f == 'lumen' else 'false', f, sw, name, sub.replace('&', '&amp;')) for f, name, sub, sw in _FIN)
_views = ''.join('<button class="fnx-v%s" type="button" aria-pressed="%s" data-v="%s">%s</button>' % (' on' if v == 'wear' else '', 'true' if v == 'wear' else 'false', v, lab) for v, lab, src in _VIEWS)
_put('finishes', '<section id="colors" data-bgop="0"><div class="stage fnx" data-view="wear">' + _lines(_t) + '<i class="vl" style="left:50%"></i><i class="sqr" style="left:50%;top:0"></i><i class="sqr" style="left:50%;top:calc(100% - 1px)"></i>' +
     '<div class="pn pic fnx-stage" style="--gc:1/span 4;--gr:1/span 2;--tc:1/span 2;--tr:1/span 1">' + _imgs + '</div>'
     '<div class="pn fnx-copy" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:3/span 1"><h2>Looks like you.<br>Works with your AI.</h2>'
     '<p>Choose a finish that feels like your style, with the same AI connection in every ring.</p>'
     '</div>'
     '<div class="pn fnx-ctl" style="--gc:4/span 1;--gr:2/span 1;--tc:1/span 2;--tr:2/span 1"><span class="label">Finish</span><div class="fnx-tabs" role="tablist" aria-label="Finish">' + _tabs + '</div>'
     '<span class="label">View</span><div class="fnx-views">' + _views + '</div>'
     '<div class="end btns fnx-buy"><a class="btn" href="https://vocci.ai/products/vocci-ring">Buy now</a><a class="tlink" href="https://vocci.ai/products/vocci-ring">Get a sizing kit</a></div></div>'
     '<div class="rowline" style="grid-row:2"><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div>'
     '</div></section>')

# #8 · reliability: water, skin, weight
_m = _sec('breather'); _t = _m.group()
_t = _t.replace('<h2>Small enough to forget.<br>Present when it matters.</h2><p class="end">Titanium, 3–5 grams. Worn all day; recording only when you ask.</p>',
                '<h2>Wear it for the moments you don’t plan.</h2><p>Made to stay on through the day—hand-washing, rain and all.</p>'
                '<ul class="feats end"><li>' + '</li><li>'.join('<svg viewBox="0 0 20 20" aria-hidden="true"><path d="%s"/></svg><span>%s</span>' % (d, x) for d, x in [
                    ('M10 2.5c3 3.6 4.8 6.4 4.8 8.7a4.8 4.8 0 01-9.6 0c0-2.3 1.8-5.1 4.8-8.7z', 'IP67 water resistant'),
                    ('M10 2.5l6 2.4v4.6c0 3.8-2.6 6.5-6 8-3.4-1.5-6-4.2-6-8V4.9z M7.2 10l2 2 3.8-4', 'Hypoallergenic titanium, inside and out'),
                    ('M4 13.5h12 M6 13.5l1.5-6h5l1.5 6 M10 7.5V4.5', 'Just 3–5 grams')]) + '</li></ul>')
_put('breather', _t)

# #9 · privacy: certificates sit with the promise, Trust Center
_m = _sec('privacy'); _t = _m.group()
_CERT = [('img3/gdpr-local.svg', 'GDPR', 'Verified by GDPR Local · ID PB7U836')]   # vocci.ai: GDPR is the only certification so far
_t = _t.replace('<div class="end"><a class="btn" href="#">Trust Center</a></div>',
                '<ul class="pv-certs end">' + ''.join('<li><img loading="lazy" decoding="async" src="%s" alt=""><span><b>%s</b>%s</span></li>' % c for c in _CERT) + '</ul>'
                '<div><a class="btn" href="https://trust.vocci.ai/">Trust Center</a></div>')
_put('privacy', _t)

# #10 · KOL: creators in horizontal cards (replaces the old press grid)
_t = _sec('press').group()
_KOL = [('YouTube · Product manager', 'img2/creator-01.jpg', '50% 45%', 'Vocci Ring: This Tiny AI Assistant Changed My Workflow'),
        ('YouTube · Creator', 'img2/v09.jpg', '50% 40%', 'Vocci Ring Review: real-world context for your AI tools'),
        ('YouTube · Designer', 'img2/v16.jpg', '50% 55%', 'A week wearing the Vocci Ring'),
        ('YouTube · Founder', 'img2/v18.jpg', '50% 40%', 'Vocci + Claude: my meeting workflow')]
_cards = ''.join('<a class="kol-card" href="#"><span class="kol-th"><img loading="lazy" decoding="async" src="%s" alt="" style="object-position:%s"><i class="vc-play" aria-hidden="true"></i></span>'
                 '<span class="label"><b>%02d</b> %s</span><h3>%s</h3><span class="kol-go">Watch review <b>→</b></span></a>' % (img, pos, i + 1, who, title) for i, (who, img, pos, title) in enumerate(_KOL))
_cards += ('<a class="kol-card kol-invite" href="#"><span class="kol-th"><img loading="lazy" decoding="async" src="img2/n451.jpg" alt="" style="object-position:50% 45%"></span>'
           '<span class="label">Creators program</span><h3>Made something with Vocci?</h3><span class="kol-go">Become a creator <b>→</b></span></a>')
_arr = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>'
_put('press', '<section id="kol" data-bgop=".4"><div class="stage flat">' + re.sub(r'<i class="sqr[^"]*" style="left:[^;]+;top:(?:30|65)%"></i>', '', _lines(_t, drop=('50%', '75%'))) +
     '<div class="pn kol-intro" style="--gc:1/span 1;--gr:1/span 2;--tc:1/span 2;--tr:1/span 1"><h2>In their words.</h2>'
     '<p>Creators wore the ring for weeks and filmed it on their own channels—no script, no edit from us.</p>'
     '<div class="end kol-ctl"><button class="kol-b prev" type="button" aria-label="Previous">' + _arr + '</button><button class="kol-b next" type="button" aria-label="Next">' + _arr + '</button>'
     '<a class="btn ghost" href="https://www.youtube.com/@vocci-ai">Watch all on YouTube</a></div></div>'
     '<div class="pn kol-track" style="--gc:2/span 3;--gr:1/span 2;--tc:1/span 2;--tr:2/span 1"><div class="kol-row">' + _cards + '</div></div>'
     '</div></section>')

# #11 · PR: awards + press quote only (certificates moved to privacy); the quote links to the article
_m = _sec('awards'); _t = _m.group()
_t = re.sub(r'<div class="pn mid glassy cert".*?(?=<div class="rowline"|</div></section>)', '', _t, flags=re.S)
_t = re.sub(r'<div class="rowline"[^>]*>(?:<i[^>]*></i>)*</div>(?=</div></section>)', '', _t)
assert 'cert' not in _t
_t = _t.replace('<span class="pill">As featured in</span>', '<a class="tlink pq-src" href="#">Read the article</a><span class="pill">As featured in</span>')
_put('awards', _t)

# #12 · hardware: the 3.0 copy on each card, Tech page CTA
for _a, _b in [('<h2>Every detail, considered.</h2>', '<h2>Maximize capability density.</h2>'),
               ('<p class="end">Titanium inside and out. <b><span class="cu" data-to="3">3</span>–<span class="cu" data-to="5">5</span> g</b>, <span class="cu" data-to="6.8" data-dec="1">6.8</span> mm wide, <span class="cu" data-to="2.85" data-dec="2">2.85</span> mm thin.</p></div>',
                '<p>Explore the engineering that brings recording, storage and connectivity into a ring.</p><div class="end"><a class="btn" href="https://vocci.ai/pages/tech">Learn more</a></div></div>'),
               ('<span class="label">The button</span><h3>Double-press to record.</h3><p>Two vibrations let you know it’s begun. Click once to highlight.</p>',
                '<span class="label">Haptics</span><h3>Feel it start. Stay in the moment.</h3><p>Double-press to start recording. Two vibrations let you know it’s begun.</p>'),
               ('<span class="label">True to size</span><h3><span class="cu" data-to="6.8" data-dec="1">6.8</span> mm wide. <span class="cu" data-to="2.85" data-dec="2">2.85</span> mm thin.</h3><p>Use the sizing kit to find your fit.</p>',
                '<span class="label">3–5 g</span><h3>Light on your hand.</h3><p>Titanium inside and out. <span class="cu" data-to="6.8" data-dec="1">6.8</span> mm wide, <span class="cu" data-to="2.85" data-dec="2">2.85</span> mm thin.</p>'),
               ('<img loading="lazy" decoding="async" class="half" src="img3/detail-ip67.jpg" alt="" style="object-position:50% 50%">', '<img loading="lazy" decoding="async" class="half" src="img3/case-dome.webp" alt="Vocci ring resting on its charging case" style="object-position:45% 52%">'),
               ('<p>Up to <span class="cu" data-to="8">8</span> h of recording; <span class="cu" data-to="30">30</span> min to <span class="cu" data-to="80">80</span>%.</p>',
                '<p><span class="cu" data-to="30">30</span> min to <span class="cu" data-to="80">80</span>%. The case holds <span class="cu" data-to="3">3</span> full charges, over USB-C.</p>'),
               ('<span class="label">IP67</span><h3>Water resistant, ready as your day unfolds.</h3>', '<span class="label">Charging</span><h3>A quick recharge. Back to your day.</h3>')]:
    _sub(_a, _b)

# #13 · FAQ: one accordion list, link to the full list
_t = _sec('faq').group()
_qs = re.findall(r'<h3>(.*?)</h3><p class="end">(.*?)</p>', _t)
_acc = ''.join('<div class="fq%s"><button class="fq-q" type="button" aria-expanded="%s"><span class="label"><b>%02d</b></span><span class="fq-t">%s</span><i class="fq-i" aria-hidden="true"></i></button>'
               '<div class="fq-a"><div><p>%s</p></div></div></div>' % (' open' if i == 0 else '', 'true' if i == 0 else 'false', i + 1, q, a) for i, (q, a) in enumerate(_qs))
_put('faq', '<section id="faq" data-bgop=".4"><div class="stage flat">' + _lines(_t, drop=('50%', '75%')) +
     '<div class="pn faq-head" style="--gc:1/span 1;--gr:1/span 2;--tc:1/span 2;--tr:1/span 1"><h2>FAQ</h2><p>The questions we hear most.</p><a class="tlink end" href="https://support.vocci.ai/">All questions</a></div>'
     '<div class="pn faq-acc" style="--gc:2/span 3;--gr:1/span 2;--tc:1/span 2;--tr:2/span 1">' + _acc + '</div></div></section>')

# ---------- 1011-b · screen 3: hand + ring on a grey ground, sound rings, how-to-record card ----------
_t = _sec('why').group()
_rl = re.search(r'<div class="rowline".*?</div>', _t).group()
_PILL2 = '<svg class="pill2" viewBox="0 0 24 12" aria-hidden="true"><rect x=".75" y=".75" width="22.5" height="10.5" rx="5.25"/><circle class="d1" cx="8.6" cy="6" r="2.4"/><circle class="d2" cx="15.4" cy="6" r="2.4"/></svg>'
_PILL1 = '<svg class="pill1" viewBox="0 0 24 12" aria-hidden="true"><rect x=".75" y=".75" width="22.5" height="10.5" rx="5.25"/><rect class="d1" x="6" y="3.6" width="12" height="4.8" rx="2.4"/></svg>'
_BAND = ('<svg class="rec-band" viewBox="0 0 220 66" aria-hidden="true"><g class="led"><path d="M110 4v7M100 7l3 5M120 7l-3 5"/></g>'
         '<rect class="bd" x="6" y="16" width="208" height="30" rx="9"/><path class="hi" d="M14 31h192"/><rect class="bt" x="98" y="21" width="24" height="20" rx="6"/>'
         '<g class="fg"><path d="M100 66V47a10 10 0 0120 0v19"/><path class="nl" d="M104.5 49a5.5 5.5 0 0111 0v4h-11z"/></g></svg>')
_rows = [('s0', _PILL2, 'Double-click to record.'), ('s1', _PILL1, 'Click once during recording to highlight a moment.'), ('s2', _PILL2, 'Double-click to stop recording.')]
_put('why', '<section id="why" data-bgop="0"><div class="stage rec3" data-s="0">' + _lines(_t) +
     '<div class="pn pic rec-stage" style="--gc:1/span 4;--gr:1/span 2;--tc:1/span 2;--tr:1/span 1"><div class="rec-fig">'
     '<img src="img3/rec-hand.png" alt="A hand wearing the Vocci ring, thumb on the button" decoding="async">'
     '<span class="rec-waves" aria-hidden="true"><canvas></canvas></span></div></div>'
     '<div class="pn rec-pn" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:2/span 1"><div class="rec-card">' + _BAND +
     '<h3><i class="rec-dot" aria-hidden="true"></i>Recording with elegance</h3><ul class="rec-steps">' +
     ''.join('<li class="%s">%s<span>%s</span></li>' % (k, ic, tx) for k, ic, tx in _rows) + '</ul></div>'
     '<dl class="params end"><div><dt>8 h</dt><dd>Continuous recording</dd></div><div><dt>5 m</dt><dd>Voice pickup</dd></div>'
     '<div><dt>AI</dt><dd>Noise reduction</dd></div><div><dt>100+</dt><dd>Languages</dd></div></dl></div>' + _rl + '</div></section>')

# ---------- 1011-d · screens 3–5 become one pinned chapter: Record → Ask → Connect ----------
_t = _sec('why').group()
_ICO = {
 'hold': '<svg class="pill1 hold" viewBox="0 0 24 12" aria-hidden="true"><rect x=".75" y=".75" width="22.5" height="10.5" rx="5.25"/><rect class="d1" x="4" y="3.6" width="16" height="4.8" rx="2.4"/></svg>',
 'voice': '<svg class="ico" viewBox="0 0 24 12" aria-hidden="true"><path d="M3 6h1M7 3.5v5M11 1.5v9M15 3v6M19 4.5v3M22 6h0"/></svg>',
 'done': '<svg class="ico" viewBox="0 0 24 12" aria-hidden="true"><rect x=".75" y=".75" width="22.5" height="10.5" rx="5.25"/><path d="M8 6.2l2.6 2.4L16 3.6"/></svg>',
 'mcp': '<svg class="ico" viewBox="0 0 24 12" aria-hidden="true"><circle cx="5" cy="6" r="3.2"/><circle cx="19" cy="6" r="3.2"/><path d="M8.2 6h7.6"/></svg>',
 'apps': '<svg class="ico" viewBox="0 0 24 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" rx="2"/><rect x="14" y="2" width="8" height="8" rx="4"/></svg>',
 'ctx': '<svg class="ico" viewBox="0 0 24 12" aria-hidden="true"><path d="M3 3h12M3 6h18M3 9h9"/></svg>'}
def _card(k, inner, title, rows, extra=''):
    return ('<div class="rec-card" data-ch="%d">%s<h3><i class="rec-dot" aria-hidden="true"></i>%s</h3><ul class="rec-steps">%s</ul>%s</div>'
            % (k, inner, title, ''.join('<li>%s<span>%s</span></li>' % (ic, tx) for ic, tx in rows), extra))
_c0 = re.search(r'<div class="rec-card">(.*?)<h3>', _t, re.S).group(1)   # the band diagram
_rows0 = re.findall(r'<li class="s\d">(<svg.*?</svg>)<span>(.*?)</span></li>', _t)
_params = re.search(r'<dl class="params end">.*?</dl>', _t, re.S).group().replace('params end', 'params')
_cards = (_card(0, _c0, 'The most elegant way to capture conversations and ideas.', _rows0, _params)
          + _card(1, _c0.replace('class="rec-band"', 'class="rec-band hold"'), 'Agents on your fingertip.',
                  [(_ICO['hold'], 'Press and hold the button.'), (_ICO['voice'], 'Say what you need—a follow-up, a summary, a task.'), (_ICO['done'], 'Vocci AI gets it done. Review it in the app when needed.')])
          + _card(2, '', 'Integrate real-world context into your AI workflow.',
                  [(_ICO['mcp'], 'Connect once with MCP.'), (_ICO['apps'], 'Works with Claude, ChatGPT, Gemini and more.'), (_ICO['ctx'], 'Your conversations become context—no copying and pasting.')],
                  '<div class="btns"><a class="btn" href="https://vocci.ai/pages/connect-your-ai">Connect your AI</a><a class="tlink" href="#">Join a webinar</a></div>'))
_rail = ('<div class="ch-rail" role="tablist">' + ''.join('<button type="button" data-k="%d"%s><b>0%d</b>%s</button>' % (i, ' class="on"' if i == 0 else '', i + 1, n) for i, n in enumerate(['Record', 'Ask', 'Connect']))
         + '<i class="ch-bar" aria-hidden="true"><i></i></i></div>')
_params = re.search(r'<dl class="params end">.*?</dl>', _t, re.S).group().replace('params end', 'params')
_pn = re.search(r'<div class="pn rec-pn".*?</dl></div>', _t, re.S).group()
_t = _t.replace(_pn, '<div class="pn rec-pn" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:2/span 1">' + _rail + '<div class="rec-cards">' + _cards + '</div></div>')
# overlays for Ask (voice → agent) and Connect (AI apps around the ring)
_AIS = [('claude', 'Claude'), ('gemini', 'Gemini'), ('sparkle', 'AI app'), ('compass', 'Perplexity'), ('copilot', 'Copilot'), ('cube', 'Cursor'), ('chatgpt', 'ChatGPT')]
_ov = ('<div class="ov-ask" aria-hidden="true"><div class="ask-q"><span class="ask-mic"><i></i><i></i><i></i><i></i></span><span class="ask-tx"></span></div>'
       '<div class="ask-a"><b>Vocci AI</b><span class="ask-st">Drafting a follow-up in Slack…</span><span class="ask-ok">Sent to #launch · Review in app</span></div></div>'
       '<div class="ov-orb" aria-hidden="true"><i class="gd gd1"></i><i class="gd gd2"></i><i class="gd gd3"></i><div class="orb-spin">'
       + ''.join('<span class="oa" style="--a:%ddeg"><span class="oa-in"><img src="img3/ai-%s.png" alt="%s" decoding="async"></span></span>' % (i * 360 // len(_AIS), a, n) for i, (a, n) in enumerate(_AIS)) + '</div></div>')
_t = _t.replace('<span class="rec-waves"', _ov + '<span class="rec-waves"', 1)
_t = _t.replace('<section id="why" data-bgop="0">', '<section id="why" class="chapter" data-bgop="0"><span id="scenes" class="ch-anchor" style="top:40%"></span><span id="why-b" class="ch-anchor" style="top:73%"></span>', 1)
_t = _t.replace('<div class="stage rec3" data-s="0">', '<div class="stage rec3" data-s="0" data-ch="0" data-v="0">', 1)
_put('why', _t)
for _x in ('scenes', 'why-b'):
    _m = re.search(r'<section id="%s"[^>]*>.*?</section>' % _x, s, re.S); s = s[:_m.start()] + s[_m.end():]

# ---------- 1011-i · screen 2: four steps → the 3.0 three (record+transcribe spans two columns; 3D walk unchanged) ----------
_t = _sec('how').group()
_tx = re.findall(r'<div class="pn lazy "[^>]*>.*?</p></div>', _t, re.S); assert len(_tx) == 4, len(_tx)
_new = ['<div class="pn lazy how-s1 hs1" style="--gc:1/span 2;--gr:2/span 1;--tc:1/span 2;--tr:2/span 1"><span class="label"><b>01</b></span><h3>Double-click to record</h3>'
        '<p class="end">Double-click to start or stop. It uploads in the background and comes back as a transcript and summary.</p></div>',
        '<div class="pn lazy how-cont h-skip" aria-hidden="true" style="--gc:2/span 1;--gr:2/span 1"></div>',
        '<div class="pn lazy hs2" style="--gc:3/span 1;--gr:2/span 1;--tc:1/span 1;--tr:4/span 1"><span class="label"><b>02</b></span><h3>Press and hold to ask</h3>'
        '<p class="end">Say what you need. Vocci AI takes on the task with your conversation as context.</p></div>',
        '<div class="pn lazy hs3" style="--gc:4/span 1;--gr:2/span 1;--tc:2/span 1;--tr:4/span 1"><span class="label"><b>03</b></span><h3>Connect your AI apps</h3>'
        '<p class="end">Claude, ChatGPT, Slack and more—Vocci fits into the workflow you already have.</p></div>']
for _a, _b in zip(_tx, _new): _t = _t.replace(_a, _b, 1)
_pics = re.findall(r'<div class="pn pic[^"]*"', _t); assert len(_pics) == 4
for _a, _c in zip(_pics, ['h-skip', 'hs1', 'hs2', 'hs3']): _t = _t.replace(_a, _a[:-1] + ' ' + _c + '"', 1)
for _a, _b in [('01 · Double-click to record', '01 · Double-click to record'), ('02 · Ready for AI', '01 · Transcribed in the background'),
               ('03 · Press and hold to ask', '02 · Press and hold to ask'), ('04 · Your AI apps', '03 · Your AI apps')]:
    _t = _t.replace(_a, _b, 1)
_put('how', _t)

# ---------- 1011-k · screen 6 = old 6 + 7: who it's for (3.0 order) + their scene + their words, one screen ----------
_t = _sec('needs').group()
_P = [('Founders &amp; CXOs', 'Trade shows', 'Trade-show plans, supplier quotes, client briefs—I need those passing thoughts to become tasks I’ll actually follow up on.', 'Founder · Reddit', 'Read on Reddit'),
      ('Sales &amp; BD', 'Client meetings', 'I can look my client in the eye instead of typing. The follow-up email is drafted before I reach the car.', 'Account executive · Discord', 'Read on Discord'),
      ('Engineers', 'AI workflow', 'Our stand-ups go straight into Claude. I ask what we decided instead of digging through notes.', 'Engineer · Reddit', 'Read on Reddit'),
      ('Researchers', 'Idea capture', 'Interviews, reading notes, hallway questions—everything lands in one place my AI can actually search.', 'Researcher · Discord', 'Read on Discord'),
      ('Content creators', 'YouTube reviews', 'This tiny AI assistant changed my workflow.', 'Product manager · YouTube', 'Watch the review')]
_acc = ''.join('<li class="pz-i%s"><button class="pz-h" type="button" aria-expanded="%s"><b>%02d</b><span>%s</span><em>· %s</em></button>'
               '<div class="pz-b"><div><q>%s</q><span class="pz-src">%s</span><a class="tlink" href="#">%s</a></div></div></li>'
               % (' on' if i == 0 else '', 'true' if i == 0 else 'false', i + 1, who, sc, q, src, cta) for i, (who, sc, q, src, cta) in enumerate(_P))
_put('needs', '<section id="needs" data-bgop="0"><div class="stage pz">' + _lines(_t) +
     '<div class="pn pic pz-pic" style="--gc:2/span 3;--gr:1/span 2;--tc:1/span 2;--tr:2/span 1"><img src="img3/team-top.webp" alt="A team meeting around a table, seen from above" decoding="async">'
     + ''.join('<figure class="pz-qb" style="left:%s;top:%s;--d:%s"><i>%s</i><figcaption><q>%s</q><span><b>%s</b> %s</span></figcaption></figure>' % b for b in [
        ('30%', '6%', '.2s', 'D', 'I am always wearing it which makes it super easy to click &amp; record.', 'Discord', 'davad0716'),
        ('60%', '1%', '.8s', 'K', 'Styling gets comments from many in my office. They say it looks very cool!', 'Reddit', 'u/kuped'),
        ('62%', '74%', '1.4s', 'Z', 'I’m extremely impressed by the battery life.', 'Reddit', 'zeroskills21')]) + '</div>'
     '<div class="pn pz-title" style="--gc:1/span 1;--gr:1/span 1;--tc:1/span 2;--tr:1/span 1"><h2>Make room for the work that matters.</h2>'
     '<div class="end pz-join"><p>Real words from owners. Join them—talk face-to-face with the founding team, and receive a special gift.</p>'
     '<div class="btns"><a class="btn" href="https://discord.gg/2KZKzdpvN3">Discord</a><a class="btn ghost" href="#">Reddit</a></div></div></div>'
     '<div class="pn pz-list" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:3/span 1"><ol class="pz-acc">' + _acc + '</ol></div>'
     '<div class="rowline" style="grid-row:2"><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div></div></section>')
for _x in ('scenes2', 'community'):
    _m = re.search(r'<section id="%s"[^>]*>.*?</section>' % _x, s, re.S); s = s[:_m.start()] + s[_m.end():]

# ---------- 1011-p · privacy: copy follows vocci.ai (one certification: GDPR, verified) ----------
_t = _sec('privacy').group()
for _a, _b in [('<h2>Your data is yours.<br>We protect it that way.</h2>', '<h2>Your data is fully yours.</h2><p>End-to-end encrypted. GDPR compliant. Always under your control.</p>'),
               ('<h3>Encrypted on the device</h3><p class="end">Recordings are encrypted on the ring, with permission-based access.</p>', '<h3>End-to-end encrypted</h3><p class="end">Your recordings are encrypted from the ring to the app.</p>'),
               ('<h3>Never used to train AI</h3><p class="end">Your conversations are not used to train AI models.</p>', '<h3>GDPR compliant</h3><p class="end">Verified by GDPR Local.</p>'),
               ('<h3>Local storage option</h3><p class="end">You control sync, and choose which context is shared.</p>', '<h3>Always under your control</h3><p class="end">You choose what syncs and which context is shared.</p>')]:
    assert _a in _t, _a[:40]; _t = _t.replace(_a, _b, 1)
_put('privacy', _t)
_sub('Recordings are encrypted on the ring with permission-based access, never used to train AI models, and you choose what syncs and which context is shared.',
     'Recordings are end-to-end encrypted, Vocci is GDPR compliant (verified by GDPR Local), and you choose what syncs and which context is shared.')

# ---------- 1011-s · In their words: 1007 screen-4 layout (pictures on top, their cards below, title bottom-left) ----------
_V = [('YouTube · Product manager', 'img2/creator-01.jpg', '50% 45%', 'Vocci Ring: This Tiny AI Assistant Changed My Workflow', 'A week of meetings, captured without opening a laptop.'),
      ('YouTube · Creator', 'img2/v09.jpg', '50% 40%', 'Vocci Ring Review: real-world context for your AI tools', 'How the ring feeds conversations into Claude and ChatGPT.'),
      ('YouTube · Founder', 'img2/v18.jpg', '50% 40%', 'Vocci + Claude: my meeting workflow', 'From a client call to a follow-up, start to finish.')]
_cells = ''
for i, (who, img, pos, title, sub) in enumerate(_V):
    c = i + 2
    _cells += ('<a class="pn pic kv-pic" href="#" style="--gc:%d/span 1;--gr:1/span 1;--tc:%d/span 1;--tr:%d/span 1"><img loading="lazy" decoding="async" src="%s" alt="" style="object-position:%s"><i class="vc-play" aria-hidden="true"></i></a>'
               '<div class="pn kv-txt" style="--gc:%d/span 1;--gr:2/span 1;--tc:%d/span 1;--tr:%d/span 1"><span class="label"><b>%02d</b> · %s</span><h3>%s</h3><p>%s</p><a class="tlink end" href="#">Watch review</a></div>'
               % (c, 1 + i % 2, 2 + 2 * (i // 2), img, pos, c, 1 + i % 2, 3 + 2 * (i // 2), i + 1, who, title, sub))
_put('kol', '<section id="kol" data-bgop=".4"><div class="stage flat kv">' + _lines(_sec('hardware').group()) +
     '<div class="pn kv-title" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:1/span 1"><h2>In their words.</h2>'
     '<p>Creators wore the ring for weeks and filmed it on their own channels—no script, no edit from us.</p>'
     '<div class="end btns"><a class="btn" href="https://www.youtube.com/@vocci-ai">Watch all on YouTube</a><a class="tlink" href="#">Become a creator</a></div></div>'
     + _cells +
     '<div class="rowline" style="grid-row:2"><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div></div></section>')

# ---------- 1011-u · nav: compact centred bar (menu · wordmark · shop), one panel drops from it (after db-longbow) ----------
_n = re.search(r'<nav class="nav">.*?</nav>', s, re.S); assert _n
_wm = re.search(r'<a class="wordmark".*?</a>', _n.group(), re.S).group()
_cart = re.search(r'<a class="cart".*?</a>', _n.group(), re.S).group().replace('href="#colors"', 'href="https://vocci.ai/cart"').replace('aria-label="Store"', 'aria-label="Cart"')
_LINKS = [('How it works', '#how'), ('Vocci AI', '#scenes'), ('Connect your AI', 'https://vocci.ai/pages/connect-your-ai'), ('Tech', 'https://vocci.ai/pages/tech'),
          ('Trust Center', 'https://trust.vocci.ai/'), ('About us', 'https://vocci.ai/pages/about-us')]
_nav = ('<nav class="nav nav2"><div class="navbar nb2">'
        '<button class="nb-menu" type="button" aria-expanded="false" aria-controls="nb-panel" aria-label="Menu"><i></i><i></i></button>'
        + _wm +
        '<div class="nb-r"><a class="nb-shop" href="https://vocci.ai/products/vocci-ring">Shop <b>+</b></a>' + _cart + '</div></div>'
        '<div class="nb-panel" id="nb-panel"><div class="nb-in">'
        '<div class="nb-cards"><a class="nb-card" href="#colors"><span class="nb-img"><img src="img3/finish-lumen.png" alt="" loading="lazy" decoding="async"></span><b>Vocci Ring</b><em>Four finishes</em></a>'
        '<i class="nb-vl" aria-hidden="true"></i>'
        '<a class="nb-card" href="https://vocci.ai/pages/membership"><span class="nb-img dark"><img src="img3/ai-review.jpg" alt="" loading="lazy" decoding="async"></span><b>Vocci AI Pro</b><em>Membership</em></a></div>'
        '<div class="nb-links">' + ''.join('<a href="%s"><span>%s</span><span>%s</span></a>' % (u, a, a) for a, u in _LINKS) + '</div>'
        '<div class="nb-foot"><a href="mailto:support@vocci.ai">support@vocci.ai</a><span><a href="https://discord.gg/2KZKzdpvN3">Discord</a><a href="#">Reddit</a></span></div>'
        '</div></div></nav>')
s = s[:_n.start()] + _nav + s[_n.end():]

# ---------- 1011-v · nav rethought: top-level tabs stay on the bar; only tabs with sub-pages open a panel (Longbow-style drop from the bar) ----------
_n = re.search(r'<nav class="nav nav2">.*?</div></div></nav>', s, re.S); assert _n
_wm = re.search(r'<a class="wordmark".*?</a>', _n.group(), re.S).group()
_cart = re.search(r'<a class="cart".*?</a>', _n.group(), re.S).group()
_CHEV = '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>'
_TABS = [('Shop', 'https://vocci.ai/products/vocci-ring', [('Vocci Ring', '', 'https://vocci.ai/products/vocci-ring'), ('Membership', '', 'https://vocci.ai/pages/membership')]),
         ('Tech', 'https://vocci.ai/pages/tech', [('Inside the ring', '', '#hardware'), ('Specs', '', 'https://vocci.ai/pages/tech'), ('Charging', '', '#hardware'), ('Privacy', '', '#privacy')]),
         ('About Us', 'https://vocci.ai/pages/about-us', [('Our story', '', 'https://vocci.ai/pages/about-us'), ('Blog', '', 'https://vocci.ai/blogs/news'),
                                                         ('Trust Center', '', 'https://trust.vocci.ai/'), ('Contact Us', '', 'https://support.vocci.ai/hc/en-us/requests/new')]),
         ('Dev Community', 'https://vocci.ai/pages/developer', [('MCP docs', '', 'https://vocci.ai/pages/developer'), ('API reference', '', 'https://vocci.ai/pages/developer'), ('Examples', '', 'https://vocci.ai/pages/developer'), ('Discord', '', 'https://discord.gg/2KZKzdpvN3')]),
         ('Connect Your AI', 'https://vocci.ai/pages/connect-your-ai', [('How it works', '', '#how'), ('Setup guide', '', 'https://vocci.ai/pages/connect-your-ai'), ('Webinar', '', '#why-b')])]
_tabs = ''
_groups = ''
for i, (name, href, kids) in enumerate(_TABS):
    if kids:
        _tabs += '<a class="n3-t" href="%s" data-g="%d" aria-haspopup="true" aria-expanded="false"><span>%s</span></a>' % (href, i, name)
        _groups += '<div class="n3-g" data-g="%d">%s</div>' % (i, ''.join('<a href="%s"><b>%s</b></a>' % (u, a) for a, d, u in kids))
    else:
        _tabs += '<a class="n3-t" href="%s"><span>%s</span></a>' % (href, name)
_mob = ''.join(('<a class="n3-m1" href="%s">%s</a>' % (h, n)) if not k else ('<div class="n3-mg"><span class="n3-mh">%s</span>%s</div>' % (n, ''.join('<a href="%s">%s</a>' % (u, a) for a, d, u in k))) for n, h, k in _TABS)
_nav = ('<nav class="nav nav3"><div class="navbar n3-bar">' + _wm + '<div class="n3-tabs">' + _tabs + '</div>'
        '<div class="n3-r"><a class="n3-buy" href="https://vocci.ai/products/vocci-ring">Buy now</a>' + _cart +
        '<a class="n3-acct" href="https://my.vocci.ai/sign-in" aria-label="Log in"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="7" r="3.2"/><path d="M3.8 17c.9-3.2 3.3-4.8 6.2-4.8s5.3 1.6 6.2 4.8"/></svg></a>' +
        '<button class="n3-burger" type="button" aria-expanded="false" aria-label="Menu"><i></i><i></i></button></div></div>'
        '<div class="n3-drop"><div class="n3-in">' + _groups + '<div class="n3-mob">' + _mob + '</div></div></div></nav>')
s = s[:_n.start()] + _nav + s[_n.end():]

# ---------- 1011-zb · FAQ back to the six-cell grid: answer under the question, big toggle, the open card turns dark ----------
_t = _sec('faq').group()
_qs = re.findall(r'<span class="fq-t">(.*?)</span>.*?<p>(.*?)</p>', _t, re.S); assert len(_qs) == 6, len(_qs)
_cells = ''
for i, (q, a) in enumerate(_qs):
    col, row = 2 + i // 2, 1 + i % 2
    _cells += ('<div class="pn fq2%s" style="--gc:%d/span 1;--gr:%d/span 1;--tc:%d/span 1;--tr:%d/span 1">'
               '<button class="fq2-h" type="button" aria-expanded="%s"><span class="label"><b>%02d</b></span><h3>%s</h3><i class="fq2-b" aria-hidden="true"></i></button>'
               '<div class="fq2-a"><div><p>%s</p></div></div><span class="fq2-n" aria-hidden="true">%02d</span></div>'
               % (' open' if i == 0 else '', col, row, 1 + i % 2, 2 + i, 'true' if i == 0 else 'false', i + 1, q, a, i + 1))
_put('faq', '<section id="faq" data-bgop=".4"><div class="stage flat fq2s">' + _lines(_sec('hardware').group()) +
     '<div class="pn fq2-head" style="--gc:1/span 1;--gr:1/span 1;--tc:1/span 2;--tr:1/span 1"><h2>FAQ</h2><p>Six questions we hear most.</p></div>'
     '<div class="pn fq2-help" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:8/span 1"><h3>Still have questions?</h3><p>Guides, shipping, returns and a team that answers.</p>'
     '<div class="end btns"><a class="btn" href="https://support.vocci.ai/">Support Center</a><a class="tlink" href="https://support.vocci.ai/">All questions</a></div></div>'
     + _cells +
     '<div class="rowline" style="grid-row:2"><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div></div></section>')

# ---------- 1011-zc · FAQ: every vocci.ai question on the page — categories on the left, that category's accordion on the right ----------
exec((R/'src/faq_vocci.py').read_text())
_cats = ''.join('<button class="fq3-c%s" type="button" data-c="%d" aria-pressed="%s"><b>%02d</b><span>%s</span><em>%d</em></button>' % (' on' if i == 0 else '', i, 'true' if i == 0 else 'false', i + 1, c, len(qs)) for i, (c, qs) in enumerate(FAQ))
_lists = ''.join('<div class="fq3-list%s" data-c="%d"><span class="label fq3-cap">%s</span><ol>%s</ol></div>' % (' on' if i == 0 else '', i, c,
                 ''.join('<li class="fq3-i%s"><button class="fq3-h" type="button" aria-expanded="%s"><b>%02d</b><span>%s</span><i aria-hidden="true"></i></button><div class="fq3-a"><div><p>%s</p></div></div></li>'
                         % (' open' if (i == 0 and j == 0) else '', 'true' if (i == 0 and j == 0) else 'false', j + 1, q, a) for j, (q, a) in enumerate(qs)))
                 for i, (c, qs) in enumerate(FAQ))
_put('faq', '<section id="faq" data-bgop=".4"><div class="stage flat fq3s">' + _lines(_sec('hardware').group(), drop=('50%', '75%')) +
     '<div class="pn fq3-head" style="--gc:1/span 1;--gr:1/span 2;--tc:1/span 2;--tr:1/span 1"><h2>FAQ</h2><div class="fq3-cats" role="tablist">' + _cats + '</div>'
     '<div class="end fq3-help"><p>Still have questions?</p><a class="tlink" href="https://support.vocci.ai/">Support Center</a></div></div>'
     '<div class="pn fq3-body" style="--gc:2/span 3;--gr:1/span 2;--tc:1/span 2;--tr:2/span 1">' + _lists + '</div></div></section>')

# ---------- 1011-zd · FAQ after doconomy.com partners: big-type question rows (right), the chosen answer (left), all inside the 4×2 grid ----------
_rows = ''
_k = 0
for ci, (cat, qs) in enumerate(FAQ):
    for q, a in qs:
        _rows += ('<li class="fq4-r%s" tabindex="0" role="button" aria-pressed="%s" data-q="%s" data-a="%s"><b>%02d</b><span class="fq4-q">%s</span><em>%s</em>'
                  '<p class="fq4-ma">%s</p></li>') % (' on' if _k == 0 else '', 'true' if _k == 0 else 'false', q.replace('"', '&quot;'), a.replace('"', '&quot;'), _k + 1, q, cat, a)
        _k += 1
_q0, _a0 = FAQ[0][1][0]
_put('faq', '<section id="faq" data-bgop=".4"><div class="stage flat fq4s">' + _lines(_sec('hardware').group(), drop=('50%', '75%')) +
     '<div class="pn fq4-intro" style="--gc:1/span 1;--gr:1/span 1;--tc:1/span 2;--tr:1/span 1"><span class="fq4-pill">FAQ</span>'
     '<p>Everything people ask before and after they put Vocci on—recording, hardware care, privacy. Pick a question to read the answer.</p>'
     '<a class="tlink end" href="https://support.vocci.ai/">Support Center</a></div>'
     '<div class="pn fq4-ans" style="--gc:1/span 1;--gr:2/span 1" aria-live="polite"><p><b>' + _q0 + '</b> ' + _a0 + '</p></div>'
     '<div class="pn fq4-list" style="--gc:2/span 3;--gr:1/span 2;--tc:1/span 2;--tr:2/span 1"><ol>' + _rows + '</ol></div></div></section>')

# ---------- 1011-ze · FAQ after sangar.framer.website: headline + categories (left column), frosted question bars over the grid (right half) ----------
_items = ''
for ci, (cat, qs) in enumerate(FAQ):
    for q, a in qs:
        _items += ('<li class="fq5-i" data-c="%d"%s><button class="fq5-h" type="button" aria-expanded="false"><span class="fq5-q">%s</span><i class="fq5-b" aria-hidden="true"></i></button>'
                   '<div class="fq5-a"><div><p>%s</p></div></div></li>') % (ci, '' if ci == 0 else ' hidden', q, a)
_fcats = ''.join('<button class="fq5-c%s" type="button" data-c="%d" aria-pressed="%s"><span>%s</span><em>%d</em></button>' % (' on' if i == 0 else '', i, 'true' if i == 0 else 'false', c, len(qs)) for i, (c, qs) in enumerate(FAQ))
_put('faq', '<section id="faq" data-bgop=".4"><div class="stage flat fq5s">' + _lines(_sec('hardware').group()) +
     '<div class="pn fq5-head" style="--gc:1/span 1;--gr:1/span 1;--tc:1/span 2;--tr:1/span 1">'
     '<h2>Questions before you put it on?</h2><p>A few things people ask about recording, care and privacy.</p>'
     '<div class="end fq5-help"><p>Still curious?</p><a class="tlink" href="https://support.vocci.ai/">Support Center</a></div></div>'
     '<div class="pn pic fq5-pic" style="--gc:2/span 3;--gr:1/span 1;--tc:1/span 2;--tr:2/span 1"><img loading="lazy" decoding="async" src="img3/ring-ridged.jpg" alt="Vocci ring resting on ridged metal" style="object-position:50% 54%"></div>'
     '<div class="pn fq5-cats" style="--gc:1/span 1;--gr:2/span 1;--tc:1/span 2;--tr:2/span 1" role="tablist" aria-label="FAQ categories">' + _fcats + '</div>'
     '<div class="pn fq5-list" style="--gc:2/span 3;--gr:2/span 1;--tc:1/span 2;--tr:3/span 1"><ol>' + _items + '</ol></div>'
     '<div class="rowline" style="grid-row:2"><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div></div></section>')
