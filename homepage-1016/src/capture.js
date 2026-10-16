/* 1016 · ?capture=1 — a still, fully revealed page for importing into Figma (html.to.design).
   No intro, no 3D, no motion; every section shows its finished first state; pinned sections are laid flat;
   viewport height is frozen (default 900 desktop / 874 phone·tablet, or &h=…) so 100vh cells keep their designed size
   even when the importer renders the page in a very tall window. Normal visits never run any of this. */
(function(){
  var q=location.search; if(!/[?&]capture=1\b/.test(q)) return;
  var root=document.documentElement; root.classList.add('cap');
  var m=q.match(/[?&]h=(\d{3,4})/), H=m?+m[1]:(innerWidth>1100?900:874);
  window.__CAP_H=H;
  try{ sessionStorage.setItem('vocci-intro','1'); }catch(e){}
  try{ Object.defineProperty(window,'innerHeight',{configurable:true,get:function(){return H;}}); }catch(e){}
  var mm=window.matchMedia.bind(window);
  window.matchMedia=function(s){ if(/prefers-reduced-motion:\s*reduce/.test(s)) return {matches:true,media:s,addListener:function(){},removeListener:function(){},addEventListener:function(){},removeEventListener:function(){},onchange:null}; return mm(s); };
  /* 100vh → H px in every inline stylesheet */
  function freeze(){ Array.prototype.forEach.call(document.querySelectorAll('style'),function(st){ if(st.dataset.capvh) return; st.dataset.capvh=1;
    st.textContent=st.textContent.replace(/(-?\d*\.?\d+)[sdl]?vh\b/g,function(_,n){ return Math.round(parseFloat(n)*H/100)+'px'; }); }); }
  document.addEventListener('DOMContentLoaded',function(){
    freeze();
    document.querySelectorAll('img[loading="lazy"]').forEach(function(i){ i.loading='eager'; });
    document.querySelectorAll('.stage,.stage .pn,.split').forEach(function(e){ e.classList.add('in'); });
  });
  function flat(){
    document.querySelectorAll('.stage,.stage .pn,.split,section').forEach(function(e){ e.classList.add('in'); });
    /* pinned sections: the stage sticks inside a taller section — lay it flat at one screen */
    document.querySelectorAll('main section').forEach(function(s){ var st=Array.prototype.find.call(s.children,function(k){ return getComputedStyle(k).position==='sticky'; }); if(!st) return;
      if(s.offsetHeight>st.offsetHeight*1.3){ s.style.setProperty('height','auto','important'); s.style.setProperty('min-height','0','important'); st.style.setProperty('position','relative','important'); st.style.setProperty('top','0','important'); } });
    /* canvases (sound ring, footer particles) become plain images */
    document.querySelectorAll('canvas').forEach(function(c){ if(!c.width||!c.offsetWidth) return; try{ var u=c.toDataURL('image/png'); if(u.length<2000) return; var im=new Image(); im.src=u; im.alt=''; im.className=c.className; im.setAttribute('style',c.getAttribute('style')||''); var cs=getComputedStyle(c);
      ['position','top','left','right','bottom','width','height','inset','transform','opacity','z-index'].forEach(function(p){ im.style.setProperty(p,cs.getPropertyValue(p)); }); c.replaceWith(im); }catch(e){} });
    root.classList.add('cap-ready');
  }
  addEventListener('load',function(){ setTimeout(flat,1800); });
})();
