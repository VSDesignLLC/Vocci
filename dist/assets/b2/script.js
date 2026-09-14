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
    const inHighlights = scrollPosition >= highlightStart - 80 && scrollPosition < highlightStart + highlights.offsetHeight;
    let hidden = navigation.classList.contains('is-hidden');
    if (!inHighlights) hidden = false;
    else hidden = true;
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
  let lastSceneIndex = -2;
  function measureHighlights() {
    highlightStart = highlights.getBoundingClientRect().top + window.scrollY;
    photoHeight = highlightStage.offsetHeight;
    photoHold = highlightCards.length ? (highlights.offsetHeight - photoHeight * highlightCards.length) / highlightCards.length : 0;
  }
  function updateHighlights() {
    if (!highlightCards.length) return;
    const distance = window.scrollY - highlightStart;
    const readableCard = Math.max(0, Math.min(highlightCards.length - 1, Math.floor(Math.max(0, distance) / (photoHeight + photoHold))));
    highlightCards.forEach((card, index) => { card.inert = index !== readableCard; card.setAttribute('aria-hidden', String(index !== readableCard)); });
    const enteredIndex = distance >= -80 && distance < highlights.offsetHeight ? readableCard : -1;
    if (enteredIndex !== lastSceneIndex) { lastSceneIndex = enteredIndex; document.dispatchEvent(new CustomEvent('vocci:highlight-change', {detail:{index:enteredIndex}})); }
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

// Hero direction 03 owns the ring opening. The standalone finish card was removed.
(() => {
 document.querySelector('.intro-overlay').hidden=true;
 document.querySelector('.intro-skip').hidden=true;
 document.dispatchEvent(new Event('vocci:intro-complete'));
 const capture = document.querySelector('.highlight-capture');
 if (capture) new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.1}).observe(capture);
})();
