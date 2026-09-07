(() => {
 const overlay=document.querySelector('.intro-overlay'),product=document.querySelector('.intro-product'),hole=document.querySelector('#aperture-hole'),orbit=document.querySelector('.particle-orbit'),skip=document.querySelector('.intro-skip'),word=document.querySelector('.intro-wordmark'),white=document.querySelector('#white-center');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,start=0;
 const dots=[];for(let band=0;band<6;band++)for(let i=0;i<100;i++){const d=document.createElementNS('http://www.w3.org/2000/svg','circle');const angle=i/100*Math.PI*2+band*.023;const r=184+band*6;d.setAttribute('cx',250+Math.cos(angle)*r);d.setAttribute('cy',250+Math.sin(angle)*r);d.setAttribute('r',.65+band*.05);d.setAttribute('fill','#d8e0e0');d.dataset.angle=angle;d.dataset.band=band;orbit.append(d);dots.push(d);}
 const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>x*x*(3-2*x);
 function stop(){cancelAnimationFrame(raf);overlay.hidden=true;skip.hidden=true;document.body.classList.remove('intro-playing');document.querySelector('main').inert=false;document.querySelector('.nav').inert=false;document.querySelector('.test-tools').inert=false;}
 function frame(now){const t=(now-start)/1000;const fill=ease(clamp((t-1.5)/.6));const expand=Math.pow(clamp((t-2.1)/1.65),2.8);const scale=1+expand*35;const rotate=14*Math.sin(Math.min(t,1.5)/1.5*Math.PI);const cx=innerWidth/2,cy=innerHeight/2;
 // Existing product PNG is angled, so the aperture follows its tilted inner opening.
 hole.setAttribute('cx',cx);hole.setAttribute('cy',cy);hole.setAttribute('rx',57*fill*scale);hole.setAttribute('ry',37*fill*scale);hole.setAttribute('transform',`rotate(37 ${cx} ${cy})`);
 ['cx','cy','rx','ry','transform'].forEach(a=>white.setAttribute(a,hole.getAttribute(a)));white.style.opacity=String(1-ease(clamp((t-2.1)/.65)));
 product.style.transform=`translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})`;
 product.style.opacity=String(1-ease(clamp((t-3.25)/.4)));word.style.opacity=String((1-ease(clamp((t-1.4)/.5)))*ease(clamp(t/.4)));
 orbit.style.transform=`rotate(${t*28}deg)`;orbit.style.opacity=String(1-ease(clamp((t-1.6)/.5)));
 dots.forEach(d=>d.setAttribute('opacity',String(.12+.56*Math.pow((Math.sin(Number(d.dataset.angle)-t*2.2)+1)/2,4))));
 if(t>=3.8)stop();else raf=requestAnimationFrame(frame);}
 async function play(){cancelAnimationFrame(raf);if(reduce.matches){stop();return;}overlay.hidden=false;skip.hidden=false;await Promise.all([...document.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);overlay.hidden=false;skip.hidden=false;document.body.classList.add('intro-playing');document.querySelector('main').inert=true;document.querySelector('.nav').inert=true;document.querySelector('.test-tools').inert=true;start=performance.now();frame(start);}
 document.querySelector('#replay').addEventListener('click',play);skip.addEventListener('click',stop);document.addEventListener('keydown',e=>{if(e.key==='Escape')stop();});reduce.addEventListener('change',()=>{if(reduce.matches)stop();});
 play();
})();
