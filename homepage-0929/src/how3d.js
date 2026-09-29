/* How it works · 3D ring that breaks out of its grid cell (0929-i)
   Bundled with three.js into vendor/how3d.js by src/build-3d.sh; motion.js loads it on desktop only.
   The z = 0 plane is the grid. Whatever part of the ring is behind it is drawn only inside cell 01
   (scissor), whatever part is in front is drawn everywhere — so the ring reads as pushing through
   the cell and out over the grid lines. Scroll then walks it across steps 01 → 04. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const sec = document.getElementById('how');
const stage = sec && sec.querySelector('.stage');
if (stage) init();

function init() {
  const ORANGE = new THREE.Color(0xF47546);
  const pics = [...stage.querySelectorAll(':scope>.pn.pic')];
  const txts = [...stage.querySelectorAll(':scope>.pn:not(.pic)')];
  pics.forEach((p, i) => { p.dataset.col = i; }); txts.forEach((p, i) => { p.dataset.col = i; });

  /* ---------- overlay: webgl, waveform, pill, hold arc, shadow, burst, blueprint ---------- */
  const ov = document.createElement('div'); ov.className = 'r3';
  ov.innerHTML =
    '<canvas class="r3-wave"></canvas><i class="r3-shadow"></i><canvas class="r3-gl"></canvas>' +
    '<svg class="r3-arc" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/><circle class="r3-arc-on" cx="50" cy="50" r="48" pathLength="1"/></svg>' +
    '<i class="r3-ripple"></i><i class="r3-ripple"></i>' +
    '<div class="r3-pill"><i class="dot"></i><span class="t">REC 00:00</span><b class="wv"><i></i><i></i><i></i><i></i><i></i></b><b class="bar"><i></i></b></div>' +
    '<div class="r3-burst"><i></i></div>';
  stage.appendChild(ov);
  const bp = document.createElement('div'); bp.className = 'r3-bp';
  bp.innerHTML = '<svg viewBox="0 0 200 200"><circle class="c" cx="100" cy="100" r="62"/><circle class="c" cx="100" cy="100" r="50"/>' +
    '<path class="h" d="M20 100H180M100 20V180"/><rect class="a" x="88" y="34" width="24" height="10" rx="5"/></svg>' +
    '<span class="k">VOCCI R1</span><span class="s">Ø 26.9 mm · 3–5 g · IP67</span><span class="s2">Titanium · 1 MEMS mic</span>';
  pics[0].appendChild(bp);
  /* Vocci app screens that replace the photos in cells 02–04 once the ring reaches that step (content after Vocci_3Dmodel_demo) */
  const APP = [
    '<div class="r3-ph a2"><div class="sb"><b>9:41</b><i></i></div>' +
      '<div class="scr s1"><div class="dt">8/19/2026 2:14 PM <span class="x1">1X</span></div><div class="tm"><span>0:00:00</span><span>0:32:14</span></div><div class="trk"><i></i></div>' +
      '<div class="ctl"><span>↺15</span><i class="pl">▶</i><span>↻15</span></div><div class="hr"></div><div class="msg">Your recording is ready for transcription.</div>' +
      '<div class="lab">Language</div><div class="fld">English</div><div class="chk"><i>✓</i><div><b>Auto transcribe</b><span>Automatically transcribe after uploading</span></div></div><button class="cta">Transcribe</button></div>' +
      '<div class="scr s2"><div class="hd">‹ <b>Product Sync — Launch Planning</b> ⋮</div><div class="tabs"><span class="tb">Chat</span><span class="tb">Highlights</span><span class="tb">Notes</span></div>' +
      '<div class="aud"><i class="pl">▶</i> 0:32:14 <em></em></div><div class="lst">' +
      [['S1', '#3a3d45', 'Mia', '2:02 PM', 'Okay — launch. Thursday or not?'], ['S2', '#6b5844', 'Ian', '2:03 PM', 'Thursday works if the sizing-kit flow ships first.'],
       ['S3', '#F47546', 'Ray', '2:03 PM', 'I can have the flow ready by Wednesday noon.', 'Sizing-kit flow is the launch blocker — owner Ray, due Wed noon.'],
       ['S2', '#6b5844', 'Ian', '2:05 PM', 'Then charger copy is on me tonight.'], ['S1', '#3a3d45', 'Mia', '2:06 PM', 'Deal. Launch moves to Thursday.', 'Launch date confirmed: Thursday.']]
        .map(r => '<div class="rw' + (r[5] ? ' mk' : '') + '"><i class="av" style="background:' + r[1] + '">' + r[0] + '</i><div><b>' + r[2] + '</b><t>' + r[3] + '</t><p>' + r[4] + '</p>' +
          (r[5] ? '<div class="ins"><b>Insight:</b> ' + r[5] + '</div>' : '') + '</div></div>').join('') + '</div></div>' +
      '<div class="scr s3"><div class="hd">‹ <b>Product Sync — Launch Planning</b> ⋮</div><div class="tabs"><span class="tb">Chat</span><span class="tb">Highlights</span><span class="tb on">Notes</span></div>' +
      '<h5>Product Sync — Launch Planning.md</h5><div class="nd">8/19/2026, 14:38</div><div class="pills"><span>Copy</span><span>View the file</span></div>' +
      '<div class="qt">Team confirmed Thursday launch, contingent on the sizing-kit flow shipping Wednesday noon. Ian revises the charger copy tonight.</div>' +
      '<h6>Summary</h6><p>Mia, Ian and Ray aligned on the date. The sizing-kit flow is the single blocker — Ray ships it by Wednesday noon. The two moments tapped live on the ring were pinned as highlights.</p></div></div>',
    '<div class="r3-ph a3"><div class="sb"><b>9:41</b><i></i></div><div class="ag"><span class="vdot"></span>VOCCI · Agent</div>' +
      '<div class="hold"><i class="hring"></i><span>Holding · listening</span></div>' +
      '<div class="cmd"><i class="wv5"><b></b><b></b><b></b><b></b><b></b></i><div><q></q><t>long-press · voice command</t></div></div>' +
      '<button class="send">Send to Agent</button><div class="think"><b></b><b></b><b></b></div>' +
      '<div class="res"><i>✓</i><div><b>Reminder set</b><span>Tomorrow 9:00 AM — Send sizing-kit build to Mia</span></div></div>' +
      '<div class="res r2"><i>✓</i><div><b>Draft ready in Mail</b><span>To Mia · “Sizing-kit build — tomorrow 9:00”</span></div></div></div>',
    '<div class="r3-ph a4"><div class="ex"><i></i><i></i><i></i><span>Claude</span></div><div class="uq">What did we decide about the launch?</div>' +
      '<div class="pull"><i class="lnk"></i>Reading <b>Vocci · Product Sync</b> · 32 min</div><div class="ans"><span class="typ"></span></div>' +
      '<div class="cite">⟵ context via <b>Vocci MCP</b></div><div class="mcp"><span>ChatGPT</span><span>Claude</span><span>Claude Code</span><span class="any">any MCP tool</span></div>' +
      '<div class="inp">Reply…</div></div>'];
  const apps = APP.map((h, k) => { const d = document.createElement('div'); d.className = 'r3-app'; d.innerHTML = h; pics[k + 1].appendChild(d); return d; });
  const glc = ov.querySelector('.r3-gl'), wvc = ov.querySelector('.r3-wave'), wx = wvc.getContext('2d');
  const pill = ov.querySelector('.r3-pill'), pillT = pill.querySelector('.t'), pillBar = pill.querySelector('.bar i');
  const arc = ov.querySelector('.r3-arc'), arcOn = ov.querySelector('.r3-arc-on');
  const shadow = ov.querySelector('.r3-shadow'), ripples = [...ov.querySelectorAll('.r3-ripple')], burst = ov.querySelector('.r3-burst');

  /* ---------- three ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .88;
  renderer.localClippingEnabled = true; renderer.autoClear = false;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 10, 20000);
  const clip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), clips = [clip];
  const pmrem = new THREE.PMREMGenerator(renderer);
  const pivot = new THREE.Group(), orient = new THREE.Group(); pivot.add(orient); scene.add(pivot);
  let model = null, btn = null, btnBase = null, btnDir = new THREE.Vector3(), diam = 1, mats = [];

  const gltf = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  /* model + studio light come as base64 in vendor/how3d-assets.js (artifacts can't serve .glb/.exr; also works from file://) */
  const b64 = str => { const b = atob(str), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; };
  const assets = new Promise((res, rej) => { if (window.__VOCCI_RING) return res(); const sc = document.createElement('script'); sc.src = 'vendor/how3d-assets.js'; sc.onload = res; sc.onerror = rej; document.body.appendChild(sc); });
  const envOf = () => { try { const t = new EXRLoader().parse(b64(window.__VOCCI_EXR)), tx = new THREE.DataTexture(t.data, t.width, t.height, t.format, t.type);
      tx.mapping = THREE.EquirectangularReflectionMapping; tx.needsUpdate = true; return pmrem.fromEquirectangular(tx).texture; }
    catch (e) { return pmrem.fromScene(new RoomEnvironment(), .04).texture; } };
  assets.then(() => new Promise((res, rej) => gltf.parse(b64(window.__VOCCI_RING), '', res, rej))).then(g => [g, envOf()]).then(([g, env]) => {
    scene.environment = env;
    model = g.scene;
    ['case_lid', 'case_lidin', 'case_base', 'case_inner', 'AIM_A', 'AIM_B'].forEach(n => { const o = model.getObjectByName(n); o && o.parent.remove(o); });
    model.traverse(o => {
      if (!o.isMesh) return;
      o.material = o.material.clone(); o.material.clippingPlanes = clips; o.material.envMapIntensity = 1.35; mats.push(o.material);
      if ((o.name || '').toLowerCase() === 'part_02') { btn = o; btnBase = o.position.clone(); }
    });
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    diam = Math.max(size.x, size.y, size.z);
    const d = [size.x, size.y, size.z], k = d.indexOf(Math.min(...d));
    const A = new THREE.Vector3(+(k === 0), +(k === 1), +(k === 2));                 // ring axis = thinnest box side
    const bc = btn ? new THREE.Box3().setFromObject(btn).getCenter(new THREE.Vector3()) : c.clone().add(new THREE.Vector3(0, diam / 2, 0));
    const B = bc.sub(c); B.addScaledVector(A, -B.dot(A)).normalize();                  // centre → button, in the ring plane
    const C = new THREE.Vector3().crossVectors(A, B);
    btnDir.copy(B);
    /* axis → up, button → camera; the tilt shows the opening */
    const m = new THREE.Matrix4().makeBasis(C, A, B).invert();
    orient.quaternion.setFromRotationMatrix(m).premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), .42));
    model.position.copy(c).multiplyScalar(-1);
    if (btn) { btn.material.emissive = ORANGE.clone(); btn.material.emissiveIntensity = 0; btn._c0 = btn.material.color.clone(); }
    orient.add(model);
    sec.classList.add('r3ready'); size3(); kick();
  }).catch(() => { sec.classList.remove('how3d'); ov.remove(); bp.remove(); });

  /* ---------- layout ---------- */
  let W = 0, H = 0, camZ = 1, R = { p: [], t: [] };
  const rel = el => { const a = el.getBoundingClientRect(), b = stage.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; };
  function size3() {
    sec.style.height = (stage.offsetHeight + innerHeight * 3.6) + 'px';
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setSize(W, H, false); wvc.width = W * 2; wvc.height = H * 2;
    cam.aspect = W / H; camZ = (H / 2) / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    cam.position.set(0, 0, camZ); cam.near = camZ * .2; cam.far = camZ * 4; cam.updateProjectionMatrix();
    R = { p: pics.map(rel), t: txts.map(rel) };
    stage.style.setProperty('--appk', Math.min(R.p[1].w * .8 / 280, R.p[1].h * .9 / 470).toFixed(3));
  }
  addEventListener('resize', () => { size3(); kick(); });

  /* ---------- choreography ---------- */
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eout = t => 1 - Math.pow(1 - t, 3);
  const band = (p, a, b) => cl((p - a) / (b - a));
  const STEPS = [[.3, .42], [.5, .6], [.67, .78], [.86, 1]];   // dwell windows; travel between them
  const ROLL = [0, .12];      // centre of the top row → rolls left and sinks into cell 01
  const EMERGE = [.12, .3];   // bursts back out of cell 01 and drops onto step 01
  function progress() { const r = sec.getBoundingClientRect(), tr = sec.offsetHeight - stage.offsetHeight; return tr > 0 ? cl(-r.top / tr) : 0; }
  function stepOf(p) { return p < .28 ? -1 : p < .46 ? 0 : p < .64 ? 1 : p < .82 ? 2 : 3; }
  const restOf = i => { const t = R.t[i]; return { x: t.x + t.w / 2, y: t.y + t.h * .5 }; };

  let cur = -2, t0 = 0, crossed = false, raf = 0, visible = false;
  function setStep(i, now) {
    if (i === cur) return; cur = i; t0 = now;
    stage.classList.toggle('stepping', i >= 0);
    pics.forEach((p, k) => p.classList.toggle('act', k === i)); txts.forEach((p, k) => { p.classList.toggle('act', k === i); p.classList.toggle('on', k === i); });
    pill.dataset.s = i; pill.classList.remove('pop'); void pill.offsetWidth; pill.classList.add('pop');
    pillT.textContent = ['REC 00:00', 'TRANSCRIBING', 'HOLD TO SEND', 'AGENT ACTIVE'][i] || '';
  }

  function frame(now) {
    raf = 0; if (!model || !W) return;
    const p = progress(), s = stepOf(p); setStep(s, now);
    const tt = now / 1000, since = (now - t0) / 1000;

    /* position / depth / size */
    const cell = R.p[0], start = { x: cell.x + cell.w / 2, y: cell.y + cell.h / 2 };
    const S0 = Math.min(cell.w, cell.h) * .6, Sf = Math.min(R.t[0].w * .44, R.t[0].h * .36);
    const e = band(p, EMERGE[0], EMERGE[1]), ez = ease(cl(e / .7)), ey = ease(band(e, .45, 1));
    let x, y, z, size;
    const r = band(p, ROLL[0], ROLL[1]), ru = ease(r), mid = { x: W / 2, y: start.y };
    let roll = 0;
    if (p < EMERGE[0]) {
      x = lerp(mid.x, start.x, ease(band(r, 0, .72))); y = start.y;
      z = lerp(S0 * .3, -diamPx(S0) * 1.1, ease(band(r, .74, 1)));     // in front of the grid while it rolls, then back into cell 01
      size = S0; roll = (ease(band(r, 0, .72)) - 1) * (mid.x - start.x) / (S0 * .5);      // rolls like a wheel, ending upright
    } else if (p <= EMERGE[1]) {
      const r0 = restOf(0);
      x = lerp(start.x, r0.x, ey); y = lerp(start.y, r0.y, ey);
      z = lerp(-diamPx(S0) * 1.1, S0 * .55, ez) - S0 * .35 * ey;     // push through the plane, then settle a little
      size = lerp(S0, S0 * 1.18, ez) * (1 - ey) + Sf * ey;
    } else {
      let a = 0, b = 0, u = 0;
      for (let k = 0; k < 4; k++) { if (p >= STEPS[k][0]) { a = k; b = k; u = 0; } if (k < 3 && p > STEPS[k][1] && p < STEPS[k + 1][0]) { a = k; b = k + 1; u = ease(band(p, STEPS[k][1], STEPS[k + 1][0])); } }
      const A = restOf(a), B = restOf(b);
      x = lerp(A.x, B.x, u); y = lerp(A.y, B.y, u) - Math.sin(u * Math.PI) * Sf * .35;   // small hop between cells
      z = S0 * .2 + Math.sin(u * Math.PI) * S0 * .25; size = Sf;
    }
    /* burst the moment the ring's centre crosses the grid plane */
    if (z > 0 && !crossed && p > EMERGE[0] + .01) { crossed = true; burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go'); }
    if (z < -S0 * .2) crossed = false;
    stage.classList.toggle('broke', p > EMERGE[0] + .05);

    const f = camZ / (camZ - z);
    pivot.position.set(x - W / 2, H / 2 - y, z);
    pivot.scale.setScalar(size / diam / f);

    /* rotation: a turn and a half while emerging, idle sway after, a spin on each hop */
    const idle = Math.sin(tt * .6) * .18;
    const hop = p > EMERGE[1] ? travelPhase(p) : 0;
    let yaw = (1 - ez) * Math.PI * 1.5 + idle + hop * Math.PI * 2, pitch = (1 - ez) * .5 + Math.sin(tt * .45) * .05;
    let shake = 0;
    /* step reactions */
    let glow = 0, press = 0;
    if (s === 0) { const k = since; glow = pulse(k, .15) + pulse(k, .5); shake = (pulse(k, .15) + pulse(k, .5)) * Math.sin(k * 90) * .05;
      pillT.textContent = 'REC 00:' + String(Math.floor(cl(band(p, .28, .46)) * 42) + 3).padStart(2, '0'); }
    if (s === 2) { const h = band(p, .65, .78); press = cl(h * 4); glow = .25 + .75 * h; pillBar.style.transform = 'scaleX(' + h.toFixed(3) + ')';
      arcOn.style.strokeDashoffset = (1 - h).toFixed(3); pillT.textContent = h >= 1 ? 'SENT' : 'HOLD TO SEND'; }
    if (s === 3) { glow = .85 + Math.sin(tt * 3) * .15; }
    pivot.rotation.set(pitch, yaw, shake + roll);
    if (btn) {
      btn.material.emissiveIntensity = glow * 2.2;
      btn.material.color.copy(btn._c0).lerp(ORANGE, cl(glow) * .7);
      btn.position.copy(btnBase).addScaledVector(btnDir, -press * diam * .012);
    }

    /* overlay pieces follow the ring */
    const put = (el, px, py) => { el.style.translate = px.toFixed(1) + 'px ' + py.toFixed(1) + 'px'; };
    put(pill, x, y - size * .72); pill.classList.toggle('on', s >= 0);
    const ar = size * 1.32; arc.style.width = arc.style.height = ar + 'px'; put(arc, x - ar / 2, y - ar / 2); arc.classList.toggle('on', s === 2);
    ripples.forEach((r, k) => { r.style.width = r.style.height = size + 'px'; put(r, x - size / 2, y - size / 2); r.classList.toggle('on', s === 3); });
    const sh = size * (1.05 - cl(z / S0) * .2); shadow.style.width = sh + 'px'; put(shadow, x - sh / 2, y + size * .44); shadow.style.opacity = cl(z / (S0 * .3)) * .9;
    const bc = R.p[0]; burst.style.left = bc.x + 'px'; burst.style.top = bc.y + 'px'; burst.style.width = bc.w + 'px'; burst.style.height = bc.h + 'px';

    /* render: behind-plane part scissored to cell 01, front part free */
    renderer.setScissorTest(false); renderer.clear();
    clip.normal.set(0, 0, -1);
    renderer.setScissorTest(true); renderer.setScissor(cell.x, H - cell.y - cell.h, cell.w, cell.h); renderer.render(scene, cam);
    renderer.setScissorTest(false); clip.normal.set(0, 0, 1); renderer.render(scene, cam);

    appsUpdate(p);
    drawWave(p, x, y, size, tt);
    if (visible) raf = requestAnimationFrame(frame);
  }
  const diamPx = S => S;   // depth scales with the ring size so small screens behave the same
  const pulse = (t, at) => Math.exp(-Math.pow((t - at) / .07, 2));
  function travelPhase(p) { for (let k = 0; k < 3; k++) if (p > STEPS[k][1] && p < STEPS[k + 1][0]) return ease(band(p, STEPS[k][1], STEPS[k + 1][0])) + k; return p >= STEPS[3][0] ? 3 : p >= STEPS[2][0] ? 2 : p >= STEPS[1][0] ? 1 : 0; }

  /* app screens: shown once the ring reaches their step, played by scroll (reversible) */
  const $ = (el, q) => el.querySelector(q), $$ = (el, q) => [...el.querySelectorAll(q)];
  const CMD = '“Remind me to send the sizing-kit build to Mia tomorrow at 9.”';
  const ANS = 'Thursday — as long as Ray ships the sizing-kit flow by Wednesday noon. Ian is revising the charger copy tonight.';
  const tog = (el, c, on) => { if (el.classList.contains(c) !== on) el.classList.toggle(c, on); };
  const txt = (el, t) => { if (el.textContent !== t) el.textContent = t; };
  function appsUpdate(p) {
    [.46, .64, .82].forEach((a, k) => tog(pics[k + 1], 'appon', p >= a));
    /* 02 · recording → transcript → notes */
    const a2 = apps[0], q2 = band(p, .46, .64), sp = $$(a2, '.rw'), segs = $$(a2, '.s2 .tb');
    tog($(a2, '.s1'), 'on', q2 < .3); tog($(a2, '.s2'), 'on', q2 >= .3 && q2 < .78); tog($(a2, '.s3'), 'on', q2 >= .78);
    tog($(a2, '.cta'), 'busy', q2 > .14); txt($(a2, '.cta'), q2 > .14 ? 'Transcribing…' : 'Transcribe'); $(a2, '.trk i').style.transform = 'scaleX(' + cl(q2 / .3).toFixed(3) + ')';
    const n = Math.floor(band(q2, .32, .66) * 5.99); sp.forEach((e, i) => tog(e, 'in', i < n)); $$(a2, '.ins').forEach(e => tog(e, 'in', q2 > .66));
    segs.forEach((e, i) => tog(e, 'on', i === (q2 > .66 ? 1 : 0)));
    /* 03 · hold → the command types itself → send → think → done */
    const a3 = apps[1], h = band(p, .65, .76);
    txt($(a3, 'q'), CMD.slice(0, Math.round(CMD.length * h))); tog($(a3, '.hold'), 'on', p < .78); tog(a3.firstChild, 'holding', p >= .65 && p < .76);
    tog($(a3, '.send'), 'hot', p >= .76); txt($(a3, '.send'), p >= .78 ? 'Sent' : 'Send to Agent');
    tog($(a3, '.think'), 'in', p >= .78 && p < .8); tog($(a3, '.res'), 'in', p >= .8); tog($(a3, '.r2'), 'in', p >= .81);
    /* 04 · ask anywhere: context pulled through MCP, answer streams */
    const a4 = apps[2], q4 = band(p, .84, .99);
    tog($(a4, '.pull'), 'in', q4 > .05); tog($(a4, '.pull'), 'done', q4 > .25);
    txt($(a4, '.typ'), ANS.slice(0, Math.round(ANS.length * band(q4, .25, .8)))); tog($(a4, '.cite'), 'in', q4 > .8); tog($(a4, '.mcp'), 'in', q4 > .9);
  }

  /* waveform trail on the ring's rail + gesture marks per step */
  function noise(v, t) { return Math.sin(v * 1.7 + t * 2.1) * .5 + Math.sin(v * 3.9 - t * 1.3) * .3 + Math.sin(v * 7.3 + t * 3.7) * .2; }
  function drawWave(p, rx, ry, size, t) {
    const k = 2; wx.setTransform(k, 0, 0, k, 0, 0); wx.clearRect(0, 0, W, H);
    if (p < .24) return;
    const y0 = restOf(0).y, x0 = restOf(0).x - R.t[0].w * .42, x1 = p <= EMERGE[1] ? x0 + (rx - x0) * band(p, .24, .3) : rx;
    wx.lineCap = 'round'; wx.lineWidth = 2; wx.strokeStyle = 'rgba(29,29,31,.28)'; wx.beginPath();
    for (let x = x0; x <= x1 - size * .55; x += 6) { const h = Math.max(1.5, Math.abs(noise(x / 40, t * .6)) * 18 * (x > restOf(1).x - 20 && x < restOf(1).x + 60 ? .4 : 1)); wx.moveTo(x, y0 - h); wx.lineTo(x, y0 + h); }
    wx.stroke();
    wx.strokeStyle = '#F47546'; wx.lineWidth = 2.2; wx.shadowColor = 'rgba(244,117,70,.55)'; wx.shadowBlur = 8;
    const mark = (i, fn) => { const X = restOf(i).x + R.t[i].w * .3; if (x1 - size * .55 > X) { wx.beginPath(); fn(X, y0); wx.stroke(); } };
    mark(0, (X, Y) => { wx.moveTo(X - 5, Y - 22); wx.lineTo(X - 5, Y + 22); wx.moveTo(X + 5, Y - 22); wx.lineTo(X + 5, Y + 22); });          // double-click
    mark(1, (X, Y) => { wx.moveTo(X - 12, Y - 14); wx.lineTo(X + 12, Y - 14); wx.moveTo(X - 12, Y - 4); wx.lineTo(X + 6, Y - 4); wx.moveTo(X - 12, Y + 6); wx.lineTo(X + 10, Y + 6); });  // transcript lines
    mark(2, (X, Y) => { wx.moveTo(X - 18, Y + 20); wx.lineTo(X - 18, Y - 20); wx.lineTo(X + 18, Y - 20); wx.lineTo(X + 18, Y + 20); });    // hold bracket
    wx.shadowBlur = 0;
  }

  /* run only while the section is on screen */
  function kick() { if (!raf && model) raf = requestAnimationFrame(frame); }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }, { rootMargin: '200px 0px' }).observe(sec);
  addEventListener('scroll', kick, { passive: true });
  size3();
}
