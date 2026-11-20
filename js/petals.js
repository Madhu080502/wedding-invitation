/* Falling golden / marigold petals on canvas */
const Petals=(()=>{
  const c=document.getElementById('petals'),x=c.getContext('2d');
  const colors=['#E5B95C','#F5A623','#FF9F1C','#D4AF37','#FFD166'];
  let ps=[],run=false;
  const size=()=>{c.width=innerWidth;c.height=innerHeight};
  addEventListener('resize',size);size();
  const make=()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height,r:4+Math.random()*6,s:.6+Math.random()*1.4,
    sw:Math.random()*2,a:Math.random()*6.28,v:(Math.random()-.5)*.03,col:colors[Math.random()*5|0]});
  function draw(){
    if(!run)return;
    x.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{
      p.y+=p.s;p.a+=p.v+.02;p.x+=Math.sin(p.a)*p.sw;
      if(p.y>c.height+20){Object.assign(p,make(),{y:-20})}
      x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.col;x.globalAlpha=.85;
      x.beginPath();x.ellipse(0,0,p.r,p.r*.55,0,0,6.28);x.fill();x.restore();
    });
    requestAnimationFrame(draw);
  }
  return{start(n=45){if(run||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    ps=Array.from({length:n},make);run=true;draw();
    setTimeout(()=>{run=false;x.clearRect(0,0,c.width,c.height)},20000)}};
})();
