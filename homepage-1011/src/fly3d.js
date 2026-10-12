/* 1011-zz18 · hero → screen 2: the real ring lifts out of the case and flies into screen 2.
   A fixed full-screen layer renders its own copy of the model (same three r160, same model + studio light as
   vendor/how3d.js, read from window.__VOCCI_RING / __VOCCI_EXR). It starts as the ring seen from above, sitting on
   the ring in the hero photo (window.__vocciHeroRing, motion.js), turns over while it lifts toward the camera,
   and lands in exactly the pose screen 2's ring starts from — then screen 2's own canvas takes over. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js/+esm';
import { EXRLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/EXRLoader.js/+esm';
import { MeshoptDecoder } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/meshopt_decoder.module.js/+esm';

const how = document.getElementById('how'), stage = how && how.querySelector('.stage');
const b64 = s => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; };
const wait = () => new Promise(r => { (function w() { window.__VOCCI_RING ? r() : setTimeout(w, 150); })(); });

if (stage) wait().then(() => new Promise((res, rej) => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parse(b64(window.__VOCCI_RING), '', res, rej))).then(start).catch(() => {});

function start(g) {
  const glc = document.createElement('canvas'); glc.className = 'r3-fly'; document.body.appendChild(glc);
  const rip = document.createElement('i'); rip.className = 'fly-rip'; document.body.appendChild(rip);
  const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .88;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 10, 20000);
  const pm = new THREE.PMREMGenerator(renderer);
  try { const t = new EXRLoader().parse(b64(window.__VOCCI_EXR)), tex = new THREE.DataTexture(t.data, t.width, t.height, t.format, t.type);
    tex.mapping = THREE.EquirectangularReflectionMapping; tex.needsUpdate = true; scene.environment = pm.fromEquirectangular(tex).texture; } catch (e) {}
  const ORANGE = new THREE.Color(0xF47546), pivot = new THREE.Group(); scene.add(pivot);
  const model = g.scene;
  ['case_lid', 'case_lidin', 'case_base', 'case_inner', 'AIM_A', 'AIM_B'].forEach(n => { const o = model.getObjectByName(n); o && o.parent.remove(o); });
  let btn = null;
  model.traverse(o => { if (!o.isMesh) return; o.material = o.material.clone(); o.material.envMapIntensity = 1.35;
    if ((o.name || '').toLowerCase() === 'part_02') { btn = o; o.material.emissive = ORANGE.clone(); o.material.emissiveIntensity = 0; o._c0 = o.material.color.clone(); } });
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const diam = Math.max(size.x, size.y, size.z), d = [size.x, size.y, size.z], k = d.indexOf(Math.min(...d));
  const A = new THREE.Vector3(+(k === 0), +(k === 1), +(k === 2));
  const bc = btn ? new THREE.Box3().setFromObject(btn).getCenter(new THREE.Vector3()) : c.clone().add(new THREE.Vector3(0, diam / 2, 0));
  const B = bc.sub(c); B.addScaledVector(A, -B.dot(A)).normalize();
  const C = new THREE.Vector3().crossVectors(A, B);
  const TOP = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(C.clone().negate(), B, A).invert());   // axis → camera, button up
  const ORI = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(C, A, B).invert())                    // same as how3d.js
    .premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), .42));
  model.position.copy(c).multiplyScalar(-1); pivot.add(model);

  let W = 0, H = 0, camZ = 1;
  function resize() { W = innerWidth; H = innerHeight; renderer.setSize(W, H, false); cam.aspect = W / H;
    camZ = (H / 2) / Math.tan(THREE.MathUtils.degToRad(15)); cam.position.set(0, 0, camZ); cam.near = camZ * .2; cam.far = camZ * 4; cam.updateProjectionMatrix(); }
  resize(); addEventListener('resize', () => { resize(); tick(); });

  /* screen 2's ring at its scroll progress 0 (mirrors init() in src/how3d.js) */
  const E = new THREE.Euler(), Q = new THREE.Quaternion();
  function landing(now) {
    const sr = stage.getBoundingClientRect(), cr = stage.querySelector(':scope>.pn.pic').getBoundingClientRect();
    const SW = stage.clientWidth, SH = stage.clientHeight, cz = (SH / 2) / Math.tan(THREE.MathUtils.degToRad(15));
    const cell = { x: cr.left - sr.left, y: cr.top - sr.top, w: cr.width, h: cr.height }, S0 = Math.min(cell.w, cell.h) * .6, sy = cell.y + cell.h / 2, tt = now / 1000;
    const z = S0 * .3, f = cz / (cz - z);
    E.set(.5 + Math.sin(tt * .45) * .05, Math.PI * 1.5 + Math.sin(tt * .6) * .18, -(SW / 2 - (cell.x + cell.w / 2)) / (S0 * .5));
    Q.setFromEuler(E).multiply(ORI);
    return { x: sr.left + SW / 2, y: sr.top + SH / 2 + (sy - SH / 2) * f, d: S0, z, q: Q };
  }

  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const q = new THREE.Quaternion(), spin = new THREE.Quaternion(), Z = new THREE.Vector3(0, 0, 1);
  let raf = 0, armed = true;
  function tick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const hero = window.__vocciHeroRing, r3 = how.querySelector('.r3-gl'), ready = how.classList.contains('r3ready');
    const p = cl(1 - how.getBoundingClientRect().top / innerHeight), intro = document.documentElement.classList.contains('vl-on');
    if (r3) r3.style.opacity = p >= 1 || !ready ? '' : 0;                     // screen 2's own ring takes over on landing
    if (!hero || !ready || p <= 0 || p >= 1 || intro) { glc.style.opacity = 0; if (p <= .005) armed = true; return; }
    const a = hero(), b = landing(now);
    if (armed && p > .01) { armed = false; rip.style.left = a.x + 'px'; rip.style.top = a.y + 'px'; rip.classList.remove('go'); void rip.offsetWidth; rip.classList.add('go'); }
    const e = ease(p), lift = Math.sin(Math.PI * p);
    const sx = a.x + (b.x - a.x) * e, sy = a.y + (b.y - a.y) * e - lift * H * .12, sd = a.d + (b.d - a.d) * e;
    const z = b.z * e + lift * sd * 1.2;                                        // rises toward the camera mid-flight
    const f = (camZ - z) / camZ;
    q.copy(TOP).slerp(b.q, e); spin.setFromAxisAngle(Z, (1 - e) * Math.PI * 2);  // one full turn that unwinds exactly on landing
    pivot.quaternion.copy(spin).multiply(q);
    pivot.position.set((sx - W / 2) * f, (H / 2 - sy) * f, z); pivot.scale.setScalar(sd / diam * f);
    if (btn) { const gl = lift * lift * .9; btn.material.emissiveIntensity = gl * 2.2; btn.material.color.copy(btn._c0).lerp(ORANGE, gl * .7); }
    glc.style.opacity = 1;
    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  addEventListener('scroll', tick, { passive: true }); tick();
}
