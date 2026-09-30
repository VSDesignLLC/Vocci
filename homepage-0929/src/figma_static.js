/* Figma-import snapshots of the live page (desktop 1440): node src/figma_static.js <out-dir>
   Plays every entrance to its end, bakes the WebGL / canvas views into PNGs, un-splits per-letter text,
   removes pinning/sticky and all scripts. Writes figma-static.html and, with every :hover rule forced on,
   figma-static-hover.html. Relative asset paths; src/embed_static.py inlines them afterwards. */
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'dist';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { return g.call(this, t, Object.assign({}, o || {}, { preserveDrawingBuffer: true })); }; });
  await p.goto('http://127.0.0.1:8732/index.html'); await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 450) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
  await p.waitForFunction(() => ['how', 'hardware', 'finishes'].every(i => /how3d|hw3d|fn3d/.test(document.getElementById(i).className)), null, { timeout: 90000 }).catch(() => {});
  /* bake canvases at a chosen scroll state; tag each with its captured image */
  const bake = async (id, frac, wait) => {
    await p.evaluate(([id, f]) => { const s = document.getElementById(id); scrollTo(0, s.offsetTop + f * Math.max(0, s.offsetHeight - innerHeight)); }, [id, frac]);
    await p.waitForTimeout(wait);
    await p.evaluate(id => { const sec = document.getElementById(id);
      sec.querySelectorAll('canvas').forEach(c => { const cs = getComputedStyle(c), im = document.createElement('img'); try { im.src = c.toDataURL('image/png'); } catch (e) {}
        im.alt = ''; im.style.cssText = `position:absolute;left:${c.offsetLeft}px;top:${c.offsetTop}px;width:${c.offsetWidth}px;height:${c.offsetHeight}px;z-index:${cs.zIndex};pointer-events:none;translate:none;scale:none`; im.className = 'baked'; im.dataset.for = c.className; c.dataset.baked = 1;
        c.parentNode.insertBefore(im, c); });
      (window.__snap = window.__snap || {})[id] = sec.querySelector('.stage').outerHTML; }, id);
  };
  await bake('how', .9, 9000);          // step 04: all three app screens shown
  await bake('hardware', 0, 6000);      // fully exploded, cards open
  await bake('finishes', 0, 6000);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(2500);
  await p.evaluate(() => {
    const $$ = q => [...document.querySelectorAll(q)];
    // freeze canvases as images in place
    Object.entries(window.__snap || {}).forEach(([id, h]) => { const st = document.getElementById(id).querySelector('.stage'); st.outerHTML = h; });   // frozen 3D states
    $$('canvas[data-baked]').forEach(c => c.remove());
    $$('img').forEach(i => { i.loading = 'eager'; i.removeAttribute('loading'); });
    $$('canvas').forEach(c => { const cs = getComputedStyle(c); const im = document.createElement('img'); if (c.dataset.png) im.src = c.dataset.png;
      im.style.cssText = `position:absolute;left:${c.offsetLeft}px;top:${c.offsetTop}px;width:${c.offsetWidth}px;height:${c.offsetHeight}px;z-index:${cs.zIndex};pointer-events:none`; im.alt = ''; c.replaceWith(im); });
    // un-split text so Figma gets whole text layers
    $$('.bc,.bw,.w,.hero-ch,.u').reverse().forEach(e => e.replaceWith(...e.childNodes));
    $$('.bt,.split').forEach(e => e.classList.remove('bt', 'split')); document.body.normalize();
    // everything in its final state
    $$('.stage,.pn,.split,.rowline,[class*="a-"]').forEach(e => e.classList.add('in'));
    // no pinning / sticky / scroll-driven sizes
    ['hero', 'scenes2', 'footer', 'breather', 'how'].forEach(id => { const s = document.getElementById(id); if (s) { s.style.position = 'relative'; s.style.top = 'auto'; s.style.visibility = 'visible'; } });
    $$('#how,#breather').forEach(s => { s.style.height = 'auto'; const st = s.querySelector('.stage'); st.style.position = 'relative'; });
    const bi = document.querySelector('#breather .bgimg'); if (bi) { bi.style.width = '100%'; bi.style.height = '100%'; }
    $$('#breather .pn').forEach(e => e.classList.remove('pending'));
    $$('.pn,.pn.driven').forEach(e => { e.style.translate = ''; e.style.opacity = ''; e.classList.remove('driven'); });
    $$('.stage>.bgimg,.pn.pic>img').forEach(e => { e.style.scale = ''; e.style.filter = ''; e.style.translate = ''; });   // drop parallax offsets
    document.querySelectorAll('script').forEach(s => s.remove());
    document.documentElement.classList.remove('js');
    const st = document.createElement('style'); st.id = 'figma-static';
    st.textContent = '*{transition:none!important;animation:none!important}html{scroll-behavior:auto}.tx,#tx,.pre{display:none!important}.pn,.pn.pic,.hl,.sqr,.rowline,.rowline i{opacity:1!important;clip-path:none!important}.gridall>.nav{position:absolute!important;transform:none!important}';
    document.head.appendChild(st);
  });
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  const html = '<!doctype html>\n' + await p.evaluate(() => document.documentElement.outerHTML);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'figma-static.html'), html);
  /* hover version: every :hover rule also applies without the pointer */
  const hov = await p.evaluate(() => { const extra = [];
    const walk = rules => [...rules].forEach(r => { if (r.cssRules && r.media) { const inner = []; [...r.cssRules].forEach(x => { if (x.selectorText && x.selectorText.includes(':hover')) inner.push(x.cssText.replace(/:hover/g, '')); }); if (inner.length) extra.push('@media ' + r.media.mediaText + '{' + inner.join('\n') + '}'); }
      else if (r.selectorText && r.selectorText.includes(':hover')) extra.push(r.cssText.replace(/:hover/g, '')); });
    [...document.styleSheets].forEach(s => { try { walk(s.cssRules); } catch (e) {} });
    return extra.join('\n'); });
  fs.writeFileSync(path.join(OUT, 'figma-static-hover.html'), html.replace('</head>', '<style id="figma-hover">' + hov + '</style></head>'));
  console.log('ok', html.length, 'hover rules', hov.split('\n').length);
  await b.close();
})();
