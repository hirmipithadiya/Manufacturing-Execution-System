import type { LucideIcon } from "lucide-react";

export type DataSource = "demo" | "supabase";
export type UserRole = "Admin" | "Planner" | "Operator" | "Quality Inspector" | "Manager";
export type OrderStatus = "Scheduled" | "In Progress" | "Blocked" | "Completed";

export interface DemoUser {
  name: string;
  email: string;
  role: UserRole;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  inverse?: boolean;
}

export interface ProductionOrder {
  id: string;
  code: string;
  itemName: string;
  customer: string;
  workCenter: string;
  operator: string;
  status: OrderStatus;
  priority: "High" | "Medium" | "Low";
  plannedQty: number;
  completedQty: number;
  scrapQty: number;
  scheduledStart: string;
  dueDate: string;
  lotNumber: string;
}

export interface WorkInstruction {
  id: string;
  title: string;
  version: string;
  station: string;
  updatedAt: string;
  steps: string[];
  safetyNotes: string[];
}

export interface QualityCheck {
  id: string;
  orderCode: string;
  checkpoint: string;
  result: "Pass" | "Fail" | "Monitor";
  inspector: string;
  timestamp: string;
  note: string;
}

export interface NonConformance {
  id: string;
  title: string;
  severity: "Minor" | "Major" | "Critical";
  status: "Open" | "Contained" | "Closed";
  sourceOrderCode: string;
  rootCause: string;
  correctiveAction: string;
}

export interface MaterialLot {
  id: string;
  code: string;
  material: string;
  supplier: string;
  status: "Released" | "Hold" | "Consumed";
  quantity: string;
  linkedOrder: string;
  genealogy: string[];
}

export interface InventoryItem {
  id: string;
  item: string;
  sku: string;
  onHand: number;
  reorderPoint: number;
  location: string;
  status: "Healthy" | "Low" | "Critical";
}

export interface SyncLog {
  id: string;
  system: string;
  direction: "Inbound" | "Outbound";
  status: "Healthy" | "Retrying" | "Failed";
  lastRun: string;
  records: number;
}

export interface AlertItem {
  id: string;
  title: string;
  detail: string;
  severity: "Info" | "Warning" | "Critical";
  timestamp: string;
}

export interface ReportItem {
  id: string;
  name: string;
  period: string;
  owner: string;
  lastGenerated: string;
}

export interface WorkCenter {
  id: string;
  name: string;
  status: "Running" | "Constrained" | "Idle";
  capacity: string;
  shift: string;
}

export interface Equipment {
  id: string;
  name: string;
  area: string;
  status: "Available" | "Maintenance" | "Downtime";
  nextMaintenance: string;
  utilization: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  shift: string;
  skill: string;
  hoursToday: number;
}

export interface ShiftRecord {
  id: string;
  name: string;
  lead: string;
  window: string;
  status: "Active" | "Upcoming" | "Closed";
}

export interface LaborEntry {
  id: string;
  employeeName: string;
  orderCode: string;
  hours: number;
  shiftName: string;
  efficiency: string;
}

export interface ProductionEventRecord {
  id: string;
  orderCode: string;
  eventType: string;
  note: string;
  actorName: string;
  happenedAt: string;
}

export interface ScheduleItem {
  id: string;
  workCenter: string;
  orderCode: string;
  slotStart: string;
  slotEnd: string;
  status: "Locked" | "Planned" | "At Risk";
}

export interface BomRecord {
  id: string;
  itemName: string;
  version: string;
  type: "BOM" | "Recipe";
  components: string[];
  effectiveDate: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: string;
  owner: string;
  status: "Approved" | "Draft" | "Expired";
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  module: string;
  action: string;
  actor: string;
  timestamp: string;
  note: string;
}

export interface HighlightItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface DashboardData {
  source: DataSource;
  metrics: Metric[];
  orders: ProductionOrder[];
  alerts: AlertItem[];
  qualityChecks: QualityCheck[];
  materialLots: MaterialLot[];
  reports: ReportItem[];
}
