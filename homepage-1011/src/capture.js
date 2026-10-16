/* 1016 · ?capture=1 — a still, fully revealed page for importing into Figma (html.to.design).
   No intro, no 3D, no motion; every section shows its finished first state; pinned sections are laid flat;
   viewport height is frozen (default 900 desktop / 1180 tablet / 874 phone, or &h=…) so 100vh cells keep their designed size
   even when the importer renders the page in a very tall window. Normal visits never run any of this. */
(function(){
  var q=location.search; if(!/[?&]capture=1\b/.test(q)) return;
  var root=document.documentElement; root.classList.add('cap');
  if(/[?&]raf=1\b/.test(q)) window.requestAnimationFrame=function(cb){ return setTimeout(function(){ cb(performance.now()); },16); };   /* lets canvases draw in a background tab (asset export) */
  var m=q.match(/[?&]h=(\d{3,4})/), H=m?+m[1]:(innerWidth>1100?900:innerWidth>700?1180:874);
  window.__CAP_H=H;
  try{ sessionStorage.setItem('vocci-intro','1'); }catch(e){}
  try{ Object.defineProperty(window,'innerHeight',{configurable:true,get:function(){return H;}}); }catch(e){}
  var mm=window.matchMedia.bind(window);
  if(!/[?&]raf=1\b/.test(q)) window.matchMedia=function(s){ if(/prefers-reduced-motion:\s*reduce/.test(s)) return {matches:true,media:s,addListener:function(){},removeListener:function(){},addEventListener:function(){},removeEventListener:function(){},onchange:null}; return mm(s); };
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
    /* nothing sticks or hides while the importer scrolls: every sticky / fixed block (the pinned hero, the footer that waits under the page) sits in normal flow, and the footer is shown */
    document.querySelectorAll('main *, main').forEach(function(e){ var c=getComputedStyle(e); if((c.position==='sticky'||c.position==='fixed')&&!e.classList.contains('nav')){ e.style.setProperty('position','relative','important'); e.style.setProperty('top','auto','important'); e.style.setProperty('bottom','auto','important'); } });
    var ft=document.getElementById('footer'); if(ft){ ft.style.setProperty('visibility','visible','important'); ft.querySelectorAll('*').forEach(function(e){ if(getComputedStyle(e).visibility==='hidden') e.style.setProperty('visibility','visible','important'); }); }
    /* importers don't honour overflow clipping: hidden layers are dropped, and any picture that overflows its clipping cell becomes a
       background on a box exactly the size of that cell (same crop, same scale) — so no section grows taller than one screen */
    document.querySelectorAll('main *').forEach(function(e){ var c=getComputedStyle(e); if((c.position==='absolute'||c.position==='fixed')&&+c.opacity<.05&&!e.closest('.nav')) e.style.setProperty('display','none','important'); });
    document.querySelectorAll('main img').forEach(function(im){ if(!im.offsetWidth||!im.complete||!im.naturalWidth) return; var c=getComputedStyle(im); if(c.display==='none') return;
      var clip=null; for(var a=im.parentElement;a&&a.tagName!=='MAIN';a=a.parentElement){ var o=getComputedStyle(a).overflow; if(o!=='visible'){ clip=a; break; } } if(!clip) return;
      var r=im.getBoundingClientRect(), k=clip.getBoundingClientRect(); if(r.left>=k.left-1&&r.top>=k.top-1&&r.right<=k.right+1&&r.bottom<=k.bottom+1) return;
      var L=Math.max(r.left,k.left), T=Math.max(r.top,k.top), R=Math.min(r.right,k.right), B=Math.min(r.bottom,k.bottom); if(R<=L||B<=T){ im.style.setProperty('display','none','important'); return; }
      var cr=clip.getBoundingClientRect(), d=document.createElement('div');
      d.className=im.className+' cap-crop'; d.setAttribute('role','img'); d.setAttribute('aria-label',im.alt||'');
      var fit=c.objectFit, pos=c.objectPosition, iw=im.naturalWidth, ih=im.naturalHeight, bw=r.width, bh=r.height, sz;
      if(fit==='cover'||fit==='contain'){ var sc=(fit==='cover'?Math.max:Math.min)(bw/iw,bh/ih); var dw=iw*sc, dh=ih*sc, pp=pos.split(' ').map(parseFloat); var ox=(bw-dw)*((isNaN(pp[0])?50:pp[0])/100), oy=(bh-dh)*((isNaN(pp[1])?50:pp[1])/100); sz=[dw,dh,r.left+ox,r.top+oy]; } else sz=[bw,bh,r.left,r.top];
      d.style.cssText='position:absolute;left:'+(L-cr.left)+'px;top:'+(T-cr.top)+'px;width:'+(R-L)+'px;height:'+(B-T)+'px;background:url("'+im.currentSrc+'") no-repeat;background-size:'+sz[0]+'px '+sz[1]+'px;background-position:'+(sz[2]-L)+'px '+(sz[3]-T)+'px;opacity:'+c.opacity+';z-index:'+c.zIndex+';pointer-events:none;transform:none;translate:none;scale:none;clip-path:none';
      im.parentNode.insertBefore(d, im); im.style.setProperty('display','none','important');   /* same place in the paint order as the picture it replaces */
      var op=d.offsetParent||document.body, orr=op.getBoundingClientRect(), ocs=getComputedStyle(op);
      d.style.left=(L-orr.left-(parseFloat(ocs.borderLeftWidth)||0))+'px'; d.style.top=(T-orr.top-(parseFloat(ocs.borderTopWidth)||0))+'px'; });
    /* canvases (sound ring, footer particles) only draw once they are on screen: visit each, then turn them into plain images */
    var cvs=Array.prototype.slice.call(document.querySelectorAll('canvas')), k=0;
    (function next(){ if(k>=cvs.length){ scrollTo(0,0); root.classList.add('cap-ready'); return; }
      var c=cvs[k++], r=c.getBoundingClientRect(); scrollTo(0, Math.max(0, r.top+scrollY-H/3));
      setTimeout(function(){ snap(c); next(); }, 900); })();
  }
  function snap(c){ if(!c.isConnected||!c.width||!c.offsetWidth) return; try{ var u=c.toDataURL('image/png'); if(u.length<4000) return; var im=new Image(); im.src=u; im.alt=''; im.className=c.className; im.setAttribute('style',c.getAttribute('style')||''); var cs=getComputedStyle(c);
      ['position','top','left','right','bottom','width','height','inset','transform','opacity','z-index'].forEach(function(p){ im.style.setProperty(p,cs.getPropertyValue(p)); }); c.replaceWith(im); }catch(e){} }
  addEventListener('load',function(){ setTimeout(flat,1800); });
})();
