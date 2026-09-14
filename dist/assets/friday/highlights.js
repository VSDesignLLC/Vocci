
(() => {
 const section=document.querySelector('.campaign-highlights');
 const cards=[...section.querySelectorAll('.highlight')];
 const tabs=[...section.querySelectorAll('[data-campaign]')];
 const panel=document.getElementById('campaign-panel');
 const chapterButtons=[...section.querySelectorAll('[data-chapter]')];
 let activeIndex=0;
 function playScene(index){
  activeIndex=index;
  chapterButtons.forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));
  cards.forEach(card=>card.classList.remove('scene-playing'));
  if(['story','hybrid'].includes(section.dataset.campaign) && index>=0){ const card=cards[index]; void card.offsetWidth; card.classList.add('scene-playing'); }
 }
 document.addEventListener('vocci:highlight-change',event=>playScene(event.detail.index));
 function select(mode,moveFocus=false){
  const campaign=vocciCampaigns[mode];if(!campaign)return;
  tabs.forEach(tab=>{const active=tab.dataset.campaign===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&moveFocus)tab.focus({preventScroll:true});});
  panel.setAttribute('aria-labelledby','tab-'+mode);section.dataset.campaign=mode;
  cards.forEach((card,i)=>{
   const d=campaign.slides[i],pic=card.querySelector('.b2-picture');
   card.dataset.visual=d.visual||'people';
   
   ['x','y','w','h'].forEach((key,j)=>pic.style.setProperty('--focus-'+key,d.focus[j]+'%'));
   pic.querySelectorAll('img').forEach(img=>{img.src=d.image;});pic.querySelector('.b2-soft').alt=d.label;
   card.querySelector('.b2-index').textContent=`0${i+1} / 05 · ${d.label}`;
   card.querySelector('.scene-status>span').textContent=d.audience||campaign.name;
   card.querySelector('.campaign-quote').textContent=d.quote;
   card.querySelector('.intro-audience').textContent=d.audience||'';
   card.querySelector('.scene-intro p').textContent=d.question||'';
   card.querySelector('.campaign-kicker').textContent=d.kicker;
   card.querySelector('.campaign-note p').textContent=d.note;
   let summary=card.querySelector('.campaign-summary');if(!summary){summary=document.createElement('p');summary.className='campaign-summary';card.querySelector('.campaign-heading').insertBefore(summary,card.querySelector('.campaign-link'));}summary.textContent=d.note;
   card.querySelector('.campaign-foot').textContent=d.foot;
   const title=card.querySelector('h2');title.replaceChildren();d.title.split('<br>').forEach((line,j)=>{if(j)title.append(document.createElement('br'));title.append(document.createTextNode(line));});
  });
  document.getElementById('campaign-announcement').textContent=campaign.label+'，五个叙事片段';
  // Both directions restart at the first slide for a fair comparison.
  window.dispatchEvent(new Event('resize'));
  playScene(moveFocus?0:activeIndex);
  if(moveFocus)window.scrollTo({top:section.getBoundingClientRect().top+window.scrollY,behavior:'instant'});
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(tab.dataset.campaign,true));
  tab.addEventListener('keydown',event=>{let next;if(['ArrowRight','ArrowLeft'].includes(event.key))next=(i+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(tabs[next].dataset.campaign,true);});
 });
 chapterButtons.forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.chapter),stage=section.querySelector('.highlight-stage');
  const stride=stage.offsetHeight+(section.offsetHeight-stage.offsetHeight*cards.length)/cards.length;
  window.scrollTo({top:section.getBoundingClientRect().top+window.scrollY+stride*index+1,behavior:'instant'});
 }));
 select('story');
})();
