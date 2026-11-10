-- =========================================================================
-- Travel Rwanda — Transport Services
-- Database Schema & Least-Privilege Row-Level Security (RLS)
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. VEHICLE CATEGORIES
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- 2. VEHICLES TABLE
create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  subtitle text,
  description text,
  passenger_capacity integer, -- NULL until verified by owner
  luggage_capacity integer,   -- NULL until verified
  transmission text,          -- NULL until verified
  fuel_type text,             -- NULL until verified
  daily_rate_rwf numeric,     -- NULL -> shows "Request a quote"
  suitable_uses text[] default array[]::text[],
  confirmed_services text[] default array[]::text[],
  included_items text[] default array[]::text[],
  excluded_items text[] default array[]::text[],
  primary_asset_slot text not null,
  is_published boolean default false,
  is_featured boolean default false,
  is_archived boolean default false,
  is_demo_sample boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. VEHICLE CATEGORY MAPPING
create table if not exists vehicle_categories (
  vehicle_id uuid references vehicles(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (vehicle_id, category_id)
);

-- 4. SERVICES
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_summary text not null,
  full_description text not null,
  is_enabled boolean default false,
  requires_owner_confirmation boolean default false,
  sort_order integer default 0
);

-- 5. BOOKING ENQUIRIES
create table if not exists enquiries (
  id uuid primary key default uuid_generate_v4(),
  reference_code text unique not null,
  idempotency_key text unique not null,
  service_type text not null,
  status text not null default 'New',
  pickup_location text not null,
  dropoff_location text,
  pickup_date date not null,
  pickup_time time not null,
  return_date date,
  return_time time,
  passenger_count integer not null check (passenger_count > 0),
  service_specific_data jsonb default '{}'::jsonb,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  preferred_contact_method text not null default 'whatsapp',
  booking_for_someone_else boolean default false,
  traveller_name text,
  traveller_phone text,
  customer_notes text,
  privacy_accepted boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 6. STATUS HISTORY AUDIT LOG
create table if not exists enquiry_status_history (
  id uuid primary key default uuid_generate_v4(),
  enquiry_id uuid references enquiries(id) on delete cascade,
  previous_status text not null,
  new_status text not null,
  changed_by_email text not null,
  note text,
  created_at timestamp with time zone default now()
);

-- 7. CONFIDENTIAL STAFF NOTES
create table if not exists enquiry_notes (
  id uuid primary key default uuid_generate_v4(),
  enquiry_id uuid references enquiries(id) on delete cascade,
  author_email text not null,
  body text not null,
  created_at timestamp with time zone default now()
);

-- 8. NOTIFICATION DELIVERY LOGS
create table if not exists notification_logs (
  id uuid primary key default uuid_generate_v4(),
  enquiry_id uuid references enquiries(id) on delete cascade,
  recipient_type text not null,
  recipient_email text not null,
  status text not null, -- 'sent', 'failed', 'unconfigured'
  error_message text,
  attempt_count integer default 1,
  last_attempt_at timestamp with time zone default now()
);

-- 9. ADMIN PROFILES
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 10. SITE SETTINGS
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  requires_owner_verification boolean default false,
  updated_at timestamp with time zone default now()
);

-- =========================================================================
-- LEAST-PRIVILEGE ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table vehicles enable row level security;
alter table categories enable row level security;
alter table services enable row level security;
alter table enquiries enable row level security;
alter table enquiry_status_history enable row level security;
alter table enquiry_notes enable row level security;
alter table notification_logs enable row level security;
alter table admin_profiles enable row level security;
alter table site_settings enable row level security;

-- Public read access ONLY for published content
create policy "Public can read published vehicles"
  on vehicles for select
  using (is_published = true and is_archived = false);

create policy "Public can read categories"
  on categories for select
  using (true);

create policy "Public can read enabled services"
  on services for select
  using (is_enabled = true);

create policy "Public can read site settings"
  on site_settings for select
  using (true);

-- Enquiries: Public CANNOT read enquiries (prevents reference/ID guessing attacks)
-- Insertion passes through validated server API boundary
create policy "Authenticated admins full access on enquiries"
  on enquiries for all
  using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.id = auth.uid() and admin_profiles.is_active = true
    )
  );

create policy "Authenticated admins full access on enquiry notes"
  on enquiry_notes for all
  using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.id = auth.uid() and admin_profiles.is_active = true
    )
  );
