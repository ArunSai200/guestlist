/* ===============================================================
   GUESTLIST -- shared.js
   Common state, data, router, modals, toast, sidebar nav.
   Loaded by BOTH vendor.html and customer.html.
   Each page additionally loads its own page-specific JS
   (vendor-app.js or customer-app.js) which registers its
   render functions into PAGE_RENDERERS below.
=============================================================== */

/* -----------------------------------------------
   STATE
----------------------------------------------- */
let role = document.body.dataset.role || 'vendor'; // 'vendor' | 'customer'
let currentPage = null;
let activeBidEvent = null;
let pendingAward = null;
let pendingReview = null;
let selectedStars = 0;
let signupStep = 1;
let postStep = 1;
let selectedCats = [];
let selectedNeeds = [];
const PAGE_RENDERERS = {}; // populated by vendor-app.js / customer-app.js

/* -----------------------------------------------
   SHARED DATA MODELS
   In production these come from Supabase. Here
   they're in-memory so both pages can run standalone.
----------------------------------------------- */
const CATS = [
  {id:'catering',label:'Catering',icon:'ti-chef-hat'},
  {id:'chairs',label:'Chairs & tables',icon:'ti-armchair'},
  {id:'decor',label:'Decor & florals',icon:'ti-flowers'},
  {id:'photo',label:'Photography',icon:'ti-camera'},
  {id:'sound',label:'Sound & AV',icon:'ti-speakerphone'},
  {id:'tent',label:'Tent & venue',icon:'ti-building'},
  {id:'cake',label:'Cake & desserts',icon:'ti-cake'},
  {id:'lighting',label:'Lighting',icon:'ti-bulb'},
];

const EVENTS = [
  {id:1,name:"Ahmed & Sara's Wedding",date:"Aug 12, 2025",loc:"Frisco, TX",budget:"$8,000-$12,000",needs:['catering','chairs','decor','photo','sound'],bids:8,status:'open'},
  {id:2,name:"Tech Startup Launch Party",date:"Jul 28, 2025",loc:"Addison, TX",budget:"$3,500-$5,000",needs:['catering','sound','lighting','decor'],bids:5,status:'open'},
  {id:3,name:"Fatima's Graduation Brunch",date:"Jul 5, 2025",loc:"Irving, TX",budget:"$1,200-$2,000",needs:['catering','decor','cake'],bids:6,status:'complete'},
  {id:4,name:"Corporate Gala - Q3",date:"Sep 20, 2025",loc:"Dallas, TX",budget:"$15,000-$20,000",needs:['catering','chairs','decor','photo','sound','lighting','tent'],bids:4,status:'open'},
];

const BIDS = {
  1:[
    {id:1,vendor:"Royal Feasts Catering",initials:"RF",bg:"#B5D4F4",tc:"#0C447C",cat:"Catering",price:"$4,200",rating:4.9,note:"Halal menu, South Asian fusion specialist.",awarded:false,reviewed:false},
    {id:2,vendor:"Dallas Table Co.",initials:"DT",bg:"#9FE1CB",tc:"#085041",cat:"Chairs & tables",price:"$1,800",rating:4.6,note:"200 chairs + 20 tables with linens, delivery included.",awarded:false,reviewed:false},
    {id:3,vendor:"Bloom & Thread",initials:"BT",bg:"#F5C4B3",tc:"#712B13",cat:"Decor & florals",price:"$2,600",rating:5.0,note:"Custom mandap decor, 12 years in DFW weddings.",awarded:false,reviewed:false},
  ],
  2:[
    {id:4,vendor:"Groove Sound DFW",initials:"GS",bg:"#FAC775",tc:"#633806",cat:"Sound & AV",price:"$900",rating:4.5,note:"Full PA, DJ setup, 4hr event.",awarded:false,reviewed:false},
    {id:5,vendor:"Metro Lighting Co.",initials:"ML",bg:"#C0DD97",tc:"#3B6D11",cat:"Lighting",price:"$750",rating:4.8,note:"LED wash, uplighting package.",awarded:false,reviewed:false},
  ],
  3:[
    {id:6,vendor:"Spice Garden Catering",initials:"SG",bg:"#B5D4F4",tc:"#0C447C",cat:"Catering",price:"$980",rating:4.3,note:"Desi home-style, 80 guests.",awarded:true,reviewed:false},
    {id:7,vendor:"Sweet Layers DFW",initials:"SL",bg:"#F4C0D1",tc:"#72243E",cat:"Cake & desserts",price:"$320",rating:5.0,note:"Custom 3-tier gold cake.",awarded:true,reviewed:true},
  ],
  4:[
    {id:8,vendor:"Prestige Events Catering",initials:"PE",bg:"#B5D4F4",tc:"#0C447C",cat:"Catering",price:"$8,500",rating:4.9,note:"Corporate specialist, 300+ pax.",awarded:false,reviewed:false},
  ],
};

const REVIEWS = [
  {vendor:"Bloom & Thread",initials:"BT",bg:"#F5C4B3",tc:"#712B13",cat:"Decor & florals",stars:5,reviewer:"Sara A.",event:"Wedding",date:"Jun 2025",text:"Breathtaking mandap decor. They added jasmine strings at no extra cost. Every guest stopped to compliment."},
  {vendor:"Royal Feasts Catering",initials:"RF",bg:"#B5D4F4",tc:"#0C447C",cat:"Catering",stars:5,reviewer:"Tariq A.",event:"Wedding",date:"May 2025",text:"Biryani was a hit with 250 guests. Halal-certified, on time, very professional."},
  {vendor:"Sweet Layers DFW",initials:"SL",bg:"#F4C0D1",tc:"#72243E",cat:"Cake & desserts",stars:5,reviewer:"Priya K.",event:"Birthday",date:"Apr 2025",text:"Masterpiece cake. Tasted as good as it looked. Fast response, fair pricing."},
  {vendor:"Dallas Table Co.",initials:"DT",bg:"#9FE1CB",tc:"#085041",cat:"Chairs & tables",stars:4,reviewer:"Maria R.",event:"Quinceañera",date:"Mar 2025",text:"Setup was slightly late but the chairs were gorgeous. Very professional once on site."},
  {vendor:"Groove Sound DFW",initials:"GS",bg:"#FAC775",tc:"#633806",cat:"Sound & AV",stars:4,reviewer:"James O.",event:"Corporate dinner",date:"Feb 2025",text:"Great sound for 150-person gala. Excellent mic quality."},
  {vendor:"Metro Lighting Co.",initials:"ML",bg:"#C0DD97",tc:"#3B6D11",cat:"Lighting",stars:5,reviewer:"Aisha B.",event:"Engagement",date:"Jan 2025",text:"Uplighting transformed the venue. Arrived early to fine-tune everything."},
];

const MESSAGES = [
  {id:1,name:"Sara A. -- Ahmed & Sara Wedding",preview:"Can you confirm delivery by 10am?",time:"2h ago",msgs:[
    {from:'them',text:"Hi! Can you confirm the chairs will be delivered by 10am on Aug 12?",time:"2h ago"},
    {from:'me',text:"Absolutely! We'll arrive at 9:30am for setup. Need anything else?",time:"1h 50m ago"},
    {from:'them',text:"Perfect, thank you! Also do you provide table linens?",time:"1h ago"},
  ]},
  {id:2,name:"James O. -- Corporate Gala",preview:"What's included in your package?",time:"Yesterday",msgs:[
    {from:'them',text:"Hello, what's included in your $2,000 package?",time:"Yesterday"},
    {from:'me',text:"That includes 250 chairs, 30 round tables, white linens, delivery and pickup.",time:"Yesterday"},
  ]},
  {id:3,name:"Maria G. -- Quinceañera",preview:"Do you do Garland?",time:"3 days ago",msgs:[
    {from:'them',text:"Do you service Garland TX? We're having a quinceañera on Aug 3.",time:"3 days ago"},
    {from:'me',text:"Yes! Garland is in our service area. Happy to bid on your event.",time:"3 days ago"},
  ]},
];

const VIBES = [
  {icon:'🌸',label:'Pastel mandap',count:'12 vendors',h:'160px',bg:'#FBEAF0'},
  {icon:'✨',label:'Gold & ivory',count:'19 vendors',h:'200px',bg:'#FAEEDA'},
  {icon:'🌿',label:'Garden green',count:'15 vendors',h:'180px',bg:'#E1F5EE'},
  {icon:'🌙',label:'Midnight glam',count:'7 vendors',h:'200px',bg:'#EEEDFE'},
  {icon:'🔴',label:'Bridal red',count:'11 vendors',h:'160px',bg:'#FAECE7'},
  {icon:'🕯️',label:'Moody romance',count:'8 vendors',h:'180px',bg:'#F1EFE8'},
];

const EVENT_TYPES = [
  {icon:'💍',label:'Wedding',msg:"Wishing you and your family the most beautiful celebration.",bg:'#1A1A2E'},
  {icon:'🎂',label:'Birthday',msg:"Hope it's a night to remember!",bg:'#993C1D'},
  {icon:'🤲',label:'Condolence meal',msg:"We're so sorry for your loss. Our vendors will handle every detail with care.",bg:'#444441'},
  {icon:'🎓',label:'Graduation',msg:"Congratulations! Vendors are ready to make it unforgettable.",bg:'#085041'},
  {icon:'🌙',label:'Eid gathering',msg:"Eid Mubarak! May your celebration be full of joy.",bg:'#3C3489'},
  {icon:'🎉',label:'Other',msg:"Your event is live! Vendors are already seeing your post.",bg:'#1A1A2E'},
];
let chosenEventType = 0;

/* -----------------------------------------------
   NAV CONFIG
----------------------------------------------- */
const NAV = {
  vendor:[
    {section:'Main',items:[
      {id:'vendor-dashboard',icon:'ti-layout-grid',label:'Dashboard'},
      {id:'vendor-opportunities',icon:'ti-bell',label:'Opportunities',badge:7},
      {id:'vendor-bids',icon:'ti-file-text',label:'My bids'},
    ]},
    {section:'Account',items:[
      {id:'vendor-profile',icon:'ti-user',label:'My profile'},
      {id:'vendor-messages',icon:'ti-message',label:'Messages',badge:2},
      {id:'vendor-earnings',icon:'ti-cash',label:'Earnings'},
      {id:'vendor-settings',icon:'ti-settings',label:'Settings'},
    ]},
  ],
  customer:[
    {section:'Events',items:[
      {id:'customer-dashboard',icon:'ti-layout-grid',label:'My events'},
      {id:'customer-post',icon:'ti-plus',label:'Post an event'},
      {id:'customer-reviews',icon:'ti-star',label:'Vendor reviews'},
      {id:'customer-vibes',icon:'ti-palette',label:'Find your vibe'},
    ]},
    {section:'Account',items:[
      {id:'customer-messages',icon:'ti-message',label:'Messages',badge:1},
      {id:'customer-payments',icon:'ti-credit-card',label:'Payments'},
      {id:'customer-settings',icon:'ti-settings',label:'Settings'},
    ]},
  ],
};

const PAGE_TITLES = {
  landing:'Home',
  'vendor-signup':'Vendor sign up','vendor-dashboard':'Dashboard','vendor-opportunities':'Opportunities',
  'vendor-bids':'My bids','vendor-profile':'My profile','vendor-messages':'Messages','vendor-earnings':'Earnings','vendor-settings':'Settings',
  'customer-signup':'Create account','customer-dashboard':'My events','customer-post':'Post an event',
  'customer-event-bids':'Bids received','customer-reviews':'Vendor reviews','customer-vibes':'Find your vibe',
  'customer-messages':'Messages','customer-payments':'Payments','customer-settings':'Settings',
};

/* -----------------------------------------------
   ROUTER
   Each file (vendor.html / customer.html) only
   contains the .page sections it needs, so
   navigate() warns (not errors) for missing pages.
----------------------------------------------- */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const el = document.getElementById('page-'+page);
  if(!el){
    console.warn('Page "'+page+'" not found in this file.');
    return;
  }
  el.classList.add('active');
  currentPage = page;

  const titleEl = document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent = PAGE_TITLES[page] || page;
  const contentEl = document.getElementById('content');
  if(contentEl) contentEl.scrollTop = 0;

  const isLanding = page === 'landing';
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  if(sidebar) sidebar.style.display = isLanding ? 'none' : '';
  if(topbar) topbar.style.display = isLanding ? 'none' : '';

  buildNav();
  buildTopbarActions(page);

  if(PAGE_RENDERERS[page]) PAGE_RENDERERS[page]();
}

/* -----------------------------------------------
   SIDEBAR NAV
----------------------------------------------- */
function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  if(!nav) return;
  const sections = NAV[role] || [];
  nav.innerHTML = sections.map(function(sec){
    return '<div class="nav-section">'
      + '<div class="nav-section-label">'+sec.section+'</div>'
      + sec.items.map(function(item){
          return '<button class="nav-item '+(currentPage===item.id?'active':'')+'" onclick="navigate(\''+item.id+'\')">'
            + '<i class="ti '+item.icon+'" aria-hidden="true"></i>'
            + item.label
            + (item.badge?'<span class="badge">'+item.badge+'</span>':'')
            + '</button>';
        }).join('')
      + '</div>';
  }).join('');
  const roleText = document.getElementById('role-text');
  const roleBadge = document.getElementById('role-badge');
  if(roleText) roleText.textContent = role.charAt(0).toUpperCase()+role.slice(1);
  if(roleBadge){
    roleBadge.textContent = role.charAt(0).toUpperCase()+role.slice(1);
    roleBadge.className = 'role-badge '+role;
  }
}

function buildTopbarActions(page) {
  const ta = document.getElementById('topbar-actions');
  if(!ta) return;
  if(page==='vendor-opportunities') ta.innerHTML='<button class="btn btn-sm" style="background:var(--bg-surface);" onclick="navigate(\'landing\')"><i class="ti ti-home" style="font-size:14px;vertical-align:-2px;margin-right:4px"></i>Landing page</button>';
  else if(page==='customer-dashboard') ta.innerHTML='<button class="btn btn-gold btn-sm" onclick="navigate(\'customer-post\')"><i class="ti ti-plus" style="font-size:14px;vertical-align:-2px;margin-right:3px"></i>Post event</button>';
  else ta.innerHTML='<button class="btn btn-sm" style="background:var(--bg-surface);" onclick="navigate(\'landing\')"><i class="ti ti-home" style="font-size:14px;vertical-align:-2px;margin-right:4px"></i>Home</button>';
}

/* -----------------------------------------------
   SHARED RENDER HELPERS
----------------------------------------------- */
function starsHTML(n,size){
  size = size || 13;
  return [1,2,3,4,5].map(function(i){
    return '<span style="color:'+(i<=Math.round(n)?'#BA7517':'#D3D1C7')+';font-size:'+size+'px;">★</span>';
  }).join('');
}

function reviewCardHTML(r,showVendor){
  const headerInfo = showVendor
    ? '<div style="font-size:13px;font-weight:600;">'+r.vendor+'</div><div style="font-size:11px;color:var(--text-muted);">'+r.cat+'</div>'
    : '<div style="font-size:13px;font-weight:600;">'+r.reviewer+'</div><div style="font-size:11px;color:var(--text-muted);">'+r.event+'</div>';
  return '<div class="review-card">'
    + '<div class="review-header">'
    +   '<div class="avatar" style="width:34px;height:34px;background:'+r.bg+';color:'+r.tc+';font-size:11px;">'+r.initials+'</div>'
    +   '<div style="flex:1;">'+headerInfo+'</div>'
    +   '<div style="text-align:right;"><div>'+starsHTML(r.stars,13)+'</div><div style="font-size:11px;color:var(--text-hint);margin-top:2px;">'+r.date+'</div></div>'
    + '</div>'
    + '<div class="review-body">'+r.text+'</div>'
    + '<div class="review-meta">— '+r.reviewer+' · '+r.event+'</div>'
    + '</div>';
}

function eventCardHTML(ev,ctx) {
  const needTags = ev.needs.map(function(n){
    const c = CATS.find(function(x){return x.id===n;});
    return c ? '<span class="need-tag"><i class="ti '+c.icon+'" style="font-size:12px"></i>'+c.label+'</span>' : '';
  }).join('');
  const statusClassMap = {open:'pill-green',awarded:'pill-navy',complete:'pill-gray'};
  const statusClass = statusClassMap[ev.status] || 'pill-gray';
  const action = ctx==='vendor'
    ? '<button class="btn btn-primary btn-sm" onclick="openBidModal('+ev.id+')">Bid ↗</button>'
    : '<button class="btn btn-sm" style="background:var(--bg-surface);" onclick="viewEventBids('+ev.id+')">View bids ('+ev.bids+')</button>';
  return '<div class="event-card">'
    + '<div class="event-header">'
    +   '<div><div class="event-name">'+ev.name+'</div><div class="event-meta"><i class="ti ti-calendar" style="font-size:12px;vertical-align:-1px;margin-right:3px"></i>'+ev.date+' · '+ev.loc+'</div></div>'
    +   '<span class="pill '+statusClass+'" style="margin-left:8px;">'+ev.status+'</span>'
    + '</div>'
    + '<div class="needs-row">'+needTags+'</div>'
    + '<div class="event-footer">'
    +   '<span><i class="ti ti-users" style="font-size:13px;vertical-align:-2px;margin-right:3px"></i>'+ev.bids+' bids</span>'
    +   '<span class="budget-label">'+ev.budget+'</span>'
    +   action
    + '</div>'
    + '</div>';
}

function renderMessages(ctx) {
  const listEl = document.getElementById(ctx+'-msg-list');
  if(!listEl) return;
  listEl.innerHTML = MESSAGES.map(function(m,i){
    return '<div class="msg-item '+(i===0?'active':'')+'" onclick="openThread('+m.id+',\''+ctx+'\')">'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;">'
      +   '<div class="msg-item-name">'+m.name+'</div><div class="msg-item-time">'+m.time+'</div>'
      + '</div>'
      + '<div class="msg-item-preview">'+m.preview+'</div>'
      + '</div>';
  }).join('');
  openThread(1,ctx);
}

function openThread(id,ctx) {
  const m = MESSAGES.find(function(x){return x.id===id;});
  if(!m) return;
  const threadEl = document.getElementById(ctx+'-msg-thread');
  if(!threadEl) return;
  const bubbles = m.msgs.map(function(msg){
    return '<div><div class="bubble '+msg.from+'">'+msg.text+'</div>'
      + '<div class="bubble-time" style="text-align:'+(msg.from==='me'?'right':'left')+';margin-top:3px;">'+msg.time+'</div></div>';
  }).join('');
  threadEl.innerHTML = '<div class="msg-thread-header"><div style="font-size:14px;font-weight:600;">'+m.name+'</div></div>'
    + '<div class="msg-bubbles" id="'+ctx+'-bubbles">'+bubbles+'</div>'
    + '<div class="msg-input-row">'
    +   '<input class="form-input" placeholder="Type a message..." id="'+ctx+'-msg-input" onkeydown="if(event.key===\'Enter\')sendMessage(\''+ctx+'\','+id+')"/>'
    +   '<button class="btn btn-primary btn-sm" onclick="sendMessage(\''+ctx+'\','+id+')"><i class="ti ti-send" style="font-size:14px"></i></button>'
    + '</div>';
}

function sendMessage(ctx,threadId){
  const inp = document.getElementById(ctx+'-msg-input');
  const val = inp.value.trim();
  if(!val) return;
  const bubbles = document.getElementById(ctx+'-bubbles');
  const div = document.createElement('div');
  div.innerHTML = '<div class="bubble me">'+val+'</div><div class="bubble-time" style="text-align:right;margin-top:3px;">Just now</div>';
  bubbles.appendChild(div);
  bubbles.scrollTop = bubbles.scrollHeight;
  inp.value = '';
}

/* -----------------------------------------------
   MODALS (bid / award / review)
   Modal markup lives in each HTML file; logic here.
----------------------------------------------- */
function openBidModal(evId){
  activeBidEvent=evId;
  const ev=EVENTS.find(function(e){return e.id===evId;});
  const sub = document.getElementById('bid-modal-sub');
  if(sub) sub.textContent = ev ? (ev.name+' · '+ev.loc+' · '+ev.budget) : '';
  document.getElementById('bid-modal').classList.add('open');
}
function submitBid(){
  const price=document.getElementById('bid-price').value.trim();
  if(!price){toast('Please enter a price quote.');return;}
  const ev = EVENTS.find(function(e){return e.id===activeBidEvent;});
  toast('✓ Bid submitted for '+(ev?ev.name:'event')+'!');
  closeModal('bid-modal');
  ['bid-price','bid-includes','bid-note'].forEach(function(id){const el=document.getElementById(id);if(el)el.value='';});
}

function openAwardModal(evId,bidId){
  const bid=(BIDS[evId]||[]).find(function(b){return b.id===bidId;});
  const ev=EVENTS.find(function(e){return e.id===evId;});
  if(!bid||!ev)return;
  pendingAward={evId:evId,bidId:bidId};
  document.getElementById('award-modal-title').textContent='Award "'+bid.cat+'" to '+bid.vendor+'?';
  document.getElementById('award-modal-body').textContent='You\'re awarding this job at '+bid.price+'. The vendor will be notified and their contact details shared with you.';
  document.getElementById('award-modal').classList.add('open');
}
function confirmAward(){
  if(!pendingAward)return;
  const evId=pendingAward.evId, bidId=pendingAward.bidId;
  const bid=(BIDS[evId]||[]).find(function(b){return b.id===bidId;});
  const ev=EVENTS.find(function(e){return e.id===evId;});
  if(bid){bid.awarded=true;}
  if(ev){ev.status='awarded';}
  closeModal('award-modal');
  toast('✓ Awarded to '+(bid?bid.vendor:'')+'! They\'ve been notified.');
  if(typeof viewEventBids === 'function') viewEventBids(evId);
}

function openReviewModal(evId,bidId){
  const bid=(BIDS[evId]||[]).find(function(b){return b.id===bidId;});
  if(!bid)return;
  pendingReview={evId:evId,bidId:bidId};
  selectedStars=0;
  document.getElementById('review-modal-vendor').textContent='Reviewing: '+bid.vendor+' · '+bid.cat;
  document.getElementById('review-text').value='';
  document.getElementById('review-event-type').value='';
  setStars(0);
  document.getElementById('review-modal').classList.add('open');
}
function setStars(n){
  selectedStars=n;
  document.querySelectorAll('#star-row button').forEach(function(b){
    const v=parseInt(b.dataset.val);
    b.style.color = v<=n ? '#BA7517' : '#D3D1C7';
  });
}
function submitReview(){
  if(!selectedStars){toast('Please select a star rating.');return;}
  const text=document.getElementById('review-text').value.trim();
  if(!text){toast('Please write a review.');return;}
  const evId=pendingReview.evId, bidId=pendingReview.bidId;
  const bid=(BIDS[evId]||[]).find(function(b){return b.id===bidId;});
  if(bid)bid.reviewed=true;
  REVIEWS.unshift({
    vendor:bid.vendor,initials:bid.initials,bg:bid.bg,tc:bid.tc,cat:bid.cat,
    stars:selectedStars,reviewer:"You",
    event:document.getElementById('review-event-type').value||'Event',
    date:'Jun 2025',text:document.getElementById('review-text').value
  });
  closeModal('review-modal');
  toast('✓ Review submitted for '+(bid?bid.vendor:'')+'!');
  if(typeof viewEventBids === 'function') viewEventBids(evId);
}
function closeModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.remove('open');
  pendingAward=null;
  pendingReview=null;
}

/* -----------------------------------------------
   TOAST
----------------------------------------------- */
function toast(msg){
  let wrap=document.getElementById('toast-wrap');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='toast-wrap';
    wrap.className='toast-wrap';
    document.body.appendChild(wrap);
  }
  const t=document.createElement('div');
  t.className='toast';
  t.textContent=msg;
  wrap.appendChild(t);
  requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add('show');});});
  setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove();},400);},2800);
}

/* -----------------------------------------------
   CONFETTI (landing page hero, both files)
----------------------------------------------- */
function initConfetti(){
  const canvas=document.getElementById('confetti-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const resize=function(){canvas.width=canvas.parentElement.offsetWidth;canvas.height=canvas.parentElement.offsetHeight;};
  resize();
  window.addEventListener('resize',resize);
  const COLORS=['#D4A843','#ffffff','#F5C4B3','#9FE1CB','#AFA9EC','#F4C0D1','#FAC775','#85B7EB'];
  const pieces=Array.from({length:120},function(){
    return {
      x:Math.random()*window.innerWidth,y:Math.random()*-600-10,
      w:Math.random()*9+4,h:Math.random()*5+2,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      rot:Math.random()*Math.PI*2,rotSpeed:(Math.random()-.5)*.13,
      vx:(Math.random()-.5)*1.3,vy:Math.random()*2.2+.7,
      opacity:Math.random()*.55+.45,shape:Math.random()>.4?'rect':'circle'
    };
  });
  function tick(){
    if(currentPage!=='landing'){requestAnimationFrame(tick);return;}
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;p.rot+=p.rotSpeed;
      if(p.y>canvas.height+20){p.y=Math.random()*-80-10;p.x=Math.random()*canvas.width;}
      ctx.save();ctx.globalAlpha=p.opacity;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;
      if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill();}
      else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
}

/* -----------------------------------------------
   CATEGORY TOGGLES (signup + post-event wizards)
----------------------------------------------- */
function toggleCat(id) {
  if(selectedCats.includes(id)) selectedCats=selectedCats.filter(function(x){return x!==id;});
  else selectedCats.push(id);
  const el = document.getElementById('cc-'+id);
  if(el) el.classList.toggle('checked',selectedCats.includes(id));
}
function toggleNeed(id){
  if(selectedNeeds.includes(id)) selectedNeeds=selectedNeeds.filter(function(x){return x!==id;});
  else selectedNeeds.push(id);
  const el=document.getElementById('pn-'+id);
  if(el) el.classList.toggle('checked',selectedNeeds.includes(id));
}
