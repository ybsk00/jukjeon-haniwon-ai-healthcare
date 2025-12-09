-- Update status check constraint to include 'cancelled'
alter table public.patients drop constraint if exists patients_status_check;
alter table public.patients add constraint patients_status_check check (status in ('pending', 'completed', 'cancelled'));
