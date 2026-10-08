/* VOCCI · round 0928 motion (vanilla; Lenis optional) — see docs/motion.md for the per-section brief */
(function(){
  var doc=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');
  var main=document.querySelector('main.page');

  /* nav out of the hero so it can be fixed above every section */
  var nav=document.querySelector('#hero .nav'); if(nav){ main.insertBefore(nav, main.firstChild); }

/* 1007 · text motion removed (content must be readable without JS timing, for crawlers) */
  /* mono labels decode from 0/1 */
  function decode(el){
    if(reduce||el.dataset.decoded) return; el.dataset.decoded=1;
    var tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[]; while(tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach(function(n){ var target=n.textContent; if(!target.trim()) return; var chars=Array.from(target), delays=chars.map(function(){return Math.random()*420}), start=performance.now();
      var ok=function(c){return /[\p{L}\p{N}]/u.test(c)};
      (function tick(now){ var done=true; n.textContent=chars.map(function(c,i){ if(!ok(c)) return c; var t=now-start-delays[i]; if(t>320) return c; done=false; return Math.random()<.5?'0':'1'; }).join(''); if(!done) requestAnimationFrame(tick); })(start);
    });
  }
  

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; var el=e.target; el.classList.add('in'); io.unobserve(el);  }); },{threshold:.35,rootMargin:'0px 0px -4% 0px'});
  function observeAll(){
    document.querySelectorAll('.stage').forEach(function(st){ io.observe(st);
      var k=0; Array.prototype.forEach.call(st.querySelectorAll('.pn'),function(p){ if(!p.style.getPropertyValue('--dl')) p.style.setProperty('--dl',(k*0.1)+'s'); k++; io.observe(p); });
    });
    document.querySelectorAll('.split').forEach(function(el){ io.observe(el); });
  }

  /* preloader */
  var tx=document.getElementById('tx');
  function start(){ nav&&nav.classList.add('in'); observeAll(); }
  if(reduce||!tx){ tx&&tx.remove(); start(); } else { setTimeout(start,350); setTimeout(function(){ tx.style.display='none'; },1400); }
  /* leave: curtain closes before following an external link */
  document.querySelectorAll('a[href^="http"]').forEach(function(a){ a.addEventListener('click',function(e){ if(a.target==='_blank'||reduce||!tx) return; e.preventDefault(); tx.style.display='flex'; tx.classList.add('leave'); setTimeout(function(){ location.href=a.href; },700); }); });

  /* parallax on backgrounds */
  var bgs=Array.prototype.slice.call(document.querySelectorAll('.stage>.bgimg:not(.blur), .pn.pic.sharp>img')), ticking=false;
  function parallax(){ ticking=false; if(innerWidth<=700) return; var vh=innerHeight;
    bgs.forEach(function(img){ if(img.closest('#hero')||img.closest('#breather')) return; var r=img.parentElement.getBoundingClientRect(); if(img.parentElement.classList.contains('sharp')){ if(img.closest('#why')||img.closest('#why-b')) return; var q=((r.top+r.height/2)-vh/2)/(vh+r.height); img.style.translate='0 '+(-q*8).toFixed(2)+'%'; return; } if(r.bottom<0||r.top>vh) return; var p=((r.top+r.height/2)-vh/2)/(vh+r.height); var s=img.closest('#hero')&&!img.closest('.stage').classList.contains('in')?' scale(1.08)':''; img.style.translate='0 '+(-p*8).toFixed(2)+'%'; }); }
  function onScroll(){ if(!ticking){ticking=true;requestAnimationFrame(parallax);} }
  if(!reduce){ addEventListener('scroll',onScroll,{passive:true}); addEventListener('resize',onScroll); setTimeout(parallax,50); }

  /* MCP orbit · icons and connector lines radiate from the ring; slow orbit, icons stay upright */
  var orbit=document.querySelector('.orbit');
  if(orbit){
    var svg=orbit.querySelector('.orb-lines'), ais=Array.prototype.slice.call(orbit.querySelectorAll('.ai')), theta=0;
    var NS='http://www.w3.org/2000/svg'; var lines=ais.map(function(){var l=document.createElementNS(NS,'line');svg.appendChild(l);return l;});
    var rings=[1,2].map(function(){var c=document.createElementNS(NS,'circle');svg.insertBefore(c,svg.firstChild);return c;});
    function frame(){
      var W=orbit.clientWidth,H=orbit.clientHeight; if(!W){requestAnimationFrame(frame);return;}
      var cs=getComputedStyle(orbit), cx=parseFloat(cs.getPropertyValue('--cx'))/100*W, cy=parseFloat(cs.getPropertyValue('--cy'))/100*H;
      var R={1:parseFloat(cs.getPropertyValue('--r1'))*W,2:parseFloat(cs.getPropertyValue('--r2'))*W};
      rings.forEach(function(c,i){c.setAttribute('cx',cx);c.setAttribute('cy',cy);c.setAttribute('r',R[i+1]);});
      ais.forEach(function(el,i){ el.style.setProperty('--i',i); lines[i].style.setProperty('--i',i); var a=(parseFloat(el.dataset.a)+theta)*Math.PI/180, r=R[el.dataset.r]; var x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*0.86;
        el.style.translate=(x-cx)+'px '+(y-cy)+'px';
        var l=lines[i]; l.setAttribute('x1',cx);l.setAttribute('y1',cy);l.setAttribute('x2',x);l.setAttribute('y2',y); l.style.setProperty('--len',Math.hypot(x-cx,y-cy)); });
      if(!reduce) theta+=0.02; requestAnimationFrame(frame);
    }
    frame();
  }

  /* sangar-style scrubs · hero sinks under the page, footer surfaces beneath the FAQ */
  var hero=document.getElementById('hero'), heroPn=hero&&hero.querySelector('.pn'), heroImg=hero&&hero.querySelector('.bgimg'), heroImgs=hero?Array.prototype.slice.call(hero.querySelectorAll('.stage>.bgimg')):[], faq=document.getElementById('faq'), foot=document.getElementById('footer');
  /* same cover as hero → section 2: Where the ring earns its place pins, How it works slides over it */
  var s2=document.getElementById('scenes2'), how=document.getElementById('how'), s2Img=s2&&s2.querySelector('.stage>.bgimg'), s2Pn=s2?Array.prototype.slice.call(s2.querySelectorAll('.stage>.pn')):[];
  function scrub(){
    if(hero) hero.style.visibility=scrollY>hero.offsetHeight+20?'hidden':'visible';
    if(faq&&foot) foot.style.visibility=faq.getBoundingClientRect().bottom<innerHeight+40?'visible':'hidden';   // phones too: the sticky footer must not show through sections above it
    if(innerWidth<=700) return;
    if(hero){ var p=Math.min(1,Math.max(0,scrollY/hero.offsetHeight));  if(heroPn&&heroPn.classList.contains('in')){ if(p>0) heroPn.classList.add('driven'); heroPn.style.translate='0 '+(p*140)+'px';heroPn.style.opacity=1-p*1.4;} heroImgs.forEach(function(im){ im.style.filter='brightness('+(1-p*.45)+')'; im.style.scale=String(1+p*.12); }); }
    if(s2&&how){ var hr=how.getBoundingClientRect(), sr=s2.getBoundingClientRect(); s2.style.top=Math.min(0,innerHeight-s2.offsetHeight)+'px'; s2.style.visibility=hr.top<-20?'hidden':'visible'; var p2=Math.min(1,Math.max(0,(sr.bottom-hr.top)/sr.height)); s2Pn.forEach(function(pn){ if(!pn.classList.contains('in')) return; if(p2>0) pn.classList.add('driven'); pn.style.translate='0 '+(p2*140)+'px'; pn.style.opacity=1-p2*1.4; }); if(s2Img){s2Img.style.filter='brightness('+(1-p2*.45)+')';s2Img.style.scale=String(1+p2*.12);} }
    if(faq&&foot){ var fb=faq.getBoundingClientRect().bottom, fh=foot.offsetHeight; foot.style.visibility=fb<innerHeight+40?'visible':'hidden'; var _u=1, q=Math.min(1,Math.max(0,(innerHeight-fb)/fh)); foot.querySelectorAll('.pn').forEach(function(pn,i){ if(q>0&&pn.classList.contains('in')) pn.classList.add('driven'); pn.style.translate='0 '+((1-q)*(-90-i*12))+'px'; pn.style.opacity=.25+q*.75; }); }
  }
  var br=document.getElementById('breather'), brImg=br&&br.querySelector('.bgimg'), brPn=br&&br.querySelector('.pn'), brSt=br&&br.querySelector('.stage');
  function breathe(){ if(!brImg||innerWidth<=700) return; var r=br.getBoundingClientRect(), travel=br.offsetHeight-brSt.offsetHeight; var p=Math.min(1,Math.max(0,(-r.top+ (innerHeight-brSt.offsetHeight)/2)/travel)); var e=1-Math.pow(1-p,2);
    brImg.style.width=(25+75*e)+'%'; brImg.style.height=(50+50*e)+'%'; if(brPn) brPn.classList.toggle('pending',e<0.92); }
  addEventListener('scroll',function(){scrub();requestAnimationFrame(breathe);},{passive:true}); setTimeout(function(){scrub();breathe();},60); window.__scrub=scrub;

  /* smooth scroll + anchors */
  function go(t){ if(window.__lenis) window.__lenis.scrollTo(t,{offset:0,duration:1.4}); else t.scrollIntoView({behavior:'smooth'}); }
  if(window.Lenis&&!reduce){ var lenis=new Lenis({duration:1.15,smoothWheel:true}); window.__lenis=lenis; (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0); }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener('click',function(e){ var id=a.getAttribute('href'); if(id.length<2) return; var t=document.querySelector(id); if(!t) return; e.preventDefault(); go(t); }); });

  /* prototypes · 8-second loops, only while in view */
  document.querySelectorAll('.proto').forEach(function(pr){
    var kind=pr.dataset.proto, timer=pr.querySelector('.ap-timer b'), typeEl=pr.querySelector('.pr-type'), q='What did the supplier promise on Tuesday?', t0=null, raf=null, running=false, state=pr.querySelector('.ap-cap');
    function setStep(k){ pr.classList.remove('s1','s2','s3','s4'); if(k) pr.classList.add('s'+k); }
    function frame(now){ if(!running) return; var el=((now-t0)/1000)%5.5; var k=el<1.2?1:el<3.2?2:el<4.3?3:4; if(!pr.classList.contains('s'+k)){ setStep(k);  }
      if(kind==='rec'){ if(timer){ if(k<4) timer.textContent='00:'+String(Math.floor(el*10)).padStart(2,'0'); else timer.textContent='00:43'; if(k===1&&el<0.4) timer.textContent='00:00'; }
        if(state) state.textContent=k===1?'Listening…':k===2?'Recording · click once to highlight':k===3?'Moment highlighted':'Saved to Vocci'; }
      if(kind==='mcp'){ if(typeEl){ var n=k===1?Math.floor(Math.min(1,el/1.1)*q.length):q.length; typeEl.textContent=q.slice(0,n); } }
      raf=requestAnimationFrame(frame); }
    new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting&&!running){ running=true; t0=performance.now(); pr.classList.add('running'); raf=requestAnimationFrame(frame); } else if(!e.isIntersecting&&running){ running=false; cancelAnimationFrame(raf); pr.classList.remove('running'); setStep(0); } }); },{threshold:.3}).observe(pr);
  });

  /* recording widget · live timer */
  var timer=document.querySelector('.ui-timer'); if(timer){ var sec=42*60+17; setInterval(function(){ sec++; var h=String(Math.floor(sec/3600)).padStart(2,'0'),m=String(Math.floor(sec%3600/60)).padStart(2,'0'),x=String(sec%60).padStart(2,'0'); timer.textContent=h+':'+m+':'+x; },1000); }

  /* numbered lists swap the card copy */
  function fade(el,txt){ if(!el||typeof txt!=='string'||!txt||el.textContent===txt) return; el.textContent=txt; el.classList.remove('swapped'); void el.offsetWidth; el.classList.add('swapped'); }
  document.querySelectorAll('ol.pl[data-swap]').forEach(function(list){
    var card=list.closest('.stage'); var items=Array.prototype.slice.call(list.children);
    function set(li){ items.forEach(function(x){ x.classList.toggle('on',x===li); }); var d=li.dataset;
      ['title','copy','quote','src','label'].forEach(function(k){ fade(card.querySelector('[data-'+k+']:not(li)'),d[k]); });
      }
    items.forEach(function(li){ li.tabIndex=0; ['mouseenter','click','focus'].forEach(function(ev){ li.addEventListener(ev,function(){set(li)}); }); });
  });

  /* how it works · steps cycle while in view */
  var how=document.getElementById('how');
  /* desktop: the 3D ring (vendor/how3d.js) drives the steps from scroll instead of the timer */
  var how3d=how&&!reduce&&innerWidth>1100&&matchMedia('(hover:hover)').matches&&(function(){try{return !!document.createElement('canvas').getContext('webgl2');}catch(e){return false;}})();
  if(how3d){ how.classList.add('how3d'); var s3=document.createElement('script'); s3.src='vendor/how3d.js'; s3.onerror=function(){how.classList.remove('how3d');}; document.body.appendChild(s3); }
  /* 1007 · no 3D (phones, tablets, no WebGL2): show stills baked from the desktop 3D sequence instead of the old placeholder photos */
  if(how&&!how3d){ Array.prototype.forEach.call(how.querySelectorAll('.stage>.pn.pic'),function(p,k){ var im=p.querySelector('img'); if(!im) return; im.src='img3/how-static-'+(k+1)+'.jpg'; im.removeAttribute('srcset'); im.alt=['Vocci ring','Vocci app · meeting notes','Vocci Agent · voice command','Claude via Vocci MCP'][k]||''; p.classList.remove('contain','phone'); p.classList.add('still3d'); var hp=document.createElement('div'); hp.className='hp hp'+(k+1); hp.setAttribute('aria-hidden','true'); hp.innerHTML=['<div class="hp-ring"><b class="s" data-at="1"></b></div><span class="hp-pill s" data-at="1"><em></em>Recording</span><span class="hp-tag s" data-at="3">Double-tap · captured</span>','<div class="hp-card"><div class="hp-h s" data-at="0">Product Sync <small>32 min</small></div><div class="hp-chip s" data-at="1">Transcribed</div><p class="s" data-at="2"><b>Mia</b> Launch moves to the 14th.</p><p class="s" data-at="3"><b>Ian</b> I’ll send the deck Friday.</p><div class="hp-note s" data-at="4">Notes · 3 decisions · 2 actions</div></div>','<div class="hp-card"><div class="hp-h s" data-at="0">Vocci Agent</div><div class="hp-mic s" data-at="1"><i></i>Holding to talk…</div><p class="hp-q s" data-at="2">“Remind Ian to send the deck tomorrow.”</p><div class="hp-chip s" data-at="3">Sent</div><div class="hp-note s" data-at="4">Reminder set · Tomorrow 9:00</div></div>','<div class="hp-card"><div class="hp-h s" data-at="0">Claude</div><p class="hp-q s" data-at="1">What did we decide about the launch?</p><div class="hp-chip s" data-at="2">Reading Vocci · Product Sync</div><p class="s" data-at="3">Launch moves to the 14th. Ian sends the deck Friday.</p><div class="hp-note s" data-at="4">via Vocci MCP</div></div>'][k]||''; p.appendChild(hp); });
    /* 1007-c · ~5s looping prototypes, only while visible */
    (function(){ var T=[0,700,1500,2400,3300]; Array.prototype.forEach.call(how.querySelectorAll('.hp'),function(hp){ var els=hp.querySelectorAll('.s'), tm=[], run=false; function cyc(){ tm.forEach(clearTimeout); tm=[]; Array.prototype.forEach.call(els,function(e){ e.classList.remove('on'); }); T.forEach(function(t,i){ tm.push(setTimeout(function(){ Array.prototype.forEach.call(els,function(e){ if(+e.dataset.at===i) e.classList.add('on'); }); },t+150)); }); tm.push(setTimeout(function(){ if(run) cyc(); },5000)); } new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting&&!run){ run=true; cyc(); } else if(!e.isIntersecting&&run){ run=false; tm.forEach(clearTimeout); } }); },{threshold:.4}).observe(hp); }); })();
    Array.prototype.forEach.call(how.querySelectorAll('.stage>.pn.pic'),function(p,k){ p.style.setProperty('--mcol',k+1); });
    Array.prototype.forEach.call(how.querySelectorAll('.stage>.pn:not(.pic)'),function(p,k){ p.style.setProperty('--mcol',k+1); });
    var hst=how.querySelector('.stage'), hint=document.createElement('div'); hint.className='how-hint'; hint.innerHTML='<i class="on"></i><i></i><i></i><i></i>'; hst.parentNode.insertBefore(hint,hst.nextSibling);
    hst.addEventListener('scroll',function(){ var w=hst.scrollWidth/4, k=Math.round(hst.scrollLeft/w); Array.prototype.forEach.call(hint.children,function(d,j){ d.classList.toggle('on',j===k); }); Array.prototype.forEach.call(hst.querySelectorAll(':scope>.pn:not(.pic)'),function(p,j){ p.classList.toggle('on',j===k); }); },{passive:true}); }
  if(how&&!how3d){ var txts=Array.prototype.slice.call(how.querySelectorAll('.pn:not(.pic)')), i=0, t=null;
    function show(k){ i=k; txts.forEach(function(x,j){ x.classList.toggle('on',j===k); }); }
    function play(){ stop(); t=setInterval(function(){ show((i+1)%txts.length); },3200); }
    function stop(){ clearInterval(t); t=null; }
    txts.forEach(function(x,k){ x.addEventListener('mouseenter',function(){stop();show(k)}); x.addEventListener('mouseleave',play); });
    new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){show(0);play();} else stop(); }); },{threshold:.4}).observe(how); }

  /* 0929-u · finishes: pick a finish (click / hover), auto-cycles while on screen; the 3D ring (vendor/how3d.js) follows data-finish */
  (function(){ var sec=document.getElementById('finishes'); if(!sec) return;
    var opts=Array.prototype.slice.call(sec.querySelectorAll('.fn-opt')), imgs=Array.prototype.slice.call(sec.querySelectorAll('.fn-img')), nm=sec.querySelector('.fn-name'), sub=sec.querySelector('.fn-sub'), k=0, t=null, list=sec.querySelector('.fn-list');
    if(!opts.length) return;
    function pick(i){ k=i; var o=opts[i]; opts.forEach(function(x){ x.classList.toggle('on',x===o); }); imgs.forEach(function(im){ im.classList.toggle('on',im.dataset.f===o.dataset.f); });
      if(nm) nm.textContent=o.dataset.name; if(sub) sub.textContent=o.dataset.sub; sec.dataset.finish=o.dataset.f; }
    function play(){ stop(); if(!reduce) t=setInterval(function(){ pick((k+1)%opts.length); },4000); }
    function stop(){ clearInterval(t); t=null; }
    opts.forEach(function(o,i){ o.addEventListener('click',function(){ stop(); pick(i); }); o.addEventListener('mouseenter',function(){ stop(); pick(i); }); });
    list.addEventListener('mouseleave',play);
    new IntersectionObserver(function(es){ es[0].isIntersecting?play():stop(); },{threshold:.4}).observe(sec);
    pick(0); })();

  /* community · owner quotes arrive as chat bubbles (typing dots → quote), then take turns in focus */
  (function(){ var sec=document.getElementById('community'), qb=sec?Array.prototype.slice.call(sec.querySelectorAll('.qb')):[]; if(!qb.length) return; var k=0, t=null;
    function focus(i){ qb.forEach(function(b,j){ b.classList.toggle('on',j===i); }); }
    function arrive(){ qb.forEach(function(b,i){ setTimeout(function(){ b.classList.add('shown'); setTimeout(function(){ b.classList.add('said'); if(i===qb.length-1){ focus(0); t=setInterval(function(){ k=(k+1)%qb.length; focus(k); },3400); } }, reduce?0:900); }, reduce?0:500+i*650); }); }
    qb.forEach(function(b,i){ b.addEventListener('mouseenter',function(){ clearInterval(t); k=i; focus(i); }); });
    new IntersectionObserver(function(es,o){ if(es[0].isIntersecting){ o.disconnect(); arrive(); } },{threshold:.35}).observe(sec); })();

  /* nav · hides while scrolling down, returns on scroll up */
  /* 1007-c · nav: hides on scroll down, reappears immediately on scroll up (no hover zone) */
  (function(){ var last=scrollY, navEl=document.querySelector('.gridall>.nav'); if(!navEl) return;
    function place(){ var y=scrollY; navEl.classList.toggle('bar',y>40); if(y<80) navEl.classList.remove('away'); else if(y>last+4) navEl.classList.add('away'); else if(y<last-4) navEl.classList.remove('away'); if(Math.abs(y-last)>4||y<80) last=y; }
    addEventListener('scroll',place,{passive:true}); place(); })();

/* 1007 · text motion removed (content must be readable without JS timing, for crawlers) */

  /* background layer opacity follows the section at the viewport centre */
  (function(){ var bg=document.getElementById('pagebg'); if(!bg) return; var blocks=document.querySelectorAll('[data-bgop]'); var io3=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) bg.style.setProperty('--pgop',e.target.dataset.bgop); }); },{rootMargin:'-49% 0px -49% 0px',threshold:0}); blocks.forEach(function(b){ io3.observe(b); }); })();

  /* 1007-b · crossing 700 / 1100 px while resizing reloads the page (desktop-only scripts are set up once at load) */
  (function(){ var band=function(w){ return w<=700?0:w<=1100?1:2; }, b0=band(innerWidth), t=null; addEventListener('resize',function(){ clearTimeout(t); t=setTimeout(function(){ if(band(innerWidth)!==b0) location.reload(); },250); }); })();

  /* FAQ accordion */
  document.querySelectorAll('#faq .pn .qn').forEach(function(qn){ var cell=qn.closest('.pn'); var h=qn.nextElementSibling; function tog(){ var open=!cell.classList.contains('open'); cell.classList.toggle('open',open); qn.querySelector('i').textContent=open?'–':'+'; } qn.addEventListener('click',tog); h&&h.addEventListener('click',tog); });
})();
