const demo=[
{title:"Your Journey. Our Connection.",text:"Reliable car services across Chennai and nearby areas for city rides, hourly rentals and selected trips.",image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85"},
{title:"Celebrate Every Journey.",text:"Festival campaigns and special announcements can be changed anytime from your private owner dashboard.",image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=85"},
{title:"Comfort Meets Chennai.",text:"A simple, comfortable car service experience built for Chennai and its surrounding locations.",image:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=85"}];
const defaultAreas=["Tambaram","Chromepet","Pallavaram","Porur","Guindy","Adyar","Velachery","Sholinganallur","OMR","ECR","Avadi","Ambattur","Poonamallee","Sriperumbudur","Perungalathur","Chengalpattu","Kelambakkam","Mahabalipuram","Thiruvallur"];
function getActiveVijayState(){
  const live={};
  ['vijayContent','vijayImages','vijayTheme','vijayContact','vijayBooking','vijayExplore','vijayRoutes','vijaySlides','vijaySettings','vijayFestivalBanners','vijayHomePromos'].forEach(k=>{try{live[k]=JSON.parse(localStorage.getItem(k)||'null')}catch(e){live[k]=null}});
  let schedules=[];try{const many=JSON.parse(localStorage.getItem('vijaySchedules')||'[]');if(Array.isArray(many))schedules=many}catch(e){}
  try{const legacy=JSON.parse(localStorage.getItem('vijaySchedule')||'null');if(legacy?.start)schedules.push(legacy)}catch(e){}
  const now=new Date();
  schedules.sort((a,b)=>new Date(b.start)-new Date(a.start));
  const active=schedules.find(s=>s?.start && now>=new Date(s.start) && (!s.end || now<=new Date(s.end)) && s.data);
  if(active)Object.assign(live,active.data)
  return live;
}
const activeState=getActiveVijayState();
const settings=activeState.vijaySettings||JSON.parse(localStorage.getItem("vijaySettings")||"null")||{motion:"zoom",interval:5000,areas:defaultAreas,offerVisible:true};
// Large Chennai pickup/drop directory. These are searchable points, not extra orbit clutter.
const chennaiPoints=[
 ['Tambaram','Service Area'],['Chromepet','Service Area'],['Pallavaram','Service Area'],['Porur','Service Area'],['Guindy','Service Area'],['Adyar','Service Area'],['Velachery','Service Area'],['Sholinganallur','Service Area'],['OMR','Service Area'],['ECR','Service Area'],['Avadi','Service Area'],['Ambattur','Service Area'],['Poonamallee','Service Area'],['Sriperumbudur','Service Area'],['Perungalathur','Service Area'],['Chengalpattu','Service Area'],['Kelambakkam','Service Area'],['Mahabalipuram','Service Area'],['Thiruvallur','Service Area'],
 ['Chennai Airport','Airport'],['Chennai Airport Domestic Terminal','Airport'],['Chennai Airport International Terminal','Airport'],['Chennai Central Railway Station','Railway Station'],['Chennai Egmore Railway Station','Railway Station'],['Tambaram Railway Station','Railway Station'],['Guindy Railway Station','Railway Station'],['Mambalam Railway Station','Railway Station'],['Saidapet Railway Station','Railway Station'],['Avadi Railway Station','Railway Station'],['Chengalpattu Railway Station','Railway Station'],['Koyambedu CMBT Bus Stand','Bus Stand'],['Kilambakkam KCBT Bus Terminus','Bus Stand'],['Broadway Bus Stand','Bus Stand'],['Poonamallee Bus Stand','Bus Stand'],
 ['Marina Beach','Tourist Spot'],['Elliot’s Beach','Tourist Spot'],['Besant Nagar Beach','Tourist Spot'],['Kapaleeshwarar Temple','Temple'],['Parthasarathy Temple','Temple'],['San Thome Basilica','Landmark'],['Fort St. George','Landmark'],['Madras High Court','Landmark'],['MGR Memorial','Landmark'],['Anna Memorial','Landmark'],['Valluvar Kottam','Landmark'],['Government Museum Egmore','Museum'],['Birla Planetarium','Landmark'],['Guindy National Park','Park'],['Anna Nagar Tower','Landmark'],['Madhya Kailash','Landmark'],['Chennai Trade Centre','Business'],
 ['T Nagar','Shopping'],['Pondy Bazaar','Shopping'],['Nungambakkam','Shopping / Locality'],['Anna Nagar','Locality'],['Vadapalani','Locality'],['Kodambakkam','Locality'],['Koyambedu','Locality'],['Perungudi','Locality'],['Thoraipakkam','Locality'],['Navalur','Locality'],['Siruseri SIPCOT','IT / Business'],['Tidel Park','IT / Business'],['DLF IT Park Porur','IT / Business'],['Guindy Industrial Estate','Business'],
 ['Phoenix Marketcity Chennai','Mall'],['VR Chennai','Mall'],['Express Avenue Mall','Mall'],['Forum Vijaya Mall','Mall'],['Ampa Skywalk','Mall'],['Chennai Citi Centre','Mall'],['Marina Mall','Mall'],['Grand Square Mall','Mall'],['Spectrum Mall','Mall'],
 ['PVR Sathyam Cinemas','Theatre / Cinema'],['PVR Palazzo','Theatre / Cinema'],['PVR VR Chennai','Theatre / Cinema'],['Luxe Cinemas','Theatre / Cinema'],['Rohini Silver Screens','Theatre / Cinema'],['Kamala Cinemas','Theatre / Cinema'],['AGS Cinemas Navalur','Theatre / Cinema'],['EGA Theatre','Theatre / Cinema'],['Sangam Cinemas','Theatre / Cinema'],['Devi Cineplex','Theatre / Cinema'],
 ['Apollo Hospital Greams Road','Hospital'],['Kauvery Hospital Alwarpet','Hospital'],['MIOT International','Hospital'],['SIMS Hospital Vadapalani','Hospital'],['Fortis Hospital Vadapalani','Hospital'],['Rajiv Gandhi Government General Hospital','Hospital'],['Government Stanley Hospital','Hospital'],['Sri Ramachandra Hospital Porur','Hospital'],['Rela Hospital Chromepet','Hospital'],
 ['Chennai US Consulate','Consulate / Landmark'],['Anna University','College / Landmark'],['IIT Madras','College / Landmark'],['Loyola College','College / Landmark'],['Madras University','College / Landmark'],['Chennai Port','Landmark'],['Marina Lighthouse','Landmark'],['Chennai Rail Museum','Museum']
];
const pointDirectory=chennaiPoints.map(([name,category])=>({name,category}));

let data=JSON.parse(localStorage.getItem("vijaySlides")||"null")||demo,i=0,t;
const $=id=>document.getElementById(id);

function render(){
  $("slides").innerHTML="";$("dots").innerHTML="";
  document.querySelector(".hero").dataset.motion=settings.motion||"zoom";
  data.forEach((s,n)=>{
    const el=document.createElement("div");el.className="slide"+(n===0?" active":"");
    el.style.backgroundImage=s.image?`url("${s.image}")`:"linear-gradient(135deg,#24134e,#0b0910)";
    $("slides").appendChild(el);
    const q=document.createElement("i");q.className="dot"+(n===0?" active":"");q.onclick=()=>go(n);$("dots").appendChild(q);
  }); update(); renderAreas();
}
function update(){if(!data.length){$("title").textContent="Vijay Connect";$("desc").textContent="Your journey. Our connection.";return}$("title").textContent=data[i].title;$("desc").textContent=data[i].text}
function go(n){if(!data.length)return;i=(n+data.length)%data.length;document.querySelectorAll(".slide").forEach((x,k)=>x.classList.toggle("active",k===i));document.querySelectorAll(".dot").forEach((x,k)=>x.classList.toggle("active",k===i));update();restart()}
function next(){go(i+1)} function prev(){go(i-1)}
function restart(){clearInterval(t);if(data.length>1&&settings.interval>0)t=setInterval(next,Number(settings.interval)||5000)}

const areaPhotos={
 Tambaram:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88',
 Chromepet:'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=88',
 Pallavaram:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=88',
 Porur:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88',
 Guindy:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=88',
 Adyar:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=88',
 Velachery:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88',
 Sholinganallur:'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=88',
 OMR:'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=88',
 ECR:'https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&w=1200&q=88',
 Avadi:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=88',
 Ambattur:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88',
 Poonamallee:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=88',
 Sriperumbudur:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88',
 Perungalathur:'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1200&q=88',
 Chengalpattu:'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=88',
 Kelambakkam:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=88',
 Mahabalipuram:'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=88',
 Thiruvallur:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=88'
};
const areaTags={Tambaram:'Chennai South',Chromepet:'Chennai South',Pallavaram:'Airport Corridor',Porur:'West Chennai',Guindy:'Central Chennai',Adyar:'South Chennai',Velachery:'South Chennai',Sholinganallur:'OMR',OMR:'IT Corridor',ECR:'East Coast Road',Avadi:'West Chennai',Ambattur:'West Chennai',Poonamallee:'West Chennai',Sriperumbudur:'Chennai Outskirts',Perungalathur:'GST Road',Chengalpattu:'GST Road',Kelambakkam:'OMR / ECR',Mahabalipuram:'ECR Heritage',Thiruvallur:'Chennai Outskirts'};
function getRouteForArea(name){const routes=JSON.parse(localStorage.getItem('vijayRoutes')||'null')||[];return routes.find(r=>String(r.place).toLowerCase()===String(name).toLowerCase())||null}
function showAreaPreview(name){ location.href='route-details.html?to='+encodeURIComponent(name); }
function renderAreas(){
 const orbit=$('areaOrbit'); const more=$('areaMore'); if(!orbit)return;
 orbit.innerHTML=''; if(more) more.innerHTML='';
 const positions=[['Tambaram',50,3],['Chromepet',75,12],['Pallavaram',92,32],['Porur',97,57],['Guindy',82,80],['Adyar',63,94],['Velachery',40,96],['Sholinganallur',18,86],['OMR',5,64],['ECR',3,39],['Avadi',15,17],['Ambattur',34,5]];
 positions.forEach(([name,x,y])=>{const a=document.createElement('a');a.className='areaChip';a.href='route-details.html?to='+encodeURIComponent(name);a.style.setProperty('--x',x+'%');a.style.setProperty('--y',y+'%');a.textContent=name;orbit.appendChild(a);});
 const extras=['Poonamallee','Sriperumbudur','Perungalathur','Chengalpattu','Kelambakkam','Mahabalipuram','Thiruvallur'];
 if(more){ more.innerHTML='<div class="moreLabel">MORE SERVICE AREAS</div><div class="moreChips">'+extras.map(x=>`<a href="route-details.html?to=${encodeURIComponent(x)}">${x}<span>→</span></a>`).join('')+'</div>'; }
}

function renderExplore(){
 const fallback={title:"Explore Chennai. Ride Easy.",desc:"Popular Chennai places and simple point-to-point fares, shown as starting prices.",routeTitle:"Chennai → Your Drop",routeDesc:"Choose a destination and see a simple starting fare.",routePrice:"₹999",cards:[{name:"Chennai High Court",tag:"Heritage • George Town",price:"₹999",image:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=85"},{name:"Marina Beach",tag:"Beach • City Centre",price:"₹899",image:"https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=900&q=85"},{name:"Kapaleeshwarar Temple",tag:"Culture • Mylapore",price:"₹899",image:"https://images.unsplash.com/photo-1590050752117-238cb0fb9b1c?auto=format&fit=crop&w=900&q=85"},{name:"Elliot's Beach",tag:"Beach • Besant Nagar",price:"₹999",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85"},{name:"Mahabalipuram",tag:"Heritage • ECR",price:"₹1,499",image:"https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=85"},{name:"Chennai Airport",tag:"Pickup • Drop",price:"₹799",image:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85"}]};
 const ex=activeState.vijayExplore||JSON.parse(localStorage.getItem("vijayExplore")||"null")||fallback;
 $("exploreTitle").textContent=ex.title;$("exploreDesc").textContent=ex.desc;$("routeTitle").textContent=ex.routeTitle;$("routeDesc").textContent=ex.routeDesc;$("routePrice").textContent=ex.routePrice||"₹999";
 $("exploreGrid").innerHTML=(ex.cards||[]).map(x=>{const img=String(x.image||"").replace(/"/g,"&quot;");const tag=String(x.tag||"Chennai • Car Service").replace(/</g,"&lt;");const name=String(x.name||"").replace(/</g,"&lt;");const price=String(x.price||"—").replace(/</g,"&lt;");return `<article class="exploreCard reveal"><div class="explorePhoto" style="background-image:url('${img}')"><span>${tag}</span></div><div class="exploreBody"><div><small>CHENNAI → DROP</small><h3>${name}</h3></div><div class="priceBox"><span>Starting from</span><b>${price}</b></div></div><a class="exploreBook" href="#contact" data-explore-book="${name.replace(/"/g,"&quot;")}">Book this route <span>→</span></a></article>`}).join("");
 document.querySelectorAll("[data-explore-book]").forEach(a=>a.addEventListener("click",()=>{const to=$("toPlace");if(to)to.value=a.dataset.exploreBook;}));
 const items=document.querySelectorAll("#exploreGrid .reveal");if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});items.forEach(x=>io.observe(x))}else items.forEach(x=>x.classList.add("visible"));
}
document.querySelectorAll(".navlink").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".navlink").forEach(x=>x.classList.remove("active"));a.classList.add("active")}));
render();restart();


(function(){const btn=document.getElementById('mobileMenuBtn'),menu=document.getElementById('mobileMenu'),close=document.getElementById('mobileMenuClose');if(!btn||!menu)return;function setOpen(open){menu.classList.toggle('open',open);btn.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('menu-open',open)}btn.addEventListener('click',()=>setOpen(!menu.classList.contains('open')));close&&close.addEventListener('click',()=>setOpen(false));menu.addEventListener('click',e=>{if(e.target===menu)setOpen(false);if(e.target.closest('.mobileNav a,.mobileBook'))setOpen(false)});window.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});})();

// Premium scroll reveal + subtle number animation
(function(){
 const items=document.querySelectorAll('.reveal');
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.15});
   items.forEach(x=>io.observe(x));
 }else items.forEach(x=>x.classList.add('visible'));
 const nums=document.querySelectorAll('[data-count]');
 const noMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function count(el){const target=Number(el.dataset.count); if(!target)return; if(noMotion){el.textContent=target+(el.textContent.includes('%')?'%':el.textContent.includes('/7')?'/7':'');return;} let start=0,step=Math.max(1,Math.ceil(target/28)); const timer=setInterval(()=>{start=Math.min(target,start+step); el.textContent=start+(target===24?'/7':target===100?'%':''); if(start>=target)clearInterval(timer)},35)}
 const nio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){count(e.target);nio.unobserve(e.target)}}),{threshold:.8}); nums.forEach(x=>nio.observe(x));
})();


// Smart Chennai point picker for From / To fields.
(function(){
 const from=document.getElementById('fromPlace'), to=document.getElementById('toPlace'); if(!from||!to)return;
 const setup=(input,box)=>{
   const norm=v=>String(v||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
   function draw(){
     const q=norm(input.value); if(!q){box.innerHTML='';box.classList.remove('open');return;}
     const hits=pointDirectory.filter(p=>norm(p.name+' '+p.category).includes(q)).slice(0,9);
     box.innerHTML=hits.map(p=>`<button type="button" data-value="${p.name.replace(/"/g,'&quot;')}"><strong>${p.name}</strong><small>${p.category}</small></button>`).join('');
     box.classList.toggle('open',hits.length>0);
     box.querySelectorAll('button').forEach(b=>b.addEventListener('mousedown',e=>{e.preventDefault();input.value=b.dataset.value;box.classList.remove('open');}));
   }
   input.addEventListener('input',draw); input.addEventListener('focus',draw); input.addEventListener('blur',()=>setTimeout(()=>box.classList.remove('open'),180));
 };
 setup(from,document.getElementById('fromSuggestions')); setup(to,document.getElementById('toSuggestions'));
})();

// Quick booking: two-step flow — trip details first, vehicle/fare second, then confirmed booking + WhatsApp.
(function(){
 const form=document.getElementById('bookingForm'); if(!form)return;
 const tabs=[...document.querySelectorAll('.serviceTab')], service=document.getElementById('bookingService');
 const from=document.getElementById('fromPlace'),to=document.getElementById('toPlace'),date=document.getElementById('travelDate'),time=document.getElementById('pickupTime');
 const oneWayRow=document.getElementById('oneWayRow'),retRow=document.getElementById('returnRow'),rentRow=document.getElementById('rentalRow'),ret=document.getElementById('returnDate');
 const stepOne=document.getElementById('bookingStepOne'), continueBtn=document.getElementById('bookingContinue'), vehicleStep=document.getElementById('bookingVehicleStep'), backBtn=document.getElementById('bookingBack');
 const vehicleCards=[...document.querySelectorAll('[data-booking-vehicle]')];
 const selectedCarField=document.getElementById('selectedCarBooking');
 const today=new Date(); const iso=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 date.min=iso; ret.min=iso; if(!date.value) date.value=iso;
 let selectedVehicle='sedan'; let selectedPrice='Price on request';
 function pretty(v){return v ? v.charAt(0).toUpperCase()+v.slice(1) : '';}
 function setService(name){
   service.value=name; tabs.forEach(x=>x.classList.toggle('active',x.dataset.service===name));
   const rental=name==='Hourly Rental', out=name==='Outstation', oneWay=name==='One Way Trip'; oneWayRow.hidden=!oneWay; retRow.hidden=!out; rentRow.hidden=!rental;
   to.required=!rental; from.placeholder=rental?'Pickup / starting location':'Pickup location'; to.placeholder=rental?'Optional destination / local':'Drop location';
   if(rental && !to.value) to.value='';
 }
 tabs.forEach(t=>t.addEventListener('click',()=>setService(t.dataset.service)));
 document.querySelectorAll('[data-book-service]').forEach(a=>a.addEventListener('click',()=>setService(a.dataset.bookService)));
 setService('One Way Trip');
 const params=new URLSearchParams(location.search);
 const queryRoute=params.get('route'); const queryVehicle=params.get('vehicle'); const queryRouteMode=params.get('routeMode')==='1';
 if(queryRoute){localStorage.setItem('vijayRouteTo',queryRoute);localStorage.setItem('vijayRouteMode','1');}
 if(queryVehicle){localStorage.setItem('vijayVehicle',queryVehicle.toLowerCase());}
 const savedRoute=localStorage.getItem('vijayRouteTo');
 const routeMode=queryRouteMode || localStorage.getItem('vijayRouteMode')==='1';
 if(savedRoute && to){to.value=savedRoute;}
 const savedVehicle=queryVehicle || localStorage.getItem('vijayVehicle'); if(savedVehicle){selectedVehicle=String(savedVehicle).toLowerCase();}
 const routeSelection=(queryVehicle || localStorage.getItem('vijayRouteSelection')==='1') && !routeMode;
 if(!['mini','sedan','suv'].includes(selectedVehicle)) selectedVehicle='sedan';
 if(routeMode){
   if(from && !from.value) from.value='Chennai';
   if(to && savedRoute) to.value=savedRoute;
   if(continueBtn){
     const txt=continueBtn.querySelector('span'); if(txt) txt.textContent='Confirm Booking';
   }
   if(vehicleStep) vehicleStep.hidden=true;
   if(stepOne) stepOne.hidden=false;
   const actions=continueBtn?.closest('.bookingStepActions'); if(actions) actions.hidden=false;
   const progress=document.getElementById('bookingProgress'); if(progress){const spans=progress.querySelectorAll('span');if(spans[0])spans[0].classList.add('active');if(spans[1])spans[1].classList.remove('active');}
 }
 if(routeSelection){
   updateSummary();
   if(stepOne) stepOne.hidden=true;
   if(vehicleStep) vehicleStep.hidden=false;
   const actions=continueBtn?.closest('.bookingStepActions'); if(actions) actions.hidden=true;
   const progress=document.getElementById('bookingProgress'); if(progress){const spans=progress.querySelectorAll('span');if(spans[0])spans[0].classList.remove('active');if(spans[1])spans[1].classList.add('active');}
 }
 localStorage.removeItem('vijayRouteTo'); localStorage.removeItem('vijayVehicle'); localStorage.removeItem('vijayRouteMode'); localStorage.removeItem('vijayRouteSelection');
 function findFare(){
   const target=String(to.value||'').trim().toLowerCase();
   let routes=[]; try{routes=activeState.vijayRoutes||JSON.parse(localStorage.getItem('vijayRoutes')||'[]');}catch(e){routes=[]}
   const r=routes.find(x=>String(x.place||'').trim().toLowerCase()===target);
   if(r)return r;
   const defaults=[['Tambaram','₹699','₹799','₹999'],['Chromepet','₹649','₹749','₹949'],['Pallavaram','₹599','₹699','₹899'],['Porur','₹649','₹749','₹949'],['Guindy','₹499','₹599','₹799'],['Adyar','₹549','₹649','₹849'],['Velachery','₹549','₹649','₹849'],['Sholinganallur','₹749','₹899','₹1,099'],['OMR','₹799','₹949','₹1,149'],['ECR','₹899','₹1,049','₹1,249'],['Avadi','₹799','₹949','₹1,149'],['Ambattur','₹699','₹849','₹999'],['Poonamallee','₹749','₹899','₹1,099'],['Sriperumbudur','₹1,099','₹1,299','₹1,499'],['Perungalathur','₹749','₹899','₹1,099'],['Chengalpattu','₹1,399','₹1,599','₹1,899'],['Kelambakkam','₹999','₹1,149','₹1,349'],['Mahabalipuram','₹1,299','₹1,499','₹1,799'],['Thiruvallur','₹1,199','₹1,399','₹1,699'],['Chennai Airport','₹599','₹699','₹899'],['Chennai Central Railway Station','₹399','₹499','₹699'],['Chennai Egmore Railway Station','₹399','₹499','₹699'],['Koyambedu CMBT Bus Stand','₹499','₹599','₹799'],['Kilambakkam KCBT Bus Terminus','₹999','₹1,149','₹1,349'],['Tambaram Railway Station','₹699','₹799','₹999'],['Guindy Railway Station','₹499','₹599','₹799'],['T Nagar','₹399','₹499','₹699'],['Anna Nagar','₹449','₹549','₹749'],['Chennai Trade Centre','₹549','₹649','₹849'],['Siruseri SIPCOT','₹899','₹1,049','₹1,249'],['Marina Beach','₹449','₹549','₹749']];
   const d=defaults.find(x=>x[0].toLowerCase()===target);
   return d?{place:d[0],mini:d[1],sedan:d[2],suv:d[3]}:null;
 }
 function money(v){
   const raw=String(v??'').trim(); if(!raw)return 'Price on request';
   return /^₹/.test(raw)?raw:('₹'+raw);
 }
 function updateVehiclePrices(){
   const r=findFare();
   const prices={mini:r&&r.mini?money(r.mini):'Price on request',sedan:r&&r.sedan?money(r.sedan):'Price on request',suv:r&&r.suv?money(r.suv):'Price on request'};
   ['mini','sedan','suv'].forEach(v=>{const el=document.getElementById('booking'+pretty(v)+'Price');if(el)el.textContent=prices[v];});
   if(r){const hint=document.getElementById('bookingFareHint');if(hint)hint.textContent='Starting fare for this route. Final fare is confirmed by Vijay Connect.';}
   else {const hint=document.getElementById('bookingFareHint');if(hint)hint.textContent='Select a car. Final fare will be confirmed by Vijay Connect.';}
   selectedPrice=prices[selectedVehicle];
   const sel=document.getElementById('bookingSelectedPrice'); if(sel)sel.textContent=selectedPrice;
   const lab=document.getElementById('bookingSelectedLabel'); if(lab)lab.textContent=pretty(selectedVehicle);
   if(selectedCarField)selectedCarField.value=pretty(selectedVehicle);
   vehicleCards.forEach(c=>c.classList.toggle('selected',c.dataset.bookingVehicle===selectedVehicle));
 }
 function updateSummary(){
   const el=document.getElementById('bookingTripSummary'); if(el)el.textContent=(from.value.trim()||'Pickup')+' → '+(to.value.trim()||'Local / flexible rental');
   updateVehiclePrices();
 }
 vehicleCards.forEach(card=>card.addEventListener('click',()=>{selectedVehicle=card.dataset.bookingVehicle;updateVehiclePrices();}));
 continueBtn.addEventListener('click',()=>{
   if(!form.checkValidity()){form.reportValidity();return;}
   if(routeMode){
     // Route booking already has destination + vehicle; submit directly to WhatsApp.
     form.dispatchEvent(new Event('submit', {cancelable:true}));
     return;
   }
   updateSummary(); stepOne.hidden=true; vehicleStep.hidden=false; continueBtn.closest('.bookingStepActions').hidden=true;
   const prog=document.getElementById('bookingProgress'); if(prog){const spans=prog.querySelectorAll('span');if(spans[0])spans[0].classList.remove('active');if(spans[1])spans[1].classList.add('active');}
   vehicleStep.scrollIntoView({behavior:'smooth',block:'start'});
 });
 backBtn.addEventListener('click',()=>{vehicleStep.hidden=true;stepOne.hidden=false;continueBtn.closest('.bookingStepActions').hidden=false;document.getElementById('bookingProgress')?.querySelectorAll('span')[1]?.classList.remove('active');document.getElementById('bookingProgress')?.querySelectorAll('span')[0]?.classList.add('active');continueBtn.scrollIntoView({behavior:'smooth',block:'center'});});
 [from,to].forEach(el=>el.addEventListener('input',()=>{if(!vehicleStep.hidden)updateSummary();}));
 updateVehiclePrices();
 form.addEventListener('submit',async e=>{
   e.preventDefault();
   if(!form.checkValidity()){form.reportValidity();return;}
   const phone=document.getElementById('customerPhone').value.trim();
   const svc=service.value, fromV=from.value.trim(), toV=to.value.trim()||'Local / flexible rental';
   const selectedCar=pretty(selectedVehicle)||'Sedan';
   updateVehiclePrices();
   const fare=selectedPrice||'Price on request';
   let msg=`Hi Vijay Connect, I want to book a car.%0A%0AService: ${encodeURIComponent(svc)}%0AVehicle: ${encodeURIComponent(selectedCar)}%0AFare shown: ${encodeURIComponent(fare)}%0AFrom: ${encodeURIComponent(fromV)}%0ATo: ${encodeURIComponent(toV)}%0ATravel Date: ${encodeURIComponent(date.value)}%0APickup Time: ${encodeURIComponent(time.value)}`;
   if(svc==='Outstation') msg+=`%0AReturn Date: ${encodeURIComponent(ret.value||'Not specified')}`;
   if(svc==='Hourly Rental') msg+=`%0ARental Hours: ${encodeURIComponent(document.getElementById('rentalHours').value)}%0APassengers: ${encodeURIComponent(document.getElementById('rentalPassengers').value)}`;
   if(svc==='Outstation') msg+=`%0APassengers: ${encodeURIComponent(document.getElementById('outstationPassengers').value)}`;
   if(svc==='One Way Trip') msg+=`%0APassengers: ${encodeURIComponent(document.getElementById('oneWayPassengers').value)}`;
   msg+=`%0AMobile: ${encodeURIComponent(phone)}`;
   const note=document.getElementById('specialRequest').value.trim(); if(note) msg+=`%0ASpecial Request: ${encodeURIComponent(note)}`;
   const waUrl=`https://wa.me/918056631317?text=${msg}`;
   // Reserve a browser tab from the user's click so WhatsApp can open automatically after confirmation.
   let waWindow=null; try{waWindow=window.open('about:blank','_blank');}catch(_){waWindow=null;}
   const bookingId='VC-'+Date.now().toString(36).slice(-6).toUpperCase();
   const booking={id:bookingId,service:svc,vehicle:selectedCar,fare,from:fromV,to:toV,date:date.value,time:time.value,mobile:phone,status:'Confirmed'};
   try{const customerSession=JSON.parse(localStorage.getItem('vcCustomerSession')||'null'); if(customerSession?.access_token&&customerSession?.user?.id&&window.VC_customerSaveBooking){ await VC_customerSaveBooking(customerSession.access_token,booking,customerSession.user.id); }}catch(e){console.warn('Cloud booking save:',e);}
   try{
     const history=JSON.parse(localStorage.getItem('vcCustomerBookings')||'[]');
     history.unshift(booking); localStorage.setItem('vcCustomerBookings',JSON.stringify(history.slice(0,20))); if(window.VC_refreshBookings) setTimeout(()=>window.VC_refreshBookings(),250);
   }catch(_){}
   const success=document.getElementById('vcBookingSuccess'), idEl=document.getElementById('vcSuccessBookingId'), summary=document.getElementById('vcSuccessSummary'), wa=document.getElementById('vcSuccessWhatsapp'), track=document.getElementById('vcSuccessTrack');
   if(idEl) idEl.textContent=bookingId;
   if(summary) summary.innerHTML=`<div><span>Journey</span><b>${fromV.replace(/</g,'&lt;')} → ${toV.replace(/</g,'&lt;')}</b></div><div><span>Car</span><b>${selectedCar}</b></div><div><span>Date & time</span><b>${date.value} • ${time.value}</b></div><div><span>Contact</span><b>${phone.replace(/</g,'&lt;')}</b></div>`;
   if(wa) wa.href=waUrl;
   if(track) track.onclick=()=>{window.location.href='track.html?booking='+encodeURIComponent(bookingId);};
   const successTitle=document.getElementById('vcBookingSuccessTitle'); if(successTitle) successTitle.textContent='Booking confirmed successfully';
   if(success){success.classList.add('is-open');success.setAttribute('aria-hidden','false');document.body.classList.add('vc-modal-open');}
   // Open WhatsApp automatically with the booking message. Browsers cannot silently press Send; the customer must tap Send.
   setTimeout(()=>{try{if(waWindow&&!waWindow.closed){waWindow.location.href=waUrl;}else{window.location.href=waUrl;}}catch(_){window.location.href=waUrl;}},450);
 });
})();

// Booking success modal controls.
(function(){
  const modal=document.getElementById('vcBookingSuccess'); if(!modal)return;
  const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('vc-modal-open');};
  modal.querySelectorAll('[data-booking-success-close]').forEach(b=>b.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
})();

// Premium customer helpers: rebook, saved places, trip sharing and rating.
function vcCustomerLocal(){try{return JSON.parse(localStorage.getItem('vcCustomerSession')||'null')}catch(e){return null}}
function vcSavedPlaces(){try{return JSON.parse(localStorage.getItem('vcSavedPlaces')||'{}')}catch(e){return {}}}
function vcSavePlace(kind,value){if(!value)return;const p=vcSavedPlaces();p[kind]=value;localStorage.setItem('vcSavedPlaces',JSON.stringify(p));const q=document.getElementById('vcSavedQuick');if(q)q.hidden=false;}
function vcShowSavedQuick(){const q=document.getElementById('vcSavedQuick');if(q){const p=vcSavedPlaces();q.hidden=!document.getElementById('from')?.value?.trim();q.querySelectorAll('[data-save-place]').forEach(b=>{b.textContent=p[b.dataset.savePlace]?'✓ '+(b.dataset.savePlace==='home'?'Home saved':'Work saved'):'＋ Save pickup as '+(b.dataset.savePlace==='home'?'Home':'Work');});}}
function vcBookingTimeline(status){const states=['Confirmed','Driver Assigned','On the Way','Arrived','Trip Started','Completed'];const current=states.indexOf(status);return '<div class="vcTimeline">'+states.map((x,i)=>'<div class="vcTimelineStep '+(i<=Math.max(current,0)?'done':'')+'"><span>'+(i<=Math.max(current,0)?'✓':i+1)+'</span><b>'+x+'</b></div>').join('')+'</div>';}
function vcShareBooking(b){const id=b.booking_id||b.id||'';const text=`Vijay Connect booking ${id}: ${b.pickup||b.from||'Pickup'} → ${b.dropoff||b.to||'Drop'}. Vehicle: ${b.vehicle||'Car'}. Date: ${b.travel_date||b.date||''} ${b.pickup_time||b.time||''}.`;if(navigator.share){navigator.share({title:'Vijay Connect trip',text}).catch(()=>{});}else{navigator.clipboard?.writeText(text);alert('Trip details copied.');}}
function vcRebook(b){const from=document.getElementById('from'),to=document.getElementById('to'),date=document.getElementById('travelDate'),time=document.getElementById('pickupTime');if(from)from.value=b.pickup||b.from||'';if(to)to.value=b.dropoff||b.to||'';if(date)date.value='';if(time)time.value='';document.querySelector('#contact')?.scrollIntoView({behavior:'smooth',block:'center'});const vehicle=b.vehicle?.toLowerCase();document.querySelectorAll('[data-booking-vehicle]').forEach(x=>x.classList.toggle('selected',x.dataset.bookingVehicle===vehicle));}
function vcRateBooking(id){const r=prompt('Rate your Vijay Connect ride (1–5):','5');if(r===null)return;const n=Math.max(1,Math.min(5,Number(r)||5));const ratings=JSON.parse(localStorage.getItem('vcRatings')||'{}');ratings[id]=n;localStorage.setItem('vcRatings',JSON.stringify(ratings));if(window.VC_refreshBookings)window.VC_refreshBookings();}

document.querySelectorAll('[data-save-place]').forEach(b=>b.addEventListener('click',()=>{const v=document.getElementById('from')?.value?.trim();if(v){vcSavePlace(b.dataset.savePlace,v);vcShowSavedQuick();}})); document.getElementById('from')?.addEventListener('input',vcShowSavedQuick); vcShowSavedQuick();
// Customer booking history: cloud-first, local fallback, with a Flipkart-style order-list experience.
(function(){
 const modal=document.getElementById('vcBookingsModal'), list=document.getElementById('vcBookingsList'), openBtn=document.getElementById('vcHeaderBookings');
 if(!modal||!list||!openBtn)return;
 const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const session=()=>{try{return JSON.parse(localStorage.getItem('vcCustomerSession')||'null')}catch(e){return null}};
 const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('vc-modal-open');};
 function render(items){
   if(!items.length){list.innerHTML='<div class="vcBookingEmpty"><strong>No bookings yet</strong><br><span>Once you book a Vijay Connect cab, your trips will appear here.</span></div>';return;}
   list.innerHTML=items.map(b=>{
     const id=b.booking_id||b.id||'—', from=b.pickup||b.from||'Pickup', to=b.dropoff||b.to||'Drop', vehicle=b.vehicle||'—', service=b.service||'—', fare=b.fare||'Price on request', date=b.travel_date||b.date||'—', time=b.pickup_time||b.time||'—', status=b.status||'Request created';
     return `<article class="vcBookingItem"><div class="vcBookingItemTop"><strong>Booking ${esc(id)}</strong><span class="vcBookingStatus">✓ ${esc(status)}</span></div><div class="vcBookingRoute">${esc(from)} → ${esc(to)}</div><div class="vcBookingMeta"><span>Vehicle<b>${esc(vehicle)}</b></span><span>Service<b>${esc(service)}</b></span><span>Date & time<b>${esc(date)} • ${esc(time)}</b></span><span>Fare<b>${esc(fare)}</b></span></div>${vcBookingTimeline(status)}<div class="vcBookingActions"><a class="vcBookingTrack" href="track.html?booking=${encodeURIComponent(id)}">Track Cab</a><button type="button" data-share-booking="${esc(id)}">Share Trip</button><button type="button" data-rebook="${esc(id)}">Book Again</button><button type="button" data-rate-booking="${esc(id)}">Rate Ride</button></div></article>`;
   }).join('');
 }
 async function load(){
   list.innerHTML='<div class="vcBookingEmpty">Loading your bookings…</div>';
   const s=session(); let items=[];
   if(s?.access_token&&s?.user?.id&&window.VC_customerGetBookings){
     try{items=await VC_customerGetBookings(s.access_token,s.user.id);}catch(e){console.warn('Booking history cloud load:',e);}
   }
   if(!items.length){try{items=JSON.parse(localStorage.getItem('vcCustomerBookings')||'[]');}catch(e){items=[];}}
   render(items);
 }
 function open(){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('vc-modal-open');load();}
 openBtn.addEventListener('click',open); modal.querySelectorAll('[data-bookings-close]').forEach(x=>x.addEventListener('click',close)); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
 window.VC_syncBookingsButton=function(){const s=session();openBtn.hidden=!(s?.access_token&&s?.user?.id);};
 window.VC_refreshBookings=load;
 VC_syncBookingsButton();
})();

// Owner full-site editor: apply saved theme/content/image/contact settings.
(function(){
 const q=id=>document.getElementById(id); const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
 const c=activeState.vijayContent||get('vijayContent')||{}, im=activeState.vijayImages||get('vijayImages')||{}, th=activeState.vijayTheme||get('vijayTheme')||{}, co=activeState.vijayContact||get('vijayContact')||{}, bk=activeState.vijayBooking||get('vijayBooking')||{}, settings=activeState.vijaySettings||get('vijaySettings')||{};
 Object.keys(c).forEach(k=>{const el=q(k);if(el)el.innerHTML=c[k]});
 Object.keys(im).forEach(k=>{const el=q(k);if(el&&im[k])el.src=im[k]});
 if(q('siteTitle')&&c.siteTitle)document.title=c.siteTitle.replace(/<[^>]*>/g,'');
 if(th.accent){document.documentElement.style.setProperty('--purple',th.accent);document.documentElement.style.setProperty('--purple2',th.accent);}
 if(th.bg)document.body.style.backgroundColor=th.bg;if(th.text)document.body.style.color=th.text;
 if(th.font)document.querySelectorAll('h1,h2,h3,.brandName,.btn').forEach(x=>x.style.fontFamily=th.font);
 if(th.bodyFont)document.body.style.fontFamily=th.bodyFont;
 if(q('bookingTitle')&&bk.title)q('bookingTitle').innerHTML=bk.title;if(q('bookingDesc')&&bk.desc)q('bookingDesc').innerHTML=bk.desc;
 if(co.phone){document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.href='tel:'+co.phone.replace(/\D/g,''));}
 if(co.email){document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+co.email;a.textContent=co.email})}
 if(co.address){const candidates=[...document.querySelectorAll('p')].filter(x=>x.textContent.includes('TNHM colony'));candidates.forEach(x=>x.textContent=co.address)}
 const hero=document.querySelector('.hero'); if(hero&&th.motion)hero.dataset.motion=th.motion; const offerSection=q('updatesSection'); if(offerSection) offerSection.style.display=settings.offerVisible===true?'block':'none';
})();

/* V29: owner-controlled festival opening banner calendar. */
(function(){
  const splash=document.getElementById('festivalSplash');
  if(!splash)return;
  const now=Date.now();
  let banners=[];
  try{banners=Array.isArray(activeState.vijayFestivalBanners)?activeState.vijayFestivalBanners:[]}catch(e){banners=[]}
  const active=banners.find(b=>b && b.enabled===true && b.start && b.end && now>=new Date(b.start).getTime() && now<new Date(b.end).getTime());
  const legacy=active ? null : (settings.splashEnabled===true && (!settings.splashStart||now>=new Date(settings.splashStart).getTime()) && (!settings.splashEnd||now<new Date(settings.splashEnd).getTime()) ? {name:'Vijay Connect Festival Special',image:'festival-drive-poster.png',duration:settings.splashDuration||1000}:null);
  const item=active||legacy;
  if(item){
    const img=splash.querySelector('img');
    const mark=splash.querySelector('.splashMark');
    if(img&&item.image)img.src=item.image;
    if(img&&item.name)img.alt='Vijay Connect '+item.name+' banner';
    if(mark)mark.textContent='VIJAY CONNECT • '+String(item.name||'FESTIVAL SPECIAL').toUpperCase();
    const duration=Math.max(500,Math.min(10000,Number(item.duration||1000)));
    setTimeout(()=>splash.classList.add('hide'),duration);
    setTimeout(()=>splash.remove(),duration+400);
  }else{
    splash.remove();
  }
  const campaign=document.getElementById('festivalCampaign');
  if(campaign) campaign.classList.toggle('is-visible', settings.offerVisible===true);
})();

function renderHomePromos(){
 const fallback={visible:true,title:"Latest offers & celebrations",desc:"Special fares, festival announcements and limited-time offers from Vijay Connect.",hero:[{id:"default",title:"Celebrate the journey",desc:"Festival rides, special offers and easy booking from Vijay Connect.",image:"festival-drive-poster.png",button:"Book Now",link:"#contact",enabled:true}]};
 let p; try{p=activeState.vijayHomePromos||JSON.parse(localStorage.getItem("vijayHomePromos")||"null")||fallback}catch(e){p=fallback}
 const sec=document.getElementById("festivalCampaign"); if(!sec)return; sec.style.display=p.visible===false?"none":"block";
 const title=document.getElementById("promoTitle"),desc=document.getElementById("promoDesc"); if(title)title.textContent=p.title||fallback.title;if(desc)desc.textContent=p.desc||fallback.desc;
 const hr=document.getElementById("promoHeroRail"); if(!hr)return;
 const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const slides=(p.hero||[]).filter(x=>x.enabled!==false).slice(0,5);
 hr.innerHTML=slides.map((x,i)=>`<article class="promoHeroCard promoHeroSlide" data-slide="${i}"><img src="${esc(x.image)}" alt="${esc(x.title||'Vijay Connect offer')}" loading="lazy" onerror="this.onerror=null;this.src='festival-drive-poster.png';"><div class="promoHeroShade"></div><div class="promoHeroCopy"><span>VIJAY CONNECT • SPECIAL OFFER</span><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>${x.link?`<a href="${esc(x.link)}">${esc(x.button||'Book Now')} <b>→</b></a>`:""}</div></article>`).join("");
 if(slides.length>1){ let i=0; const show=()=>{const cards=hr.querySelectorAll('.promoHeroSlide');cards.forEach((c,n)=>c.classList.toggle('active',n===i));i=(i+1)%cards.length;}; show(); clearInterval(window.vcPromoTimer); window.vcPromoTimer=setInterval(show,5000); } else { clearInterval(window.vcPromoTimer); const c=hr.querySelector('.promoHeroSlide'); if(c)c.classList.add('active'); }
}

document.addEventListener("DOMContentLoaded",renderHomePromos);
window.addEventListener("pageshow",renderHomePromos);

// Customer account popup: phone OTP registration/sign-in with persistent cloud account.
(function(){
  function initCustomerAuth(){
    const modal=document.getElementById('vcAuthModal'), form=document.getElementById('vcAuthForm');
    const name=document.getElementById('vcAuthName'), email=document.getElementById('vcAuthEmail'), phone=document.getElementById('vcAuthPhone');
    const password=document.getElementById('vcAuthPassword'), confirm=document.getElementById('vcAuthConfirm');
    const nameField=document.getElementById('vcNameField'), phoneField=document.getElementById('vcPhoneField'), confirmField=document.getElementById('vcConfirmField');
    const status=document.getElementById('vcAuthStatus'), submit=document.getElementById('vcAuthSubmit');
    const registerBtn=document.getElementById('vcRegisterMode'), loginBtn=document.getElementById('vcLoginMode'), lead=document.getElementById('vcAuthLead'), foot=document.getElementById('vcAuthFootnote');
    if(!modal||!form||!email||!password) return;
    let mode='register', skippedThisPage=false;
    const normalizePhone=v=>{let x=String(v||'').replace(/[^0-9+]/g,'');if(/^0?91\d{10}$/.test(x))x='+'+x.replace(/^0/,'');if(/^91\d{10}$/.test(x))x='+'+x;if(/^\d{10}$/.test(x))x='+91'+x;return x;};
    const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('vc-modal-open');};
    const session=()=>{try{return JSON.parse(localStorage.getItem('vcCustomerSession')||'null')}catch(e){return null}};
    const tokenPayload=token=>{try{const part=String(token||'').split('.')[1];if(!part)return null;const b=part.replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(atob(b.padEnd(Math.ceil(b.length/4)*4,'=')).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')))}catch(e){return null}};
    const isSignedIn=()=>{const s=session();if(!s?.access_token)return false;const payload=tokenPayload(s.access_token);return !payload?.exp||payload.exp*1000>Date.now()+15000;};
    const syncAuthButtons=()=>{const signed=isSignedIn();const header=document.getElementById('vcHeaderAuth'),mobile=document.getElementById('vcMobileSignIn');[header,mobile].forEach(b=>{if(!b)return;b.textContent='Login / Sign up';b.hidden=signed;});};
    const open=()=>{if(isSignedIn())return;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('vc-modal-open');setTimeout(()=>{(mode==='register'?name:email)?.focus()},80);};
    const setMode=m=>{
      mode=m; nameField.hidden=m!=='register'; phoneField.hidden=m!=='register'; confirmField.hidden=m!=='register';
      registerBtn.classList.toggle('active',m==='register');loginBtn.classList.toggle('active',m==='login');
      lead.textContent=m==='register'?'Create your account with your name, email, phone number and password.':'Sign in with the email and password linked to your Vijay Connect account.';
      submit.textContent=m==='register'?'Create Account':'Sign In'; status.textContent=''; status.className='vcAuthStatus'; foot.textContent='Email + password are used for sign in. Your phone number stays saved in your profile.';
      [name,email,phone,password,confirm].forEach(x=>{if(x){x.value='';x.readOnly=false;}});
      password.autocomplete=m==='register'?'new-password':'current-password'; confirm.value='';
    };
    [registerBtn,loginBtn].forEach(b=>b&&b.addEventListener('click',()=>setMode(b===registerBtn?'register':'login')));
    [document.getElementById('vcHeaderAuth'),document.getElementById('vcMobileSignIn')].forEach(b=>b&&b.addEventListener('click',open));
    document.querySelectorAll('[data-auth-skip]').forEach(b=>b.addEventListener('click',()=>{skippedThisPage=true;close();syncAuthButtons();}));
    form.addEventListener('submit',async e=>{
      e.preventDefault(); submit.disabled=true; status.className='vcAuthStatus';
      try{
        const em=String(email.value||'').trim().toLowerCase();
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) throw new Error('Enter a valid email address.');
        if(String(password.value||'').length<6) throw new Error('Password must be at least 6 characters.');
        let j, fullName='', p='';
        if(mode==='register'){
          fullName=name.value.trim(); if(fullName.length<2) throw new Error('Enter your full name.');
          p=normalizePhone(phone.value); if(!/^\+91\d{10}$/.test(p)) throw new Error('Enter a valid Indian 10-digit mobile number.');
          if(password.value!==confirm.value) throw new Error('Passwords do not match.');
          j=await VC_customerSignUp(em,password.value,fullName,p);
          if(!j?.access_token){
            status.textContent='✓ Account created. Please check your email if verification is enabled, then sign in.'; status.className='vcAuthStatus good';
            setMode('login'); email.value=em; close(); return;
          }
        }else{
          j=await VC_customerSignIn(em,password.value);
          if(!j?.access_token||!j?.user?.id) throw new Error('Login response was incomplete.');
          fullName=j.user.user_metadata?.full_name||''; p=j.user.user_metadata?.phone||'';
        }
        if(!j?.access_token||!j?.user?.id) throw new Error('Account could not be created. Please try again.');
        const sess={access_token:j.access_token,refresh_token:j.refresh_token||'',user:j.user}; localStorage.setItem('vcCustomerSession',JSON.stringify(sess));
        if(fullName||p) await VC_customerSaveProfile(j.access_token,j.user.id,fullName,p);
        try{const profile=await VC_customerGetProfile(j.access_token,j.user.id);if(profile)sess.profile=profile;}catch(e){}
        localStorage.setItem('vcCustomerSession',JSON.stringify(sess));
        const bookingPhone=document.getElementById('customerPhone');if(bookingPhone&&p)bookingPhone.value=String(p).replace(/^\+91/,'');
        skippedThisPage=false;syncAuthButtons();window.VC_syncBookingsButton?.();status.textContent=mode==='register'?'✓ Account created successfully':'✓ Signed in successfully';status.className='vcAuthStatus good';setTimeout(close,700);
      }catch(err){status.textContent='⚠️ '+(err.message||'Please try again.');status.className='vcAuthStatus warn';}
      finally{submit.disabled=false;}
    });
    (async()=>{
      const s=session();
      if(s?.refresh_token){try{const j=await VC_customerRefresh(s.refresh_token);if(j?.access_token){s.access_token=j.access_token;s.refresh_token=j.refresh_token||s.refresh_token;s.user=j.user||s.user;localStorage.setItem('vcCustomerSession',JSON.stringify(s));}}catch(e){localStorage.removeItem('vcCustomerSession');}}
      syncAuthButtons();window.VC_syncBookingsButton?.();if(!isSignedIn()&&!skippedThisPage)setTimeout(open,450);
      [document.getElementById('vcHeaderAuth'),document.getElementById('vcMobileSignIn')].forEach(b=>b&&b.addEventListener('click',()=>{if(!isSignedIn())open();}));
    })();
  }
  document.addEventListener('DOMContentLoaded',initCustomerAuth);
})();

/* Vijay Connect — current location pickup. Browser owns the native permission dialog. */
(function(){
  if(!('geolocation' in navigator)) return;
  let requestedThisVisit=false, map=null, marker=null, accuracyCircle=null, current=null;
  const $=id=>document.getElementById(id);
  function setStatus(msg,good=false){const el=$('vcLocationStatus');if(el){el.textContent=msg;el.style.color=good?'#15803d':'#64748b';}}
  function initMap(lat,lng){
    const box=$('vcCurrentLocationCard'); if(!box||typeof L==='undefined') return;
    box.hidden=false;
    if(!map){
      map=L.map('vcMiniMap',{zoomControl:true,scrollWheelZoom:false}).setView([lat,lng],16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
      marker=L.marker([lat,lng]).addTo(map).bindPopup('<b>Your current location</b>');
      accuracyCircle=L.circle([lat,lng],{radius:Math.max(current?.accuracy||30,20),weight:1,fillOpacity:.12}).addTo(map);
    }else{
      map.setView([lat,lng],16); marker.setLatLng([lat,lng]); accuracyCircle.setLatLng([lat,lng]).setRadius(Math.max(current?.accuracy||30,20));
    }
    setTimeout(()=>map.invalidateSize(),80);
  }
  async function reverseGeocode(lat,lng){
    try{
      const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+encodeURIComponent(lat)+'&lon='+encodeURIComponent(lng)+'&zoom=18&addressdetails=1',{headers:{'Accept':'application/json'}});
      if(!r.ok) throw new Error('reverse geocode failed');
      const d=await r.json(); const a=d.address||{};
      const parts=[a.road,a.neighbourhood||a.suburb,a.city||a.town||a.village].filter(Boolean);
      return parts.slice(0,3).join(', ') || d.display_name || '';
    }catch(e){return '';}
  }
  async function handlePosition(position){
    const lat=position.coords.latitude,lng=position.coords.longitude;
    current={lat,lng,accuracy:position.coords.accuracy,timestamp:Date.now()};
    window.vijayConnectCurrentLocation=current;
    window.dispatchEvent(new CustomEvent('vijayconnect:location',{detail:current}));
    const coord=$('vcCurrentLocationCoords'); if(coord) coord.textContent=lat.toFixed(6)+', '+lng.toFixed(6)+' • ±'+Math.round(position.coords.accuracy)+' m';
    setStatus('✓ Location enabled',true);
    initMap(lat,lng);
    const name=await reverseGeocode(lat,lng);
    const title=$('vcCurrentLocationName'); if(title) title.textContent=name||'Current location detected';
    const from=$('fromPlace');
    if(from && (!from.value.trim() || from.dataset.vcLocation==='true')){from.value=name||('Current location ('+lat.toFixed(5)+', '+lng.toFixed(5)+')');from.dataset.vcLocation='true';from.dispatchEvent(new Event('input',{bubbles:true}));}
  }
  function requestLocation(){
    if(requestedThisVisit)return; requestedThisVisit=true; setStatus('Requesting location permission…');
    navigator.geolocation.getCurrentPosition(handlePosition,function(err){
      if(err && err.code===1) setStatus('Location permission was not allowed. You can enable it later.');
      else setStatus('Could not get your location. Please try again.');
    },{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const btn=$('vcUseLocationBtn'); if(btn) btn.addEventListener('click',()=>{requestedThisVisit=false;requestLocation();});
    const center=$('vcLocationCenterBtn'); if(center) center.addEventListener('click',()=>{if(current&&map){map.setView([current.lat,current.lng],17);marker.openPopup();}});
    // Request after the first real user interaction so the browser can show its native dialog.
    document.addEventListener('pointerdown',requestLocation,{once:true,passive:true});
  });
})();
