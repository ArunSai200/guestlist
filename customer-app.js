/* ===============================================================
   GUESTLIST -- customer-app.js
   Customer-only page renderers, signup wizard, post-event wizard.
   Requires shared.js to be loaded first.
=============================================================== */

PAGE_RENDERERS['customer-signup']    = function(){ renderCustomerSignup(1); };
PAGE_RENDERERS['customer-dashboard'] = renderCustomerDashboard;
PAGE_RENDERERS['customer-post']      = function(){ renderPostEvent(1); };
PAGE_RENDERERS['customer-reviews']   = function(){ renderAllReviews(); };
PAGE_RENDERERS['customer-vibes']     = renderVibes;
PAGE_RENDERERS['customer-messages']  = function(){ renderMessages('customer'); };

/* -----------------------------------------------
   DASHBOARD
----------------------------------------------- */
function renderCustomerDashboard() {
  const g = document.getElementById('customer-events-grid');
  if(!g) return;
  g.innerHTML = EVENTS.map(function(ev){ return eventCardHTML(ev,'customer'); }).join('');
}

/* -----------------------------------------------
   VIEW BIDS FOR AN EVENT
----------------------------------------------- */
function viewEventBids(evId) {
  const ev = EVENTS.find(function(e){return e.id===evId;});
  if (!ev) return;
  const nameEl = document.getElementById('bids-event-name');
  const metaEl = document.getElementById('bids-event-meta');
  if(nameEl) nameEl.textContent = ev.name;
  if(metaEl) metaEl.textContent = ev.date+' · '+ev.loc+' · Budget: '+ev.budget;

  const bids = BIDS[evId] || [];
  const inner = document.getElementById('bids-list-inner');
  if(!inner) return;

  if(!bids.length){
    inner.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">No bids yet.</div>';
    navigate('customer-event-bids');
    return;
  }

  inner.innerHTML = bids.map(function(b){
    let action;
    if(ev.status==='complete' && b.awarded){
      action = b.reviewed
        ? '<span class="pill pill-green">✓ Reviewed</span>'
        : '<button class="btn btn-sm" style="border-color:var(--gold);color:#854F0B;" onclick="openReviewModal('+evId+','+b.id+')"><i class="ti ti-star" style="font-size:13px;vertical-align:-2px"></i> Review</button>';
    } else if(ev.status==='complete'){
      action = '<span style="font-size:11px;color:var(--text-hint);">Not selected</span>';
    } else if(b.awarded){
      action = '<span class="pill pill-green">✓ Awarded</span>';
    } else {
      action = '<button class="btn btn-primary btn-sm" onclick="openAwardModal('+evId+','+b.id+')">Award</button>';
    }
    return '<div class="bid-row">'
      + '<div class="avatar" style="width:36px;height:36px;background:'+b.bg+';color:'+b.tc+';font-size:11px;">'+b.initials+'</div>'
      + '<div class="bid-info">'
      +   '<div class="bid-vendor-name">'+b.vendor+'</div>'
      +   '<div class="bid-cat">'+b.cat+' · '+starsHTML(b.rating,12)+' '+b.rating+'</div>'
      +   '<div class="bid-note">'+b.note+'</div>'
      + '</div>'
      + '<div style="text-align:right;flex-shrink:0;">'
      +   '<div class="bid-price">'+b.price+'</div>'
      +   '<div style="margin-top:6px;">'+action+'</div>'
      + '</div></div>';
  }).join('');

  navigate('customer-event-bids');
}

/* -----------------------------------------------
   VENDOR REVIEWS (browse + filter)
----------------------------------------------- */
function renderAllReviews(filter, catFilter) {
  filter = filter || '';
  catFilter = catFilter || '';
  const c = document.getElementById('all-reviews-container');
  if(!c) return;
  const filtered = REVIEWS.filter(function(r){
    const matchesText = !filter || r.vendor.toLowerCase().includes(filter) || r.text.toLowerCase().includes(filter);
    const matchesCat = !catFilter || r.cat===catFilter;
    return matchesText && matchesCat;
  });
  if(!filtered.length){
    c.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">No reviews found.</div>';
    return;
  }
  c.innerHTML = filtered.map(function(r){ return reviewCardHTML(r,true); }).join('');
}
function filterAllReviews(v){ renderAllReviews(v.toLowerCase(), window._reviewCatFilter || ''); }
function filterAllReviewsCat(v){ window._reviewCatFilter = v; renderAllReviews('', v); }

/* -----------------------------------------------
   FIND YOUR VIBE (Pinterest-style board)
----------------------------------------------- */
function renderVibes() {
  const m = document.getElementById('vibes-mosaic');
  if(!m) return;
  m.innerHTML = VIBES.map(function(v){
    return '<div class="mosaic-tile">'
      + '<div class="mosaic-bg" style="height:'+v.h+';background:'+v.bg+';">'+v.icon+'</div>'
      + '<button class="heart-btn" aria-label="Save"><i class="ti ti-heart" style="font-size:14px;color:#993556"></i></button>'
      + '<div class="mosaic-overlay"><div class="mosaic-title">'+v.label+'</div><div class="mosaic-count">'+v.count+'</div></div>'
      + '</div>';
  }).join('');
}
function filterVibes(el,tag){
  document.querySelectorAll('[onclick^="filterVibes"]').forEach(function(e){
    e.style.background='transparent';e.style.color='var(--text-muted)';e.style.borderColor='var(--border-md)';
  });
  el.style.background='var(--navy)';el.style.color='#fff';el.style.borderColor='var(--navy)';
  toast('Showing '+tag+' inspiration');
}

/* -----------------------------------------------
   CUSTOMER SIGNUP (lightweight 2-step)
----------------------------------------------- */
function renderCustomerSignup(step){
  const card = document.getElementById('csignup-content');
  if(!card) return;
  const progress = '<div style="display:flex;gap:4px;margin-bottom:18px;">'
    + [1,2].map(function(n){ return '<div style="flex:1;height:3px;border-radius:2px;background:'+(n<=step?'var(--navy)':'var(--border)')+'"></div>'; }).join('')
    + '</div>';

  if(step===1){
    card.innerHTML = progress
      + '<div style="font-size:16px;font-weight:600;margin-bottom:3px;">Find vendors for your event</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:18px;">Create your free GUESTLIST account — takes under a minute</div>'
      + '<button class="btn" style="width:100%;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="toast(\'Google auth coming soon!\')"><i class="ti ti-brand-google" style="font-size:16px"></i> Continue with Google</button>'
      + '<div style="display:flex;align-items:center;gap:10px;margin:12px 0;"><div style="flex:1;height:0.5px;background:var(--border);"></div><span style="font-size:12px;color:var(--text-muted);">or</span><div style="flex:1;height:0.5px;background:var(--border);"></div></div>'
      + '<div class="form-group"><label class="form-label">Full name</label><input class="form-input" placeholder="Fatima Al-Rashid" id="cs-name"/></div>'
      + '<div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="fatima@example.com" id="cs-email"/></div>'
      + '<div class="form-group"><label class="form-label">Phone</label><input class="form-input" placeholder="(214) 555-0192" id="cs-phone"/></div>'
      + '<div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" placeholder="Min 8 characters" id="cs-pass"/></div>'
      + '<div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;">By continuing you agree to our <span style="color:var(--gold);cursor:pointer;">Terms</span> and <span style="color:var(--gold);cursor:pointer;">Privacy Policy</span>.</div>'
      + '<button class="btn btn-primary" style="width:100%;" onclick="renderCustomerSignup(2)">Create account →</button>'
      + '<div style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:14px;">Are you a vendor? <span style="color:var(--gold);cursor:pointer;font-weight:500;" onclick="toast(\'Open vendor.html to sign up as a vendor\')">Sign up here</span></div>';
  } else if(step===2){
    const nextSteps = [
      ['ti-file-plus','Post your event — date, budget, what you need'],
      ['ti-bell','Verified DFW vendors send you bids'],
      ['ti-trophy','Compare and award the ones you love'],
      ['ti-star','Leave a review after your event']
    ].map(function(pair){
      return '<div style="display:flex;align-items:center;gap:9px;font-size:13px;color:var(--text-muted);margin-bottom:8px;"><i class="ti '+pair[0]+'" style="font-size:15px;color:var(--gold);"></i>'+pair[1]+'</div>';
    }).join('');

    card.innerHTML = '<div style="text-align:center;padding:10px 0;">'
      + '<div class="success-ring"><i class="ti ti-confetti" style="font-size:24px;color:white;"></i></div>'
      + '<div style="font-size:18px;font-weight:600;margin-bottom:6px;">Welcome to GUESTLIST!</div>'
      + '<div style="font-size:13px;color:var(--text-muted);max-width:300px;margin:0 auto 18px;">Your account is ready. As a first-time customer, here\'s a little something to get you started.</div>'
      + '<div class="discount-card" style="margin-bottom:20px;">'
      +   '<div style="font-size:12px;color:#854F0B;margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em;">Your welcome gift</div>'
      +   '<div class="code-box">WELCOME10</div>'
      +   '<div style="font-size:12px;color:#854F0B;">10% off your first vendor booking</div>'
      + '</div>'
      + '<div style="background:var(--bg-surface);border-radius:var(--r);padding:16px;text-align:left;margin-bottom:20px;">'
      +   '<div style="font-size:12px;font-weight:600;margin-bottom:10px;">What happens next</div>'+nextSteps
      + '</div>'
      + '<button class="btn btn-gold" style="width:100%;" onclick="navigate(\'customer-post\')">Post my first event →</button>'
      + '</div>';
  }
}

/* -----------------------------------------------
   POST EVENT WIZARD (3 steps)
----------------------------------------------- */
function renderPostEvent(step) {
  postStep = step;
  const card = document.getElementById('post-event-card');
  if(!card) return;

  const progressBar = '<div style="display:flex;gap:4px;margin-bottom:20px;">'
    + [1,2,3].map(function(n){ return '<div style="flex:1;height:3px;border-radius:2px;background:'+(n<=step?'var(--navy)':'var(--border)')+'"></div>'; }).join('')
    + '</div><div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;">Step '+step+' of 3</div>';

  if(step===1){
    const typeChoices = EVENT_TYPES.map(function(t,i){
      const sel = i===chosenEventType;
      return '<div id="et-'+i+'" style="border:0.5px solid '+(sel?'var(--gold)':'var(--border-md)')+';border-radius:var(--r);padding:10px 8px;text-align:center;cursor:pointer;background:'+(sel?'#FBF5E6':'var(--bg-surface)')+';font-size:12px;color:'+(sel?'#8B6914':'var(--text-muted)')+';" onclick="selectEventType('+i+')">'+t.icon+'<div style="margin-top:4px;">'+t.label+'</div></div>';
    }).join('');

    card.innerHTML = progressBar
      + '<div style="font-size:16px;font-weight:600;margin-bottom:3px;">Tell us about your event</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Takes under 3 minutes</div>'
      + '<div class="form-label" style="margin-bottom:8px;">Event type</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">'+typeChoices+'</div>'
      + '<div class="form-group"><label class="form-label">Event name</label><input class="form-input" placeholder="e.g. Fatima\'s wedding reception" id="pe-name"/></div>'
      + '<div class="two-col"><div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" id="pe-date"/></div><div class="form-group"><label class="form-label">Location</label><input class="form-input" placeholder="Frisco, TX" id="pe-loc"/></div></div>'
      + '<div class="form-group"><label class="form-label">Budget range</label><input class="form-input" placeholder="e.g. $3,000 - $5,000" id="pe-budget"/></div>'
      + '<button class="btn btn-primary" style="width:100%;" onclick="renderPostEvent(2)">Continue →</button>';

  } else if(step===2){
    const catGrid = CATS.map(function(c){
      return '<div class="cat-check '+(selectedNeeds.includes(c.id)?'checked':'')+'" id="pn-'+c.id+'" onclick="toggleNeed(\''+c.id+'\')"><i class="ti '+c.icon+'"></i>'+c.label+'</div>';
    }).join('');

    card.innerHTML = progressBar
      + '<div style="font-size:16px;font-weight:600;margin-bottom:3px;">What vendors do you need?</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Select all that apply</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px;">'+catGrid+'</div>'
      + '<div class="form-group"><label class="form-label">Additional details</label><textarea class="form-input" rows="3" placeholder="Guest count, special requirements, anything vendors should know..."></textarea></div>'
      + '<div style="display:flex;gap:8px;"><button class="btn" onclick="renderPostEvent(1)">← Back</button><button class="btn btn-primary" style="flex:1;" onclick="renderPostEvent(3)">Post event ↗</button></div>';

  } else if(step===3){
    const et = EVENT_TYPES[chosenEventType];
    const nameInput = document.getElementById('pe-name');
    const dateInput = document.getElementById('pe-date');
    const locInput = document.getElementById('pe-loc');
    const budgetInput = document.getElementById('pe-budget');
    const evName = (nameInput && nameInput.value) || 'Your event';

    const newEv = {
      id: EVENTS.length+10,
      name: evName,
      date: (dateInput && dateInput.value) || 'TBD',
      loc: (locInput && locInput.value) || 'DFW, TX',
      budget: (budgetInput && budgetInput.value) || 'TBD',
      needs: selectedNeeds.slice(),
      bids: 0,
      status: 'open'
    };
    EVENTS.unshift(newEv);
    BIDS[newEv.id] = [];

    card.innerHTML = '<div style="text-align:center;">'
      + '<div style="background:'+et.bg+';border-radius:var(--rl);padding:28px;margin-bottom:20px;">'
      +   '<div style="font-size:44px;margin-bottom:12px;">'+et.icon+'</div>'
      +   '<div style="font-size:18px;font-weight:600;color:#fff;margin-bottom:6px;">'+evName+' is live.</div>'
      +   '<div style="font-size:13px;color:rgba(255,255,255,.65);">'+et.msg+'</div>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;">'
      +   '<div class="stat-card"><div class="stat-label">Bids received</div><div class="stat-value">0</div></div>'
      +   '<div class="stat-card"><div class="stat-label">Vendors notified</div><div class="stat-value">'+(selectedNeeds.length * 8)+'</div></div>'
      +   '<div class="stat-card"><div class="stat-label">Avg first bid</div><div class="stat-value">&lt;3h</div></div>'
      + '</div>'
      + '<div class="discount-card" style="margin-bottom:18px;">'
      +   '<div style="font-size:12px;color:#854F0B;margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em;">First booking gift</div>'
      +   '<div class="code-box">WELCOME10</div>'
      +   '<div style="font-size:12px;color:#854F0B;">10% off your first vendor booking</div>'
      + '</div>'
      + '<div style="display:flex;gap:8px;">'
      +   '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'customer-dashboard\')">View my events</button>'
      +   '<button class="btn" onclick="toast(\'Event link copied!\')">Share</button>'
      + '</div></div>';

    selectedNeeds = [];
  }
}

function selectEventType(i){
  chosenEventType = i;
  document.querySelectorAll('[id^="et-"]').forEach(function(el,j){
    el.style.border = '0.5px solid '+(j===i?'var(--gold)':'var(--border-md)');
    el.style.background = j===i ? '#FBF5E6' : 'var(--bg-surface)';
    el.style.color = j===i ? '#8B6914' : 'var(--text-muted)';
  });
}
