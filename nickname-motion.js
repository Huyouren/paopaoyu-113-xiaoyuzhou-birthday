export function bindNicknameMotion(){
  const stage=document.querySelector('.nickname-stage');
  if(!stage)return;
  let targetX=0,targetY=0,currentX=0,currentY=0,frame=0;
  const permitted=()=>document.documentElement.dataset.paused!=='true'&&stage.closest('.story-section').classList.contains('in-view')&&!document.hidden;
  function render(){frame=0;if(!permitted()){currentX=currentY=0;stage.style.setProperty('--pointer-x','0px');stage.style.setProperty('--pointer-y','0px');return;}currentX+=(targetX-currentX)*.075;currentY+=(targetY-currentY)*.075;stage.style.setProperty('--pointer-x',currentX.toFixed(2)+'px');stage.style.setProperty('--pointer-y',currentY.toFixed(2)+'px');if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.1)frame=requestAnimationFrame(render);}
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  stage.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||!permitted())return;const r=stage.getBoundingClientRect();targetX=((event.clientX-r.left)/r.width-.5)*12;targetY=((event.clientY-r.top)/r.height-.5)*10;schedule();},{passive:true});
  stage.addEventListener('pointerleave',()=>{targetX=targetY=0;schedule();},{passive:true});
  const preferenceObserver=new MutationObserver(()=>{if(!permitted()){cancelAnimationFrame(frame);frame=0;targetX=targetY=currentX=currentY=0;stage.style.setProperty('--pointer-x','0px');stage.style.setProperty('--pointer-y','0px');}});
  preferenceObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-paused','data-motion']});
}
