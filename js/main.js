/* ===== EDIT YOUR DETAILS HERE ===== */
const CONFIG={
  marriageDateTime:'2026-12-11T10:42:00+05:30',
  venue:{name:'Sri Venkateswara Kalyana Mantapam',address:'Station Road, Hospet, Karnataka 583201',
    map:'https://maps.google.com/?q=Hospet+Kalyana+Mantapam'},
  whatsapp:'919999999999',
  events:[
    {day:'Day 1',title:'Haldi',date:'2026-12-09',start:'10:00',end:'13:00',dress:'Yellow & Traditional',part:'Morning',
      venue:'Bride\u2019s Residence, Hospet',bg:'bg-haldi.jpg',label:'HALDI',color:'--c-haldi',map:'https://maps.google.com/?q=Hospet'},
    {day:'Day 2',title:'Pellikoduku & Sangeeth',date:'2026-12-10',start:'11:00',end:'23:00',dress:'Pastel & Festive Ethnic',part:'Morning & Evening',
      venue:'Sri Venkateswara Kalyana Mantapam, Hospet',bg:'bg-pellikoduku.jpg',label:'2 EVENTS',color:'--c-pelli',map:'https://maps.google.com/?q=Hospet+Kalyana+Mantapam'},
    {day:'Day 3',title:'Marriage (Sumuhurtham)',date:'2026-12-11',start:'10:42',end:'13:00',dress:'Silk Sarees & Dhoti',part:'Morning',
      venue:'Sri Venkateswara Kalyana Mantapam, Hospet',bg:'bg-marriage.jpg',label:'MARRIAGE',color:'--c-marriage',map:'https://maps.google.com/?q=Hospet+Kalyana+Mantapam'},
    {day:'Day 5',title:'Sri Satyanarayana Swamy Vratham, Vindu & Reception',date:'2026-12-13',start:'09:00',end:'21:00',dress:'Traditional / Formal',part:'Morning & Evening',
      venue:'Groom\u2019s Residence & Hall, Hospet',bg:'bg-vratham.jpg',label:'3 EVENTS',color:'--c-reception',map:'https://maps.google.com/?q=Hospet'}
  ]
};

const $=s=>document.querySelector(s);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)};
const fmtDate=d=>new Date(d+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const to12=t=>{let[h,m]=t.split(':').map(Number);return`${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`};

/* ICS download */
function downloadICS(ev){
  const f=(d,t)=>d.replace(/-/g,'')+'T'+t.replace(':','')+'00';
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT',
    `UID:${ev.date}-${ev.title.replace(/\W/g,'')}@wedding-invite`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g,'')}`,
    `DTSTART;TZID=Asia/Kolkata:${f(ev.date,ev.start)}`,`DTEND;TZID=Asia/Kolkata:${f(ev.date,ev.end)}`,
    `SUMMARY:${ev.title} \u2013 Sai Kiran & Meghana`,`LOCATION:${ev.venue}`,
    `DESCRIPTION:Dress code: ${ev.dress}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  a.download=ev.title.replace(/\W+/g,'-').toLowerCase()+'.ics';
  document.body.appendChild(a);a.click();a.remove();
}

function renderEvents(){
  $('#events').innerHTML=CONFIG.events.map((e,i)=>`
  <section class="event" style="background-image:url(images/${e.bg})">
    <div class="event-in reveal">
      <p class="day">${e.day}</p><h3>${e.title}</h3>
      <div class="row"><small>DATE</small>${fmtDate(e.date)}</div>
      <div class="row"><small>TIME</small>${to12(e.start)} onwards</div>
      <div class="row"><small>DRESS CODE</small>${e.dress}</div>
      <div class="row"><small>PART OF DAY</small>${e.part}</div>
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
  $('#rsvpBtn').href=w('Namaskaram! We will be attending the wedding of Sai Kiran & Meghana.');
  $('#wishBtn').href=w('Heartfelt wishes to Sai Kiran & Meghana on their wedding!');
}

function setupReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

function setupGate(){
  const gate=$('#gate');document.body.classList.add('locked');
  const open=()=>{
    if(gate.classList.contains('open'))return;
    gate.classList.add('open');document.body.classList.remove('locked');
    Media.playAudio();Petals.start();
    setTimeout(()=>gate.remove(),1800);
  };
  gate.addEventListener('click',open);
  gate.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open()});
}

document.addEventListener('DOMContentLoaded',()=>{
  renderEvents();renderCalendar();setupVenue();setupReveal();setupGate();
  startCountdown(new Date(CONFIG.marriageDateTime));
});
