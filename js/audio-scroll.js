/* Background music + gentle auto-scroll */
const Media=(()=>{
  const audio=document.getElementById('bgm'),aBtn=document.getElementById('audioBtn'),sBtn=document.getElementById('scrollBtn');
  let scrolling=false,raf=null,acc=0;
  const SPEED=0.6; // pixels per frame
  const setAudio=on=>{aBtn.classList.toggle('playing',on)};
  function playAudio(){audio.volume=.6;audio.play().then(()=>setAudio(true)).catch(()=>setAudio(false))}
  function toggleAudio(){audio.paused?playAudio():(audio.pause(),setAudio(false))}
  function step(){
    if(!scrolling)return;
    acc+=SPEED;
    if(acc>=1){const n=Math.floor(acc);scrollBy({top:n,behavior:'instant'});acc-=n}
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-2)return stop();
    raf=requestAnimationFrame(step);
  }
  function start(){scrolling=true;document.body.classList.add('scrolling');raf=requestAnimationFrame(step)}
  function stop(){scrolling=false;document.body.classList.remove('scrolling');cancelAnimationFrame(raf)}
  aBtn.addEventListener('click',toggleAudio);
  sBtn.addEventListener('click',()=>scrolling?stop():start());
  ['wheel','touchstart','touchmove','keydown'].forEach(e=>addEventListener(e,()=>scrolling&&stop(),{passive:true}));
  return{playAudio};
})();
