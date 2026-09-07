(() => {
 const buttons=[...document.querySelectorAll('[data-color]')],images=[...document.querySelectorAll('[data-color-image]')],auto=document.querySelector('#auto-color'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,timer,wantsAuto=!reduce.matches;
 function select(i){current=i;const color=buttons[i].dataset.color;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));images.forEach(img=>{const on=img.dataset.colorImage===color;img.classList.toggle('active',on);img.setAttribute('aria-hidden',String(!on));});document.querySelector('#color-name').textContent=buttons[i].getAttribute('aria-label');}
 function sync(){clearInterval(timer);timer=null;auto.setAttribute('aria-pressed',String(wantsAuto));auto.textContent=wantsAuto?'暂停轮换':'自动轮换';if(wantsAuto&&!document.hidden)timer=setInterval(()=>select((current+1)%4),1400);}
 function stop(){wantsAuto=false;sync();}
 buttons.forEach((b,i)=>{b.addEventListener('click',()=>{stop();select(i);});b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();stop();const n=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;select(n);buttons[n].focus();});});
 auto.addEventListener('click',()=>{wantsAuto=!wantsAuto;sync();});document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',()=>{if(reduce.matches)stop();});sync();
})();
