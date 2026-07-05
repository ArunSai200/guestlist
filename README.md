# GUESTLIST DFW

DFW's hyperlocal event vendor marketplace.
Customers post events, vendors bid, customers award the best.

## Your folder — 9 files, that's it

```
guestlist/
├── vendor.html          ← vendor app (open this in browser)
├── customer.html        ← customer app (open this in browser)
├── shared.css           ← design system used by both
├── shared.js            ← router, modals, toast, nav, sample data
├── vendor-app.js        ← vendor-only page renderers
├── customer-app.js      ← customer-only page renderers
├── supabase-client.js   ← Supabase connection (credentials already filled in)
├── 01_schema.sql        ← run in Supabase SQL Editor FIRST
├── 02_seed_data_fixed.sql  ← run in Supabase SQL Editor SECOND
└── README.md
```

## Supabase is already connected

Your credentials are filled into supabase-client.js:
- Project URL: https://vsqxzibugskbjeujvnfa.supabase.co
- Database already has: 10 vendors, 5 customers, 6 events, 16 bids, 4 reviews

If the database is empty, run the two SQL files in Supabase SQL Editor
(supabase.com → your project → SQL Editor → New query → paste → Run).

## Test login credentials (all passwords: Password123!)

Customers:
  sara.alrashid@gmail.com
  nadia.rahman@gmail.com
  maria.gonzalez@gmail.com
  james.okonkwo@gmail.com
  priya.krishna@gmail.com

Vendors:
  info@royalfeastsdfw.com      (Royal Feasts Catering)
  hello@bloomandthread.com     (Bloom & Thread Decor)
  starrentalsdfw@gmail.com     (Star Rentals DFW)
  groovesounddfw@gmail.com     (Groove Sound DFW)
  sweetlayersdfw@gmail.com     (Sweet Layers DFW)
  snapmomentsstudio@gmail.com  (SnapMoments Studio)
  metrolightingdfw@gmail.com   (Metro Lighting Co.)
  spicegardencatering@gmail.com (Spice Garden Catering)
  dallastableco@gmail.com      (Dallas Table Co.)
  prestige.events.catering@gmail.com (Prestige Events Catering)

## Run locally

Install the Live Server extension in VS Code.
Right-click vendor.html → Open with Live Server.
Right-click customer.html → Open with Live Server.
Two browser tabs = two separate apps, same real database.

## Deploy to GitHub (one-time setup)

1. Go to github.com/new
2. Name the repo: guestlist
3. Public, no README, click Create repository
4. In VS Code terminal:
   git init
   git add .
   git commit -m "GUESTLIST - initial commit"
   git branch -M main
   git remote add origin https://github.com/ArunSai200/guestlist.git
   git push -u origin main
   (use your GitHub Personal Access Token as the password)

5. Enable GitHub Pages:
   GitHub repo → Settings → Pages → main branch → Save
   Live at: https://ArunSai200.github.io/guestlist/vendor.html

## IMPORTANT - delete these Firebase leftover files from your folder

If these exist in your guestlist folder, delete them before pushing:
  404.html
  firestore.rules
  firestore.indexes.json
  index.html  (the Firebase-generated one, not your app)
