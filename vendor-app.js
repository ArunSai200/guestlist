/* ===============================================================
   GUESTLIST -- vendor-app.js
   Vendor-only page renderers + the vendor signup wizard.
   Requires shared.js to be loaded first.
=============================================================== */

PAGE_RENDERERS['vendor-signup']       = function(){ renderSignup(1); };
PAGE_RENDERERS['vendor-dashboard']    = renderVendorDashboard;
PAGE_RENDERERS['vendor-opportunities']= renderAllOpps;
PAGE_RENDERERS['vendor-bids']         = renderMyBids;
PAGE_RENDERERS['vendor-profile']      = renderVendorProfileReviews;
PAGE_RENDERERS['vendor-messages']     = function(){ renderMessages('vendor'); };

/* -----------------------------------------------
   DASHBOARD
----------------------------------------------- */
function renderVendorDashboard() {
  const g = document.getElementById('vendor-opps-grid');
  if(!g) return;
  g.innerHTML = EVENTS.filter(function(e){return e.status==='open';})
    .map(function(ev){return eventCardHTML(ev,'vendor');}).join('');
}

/* -----------------------------------------------
   OPPORTUNITIES
----------------------------------------------- */
function renderAllOpps() {
  const l = document.getElementById('all-opps-list');
  if(!l) return;
  l.innerHTML = EVENTS.filter(function(e){return e.status==='open';}).map(function(ev){
    return '<div class="card" style="margin-bottom:10px;display:flex;align-items:center;gap:14px;">'
      + '<div style="width:38px;height:38px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
      +   '<i class="ti ti-calendar-event" style="font-size:18px;color:#185FA5"></i></div>'
      + '<div style="flex:1;"><div style="font-size:14px;font-weight:600;">'+ev.name+'</div>'
      +   '<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">'+ev.loc+' · '+ev.date+' · '+ev.needs.length+' vendor types needed</div></div>'
      + '<div style="text-align:right;"><div style="font-size:14px;font-weight:600;color:#185FA5;">'+ev.budget+'</div>'
      +   '<button class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="openBidModal('+ev.id+')">Place bid ↗</button></div>'
      + '</div>';
  }).join('');
}

/* -----------------------------------------------
   MY BIDS
----------------------------------------------- */
function renderMyBids() {
  const l = document.getElementById('my-bids-list');
  if(!l) return;
  const allBids = [];
  Object.keys(BIDS).forEach(function(evId){
    BIDS[evId].forEach(function(b){ allBids.push(Object.assign({},b,{evId:parseInt(evId)})); });
  });
  if(!allBids.length){l.innerHTML='<div class="card" style="text-align:center;color:var(--text-muted);padding:40px;">No bids yet.</div>';return;}
  l.innerHTML = allBids.map(function(b){
    const ev = EVENTS.find(function(e){return e.id===b.evId;});
    return '<div class="card" style="margin-bottom:10px;">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
      +   '<div style="font-size:14px;font-weight:600;">'+(ev?ev.name:'Event')+'</div>'
      +   (b.awarded?'<span class="pill pill-green">✓ Won</span>':'<span class="pill pill-gold">Pending</span>')
      + '</div>'
      + '<div style="font-size:12px;color:var(--text-muted);">'+b.cat+'</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:0.5px solid var(--border);font-size:12px;color:var(--text-muted);">'
      +   '<span>Your quote: <strong style="color:var(--text);">'+b.price+'</strong></span><span>'+(ev?ev.date:'')+'</span>'
      + '</div></div>';
  }).join('');
}

/* -----------------------------------------------
   PROFILE
----------------------------------------------- */
function renderVendorProfileReviews() {
  const c = document.getElementById('vendor-profile-reviews');
  if(!c) return;
  c.innerHTML = '<div class="section-label" style="margin-bottom:10px;">Customer reviews</div>'
    + REVIEWS.slice(0,3).map(function(r){return reviewCardHTML(r);}).join('');
}

/* -----------------------------------------------
   VENDOR SIGNUP WIZARD (4 steps)
----------------------------------------------- */
function renderSignup(step) {
  signupStep = step;
  const stepBarHTML = '<div style="margin-bottom:6px;" class="step-bar">'
    + [1,2,3,4].map(function(n,i){
        const cls = n<step?'done':n===step?'active':'inactive';
        const inner = n<step ? '<i class="ti ti-check" style="font-size:12px"></i>' : n;
        return '<div class="step-dot '+cls+'">'+inner+'</div>'
          + (i<3 ? '<div class="step-line '+(n<step?'done':'')+'"></div>' : '');
      }).join('')
    + '</div>'
    + '<div class="step-labels" style="margin-bottom:20px;">'
    + ['Account','Business','Category','Done'].map(function(l,i){
        return '<div class="step-lbl '+(i+1===step?'active':'')+'">'+l+'</div>';
      }).join('')
    + '</div>';

  const catGrid = CATS.map(function(c){
    return '<div class="cat-check '+(selectedCats.includes(c.id)?'checked':'')+'" id="cc-'+c.id+'" onclick="toggleCat(\''+c.id+'\')"><i class="ti '+c.icon+'"></i>'+c.label+'</div>';
  }).join('');

  const areaPills = ['Frisco','Plano','Allen','McKinney','Dallas','Irving','Garland','Richardson'].map(function(c,i){
    const sel = i<4;
    return '<span style="font-size:12px;padding:4px 10px;border-radius:20px;border:0.5px solid '+(sel?'var(--gold)':'var(--border-md)')+';background:'+(sel?'#FBF5E6':'transparent')+';color:'+(sel?'#8B6914':'var(--text-muted)')+';cursor:pointer;" onclick="this.style.borderColor=this.style.borderColor===\'var(--gold)\'?\'var(--border-md)\':\'var(--gold)\'">'+c+'</span>';
  }).join('');

  const nextSteps = [
    ['ti-mail','Confirm your email address'],
    ['ti-shield-check','We verify your documents (24h)'],
    ['ti-bell','Get notified of matching events'],
    ['ti-trophy','Win jobs and build your reputation']
  ].map(function(pair){
    return '<div style="display:flex;align-items:center;gap:9px;font-size:13px;color:var(--text-muted);margin-bottom:8px;"><i class="ti '+pair[0]+'" style="font-size:15px;color:var(--gold);"></i>'+pair[1]+'</div>';
  }).join('');

  const steps = {
    1: stepBarHTML
      + '<div style="font-size:16px;font-weight:600;margin-bottom:3px;">Create your vendor account</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:18px;">Join 140+ vendors already on GUESTLIST</div>'
      + '<button class="btn" style="width:100%;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="toast(\'Google auth coming soon!\')"><i class="ti ti-brand-google" style="font-size:16px"></i> Continue with Google</button>'
      + '<div style="display:flex;align-items:center;gap:10px;margin:12px 0;"><div style="flex:1;height:0.5px;background:var(--border);"></div><span style="font-size:12px;color:var(--text-muted);">or</span><div style="flex:1;height:0.5px;background:var(--border);"></div></div>'
      + '<div class="two-col"><div class="form-group"><label class="form-label">First name</label><input class="form-input" placeholder="Sara" id="su-first"/></div><div class="form-group"><label class="form-label">Last name</label><input class="form-input" placeholder="Al-Rashid" id="su-last"/></div></div>'
      + '<div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="sara@example.com" id="su-email"/></div>'
      + '<div class="form-group"><label class="form-label">Phone</label><input class="form-input" placeholder="(214) 555-0192" id="su-phone"/></div>'
      + '<div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" placeholder="Min 8 characters" id="su-pass"/></div>'
      + '<div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;">By continuing you agree to our <span style="color:var(--gold);cursor:pointer;">Terms</span> and <span style="color:var(--gold);cursor:pointer;">Privacy Policy</span>.</div>'
      + '<button class="btn btn-primary" style="width:100%;" onclick="renderSignup(2)">Continue →</button>',

    2: stepBarHTML
      + '<div style="font-size:16px;font-weight:600;margin-bottom:3px;">About your business</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:18px;">This appears on your public GUESTLIST profile</div>'
      + '<div class="form-group"><label class="form-label">Business name</label><input class="form-input" placeholder="e.g. Bloom & Thread Decor" id="su-biz"/></div>'
      + '<div class="two-col"><div class="form-group"><label class="form-label">City</label><input class="form-input" placeholder="Frisco" id="su-city"/></div><div class="form-group"><label class="form-label">ZIP</label><input class="form-input" placeholder="75034" id="su-zip"/></div></div>'
      + '<div class="form-group"><label class="form-label">Years in business</label><select class="form-input"><option>10+ years</option><option>5-10 years</option><option>1-5 years</option><option>Less than 1 year</option></select></div>'
      + '<div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" rows="3" placeholder="Tell customers what makes your business special..."></textarea></div>'
      + '<div class="form-group"><label class="form-label">Instagram (optional)</label><input class="form-input" placeholder="instagram.com/yourbusiness"/></div>'
      + '<div style="display:flex;gap:8px;margin-top:8px;"><button class="btn" onclick="renderSignup(1)">← Back</button><button class="btn btn-primary" style="flex:1;" onclick="renderSignup(3)">Continue →</button></div>',

    3: stepBarHTML
      + '<div style="font-size:16px;font-weight:600;margin-bottom:3px;">Category & verification</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Select what you offer and upload your documents</div>'
      + '<div class="form-label" style="margin-bottom:8px;">What do you provide?</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px;">'+catGrid+'</div>'
      + '<div class="form-label" style="margin-bottom:8px;">Service area in DFW</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;">'+areaPills+'</div>'
      + '<div class="two-col" style="margin-bottom:18px;">'
      +   '<div><div class="form-label" style="margin-bottom:6px;"><i class="ti ti-file-certificate" style="font-size:13px;vertical-align:-2px;margin-right:3px"></i>Business license</div><div class="upload-box" onclick="toast(\'File upload ready in full build\')"><i class="ti ti-upload"></i>Upload PDF or image</div></div>'
      +   '<div><div class="form-label" style="margin-bottom:6px;"><i class="ti ti-shield-check" style="font-size:13px;vertical-align:-2px;margin-right:3px"></i>Liability insurance</div><div class="upload-box upload-done"><i class="ti ti-check"></i>certificate_2025.pdf</div></div>'
      + '</div>'
      + '<div style="display:flex;gap:8px;"><button class="btn" onclick="renderSignup(2)">← Back</button><button class="btn btn-primary" style="flex:1;" onclick="renderSignup(4)">Submit for review →</button></div>',

    4: stepBarHTML
      + '<div style="text-align:center;padding:10px 0;">'
      + '<div class="success-ring"><i class="ti ti-check" style="font-size:26px;color:white;"></i></div>'
      + '<div style="font-size:18px;font-weight:600;margin-bottom:6px;">You\'re on the list.</div>'
      + '<div style="font-size:13px;color:var(--text-muted);max-width:300px;margin:0 auto 20px;">Your profile is under review. We verify all vendors within 24 hours. Check your email for next steps.</div>'
      + '<div style="margin-bottom:20px;"><span class="pill pill-gray" style="margin:3px;">Vendor account</span><span class="pill pill-gold" style="margin:3px;">Pending verification</span></div>'
      + '<div style="background:var(--bg-surface);border-radius:var(--r);padding:16px;text-align:left;margin-bottom:20px;"><div style="font-size:12px;font-weight:600;margin-bottom:10px;">What happens next</div>'+nextSteps+'</div>'
      + '<button class="btn btn-primary" style="width:100%;" onclick="navigate(\'vendor-dashboard\')">Go to dashboard →</button>'
      + '</div>',
  };

  const target = document.getElementById('vsignup-content');
  if(target) target.innerHTML = steps[step] || '';
}
