-- ================================================================
-- GUESTLIST DFW -- Complete PostgreSQL Schema
-- Run this entire file in: Supabase > SQL Editor > New query
-- ================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------
create type user_role as enum ('customer', 'vendor', 'admin');
create type event_status as enum ('open', 'awarded', 'complete', 'cancelled');
create type bid_status as enum ('pending', 'awarded', 'rejected', 'withdrawn');
create type payment_status as enum ('pending', 'held', 'released', 'refunded');
create type vendor_status as enum ('pending', 'verified', 'suspended');
create type notification_type as enum (
  'new_bid', 'bid_awarded', 'new_message',
  'event_posted', 'review_requested', 'payment_released'
);

-- ----------------------------------------------------------------
-- PROFILES (extends Supabase auth.users)
-- ----------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          user_role not null default 'customer',
  full_name     text not null,
  email         text not null,
  phone         text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.profiles is 'One row per auth user. role determines which side of the app they see.';

-- ----------------------------------------------------------------
-- VENDORS (extends profiles for role=vendor)
-- ----------------------------------------------------------------
create table public.vendors (
  id                uuid primary key references public.profiles(id) on delete cascade,
  business_name     text not null,
  category          text not null,
  city              text not null,
  zip               text,
  bio               text,
  instagram         text,
  years_in_business text,
  status            vendor_status not null default 'pending',
  rating            numeric(3,2) not null default 0,
  review_count      int not null default 0,
  service_areas     text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
comment on table public.vendors is 'Vendor business profile. Only exists for users with role=vendor.';

-- ----------------------------------------------------------------
-- VENDOR DOCUMENTS (license, insurance uploads)
-- ----------------------------------------------------------------
create table public.vendor_documents (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors(id) on delete cascade,
  doc_type    text not null check (doc_type in ('license', 'insurance', 'other')),
  file_name   text not null,
  storage_path text not null,
  verified    boolean not null default false,
  uploaded_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- EVENTS (posted by customers)
-- ----------------------------------------------------------------
create table public.events (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  event_type    text not null default 'other',
  event_date    date,
  location      text,
  city          text,
  budget_min    int,
  budget_max    int,
  needs         text[] not null default '{}',
  description   text,
  guest_count   int,
  status        event_status not null default 'open',
  bid_count     int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.events is 'An event posted by a customer seeking vendor bids.';

-- Full text search index on event name + description
create index events_search_idx on public.events
  using gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')));

-- Index for vendor opportunity queries (open events, ordered by recency)
create index events_status_created_idx on public.events(status, created_at desc);

-- ----------------------------------------------------------------
-- BIDS (placed by vendors on events)
-- ----------------------------------------------------------------
create table public.bids (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events(id) on delete cascade,
  vendor_id   uuid not null references public.vendors(id) on delete cascade,
  price       int not null,
  note        text,
  includes    text,
  status      bid_status not null default 'pending',
  awarded_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(event_id, vendor_id)
);
comment on table public.bids is 'A vendor bid on a specific event. One bid per vendor per event.';

create index bids_event_idx on public.bids(event_id, status);
create index bids_vendor_idx on public.bids(vendor_id, status);

-- ----------------------------------------------------------------
-- REVIEWS (left by customers after event completion)
-- ----------------------------------------------------------------
create table public.reviews (
  id            uuid primary key default gen_random_uuid(),
  vendor_id     uuid not null references public.vendors(id) on delete cascade,
  customer_id   uuid not null references public.profiles(id) on delete cascade,
  bid_id        uuid references public.bids(id) on delete set null,
  stars         int not null check (stars between 1 and 5),
  body          text not null,
  event_type    text,
  tags          text[],
  created_at    timestamptz not null default now(),
  unique(bid_id)
);
comment on table public.reviews is 'Customer review of a vendor. One review per awarded bid.';

create index reviews_vendor_idx on public.reviews(vendor_id, created_at desc);

-- ----------------------------------------------------------------
-- MESSAGES (customer <-> vendor on a specific event)
-- ----------------------------------------------------------------
create table public.messages (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.events(id) on delete cascade,
  bid_id        uuid references public.bids(id) on delete set null,
  sender_id     uuid not null references public.profiles(id) on delete cascade,
  recipient_id  uuid not null references public.profiles(id) on delete cascade,
  body          text not null,
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);
comment on table public.messages is 'Direct messages tied to a specific event/bid thread.';

create index messages_thread_idx on public.messages(event_id, sender_id, recipient_id, created_at);
create index messages_unread_idx on public.messages(recipient_id, read) where read = false;

-- ----------------------------------------------------------------
-- PAYMENTS
-- ----------------------------------------------------------------
create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  bid_id          uuid not null references public.bids(id) on delete cascade,
  customer_id     uuid not null references public.profiles(id),
  vendor_id       uuid not null references public.vendors(id),
  gross_amount    int not null,
  platform_fee    int not null,
  net_payout      int not null,
  stripe_payment_intent text,
  status          payment_status not null default 'pending',
  created_at      timestamptz not null default now(),
  released_at     timestamptz
);

-- ----------------------------------------------------------------
-- NOTIFICATIONS
-- ----------------------------------------------------------------
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        notification_type not null,
  title       text not null,
  body        text,
  link        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index notifications_user_idx on public.notifications(user_id, read, created_at desc);

-- ----------------------------------------------------------------
-- FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger trg_vendors_updated_at
  before update on public.vendors
  for each row execute function public.handle_updated_at();

create trigger trg_events_updated_at
  before update on public.events
  for each row execute function public.handle_updated_at();

create trigger trg_bids_updated_at
  before update on public.bids
  for each row execute function public.handle_updated_at();

-- Keep events.bid_count accurate
create or replace function public.update_event_bid_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.events set bid_count = bid_count + 1 where id = new.event_id;
  elsif TG_OP = 'DELETE' then
    update public.events set bid_count = bid_count - 1 where id = old.event_id;
  end if;
  return null;
end;
$$;

create trigger trg_bid_count
  after insert or delete on public.bids
  for each row execute function public.update_event_bid_count();

-- Recalculate vendor rating after every review insert/delete
create or replace function public.update_vendor_rating()
returns trigger language plpgsql as $$
declare
  v_avg numeric;
  v_count int;
begin
  select avg(stars)::numeric(3,2), count(*)
    into v_avg, v_count
    from public.reviews
   where vendor_id = coalesce(new.vendor_id, old.vendor_id);

  update public.vendors
     set rating = coalesce(v_avg, 0),
         review_count = v_count
   where id = coalesce(new.vendor_id, old.vendor_id);
  return null;
end;
$$;

create trigger trg_vendor_rating
  after insert or delete or update on public.reviews
  for each row execute function public.update_vendor_rating();

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$;

create trigger trg_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------

alter table public.profiles         enable row level security;
alter table public.vendors          enable row level security;
alter table public.vendor_documents enable row level security;
alter table public.events           enable row level security;
alter table public.bids             enable row level security;
alter table public.reviews          enable row level security;
alter table public.messages         enable row level security;
alter table public.payments         enable row level security;
alter table public.notifications    enable row level security;

-- profiles: anyone can read; only owner can update
create policy "profiles_select"  on public.profiles for select using (true);
create policy "profiles_update"  on public.profiles for update using (auth.uid() = id);

-- vendors: anyone can read verified vendors; owner can update their own
create policy "vendors_select"   on public.vendors for select using (status = 'verified' or auth.uid() = id);
create policy "vendors_insert"   on public.vendors for insert with check (auth.uid() = id);
create policy "vendors_update"   on public.vendors for update using (auth.uid() = id);

-- vendor docs: only the vendor can see and upload their own docs
create policy "vendordocs_select" on public.vendor_documents for select using (
  auth.uid() = vendor_id
);
create policy "vendordocs_insert" on public.vendor_documents for insert with check (
  auth.uid() = vendor_id
);

-- events: anyone can read open events; only creator can update/delete
create policy "events_select"    on public.events for select using (true);
create policy "events_insert"    on public.events for insert with check (auth.uid() = customer_id);
create policy "events_update"    on public.events for update using (auth.uid() = customer_id);
create policy "events_delete"    on public.events for delete using (auth.uid() = customer_id);

-- bids: event owner + the bidding vendor can see bids; only vendor inserts their own
create policy "bids_select"      on public.bids for select using (
  auth.uid() = vendor_id
  or auth.uid() = (select customer_id from public.events where id = event_id)
);
create policy "bids_insert"      on public.bids for insert with check (auth.uid() = vendor_id);
create policy "bids_update"      on public.bids for update using (
  auth.uid() = vendor_id
  or auth.uid() = (select customer_id from public.events where id = event_id)
);

-- reviews: anyone can read; only customer who booked can insert
create policy "reviews_select"   on public.reviews for select using (true);
create policy "reviews_insert"   on public.reviews for insert with check (auth.uid() = customer_id);

-- messages: only sender or recipient can see
create policy "messages_select"  on public.messages for select using (
  auth.uid() = sender_id or auth.uid() = recipient_id
);
create policy "messages_insert"  on public.messages for insert with check (auth.uid() = sender_id);

-- payments: only involved parties
create policy "payments_select"  on public.payments for select using (
  auth.uid() = customer_id or auth.uid() = vendor_id
);

-- notifications: only the recipient
create policy "notifications_select" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update" on public.notifications for update using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- STORAGE BUCKETS
-- ----------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('vendor-docs',    'vendor-docs',    false, 5242880,
   array['application/pdf','image/jpeg','image/png','image/webp']),
  ('avatars',        'avatars',        true,  2097152,
   array['image/jpeg','image/png','image/webp']),
  ('event-images',   'event-images',   true,  5242880,
   array['image/jpeg','image/png','image/webp']);

-- Vendor docs: only the vendor can upload/read their own folder
create policy "vendordocs_storage_insert" on storage.objects for insert with check (
  bucket_id = 'vendor-docs' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "vendordocs_storage_select" on storage.objects for select using (
  bucket_id = 'vendor-docs' and auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatars and event images: public read, authenticated upload
create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_auth_insert" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.role() = 'authenticated'
);
create policy "event_images_public_read" on storage.objects for select using (bucket_id = 'event-images');
create policy "event_images_auth_insert" on storage.objects for insert with check (
  bucket_id = 'event-images' and auth.role() = 'authenticated'
);

