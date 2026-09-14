(()=>{'use strict';const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const detailButtons=[...document.querySelectorAll('[data-detail]')];
  const frame=document.querySelector('.hardware-frame');
  const captions={titanium:'Lumen · Polished silver',fit:'3–5 g · 6.8 mm wide · 2.85 mm thin',button:'2 presses → 2 vibrations',water:'Recording · Storage · Connectivity',recording:'Up to 8 hours · IP67',case:'30 min to 80% · Up to 3 full charges · USB-C'};
  detailButtons.forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.detail;
    frame.querySelector(".restored-finishes").hidden=mode!=="titanium";
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
document.querySelectorAll('[data-restored-finish]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-restored-finish]').forEach(x=>x.setAttribute('aria-pressed',x===b));frame.querySelector('.hw-angle').src='assets/b2/ring-'+b.dataset.restoredFinish+'.png';frame.querySelector('.hw-angle').alt=b.dataset.name+' Vocci ring';frame.querySelector('.hardware-caption').textContent=b.dataset.name;}));

})();