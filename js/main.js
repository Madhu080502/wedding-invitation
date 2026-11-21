/* ===== EDIT YOUR DETAILS HERE ===== */
const CONFIG={
  marriageDateTime:'2026-12-05T07:00:00+05:30',
  venue:{name:'KBN Sai Aranya Wedding Hall',address:'Narendra Cross, Dharwad-580005',
    map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'},
  whatsapp:'919632043415',
  events:[
    {day:'4 December · Friday',title:'Baraat',date:'2026-12-04',start:'18:00',end:'19:00',timeLabel:'6:00 PM',
      description:'Join the groom’s procession with music, dance and celebration.',venue:'Baraat assembly point to be shared separately',label:'BARAAT',color:'--c-Baraat',map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'},
    {day:'4 December · Friday',title:'Welcome Ceremony',date:'2026-12-04',start:'19:00',end:'19:45',timeLabel:'7:00 PM',
      venue:'KBN Sai Aranya Wedding Hall, Dharwad',label:'WELCOME',color:'--c-pelli',map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'},
    {day:'4 December · Friday',title:'Sangeet',date:'2026-12-04',start:'19:45',end:'21:00',timeLabel:'7:45 PM',
      description:'An evening of music, dance and cherished memories.',venue:'KBN Sai Aranya Wedding Hall, Dharwad',label:'SANGEET',color:'--c-reception',map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'},
    {day:'4 December · Friday',title:'Engagement',date:'2026-12-04',start:'21:00',end:'23:00',timeLabel:'9:00 PM',
      description:'An exchange of rings and the promise of a lifetime together.',venue:'KBN Sai Aranya Wedding Hall, Dharwad',label:'ENGAGEMENT',color:'--c-pelli',map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'},
    {day:'5 December · Saturday',title:'Subumurtham',date:'2026-12-05',start:'07:00',end:'11:30',timeLabel:'7:00 AM',
      description:'Join us as we begin our married life with your blessings.',venue:'KBN Sai Aranya Wedding Hall, Dharwad',label:'WEDDING',color:'--c-marriage',map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'},
    {day:'5 December · Saturday',title:'Reception & Lunch',date:'2026-12-05',start:'11:30',end:'13:30',timeLabel:'11:30 onwards',
      description:'Celebrate with the newlyweds over warm wishes and a festive meal.',venue:'KBN Sai Aranya Wedding Hall, Dharwad',label:'RECEPTION',color:'--c-reception',map:'https://maps.app.goo.gl/ZaetH4Ut3VHd1wor5'}]
};

const $=s=>document.querySelector(s);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)};
const fmtDate=d=>{
  const date=new Date(d+'T00:00:00');
  const day=String(date.getDate()).padStart(2,'0');
  const ordinalDay=date.getDate();
  const suffix=ordinalDay%100>=11&&ordinalDay%100<=13?'th':({1:'st',2:'nd',3:'rd'}[ordinalDay%10]||'th');
  const month=date.toLocaleDateString('en-IN',{month:'short'});
  return`${day}<sup>${suffix}</sup> ${month} ${date.getFullYear()}`;
};
const to12=t=>{let[h,m]=t.split(':').map(Number);return`${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`};

function setupBackgroundSlideshow(){
  const images=[
    'images/BackGround/Atmanand.jpeg',
    'images/BackGround/Atmanand (1).jpeg',
    'images/BackGround/Atmanand (2).jpeg',
    'images/BackGround/Atmanand (3).jpeg',
    'images/BackGround/Atmanand (4).jpeg',
    'images/BackGround/Atmanand (5).jpeg',
    'images/BackGround/Atmanand (6).jpeg',
    'images/BackGround/Atmanand (7).jpeg',
    'images/BackGround/Atmanand (8).jpeg'
  ];
  const slides=document.querySelectorAll('.background-slide');
  if(slides.length<2)return;
  let index=0,active=0,rotationStarted=false,initialShown=false;
  const ready=[];
  const show=(slide,src)=>{slide.style.backgroundImage=`url("${new URL(src,document.baseURI).href}")`};
  const startRotation=()=>{
    if(rotationStarted||ready.filter(Boolean).length<2)return;
    rotationStarted=true;
    setInterval(()=>{
      let attempts=0;
      do{index=(index+1)%images.length;attempts++}while(!ready[index]&&attempts<images.length);
      if(!ready[index])return;
      const next=1-active;
      show(slides[next],ready[index]);
      slides[next].classList.add('is-active');
      slides[active].classList.remove('is-active');
      active=next;
    },6000);
  };
  const preload=src=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>resolve(src);
    img.onerror=()=>resolve(null);
    img.src=src;
    if(img.complete&&img.naturalWidth)resolve(src);
  });
  images.forEach((src,i)=>preload(src).then(loaded=>{
    if(!loaded)return;
    ready[i]=src;
    if(!initialShown){
      show(slides[active],src);
      slides[active].classList.add('is-active');
      initialShown=true;
    }
    startRotation();
  }));
}

/* ICS download */
function downloadICS(ev){
  const f=(d,t)=>d.replace(/-/g,'')+'T'+t.replace(':','')+'00';
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT',
    `UID:${ev.date}-${ev.title.replace(/\W/g,'')}@wedding-invite`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g,'')}`,
    `DTSTART;TZID=Asia/Kolkata:${f(ev.date,ev.start)}`,`DTEND;TZID=Asia/Kolkata:${f(ev.date,ev.end)}`,
    `SUMMARY:${ev.title} \u2013 Atmanand & Pooja`,`LOCATION:${ev.venue}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  a.download=ev.title.replace(/\W+/g,'-').toLowerCase()+'.ics';
  document.body.appendChild(a);a.click();a.remove();
}

function renderEvents(){
  $('#events').innerHTML=CONFIG.events.map((e,i)=>`
  <section class="event">
    <div class="event-in reveal">
      <p class="day">${e.day}</p><h3>${e.title}</h3>
      <div class="row"><small>DATE</small>${fmtDate(e.date)}</div>
      <div class="row"><small>TIME</small>${e.timeLabel||`${to12(e.start)} onwards`}</div>
      ${e.description?`<p class="event-description">${e.description}</p>`:''}
      <div class="row"><small>VENUE</small>${e.venue}</div>
      <div class="btn-row">
        <button class="btn gold" data-ics="${i}">Add to Calendar</button>
        <a class="btn ghost" href="${e.map}" target="_blank" rel="noopener">Directions</a>
      </div>
    </div>
  </section>`).join('');
  document.querySelectorAll('[data-ics]').forEach(b=>b.onclick=()=>downloadICS(CONFIG.events[b.dataset.ics]));
}

function renderCalendar(){
  const first=new Date(CONFIG.events[0].date+'T00:00:00'),y=first.getFullYear(),m=first.getMonth();
  $('#calTitle').textContent=first.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const map={};CONFIG.events.forEach(e=>{const d=new Date(e.date+'T00:00:00');if(d.getMonth()===m)map[d.getDate()]=e});
  let h=['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=>`<div class="dow">${d}</div>`).join('');
  h+='<div></div>'.repeat(new Date(y,m,1).getDay());
  for(let d=1,n=new Date(y,m+1,0).getDate();d<=n;d++){
    const e=map[d];
    h+=e?`<div class="d hl" style="--c:var(${e.color})"><span>${d}</span><em>${e.label}</em></div>`:`<div class="d"><span>${d}</span></div>`;
  }
  $('#calGrid').innerHTML=h;
  $('#legend').innerHTML=CONFIG.events.map(e=>`<span><i style="--c:var(${e.color})"></i>${e.title.split(' ')[0]}</span>`).join('');
}

function setupVenue(){
  const v=CONFIG.venue;
  $('#venueName').textContent=v.name;$('#venueAddr').textContent=v.address;$('#venueMap').href=v.map;
  $('#copyBtn').onclick=async()=>{
    const txt=`${v.name}, ${v.address}`;
    try{await navigator.clipboard.writeText(txt)}catch{const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}
    toast('Address copied to clipboard');
  };
  const w=t=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
  $('#rsvpBtn').href=w('Namaskaram! We will be attending the wedding of Atmanand & Pooja.');
  $('#wishBtn').href=w('Heartfelt wishes to Atmanand & Pooja on their wedding!');
}

function setupReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

function setupGate(){
  const gate=$('#gate');
  const open=()=>{
    if(gate.classList.contains('open'))return;
    gate.classList.add('open');
    Media.playAudio();Petals.start();
    setTimeout(()=>{gate.remove();document.body.classList.remove('locked')},1800);
  };
  gate.addEventListener('click',open);
  gate.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open()});
}

document.addEventListener('DOMContentLoaded',()=>{
  setupBackgroundSlideshow();renderEvents();renderCalendar();setupVenue();setupReveal();setupGate();
  startCountdown(new Date(CONFIG.marriageDateTime));
});
