(()=>{
 const hero=document.querySelector('.hero'),panel=hero?.querySelector('#hero-panel'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 if(!panel)return;
 let cancelled=false,animations=[];
 const overlay=document.createElement('div');overlay.className='product-opening';overlay.setAttribute('aria-hidden','true');
 const images=['silver','gold','black','graphite'].map(color=>{const img=new Image();img.src=`assets/opening/${color}.png`;overlay.append(img);return img});
 const front=new Image();front.src='assets/friday/hero/ring-front.png';front.className='opening-front';overlay.append(front);panel.append(overlay);
 function finish(){if(cancelled)return;cancelled=true;animations.forEach(a=>a.cancel());overlay.remove();hero.classList.remove('intro-running');hero.querySelectorAll('.hero-identity').forEach(e=>e.classList.add('is-recording'));}
 if(reduce.matches||scrollY>40){finish();}else{
 hero.classList.add('intro-running');
 Promise.all([...images,front].map(i=>i.decode().catch(()=>{}))).then(async()=>{
  if(cancelled)return;
  images.forEach((img,i)=>{
   animations.push(img.animate([{opacity:0,transform:'rotate(-8deg) scale(.94)'},{opacity:1,offset:.24},{opacity:1,offset:.7},{opacity:0,transform:'rotate(3deg) scale(1.035)'}],{delay:i*750,duration:1200,fill:'both',easing:'ease-in-out'}));
  });
  const target=hero.querySelector('.identity-ring').getBoundingClientRect(),area=panel.getBoundingClientRect(),size=Math.min(innerHeight*.55,innerWidth*.62,540);
  front.style.width=target.width+'px';front.style.height=target.height+'px';front.style.left=(target.left-area.left)+'px';front.style.top=(target.top-area.top)+'px';
  const dx=innerWidth/2-target.left-target.width/2,dy=innerHeight/2-target.top-target.height/2;
  animations.push(front.animate([{opacity:0},{opacity:1}],{delay:2900,duration:550,fill:'both'}));
  const movement=front.animate([{transform:`translate(${dx}px,${dy}px) scale(${size/target.width})`},{transform:'translate(0,0) scale(1)'}],{delay:3350,duration:1950,fill:'both',easing:'cubic-bezier(.65,0,.2,1)'});animations.push(movement);
  await movement.finished.catch(()=>{});finish();
 });}
 addEventListener('scroll',()=>{if(scrollY>40)finish()},{passive:true});addEventListener('resize',finish);reduce.addEventListener('change',finish);
 const cinema=document.querySelector('.cinema'),card=document.querySelector('[data-prototype="2"]');if(!card)return;
 const media=document.createElement('div');media.className='connect-media';
 const video=document.createElement('video');video.src='assets/opening/connect-ai.mp4';video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label','Vocci connects your context to your AI tools');
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='▶';toggle.setAttribute('aria-label','Play connection animation');media.append(video,toggle);card.querySelector('.app-panel-title').after(media);
 let visible=false,userPaused=false;
 function sync(){const active=visible&&cinema.dataset.scene==='2';if(active&&!reduce.matches&&!userPaused)video.play().catch(()=>{});else video.pause();}
 toggle.addEventListener('click',()=>{if(video.paused){userPaused=false;video.play().catch(()=>{})}else{userPaused=true;video.pause()}});
 video.addEventListener('play',()=>{toggle.textContent='Ⅱ';toggle.setAttribute('aria-label','Pause connection animation')});video.addEventListener('pause',()=>{toggle.textContent='▶';toggle.setAttribute('aria-label','Play connection animation')});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.1}).observe(media);
 new MutationObserver(sync).observe(cinema,{attributes:true,attributeFilter:['data-scene']});reduce.addEventListener('change',sync);
})();
