create extension if not exists "pgcrypto";

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  site_name text not null,
  industry text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  full_name text not null,
  role text not null check (role in ('Admin', 'Planner', 'Operator', 'Quality Inspector', 'Manager')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_org_id uuid;
begin
  select id into default_org_id
  from public.organizations
  order by created_at asc
  limit 1;

  insert into public.profiles (id, organization_id, full_name, role)
  values (
    new.id,
    default_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'Admin')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.get_my_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create table if not exists public.production_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null unique,
  item_name text not null,
  customer_name text not null,
  work_center text not null,
  operator_name text not null,
  status text not null check (status in ('Scheduled', 'In Progress', 'Blocked', 'Completed')),
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  planned_qty integer not null default 0,
  completed_qty integer not null default 0,
  scrap_qty integer not null default 0,
  lot_number text not null,
  scheduled_start timestamptz not null,
  due_date timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.work_instructions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  version text not null,
  station text not null,
  steps jsonb not null default '[]'::jsonb,
  safety_notes jsonb not null default '[]'::jsonb,
  published_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.material_lots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null unique,
  material_name text not null,
  supplier_name text not null,
  status text not null check (status in ('Released', 'Hold', 'Consumed')),
  quantity text not null,
  linked_order_code text not null,
  genealogy jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  item_name text not null,
  sku text not null,
  on_hand integer not null default 0,
  reorder_point integer not null default 0,
  location text not null,
  status text not null check (status in ('Healthy', 'Low', 'Critical')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.production_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  order_code text not null,
  event_type text not null,
  event_note text not null,
  actor_name text not null,
  happened_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quality_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  order_code text not null,
  checkpoint text not null,
  result text not null check (result in ('Pass', 'Fail', 'Monitor')),
  inspector_name text not null,
  note text not null,
  checked_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.non_conformances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  severity text not null check (severity in ('Minor', 'Major', 'Critical')),
  status text not null check (status in ('Open', 'Contained', 'Closed')),
  source_order_code text not null,
  root_cause text,
  corrective_action text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.erp_sync_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  system_name text not null,
  direction text not null check (direction in ('Inbound', 'Outbound')),
  status text not null check (status in ('Healthy', 'Retrying', 'Failed')),
  records_count integer not null default 0,
  last_run timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  detail text not null,
  severity text not null check (severity in ('Info', 'Warning', 'Critical')),
  event_time timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.report_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  period text not null,
  owner_name text not null,
  generated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.work_centers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  status text not null check (status in ('Running', 'Constrained', 'Idle')),
  capacity_percent integer not null default 0,
  shift_name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  area text not null,
  status text not null check (status in ('Available', 'Maintenance', 'Downtime')),
  next_maintenance_date date not null,
  utilization_percent integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  role_name text not null,
  shift_name text not null,
  primary_skill text not null,
  hours_today numeric(6, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  lead_name text not null,
  window_label text not null,
  status text not null check (status in ('Active', 'Upcoming', 'Closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.labor_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_name text not null,
  order_code text not null,
  hours_worked numeric(6, 2) not null default 0,
  shift_name text not null,
  efficiency_percent numeric(6, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  work_center text not null,
  order_code text not null,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  status text not null check (status in ('Locked', 'Planned', 'At Risk')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bom_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  item_name text not null,
  version text not null,
  record_type text not null check (record_type in ('BOM', 'Recipe')),
  components jsonb not null default '[]'::jsonb,
  effective_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null,
  owner_name text not null,
  status text not null check (status in ('Approved', 'Draft', 'Expired')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  module_name text not null,
  action_name text not null,
  actor_name text not null,
  note text not null,
  happened_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at before update on public.organizations
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_production_orders_updated_at on public.production_orders;
create trigger set_production_orders_updated_at before update on public.production_orders
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_work_instructions_updated_at on public.work_instructions;
create trigger set_work_instructions_updated_at before update on public.work_instructions
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_material_lots_updated_at on public.material_lots;
create trigger set_material_lots_updated_at before update on public.material_lots
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_inventory_items_updated_at on public.inventory_items;
create trigger set_inventory_items_updated_at before update on public.inventory_items
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_non_conformances_updated_at on public.non_conformances;
create trigger set_non_conformances_updated_at before update on public.non_conformances
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_work_centers_updated_at on public.work_centers;
create trigger set_work_centers_updated_at before update on public.work_centers
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_equipment_updated_at on public.equipment;
create trigger set_equipment_updated_at before update on public.equipment
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_employees_updated_at on public.employees;
create trigger set_employees_updated_at before update on public.employees
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_shifts_updated_at on public.shifts;
create trigger set_shifts_updated_at before update on public.shifts
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_schedules_updated_at on public.schedules;
create trigger set_schedules_updated_at before update on public.schedules
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_bom_records_updated_at on public.bom_records;
create trigger set_bom_records_updated_at before update on public.bom_records
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at before update on public.documents
for each row execute procedure public.handle_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.production_orders enable row level security;
alter table public.work_instructions enable row level security;
alter table public.material_lots enable row level security;
alter table public.inventory_items enable row level security;
alter table public.production_events enable row level security;
alter table public.quality_checks enable row level security;
alter table public.non_conformances enable row level security;
alter table public.erp_sync_logs enable row level security;
alter table public.alerts enable row level security;
alter table public.report_snapshots enable row level security;
alter table public.work_centers enable row level security;
alter table public.equipment enable row level security;
alter table public.employees enable row level security;
alter table public.shifts enable row level security;
alter table public.labor_entries enable row level security;
alter table public.schedules enable row level security;
alter table public.bom_records enable row level security;
alter table public.documents enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Profiles can view same org" on public.profiles;
create policy "Profiles can view same org"
on public.profiles
for select
using (organization_id = public.get_my_org_id());

drop policy if exists "Profiles can update themselves" on public.profiles;
create policy "Profiles can update themselves"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Organizations readable by members" on public.organizations;
create policy "Organizations readable by members"
on public.organizations
for select
using (id = public.get_my_org_id());

drop policy if exists "Orders scoped by org" on public.production_orders;
create policy "Orders scoped by org"
on public.production_orders
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Instructions scoped by org" on public.work_instructions;
create policy "Instructions scoped by org"
on public.work_instructions
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Material lots scoped by org" on public.material_lots;
create policy "Material lots scoped by org"
on public.material_lots
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Inventory scoped by org" on public.inventory_items;
create policy "Inventory scoped by org"
on public.inventory_items
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Production events scoped by org" on public.production_events;
create policy "Production events scoped by org"
on public.production_events
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Quality checks scoped by org" on public.quality_checks;
create policy "Quality checks scoped by org"
on public.quality_checks
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Non conformances scoped by org" on public.non_conformances;
create policy "Non conformances scoped by org"
on public.non_conformances
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "ERP sync logs scoped by org" on public.erp_sync_logs;
create policy "ERP sync logs scoped by org"
on public.erp_sync_logs
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Alerts scoped by org" on public.alerts;
create policy "Alerts scoped by org"
on public.alerts
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Reports scoped by org" on public.report_snapshots;
create policy "Reports scoped by org"
on public.report_snapshots
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Work centers scoped by org" on public.work_centers;
create policy "Work centers scoped by org"
on public.work_centers
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Equipment scoped by org" on public.equipment;
create policy "Equipment scoped by org"
on public.equipment
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Employees scoped by org" on public.employees;
create policy "Employees scoped by org"
on public.employees
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Shifts scoped by org" on public.shifts;
create policy "Shifts scoped by org"
on public.shifts
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Labor entries scoped by org" on public.labor_entries;
create policy "Labor entries scoped by org"
on public.labor_entries
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Schedules scoped by org" on public.schedules;
create policy "Schedules scoped by org"
on public.schedules
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "BOM records scoped by org" on public.bom_records;
create policy "BOM records scoped by org"
on public.bom_records
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Documents scoped by org" on public.documents;
create policy "Documents scoped by org"
on public.documents
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());

drop policy if exists "Audit logs scoped by org" on public.audit_logs;
create policy "Audit logs scoped by org"
on public.audit_logs
for all
using (organization_id = public.get_my_org_id())
with check (organization_id = public.get_my_org_id());
