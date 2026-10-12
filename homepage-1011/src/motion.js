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
    /* 1011 · scenes2 is covered by whatever section follows it (3.0 order), not by #how */
    var s2n=s2&&s2.nextElementSibling;
    if(s2&&s2n){ var hr=s2n.getBoundingClientRect(), sr=s2.getBoundingClientRect(); s2.style.top=Math.min(0,innerHeight-s2.offsetHeight)+'px'; s2.style.visibility=hr.top<-20?'hidden':'visible'; var p2=Math.min(1,Math.max(0,(sr.bottom-hr.top)/sr.height)); s2Pn.forEach(function(pn){ if(!pn.classList.contains('in')) return; if(p2>0) pn.classList.add('driven'); pn.style.translate='0 '+(p2*140)+'px'; pn.style.opacity=1-p2*1.4; }); if(s2Img){s2Img.style.filter='brightness('+(1-p2*.45)+')';s2Img.style.scale=String(1+p2*.12);} }
    if(faq&&foot){ var fb=faq.getBoundingClientRect().bottom, fh=foot.offsetHeight; foot.style.visibility=fb<innerHeight+40?'visible':'hidden'; var _u=1, q=Math.min(1,Math.max(0,(innerHeight-fb)/fh)); foot.querySelectorAll('.pn').forEach(function(pn,i){ if(q>0&&pn.classList.contains('in')) pn.classList.add('driven'); pn.style.translate='0 '+((1-q)*(-90-i*12))+'px'; pn.style.opacity=.25+q*.75; }); }
  }
  var br=document.getElementById('breather'), brImg=br&&br.querySelector('.bgimg'), brPn=br&&br.querySelector('.pn'), brSt=br&&br.querySelector('.stage');
  function breathe(){ return; /* 1007-m · breather growth removed */ if(!brImg||innerWidth<=700) return; var r=br.getBoundingClientRect(), travel=br.offsetHeight-brSt.offsetHeight; var p=Math.min(1,Math.max(0,(-r.top+ (innerHeight-brSt.offsetHeight)/2)/travel)); var e=1-Math.pow(1-p,2);
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
    /* 1007-n · reserve the tallest text per slot so swapping never moves the list under the cursor (stops the hover loop) */
    function lock(){ ['title','copy','quote','src','label'].forEach(function(k){ var el=card.querySelector('[data-'+k+']:not(li)'); if(!el) return; var t0=el.textContent, h=0; el.style.minHeight=''; items.forEach(function(li){ if(li.dataset[k]){ el.textContent=li.dataset[k]; h=Math.max(h,el.offsetHeight); } }); el.textContent=t0; el.style.minHeight=h+'px'; }); }
    lock(); addEventListener('resize',lock); document.fonts&&document.fonts.ready.then(lock);
    function set(li){ if(li.classList.contains('on')) return; items.forEach(function(x){ x.classList.toggle('on',x===li); }); var d=li.dataset;
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
  if(how&&!how3d){ Array.prototype.forEach.call(how.querySelectorAll('.stage>.pn.pic'),function(p,k){ var im=p.querySelector('img'); if(!im) return; im.loading='eager'; im.src=k===0?'img3/how-ring.webp':'img3/how-static-'+(k+1)+'.jpg'; im.removeAttribute('srcset'); im.alt=['Vocci ring','Vocci app · meeting notes','Vocci Agent · voice command','Claude via Vocci MCP'][k]||''; p.classList.remove('contain','phone'); p.classList.add('still3d'); });
    /* 1007-d · ~5s loops built from the desktop app screens + ring pill (same markup/CSS as vendor/how3d.js) */
    (function(){ var APP=[
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
      '<div class="inp">Reply…</div></div>']; var CMD='“Remind me to send the sizing-kit build to Mia tomorrow at 9.”', ANS='Thursday — as long as Ray ships the sizing-kit flow by Wednesday noon. Ian is revising the charger copy tonight.';
      var cl=function(v){ return v<0?0:v>1?1:v; }, band=function(v,a,b){ return cl((v-a)/(b-a)); }, $=function(r,q){ return r.querySelector(q); }, $$=function(r,q){ return Array.prototype.slice.call(r.querySelectorAll(q)); };
      var tog=function(el,c,on){ if(el&&el.classList.contains(c)!==on) el.classList.toggle(c,on); }, txt=function(el,t){ if(el&&el.textContent!==t) el.textContent=t; };
      var pics=how.querySelectorAll('.stage>.pn.pic'), loops=[];
      var o=document.createElement('div'); o.className='r3m-ring'; o.innerHTML='<i class="r3-ripple"></i><i class="r3-ripple"></i><div class="r3-pill" data-s="0"><i class="dot"></i><span class="t">REC 00:00</span><b class="wv"><i></i><i></i><i></i><i></i><i></i></b><b class="bar"><i></i></b></div>'; pics[0]&&pics[0].appendChild(o);
      loops.push({el:pics[0], f:function(q){ var pl=$(o,'.r3-pill'); tog(pl,'on',q>.06); $$(o,'.r3-ripple').forEach(function(r){ tog(r,'on',q>.06&&q<.9); }); var hi=q>.55&&q<.72; if(hi!==pl._hi){ pl._hi=hi; if(hi){ pl.classList.remove('pop'); void pl.offsetWidth; pl.classList.add('pop'); } } pl.dataset.s=hi?'3':'0'; txt($(pl,'.t'),hi?'HIGHLIGHT':'REC 00:'+String(Math.floor(band(q,.1,.95)*42)+3).padStart(2,'0')); }});
      [1,2,3].forEach(function(k){ var pic=pics[k]; if(!pic) return; var d=document.createElement('div'); d.className='r3-app r3m'; d.setAttribute('aria-hidden','true'); d.innerHTML=APP[k-1]; pic.appendChild(d); pic.classList.add('appon');
        var a=d.firstChild, f;
        if(k===1) f=function(q){ var sp=$$(a,'.rw'); tog($(a,'.s1'),'on',q<.3); tog($(a,'.s2'),'on',q>=.3&&q<.8); tog($(a,'.s3'),'on',q>=.8); tog($(a,'.cta'),'busy',q>.14); txt($(a,'.cta'),q>.14?'Transcribing…':'Transcribe'); $(a,'.trk i').style.transform='scaleX('+cl(q/.3).toFixed(3)+')'; var n=Math.floor(band(q,.32,.66)*5.99); sp.forEach(function(e,i){ tog(e,'in',i<n); }); $$(a,'.ins').forEach(function(e){ tog(e,'in',q>.66); }); $$(a,'.s2 .tb').forEach(function(e,i){ tog(e,'on',i===(q>.66?1:0)); }); };
        if(k===2) f=function(q){ var h=band(q,.05,.45); txt($(a,'q'),CMD.slice(0,Math.round(CMD.length*h))); tog($(a,'.hold'),'on',q<.55); tog(a,'holding',q>=.05&&q<.45); tog($(a,'.send'),'hot',q>=.45); txt($(a,'.send'),q>=.55?'Sent':'Send to Agent'); tog($(a,'.think'),'in',q>=.55&&q<.62); tog($(a,'.res'),'in',q>=.62); tog($(a,'.r2'),'in',q>=.7); };
        if(k===3) f=function(q){ var r=band(q,0,.9); tog($(a,'.pull'),'in',r>.05); tog($(a,'.pull'),'done',r>.25); txt($(a,'.typ'),ANS.slice(0,Math.round(ANS.length*band(r,.25,.8)))); tog($(a,'.cite'),'in',r>.8); tog($(a,'.mcp'),'in',r>.9); };
        loops.push({el:pic, f:f}); });
      function fit(){ $$(how,'.r3m .r3-ph').forEach(function(ph){ var c=ph.parentNode.parentNode; ph.style.setProperty('--appk',Math.min(c.clientWidth/310,c.clientHeight/500).toFixed(3)); }); } fit(); addEventListener('resize',fit);
      loops.forEach(function(L){ var t0=0, raf=0, vis=false; L.f(0); function tick(now){ if(!t0) t0=now; L.f(((now-t0)%9000)/9000); raf=vis?requestAnimationFrame(tick):0; }
        new IntersectionObserver(function(es){ es.forEach(function(e){ vis=e.isIntersecting; if(vis&&!raf){ t0=0; raf=requestAnimationFrame(tick); } }); },{threshold:.35}).observe(L.el); });
    })();
    Array.prototype.forEach.call(how.querySelectorAll('.stage>.pn.pic'),function(p,k){ p.style.setProperty('--mcol',k+1); });
    Array.prototype.forEach.call(how.querySelectorAll('.stage>.pn:not(.pic)'),function(p,k){ p.style.setProperty('--mcol',k+1); });
    var hst=how.querySelector('.stage'), hint=document.createElement('div'); hint.className='how-hint'; hint.innerHTML='<button class="hh-b prev" aria-label="Previous step" disabled><svg viewBox="0 0 20 20"><path d="M12 4l-6 6 6 6"/></svg></button><span class="hh-d"><i class="on"></i><i></i><i></i></span><button class="hh-b next" aria-label="Next step"><svg viewBox="0 0 20 20"><path d="M8 4l6 6-6 6"/></svg></button>'; hst.parentNode.insertBefore(hint,hst.nextSibling);
    var go=function(d){ var w=hst.scrollWidth/3, k=Math.max(0,Math.min(2,Math.round(hst.scrollLeft/w)+d)); hst.scrollTo({left:hst.querySelectorAll(':scope>.pn.pic:not(.h-skip)')[k].offsetLeft-parseFloat(getComputedStyle(hst).paddingLeft),behavior:'smooth'}); };
    hint.querySelector('.prev').addEventListener('click',function(){ go(-1); }); hint.querySelector('.next').addEventListener('click',function(){ go(1); });
    Array.prototype.forEach.call(hint.querySelectorAll('.hh-d i'),function(d,j){ d.addEventListener('click',function(){ go(j-Math.round(hst.scrollLeft/(hst.scrollWidth/3))); }); });
    hst.addEventListener('scroll',function(){ var w=hst.scrollWidth/3, k=Math.round(hst.scrollLeft/w); hint.querySelector('.prev').disabled=k===0; hint.querySelector('.next').disabled=hst.scrollLeft+hst.clientWidth>=hst.scrollWidth-4; Array.prototype.forEach.call(hint.querySelectorAll('.hh-d i'),function(d,j){ d.classList.toggle('on',j===k); }); Array.prototype.forEach.call(hst.querySelectorAll(':scope>.pn:not(.pic):not(.h-skip)'),function(p,j){ p.classList.toggle('on',j===k); }); },{passive:true}); }
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

/* 1007-d · phone structure: every section reads title → image → its text, so pictures never look like they belong to the neighbour */
(function(){ if(innerWidth>700) return;
  var Q=function(id){ var s=document.getElementById(id); return s?Array.prototype.slice.call(s.querySelectorAll('.stage>*')):[]; };
  var head=function(e){ return !e.classList.contains('pic')&&!e.classList.contains('bgimg')&&e.querySelector('h2'); };
  ['why','scenes2','privacy','hardware'].forEach(function(id){ Q(id).forEach(function(e){ e.style.order=head(e)?0:(e.classList.contains('pic')||e.classList.contains('bgimg'))?1:2; }); });
  var sc=Q('scenes'), pics=sc.filter(function(e){ return e.classList.contains('pic'); }), txt=sc.filter(function(e){ return !e.classList.contains('pic')&&!head(e)&&e.classList.contains('pn'); });
  sc.forEach(function(e){ if(head(e)) e.style.order=0; }); pics.forEach(function(e,i){ e.style.order=2*i+1; }); (txt.length===pics.length?txt:[]).forEach(function(e,i){ e.style.order=2*i+2; });
  Q('finishes').forEach(function(e){ e.style.order=e.classList.contains('fn-stage')?1:e.classList.contains('fn-spec')?2:e.classList.contains('fn-list')?3:0; });
  var how=document.getElementById('how'); if(how&&!how.querySelector('.how-head')){ var h=document.createElement('div'); h.className='how-head'; var ov=how.querySelector('.how-ov'); h.innerHTML=ov?'<h2>'+ov.querySelector('h3').textContent+'</h2><p>'+ov.querySelector('p').textContent+'</p>':'<h2>How it works.</h2>'; how.insertBefore(h,how.firstChild); }
})();

/* 1007-e · phone nav: hamburger opens the section links */
(function(){ var nav=document.querySelector('.gridall>.nav'), bar=nav&&nav.querySelector('.navbar'), cart=bar&&bar.querySelector('.cart'); if(!cart||/nav[23]/.test(nav.className)) return;
  var b=document.createElement('button'); b.className='burger'; b.setAttribute('aria-label','Menu'); b.setAttribute('aria-expanded','false'); b.innerHTML='<i></i><i></i>'; bar.insertBefore(b,cart);
  /* 1011 · the phone menu lists the dropdown groups with their links */
  var m=document.createElement('div'); m.className='nav-menu'; Array.prototype.forEach.call(bar.querySelectorAll('.nd'),function(g){ var h=document.createElement('h6'); h.textContent=g.querySelector('.nd-t span').textContent; m.appendChild(h); Array.prototype.forEach.call(g.querySelectorAll('.nd-m a'),function(a){ var x=document.createElement('a'); x.href=a.getAttribute('href'); x.textContent=a.querySelector('span').textContent; m.appendChild(x); }); }); nav.appendChild(m);
  var set=function(on){ nav.classList.toggle('menu-open',on); b.setAttribute('aria-expanded',on); }; b.addEventListener('click',function(){ set(!nav.classList.contains('menu-open')); }); m.addEventListener('click',function(e){ if(e.target.tagName==='A') set(false); }); addEventListener('scroll',function(){ if(nav.classList.contains('away')) set(false); },{passive:true});
})();

/* 1011 · nav dropdowns: hover on desktop, tap to open on touch screens */
(function(){ var groups=Array.prototype.slice.call(document.querySelectorAll('.gridall>.nav .nd')); if(!groups.length) return;
  var close=function(x){ groups.forEach(function(g){ if(g!==x){ g.classList.remove('open'); g.querySelector('.nd-t').setAttribute('aria-expanded','false'); } }); };
  groups.forEach(function(g){ var t=g.querySelector('.nd-t'); t.addEventListener('click',function(e){ e.stopPropagation(); var on=!g.classList.contains('open'); close(g); g.classList.toggle('open',on); t.setAttribute('aria-expanded',on); });
    g.addEventListener('mouseleave',function(){ g.classList.remove('open'); t.setAttribute('aria-expanded','false'); }); });
  document.addEventListener('click',function(){ close(null); }); addEventListener('keydown',function(e){ if(e.key==='Escape') close(null); });
})();

/* 1011 · colours: finish tabs + view switch on one full-screen image; finishes cycle while on screen until someone picks one */
(function(){ var sec=document.getElementById('colors'); if(!sec) return; var st=sec.querySelector('.stage');
  var fs=Array.prototype.slice.call(sec.querySelectorAll('.fnx-f')), vs=Array.prototype.slice.call(sec.querySelectorAll('.fnx-v')), im=Array.prototype.slice.call(sec.querySelectorAll('.fnx-img'));
  var f='lumen', v='wear', t=null, held=false, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(){ im.forEach(function(i){ var on=i.dataset.f===f&&i.dataset.v===v; i.classList.toggle('on',on); if(on) i.loading='eager'; });
    fs.forEach(function(b){ var on=b.dataset.f===f; b.classList.toggle('on',on); b.setAttribute('aria-selected',on); }); var dsc=sec.querySelector('.fnx-desc'), cur=sec.querySelector('.fnx-f[data-f="'+f+'"]'); if(dsc&&cur&&cur.dataset.desc){ dsc.innerHTML='<b></b> '; dsc.firstChild.textContent=cur.querySelector('b').textContent; dsc.appendChild(document.createTextNode(cur.dataset.desc)); }
    vs.forEach(function(b){ var on=b.dataset.v===v; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); }); st.dataset.view=v; }
  function stop(){ clearInterval(t); t=null; }
  function play(){ stop(); if(held||reduce) return; t=setInterval(function(){ var k=0; fs.forEach(function(b,i){ if(b.dataset.f===f) k=i; }); f=fs[(k+1)%fs.length].dataset.f; show(); },4500); }
  fs.forEach(function(b){ b.addEventListener('click',function(){ held=true; stop(); f=b.dataset.f; show(); }); });
  vs.forEach(function(b){ b.addEventListener('click',function(){ held=true; stop(); v=b.dataset.v; show(); }); });
  im.forEach(function(i){ if(i.dataset.v==='wear') i.loading='eager'; });
  new IntersectionObserver(function(es){ es[0].isIntersecting?play():stop(); },{threshold:.4}).observe(sec); show(); })();

/* 1011 · creator cards: arrows step one card at a time */
(function(){ var sec=document.getElementById('kol'); if(!sec) return; var row=sec.querySelector('.kol-row'), p=sec.querySelector('.kol-b.prev'), n=sec.querySelector('.kol-b.next'); if(!row||!p||!n) return;
  var step=function(d){ var c=row.querySelector('.kol-card'); row.scrollBy({left:d*(c?c.offsetWidth:row.clientWidth/3),behavior:'smooth'}); };
  var upd=function(){ p.disabled=row.scrollLeft<4; n.disabled=row.scrollLeft+row.clientWidth>=row.scrollWidth-4; };
  p.addEventListener('click',function(){ step(-1); }); n.addEventListener('click',function(){ step(1); }); row.addEventListener('scroll',upd,{passive:true}); addEventListener('resize',upd); upd(); })();

/* 1011 · FAQ accordion: one answer open at a time */
(function(){ var qs=Array.prototype.slice.call(document.querySelectorAll('#faq .fq')); if(!qs.length) return;
  qs.forEach(function(q){ var b=q.querySelector('.fq-q'); b.addEventListener('click',function(){ var on=!q.classList.contains('open'); qs.forEach(function(x){ x.classList.remove('open'); x.querySelector('.fq-q').setAttribute('aria-expanded','false'); }); q.classList.toggle('open',on); b.setAttribute('aria-expanded',on); }); }); })();

/* 1011-b · screen 3: record → highlight → stop, looping while on screen (drives the sound rings, the band diagram and the step list) */
(function(){ var sec=document.getElementById('why'), st=sec&&sec.querySelector('.stage.rec3'); if(!st) return;
  var rows=Array.prototype.slice.call(st.querySelectorAll('.rec-card[data-ch="0"] .rec-steps li')), dur=[3200,2600,2200,900], s=0, t=null;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ st.dataset.s='0'; rows[0].classList.add('on'); return; }
  function set(k){ s=k; st.dataset.s=k; rows.forEach(function(r,i){ r.classList.remove('on'); if(i===k){ void r.offsetWidth; r.classList.add('on'); } });
    var b=st.querySelector('.rec-band .fg'); if(b){ b.style.animation='none'; void b.getBoundingClientRect(); b.style.animation=''; }
    t=setTimeout(function(){ set((s+1)%4); },dur[k]); }
  new IntersectionObserver(function(es){ if(es[0].isIntersecting){ if(!t) set(0); } else { clearTimeout(t); t=null; } },{threshold:.35}).observe(st); })();

/* 1011-c · screen 3 audio ring: radial level bars around the ring + glowing ripples; follows the record / highlight / stop steps */
(function(){ var st=document.querySelector('#why .stage.rec3'), cv=st&&st.querySelector('.rec-waves canvas'); if(!cv) return;
  var cx=cv.getContext('2d'), dpr=Math.min(2,window.devicePixelRatio||1), S=0, N=120, lv=new Float32Array(N), env=0, flash=0, ripples=[], last=0, raf=null, lastS=null, spawn=0, rot=0;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){ var r=cv.getBoundingClientRect(); S=r.width; cv.width=Math.round(S*dpr); cv.height=Math.round(S*dpr); }
  function voice(i,t){ var a=i/N*Math.PI*2; return .5+.5*Math.sin(t*2.1+a*3)*Math.sin(t*1.3-a*5+1.7)+.35*Math.sin(t*5.7+a*11)*Math.sin(t*.9+a*2); }
  function frame(now){ raf=requestAnimationFrame(frame); var dt=Math.max(0,Math.min(.05,(now-(last||now))/1000)), t=now/1000; last=now; if(!S) size(); if(S<60) { S=0; return; }
    var s=st.dataset.s, ch=st.dataset.ch||'0', v=st.dataset.v, target=ch==='0'?(s==='0'?1:s==='1'?1:s==='2'?.12:0):ch==='1'?(v==='1'?.75:v==='0'?.3:.1):.06; if(ch!=='0') s='x';
    if(s!==lastS){ if(s==='1') flash=1; if(s==='0') ripples.push({r:0,a:1}); lastS=s; }
    env+=(target-env)*Math.min(1,dt*(target>env?3:1.6)); flash=Math.max(0,flash-dt*1.1); rot+=dt*.12;
    spawn-=dt; if(env>.5&&spawn<=0){ ripples.push({r:0,a:.9}); spawn=1.15; }
    var W=S*dpr, c=W/2, r0=W*.205, L=W*.12; cx.clearRect(0,0,W,W); cx.save(); cx.translate(c,c);
    // ripples
    ripples.forEach(function(p){ p.r+=dt*.32; p.a=Math.max(0,1-p.r); var R=Math.max(0,r0*(1+p.r*1.05)); cx.beginPath(); cx.arc(0,0,R,0,7); cx.lineWidth=(1.4+2*(1-p.r))*dpr; cx.strokeStyle='rgba(28,28,32,'+(.32*p.a*Math.max(env,.15))+')'; cx.shadowBlur=0; cx.stroke(); });
    ripples=ripples.filter(function(p){ return p.a>0; });
    // soft halo
    var ha=Math.min(.5,.16*env+.4*flash), g=cx.createRadialGradient(0,0,0,0,0,r0*1.7); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.52,'rgba(255,255,255,0)'); g.addColorStop(.62,'rgba(255,255,255,'+ha+')'); g.addColorStop(1,'rgba(255,255,255,0)'); cx.shadowBlur=0; cx.fillStyle=g; cx.beginPath(); cx.arc(0,0,r0*1.6,0,7); cx.fill();
    // level bars
    cx.lineCap='round'; cx.shadowBlur=0;
    for(var i=0;i<N;i++){ var v=voice(i,t)*env + flash*(.6+.4*Math.sin(i*1.7)); lv[i]+=(v-lv[i])*Math.min(1,dt*14); var a=i/N*Math.PI*2+rot, len=2*dpr+L*Math.max(0,lv[i]), ca=Math.cos(a), sa=Math.sin(a);
      cx.beginPath(); cx.moveTo(ca*r0,sa*r0); cx.lineTo(ca*(r0+len),sa*(r0+len)); cx.lineWidth=2*dpr; var al=.22+.6*Math.min(1,lv[i]+.1); cx.strokeStyle=flash>.05?'rgba(244,117,70,'+(al*flash+ (1-flash)*0)+')':'rgba(28,28,32,'+al+')'; if(flash>.05){ cx.stroke(); cx.strokeStyle='rgba(28,28,32,'+(al*(1-flash))+')'; } cx.stroke(); }
    // fine orbit of dots inside the bars
    cx.shadowBlur=0; cx.fillStyle='rgba(28,28,32,'+(.25+.3*env)+')'; for(var k=0;k<72;k++){ var b=k/72*Math.PI*2-rot*1.6; cx.beginPath(); cx.arc(Math.cos(b)*(r0-7*dpr),Math.sin(b)*(r0-7*dpr),1.1*dpr,0,7); cx.fill(); }
    cx.restore();
    if(reduce){ cancelAnimationFrame(raf); raf=null; } }
  addEventListener('resize',function(){ S=0; }); window.__recFrame=frame; /* test hook: draw one frame at time t (ms) */
  new IntersectionObserver(function(es){ if(es[0].isIntersecting){ if(!raf){ last=0; raf=requestAnimationFrame(frame); } } else if(raf){ cancelAnimationFrame(raf); raf=null; } },{threshold:0}).observe(st); })();

/* 1011-d · chapter 3–5: scroll position picks Record / Ask / Connect; the rail fills as you go; each chapter loops its own small story */
(function(){ var sec=document.getElementById('why'), st=sec&&sec.querySelector('.stage.rec3'); if(!st||!sec.classList.contains('chapter')) return;
  var bar=st.querySelector('.ch-bar i'), tabs=Array.prototype.slice.call(st.querySelectorAll('.ch-rail button')), ch=-1, tm=null, raf=null, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards=Array.prototype.slice.call(st.querySelectorAll('.rec-card'));
  function rowsOf(k){ return Array.prototype.slice.call(cards[k].querySelectorAll('.rec-steps li')); }
  function mark(k,i){ rowsOf(k).forEach(function(r,j){ r.classList.remove('on'); if(j===i){ void r.offsetWidth; r.classList.add('on'); } }); }
  var tx=st.querySelector('.ask-tx'), Q='Send Maya the new launch date in Slack.';
  function ask(){ var v=0; function step(){ st.dataset.v=v; mark(1,Math.min(v,2));
      if(v===1){ var n=0; (function type(){ if(ch!==1) return; tx.textContent=Q.slice(0,++n); if(n<Q.length) tm=setTimeout(type,38); else tm=setTimeout(function(){ v=2; step(); },500); })(); return; }
      if(v===0) tx.textContent='';
      tm=setTimeout(function(){ v=(v+1)%4; step(); },[1300,0,1800,2600][v]); } step(); }
  function orbit(){ var k=0; (function rows(){ mark(2,k); k=(k+1)%3; tm=setTimeout(rows,2200); })(); }
  function start(k){ clearTimeout(tm); cancelAnimationFrame(raf); if(k===1) ask(); if(k===2) orbit(); }
  function span(){ return Math.max(1,sec.offsetHeight-innerHeight); }
  function upd(){ var p=Math.min(1,Math.max(0,-sec.getBoundingClientRect().top/span())), k=p<1/3?0:p<2/3?1:2; if(bar) bar.style.transform='scaleX('+(k/3+ (p*3-k)/3).toFixed(3)+')';
    if(k!==ch){ ch=k; st.dataset.ch=k; tabs.forEach(function(b,i){ b.classList.toggle('on',i===k); b.setAttribute('aria-selected',i===k); }); start(k); } }
  tabs.forEach(function(b,i){ b.addEventListener('click',function(){ var y=sec.getBoundingClientRect().top+scrollY+span()*(i/3+.12); if(window.__lenis) window.__lenis.scrollTo(y); else scrollTo({top:y,behavior:'smooth'}); }); });
  addEventListener('scroll',upd,{passive:true}); addEventListener('resize',upd); upd(); })();

/* 1011-k · screen 6 personas: one open at a time; cycles every 5 s while on screen until someone picks */
(function(){ var sec=document.getElementById('needs'), items=sec?Array.prototype.slice.call(sec.querySelectorAll('.pz-i')):[]; if(!items.length) return;
  var k=0, t=null, held=false, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function open(i){ k=i; items.forEach(function(it,j){ it.classList.toggle('on',j===i); it.querySelector('.pz-h').setAttribute('aria-expanded',j===i); }); }
  function stop(){ clearInterval(t); t=null; } function play(){ stop(); if(held||reduce) return; t=setInterval(function(){ open((k+1)%items.length); },5000); }
  items.forEach(function(it,i){ var h=it.querySelector('.pz-h'); h.addEventListener('click',function(){ held=true; stop(); open(i); }); h.addEventListener('mouseenter',function(){ stop(); open(i); }); });
  sec.querySelector('.pz-acc').addEventListener('mouseleave',play);
  new IntersectionObserver(function(es){ es[0].isIntersecting?play():stop(); },{threshold:.4}).observe(sec); })();

/* 1011-l · screen 6 owner bubbles take turns in focus while on screen */
(function(){ var sec=document.getElementById('needs'), qb=sec?Array.prototype.slice.call(sec.querySelectorAll('.pz-qb')):[]; if(!qb.length) return; var k=0, t=null;
  new IntersectionObserver(function(es){ if(es[0].isIntersecting){ sec.classList.add('qb-in'); if(!t){ qb[0].classList.add('on'); t=setInterval(function(){ qb[k].classList.remove('on'); k=(k+1)%qb.length; qb[k].classList.add('on'); },3400); } } else { clearInterval(t); t=null; } },{threshold:.35}).observe(sec); })();

/* 1011-u · nav panel: the menu button grows the panel out of the bar */
(function(){ var nav=document.querySelector('.gridall>.nav.nav2'), b=nav&&nav.querySelector('.nb-menu'); if(!b) return;
  var set=function(on){ nav.classList.toggle('open',on); b.setAttribute('aria-expanded',on); b.setAttribute('aria-label',on?'Close menu':'Menu'); };
  b.addEventListener('click',function(e){ e.stopPropagation(); set(!nav.classList.contains('open')); });
  nav.querySelector('.nb-panel').addEventListener('click',function(e){ if(e.target.closest('a')) set(false); });
  document.addEventListener('click',function(e){ if(!nav.contains(e.target)) set(false); });
  addEventListener('keydown',function(e){ if(e.key==='Escape') set(false); });
  addEventListener('scroll',function(){ if(nav.classList.contains('away')) set(false); },{passive:true}); })();

/* 1011-v · nav: tabs with sub-pages open the panel (hover on desktop, tap anywhere); the burger shows everything on phones */
(function(){ var nav=document.querySelector('.gridall>.nav.nav3'); if(!nav) return;
  var tabs=Array.prototype.slice.call(nav.querySelectorAll('.n3-t[data-g]')), groups=Array.prototype.slice.call(nav.querySelectorAll('.n3-g')), burger=nav.querySelector('.n3-burger'), hov=matchMedia('(hover:hover)').matches, t=null;
  function show(k){ clearTimeout(t); tabs.forEach(function(b){ var on=b.dataset.g===k; b.classList.toggle('on',on); b.setAttribute('aria-expanded',on); }); groups.forEach(function(g){ g.classList.toggle('on',g.dataset.g===k); if(g.dataset.g===k){ var b=nav.querySelector('.n3-t[data-g="'+k+'"]'); if(b){ g.style.setProperty('--off','0px'); var gr=g.getBoundingClientRect(), br=b.getBoundingClientRect(), ls=g.querySelectorAll('a'), w=ls[ls.length-1].getBoundingClientRect().right-ls[0].getBoundingClientRect().left; g.style.setProperty('--off',Math.max(0,Math.min(br.left+br.width/2-gr.left-w/2,g.clientWidth-w))+'px'); g.style.setProperty('--cx',(br.left+br.width/2-gr.left)+'px'); } } }); nav.classList.toggle('open',k!==null); if(burger) burger.setAttribute('aria-expanded',k!==null); }
  function later(){ clearTimeout(t); t=setTimeout(function(){ show(null); },180); }
  tabs.forEach(function(b){ b.addEventListener('click',function(e){ if(hov) return; e.preventDefault(); e.stopPropagation(); show(b.classList.contains('on')?null:b.dataset.g); }); if(hov) b.addEventListener('mouseenter',function(){ show(b.dataset.g); }); });
  if(hov){ nav.querySelectorAll('a.n3-t:not([data-g])').forEach(function(a){ a.addEventListener('mouseenter',function(){ show(null); }); }); nav.addEventListener('mouseleave',later); nav.addEventListener('mouseenter',function(){ clearTimeout(t); }); }
  if(burger) burger.addEventListener('click',function(e){ e.stopPropagation(); show(nav.classList.contains('open')?null:'m'); });
  nav.querySelector('.n3-drop').addEventListener('click',function(e){ if(e.target.closest('a')) show(null); });
  document.addEventListener('click',function(e){ if(!nav.contains(e.target)) show(null); });
  addEventListener('keydown',function(e){ if(e.key==='Escape') show(null); });
  addEventListener('scroll',function(){ if(nav.classList.contains('away')) show(null); },{passive:true}); })();

/* 1011-zb · FAQ grid: one card open at a time */
(function(){ var cs=Array.prototype.slice.call(document.querySelectorAll('#faq .pn.fq2')); if(!cs.length) return;
  cs.forEach(function(c){ c.addEventListener('click',function(){ var on=!c.classList.contains('open'); cs.forEach(function(x){ x.classList.remove('open'); x.querySelector('.fq2-h').setAttribute('aria-expanded','false'); }); c.classList.toggle('open',on); c.querySelector('.fq2-h').setAttribute('aria-expanded',on); }); }); })();

/* 1011-zc · FAQ: pick a category, one answer open at a time within it */
(function(){ var sec=document.getElementById('faq'), cats=sec?Array.prototype.slice.call(sec.querySelectorAll('.fq3-c')):[]; if(!cats.length) return;
  var lists=Array.prototype.slice.call(sec.querySelectorAll('.fq3-list'));
  cats.forEach(function(b){ b.addEventListener('click',function(){ cats.forEach(function(x){ var on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on); }); lists.forEach(function(l){ l.classList.toggle('on',l.dataset.c===b.dataset.c); }); }); });
  lists.forEach(function(l){ var items=Array.prototype.slice.call(l.querySelectorAll('.fq3-i'));
    items.forEach(function(it){ it.querySelector('.fq3-h').addEventListener('click',function(){ var on=!it.classList.contains('open'); items.forEach(function(x){ x.classList.remove('open'); x.querySelector('.fq3-h').setAttribute('aria-expanded','false'); }); it.classList.toggle('open',on); it.querySelector('.fq3-h').setAttribute('aria-expanded',on); }); }); }); })();

/* 1011-zd · FAQ rows: hover (desktop) or tap picks a question; its answer shows in the left cell */
(function(){ var sec=document.getElementById('faq'), rows=sec?Array.prototype.slice.call(sec.querySelectorAll('.fq4-r')):[]; if(!rows.length) return;
  var box=sec.querySelector('.fq4-ans p'), hov=matchMedia('(hover:hover)').matches;
  function pick(r){ if(r.classList.contains('on')) return; rows.forEach(function(x){ var on=x===r; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on); });
    if(box){ var n=box.cloneNode(false); n.innerHTML='<b></b> '; n.firstChild.textContent=r.dataset.q.replace(/&amp;/g,'&'); n.appendChild(document.createTextNode(r.dataset.a)); box.parentNode.replaceChild(n,box); box=n; } }
  rows.forEach(function(r){ r.addEventListener('click',function(){ pick(r); }); r.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(r); } }); if(hov) r.addEventListener('mouseenter',function(){ pick(r); }); }); })();

/* 1011-ze · FAQ bars: one answer open at a time */
(function(){ var it=Array.prototype.slice.call(document.querySelectorAll('#faq .fq5-i')); if(!it.length) return;
  it.forEach(function(i){ i.querySelector('.fq5-h').addEventListener('click',function(){ var on=!i.classList.contains('open'); it.forEach(function(x){ x.classList.remove('open'); x.querySelector('.fq5-h').setAttribute('aria-expanded','false'); }); i.classList.toggle('open',on); i.querySelector('.fq5-h').setAttribute('aria-expanded',on); }); }); })();

/* 1011-zf · FAQ categories filter the bars */
(function(){ var sec=document.getElementById('faq'), cs=sec?Array.prototype.slice.call(sec.querySelectorAll('.fq5-c')):[]; if(!cs.length) return; var it=Array.prototype.slice.call(sec.querySelectorAll('.fq5-i')), ol=sec.querySelector('.fq5-list ol');
  cs.forEach(function(b){ b.addEventListener('click',function(){ cs.forEach(function(x){ var on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on); });
    it.forEach(function(i){ i.hidden=i.dataset.c!==b.dataset.c; i.classList.remove('open'); i.querySelector('.fq5-h').setAttribute('aria-expanded','false'); });
    ol.classList.remove('swap'); void ol.offsetWidth; ol.classList.add('swap'); }); }); })();

/* 1011-zs · nav Buy now: collapses while scrolling down, expands when scrolling back up; never while the hero's own Buy now is on screen (all breakpoints) */
(function(){ var nav=document.querySelector('.gridall>.nav.nav3'), hb=document.querySelector('#hero .btn'); if(!nav) return;
  var heroVis=true, up=false, last=scrollY;
  function set(){ nav.classList.toggle('show-buy', !heroVis);   /* 1011-zv: nav always visible (vocci.ai), so no direction rule */ }
  var hero=document.getElementById('hero'), nx=hero&&hero.nextElementSibling; function vis(){ if(!hb) return false; var r=hb.getBoundingClientRect(); if(!(r.bottom>0&&r.top<innerHeight&&r.width>0)) return false; return !nx||nx.getBoundingClientRect().top>r.top; }   /* the hero is pinned under the page: its button counts only until the next section covers it */
  addEventListener('scroll',function(){ var y=scrollY; heroVis=vis(); if(Math.abs(y-last)>4){ up=y<last; last=y; } set(); },{passive:true}); addEventListener('resize',function(){ heroVis=vis(); set(); }); heroVis=vis(); set(); })();

/* 1011-zu · creator videos: a swipeable carousel on phones and tablets (each video + its card is one slide) */
(function(){ if(innerWidth>1100) return; var sec=document.getElementById('kol'), st=sec&&sec.querySelector('.stage.kv'); if(!st) return;
  var pics=Array.prototype.slice.call(st.querySelectorAll('.kv-pic')), txts=Array.prototype.slice.call(st.querySelectorAll('.kv-txt')); if(!pics.length) return;
  var sc=document.createElement('div'); sc.className='kv-scroll';
  pics.forEach(function(p,i){ var sl=document.createElement('div'); sl.className='kv-slide'; sl.appendChild(p); if(txts[i]) sl.appendChild(txts[i]); sc.appendChild(sl); });
  st.appendChild(sc);
  var hint=document.createElement('div'); hint.className='how-hint kv-hint'; hint.innerHTML='<button class="hh-b prev" aria-label="Previous video" disabled><svg viewBox="0 0 20 20"><path d="M12 4l-6 6 6 6"/></svg></button><span class="hh-d">'+pics.map(function(_,i){return '<i'+(i?'':' class="on"')+'></i>';}).join('')+'</span><button class="hh-b next" aria-label="Next video"><svg viewBox="0 0 20 20"><path d="M8 4l6 6-6 6"/></svg></button>';
  st.appendChild(hint);
  var slides=Array.prototype.slice.call(sc.children), dots=Array.prototype.slice.call(hint.querySelectorAll('.hh-d i'));
  function idx(){ var w=slides[0].offsetWidth+12; return Math.round(sc.scrollLeft/w); }
  function go(k){ k=Math.max(0,Math.min(slides.length-1,k)); sc.scrollTo({left:slides[k].offsetLeft-sc.offsetLeft-parseFloat(getComputedStyle(sc).paddingLeft),behavior:'smooth'}); }
  hint.querySelector('.prev').addEventListener('click',function(){ go(idx()-1); }); hint.querySelector('.next').addEventListener('click',function(){ go(idx()+1); });
  dots.forEach(function(d,j){ d.addEventListener('click',function(){ go(j); }); });
  sc.addEventListener('scroll',function(){ var k=idx(); dots.forEach(function(d,j){ d.classList.toggle('on',j===k); }); hint.querySelector('.prev').disabled=k===0; hint.querySelector('.next').disabled=k>=slides.length-1; },{passive:true}); })();
