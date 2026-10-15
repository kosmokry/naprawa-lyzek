(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);
const touch=matchMedia('(pointer:coarse)').matches;
ScrollTrigger.config({ignoreMobileResize:true});
if(touch)ScrollTrigger.normalizeScroll({allowNestedScroll:true,type:'touch,wheel,pointer'});
const isDesk=()=>innerWidth>1000;

/* smooth scroll */
let lenis=null;
if(!reduce){lenis=new Lenis({lerp:.09,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}

/* progress bar, header hide, cursor */
const prog=$('.prog'),hdr=$('.hdr');let lastY=0;
addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${h?y/h:0})`;hdr.classList.toggle('bg',y>60);lastY=y},{passive:true});
const cur=$('.cur');
if(cur&&matchMedia('(hover:hover)').matches){let x=0,y=0,cx=0,cy=0;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});gsap.ticker.add(()=>{cx+=(x-cx)*.2;cy+=(y-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`});
 document.addEventListener('pointerover',e=>{const t=e.target.closest('a,button,.card,.gal figure,.hot,.drop');cur.classList.toggle('hv',!!t);const l=t&&(t.dataset.cur||(t.classList.contains('card')?'→':t.matches('.gal figure')?'+':''));cur.querySelector('span').textContent=l||''})}
$('.burger')?.addEventListener('click',()=>{document.body.classList.toggle('mn');lenis&&(document.body.classList.contains('mn')?lenis.stop():lenis.start())});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('mn');lenis&&lenis.start()}));

/* text splitting */
function splitWords(el){const nodes=[...el.childNodes];el.innerHTML='';nodes.forEach(n=>{if(n.nodeType===3){n.textContent.split(/([ \t\r\n]+)/).forEach(p=>{if(!p)return;if(/^[ \t\r\n]+$/.test(p)){el.append(' ');return}const w=document.createElement('span');w.className='w';w.innerHTML='<i>'+p+'</i>';el.append(w)})}else{const c=n.cloneNode(true);const inner=document.createElement(c.tagName.toLowerCase());inner.className=c.className;[...c.textContent.split(/([ \t\r\n]+)/)].forEach(p=>{if(!p)return;if(/^[ \t\r\n]+$/.test(p)){inner.append(' ');return}const w=document.createElement('span');w.className='w';w.innerHTML='<i>'+p+'</i>';inner.append(w)});el.append(inner)}});return $$('.w>i',el)}
function glue(el){const ws=$$('.w',el);ws.forEach((w,i)=>{const t=w.textContent;if(i>0&&/^[,.:;!?)»…]+$/.test(t)){ws[i-1].querySelector('i').append(t);w.remove()}})}
$$('[data-split]').forEach(el=>{splitWords(el);glue(el);el._i=$$('.w>i',el)});

/* page transition */
const curtain=$('.curtain');
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.target||e.metaKey||e.ctrlKey)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin&&location.protocol!=='file:')return;if(u.pathname===location.pathname&&u.hash)return;if(!/\.html$|\/$/.test(u.pathname)&&location.protocol!=='file:')return;if(u.href===location.href)return;e.preventDefault();gsap.to(curtain,{yPercent:-100,startAt:{yPercent:0,y:'100%'},duration:.7,ease:'power3.inOut',onComplete:()=>location.href=a.href})});
addEventListener('pageshow',e=>{if(e.persisted)gsap.set(curtain,{y:'100%',yPercent:0})});

/* preloader */
const pre=$('.pre');
function intro(){
  $$('.hero h1 [data-split]').forEach(()=>{});
  const tl=gsap.timeline({defaults:{ease:'power4.out'}});
  const h1=$('.hero h1');
  if(h1&&h1._i)tl.from(h1._i,{yPercent:115,rotate:3,duration:1.2,stagger:.07},0.1);
  tl.from('.hero .sub,.hero .cta,.hero .scroll,.hero .meta,.hero .crumb',{y:30,opacity:0,duration:1,stagger:.1},.5);
  const bgimg=$('.hero .bg img');if(bgimg)tl.from(bgimg,{scale:1.25,duration:2.2,ease:'power3.out'},0);
}
function runPre(){
  if(!pre){intro();return}
  const n=$('.num',pre),teeth=$$('.teeth i',pre);const o={v:0};
  if(lenis)lenis.stop();
  gsap.to(o,{v:100,duration:reduce?.1:1.6,ease:'power2.inOut',onUpdate(){const v=Math.round(o.v);n.textContent=v;const k=Math.round(v/100*teeth.length);teeth.forEach((t,i)=>t.classList.toggle('on',i<k))},onComplete(){pre.classList.add('done');lenis&&lenis.start();setTimeout(()=>{pre.remove()},1200);intro()}});
}
if(sessionStorage.getItem('pre')||reduce){pre&&pre.remove();intro()}else{sessionStorage.setItem('pre','1');runPre()}
if(pre&&sessionStorage.getItem('pre')&&!pre.isConnected){}

/* generic reveals */
$$('[data-rv]').forEach(el=>gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
$$('[data-lines]').forEach(el=>{const i=el._i||splitWords(el);gsap.from(i,{yPercent:115,duration:1.1,stagger:.05,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 85%'}})});
$$('.frame img,.parallax').forEach(img=>gsap.fromTo(img,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
$$('[data-mask]').forEach(el=>{gsap.fromTo(el,{clipPath:'inset(14% 14% 14% 14% round 8px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 35%',scrub:true}})});

/* hero scroll */
const hero=$('.hero');
if(hero&&!reduce){gsap.to($('.in',hero),{yPercent:-12,opacity:.2,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom 30%',scrub:true}})}

/* marquee: speed follows scroll */
$$('.mq').forEach((m,idx)=>{const tr=$('.tr',m);tr.innerHTML+=tr.innerHTML;let x=0,dir=idx%2?1:-1,boost=0;const w=()=>tr.scrollWidth/2;
 ScrollTrigger.create({trigger:m,start:'top bottom',end:'bottom top',onUpdate:s=>{boost=s.getVelocity()/300}});
 gsap.ticker.add(()=>{boost*=.92;x+=dir*(.5+Math.abs(boost))*(boost<0?-1:1)*1;const ww=w();if(x<-ww)x+=ww;if(x>0)x-=ww;tr.style.transform=`translateX(${x}px)`})});

/* manifesto word scrub */
$$('.manif').forEach(m=>{const i=m._i||splitWords(m);gsap.to(i,{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:m,start:'top 78%',end:'bottom 45%',scrub:.6}})});

/* directions stacked */
const mm=gsap.matchMedia();
mm.add('(min-width:1001px)',()=>{
  $$('.dir').forEach((d,i)=>{const img=$('.img img',d);gsap.fromTo(img,{yPercent:-8},{yPercent:8,ease:'none',scrollTrigger:{trigger:d,start:'top bottom',end:'bottom top',scrub:true}});
    gsap.from($('h3',d)._i||$('h3',d),{yPercent:110,duration:1.1,stagger:.06,ease:'power4.out',scrollTrigger:{trigger:d,start:'top 60%'}});
    if(i>0){gsap.fromTo(d,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',ease:'none',scrollTrigger:{trigger:d,start:'top bottom',end:'top top',scrub:true}})}
  });
});

/* process pinned */
mm.add('(min-width:1001px)',()=>{
  const p=$('.proc');if(!p)return;const S=$$('.s',p),P=$$('.ph',p),D=$$('.dots i b',p);const N=S.length;
  gsap.set(S[0],{opacity:1});
  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top top',end:'+='+(N*90)+'%',pin:true,scrub:.5,anticipatePin:1}});
  for(let i=0;i<N;i++){
    tl.to(D[i],{scaleX:1,duration:1,ease:'none'},i);
    if(i<N-1){
      tl.to(S[i],{opacity:0,y:-40,duration:.3},i+.8).fromTo(S[i+1],{opacity:0,y:50},{opacity:1,y:0,duration:.35},i+.85)
        .fromTo(P[i+1],{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:.45,ease:'power2.inOut'},i+.75)
        .fromTo($('img',P[i+1]),{scale:1.3},{scale:1.05,duration:1.2,ease:'none'},i+.75);
    }
  }
  tl.to({}, {duration:.01},N);
});

/* horizontal cases: вертикальный скролл прокручивает ленту до конца, на всех экранах */
mm.add('(min-width:1px)',()=>{
  const c=$('.cs');if(!c)return;const trk=$('.trk',c);
  const dist=()=>Math.max(0,trk.scrollWidth-innerWidth);
  const t=gsap.to(trk,{x:()=>-dist(),ease:'none',force3D:true,scrollTrigger:{trigger:$('.pin',c),start:'top top',end:()=>'+='+dist(),pin:true,pinSpacing:true,scrub:touch?true:.6,invalidateOnRefresh:true,anticipatePin:1}});
  if(!touch)$$('.card .im img',c).forEach(im=>gsap.fromTo(im,{xPercent:-8},{xPercent:8,ease:'none',scrollTrigger:{trigger:im.closest('.card'),containerAnimation:t,start:'left right',end:'right left',scrub:true}}));
});

/* workshop reveal */
const wsr=$('.wsr');if(wsr){const fr=$('.fr',wsr);gsap.to(fr,{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:wsr,start:'top 90%',end:'top 5%',scrub:true}});}

/* counters */
$$('[data-count]').forEach(el=>{const to=+el.dataset.count,o={v:0};ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:()=>gsap.to(o,{v:to,duration:2.2,ease:'power3.out',onUpdate:()=>el.firstChild.textContent=Math.round(o.v)})})});

/* magnetic */
if(matchMedia('(hover:hover)').matches)$$('.btn,.lang a').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});b.addEventListener('pointerleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.5)'}))});

/* hotspots */
$$('.hot').forEach(h=>h.addEventListener('click',()=>h.classList.toggle('show')));

/* lightbox */
const lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="">';document.body.append(lb);
lb.onclick=()=>lb.classList.remove('on');
$$('.gal img').forEach(i=>i.addEventListener('click',()=>{lb.firstChild.src=i.src;lb.classList.add('on')}));
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});
const vio=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.3});$$('video[autoplay]').forEach(v=>vio.observe(v));

/* form */
$$('form').forEach(f=>{const d=$('.drop',f);if(d){const inp=$('input',d),lab=$('b',d);inp.addEventListener('change',()=>{if(inp.files.length)lab.textContent=[...inp.files].map(x=>x.name).join(', ')});['dragenter','dragover'].forEach(ev=>d.addEventListener(ev,e=>{e.preventDefault();d.classList.add('dr')}));['dragleave','drop'].forEach(ev=>d.addEventListener(ev,e=>{e.preventDefault();d.classList.remove('dr')}))}
 f.addEventListener('submit',e=>{e.preventDefault();$('.ok',f).style.display='block';f.reset()})});

/* footer: сварное название проявляется, на фронте сварки летят искры */
const ft=$('.ft');if(ft){const wm=$('.wm',ft),im=$('img',wm);let src=null;
  gsap.set(im,{clipPath:'inset(0 100% 0 0)'});
  ScrollTrigger.create({trigger:wm,start:'top 90%',end:'bottom 100%',scrub:.4,onUpdate:s=>{const p=s.progress;im.style.clipPath=`inset(0 ${(1-p)*100}% 0 0)`;const r=im.getBoundingClientRect();src=p>0&&p<.995?{x:r.left+r.width*(.03+.94*p),y:r.top+r.height*(.18+Math.random()*.64)}:null}});
  const cv=$('canvas',ft),cx=cv.getContext('2d');let Wd,Hh,sp=[];const rs=()=>{Wd=cv.width=ft.clientWidth;Hh=cv.height=ft.clientHeight};rs();addEventListener('resize',rs);
  let on=false;ScrollTrigger.create({trigger:ft,start:'top bottom',end:'bottom top',onToggle:s=>on=s.isActive});
  gsap.ticker.add(()=>{if(!on)return;cx.clearRect(0,0,Wd,Hh);const fr=ft.getBoundingClientRect();
    if(src&&sp.length<220)for(let i=0;i<5;i++)sp.push({x:src.x-fr.left,y:src.y-fr.top,vx:(Math.random()-.3)*6,vy:-1-Math.random()*4,l:1,s:1+Math.random()*2.4});
    sp=sp.filter(p=>p.l>0&&p.y<Hh);sp.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.18;p.vx*=.99;p.l-=.022;cx.globalAlpha=Math.max(p.l,0);cx.fillStyle=p.l>.6?'#fff2d0':p.l>.3?'#ffb46b':'#ff7a1a';cx.fillRect(p.x,p.y,p.s,p.s)});cx.globalAlpha=1})}

addEventListener('load',()=>{ScrollTrigger.refresh()});
})();
