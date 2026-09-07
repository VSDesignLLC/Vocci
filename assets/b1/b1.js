(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 920px)');
  const scrub = document.querySelector('.scrub');
  const tabs = [...document.querySelectorAll('[data-select-step]')];
  const steps = [...document.querySelectorAll('[data-step]')];
  const panes = [...document.querySelectorAll('[data-pane]')];
  const blocks = [...document.querySelectorAll('.pblock')];
  let active = -1;
  const useScroll = () => !reduced.matches && !narrow.matches;

  function showStep(index) {
    if (active === index) return;
    active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      steps[i].hidden = i !== index;
      steps[i].classList.toggle('active', i === index);
      panes[i].hidden = i !== index;
      panes[i].classList.toggle('active', i === index);
      blocks[i].classList.toggle('on', i === index);
      blocks[i].classList.toggle('done', i < index);
    });
  }
  function chooseStep(index) {
    if (useScroll()) {
      const top = window.scrollY + scrub.getBoundingClientRect().top;
      const travel = scrub.offsetHeight - (window.innerHeight - 58);
      window.scrollTo({top: top - 58 + travel * ((index + .35) / 4), behavior: 'instant'});
    }
    showStep(index);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseStep(i));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      chooseStep(next);
      tabs[next].focus({preventScroll: true});
    });
  });
  let ticking = false;
  function syncScroll() {
    ticking = false;
    if (!useScroll()) return;
    const rect = scrub.getBoundingClientRect();
    const travel = rect.height - (innerHeight - 58);
    const progress = Math.max(0, Math.min(1, (58 - rect.top) / travel));
    showStep(Math.min(3, Math.floor(progress * 4)));
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(syncScroll); }
  }, {passive: true});
  window.addEventListener('resize', syncScroll);
  reduced.addEventListener('change', syncScroll);
  narrow.addEventListener('change', syncScroll);
  showStep(0);
  syncScroll();

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
    dot.setAttribute('aria-label', `Product detail ${i + 1}: ${track.children[i].querySelector('h3').textContent}`);
    dot.addEventListener('click', () => jump(i));
    dots.push(dot);
    dotsWrap.appendChild(dot);
  }
  document.getElementById('mfgPrev').addEventListener('click', () => move(-1));
  document.getElementById('mfgNext').addEventListener('click', () => move(1));
  syncDots();
})();
