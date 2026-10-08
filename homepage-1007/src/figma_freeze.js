(async(NAME)=>{
const w=ms=>new Promise(r=>setTimeout(r,ms)), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const ANS='Thursday — as long as Ray ships the sizing-kit flow by Wednesday noon. Ian is revising the charger copy tonight.', CMD='“Remind me to send the sizing-kit build to Mia tomorrow at 9.”';
$$('img').forEach(i=>{i.loading='eager';i.decoding='sync';});
const H=document.body.scrollHeight; for(let y=0;y<H;y+=400){scrollTo(0,y);dispatchEvent(new Event('scroll'));await w(60);}
await w(1500);
const desk=innerWidth>1100, how0=document.getElementById('how');
if(desk){ for(let i=0;i<40&&!/r3ready/.test(how0.className);i++) await w(250); }
await Promise.all($$('img').map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,8000)})));
window.requestAnimationFrame=()=>0; const hi=setTimeout(()=>{},0); for(let i=0;i<=hi+10;i++){clearTimeout(i);clearInterval(i);}
try{window.__lenis&&window.__lenis.destroy()}catch(e){}
$$('main section,#footer,.gridall>.nav').forEach(s=>s.replaceWith(s.cloneNode(true)));
const how=document.getElementById('how');
$$('.pn,.hl,.vl,.sqr,.rowline,.bgimg,.lazy,.orbit,.a-bubble,.reveal').forEach(e=>e.classList.add('in'));
$$('#community .qb').forEach((b,i)=>{b.classList.add('shown','said');b.classList.toggle('on',i===0);});
$$('.r3-ph.a2').forEach(a=>{a.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.classList.contains('s2')));a.querySelectorAll('.rw,.ins').forEach(e=>e.classList.add('in'));a.querySelectorAll('.s2 .tb').forEach((t,i)=>t.classList.toggle('on',i===1));});
$$('.r3-ph.a3').forEach(a=>{a.classList.remove('holding');const q=a.querySelector('q');if(q)q.textContent=CMD;const h=a.querySelector('.hold');h&&h.classList.remove('on');const s=a.querySelector('.send');if(s){s.classList.add('hot');s.textContent='Sent';}const t=a.querySelector('.think');t&&t.classList.remove('in');a.querySelectorAll('.res').forEach(r=>r.classList.add('in'));});
$$('.r3-ph.a4').forEach(a=>{const p=a.querySelector('.pull');p&&p.classList.add('in','done');const t=a.querySelector('.typ');if(t)t.textContent=ANS;a.querySelectorAll('.cite,.mcp').forEach(e=>e.classList.add('in'));});
$$('.r3m-ring .r3-pill').forEach(p=>{p.classList.add('on');const t=p.querySelector('.t');if(t)t.textContent='REC 00:12';});
$$('.r3m-ring .r3-ripple').forEach(r=>r.classList.remove('on'));
if(desk&&how){ const ov=how.querySelector('.stage>.r3'); ov&&ov.remove(); const pics=$$('.stage>.pn.pic',how);
  pics.forEach((p,k)=>{ if(k>0) p.classList.add('appon'); });
  const im=pics[0].querySelector('img'); if(im){ im.src='img3/how-ring.webp'; im.style.cssText='visibility:visible;opacity:1;filter:none;transform:none;object-fit:contain;position:absolute;inset:14%;width:72%;height:72%'; }
  pics[0].querySelectorAll('.r3-bp,.pic-cap').forEach(e=>e.remove()); pics[0].style.background='#fff';
  $$('.stage>.pn:not(.pic)',how).forEach(t=>{t.style.opacity='1';}); how.style.height='100vh'; }
const hw=document.getElementById('hardware'); if(hw) hw.classList.remove('hw3d');
$$('canvas').forEach(c=>c.remove());
$$('*').forEach(e=>{const c=getComputedStyle(e);if(c.transitionDuration!=='0s')e.style.transition='none';if(c.animationName!=='none'&&!e.closest('.marquee'))e.style.animation='none';});
$$('.r3-ph').forEach(ph=>{const k=parseFloat(getComputedStyle(ph).scale)||1;ph.style.opacity='1';ph.style.translate='none';ph.style.scale='none';ph.style.zoom=String(k);});
$$('section,.stage,#footer').forEach(e=>{const cs=getComputedStyle(e); if(cs.position==='sticky'||cs.position==='fixed'){e.style.position='relative';e.style.top='auto';}});
const ft=document.getElementById('footer'); if(ft){ft.style.position='relative';ft.style.visibility='visible';ft.querySelectorAll('.pn').forEach(p=>{p.style.translate='none';p.style.opacity='1';});}
$$('[style]').forEach(e=>{ if(e.style.translate&&!e.classList.contains('sqr')) e.style.translate='none'; });
const nav=document.querySelector('.gridall>.nav'); nav&&nav.classList.remove('away','bar','menu-open');
$$('[style]').forEach(e=>{ if(e.style.visibility==='hidden') e.style.visibility='visible'; });
if(nav){ nav.style.position='absolute'; }
$$('.nav-hot,script,noscript').forEach(e=>e.remove());
scrollTo(0,0); await w(300);
const html='<!doctype html>\n'+document.documentElement.outerHTML; const r=await fetch('http://127.0.0.1:8734/'+NAME,{method:'POST',body:html});
return [NAME,innerWidth,document.body.scrollHeight,html.length,r.status];
})
