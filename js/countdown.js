/* Live countdown. Usage: startCountdown(new Date('2026-12-11T10:42:00+05:30')) */
function startCountdown(target){
  const $=id=>document.getElementById(id), p=n=>String(n).padStart(2,'0');
  function tick(){
    const diff=target-new Date();
    if(diff<=0){$('countdown').hidden=true;$('cd-done').hidden=false;clearInterval(t);return}
    $('cd-d').textContent=p(Math.floor(diff/864e5));
    $('cd-h').textContent=p(Math.floor(diff/36e5)%24);
    $('cd-m').textContent=p(Math.floor(diff/6e4)%60);
    $('cd-s').textContent=p(Math.floor(diff/1e3)%60);
  }
  const t=setInterval(tick,1000);tick();
}
