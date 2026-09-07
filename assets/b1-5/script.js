(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-button');
  const menu = document.getElementById('menu-panel');
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
  menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuButton.focus();}});
  document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
  const detailButtons=[...document.querySelectorAll('[data-detail]')];
  const frame=document.querySelector('.hardware-frame');
  const captions={titanium:'The ring, inside and out.',fit:'A closer look at proportion.',button:'A small gesture, up close.',water:'The surface, in detail.',recording:'Room for what matters.',case:'Ring and charging case.'};
  detailButtons.forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.detail;
    detailButtons.forEach(b=>{const active=b===button;b.setAttribute('aria-expanded',String(active));b.parentElement.classList.toggle('active',active);b.querySelector('.toggle').textContent=active?'−':'+';});
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
