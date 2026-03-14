import {
  Activity,
  Boxes,
  ClipboardCheck,
  ScanLine,
} from "lucide-react";
import type {
  AlertItem,
  AuditLogRecord,
  BomRecord,
  DemoUser,
  DocumentRecord,
  Employee,
  Equipment,
  HighlightItem,
  InventoryItem,
  LaborEntry,
  MaterialLot,
  Metric,
  NonConformance,
  ProductionEventRecord,
  ProductionOrder,
  QualityCheck,
  ReportItem,
  ScheduleItem,
  ShiftRecord,
  SyncLog,
  WorkCenter,
  WorkInstruction,
} from "@/lib/types";

export const productName = "ForgeFlow MES";

export const demoUser: DemoUser = {
  name: "Aarav Patel",
  email: "demo@forgeflow.ai",
  role: "Manager",
};

export const organization = {
  name: "Northwind Motion Components",
  site: "Ahmedabad Precision Plant",
  sector: "Automotive assemblies",
};

export const dashboardMetrics: Metric[] = [
  { label: "OEE", value: "86.4%", change: "+3.2%" },
  { label: "First Pass Yield", value: "98.1%", change: "+1.4%" },
  { label: "Throughput", value: "1,248 units", change: "+9.8%" },
  { label: "Defect Rate", value: "1.9%", change: "-0.8%", inverse: true },
];

export const productionOrders: ProductionOrder[] = [
  {
    id: "po-1008",
    code: "PO-1008",
    itemName: "ABS Brake Valve Assembly",
    customer: "Apex Mobility",
    workCenter: "CNC Line 3",
    operator: "Neha S.",
    status: "In Progress",
    priority: "High",
    plannedQty: 480,
    completedQty: 332,
    scrapQty: 6,
    scheduledStart: "2026-03-14T08:00:00+05:30",
    dueDate: "2026-03-14T16:30:00+05:30",
    lotNumber: "FG-ABS-23018",
  },
  {
    id: "po-1012",
    code: "PO-1012",
    itemName: "Hydraulic Pump Housing",
    customer: "Revline Systems",
    workCenter: "Machining Cell 2",
    operator: "Krunal P.",
    status: "Scheduled",
    priority: "Medium",
    plannedQty: 250,
    completedQty: 0,
    scrapQty: 0,
    scheduledStart: "2026-03-14T12:30:00+05:30",
    dueDate: "2026-03-15T08:00:00+05:30",
    lotNumber: "FG-HPH-76210",
  },
  {
    id: "po-1015",
    code: "PO-1015",
    itemName: "Sensor Mount Bracket",
    customer: "MedAxis Devices",
    workCenter: "Assembly Pod 1",
    operator: "Riya M.",
    status: "Blocked",
    priority: "High",
    plannedQty: 320,
    completedQty: 140,
    scrapQty: 4,
    scheduledStart: "2026-03-14T07:30:00+05:30",
    dueDate: "2026-03-14T14:00:00+05:30",
    lotNumber: "FG-SMB-10943",
  },
  {
    id: "po-1004",
    code: "PO-1004",
    itemName: "Drive Shaft Coupler",
    customer: "TorqueCraft",
    workCenter: "Finishing Bay",
    operator: "Manav R.",
    status: "Completed",
    priority: "Low",
    plannedQty: 180,
    completedQty: 180,
    scrapQty: 2,
    scheduledStart: "2026-03-14T05:30:00+05:30",
    dueDate: "2026-03-14T10:30:00+05:30",
    lotNumber: "FG-DSC-44811",
  },
];

export const workInstructions: WorkInstruction[] = [
  {
    id: "wi-01",
    title: "Brake Valve Assembly Sequence",
    version: "v3.4",
    station: "Assembly Cell A",
    updatedAt: "2026-03-13T18:00:00+05:30",
    steps: [
      "Scan raw housing and seal kit before assembly.",
      "Torque primary valve body to 48 Nm.",
      "Run pressure test profile B and confirm pass window.",
    ],
    safetyNotes: ["Wear eye protection", "Confirm pneumatic lockout before maintenance"],
  },
  {
    id: "wi-02",
    title: "CNC Housing Inspection Standard",
    version: "v2.1",
    station: "CNC Line 3",
    updatedAt: "2026-03-12T12:30:00+05:30",
    steps: [
      "Verify fixture ID and machine offset before run start.",
      "Measure critical bore diameter every 25 pieces.",
      "Escalate drift beyond 0.03 mm to quality lead.",
    ],
    safetyNotes: ["Use cut-resistant gloves", "Keep chip tray clear before inspection"],
  },
  {
    id: "wi-03",
    title: "Sensor Bracket Packing Flow",
    version: "v1.7",
    station: "Packing Lane",
    updatedAt: "2026-03-11T09:15:00+05:30",
    steps: [
      "Match carton code to customer routing sheet.",
      "Apply serialized label and verify handheld confirmation.",
      "Move pallet to staging zone C for dispatch release.",
    ],
    safetyNotes: ["Confirm pallet integrity", "Use assisted lift for loads above 20 kg"],
  },
];

export const qualityChecks: QualityCheck[] = [
  {
    id: "qc-100",
    orderCode: "PO-1008",
    checkpoint: "Pressure leak test",
    result: "Pass",
    inspector: "Ishita D.",
    timestamp: "2026-03-14T10:15:00+05:30",
    note: "All samples within tolerance band.",
  },
  {
    id: "qc-101",
    orderCode: "PO-1015",
    checkpoint: "Bracket alignment gauge",
    result: "Fail",
    inspector: "Ishita D.",
    timestamp: "2026-03-14T09:48:00+05:30",
    note: "Two units exceed slot offset threshold. CAPA triggered.",
  },
  {
    id: "qc-102",
    orderCode: "PO-1004",
    checkpoint: "Final surface finish",
    result: "Pass",
    inspector: "Dhruv P.",
    timestamp: "2026-03-14T08:05:00+05:30",
    note: "Shipment released to dispatch.",
  },
  {
    id: "qc-103",
    orderCode: "PO-1012",
    checkpoint: "First article setup",
    result: "Monitor",
    inspector: "Jinal K.",
    timestamp: "2026-03-14T11:20:00+05:30",
    note: "Awaiting tooling calibration signoff before full run.",
  },
];

export const nonConformances: NonConformance[] = [
  {
    id: "nc-01",
    title: "Bracket misalignment deviation",
    severity: "Major",
    status: "Contained",
    sourceOrderCode: "PO-1015",
    rootCause: "Fixture wear beyond calibration cycle.",
    correctiveAction: "Replace fixture, revalidate alignment gauge, and restart with first-piece approval.",
  },
  {
    id: "nc-02",
    title: "Seal kit packaging issue",
    severity: "Minor",
    status: "Open",
    sourceOrderCode: "PO-1008",
    rootCause: "Supplier pouch label mismatch.",
    correctiveAction: "Segregate the lot and relabel incoming stock after QA approval.",
  },
];

export const materialLots: MaterialLot[] = [
  {
    id: "lot-01",
    code: "RM-AL-19420",
    material: "Aluminum housing billet",
    supplier: "Metallix Prime",
    status: "Consumed",
    quantity: "420 kg",
    linkedOrder: "PO-1008",
    genealogy: ["Supplier ASN #ASN-4421", "Incoming inspection PASS", "Consumed into FG-ABS-23018"],
  },
  {
    id: "lot-02",
    code: "RM-SEAL-7702",
    material: "Nitrile seal kit",
    supplier: "SealWorks",
    status: "Released",
    quantity: "1,100 pcs",
    linkedOrder: "PO-1008",
    genealogy: ["Batch certification uploaded", "Storage rack B-14", "Assigned to Assembly Cell A"],
  },
  {
    id: "lot-03",
    code: "RM-STEEL-2881",
    material: "Hardened steel blank",
    supplier: "FerraForge",
    status: "Hold",
    quantity: "640 pcs",
    linkedOrder: "PO-1015",
    genealogy: ["Supplier deviation under review", "QC hold applied at receiving", "Pending MRB disposition"],
  },
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "inv-01",
    item: "Aluminum housing billet",
    sku: "RM-AL-09",
    onHand: 840,
    reorderPoint: 600,
    location: "Raw Store A1",
    status: "Healthy",
  },
  {
    id: "inv-02",
    item: "Nitrile seal kit",
    sku: "RM-SK-22",
    onHand: 220,
    reorderPoint: 250,
    location: "Kit Rack B14",
    status: "Low",
  },
  {
    id: "inv-03",
    item: "Steel blank 18 mm",
    sku: "RM-ST-18",
    onHand: 120,
    reorderPoint: 180,
    location: "Cage C5",
    status: "Critical",
  },
  {
    id: "inv-04",
    item: "Finished valve assembly",
    sku: "FG-ABS-88",
    onHand: 332,
    reorderPoint: 120,
    location: "Dispatch D2",
    status: "Healthy",
  },
];

export const syncLogs: SyncLog[] = [
  {
    id: "sync-01",
    system: "SAP B1",
    direction: "Outbound",
    status: "Healthy",
    lastRun: "2026-03-14T10:20:00+05:30",
    records: 42,
  },
  {
    id: "sync-02",
    system: "WMS Connector",
    direction: "Inbound",
    status: "Retrying",
    lastRun: "2026-03-14T10:08:00+05:30",
    records: 12,
  },
  {
    id: "sync-03",
    system: "Supplier ASN Feed",
    direction: "Inbound",
    status: "Failed",
    lastRun: "2026-03-14T09:54:00+05:30",
    records: 0,
  },
];

export const alerts: AlertItem[] = [
  {
    id: "alert-01",
    title: "Tooling calibration pending",
    detail: "Machining Cell 2 cannot release PO-1012 until first article approval is logged.",
    severity: "Warning",
    timestamp: "10 mins ago",
  },
  {
    id: "alert-02",
    title: "Material lot on hold",
    detail: "RM-STEEL-2881 is blocked after supplier deviation review.",
    severity: "Critical",
    timestamp: "22 mins ago",
  },
  {
    id: "alert-03",
    title: "ERP sync retried successfully",
    detail: "SAP B1 outbound posting recovered after one automatic retry.",
    severity: "Info",
    timestamp: "34 mins ago",
  },
];

export const reports: ReportItem[] = [
  {
    id: "rep-01",
    name: "Shift performance pulse",
    period: "Today • Shift A",
    owner: "Plant Manager",
    lastGenerated: "10:30 AM",
  },
  {
    id: "rep-02",
    name: "Quality loss pareto",
    period: "Last 7 days",
    owner: "Quality Lead",
    lastGenerated: "9:45 AM",
  },
  {
    id: "rep-03",
    name: "Traceability audit pack",
    period: "Customer lot FG-ABS-23018",
    owner: "Compliance",
    lastGenerated: "8:10 AM",
  },
];

export const workCenters: WorkCenter[] = [
  {
    id: "wc-01",
    name: "CNC Line 3",
    status: "Running",
    capacity: "92%",
    shift: "Shift A",
  },
  {
    id: "wc-02",
    name: "Machining Cell 2",
    status: "Constrained",
    capacity: "81%",
    shift: "Shift A",
  },
  {
    id: "wc-03",
    name: "Assembly Pod 1",
    status: "Running",
    capacity: "88%",
    shift: "Shift A",
  },
];

export const equipment: Equipment[] = [
  {
    id: "eq-01",
    name: "Mazak VCN-530C",
    area: "Machining Cell 2",
    status: "Maintenance",
    nextMaintenance: "2026-03-15",
    utilization: "74%",
  },
  {
    id: "eq-02",
    name: "Leak Test Bench B",
    area: "Assembly Cell A",
    status: "Available",
    nextMaintenance: "2026-03-18",
    utilization: "86%",
  },
  {
    id: "eq-03",
    name: "Vision Inspection Station",
    area: "Quality Lab",
    status: "Downtime",
    nextMaintenance: "2026-03-14",
    utilization: "0%",
  },
];

export const employees: Employee[] = [
  {
    id: "emp-01",
    name: "Neha S.",
    role: "Operator",
    shift: "Shift A",
    skill: "Assembly",
    hoursToday: 5.2,
  },
  {
    id: "emp-02",
    name: "Ishita D.",
    role: "Quality Inspector",
    shift: "Shift A",
    skill: "Inspection",
    hoursToday: 4.8,
  },
  {
    id: "emp-03",
    name: "Krunal P.",
    role: "Planner",
    shift: "Shift A",
    skill: "Scheduling",
    hoursToday: 3.4,
  },
];

export const shifts: ShiftRecord[] = [
  {
    id: "shift-a",
    name: "Shift A",
    lead: "Aarav Patel",
    window: "06:00 - 14:00",
    status: "Active",
  },
  {
    id: "shift-b",
    name: "Shift B",
    lead: "Ritu G.",
    window: "14:00 - 22:00",
    status: "Upcoming",
  },
];

export const laborEntries: LaborEntry[] = [
  {
    id: "lab-01",
    employeeName: "Neha S.",
    orderCode: "PO-1008",
    hours: 5.2,
    shiftName: "Shift A",
    efficiency: "97%",
  },
  {
    id: "lab-02",
    employeeName: "Riya M.",
    orderCode: "PO-1015",
    hours: 4.4,
    shiftName: "Shift A",
    efficiency: "89%",
  },
];

export const productionEvents: ProductionEventRecord[] = [
  {
    id: "evt-01",
    orderCode: "PO-1008",
    eventType: "Scan",
    note: "Material lots RM-AL-19420 and RM-SEAL-7702 scanned into cell.",
    actorName: "Neha S.",
    happenedAt: "2026-03-14T08:14:00+05:30",
  },
  {
    id: "evt-02",
    orderCode: "PO-1008",
    eventType: "Progress",
    note: "332 units completed after pressure test pass.",
    actorName: "Neha S.",
    happenedAt: "2026-03-14T10:15:00+05:30",
  },
  {
    id: "evt-03",
    orderCode: "PO-1015",
    eventType: "Hold",
    note: "Supplier deviation triggered material hold and line stop.",
    actorName: "Ishita D.",
    happenedAt: "2026-03-14T09:48:00+05:30",
  },
];

export const schedules: ScheduleItem[] = [
  {
    id: "sch-01",
    workCenter: "CNC Line 3",
    orderCode: "PO-1008",
    slotStart: "2026-03-14T08:00:00+05:30",
    slotEnd: "2026-03-14T16:30:00+05:30",
    status: "Locked",
  },
  {
    id: "sch-02",
    workCenter: "Machining Cell 2",
    orderCode: "PO-1012",
    slotStart: "2026-03-14T12:30:00+05:30",
    slotEnd: "2026-03-15T08:00:00+05:30",
    status: "At Risk",
  },
  {
    id: "sch-03",
    workCenter: "Assembly Pod 1",
    orderCode: "PO-1015",
    slotStart: "2026-03-14T07:30:00+05:30",
    slotEnd: "2026-03-14T14:00:00+05:30",
    status: "Planned",
  },
];

export const boms: BomRecord[] = [
  {
    id: "bom-01",
    itemName: "ABS Brake Valve Assembly",
    version: "v5.2",
    type: "BOM",
    components: ["Aluminum housing billet", "Nitrile seal kit", "Valve spring pack"],
    effectiveDate: "2026-03-01",
  },
  {
    id: "bom-02",
    itemName: "Hydraulic Pump Housing",
    version: "v2.4",
    type: "Recipe",
    components: ["Steel blank 18 mm", "Coolant profile C", "Heat treatment program 7"],
    effectiveDate: "2026-02-22",
  },
];

export const documents: DocumentRecord[] = [
  {
    id: "doc-01",
    title: "PPAP Approval Pack",
    category: "Compliance",
    owner: "Quality Lead",
    status: "Approved",
    updatedAt: "2026-03-13T18:30:00+05:30",
  },
  {
    id: "doc-02",
    title: "Torque Spec Sheet",
    category: "Work Instruction",
    owner: "Manufacturing Engineer",
    status: "Approved",
    updatedAt: "2026-03-12T11:05:00+05:30",
  },
  {
    id: "doc-03",
    title: "Calibration Certificate",
    category: "Equipment",
    owner: "Maintenance Lead",
    status: "Draft",
    updatedAt: "2026-03-14T07:40:00+05:30",
  },
];

export const auditLogs: AuditLogRecord[] = [
  {
    id: "audit-01",
    module: "Quality",
    action: "Non-conformance updated",
    actor: "Ishita D.",
    timestamp: "2026-03-14T10:04:00+05:30",
    note: "Containment action logged for PO-1015 deviation.",
  },
  {
    id: "audit-02",
    module: "Scheduling",
    action: "Schedule slot moved",
    actor: "Krunal P.",
    timestamp: "2026-03-14T09:32:00+05:30",
    note: "PO-1012 slot moved after tooling readiness delay.",
  },
  {
    id: "audit-03",
    module: "ERP Sync",
    action: "Connector retry succeeded",
    actor: "System",
    timestamp: "2026-03-14T10:20:00+05:30",
    note: "SAP B1 outbound batch posted after automatic retry.",
  },
];

export const platformHighlights: HighlightItem[] = [
  {
    title: "Production command center",
    description:
      "Track active orders, line ownership, output, and blockers from a single execution dashboard.",
    icon: Activity,
  },
  {
    title: "Digital work instructions",
    description:
      "Guide operators with revision-controlled steps, safety notes, and station-specific procedures.",
    icon: ClipboardCheck,
  },
  {
    title: "Quality and CAPA",
    description:
      "Record pass-fail checks inline, flag non-conformances fast, and keep audit-ready visibility.",
    icon: ScanLine,
  },
  {
    title: "Material traceability",
    description:
      "Show genealogy from supplier lot through finished goods to support recalls and customer audits.",
    icon: Boxes,
  },
];
