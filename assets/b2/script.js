(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const highlights = document.querySelector('.highlights');
  const highlightStage = highlights.querySelector('.highlight-stage');
  const highlightCards = [...highlights.querySelectorAll('.highlight')];
  const navigation = document.querySelector('.nav');
  let navScrollCheckpoint = window.scrollY;
  let navWasInHighlights = false;
  function updateNavigation() {
    const scrollPosition = window.scrollY;
    const delta = scrollPosition - navScrollCheckpoint;
    const inHighlights = scrollPosition >= highlightStart && scrollPosition < highlightStart + highlights.offsetHeight;
    let hidden = navigation.classList.contains('is-hidden');
    if (!inHighlights) hidden = false;
    else if (!navWasInHighlights) hidden = delta >= 0;
    else if (Math.abs(delta) >= 4) hidden = delta > 0;
    navigation.classList.toggle('is-hidden', hidden);
    navigation.inert = hidden || document.body.classList.contains("intro-playing");
    navigation.setAttribute('aria-hidden', String(hidden));
    if (Math.abs(delta) >= 4 || inHighlights !== navWasInHighlights) navScrollCheckpoint = scrollPosition;
    navWasInHighlights = inHighlights;
  }
  let highlightStart = 0;
  let photoHeight = 1;
  let photoHold = 0;
  const cardPositions = [];
  function measureHighlights() {
    highlightStart = highlights.getBoundingClientRect().top + window.scrollY;
    photoHeight = highlightStage.offsetHeight;
    photoHold = (highlights.offsetHeight - photoHeight * highlightCards.length) / highlightCards.length;
  }
  function updateHighlights() {
    const distance = window.scrollY - highlightStart;
    highlightCards.forEach((card, index) => {
      const transitionStart = (index - 1) * (photoHeight + photoHold) + photoHold;
      const y = index === 0 ? 0 : Math.max(0, Math.min(photoHeight, photoHeight - (distance - transitionStart)));
      if (cardPositions[index] === y) return;
      cardPositions[index] = y;
      card.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }
  // The outer section supplies scroll distance; its one stage stays in place.
  const useSection = document.querySelector('.use-pages');
  const useStage = useSection.querySelector('.use-stage');
  const useCopies = [...useSection.querySelectorAll('[data-use-copy]')];
  const useVisuals = [...useSection.querySelectorAll('[data-use-visual]')];
  const useSteps = [...useSection.querySelectorAll('[data-use-step]')];
  const useRail = useSection.querySelector('.use-rail');
  let useStart = 0;
  let useDistance = 1;
  let currentStep = -1;
  let scrollFrame = 0;
  function updateUseStep() {
    scrollFrame = 0;
    updateHighlights();
    updateNavigation();
    const progress = (window.scrollY - useStart) / useDistance;
    const step = Math.max(0, Math.min(3, Math.floor(progress * 4 + .001)));
    if (step === currentStep) return;
    currentStep = step;
    useStage.dataset.step = String(step);
    useRail.style.setProperty('--step', step);
    useCopies.forEach((copy, index) => {
      const active = index === step;
      copy.classList.toggle('active', active);
      copy.setAttribute('aria-hidden', String(!active));
      useVisuals[index].classList.toggle('active', active);
      useVisuals[index].setAttribute('aria-hidden', String(!active));
      useSteps[index].classList.toggle('active', active);
      useSteps[index].classList.toggle('reached', index <= step);
      if (active) useSteps[index].setAttribute('aria-current', 'step');
      else useSteps[index].removeAttribute('aria-current');
    });
    document.getElementById('use-status').textContent = `Step ${step + 1} of 4: ${useCopies[step].querySelector('h2').textContent}`;
  }
  function measureUseSection() {
    measureHighlights();
    const navOffset = parseFloat(getComputedStyle(useStage).top);
    useStart = useSection.getBoundingClientRect().top + window.scrollY - navOffset;
    useDistance = Math.max(1, useSection.offsetHeight - useStage.offsetHeight);
    updateUseStep();
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateUseStep);
  }, {passive: true});
  window.addEventListener('resize', measureUseSection);
  window.addEventListener('load', measureUseSection);
  document.fonts.ready.then(measureUseSection);
  measureUseSection();
  useSteps.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    // Keep keyboard focus on the progress control while its scroll target changes.
    history.replaceState(null, '', link.getAttribute('href'));
    window.scrollTo({
      top: useStart + useDistance * index / 4 + 1,
      behavior: reduced.matches ? 'instant' : 'smooth'
    });
  }));
  const detailButtons=[...document.querySelectorAll('[data-detail]')];
  const frame=document.querySelector('.hardware-frame');
  const captions={titanium:'The ring, inside and out.',fit:'A closer look at proportion.',button:'A small gesture, up close.',water:'The surface, in detail.',recording:'Room for what matters.',case:'Ring and charging case.'};
  detailButtons.forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.detail;
    const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
    detailButtons.forEach(b=>{const active=b===button&&shouldOpen;b.setAttribute('aria-expanded',String(active));b.parentElement.classList.toggle('active',active);b.querySelector('.toggle').textContent=active?'−':'+';});
    const alt=frame.querySelector('.hw-alt');
    alt.src=mode==='case'?'assets/product/vocci-ring-and-case-open.png':'assets/product/vocci-ring-front.png';
    alt.alt=mode==='case'?'Vocci ring with open charging case':'Front view of Vocci ring';
    const showAlt=mode==='case'||mode==='fit';
    alt.setAttribute('aria-hidden',String(!showAlt));
    frame.querySelector('.hw-angle').setAttribute('aria-hidden',String(showAlt));
    frame.dataset.mode=mode;frame.querySelector('.hardware-caption').textContent=captions[mode];
  }));
  const stories=[...document.querySelectorAll('.story')];
  const selectStory=index=>stories.forEach((s,i)=>s.classList.toggle('active',i===index));
  stories.forEach((story,i)=>{story.addEventListener('pointerenter',()=>selectStory(i));story.addEventListener('focus',()=>selectStory(i));story.addEventListener('click',()=>selectStory(i));});
  document.querySelector('.stories').addEventListener('pointerleave',()=>{if(!document.querySelector('.stories').contains(document.activeElement))selectStory(3);});
  const faqTabs=[...document.querySelectorAll('[data-faq]')];
  function chooseFAQ(tab){faqTabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById('faq-'+t.dataset.faq).hidden=!selected;});}
  faqTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>chooseFAQ(tab));tab.addEventListener('keydown',e=>{let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%faqTabs.length;else if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i+faqTabs.length-1)%faqTabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=faqTabs.length-1;else return;e.preventDefault();chooseFAQ(faqTabs[next]);faqTabs[next].focus();});});
  document.querySelectorAll('.faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)detail.parentElement.querySelectorAll('details').forEach(d=>{if(d!==detail)d.open=false;});}));
  const track = document.getElementById('mfgTrack');

  const mfg = track.closest('.mfg');
  const viewport = track.parentElement;
  const dotsWrap = document.getElementById('mfgDots');
  const count = track.children.length;
  const dots = [];
  let busy = false;
  const width = () => parseFloat(getComputedStyle(mfg).getPropertyValue('--c'));
  const size = () => mfg.style.setProperty('--c', `${viewport.clientWidth / 4}px`);
  size();
  window.addEventListener('resize', size);
  const selected = () => Number(track.firstElementChild.dataset.i);
  function syncDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('on', index === selected());
      dot.setAttribute('aria-current', String(index === selected()));
    });
  }
  function jump(index) {
    if (busy) return;
    mfg.classList.add('notrans');
    while (selected() !== index) track.appendChild(track.firstElementChild);
    [...track.children].forEach((card, i) => card.classList.toggle('featured', i === 0));
    track.style.transform = 'translateX(0)';
    void track.offsetWidth;
    mfg.classList.remove('notrans');
    syncDots();
  }
  function move(direction) {
    if (busy) return;
    if (reduced.matches) { jump((selected() + direction + count) % count); return; }
    busy = true;
    if (direction > 0) {
      const first = track.firstElementChild;
      first.classList.remove('featured');
      first.nextElementSibling.classList.add('featured');
      track.style.transform = `translateX(${-width()}px)`;
      setTimeout(() => {
        mfg.classList.add('notrans');
        track.appendChild(first);
        track.style.transform = 'translateX(0)';
        void track.offsetWidth;
        mfg.classList.remove('notrans');
        busy = false;
        syncDots();
      }, 560);
    } else {
      mfg.classList.add('notrans');
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transform = `translateX(${-width()}px)`;
      void track.offsetWidth;
      mfg.classList.remove('notrans');
      track.children[1].classList.remove('featured');
      track.children[0].classList.add('featured');
      track.style.transform = 'translateX(0)';
      setTimeout(() => { busy = false; syncDots(); }, 560);
    }
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'mfg-dot';
    dot.setAttribute('aria-label', `Manufacturing detail ${i + 1}: ${track.children[i].querySelector('figcaption').textContent}`);
    dot.addEventListener('click', () => jump(i));
    dots.push(dot);
    dotsWrap.appendChild(dot);
  }
  document.getElementById('mfgPrev').addEventListener('click', () => move(-1));
  document.getElementById('mfgNext').addEventListener('click', () => move(1));
  syncDots();
})();

// Approved B2 opening, finish preview and image-aligned narrative connectors.
(() => {
 'use strict';
 const overlay=document.querySelector('.intro-overlay'),product=document.querySelector('.intro-product'),hole=document.querySelector('#aperture-hole'),orbit=document.querySelector('.particle-orbit'),skip=document.querySelector('.intro-skip'),word=document.querySelector('.intro-wordmark'),white=document.querySelector('#white-center'),main=document.querySelector('main'),nav=document.querySelector('.nav');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,start=0,cancelled=false;
 const dots=[];for(let band=0;band<6;band++)for(let i=0;i<100;i++){const d=document.createElementNS('http://www.w3.org/2000/svg','circle'),angle=i/100*Math.PI*2+band*.023,r=184+band*6;d.setAttribute('cx',250+Math.cos(angle)*r);d.setAttribute('cy',250+Math.sin(angle)*r);d.setAttribute('r',.65+band*.05);d.setAttribute('fill','#d8e0e0');d.dataset.angle=angle;orbit.append(d);dots.push(d);}
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
 function finish(){cancelled=true;cancelAnimationFrame(raf);overlay.hidden=true;skip.hidden=true;document.body.classList.remove('intro-playing');main.inert=false;nav.inert=nav.classList.contains('is-hidden');document.dispatchEvent(new Event('vocci:intro-complete'));if(document.activeElement===skip)document.querySelector('.wordmark').focus({preventScroll:true});}
 function frame(now){const t=(now-start)/1000,fill=ease(clamp((t-1.5)/.6)),expand=Math.pow(clamp((t-2.1)/1.65),2.8),scale=1+expand*35,rotate=14*Math.sin(Math.min(t,1.5)/1.5*Math.PI),cx=innerWidth/2,cy=innerHeight/2;
 hole.setAttribute('cx',cx);hole.setAttribute('cy',cy);hole.setAttribute('rx',57*fill*scale);hole.setAttribute('ry',37*fill*scale);hole.setAttribute('transform',`rotate(37 ${cx} ${cy})`);['cx','cy','rx','ry','transform'].forEach(a=>white.setAttribute(a,hole.getAttribute(a)));white.style.opacity=String(1-ease(clamp((t-2.1)/.65)));product.style.transform=`translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})`;product.style.opacity=String(1-ease(clamp((t-3.25)/.4)));word.style.opacity=String((1-ease(clamp((t-1.4)/.5)))*ease(clamp(t/.4)));orbit.style.transform=`rotate(${t*28}deg)`;orbit.style.opacity=String(1-ease(clamp((t-1.6)/.5)));dots.forEach(d=>d.setAttribute('opacity',String(.12+.56*Math.pow((Math.sin(Number(d.dataset.angle)-t*2.2)+1)/2,4))));if(t>=3.8)finish();else raf=requestAnimationFrame(frame);}
 async function play(){if(reduce.matches||location.hash||window.scrollY>20){finish();return;}document.body.classList.add('intro-playing');main.inert=true;nav.inert=true;await Promise.all([...document.querySelectorAll('.hero img,.intro-product img')].map(i=>i.decode().catch(()=>{})));if(cancelled)return;start=performance.now();frame(start);}
 skip.addEventListener('click',finish);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)finish();});reduce.addEventListener('change',()=>{if(reduce.matches&&!overlay.hidden)finish();});
 const buttons=[...document.querySelectorAll('[data-color]')],images=[...document.querySelectorAll('[data-color-image]')],auto=document.querySelector('#auto-color');let current=0,timer,wantsAuto=!reduce.matches,heroVisible=true,ready=false;
 function select(i){current=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));images.forEach(img=>{const on=img.dataset.colorImage===buttons[i].dataset.color;img.classList.toggle('active',on);img.setAttribute('aria-hidden',String(!on));});document.querySelector('#color-name').textContent=buttons[i].getAttribute('aria-label');}
 function sync(){clearInterval(timer);auto.setAttribute('aria-pressed',String(wantsAuto));auto.setAttribute('aria-label',wantsAuto?'Pause automatic finish preview':'Play automatic finish preview');auto.textContent=wantsAuto?'Pause':'Play';if(wantsAuto&&ready&&heroVisible&&!document.hidden)timer=setInterval(()=>select((current+1)%4),1400);}
 buttons.forEach((b,i)=>{b.addEventListener('click',()=>{wantsAuto=false;select(i);sync();});b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;wantsAuto=false;select(n);buttons[n].focus();sync();});});auto.addEventListener('click',()=>{wantsAuto=!wantsAuto;sync();});document.addEventListener('visibilitychange',sync);document.addEventListener('vocci:intro-complete',()=>{ready=true;sync();});reduce.addEventListener('change',()=>{if(reduce.matches){wantsAuto=false;sync();}});
 new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;sync();}).observe(document.querySelector('.hero'));
 play();sync();
 function connectors(){document.querySelectorAll('.highlight').forEach(card=>{const pic=card.querySelector('.b2-picture').getBoundingClientRect(),rect=card.getBoundingClientRect(),target=card.querySelector('[data-connector]').getBoundingClientRect(),svg=card.querySelector('.interaction-leader');const x=pic.left-rect.left+pic.width*Number(card.dataset.ringX),y=pic.top-rect.top+pic.height*Number(card.dataset.ringY),tx=target.left-rect.left+target.width*.05,ty=target.top-rect.top+target.height*.65;svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);svg.querySelector('path').setAttribute('d',`M${x} ${y} C${x+70} ${y-95},${tx-65} ${ty+35},${tx} ${ty}`);svg.querySelector('circle').setAttribute('cx',x);svg.querySelector('circle').setAttribute('cy',y);});}
 addEventListener('resize',connectors);addEventListener('load',connectors);document.fonts.ready.then(connectors);connectors();
 // Animated annotations only run while their full-screen card is on screen.
 new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.1}).observe(document.querySelector('.highlight-capture'));
})();
