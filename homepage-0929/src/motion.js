/* VOCCI · round 0928 motion (vanilla; Lenis optional) — see docs/motion.md for the per-section brief */
(function(){
  var doc=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');
  var main=document.querySelector('main.page');

  /* nav out of the hero so it can be fixed above every section */
  var nav=document.querySelector('#hero .nav'); if(nav){ main.insertBefore(nav, main.firstChild); }

  /* hero heading · per-character blur → sharp */
  (function(){ var h=document.querySelector('#hero h1'); if(!h) return; var i=0; (function walk(node){ Array.prototype.slice.call(node.childNodes).forEach(function(n){ if(n.nodeType===3){ var f=document.createDocumentFragment(); Array.from(n.textContent).forEach(function(ch){ if(ch===' '){f.appendChild(document.createTextNode(' '));return;} var s=document.createElement('span'); s.className='hero-ch'; s.textContent=ch; s.style.setProperty('--i',i++); f.appendChild(s); }); node.replaceChild(f,n); } else if(n.nodeType===1&&n.tagName!=='BR') walk(n); }); })(h); h.dataset.split=1; })();

  /* split headings into masked words */
  document.querySelectorAll('.pn h1,.pn h2,.split').forEach(function(el){
    if(el.dataset.split) return; el.dataset.split=1; el.classList.add('split'); var i=0;
    (function walk(node){ Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){ var f=document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(function(t){
        if(!t) return; if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return;}
        var w=document.createElement('span');w.className='w';var s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);w.appendChild(s);f.appendChild(w);});
        node.replaceChild(f,n);}
      else if(n.nodeType===1&&n.tagName!=='BR') walk(n); }); })(el);
  });

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
  var hero=document.getElementById('hero'), heroPn=hero&&hero.querySelector('.pn'), heroImg=hero&&hero.querySelector('.bgimg'), faq=document.getElementById('faq'), foot=document.getElementById('footer');
  function scrub(){
    if(hero) hero.style.visibility=scrollY>hero.offsetHeight+20?'hidden':'visible';
    if(innerWidth<=700) return;
    if(hero){ var p=Math.min(1,Math.max(0,scrollY/hero.offsetHeight));  if(heroPn&&heroPn.classList.contains('in')){ if(p>0) heroPn.classList.add('driven'); heroPn.style.translate='0 '+(p*140)+'px';heroPn.style.opacity=1-p*1.4;} if(heroImg){heroImg.style.filter='brightness('+(1-p*.45)+')';heroImg.style.scale=String(1+p*.12);} }
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
  if(how){ var txts=Array.prototype.slice.call(how.querySelectorAll('.pn:not(.pic)')), i=0, t=null;
    function show(k){ i=k; txts.forEach(function(x,j){ x.classList.toggle('on',j===k); }); }
    function play(){ stop(); t=setInterval(function(){ show((i+1)%txts.length); },3200); }
    function stop(){ clearInterval(t); t=null; }
    txts.forEach(function(x,k){ x.addEventListener('mouseenter',function(){stop();show(k)}); x.addEventListener('mouseleave',play); });
    new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){show(0);play();} else stop(); }); },{threshold:.4}).observe(how); }

  /* testimonials · quotes window (3 visible) + centre photo swap */
  var REVIEWS=[
    {q:'I am always wearing it which makes it super easy to click & record.',src:'<b class="src">Discord</b> davad0716 · Feb 2026',img:0},
    {q:'Styling gets comments from many in my office. They say it looks very cool!',src:'<b class="src">Reddit</b> u/kuped · Feb 2026',img:1},
    {q:'I’m extremely impressed by the battery life.',src:'<b class="src">Reddit</b> zeroskills21 · Feb 2026',img:2},
    {q:'Placeholder · awaiting owner quote 04.',src:'<b class="src">Placeholder</b> owner · 2026',img:3},
    {q:'Placeholder · awaiting owner quote 05.',src:'<b class="src">Placeholder</b> owner · 2026',img:4},
    {q:'Placeholder · awaiting owner quote 06.',src:'<b class="src">Placeholder</b> owner · 2026',img:5}];
  var rvCells=Array.prototype.slice.call(document.querySelectorAll('#testimonials .pn.rv')), rvImgs=Array.prototype.slice.call(document.querySelectorAll('#testimonials .rv-img')), rvMore=document.querySelector('.rv-more'), rvCount=document.querySelector('.rv-count'), rvStart=0;
  function rvShow(k){ rvImgs.forEach(function(im,j){ im.classList.toggle('on',j===REVIEWS[k].img); }); rvCells.forEach(function(c){ c.classList.toggle('on',+c.dataset.k===k); }); }
  function rvRender(){ rvCells.forEach(function(c,i){ var k=(rvStart+i)%REVIEWS.length, d=REVIEWS[k]; c.dataset.k=k; c.style.transition='opacity .3s'; c.style.opacity=0; setTimeout(function(){ c.querySelector('q').textContent=d.q; c.querySelector('.label').innerHTML=d.src; c.style.opacity=1; },300); });
    if(rvCount){ var a=rvStart+1, b=Math.min(rvStart+3,REVIEWS.length); rvCount.textContent=String(a).padStart(2,'0')+'–'+String(b).padStart(2,'0')+' / '+String(REVIEWS.length).padStart(2,'0'); }
    setTimeout(function(){rvShow(rvStart)},320); }
  if(rvCells.length){ rvCells.forEach(function(c){ c.addEventListener('click',function(){ rvShow(+c.dataset.k); }); c.addEventListener('mouseenter',function(){ rvShow(+c.dataset.k); }); }); rvCells.forEach(function(c,i){c.dataset.k=i;}); rvShow(0);
    if(rvMore) rvMore.addEventListener('click',function(e){ e.preventDefault(); rvStart=(rvStart+3)%REVIEWS.length; rvRender(); }); }

  /* nav · hides while scrolling down, returns on scroll up */
  (function(){ var last=scrollY, navEl=document.querySelector('.gridall>.nav'); if(!navEl) return; var hot=document.createElement('div'); hot.className='nav-hot'; document.body.appendChild(hot); var hover=false, hideT=null;
    function place(){ navEl.classList.toggle('bar',scrollY>40); var tucked=scrollY>80&&!hover; navEl.classList.toggle('away',tucked); }
    function show(){ hover=true; clearTimeout(hideT); place(); }
    function hide(){ clearTimeout(hideT); hideT=setTimeout(function(){ hover=false; place(); },500); }
    [hot,navEl].forEach(function(el){ el.addEventListener('mouseenter',show); el.addEventListener('mouseleave',hide); });
    addEventListener('scroll',place,{passive:true}); place(); })();

  /* paragraphs rise line by line with scroll (ivycapital p-scroll) */
  (function(){ if(reduce) return; var els=Array.prototype.slice.call(document.querySelectorAll('#why .pn p,#why-b .pn p,#scenes2 .pn p,#breather .pn p,#needs .pn q,#scenes .pn p'));
    els.forEach(function(p){ if(p.closest('.proto')) return; p.classList.add('p-scroll'); p._units=[]; (function walk(node){ Array.prototype.slice.call(node.childNodes).forEach(function(n){ if(n.nodeType===3){ var f=document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(function(t){ if(!t) return; if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return;} var u=document.createElement('span'); u.className='u'; u.textContent=t; f.appendChild(u); p._units.push(u); }); node.replaceChild(f,n);} else if(n.nodeType===1&&n.tagName!=='BR') walk(n); }); })(p); });
    els=els.filter(function(p){return p._units&&p._units.length});
    function lines(){ els.forEach(function(p){ var cur=null,li=-1; p._units.forEach(function(u){ var t=Math.round(u.getBoundingClientRect().top); if(cur===null||Math.abs(t-cur)>3){li++;cur=t;} u._li=li; }); p._lines=li+1; }); }
    function upd(){ var vh=innerHeight; els.forEach(function(p){ var top=p.getBoundingClientRect().top; var g=Math.min(1,Math.max(0,(vh*0.96-top)/(vh*0.96-vh*0.72))); var n=p._lines,st=n>1?0.45/(n-1):0,dur=1-st*(n-1); p._units.forEach(function(u){ var pi=Math.min(1,Math.max(0,dur>0?(g-u._li*st)/dur:g)), e=1-Math.pow(1-pi,3); u.style.opacity=0.55+0.45*e; u.style.transform='translateY('+((1-e)*10)+'px)'; }); }); }
    lines(); upd(); addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true}); addEventListener('resize',function(){lines();upd();}); setTimeout(function(){lines();upd();},800); })();

  /* count-up numbers */
  (function(){ var cus=document.querySelectorAll('.cu'); if(!cus.length) return; var io2=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; var el=e.target; io2.unobserve(el); if(reduce) return; var to=parseFloat(el.dataset.to), dec=+(el.dataset.dec||0), t0=performance.now(), D=1400; (function tick(now){ var p=Math.min(1,(now-t0)/D), ea=1-Math.pow(1-p,3); el.textContent=(to*ea).toFixed(dec); if(p<1) requestAnimationFrame(tick); })(t0); }); },{threshold:.6}); cus.forEach(function(c){ io2.observe(c); }); })();

  /* background layer opacity follows the section at the viewport centre */
  (function(){ var bg=document.getElementById('pagebg'); if(!bg) return; var blocks=document.querySelectorAll('[data-bgop]'); var io3=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) bg.style.setProperty('--pgop',e.target.dataset.bgop); }); },{rootMargin:'-49% 0px -49% 0px',threshold:0}); blocks.forEach(function(b){ io3.observe(b); }); })();

  /* FAQ accordion */
  document.querySelectorAll('#faq .pn .qn').forEach(function(qn){ var cell=qn.closest('.pn'); var h=qn.nextElementSibling; function tog(){ var open=!cell.classList.contains('open'); cell.classList.toggle('open',open); qn.querySelector('i').textContent=open?'–':'+'; } qn.addEventListener('click',tog); h&&h.addEventListener('click',tog); });
})();
