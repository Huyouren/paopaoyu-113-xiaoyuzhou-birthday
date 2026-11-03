// Decorative canvas only. Quotes, dates and controls remain ordinary HTML.
export function bindStarRiver(){
 const section=document.querySelector('.galaxy-river'),canvas=section?.querySelector('.river-canvas');
 if(!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 let width=0,height=0,sceneHeight=0,windowTop=0,viewTop=0,dpr=1,frame=0,last=0,time=0,active=false,boxes=[],visibleBoxes=[],anchors=[],scheduled=false,scrollEnergy=0;
 let pointer={x:0,y:0,tx:0,ty:0,sceneX:0,sceneY:0,inside:false},trail=[],bursts=[],meteors=[],lastTrail=-1,nextMeteor=1.3,meteorIndex=0;
 const number=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const stopped=()=>document.documentElement.dataset.paused==='true'||document.documentElement.dataset.motion==='reduce'||document.hidden;
 const permitted=()=>active&&!stopped();
 function star(x,y,r,alpha,gold=false){if(y<windowTop-25||y>windowTop+height+25||alpha<.002)return;ctx.globalAlpha=alpha;ctx.fillStyle=gold?'#ffdbaf':'#e6d3ff';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 function point(y,phase=0){return width*(.5+(width<650?.4:.46)*Math.sin(y/(width<650?265:180)+2.55+phase));}
 function glow(x,y,r,color){if(y+r<windowTop||y-r>windowTop+height)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
 function clearance(x,y){let distance=42;for(const b of visibleBoxes){if(y<b.y-42||y>b.y+b.h+42)continue;const dx=Math.max(b.x-x,0,x-b.x-b.w),dy=Math.max(b.y-y,0,y-b.y-b.h);distance=Math.min(distance,Math.hypot(dx,dy));if(!distance)return 0;}const t=distance/42;return t*t*(3-2*t);}
 function measure(){
  const r=section.getBoundingClientRect();width=section.clientWidth;sceneHeight=section.offsetHeight;height=Math.min(sceneHeight,innerHeight+500);dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.height=height+'px';
  const rects=[];for(const el of section.querySelectorAll('blockquote,.star-meta,.river-heading,.river-ending')){if(el.tagName==='BLOCKQUOTE'){const range=document.createRange();range.selectNodeContents(el);for(const b of range.getClientRects())if(b.width>0)rects.push(b);}else rects.push(el.getBoundingClientRect());}
  boxes=rects.map(b=>({x:b.left-r.left-19,y:b.top-r.top-12,w:b.width+38,h:b.height+24}));
  anchors=[...section.querySelectorAll('.featured .river-quotation')].map((el,i)=>{const b=el.getBoundingClientRect();return {x:b.left-r.left+b.width*.44,y:b.top-r.top+b.height*.48,i};});updateWindow();
 }
 function updateWindow(){const r=section.getBoundingClientRect();viewTop=clamp(-r.top,0,sceneHeight);windowTop=clamp(-r.top-250,0,Math.max(0,sceneHeight-height));canvas.style.top=windowTop+'px';draw();}
 function cross(x,y,size,alpha){ctx.globalAlpha=alpha;ctx.strokeStyle='#ffe4c6';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-size,y);ctx.lineTo(x+size,y);ctx.moveTo(x,y-size);ctx.lineTo(x,y+size);ctx.stroke();}
 function meteor(){
  const i=meteorIndex++;let x=width*.78,y=viewTop+innerHeight*.32,best=-1;
  for(let j=0;j<14;j++){const px=width*(.18+number(i*19+j+45000)*.66),py=clamp(viewTop+100+number(i*23+j+46000)*(innerHeight*.65),40,sceneHeight-100),score=clearance(px,py);if(score>best){best=score;x=px;y=py;}}
  meteors.push({x,y,born:time,angle:Math.PI*.76,length:width<650?82:145,travel:width<650?115:200});nextMeteor=time+6.7+number(i+47000)*1.6;
 }
 function draw(){
  if(!width||!height)return;visibleBoxes=boxes.filter(b=>b.y+b.h>windowTop-80&&b.y<windowTop+height+80);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.translate(0,-windowTop);ctx.globalAlpha=1;
  // Slow nebula layers have independent phases; they never move any text.
  const first=Math.floor(windowTop/760);for(let i=first;i<=Math.ceil((windowTop+height)/760);i++){const y=i*760+180+Math.sin(time*.11+i)*27,x=width*(i%2?.91:.09)+Math.sin(time*.08+i)*width*.035+pointer.x;ctx.globalAlpha=.8+.16*Math.sin(time*.2+i);glow(x,y,width*.5,'#97639925');glow(width-x,y+390,width*.36,'#7c649724');}
  const starCount=Math.ceil(sceneHeight*width/3900);for(let i=0;i<starCount;i++){const depth=.3+number(i+7101)*.7,x=number(i+1)*width+pointer.x*depth+Math.sin(time*.12+i)*2,y=number(i+501)*sceneHeight+Math.sin(time*.14+i)*4;const twinkle=.66+.34*Math.sin(time*(.65+number(i+8001)*.65)+i*1.7);star(x,y,.4+number(i+3001)*.7,(.18+number(i+9001)*.52)*twinkle,i%11===0);}
  const start=Math.max(0,Math.floor(windowTop/18)*18-100),end=Math.min(sceneHeight,windowTop+height+100);
  for(let y=start;y<=end;y+=65){ctx.globalAlpha=.75+.23*Math.sin(y*.005-time*.38);glow(point(y)+Math.sin(time*.17+y*.01)*9,y,width<650?72:136,'#be80c125');}
  // Moving light travels along the same stable S curve.
  for(let ribbon=0;ribbon<2;ribbon++){const phase=ribbon*.1;ctx.lineWidth=ribbon?.45:.85;ctx.strokeStyle=ribbon?'#cf9cc548':'#efccbaaa';for(let y=start;y<end;y+=8){const x=point(y,phase),wave=Math.pow(Math.max(0,Math.cos(y*.009-time*.8)),7);ctx.globalAlpha=clearance(x,y)*(.24+wave*.58+scrollEnergy*.12);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(point(y+8,phase),y+8);ctx.stroke();}}
  // Deterministic bands keep work proportional to viewport height, even on phones.
  const band=160,flow=time*17,bandFirst=Math.floor((start-flow)/band)-1,bandLast=Math.ceil((end-flow)/band)+1,perBand=width<650?190:455;
  for(let b=bandFirst;b<=bandLast;b++)for(let i=0;i<perBand;i++){const seed=b*503+i,y=b*band+number(seed+13001)*band+flow;if(y<start||y>end)continue;const spread=(number(seed+14001)-.5)*(width<650?110:210),x=point(y)+spread+Math.sin(time*.55+seed)*4,fade=clearance(x,y),a=(1-Math.abs(spread)/(width<650?65:120))*(.17+number(seed+15001)*.53)*fade;star(x,y,.35+number(seed+16001)*.7,Math.max(0,a),i%3===0);}
  const nodeFirst=Math.floor((start-time*27)/190)-1,nodeLast=Math.ceil((end-time*27)/190)+1;for(let i=nodeFirst;i<=nodeLast;i++){const y=i*190+time*27;if(y<start||y>end)continue;const x=point(y),fade=clearance(x,y),strength=(.6+.2*Math.sin(time*.7+i))*fade;ctx.globalAlpha=strength;glow(x,y,25,'#ffd6a69a');star(x,y,1.7,.98*fade,true);cross(x,y,6+2*Math.sin(time*.4+i),.8*fade);}
  // Small orbiting lights frame the featured quotes without touching their words.
  for(const a of anchors){if(a.y<start||a.y>end)continue;const angle=time*.33+a.i*1.8,x=a.x+Math.cos(angle)*26,y=a.y+Math.sin(angle)*12;ctx.globalAlpha=.13;ctx.strokeStyle='#f5d0a7';ctx.lineWidth=.5;ctx.beginPath();ctx.ellipse(a.x,a.y,26,12,-.3,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.55;glow(x,y,12,'#ffd7a775');star(x,y,1.2,.9,true);}
  for(const m of meteors){const age=time-m.born,progress=age/2.8;if(progress<0||progress>1)continue;const envelope=Math.sin(progress*Math.PI)*.7,dx=Math.cos(m.angle),dy=Math.sin(m.angle),headX=m.x+dx*m.travel*progress,headY=m.y+dy*m.travel*progress;ctx.lineWidth=1.1;ctx.strokeStyle='#ffe5c6';for(let j=0;j<18;j++){const q=j/18,x=headX-dx*m.length*q,y=headY-dy*m.length*q;ctx.globalAlpha=envelope*(1-q)*clearance(x,y);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-dx*m.length/18,y-dy*m.length/18);ctx.stroke();}const fade=clearance(headX,headY);ctx.globalAlpha=envelope*fade;glow(headX,headY,17,'#ffd9b7ab');star(headX,headY,1.8,envelope*fade,true);}
  for(const t of trail){const age=time-t.born;if(age>1.9)continue;const x=t.x+Math.sin(t.seed)*age*11,y=t.y-age*13,fade=(1-age/1.9)*clearance(x,y);star(x,y,t.r,fade*.75,t.seed%2===0);}
  for(const burst of bursts){const age=time-burst.born;if(age>1.6)continue;for(let i=0;i<14;i++){const angle=i*Math.PI*2/14,r=8+age*(21+number(i)*20),x=burst.x+Math.cos(angle)*r,y=burst.y+Math.sin(angle)*r;star(x,y,1.2,(1-age/1.6)*.85*clearance(x,y),true);}}
  if(pointer.inside&&!stopped()){ctx.globalAlpha=.4;glow(pointer.sceneX,pointer.sceneY,95,'#bd90dd19');}
  ctx.globalAlpha=1;
 }
 function tick(stamp){frame=0;if(!permitted())return;if(stamp-last>=40){time+=Math.min((stamp-last)/1000,.1);last=stamp;pointer.x+=(pointer.tx-pointer.x)*.065;pointer.y+=(pointer.ty-pointer.y)*.065;scrollEnergy*=.94;meteors=meteors.filter(m=>time-m.born<3);trail=trail.filter(t=>time-t.born<2);bursts=bursts.filter(b=>time-b.born<1.7);if(time>=nextMeteor)meteor();draw();}frame=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(frame);frame=0;if(!permitted()){pointer.inside=false;pointer.x=pointer.y=pointer.tx=pointer.ty=0;trail=[];bursts=[];}if(active)updateWindow();else draw();if(permitted()){last=performance.now();frame=requestAnimationFrame(tick);}}
 new IntersectionObserver(entries=>{active=entries[0].isIntersecting;sync();},{rootMargin:'150px'}).observe(section);
 const nearby=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('is-near',e.isIntersecting);},{rootMargin:'10% 0px',threshold:0});section.querySelectorAll('.star-quote,.river-heading,.river-ending').forEach(e=>nearby.observe(e));
 new ResizeObserver(()=>{measure();sync();}).observe(section);
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion','data-paused']});document.addEventListener('visibilitychange',sync);
 section.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!permitted())return;const r=section.getBoundingClientRect();pointer.inside=true;pointer.sceneX=e.clientX-r.left;pointer.sceneY=e.clientY-r.top;pointer.tx=(e.clientX/width-.5)*13;pointer.ty=(e.clientY/innerHeight-.5)*8;if(time-lastTrail>.075){lastTrail=time;for(let i=0;i<2;i++)trail.push({x:pointer.sceneX+(number(trail.length+i)-.5)*16,y:pointer.sceneY+(number(trail.length+i+10)-.5)*16,r:.6+number(trail.length+i+20)*.7,born:time,seed:trail.length+i});if(trail.length>44)trail.splice(0,trail.length-44);}},{passive:true});
 section.addEventListener('pointerleave',()=>{pointer.inside=false;pointer.tx=pointer.ty=0;},{passive:true});
 section.addEventListener('click',e=>{const button=e.target.closest('[data-favorite]');if(!button||!permitted()||button.getAttribute('aria-pressed')==='true')return;const r=button.getBoundingClientRect(),s=section.getBoundingClientRect();bursts.push({x:r.left-s.left+r.width/2,y:r.top-s.top+r.height/2,born:time});});
 window.addEventListener('scroll',()=>{if(scheduled||!active)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;if(!stopped())scrollEnergy=Math.min(1,scrollEnergy+.16);updateWindow();});},{passive:true});window.addEventListener('resize',()=>{measure();sync();},{passive:true});document.fonts.ready.then(()=>{measure();sync();});measure();
}
