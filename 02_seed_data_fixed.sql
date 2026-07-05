-- ================================================================
-- GUESTLIST DFW -- Seed Data v2 (Fixed UUIDs)
-- Run AFTER 01_schema.sql succeeds
-- UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
-- ================================================================

-- Customers:  a0000001..5-0000-0000-0000-000000000001..5
-- Vendors:    b0000001..10-0000-0000-0000-000000000001..10
-- Events:     c0000001..6-0000-0000-0000-000000000001..6
-- Bids:       d0000001..16-0000-0000-0000-000000000001..16

-- ----------------------------------------------------------------
-- STEP 1: Auth users (all passwords: Password123!)
-- ----------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
) values
('a0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','sara.alrashid@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Sara Al-Rashid","role":"customer"}'::jsonb,now(),now(),'','','',''),
('a0000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nadia.rahman@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Nadia Rahman","role":"customer"}'::jsonb,now(),now(),'','','',''),
('a0000003-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','maria.gonzalez@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Maria Gonzalez","role":"customer"}'::jsonb,now(),now(),'','','',''),
('a0000004-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','james.okonkwo@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"James Okonkwo","role":"customer"}'::jsonb,now(),now(),'','','',''),
('a0000005-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','priya.krishna@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Priya Krishna","role":"customer"}'::jsonb,now(),now(),'','','',''),
('b0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','info@royalfeastsdfw.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Mohammed Al-Farsi","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','hello@bloomandthread.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Sara Malik","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000003-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','starrentalsdfw@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Mohammed Khalid","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000004-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','groovesounddfw@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"DeShawn Williams","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000005-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','sweetlayersdfw@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Priya Sharma","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000006-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','snapmomentsstudio@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Ravi Patel","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000007-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','metrolightingdfw@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Carlos Rivera","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000008-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','spicegardencatering@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Fatima Hussain","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000009-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','dallastableco@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Robert Chen","role":"vendor"}'::jsonb,now(),now(),'','','',''),
('b0000010-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','prestige.events.catering@gmail.com',crypt('Password123!',gen_salt('bf')),now(),'{"full_name":"Aisha Johnson","role":"vendor"}'::jsonb,now(),now(),'','','','');

-- ----------------------------------------------------------------
-- STEP 2: Update phone numbers (profiles auto-created by trigger)
-- ----------------------------------------------------------------
update public.profiles set phone='(214) 555-0101' where id='a0000001-0000-0000-0000-000000000001';
update public.profiles set phone='(972) 555-0202' where id='a0000002-0000-0000-0000-000000000002';
update public.profiles set phone='(214) 555-0303' where id='a0000003-0000-0000-0000-000000000003';
update public.profiles set phone='(469) 555-0404' where id='a0000004-0000-0000-0000-000000000004';
update public.profiles set phone='(972) 555-0505' where id='a0000005-0000-0000-0000-000000000005';

-- ----------------------------------------------------------------
-- STEP 3: Vendor profiles
-- ----------------------------------------------------------------
insert into public.vendors (id,business_name,category,city,zip,bio,instagram,years_in_business,status,service_areas) values
('b0000001-0000-0000-0000-000000000001','Royal Feasts Catering','catering','Plano','75024','DFW premier South Asian and Middle Eastern halal caterer. Our team of 15 chefs has catered events from 50 to 1,200 guests. Specialties include biryani, kabob stations, fresh naan, and custom dessert tables. Full-service setup, serving staff, and cleanup included.','instagram.com/royalfeastsdfw','12 years','verified',array['Plano','Frisco','Allen','McKinney','Richardson','Dallas','Addison']),
('b0000002-0000-0000-0000-000000000002','Bloom & Thread Decor','decor','Frisco','75034','Specializing in South Asian, multicultural and contemporary event decor across DFW. From mandap and stage design to full venue transformations with fresh florals and fabric draping. Over 400 events in 12 years.','instagram.com/bloomandthreaddfw','12 years','verified',array['Frisco','Plano','Allen','McKinney','Dallas','Irving','Grapevine']),
('b0000003-0000-0000-0000-000000000003','Star Rentals DFW','chairs','Frisco','75035','DFW most trusted chair and table rental company. Chiavari chairs, farm tables, round banquet tables, cocktail tables, and throne chairs. Delivery, setup, and teardown included.','instagram.com/starrentalsdfw','11 years','verified',array['Frisco','Plano','Allen','McKinney','Dallas','Garland','Irving','Richardson']),
('b0000004-0000-0000-0000-000000000004','Groove Sound DFW','sound','Dallas','75201','Professional audio, DJ services and AV production for corporate events, weddings, and private parties across DFW. Full PA systems, wireless microphone arrays, DJ booths, and live sound mixing.','instagram.com/groovesounddfw','8 years','verified',array['Dallas','Irving','Addison','Plano','Frisco','Fort Worth']),
('b0000005-0000-0000-0000-000000000005','Sweet Layers DFW','cake','Irving','75038','Custom cake and dessert studio creating edible art for weddings, birthdays, quinceañeras, baby showers and corporate events across DFW. All cakes made from scratch with real butter and seasonal ingredients.','instagram.com/sweetlayersdfw','7 years','verified',array['Irving','Dallas','Plano','Frisco','Grand Prairie','Arlington']),
('b0000006-0000-0000-0000-000000000006','SnapMoments Studio','photo','Richardson','75080','Wedding and event photography and videography studio serving DFW for 9 years. Team of 6 photographers and 3 videographers. Specializes in South Asian weddings, quinceañeras, and corporate events.','instagram.com/snapmomentsstudio','9 years','verified',array['Richardson','Plano','Dallas','Allen','Frisco','McKinney','Garland']),
('b0000007-0000-0000-0000-000000000007','Metro Lighting Co.','lighting','Dallas','75207','Professional event lighting design and installation. LED wash lighting, pin spot arrangements, gobo projections, canopy lighting, and string light installations for venues across DFW.','instagram.com/metrolightingdfw','6 years','verified',array['Dallas','Irving','Plano','Frisco','Addison','Carrollton']),
('b0000008-0000-0000-0000-000000000008','Spice Garden Catering','catering','Garland','75040','Home-style South Asian catering with a community feel. Pakistani and Indian cuisine for graduations, Eid gatherings, birthday parties and intimate events. Everything cooked fresh the day of your event.','instagram.com/spicegardendfw','6 years','verified',array['Garland','Richardson','Plano','Dallas','Mesquite']),
('b0000009-0000-0000-0000-000000000009','Dallas Table Co.','chairs','Carrollton','75006','Premium table and chair rentals at competitive prices. Chiavari chairs, farm tables, serpentine tables, cocktail tables, and full linen packages. Minimum order 50 chairs.','instagram.com/dallastableco','5 years','verified',array['Carrollton','Plano','Dallas','Irving','Addison','Farmers Branch']),
('b0000010-0000-0000-0000-000000000010','Prestige Events Catering','catering','Dallas','75225','Upscale catering for corporate galas, fundraisers, and premium social events. Executive chef team specializes in plated dinners, chef stations, and cocktail receptions for 100 to 1,000+ guests.','instagram.com/prestigeeventsdfw','9 years','verified',array['Dallas','Addison','Plano','Frisco','Southlake','Grapevine']);

-- ----------------------------------------------------------------
-- STEP 4: Events
-- ----------------------------------------------------------------
insert into public.events (id,customer_id,name,event_type,event_date,location,city,budget_min,budget_max,needs,description,guest_count,status,bid_count) values
('c0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','Ahmed & Sara Wedding Reception','wedding','2025-08-12','Grand Ballroom, The Westin Stonebriar','Frisco',8000,12000,array['catering','chairs','decor','photo','sound'],'Traditional South Asian wedding reception for 300 guests at The Westin Stonebriar in Frisco. Full halal catering, mandap and stage decoration, Chiavari chairs, wedding photography and videography, and professional sound system. Event runs 6pm to midnight.',300,'open',0),
('c0000002-0000-0000-0000-000000000002','a0000002-0000-0000-0000-000000000002','Nadia Nikah Ceremony','nikah','2025-09-05','Al-Hedaya Islamic Center','Plano',3000,5000,array['catering','decor','photo'],'Intimate nikah ceremony followed by walima reception for 150 guests at our local masjid in Plano. White and gold theme. Halal catering and photography for both ceremony and reception.',150,'open',0),
('c0000003-0000-0000-0000-000000000003','a0000003-0000-0000-0000-000000000003','Isabella Quinceanera','quinceanera','2025-08-23','Cielo Event Center','Garland',6000,9000,array['catering','chairs','decor','photo','sound','lighting','cake'],'Quinceañera celebration for 200 guests at Cielo Event Center in Garland. Pink and gold color theme. Full catering, custom 4-tier cake, photography, DJ and sound, and accent lighting.',200,'open',0),
('c0000004-0000-0000-0000-000000000004','a0000004-0000-0000-0000-000000000004','TechForward DFW Annual Gala','corporate','2025-10-15','Omni Dallas Hotel Grand Ballroom','Dallas',15000,22000,array['catering','chairs','decor','photo','sound','lighting'],'Annual corporate gala for TechForward DFW for 450 guests at the Omni Dallas Hotel. Upscale plated dinner, full bar, elegant florals, AV for presentations, professional photography, and full LED uplighting.',450,'open',0),
('c0000005-0000-0000-0000-000000000005','a0000005-0000-0000-0000-000000000005','Fatima Graduation Brunch','graduation','2025-07-05','Private residence','Irving',1200,2000,array['catering','decor','cake'],'Graduation brunch for a master degree completion. Approximately 80 guests at home in Irving. Mix of desi and American brunch food, simple festive decor, and a custom graduation cake.',80,'complete',0),
('c0000006-0000-0000-0000-000000000006','a0000001-0000-0000-0000-000000000001','Ahmed and Sara Engagement Party','engagement','2025-06-14','Marriott Legacy Town Center','Plano',2500,4000,array['catering','decor','photo'],'Engagement celebration for 120 guests at the Marriott in Plano. Mediterranean and Middle Eastern catering, simple decor with flowers and lighting, and a photographer for 4 hours.',120,'complete',0);

-- ----------------------------------------------------------------
-- STEP 5: Bids
-- ----------------------------------------------------------------
insert into public.bids (id,event_id,vendor_id,price,note,includes,status) values
('d0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001',4200,'Assalamu Alaikum Sara! Royal Feasts has catered over 50 South Asian weddings at The Westin Stonebriar. Our package for 300 guests includes a full biryani station, live kabob grill, fresh naan station, appetizer platters, and a custom dessert table. 100% halal certified. Price includes setup, serving staff, and full cleanup.','Biryani station, live kabob grill, naan station, appetizers, dessert table, 8 servers, cleanup','pending'),
('d0000002-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000002',3800,'Hi Sara! We have designed over 80 South Asian wedding receptions in DFW including several at The Westin Stonebriar. Price includes full mandap structure with floral panels, stage backdrop, 30 fresh floral centerpieces, and a sweetheart table arrangement.','Full mandap, fresh floral panels, stage backdrop, 30 table centerpieces, sweetheart table','pending'),
('d0000003-0000-0000-0000-000000000003','c0000001-0000-0000-0000-000000000001','b0000003-0000-0000-0000-000000000003',2100,'Hi! Star Rentals has the perfect inventory for your 30-table reception. Price includes 300 gold Chiavari chairs, 30 round tables with ivory linens, delivery to The Westin by 2pm, full setup, and teardown after midnight.','300 gold Chiavari chairs, 30 round tables, ivory linens, delivery + setup + teardown','pending'),
('d0000004-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000001','b0000006-0000-0000-0000-000000000006',3200,'Congratulations on your upcoming wedding! SnapMoments has photographed over 60 South Asian weddings in DFW. Package includes two photographers plus one videographer, same-week preview gallery of 50 images, full edited gallery within 4 weeks, and a 5-minute cinematic highlight film.','2 photographers + 1 videographer, full reception coverage, same-week preview, 4K highlight film','pending'),
('d0000005-0000-0000-0000-000000000005','c0000001-0000-0000-0000-000000000001','b0000004-0000-0000-0000-000000000004',1400,'Groove Sound can handle your reception audio perfectly. Package includes full PA system for 300 guests, wireless mics for MC and speeches, dedicated music systems for dinner and dancing, and on-site sound engineer for the full evening.','Full PA system, wireless mics, music system, on-site sound engineer 6pm-midnight','pending'),
('d0000006-0000-0000-0000-000000000006','c0000002-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000001',2800,'Assalamu Alaikum Nadia! We have catered many walimas in the Plano area. Package for 150 guests includes walima buffet with biryani, seekh kabobs, salads, and a dessert table. Full halal.','Walima buffet for 150, biryani + kabobs + sides + desserts, setup/cleanup','pending'),
('d0000007-0000-0000-0000-000000000007','c0000002-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000002',1800,'Salaam Nadia! White and gold is our specialty. For your nikah stage: fresh floral backdrop with white roses, ivory draping, and gold accents. Includes stage arrangement, signing table florals, and aisle petals.','Nikah stage backdrop, signing table florals, aisle petals','pending'),
('d0000008-0000-0000-0000-000000000008','c0000003-0000-0000-0000-000000000003','b0000005-0000-0000-0000-000000000005',1400,'Hola Maria! Sweet Layers loves quinceañera cakes. For Isabella we can create a 4-tier cake in blush pink with gold hand-painted florals, her name in gold lettering, and a tiara topper. Tasting session included.','4-tier custom quinceañera cake, tasting session, delivery + setup','pending'),
('d0000009-0000-0000-0000-000000000009','c0000003-0000-0000-0000-000000000003','b0000003-0000-0000-0000-000000000003',1900,'Hi Maria! Star Rentals has done many quinceañeras at Cielo. We can provide 200 blush Chiavari chairs, 20 round tables, and a throne chair for Isabella. All with blush and gold linens.','200 blush Chiavari chairs, 20 round tables, throne chair, blush + gold linens','pending'),
('d0000010-0000-0000-0000-000000000010','c0000003-0000-0000-0000-000000000003','b0000007-0000-0000-0000-000000000007',900,'Buenos dias! Metro Lighting package for Cielo: blush uplighting on all walls, pin spots on each centerpiece, sparkle gobo on the dance floor, and a custom name gobo projection.','Blush wall uplighting, pin spots, dance floor gobo, custom name projection','pending'),
('d0000011-0000-0000-0000-000000000011','c0000004-0000-0000-0000-000000000004','b0000010-0000-0000-0000-000000000010',9500,'Good morning James! Prestige Events has catered the Omni Dallas Grand Ballroom over 30 times. Proposal includes 3-course plated dinner for 450, cocktail hour with passed appetizers, full bar service, professional wait staff, and full setup/breakdown.','3-course plated dinner, cocktail hour + open bar, 1:45 server ratio, full setup + breakdown','pending'),
('d0000012-0000-0000-0000-000000000012','c0000004-0000-0000-0000-000000000004','b0000004-0000-0000-0000-000000000004',3800,'Hello James! Groove Sound for your gala: full line array PA for 450 guests, 8-channel wireless mic package, dual projection screens with laser projectors, DJ system for dinner music and dancing, and dedicated AV engineer for the full event.','Line array PA, 8-channel wireless mics, dual projection screens, DJ system, AV engineer','pending'),
('d0000013-0000-0000-0000-000000000013','c0000005-0000-0000-0000-000000000005','b0000008-0000-0000-0000-000000000008',980,'Assalamu Alaikum! Spice Garden for Fatima graduation brunch. For 80 guests: desi and American brunch spread with chaat station, chai bar, full setup and cleanup.','Desi-American brunch, chaat station, chai bar, setup + cleanup for 80 guests','awarded'),
('d0000014-0000-0000-0000-000000000014','c0000005-0000-0000-0000-000000000005','b0000005-0000-0000-0000-000000000005',320,'Congratulations to Fatima! A 3-tier fondant cake in her school colors with a graduation cap topper and her name in gold lettering. Delivery to Irving included.','3-tier graduation fondant cake, gold lettering, delivery to Irving','awarded'),
('d0000015-0000-0000-0000-000000000015','c0000006-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000001',2400,'Congratulations on your engagement Sara! Mediterranean and Middle Eastern spread for 120 guests: hummus stations, shawarma platter, fattoush salad, and baklava display. Fully halal.','Mediterranean + Middle Eastern buffet for 120, full setup + cleanup, halal','awarded'),
('d0000016-0000-0000-0000-000000000016','c0000006-0000-0000-0000-000000000006','b0000002-0000-0000-0000-000000000002',1400,'Sara! Simple but elegant florals for the Marriott ballroom. Flower arch, 12 fresh centerpieces for guest tables, and a head table arrangement.','Flower arch, 12 table centerpieces, head table arrangement, delivery + setup','awarded');

-- ----------------------------------------------------------------
-- STEP 6: Mark completed events and refresh bid counts
-- ----------------------------------------------------------------
update public.events set status='complete' where id in (
  'c0000005-0000-0000-0000-000000000005',
  'c0000006-0000-0000-0000-000000000006'
);
update public.events e set bid_count=(
  select count(*) from public.bids b where b.event_id=e.id
);

-- ----------------------------------------------------------------
-- STEP 7: Reviews
-- ----------------------------------------------------------------
insert into public.reviews (vendor_id,customer_id,bid_id,stars,body,event_type,tags) values
('b0000008-0000-0000-0000-000000000008','a0000005-0000-0000-0000-000000000005','d0000013-0000-0000-0000-000000000013',5,'Fatima Hussain and her team from Spice Garden were absolutely wonderful. The food was fresh, generous, and exactly what we asked for. The chaat station was a huge hit and guests kept going back. They left the backyard spotless. Highly recommend for any desi home event in Irving.','Graduation brunch',array['fresh food','generous portions','professional','highly recommended']),
('b0000005-0000-0000-0000-000000000005','a0000005-0000-0000-0000-000000000005','d0000014-0000-0000-0000-000000000014',5,'The graduation cake from Sweet Layers was a masterpiece. Priya was so patient with all my questions. The cake tasted as incredible as it looked and all guests wanted to know who made it. Will use Sweet Layers for every future celebration.','Graduation brunch',array['beautiful design','delicious','responsive','worth every penny']),
('b0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','d0000015-0000-0000-0000-000000000015',5,'Royal Feasts made our engagement party unforgettable. Mohammed and his team were professional from first contact to cleanup. The food was outstanding and guests were raving all night. Cannot wait to book them again for the wedding.','Engagement party',array['professional','outstanding food','halal','accommodating','highly recommended']),
('b0000002-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000001','d0000016-0000-0000-0000-000000000016',5,'Sara Malik from Bloom and Thread transformed our venue. The flower arch was even more stunning than the inspiration photos. She took time to understand exactly what we wanted and delivered beyond expectations. Already booked them for our August wedding.','Engagement party',array['stunning work','fresh florals','exceeded expectations','highly professional']);

-- ----------------------------------------------------------------
-- STEP 8: Messages
-- ----------------------------------------------------------------
insert into public.messages (event_id,sender_id,recipient_id,body,read) values
('c0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001','Assalamu Alaikum! Thank you for your bid. Can you confirm whether your 300-person package includes a dedicated serving team throughout the evening, not just for setup?',true),
('c0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','Wa Alaikum Assalam Sara! Yes, absolutely. Our 300-guest package includes 8 dedicated servers throughout the entire reception plus 2 managers on site the whole evening. We do not leave until full cleanup is done.',true),
('c0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001','Perfect, that is exactly what we needed to know. Do you have a tasting session available? My mother and mother-in-law would love to come.',false),
('c0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000002','Hi Sara! I saw your portfolio on Instagram and I am obsessed with your work. Are you available for August 12th? Can we schedule a consultation to go over our vision board?',true),
('c0000001-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000001','Absolutely! August 12th is available and we would love to meet. Let us set up a call this week — I can do Tuesday or Thursday evening. I already have some ideas brewing from your brief!',false);

-- ----------------------------------------------------------------
-- STEP 9: Notifications
-- ----------------------------------------------------------------
insert into public.notifications (user_id,type,title,body,link,read) values
('a0000001-0000-0000-0000-000000000001','new_bid','New bid on Ahmed & Sara Wedding','Royal Feasts Catering submitted a bid of $4,200 for catering.','/events/c0000001-0000-0000-0000-000000000001/bids',true),
('a0000001-0000-0000-0000-000000000001','new_bid','New bid on Ahmed & Sara Wedding','Bloom & Thread Decor submitted a bid of $3,800 for decor.','/events/c0000001-0000-0000-0000-000000000001/bids',true),
('a0000001-0000-0000-0000-000000000001','new_message','New message from Bloom & Thread','Sara Malik responded about the August 12th consultation.','/messages',false),
('b0000001-0000-0000-0000-000000000001','new_message','New message from Sara Al-Rashid','Sara asked about a tasting session for the wedding.','/messages',false);

-- ----------------------------------------------------------------
-- VERIFY: Should show 15/10/6/16/4/5/4 rows
-- ----------------------------------------------------------------
select 'profiles' as tbl, count(*) as rows from public.profiles union all
select 'vendors',          count(*) from public.vendors          union all
select 'events',           count(*) from public.events           union all
select 'bids',             count(*) from public.bids             union all
select 'reviews',          count(*) from public.reviews          union all
select 'messages',         count(*) from public.messages         union all
select 'notifications',    count(*) from public.notifications
order by tbl;
