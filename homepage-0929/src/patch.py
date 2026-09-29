"""0928 refinement of the V13 Big Grid artifact.
Source of truth: the published artifact (baseline.html). This script only
(1) swaps imagery/markup to the client-approved 0928 Figma, (2) converts inline grid
positions to custom properties so tablet can re-flow, (3) appends one override
stylesheet + one motion script. Run: python3 src/patch.py
"""
import re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
s = (R/'src/baseline.html').read_text()

# ---------- helpers ----------
def section(sid):
    m = re.search(r'<section id="%s">.*?</section>' % re.escape(sid), s, re.S)
    assert m, sid
    return m
def edit(sid, fn):
    global s
    m = section(sid); s = s[:m.start()] + fn(m.group()) + s[m.end():]
def swap_bg(t, src, pos):
    return re.sub(r'<img class="bgimg" src="[^"]+" alt="" style="object-position:[^;]+;', '<img class="bgimg" src="%s" alt="" style="object-position:%s;' % (src, pos), t, count=1)

# ---------- 1 hero ----------
def hero(t):
    t = swap_bg(t, 'img3/hero-flatlay.jpg', '50% 50%')
    t = t.replace('<a class="ulink">Watch the film</a>', '')
    t = t.replace('<a class="btn">Buy Now</a>', '<a class="btn" href="#finishes">Buy now</a>')
    t = t.replace('<a>About</a><a>How it works</a><a>Stories</a><a>FAQ</a><a>Store</a>',
                  '<a href="#why"><span>About</span><span>About</span></a><a href="#how"><span>How it works</span><span>How it works</span></a><a href="#testimonials"><span>Stories</span><span>Stories</span></a><a href="#faq"><span>FAQ</span><span>FAQ</span></a><a href="#finishes"><span>Store</span><span>Store</span></a>')
    t = t.replace('<a class="wordmark">VOCCI</a>', '<a class="wordmark" href="#hero">VOCCI</a>')
    t = t.replace('<a class="cart">', '<a class="cart" href="#finishes" aria-label="Store">')
    return t
edit('hero', hero)

# ---------- 1b · plain labels: no "A / 02" tokens anywhere ----------
s = s.replace('<span class="label"><b>A</b> / 02 · Recording</span>', '<span class="label">Recording</span>')
s = s.replace('<span class="label"><b>B</b> / 02 · AI context layer · MCP</span>', '<span class="label">AI context layer · MCP</span>')
s = re.sub(r'<span class="label"><b>(0\d)</b> / 04</span>', r'<span class="label"><b>\1</b></span>', s)

# ---------- 2 recording ----------
def why(t):
    t = swap_bg(t, 'img3/recording-presenter.jpg', '58% 40%').replace('<img class="bgimg" src="img3/recording-presenter.jpg"', '<img class="bgimg blur" src="img3/recording-presenter-blur.jpg"', 1)
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Two things,', '<div class="pn pic sharp" style="grid-column:2/span 3;grid-row:1/span 2"><img src="img3/recording-presenter.jpg" alt="Presenter wearing the Vocci ring" style="object-position:58% 40%"></div><div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Two things,')
    return t
def why_proto(t):
    a=t.index('<div class="st-ui">'); f=t.index('<div class="ui-foot">'); b=t.index('</div>', t.index('</div>', f)+6)+6
    proto=('<div class="proto app" data-proto="rec"><div class="ap-bar"><span class="ap-title">Client discussions</span><span class="ap-time">10:42</span></div>'
           '<div class="ap-timer"><b>00:00</b><span class="ap-wave">'+''.join('<i style="--d:%.2fs;--h:%d%%"></i>'%((k*0.37)%1.1,30+((k*47)%60)) for k in range(22))+'</span></div>'
           '<ul class="ap-lines"><li><span class="ap-who">Maya</span><span>Let’s move the launch to the 14th.</span></li><li class="ap-mark"><span class="ap-who">Daniel</span><span>Samples ship Friday, I’ll confirm the quote.</span><em>Highlight</em></li><li><span class="ap-who">Maya</span><span>Send the wording to the team.</span></li></ul>'
           '<div class="ap-summary"><b>Summary</b><span>Launch moved to the 14th · Daniel confirms the quote by Thursday.</span></div>'
           '<div class="ap-ctrl"><span class="ap-rec"><i></i></span><span class="ap-cap">Double-click the ring to start</span></div></div>')
    return t[:a]+proto+t[b:]
edit('why', lambda t: why_proto(why(t)))

# ---------- 3 MCP ----------
def mcp(t):
    t = swap_bg(t, 'img3/mcp-hands.jpg', '50% 45%').replace('<img class="bgimg" src="img3/mcp-hands.jpg"', '<img class="bgimg blur" src="img3/mcp-hands-blur.jpg"', 1)
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:2/span 1"><span class="label">AI context layer · MCP</span>', '<div class="pn pic sharp" style="grid-column:1/span 4;grid-row:1/span 2"><img src="img3/mcp-hands.jpg" alt="Hands wearing the Vocci ring" style="object-position:50% 45%"></div><div class="orbit" aria-hidden="true"><svg class="orb-lines"></svg><span class="pulse"><i></i><i></i><i></i></span><span class="ai" data-a="-118" data-r="1"><img src="img3/ai-claude.png" alt="Claude"></span><span class="ai" data-a="-62" data-r="1"><img src="img3/ai-gemini.png" alt="Gemini"></span><span class="ai" data-a="-172" data-r="2"><img src="img3/ai-chatgpt.png" alt="ChatGPT"></span><span class="ai" data-a="-20" data-r="2"><img src="img3/ai-sparkle.png" alt="AI app"></span><span class="ai" data-a="150" data-r="1"><img src="img3/ai-cube.png" alt="Cursor"></span><span class="ai" data-a="38" data-r="2"><img src="img3/ai-copilot.png" alt="Copilot"></span><span class="ai" data-a="98" data-r="1"><img src="img3/ai-compass.png" alt="Perplexity"></span></div><div class="pn " style="grid-column:1/span 1;grid-row:2/span 1"><span class="label">AI context layer · MCP</span>')
    t = t.replace('<ol class="pl end"><li class="on"><span>01</span>Connect once with MCP</li><li><span>02</span>Works inside the AI tools you already use</li><li><span>03</span>Ask about any conversation</li></ol>',
      '<ol class="pl end" data-swap><li class="on" data-title="Real-world context for your AI." data-copy="Connect Vocci to your AI once with MCP. Turn important conversations into clear next steps—without copying and pasting."><span>01</span>Connect once with MCP</li>'
      '<li data-title="Works where you already work." data-copy="Claude, ChatGPT, Gemini, Cursor and more read your Vocci context directly. Nothing to export, nothing to paste."><span>02</span>Works inside the AI tools you already use</li>'
      '<li data-title="Ask about any conversation." data-copy="“What did the supplier promise on Tuesday?” Your AI answers from the transcript, with the moments you marked."><span>03</span>Ask about any conversation</li></ol>')
    a=t.index('<ol class="pl end" data-swap>'); b=t.index('</ol>',a)+5
    proto=('<div class="proto app chat end" data-proto="mcp"><div class="ap-bar"><span class="ap-title">Claude</span><span class="ap-time">Vocci · connected</span></div>'
           '<div class="ch-user"><span class="ch-q"><span class="pr-type"></span><span class="pr-caret"></span></span><span class="ch-file"><i></i><b>Client discussions</b><small>Vocci · 42:17</small></span></div>'
           '<div class="ch-ai"><span class="ch-dots"><i></i><i></i><i></i></span><p class="ch-a1">Delivery moves to the <b>14th</b>, samples Friday.</p><p class="ch-a2">Daniel confirms the quote by Thursday.</p></div>'
           '<div class="ch-input"><span>Reply…</span><i></i></div></div>')
    t=t[:a]+proto+t[b:]
    return t
edit('why-b', mcp)

# ---------- 4 three moments ----------
def moments(t):
    t = t.replace('src="img2/meeting-0922.jpg" alt="" style="object-position:50% 40%"', 'src="img3/pain-noisy.jpg" alt="" style="object-position:50% 50%"')
    t = t.replace('src="img2/v18.jpg" alt="" style="object-position:50% 35%"', 'src="img3/pain-workflow.jpg" alt="" style="object-position:50% 40%"')
    t = t.replace('src="img2/n451.jpg" alt="" style="object-position:60% 45%"', 'src="img3/pain-ideas.jpg" alt="" style="object-position:50% 50%"')
    return t
edit('scenes', moments)

# ---------- 5 who it's for ----------
QUOTES = [
 ("Trade-show plans, supplier quotes, client briefs—I need those passing thoughts to become tasks I’ll actually follow up on.", "Founder · Verified owner"),
 ("Our stand-ups used to evaporate. Now the decisions and owners are written down before anyone leaves the room.", "Team lead · Verified owner"),
 ("I can look my client in the eye instead of typing. The follow-up email is drafted before I reach the car.", "Consultant · Verified owner"),
 ("Interviews, reading notes, hallway questions—everything lands in one place my AI can actually search.", "Researcher · Verified owner"),
 ("I think out loud on walks. The ring keeps the good parts; the app turns them into something I can build on.", "Everyday thinker · Verified owner"),
 ("Working memory is my weak spot. Double-click, say it, done. I stopped losing the thread mid-conversation.", "Verified owner"),
 ("Office hours, lab feedback, lecture ideas on the bus—captured without breaking eye contact with students.", "Educator · Verified owner"),
]
def needs(t):
    t = swap_bg(t, 'img3/people-suits.jpg', '50% 42%').replace('<img class="bgimg" src="img3/people-suits.jpg"', '<img class="bgimg blur" src="img3/people-suits-blur.jpg"', 1)
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:1/span 2"><h2>Make room', '<div class="pn pic sharp" style="grid-column:1/span 4;grid-row:1/span 2"><img src="img3/people-suits.jpg" alt="Two founders talking" style="object-position:50% 42%"></div><div class="pn compact" style="grid-column:1/span 1;grid-row:1/span 1"><h2>Make room')
    i = [0]
    def li(m):
        k = i[0]; i[0] += 1
        q, src = QUOTES[k]
        return '<li class="%s" data-quote="%s" data-src="%s"><img class="th" src="img3/avatar-%02d.png" alt=""><span>%02d</span>' % ('on' if k == 0 else '', q, src, k+1, k+1)
    t = re.sub(r'<li class="(?:on)?"><img class="th" src="[^"]+" alt=""><span>\d\d</span>', li, t)
    t = t.replace('<ol class="pl end">', '<ol class="pl end" data-swap>')
    t = t.replace('grid-column:4/span 1;grid-row:2/span 1"><q>', 'grid-column:4/span 1;grid-row:2/span 1"><q data-quote>')
    t = t.replace('<span class="label end">Founder · Verified owner</span>', '<span class="label end" data-src>Founder · Verified owner</span>')
    return t
edit('needs', needs)

# ---------- 6 use cases ----------
def scenes2(t):
    t = swap_bg(t, 'img3/scene-materials.jpg', '50% 50%')
    t = t.replace('<span class="label"><b>01 / 04</b> · Team meetings</span><h3>Good discussions deserve clear next steps.</h3><p>',
                  '<span class="label"><span data-label>Team meetings</span></span><h3 data-title>Good discussions deserve clear next steps.</h3><p data-copy>')
    t = t.replace('<ol class="pl end"><li class="on"><span>01</span>Team meetings</li><li class=""><span>02</span>Client conversations</li><li class=""><span>03</span>Networking</li><li class=""><span>04</span>Ideas on the go</li></ol>',
      '<ol class="pl end" data-swap>'
      '<li class="on" data-n="01" data-label="Team meetings" data-title="Good discussions deserve clear next steps." data-copy="Turn team conversations into decisions and action items you can come back to."><span>01</span>Team meetings</li>'
      '<li data-n="02" data-label="Client conversations" data-title="Stay present. Keep every promise." data-copy="Record with permission, then let your AI draft the recap and the follow-up while the details are still fresh."><span>02</span>Client conversations</li>'
      '<li data-n="03" data-label="Networking" data-title="Names, context, next steps—kept." data-copy="Mark the introductions that matter. Later, ask your AI who you met and what you agreed to do."><span>03</span>Networking</li>'
      '<li data-n="04" data-label="Ideas on the go" data-title="A thought now. A plan later." data-copy="Say it while it’s clear. The transcript lands in the tools you already use, ready to build on."><span>04</span>Ideas on the go</li></ol>')
    return t
edit('scenes2', scenes2)

# ---------- 7 how it works ----------
def how(t):
    t = t.replace('<div class="pn pic" style="grid-column:1/span 1;grid-row:1/span 1"><img src="img2/step-01.jpg" alt="" style="object-position:55% 45%">', '<div class="pn pic contain" style="grid-column:1/span 1;grid-row:1/span 1"><img src="img3/step-1-ring.png" alt="Vocci ring" style="object-position:50% 50%">')
    t = t.replace('<div class="pn pic" style="grid-column:2/span 1;grid-row:1/span 1"><img src="img2/step-02.jpg" alt="" style="object-position:50% 50%">', '<div class="pn pic contain" style="grid-column:2/span 1;grid-row:1/span 1"><img src="img3/step-2-phone.png" alt="Transcript on the phone" style="object-position:50% 50%">')
    t = t.replace('<img src="img2/step-03.jpg" alt="" style="object-position:60% 40%">', '<img src="img3/step-hand-ring.jpg" alt="Press and hold" style="object-position:50% 50%">')
    t = t.replace('<div class="pn pic" style="grid-column:4/span 1;grid-row:1/span 1"><img src="img2/step-04.jpg" alt="" style="object-position:50% 50%">', '<div class="pn pic contain phone" style="grid-column:4/span 1;grid-row:1/span 1"><img src="img3/step-chat.png" alt="Vocci AI agent reply" style="object-position:50% 50%">')
    return t
edit('how', how)

# ---------- 8 breather ----------
edit('breather', lambda t: swap_bg(t, 'img3/ring-ridged.jpg', '50% 52%'))

# ---------- 9 privacy (positions follow the 0928 comp: 01 col1·r2, 02 col3·r2, 03 col4·r1) ----------
def privacy(t):
    t = swap_bg(t, 'img3/ring-macro.jpg', '50% 50%').replace('<img class="bgimg" src="img3/ring-macro.jpg"', '<img class="bgimg blur" src="img3/ring-macro-blur.jpg"', 1)
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Your data', '<div class="pn pic sharp" style="grid-column:2/span 2;grid-row:1/span 2"><img src="img3/ring-macro.jpg" alt="Macro of the Vocci ring" style="object-position:50% 50%"></div><div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Your data')
    t = t.replace('<div class="pn " style="grid-column:4/span 1;grid-row:1/span 1"><span class="label"><b>02</b></span>', '<div class="pn " style="grid-column:3/span 1;grid-row:2/span 1"><span class="label"><b>02</b></span>')
    t = t.replace('</div></div></section>', '</div><div class="pn white-empty t-hide" style="grid-column:4/span 1;grid-row:2/span 1"></div></div></section>')
    t = t.replace('<div class="pn " style="grid-column:3/span 1;grid-row:2/span 1"><span class="label"><b>03</b></span>', '<div class="pn " style="grid-column:4/span 1;grid-row:1/span 1"><span class="label"><b>03</b></span>')
    return t
edit('privacy', privacy)

# ---------- 10 testimonials ----------
def testimonials(t):
    t = swap_bg(t, 'img3/review-hand-face.jpg', '50% 32%').replace('<img class="bgimg" src="img3/review-hand-face.jpg"', '<img class="bgimg blur" src="img3/review-hand-face-blur.jpg"', 1)
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Seen through', '<div class="pn pic sharp rv-stage" style="grid-column:2/span 2;grid-row:1/span 2"><img class="rv-img on" src="img3/review-hand-face.jpg" alt="Owner wearing the Vocci ring" style="object-position:50% 32%"><img class="rv-img" src="img2/v08.jpg" alt="" style="object-position:50% 50%"><img class="rv-img" src="img2/v07.jpg" alt="" style="object-position:50% 50%"><img class="rv-img" src="img2/v16.jpg" alt="" style="object-position:50% 40%"><img class="rv-img" src="img2/creator-01.jpg" alt="" style="object-position:50% 50%"><img class="rv-img" src="img2/n448.jpg" alt="" style="object-position:50% 50%"></div><div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Seen through')
    t = t.replace('everyday experience.</h2></div>', 'everyday experience.</h2><p class="end"><span class="rv-count">01–03 / 06</span> <a class="tlink rv-more" href="#">More stories</a></p></div>')
    t = re.sub(r'<div class="pn " (style="grid-column:(?:1|4)/span 1;grid-row:\d/span 1")><q>', r'<div class="pn rv" \1><q>', t)
    return t
edit('testimonials', testimonials)

# ---------- 11 community ----------
def community(t):
    t = swap_bg(t, 'img3/community.jpg', '50% 30%')
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Join our community.</h2>', '<div class="pn " style="grid-column:4/span 1;grid-row:2/span 1"><h2>Join our community.</h2>')
    t = re.sub(r'<div class="pn mid" style="grid-column:4/span 1;grid-row:2/span 1"><i class="play"></i>.*?</div>', '', t, flags=re.S)
    t = t.replace('<a class="btn">Discord</a><a class="btn ghost">Reddit</a>', '<a class="btn" href="#">Discord</a><a class="btn ghost" href="#">Reddit</a>')
    return t
edit('community', community)

# ---------- 12 creators: placeholder card is hidden below desktop ----------
def creators(t):
    t = t.replace('<div class="pn pic" style="grid-column:4/span 1;grid-row:1/span 1"><img src="img2/v10.jpg"', '<div class="pn pic t-hide" style="grid-column:4/span 1;grid-row:1/span 1"><img src="img2/v10.jpg"')
    t = t.replace('<div class="pn " style="grid-column:4/span 1;grid-row:2/span 1"><q class="slot">', '<div class="pn t-hide" style="grid-column:4/span 1;grid-row:2/span 1"><q class="slot">')
    return t
edit('press', creators)

# ---------- 13 hardware: exploded render on white, per the 0928 comp ----------
def hardware(t):
    t = t.replace('<div class="stage dk"><img class="bgimg" src="img2/p-6_1.jpg" alt="" style="object-position:50% 45%;opacity:1">', '<div class="stage flat">')
    t = t.replace('<div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Every detail, considered.</h2>',
                  '<div class="pn pic contain exploded a-photo" style="grid-column:2/span 2;grid-row:1/span 2"><img src="img3/detail-exploded.png" alt="Exploded view of the Vocci ring"></div><div class="pn " style="grid-column:1/span 1;grid-row:1/span 1"><h2>Every detail, considered.</h2>')
    t = t.replace('src="img2/p-10_1.jpg"', 'src="img3/detail-button.jpg"').replace('src="img2/m76.jpg"', 'src="img3/detail-ruler.jpg"').replace('src="img2/ip67-0923.jpg" alt="" style="object-position:50% 55%"', 'src="img3/detail-ip67.jpg" alt="" style="object-position:50% 50%"')
    return t
edit('hardware', hardware)

# ---------- 14 finishes ----------
def finishes(t):
    for a, b in [('ring-silver-hd', 'finish-lumen'), ('ring-black-hd', 'finish-midnight'), ('ring-gold-hd', 'finish-dawn'), ('ring-gray-hd', 'finish-lux')]:
        t = t.replace('img2/%s.png' % a, 'img3/%s.png' % b)
    return t
edit('finishes', finishes)

# ---------- 15 FAQ: fuller answers, accordion hooks ----------
def faq(t):
    t = t.replace('<p class="end">Double-click the physical button on the ring.</p>', '<p class="end">Double-click the ring button. Two vibrations confirm recording has begun; click once to highlight a moment, double-click again to stop.</p>')
    t = t.replace('<p class="end">Use selected context with connected tools you authorize.</p>', '<p class="end">Connect once with MCP. Your transcripts and highlights become context inside the AI tools you already use—ask about any conversation, no copying and pasting.</p>')
    t = t.replace('<p class="end">Encryption on the device, permission-based access and user-controlled sync.</p>', '<p class="end">Recordings are encrypted on the ring with permission-based access, never used to train AI models, and you choose what syncs and which context is shared.</p>')
    t = t.replace('<a class="tlink">All questions</a>', '<a class="tlink" href="#">All questions</a>').replace('<a class="btn">Buy Now</a>', '<a class="btn" href="#finishes">Buy now</a>')
    return t
edit('faq', faq)

# ---------- 16 footer ----------
s = s.replace('<section id=""><div class="stage "><img class="bgimg" src="img2/hero-0924.jpg" alt="" style="object-position:50% 62%;opacity:1">', '<footer id="footer"><div class="stage foot"><img class="bgimg blur" src="img3/footer-flatlay-blur.jpg" alt="" style="object-position:50% 50%;opacity:1">')
s = s.replace('</p></div></div></section></main>', '</p></div></div></footer></main>')
s = s.replace('<span class="wmbig">VOCCI</span>', '<span class="wmbig split">VOCCI</span>')
s = s.replace('<a class="btn">Trust Center</a>', '<a class="btn" href="#">Trust Center</a>')

# ---------- inline grid positions → custom properties (tablet re-flow needs it) ----------
TABLET = {  # section id → list of (panel index in DOM order, col, row) for the 2-column layout
 'hero': [(0,'1/span 2','2/span 1')],
 'why': [(0,'2/span 1','1/span 3'),(1,'1/span 1','1/span 1'),(2,'1/span 1','2/span 1'),(3,'1/span 1','3/span 1')],
 'why-b': [(0,'2/span 1','1/span 2'),(1,'1/span 1','1/span 1'),(2,'1/span 1','2/span 1')],
 'scenes': [(0,'1/span 1','1/span 1'),(1,'1/span 1','2/span 1'),(2,'1/span 1','3/span 1'),(3,'1/span 1','4/span 1'),(4,'2/span 1','2/span 1'),(5,'2/span 1','3/span 1'),(6,'2/span 1','4/span 1')],
 'needs': [(0,'1/span 2','2/span 1'),(1,'1/span 1','1/span 1'),(2,'2/span 1','1/span 1')],
 'scenes2': [(0,'1/span 1','1/span 1'),(1,'2/span 1','2/span 1')],
 'how': [(0,'1/span 1','1/span 1'),(1,'2/span 1','1/span 1'),(2,'1/span 1','3/span 1'),(3,'2/span 1','3/span 1'),(4,'1/span 1','2/span 1'),(5,'2/span 1','2/span 1'),(6,'1/span 1','4/span 1'),(7,'2/span 1','4/span 1')],
 'breather': [(0,'1/span 1','2/span 1')],
 'privacy': [(0,'2/span 1','1/span 1'),(1,'1/span 1','1/span 1'),(2,'1/span 1','2/span 1'),(3,'2/span 1','2/span 1'),(4,'1/span 1','3/span 1')],
 'certs': [(0,'1/span 2','1/span 1'),(1,'1/span 1','2/span 1'),(2,'2/span 1','2/span 1'),(3,'1/span 1','3/span 1'),(4,'2/span 1','3/span 1')],
 'testimonials': [(0,'2/span 1','1/span 1'),(1,'1/span 1','1/span 1'),(2,'1/span 1','2/span 1'),(3,'2/span 1','2/span 1'),(4,'1/span 1','3/span 1')],
 'community': [(0,'2/span 1','2/span 1')],
 'press': [(0,'1/span 2','1/span 1'),(1,'1/span 1','2/span 1'),(2,'2/span 1','2/span 1'),(4,'1/span 1','3/span 1'),(5,'2/span 1','3/span 1')],
 'awards': [(0,'1/span 1','1/span 1'),(1,'2/span 1','1/span 1'),(2,'1/span 1','2/span 1'),(3,'2/span 1','2/span 1'),(4,'1/span 2','3/span 1')],
 'hardware': [(0,'1/span 2','3/span 1'),(1,'1/span 1','1/span 1'),(2,'2/span 1','1/span 1'),(3,'1/span 1','2/span 1'),(4,'2/span 1','2/span 1')],
 'finishes': [(0,'1/span 1','1/span 1'),(1,'2/span 1','1/span 1'),(2,'1/span 1','2/span 1'),(3,'2/span 1','2/span 1')],
 'faq': [(0,'1/span 1','1/span 1'),(1,'2/span 1','1/span 1'),(2,'1/span 1','2/span 1'),(3,'2/span 1','2/span 1'),(4,'1/span 1','3/span 1')],
 'footer': [(0,'1/span 2','1/span 1'),(1,'1/span 1','2/span 1'),(2,'2/span 1','2/span 1')],
}
def convert(sid, tag='section'):
    global s
    m = re.search(r'<%s id="%s">.*?</%s>' % (tag, re.escape(sid), tag), s, re.S); assert m, sid
    t = m.group(); k = [0]; tab = {i:(c,r) for i,c,r in TABLET.get(sid, [])}
    def rep(mm):
        i = k[0]; k[0] += 1
        extra = ''
        if i in tab: extra = ';--tc:%s;--tr:%s' % tab[i]
        return '%s style="--gc:%s;--gr:%s%s"' % (mm.group(1), mm.group(2), mm.group(3), extra)
    t = re.sub(r'(<div class="pn[^"]*")\s+style="grid-column:([^;"]+);grid-row:([^;"]+)"', rep, t)
    s = s[:m.start()] + t + s[m.end():]
for sid in TABLET: convert(sid, 'footer' if sid == 'footer' else 'section')
assert 'style="grid-column' not in s, 'unconverted panel'

# ---------- rules with squares → one drawable line element per row ----------
# (kept as-is; motion targets .hl/.rowline/.sqr)

# ---------- performance: lazy-load below-the-fold imagery so the hero animates at once ----------
head_end = s.index('<section id="why-b">')
tail = s[head_end:]
tail = re.sub(r'<img (?![^>]*loading=)', '<img loading="lazy" decoding="async" ', tail)
s = s[:head_end] + tail
s = s.replace('<img class="bgimg" src="img3/hero-flatlay.jpg"', '<img class="bgimg" fetchpriority="high" decoding="async" src="img3/hero-flatlay.jpg"')

# ---------- sections 2 & 3: prototype moves to its own glass cell at bottom-right ----------
def split_proto(sid):
    global s
    m = re.search(r'<section id="%s"[^>]*>.*?</section>' % sid, s, re.S); t = m.group()
    a = t.index('<div class="proto'); depth = 0; i = a
    while True:  # find matching close of the proto div
        j = t.index('<', i + 1)
        if t.startswith('</div>', j): depth -= 1
        elif t.startswith('<div', j): depth += 1
        if depth < 0: b = j + 6; break
        i = j
    proto = t[a:b]; t = t[:a] + t[b:]
    tab = {'why': '--tc:1/span 1;--tr:3/span 1', 'why-b': '--tc:1/span 1;--tr:2/span 1'}[sid]
    t = t.replace('<div class="rowline"', '<div class="pn glass-proto" style="--gc:4/span 1;--gr:2/span 1;' + tab + '">' + proto + '</div><div class="rowline"', 1)
    s = s[:m.start()] + t + s[m.end():]
split_proto('why'); split_proto('why-b')
s = s.replace('data-a="38" data-r="2"><img src="img3/ai-copilot.png"', 'data-a="6" data-r="2"><img src="img3/ai-copilot.png"').replace('data-a="-20" data-r="2"><img src="img3/ai-sparkle.png"', 'data-a="-44" data-r="2"><img src="img3/ai-sparkle.png"')

# ---------- Longbow-style lazy cells: secondary copy appears on hover; photo cells get a hover caption ----------
def lazy(sid, tag='section'):
    global s
    m = re.search(r'<%s id="%s">.*?</%s>' % (tag, re.escape(sid), tag), s, re.S); t = m.group()
    t = re.sub(r'<div class="pn (?!pic)([^"]*)"', lambda mm: '<div class="pn lazy %s"' % mm.group(1) if ('<h3' in t) else mm.group(0), t)
    s = s[:m.start()] + t + s[m.end():]
for sid in ['scenes','how','privacy','hardware','finishes','press']: lazy(sid)
# heading cells keep their copy visible
def unlazy(mm):
    block = mm.group(0)
    return block.replace('pn lazy ', 'pn ', 1) if '<h2' in block else block
s = re.sub(r'<div class="pn lazy [^"]*".*?(?=<div class="pn|<div class="rowline"|</div></section>)', unlazy, s, flags=re.S)
# captions on photo cells (text borrowed from the cell that explains them)
def caps(sid, titles):
    global s
    m = re.search(r'<section id="%s">.*?</section>' % re.escape(sid), s, re.S); t = m.group(); k = [0]
    def rep(mm):
        i = k[0]; k[0] += 1
        return mm.group(0) + ('<span class="pic-cap">%s</span>' % titles[i] if i < len(titles) else '')
    t = re.sub(r'(<div class="pn pic(?! sharp)[^"]*"[^>]*><img[^>]*>)', rep, t)
    s = s[:m.start()] + t + s[m.end():]
caps('scenes', ['Noisy rooms — clear transcripts anyway', 'Your workflow — connect once with MCP', 'Everyday ideas — capture between appointments'])
caps('how', ['01 · Double-click to record', '02 · Transcribed automatically', '03 · Press and hold to send', '04 · AI agent takes over'])
caps('press', ['Vocci Ring: This Tiny AI Assistant Changed My Workflow', 'Vocci Ring Review: real-world context for your AI tools', 'Creator title placeholder'])

# ---------- ivycapital motions: emphasis, count-up hooks, marquee, background opacity per section ----------
s = s.replace('<p>The AI wearable built to close the loop between your real life and your AI tool.</p>', '<p>The AI wearable built to close the loop between your <em class="emph">real life</em> and your <em class="emph">AI tool</em>.</p>')
s = s.replace('Titanium inside and out. <b>3–5 g</b>, 6.8 mm wide, 2.85 mm thin.', 'Titanium inside and out. <b><span class="cu" data-to="3">3</span>–<span class="cu" data-to="5">5</span> g</b>, <span class="cu" data-to="6.8" data-dec="1">6.8</span> mm wide, <span class="cu" data-to="2.85" data-dec="2">2.85</span> mm thin.')
s = s.replace('<h3>6.8 mm wide. 2.85 mm thin.</h3>', '<h3><span class="cu" data-to="6.8" data-dec="1">6.8</span> mm wide. <span class="cu" data-to="2.85" data-dec="2">2.85</span> mm thin.</h3>')
s = s.replace('Up to 8 h of recording; 30 min to 80%.', 'Up to <span class="cu" data-to="8">8</span> h of recording; <span class="cu" data-to="30">30</span> min to <span class="cu" data-to="80">80</span>%.')
s = s.replace('<b class="cb">ISO 27001</b>', '<b class="cb">ISO <span class="cu" data-to="27001">27001</span></b>').replace('<b class="cb">ISO 27701</b>', '<b class="cb">ISO <span class="cu" data-to="27701">27701</span></b>')
m = re.search(r'<div class="presslogos v13 row">(.*?)</div>', s, re.S)
logos = m.group(1)
s = s.replace(m.group(0), '<div class="marquee"><div class="marquee__track">' + logos + logos + logos + '</div></div>')
for sid, op in [('hero','0'),('why','0'),('why-b','0'),('scenes','.5'),('needs','0'),('scenes2','0'),('how','.4'),('breather','0'),('privacy','0'),('certs','.5'),('testimonials','0'),('community','0'),('press','.4'),('awards','.5'),('hardware','.4'),('finishes','.5'),('faq','.4')]:
    s = s.replace('<section id="%s">' % sid, '<section id="%s" data-bgop="%s">' % (sid, op))
s = s.replace('<footer id="footer">', '<footer id="footer" data-bgop="0">')
pre = '<div class="tx" id="tx" aria-hidden="true">' + '<i></i>' * 8 + '</div><div id="pagebg" aria-hidden="true"><i class="lq lq1"></i><i class="lq lq2"></i><i class="lq lq3"></i></div>'

# ---------- award / certification cards: colour glass backgrounds on hover ----------
def glass(sid):
    global s
    m = re.search(r"<section id=\"%s\"[^>]*>.*?</section>" % sid, s, re.S); t = m.group(); k = [0]
    def rep(mm):
        k[0] += 1
        return mm.group(1) + ' glassy' + mm.group(2) + '<i class="gbg" style="background-image:url(img3/glass-%d.jpg)"></i>' % (k[0] + (4 if sid == 'certs' else 0))
    t = re.sub(r'(<div class="pn mid)("(?: style="[^"]*")?>)', rep, t)
    s = s[:m.start()] + t + s[m.end():]
glass('awards'); glass('certs')

# ---------- assets: local fonts, override css, motion js ----------
s = s.replace('<main class="page gridall" data-ui="classic" data-skin="v2">', '<main class="page gridall" data-ui="classic" data-skin="v2" data-round="0928">')
override = (R/'src/override.css').read_text()
motion = (R/'src/motion.js').read_text()
s = s.replace('<main class="page gridall"', '<style id="round-0928">\n' + override + '\n</style>' + pre + '<main class="page gridall"', 1)
s = s.replace('</main>\n</body>', '</main>\n<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js" onerror="this.remove()"></script>\n<script>\n' + motion + '\n</script>\n</body>')
(R/'index.html').write_text(s)
print('built', len(s))
