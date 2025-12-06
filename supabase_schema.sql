-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users & Profiles
create table public.patient_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  date_of_birth date,
  gender text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('doctor', 'staff', 'admin')),
  display_name text,
  created_at timestamptz default now()
);

-- 2. Visits
create table public.visits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  visit_type text, -- 'first', 'revisit', 'online'
  status text, -- 'scheduled', 'completed', 'canceled'
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Health Data (Content)
create table public.health_topics (
  id uuid primary key default uuid_generate_v4(),
  topic_key text unique not null, -- 'resilience', 'women', 'pain', 'digestion', 'pregnancy'
  title text not null,
  created_at timestamptz default now()
);

create table public.health_questions (
  id uuid primary key default uuid_generate_v4(),
  topic_id uuid references public.health_topics(id) on delete cascade,
  question_key text not null,
  text text not null,
  input_type text, -- 'text', 'choice', 'scale'
  options jsonb, -- for choices
  mode text default 'healthcare', -- 'healthcare', 'medical'
  version int default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 4. Chat Sessions
create table public.chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text, -- for non-login users
  mode text, -- 'healthcare', 'medical'
  topic text, -- topic_key
  visit_id uuid references public.visits(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  sender text, -- 'user', 'ai', 'system'
  content text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- 5. Intake Data
create table public.intake_answers (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  question_id uuid references public.health_questions(id) on delete set null,
  question_key text,
  raw_answer text,
  normalized jsonb,
  created_at timestamptz default now()
);

create table public.intake_summaries (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid references public.visits(id) on delete set null,
  session_id uuid references public.chat_sessions(id) on delete set null,
  main_concern text,
  pattern_tags text[],
  rhythm_score int,
  rhythm_score_detail jsonb,
  summary_text text,
  created_at timestamptz default now()
);

-- 6. Clinical Data
create table public.clinical_notes (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid references public.visits(id) on delete cascade,
  note_type text, -- 'soap', 'memo'
  title text,
  body text, -- Encrypted or protected ideally, but text for MVP
  created_at timestamptz default now()
);

create table public.treatment_plans (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid references public.visits(id) on delete cascade,
  plan_type text, -- 'herbal', 'acupuncture', 'lifestyle'
  title text,
  metadata jsonb,
  created_at timestamptz default now()
);

create table public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  visit_id uuid references public.visits(id) on delete set null,
  title text,
  schedule_at timestamptz,
  is_sent boolean default false,
  created_at timestamptz default now()
);

create table public.clinical_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  visit_id uuid references public.visits(id) on delete set null,
  session_id uuid references public.chat_sessions(id) on delete set null,
  image_url text not null,
  thumbnail_url text,
  body_part text,
  description text,
  ai_summary text,
  ai_metadata jsonb,
  created_at timestamptz default now()
);

-- 7. Logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_table text,
  entity_id uuid,
  action text, -- 'view', 'create', 'update', 'delete'
  created_at timestamptz default now()
);

-- Safely add metadata column if it doesn't exist
alter table public.audit_logs add column if not exists metadata jsonb;

-- RLS Policies (Basic Setup - to be refined)
alter table public.patient_profiles enable row level security;
alter table public.visits enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.clinical_images enable row level security;

-- Policy: Users can see their own data
create policy "Users can view own profile" on public.patient_profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.patient_profiles for update using (auth.uid() = user_id);

create policy "Users can view own visits" on public.visits for select using (auth.uid() = user_id);
create policy "Users can view own sessions" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "Users can view own messages" on public.chat_messages for select using ( session_id in (select id from chat_sessions where user_id = auth.uid() or anonymous_id is not null) );

-- Note: More complex policies for Staff/Doctor access needed later.

-- 8. Security Helper Functions
create or replace function public.is_staff()
returns boolean as $$
begin
  return exists (
    select 1 from public.staff_users
    where user_id = auth.uid()
    and role in ('doctor', 'staff', 'admin')
  );
end;
$$ language plpgsql security definer;

-- 9. Advanced RLS Policies

-- Staff Users Table
alter table public.staff_users enable row level security;
create policy "Users can view own staff role" on public.staff_users for select using (auth.uid() = user_id);
create policy "Staff can view all staff" on public.staff_users for select using (public.is_staff());

-- Clinical Notes & Treatment Plans
alter table public.clinical_notes enable row level security;
create policy "Staff can manage clinical notes" on public.clinical_notes for all using (public.is_staff());

alter table public.treatment_plans enable row level security;
create policy "Staff can manage treatment plans" on public.treatment_plans for all using (public.is_staff());
create policy "Patients can view own treatment plans" on public.treatment_plans for select using (
  visit_id in (select id from visits where user_id = auth.uid())
);

-- Reminders
alter table public.reminders enable row level security;
create policy "Users can view own reminders" on public.reminders for select using (auth.uid() = user_id);
create policy "Staff can manage reminders" on public.reminders for all using (public.is_staff());

-- Audit Logs
alter table public.audit_logs enable row level security;
create policy "Staff can view audit logs" on public.audit_logs for select using (public.is_staff());
create policy "System can insert audit logs" on public.audit_logs for insert with check (true); -- Ideally restricted to server-side only

