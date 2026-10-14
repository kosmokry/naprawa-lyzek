/* Название собирается из стальных прутьев, которые свариваются друг с другом по скроллу */
(function(){
const G={};
const stem=[[0,0],[0,10]];
const octo=[[1.5,0],[4.5,0],[6,1.8],[6,8.2],[4.5,10],[1.5,10],[0,8.2],[0,1.8],[1.5,0]];
const kk={w:6,p:[stem,[[0,5],[6,0]],[[1.6,3.67],[6,10]]]};
const bb={w:6,p:[stem,[[0,0],[3.8,0],[5.6,1.4],[5.6,3.6],[3.8,5],[0,5]],[[3.8,5],[5.9,6.4],[5.9,8.6],[3.9,10],[0,10]]]};
const pp={w:6,p:[stem,[[0,0],[3.8,0],[5.6,1.5],[5.6,3.9],[3.8,5.4],[0,5.4]]]};
const ee={w:6,p:[stem,[[0,0],[5.5,0]],[[0,5],[4.6,5]],[[0,10],[5.5,10]]]};
const hh={w:6,p:[stem,[[6,0],[6,10]],[[0,5],[6,5]]]};
const tt={w:6,p:[[[0,0],[6,0]],[[3,0],[3,10]]]};
G['К']=G['K']=kk;G['О']=G['O']=G['0']={w:6,p:[octo]};G['В']=G['B']=bb;G['Р']=G['P']=pp;G['Е']=G['E']=ee;G['Н']=G['H']=hh;G['Т']=G['T']=tt;
G['Ш']={w:6,p:[stem,[[3,0],[3,10]],[[6,0],[6,10]],[[0,10],[6,10]]]};
G['Ц']={w:6.4,p:[stem,[[5,0],[5,10]],[[0,10],[6.4,10]],[[6.4,10],[6.4,12]]]};
G['N']={w:6,p:[[[0,10],[0,0]],[[0,0],[6,10]],[[6,10],[6,0]]]};
G['A']={w:6,p:[[[0,10],[3,0]],[[3,0],[6,10]],[[.96,6.8],[5.04,6.8]]]};
G['R']={w:6,p:[stem,[[0,0],[3.8,0],[5.6,1.5],[5.6,3.9],[3.8,5.4],[0,5.4]],[[2.8,5.4],[6,10]]]};
G['W']={w:9,p:[[[0,0],[2.2,10]],[[2.2,10],[4.5,3]],[[4.5,3],[6.8,10]],[[6.8,10],[9,0]]]};
G['Ł']={w:6,p:[stem,[[0,10],[5.5,10]],[[-1.2,6.2],[2.2,4.2]]]};
G['Y']={w:6,p:[[[0,0],[3,5]],[[6,0],[3,5]],[[3,5],[3,10]]]};
G['Ż']={w:6,p:[[[0,0],[6,0]],[[6,0],[0,10]],[[0,10],[6,10]],[[3,-3],[3,-1.7]]]};
G['U']={w:6,p:[[[0,0],[0,8.2],[1.8,10],[4.2,10],[6,8.2],[6,0]]]};
G['C']={w:6,p:[[[6,1.8],[4.5,0],[1.5,0],[0,1.8],[0,8.2],[1.5,10],[4.5,10],[6,8.2]]]};
const SW=1.7,ADV=3;
const ease=t=>1-Math.pow(1-t,3);
const NS='http://www.w3.org/2000/svg';
const el=(n,a,p)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};

function segInter(a,b,c,d){const r=[b[0]-a[0],b[1]-a[1]],s=[d[0]-c[0],d[1]-c[1]];const den=r[0]*s[1]-r[1]*s[0];if(Math.abs(den)<1e-9)return null;const t=((c[0]-a[0])*s[1]-(c[1]-a[1])*s[0])/den,u=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den;const e=.02;if(t>=-e&&t<=1+e&&u>=-e&&u<=1+e)return[a[0]+t*r[0],a[1]+t*r[1]];return null}

window.initWeld=function(root,text,hooks){
  const lines=text.split('|');
  const bars=[],joints=[];
  let maxW=0;const layouts=lines.map(l=>{let x=0;const gl=[];[...l.toUpperCase()].forEach(ch=>{if(ch===' '){x+=4;return}const g=G[ch]||G['O'];gl.push({g,x});x+=g.w+ADV});const w=x-ADV;maxW=Math.max(maxW,w);return{gl,w}});
  const lineH=16.5,H=lines.length*lineH+2,W=maxW+SW*2;
  const svg=el('svg',{viewBox:`${-SW} ${-4.5} ${W} ${H}`,class:'weld-svg',role:'img','aria-label':lines.join(' ')},root);
  const defs=el('defs',{},svg);
  const f=el('filter',{id:'wglow',x:'-100%',y:'-100%',width:'300%',height:'300%'},defs);el('feGaussianBlur',{stdDeviation:'.55'},f);
  const gb=el('g',{},svg),gj=el('g',{},svg);
  let order=0;
  layouts.forEach((L,li)=>{const ox=(maxW-L.w)/2,oy=li*lineH;
    L.gl.forEach(({g,x})=>{const segs=[];g.p.forEach(pl=>{for(let i=0;i<pl.length-1;i++)segs.push([[pl[i][0]+x+ox,pl[i][1]+oy],[pl[i+1][0]+x+ox,pl[i+1][1]+oy]])});
      const jp=[];segs.forEach((s,i)=>{for(let j=i+1;j<segs.length;j++){const q=segInter(s[0],s[1],segs[j][0],segs[j][1]);if(q&&!jp.some(z=>Math.hypot(z[0]-q[0],z[1]-q[1])<.3))jp.push(q)}});
      const idx0=bars.length;
      segs.forEach(s=>{const grp=el('g',{},gb);const len=Math.hypot(s[1][0]-s[0][0],s[1][1]-s[0][1]);
        const mk=(w,c,o)=>el('line',{x1:s[0][0],y1:s[0][1],x2:s[1][0],y2:s[1][1],stroke:c,'stroke-width':w,'stroke-linecap':'butt',opacity:o||1},grp);
        // прутья чуть длиннее, чтобы сварные стыки перекрывались
        const dx=(s[1][0]-s[0][0])/len,dy=(s[1][1]-s[0][1])/len,ext=SW/2*.9;
        [s[0],s[1]].forEach((p,k)=>{const sg=k?1:-1;p=[p[0]+dx*ext*sg,p[1]+dy*ext*sg]});
        const ln=(w,c,o)=>el('line',{x1:s[0][0]-dx*ext,y1:s[0][1]-dy*ext,x2:s[1][0]+dx*ext,y2:s[1][1]+dy*ext,stroke:c,'stroke-width':w,'stroke-linecap':'butt',opacity:o||1},grp);
        grp.innerHTML='';ln(SW,'#2b2f35');ln(SW*.78,'#5c636e');ln(SW*.42,'#9aa2ad',.85);ln(SW*.12,'#e4e8ee',.9);
        bars.push({g:grp,mid:[(s[0][0]+s[1][0])/2,(s[0][1]+s[1][1])/2],ord:order++,dx:(Math.random()-.5)*14,dy:-6-Math.random()*16,rot:(Math.random()-.5)*60})});
      jp.forEach(q=>{const grp=el('g',{},gj);
        const hot=el('circle',{cx:q[0],cy:q[1],r:SW*.62,fill:'#ff5a0a',filter:'url(#wglow)',opacity:0},grp);
        const ring=el('g',{opacity:0},grp);
        const n=9;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.random()*.4,rr=SW*(.46+Math.random()*.1),cr=SW*(.15+Math.random()*.07);
          el('circle',{cx:q[0]+Math.cos(a)*rr,cy:q[1]+Math.sin(a)*rr*.9,r:cr,fill:'#c3c9d2',stroke:'#4b515b','stroke-width':.07},ring)}
        el('circle',{cx:q[0],cy:q[1],r:SW*.4,fill:'#9ba2ad',stroke:'#4b515b','stroke-width':.07},ring);
        el('circle',{cx:q[0]-SW*.1,cy:q[1]-SW*.1,r:SW*.16,fill:'#e9edf2',opacity:.8},ring);
        const ring2=el('g',{opacity:0},grp);
        joints.push({q,hot,ring,ring2,ord:idx0+Math.floor(jp.indexOf(q)*0)})});
    });
  });
  // порядок сварки: слева направо
  joints.sort((a,b)=>a.q[1]-b.q[1]<-8?-1:a.q[1]-b.q[1]>8?1:a.q[0]-b.q[0]);
  const N=bars.length,J=joints.length;
  function setP(p){
    // фаза 1 (0..0.6): прутья встают на места слева направо, фаза 2: стыки свариваются
    bars.forEach((b,i)=>{const t0=(b.mid[0]/maxW)*.45+(b.mid[1]/(H))*.15;const k=Math.min(1,Math.max(0,(p-t0*.6)/.28));const e=ease(k),r=1-e;
      b.g.setAttribute('transform',`translate(${b.dx*r} ${b.dy*r}) rotate(${b.rot*r} ${b.mid[0]} ${b.mid[1]})`);b.g.style.opacity=k>0?1:0});
    let active=null;
    joints.forEach((j,i)=>{const t=.32+(i/J)*.62;const k=(p-t)/.06;const welded=k>=0;const heat=welded?Math.max(0,1-k*1.0):0;
      j.hot.setAttribute('opacity',welded?Math.min(1,heat*1.2+.0):0);j.ring.setAttribute('opacity',welded?1:0);
      
      if(welded&&heat>.05&&heat<1)active=j});
    hooks&&hooks.onActive&&hooks.onActive(active?svgPoint(active.q):null,p);
  }
  function svgPoint(q){const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;return{x:r.left+(q[0]-vb.x)/vb.width*r.width,y:r.top+(q[1]-vb.y)/vb.height*r.height}}
  setP(0);
  return{setP,svg};
};
})();
