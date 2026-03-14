insert into public.organizations (id, name, site_name, industry)
values (
  '3f0ea458-c184-4cd4-bf36-1454109f6774',
  'Northwind Motion Components',
  'Ahmedabad Precision Plant',
  'Automotive assemblies'
)
on conflict (id) do update
set
  name = excluded.name,
  site_name = excluded.site_name,
  industry = excluded.industry;

insert into public.production_orders (
  organization_id,
  code,
  item_name,
  customer_name,
  work_center,
  operator_name,
  status,
  priority,
  planned_qty,
  completed_qty,
  scrap_qty,
  lot_number,
  scheduled_start,
  due_date
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1008',
    'ABS Brake Valve Assembly',
    'Apex Mobility',
    'CNC Line 3',
    'Neha S.',
    'In Progress',
    'High',
    480,
    332,
    6,
    'FG-ABS-23018',
    '2026-03-14T08:00:00+05:30',
    '2026-03-14T16:30:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1012',
    'Hydraulic Pump Housing',
    'Revline Systems',
    'Machining Cell 2',
    'Krunal P.',
    'Scheduled',
    'Medium',
    250,
    0,
    0,
    'FG-HPH-76210',
    '2026-03-14T12:30:00+05:30',
    '2026-03-15T08:00:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1015',
    'Sensor Mount Bracket',
    'MedAxis Devices',
    'Assembly Pod 1',
    'Riya M.',
    'Blocked',
    'High',
    320,
    140,
    4,
    'FG-SMB-10943',
    '2026-03-14T07:30:00+05:30',
    '2026-03-14T14:00:00+05:30'
  )
on conflict (code) do nothing;

insert into public.work_instructions (
  organization_id,
  title,
  version,
  station,
  steps,
  safety_notes,
  published_at
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Brake Valve Assembly Sequence',
    'v3.4',
    'Assembly Cell A',
    '["Scan raw housing and seal kit before assembly.","Torque primary valve body to 48 Nm.","Run pressure test profile B and confirm pass window."]'::jsonb,
    '["Wear eye protection","Confirm pneumatic lockout before maintenance"]'::jsonb,
    '2026-03-13T18:00:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'CNC Housing Inspection Standard',
    'v2.1',
    'CNC Line 3',
    '["Verify fixture ID and machine offset before run start.","Measure critical bore diameter every 25 pieces.","Escalate drift beyond 0.03 mm to quality lead."]'::jsonb,
    '["Use cut-resistant gloves","Keep chip tray clear before inspection"]'::jsonb,
    '2026-03-12T12:30:00+05:30'
  )
on conflict do nothing;

insert into public.material_lots (
  organization_id,
  code,
  material_name,
  supplier_name,
  status,
  quantity,
  linked_order_code,
  genealogy
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'RM-AL-19420',
    'Aluminum housing billet',
    'Metallix Prime',
    'Consumed',
    '420 kg',
    'PO-1008',
    '["Supplier ASN #ASN-4421","Incoming inspection PASS","Consumed into FG-ABS-23018"]'::jsonb
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'RM-STEEL-2881',
    'Hardened steel blank',
    'FerraForge',
    'Hold',
    '640 pcs',
    'PO-1015',
    '["Supplier deviation under review","QC hold applied at receiving","Pending MRB disposition"]'::jsonb
  )
on conflict (code) do nothing;

insert into public.inventory_items (
  organization_id,
  item_name,
  sku,
  on_hand,
  reorder_point,
  location,
  status
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Aluminum housing billet',
    'RM-AL-09',
    840,
    600,
    'Raw Store A1',
    'Healthy'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Nitrile seal kit',
    'RM-SK-22',
    220,
    250,
    'Kit Rack B14',
    'Low'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Steel blank 18 mm',
    'RM-ST-18',
    120,
    180,
    'Cage C5',
    'Critical'
  )
on conflict do nothing;

insert into public.production_events (
  organization_id,
  order_code,
  event_type,
  event_note,
  actor_name,
  happened_at
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1008',
    'Progress update',
    '332 units completed and pressure test passed.',
    'Neha S.',
    '2026-03-14T10:15:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1015',
    'Blocker',
    'Material hold raised after supplier deviation.',
    'Ishita D.',
    '2026-03-14T09:48:00+05:30'
  )
on conflict do nothing;

insert into public.quality_checks (
  organization_id,
  order_code,
  checkpoint,
  result,
  inspector_name,
  note,
  checked_at
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1008',
    'Pressure leak test',
    'Pass',
    'Ishita D.',
    'All samples within tolerance band.',
    '2026-03-14T10:15:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PO-1015',
    'Bracket alignment gauge',
    'Fail',
    'Ishita D.',
    'Two units exceed slot offset threshold. CAPA triggered.',
    '2026-03-14T09:48:00+05:30'
  )
on conflict do nothing;

insert into public.non_conformances (
  organization_id,
  title,
  severity,
  status,
  source_order_code,
  root_cause,
  corrective_action
)
values (
  '3f0ea458-c184-4cd4-bf36-1454109f6774',
  'Bracket misalignment deviation',
  'Major',
  'Contained',
  'PO-1015',
  'Fixture wear beyond calibration cycle',
  'Replace worn fixture, revalidate alignment gauge, and restart with first-piece approval'
)
on conflict do nothing;

insert into public.erp_sync_logs (
  organization_id,
  system_name,
  direction,
  status,
  records_count,
  last_run
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'SAP B1',
    'Outbound',
    'Healthy',
    42,
    '2026-03-14T10:20:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Supplier ASN Feed',
    'Inbound',
    'Failed',
    0,
    '2026-03-14T09:54:00+05:30'
  )
on conflict do nothing;

insert into public.alerts (
  organization_id,
  title,
  detail,
  severity,
  event_time
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Tooling calibration pending',
    'Machining Cell 2 cannot release PO-1012 until first article approval is logged.',
    'Warning',
    '2026-03-14T10:20:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Material lot on hold',
    'RM-STEEL-2881 is blocked after supplier deviation review.',
    'Critical',
    '2026-03-14T10:08:00+05:30'
  )
on conflict do nothing;

insert into public.report_snapshots (
  organization_id,
  name,
  period,
  owner_name,
  generated_at
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Shift performance pulse',
    'Today • Shift A',
    'Plant Manager',
    '2026-03-14T10:30:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Quality loss pareto',
    'Last 7 days',
    'Quality Lead',
    '2026-03-14T09:45:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Traceability audit pack',
    'Customer lot FG-ABS-23018',
    'Compliance',
    '2026-03-14T08:10:00+05:30'
  )
on conflict do nothing;

insert into public.work_centers (
  organization_id,
  name,
  status,
  capacity_percent,
  shift_name
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'CNC Line 3',
    'Running',
    92,
    'Shift A'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Machining Cell 2',
    'Constrained',
    81,
    'Shift A'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Assembly Pod 1',
    'Running',
    88,
    'Shift A'
  )
on conflict do nothing;

insert into public.equipment (
  organization_id,
  name,
  area,
  status,
  next_maintenance_date,
  utilization_percent
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Mazak VCN-530C',
    'Machining Cell 2',
    'Maintenance',
    '2026-03-15',
    74
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Leak Test Bench B',
    'Assembly Cell A',
    'Available',
    '2026-03-18',
    86
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Vision Inspection Station',
    'Quality Lab',
    'Downtime',
    '2026-03-14',
    0
  )
on conflict do nothing;

insert into public.employees (
  organization_id,
  name,
  role_name,
  shift_name,
  primary_skill,
  hours_today
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Neha S.',
    'Operator',
    'Shift A',
    'Assembly',
    5.2
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Ishita D.',
    'Quality Inspector',
    'Shift A',
    'Inspection',
    4.8
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Krunal P.',
    'Planner',
    'Shift A',
    'Scheduling',
    3.4
  )
on conflict do nothing;

insert into public.shifts (
  organization_id,
  name,
  lead_name,
  window_label,
  status
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Shift A',
    'Aarav Patel',
    '06:00 - 14:00',
    'Active'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Shift B',
    'Ritu G.',
    '14:00 - 22:00',
    'Upcoming'
  )
on conflict do nothing;

insert into public.labor_entries (
  organization_id,
  employee_name,
  order_code,
  hours_worked,
  shift_name,
  efficiency_percent
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Neha S.',
    'PO-1008',
    5.2,
    'Shift A',
    97
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Riya M.',
    'PO-1015',
    4.4,
    'Shift A',
    89
  )
on conflict do nothing;

insert into public.schedules (
  organization_id,
  work_center,
  order_code,
  slot_start,
  slot_end,
  status
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'CNC Line 3',
    'PO-1008',
    '2026-03-14T08:00:00+05:30',
    '2026-03-14T16:30:00+05:30',
    'Locked'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Machining Cell 2',
    'PO-1012',
    '2026-03-14T12:30:00+05:30',
    '2026-03-15T08:00:00+05:30',
    'At Risk'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Assembly Pod 1',
    'PO-1015',
    '2026-03-14T07:30:00+05:30',
    '2026-03-14T14:00:00+05:30',
    'Planned'
  )
on conflict do nothing;

insert into public.bom_records (
  organization_id,
  item_name,
  version,
  record_type,
  components,
  effective_date
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'ABS Brake Valve Assembly',
    'v5.2',
    'BOM',
    '["Aluminum housing billet","Nitrile seal kit","Valve spring pack"]'::jsonb,
    '2026-03-01'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Hydraulic Pump Housing',
    'v2.4',
    'Recipe',
    '["Steel blank 18 mm","Coolant profile C","Heat treatment program 7"]'::jsonb,
    '2026-02-22'
  )
on conflict do nothing;

insert into public.documents (
  organization_id,
  title,
  category,
  owner_name,
  status
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'PPAP Approval Pack',
    'Compliance',
    'Quality Lead',
    'Approved'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Torque Spec Sheet',
    'Work Instruction',
    'Manufacturing Engineer',
    'Approved'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Calibration Certificate',
    'Equipment',
    'Maintenance Lead',
    'Draft'
  )
on conflict do nothing;

insert into public.audit_logs (
  organization_id,
  module_name,
  action_name,
  actor_name,
  note,
  happened_at
)
values
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Quality',
    'Non-conformance updated',
    'Ishita D.',
    'Containment action logged for PO-1015 deviation.',
    '2026-03-14T10:04:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'Scheduling',
    'Schedule slot moved',
    'Krunal P.',
    'PO-1012 slot moved after tooling readiness delay.',
    '2026-03-14T09:32:00+05:30'
  ),
  (
    '3f0ea458-c184-4cd4-bf36-1454109f6774',
    'ERP Sync',
    'Connector retry succeeded',
    'System',
    'SAP B1 outbound batch posted after automatic retry.',
    '2026-03-14T10:20:00+05:30'
  )
on conflict do nothing;
