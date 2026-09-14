(() => {
 'use strict';
 const hero=document.querySelector('.hero'),identity=hero.querySelector('.hero-identity'),ring=hero.querySelector('.identity-ring');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let animations=[],recordingTimer=0,run=0;
 function stop(){run++;clearInterval(recordingTimer);identity.classList.remove('is-recording','is-opening');animations.forEach(a=>a.cancel());animations=[];}
 function recording(){
  identity.classList.remove('is-opening');identity.classList.add('is-recording');

 }
 async function opening(){
  stop();if(identity.hidden)return;
  const thisRun=run;
  await Promise.all([...hero.querySelectorAll('.identity-angle'),ring].filter(i=>!i.complete).map(i=>i.decode().catch(()=>{})));if(thisRun!==run||identity.hidden)return;
  if(reduce.matches){recording();return;}
  const r=ring.getBoundingClientRect();
  // Source render is centered within its canvas. Measure against the viewport,
  // rather than the lower hero panel, to place the opening at the screen center.
  const dx=document.documentElement.clientWidth/2-(r.x+r.width/2),dy=innerHeight/2-(r.y+r.height/2);
  const scale=Math.min(innerHeight*.54/(r.height*.70),innerWidth*.42/(r.width*.52),4.3);
  identity.classList.add('is-opening');
  const stage=identity.getBoundingClientRect(), angleStage=hero.querySelector('.identity-angle-stage');
  angleStage.style.left=(document.documentElement.clientWidth/2-stage.x)+'px';angleStage.style.top=(innerHeight/2-stage.y)+'px';
  const angleSize=Math.min(innerHeight*.72,innerWidth*.55,720);angleStage.style.width=angleSize+'px';angleStage.style.height=angleSize+'px';
  const a=hero.querySelector('.angle-a'),b=hero.querySelector('.angle-b');
  animations.push(a.animate([{opacity:1,offset:0},{opacity:1,offset:.55},{opacity:0,offset:1}],{duration:1700,fill:'both',easing:'ease-in-out'}));
  animations.push(b.animate([{opacity:0,offset:0},{opacity:1,offset:.3},{opacity:1,offset:.64},{opacity:0,offset:1}],{delay:1100,duration:1900,fill:'both',easing:'ease-in-out'}));
  animations.push(ring.animate([{opacity:0},{opacity:1}],{delay:2300,duration:700,fill:'both',easing:'ease-in-out'}));
  const move=ring.animate([{transform:`translate3d(${dx}px,${dy}px,0) scale(${scale})`},{transform:'translate3d(0,0,0) scale(1)'}],{delay:3000,duration:3800,easing:'cubic-bezier(.65,0,.22,1)',fill:'both'});
  animations.push(move);
  for(const el of hero.querySelectorAll('.logo-letter'))animations.push(el.animate([{opacity:0},{opacity:1}],{delay:4850,duration:1650,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'}));
  for(const el of hero.querySelectorAll('.identity-caption,.identity-detail'))animations.push(el.animate([{opacity:0,transform:'translate3d(0,12px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:5700,duration:1100,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'}));
  await move.finished.catch(()=>{});if(thisRun===run&&!identity.hidden)recording();
 }
 hero.querySelector('.hero-replay').addEventListener('click',()=>{window.scrollTo({top:hero.getBoundingClientRect().top+scrollY,behavior:'instant'});opening();});
 reduce.addEventListener('change',()=>{if(!identity.hidden){stop();recording();}});
 window.addEventListener('resize',()=>{if(!identity.hidden){stop();recording();}});
 if(ring.complete)opening();else ring.addEventListener('load',opening,{once:true});
})();
