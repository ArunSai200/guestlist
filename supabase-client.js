/* ================================================================
   GUESTLIST DFW - supabase-client.js
   Your real Supabase credentials are already filled in below.
   Load this BEFORE shared.js in both vendor.html and customer.html.
================================================================ */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://vsqxzibugskbjeujvnfa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcXh6aWJ1Z3NrYmpldWp2bmZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjY1OTUsImV4cCI6MjA5ODUwMjU5NX0.AlW3LnX04tFSRLBnXXt-uxYdNonAS2EWfWE61nG2p2c';

export const db = createClient(SUPABASE_URL, SUPABASE_ANON);
window._sb = db; // accessible from shared.js and app files

/* ── AUTH ──────────────────────────────────────────────────── */
export async function signUpCustomer({ fullName, email, phone, password }) {
  const { data, error } = await db.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, role: 'customer' } },
  });
  if (error) throw error;
  if (phone) await db.from('profiles').update({ phone }).eq('id', data.user.id);
  return data.user;
}

export async function signUpVendor({ fullName, email, phone, password,
  businessName, category, city, zip, bio, instagram, yearsInBusiness, serviceAreas }) {
  const { data, error } = await db.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, role: 'vendor' } },
  });
  if (error) throw error;
  const uid = data.user.id;
  if (phone) await db.from('profiles').update({ phone }).eq('id', uid);
  const { error: ve } = await db.from('vendors').insert({
    id: uid, business_name: businessName, category, city, zip, bio,
    instagram, years_in_business: yearsInBusiness,
    service_areas: serviceAreas || [], status: 'pending',
  });
  if (ve) throw ve;
  return data.user;
}

export async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() { await db.auth.signOut(); }

export async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

export async function getCurrentProfile() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db.from('profiles').select('*').eq('id', user.id).single();
  return data;
}

/* ── EVENTS ─────────────────────────────────────────────────── */
export async function getOpenEvents({ category } = {}) {
  let q = db.from('events')
    .select('*, customer:profiles!customer_id(full_name, avatar_url)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (category) q = q.contains('needs', [category]);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function getCustomerEvents(customerId) {
  const { data, error } = await db.from('events')
    .select('*').eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getEventById(eventId) {
  const { data, error } = await db.from('events')
    .select('*, customer:profiles!customer_id(full_name, phone, avatar_url)')
    .eq('id', eventId).single();
  if (error) throw error;
  return data;
}

export async function postEvent({ customerId, name, eventType, eventDate,
  location, city, budgetMin, budgetMax, needs, description, guestCount }) {
  const { data, error } = await db.from('events').insert({
    customer_id: customerId, name, event_type: eventType,
    event_date: eventDate || null, location, city,
    budget_min: budgetMin ? parseInt(budgetMin) : null,
    budget_max: budgetMax ? parseInt(budgetMax) : null,
    needs: needs || [], description,
    guest_count: guestCount ? parseInt(guestCount) : null,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateEventStatus(eventId, status) {
  const { error } = await db.from('events').update({ status }).eq('id', eventId);
  if (error) throw error;
}

/* ── BIDS ───────────────────────────────────────────────────── */
export async function getBidsForEvent(eventId) {
  const { data, error } = await db.from('bids')
    .select(`*, vendor:vendors!vendor_id(
      business_name, category, rating, review_count,
      profile:profiles!id(full_name, avatar_url))`)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getVendorBids(vendorId) {
  const { data, error } = await db.from('bids')
    .select('*, event:events!event_id(name, event_date, city, budget_min, budget_max, status)')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function placeBid({ eventId, vendorId, price, note, includes }) {
  const { data, error } = await db.from('bids').insert({
    event_id: eventId, vendor_id: vendorId,
    price: parseInt(price), note, includes, status: 'pending',
  }).select().single();
  if (error) throw error;
  return data;
}

export async function awardBid(bidId, eventId) {
  const { error: be } = await db.from('bids')
    .update({ status: 'awarded', awarded_at: new Date().toISOString() })
    .eq('id', bidId);
  if (be) throw be;
  const { error: ee } = await db.from('events')
    .update({ status: 'awarded' }).eq('id', eventId);
  if (ee) throw ee;
}

/* ── VENDORS ────────────────────────────────────────────────── */
export async function getVerifiedVendors({ category } = {}) {
  let q = db.from('vendors')
    .select('*, profile:profiles!id(full_name, avatar_url)')
    .eq('status', 'verified')
    .order('rating', { ascending: false });
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function getVendorProfile(vendorId) {
  const { data, error } = await db.from('vendors')
    .select(`*, profile:profiles!id(full_name, avatar_url, phone),
      reviews(stars, body, event_type, tags, created_at,
        customer:profiles!customer_id(full_name))`)
    .eq('id', vendorId).single();
  if (error) throw error;
  return data;
}

export async function updateVendorProfile(vendorId, updates) {
  const { error } = await db.from('vendors').update(updates).eq('id', vendorId);
  if (error) throw error;
}

/* ── DOCUMENT UPLOADS ──────────────────────────────────────── */
export async function uploadVendorDoc(vendorId, docType, file) {
  const ext = file.name.split('.').pop();
  const path = `${vendorId}/${docType}/${Date.now()}.${ext}`;
  const { error: upErr } = await db.storage
    .from('vendor-docs').upload(path, file, { upsert: true });
  if (upErr) throw upErr;
  const { error: dbErr } = await db.from('vendor_documents').insert({
    vendor_id: vendorId, doc_type: docType, file_name: file.name, storage_path: path,
  });
  if (dbErr) throw dbErr;
  return path;
}

export async function getVendorDocs(vendorId) {
  const { data, error } = await db.from('vendor_documents')
    .select('*').eq('vendor_id', vendorId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data;
}

/* ── REVIEWS ────────────────────────────────────────────────── */
export async function getVendorReviews(vendorId) {
  const { data, error } = await db.from('reviews')
    .select('*, customer:profiles!customer_id(full_name, avatar_url)')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllReviews({ category, minStars, search } = {}) {
  let q = db.from('reviews')
    .select(`*, vendor:vendors!vendor_id(business_name, category),
      customer:profiles!customer_id(full_name)`)
    .order('created_at', { ascending: false });
  if (minStars) q = q.gte('stars', minStars);
  if (search)   q = q.ilike('body', `%${search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function submitReview({ vendorId, customerId, bidId, stars, body, eventType, tags }) {
  const { data, error } = await db.from('reviews').insert({
    vendor_id: vendorId, customer_id: customerId, bid_id: bidId || null,
    stars: parseInt(stars), body, event_type: eventType || null, tags: tags || [],
  }).select().single();
  if (error) throw error;
  return data;
}

/* ── MESSAGES ───────────────────────────────────────────────── */
export async function getMessageThreads(userId) {
  const { data, error } = await db.from('messages')
    .select(`id, body, created_at, read,
      event:events!event_id(id, name),
      sender:profiles!sender_id(id, full_name, avatar_url),
      recipient:profiles!recipient_id(id, full_name, avatar_url)`)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const threads = {};
  (data || []).forEach(m => {
    const otherId = m.sender.id === userId ? m.recipient.id : m.sender.id;
    const key = `${m.event.id}_${otherId}`;
    if (!threads[key]) threads[key] = {
      eventId: m.event.id, eventName: m.event.name,
      other: m.sender.id === userId ? m.recipient : m.sender,
      messages: [], unread: 0,
    };
    threads[key].messages.push(m);
    if (!m.read && m.recipient.id === userId) threads[key].unread++;
  });
  return Object.values(threads);
}

export async function getThreadMessages(eventId, otherUserId, currentUserId) {
  const { data, error } = await db.from('messages')
    .select('*, sender:profiles!sender_id(full_name, avatar_url)')
    .eq('event_id', eventId)
    .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),` +
        `and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  await db.from('messages').update({ read: true })
    .eq('event_id', eventId).eq('recipient_id', currentUserId);
  return data;
}

export async function sendMessage({ eventId, senderId, recipientId, body }) {
  const { data, error } = await db.from('messages').insert({
    event_id: eventId, sender_id: senderId,
    recipient_id: recipientId, body, read: false,
  }).select().single();
  if (error) throw error;
  return data;
}

export function subscribeToMessages(eventId, callback) {
  return db.channel(`messages:${eventId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `event_id=eq.${eventId}`,
    }, payload => callback(payload.new))
    .subscribe();
}

/* ── NOTIFICATIONS ──────────────────────────────────────────── */
export async function getNotifications(userId) {
  const { data, error } = await db.from('notifications')
    .select('*').eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(30);
  if (error) throw error;
  return data;
}

export async function markNotificationsRead(userId) {
  await db.from('notifications').update({ read: true })
    .eq('user_id', userId).eq('read', false);
}

/* ── AVATAR UPLOAD ──────────────────────────────────────────── */
export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `${userId}.${ext}`;
  const { error } = await db.storage.from('avatars')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = db.storage.from('avatars').getPublicUrl(path);
  await db.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId);
  return data.publicUrl;
}
