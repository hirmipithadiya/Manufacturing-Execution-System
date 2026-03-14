import type { SupabaseClient } from "@supabase/supabase-js";
import { getDemoState } from "@/lib/demo-state";
import {
  alerts as demoAlerts,
  auditLogs as demoAuditLogs,
  boms as demoBoms,
  dashboardMetrics as demoDashboardMetrics,
  documents as demoDocuments,
  employees as demoEmployees,
  equipment as demoEquipment,
  inventoryItems as demoInventoryItems,
  laborEntries as demoLaborEntries,
  materialLots as demoMaterialLots,
  nonConformances as demoNonConformances,
  productionEvents as demoProductionEvents,
  productionOrders as demoProductionOrders,
  reports as demoReports,
  schedules as demoSchedules,
  shifts as demoShifts,
  syncLogs as demoSyncLogs,
  qualityChecks as demoQualityChecks,
  workCenters as demoWorkCenters,
  workInstructions as demoWorkInstructions,
} from "@/lib/demo-data";
import type {
  AlertItem,
  AuditLogRecord,
  BomRecord,
  DashboardData,
  DataSource,
  DocumentRecord,
  Employee,
  Equipment,
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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { isSupabaseAppReady } from "@/lib/supabase/runtime";

type MesContext = {
  source: DataSource;
  organizationId: string | null;
  supabase: SupabaseClient | null;
};

type DashboardMetricBundle = {
  metrics: Metric[];
  alerts: AlertItem[];
};

async function getMesContext(): Promise<MesContext> {
  if (!hasSupabaseEnv) {
    return {
      source: "demo",
      organizationId: "demo-org",
      supabase: null,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      source: "demo",
      organizationId: "demo-org",
      supabase: null,
    };
  }

  if (!(await isSupabaseAppReady(supabase))) {
    return {
      source: "demo",
      organizationId: "demo-org",
      supabase: null,
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      source: "demo",
      organizationId: "demo-org",
      supabase: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.organization_id) {
    return {
      source: "demo",
      organizationId: "demo-org",
      supabase: null,
    };
  }

  return {
    source: "supabase",
    organizationId: profile?.organization_id ?? null,
    supabase,
  };
}

function mapProductionOrder(row: Record<string, unknown>): ProductionOrder {
  return {
    id: String(row.id),
    code: String(row.code),
    itemName: String(row.item_name),
    customer: String(row.customer_name),
    workCenter: String(row.work_center),
    operator: String(row.operator_name),
    status: String(row.status) as ProductionOrder["status"],
    priority: String(row.priority) as ProductionOrder["priority"],
    plannedQty: Number(row.planned_qty ?? 0),
    completedQty: Number(row.completed_qty ?? 0),
    scrapQty: Number(row.scrap_qty ?? 0),
    scheduledStart: String(row.scheduled_start),
    dueDate: String(row.due_date),
    lotNumber: String(row.lot_number),
  };
}

function mapWorkInstruction(row: Record<string, unknown>): WorkInstruction {
  return {
    id: String(row.id),
    title: String(row.title),
    version: String(row.version),
    station: String(row.station),
    updatedAt: String(row.updated_at ?? row.published_at),
    steps: Array.isArray(row.steps) ? row.steps.map(String) : [],
    safetyNotes: Array.isArray(row.safety_notes) ? row.safety_notes.map(String) : [],
  };
}

function mapQualityCheck(row: Record<string, unknown>): QualityCheck {
  return {
    id: String(row.id),
    orderCode: String(row.order_code),
    checkpoint: String(row.checkpoint),
    result: String(row.result) as QualityCheck["result"],
    inspector: String(row.inspector_name),
    timestamp: String(row.checked_at),
    note: String(row.note),
  };
}

function mapNonConformance(row: Record<string, unknown>): NonConformance {
  return {
    id: String(row.id),
    title: String(row.title),
    severity: String(row.severity) as NonConformance["severity"],
    status: String(row.status) as NonConformance["status"],
    sourceOrderCode: String(row.source_order_code),
    rootCause: String(row.root_cause ?? ""),
    correctiveAction: String(row.corrective_action ?? ""),
  };
}

function mapMaterialLot(row: Record<string, unknown>): MaterialLot {
  return {
    id: String(row.id),
    code: String(row.code),
    material: String(row.material_name),
    supplier: String(row.supplier_name),
    status: String(row.status) as MaterialLot["status"],
    quantity: String(row.quantity),
    linkedOrder: String(row.linked_order_code),
    genealogy: Array.isArray(row.genealogy) ? row.genealogy.map(String) : [],
  };
}

function mapInventoryItem(row: Record<string, unknown>): InventoryItem {
  return {
    id: String(row.id),
    item: String(row.item_name),
    sku: String(row.sku),
    onHand: Number(row.on_hand ?? 0),
    reorderPoint: Number(row.reorder_point ?? 0),
    location: String(row.location),
    status: String(row.status) as InventoryItem["status"],
  };
}

function mapSyncLog(row: Record<string, unknown>): SyncLog {
  return {
    id: String(row.id),
    system: String(row.system_name),
    direction: String(row.direction) as SyncLog["direction"],
    status: String(row.status) as SyncLog["status"],
    lastRun: String(row.last_run),
    records: Number(row.records_count ?? 0),
  };
}

function mapAlert(row: Record<string, unknown>): AlertItem {
  return {
    id: String(row.id),
    title: String(row.title),
    detail: String(row.detail),
    severity: String(row.severity) as AlertItem["severity"],
    timestamp: String(row.event_time),
  };
}

function mapReport(row: Record<string, unknown>): ReportItem {
  return {
    id: String(row.id),
    name: String(row.name),
    period: String(row.period),
    owner: String(row.owner_name),
    lastGenerated: String(row.generated_at),
  };
}

function mapWorkCenter(row: Record<string, unknown>): WorkCenter {
  return {
    id: String(row.id),
    name: String(row.name),
    status: String(row.status) as WorkCenter["status"],
    capacity: `${Number(row.capacity_percent ?? 0)}%`,
    shift: String(row.shift_name),
  };
}

function mapEquipment(row: Record<string, unknown>): Equipment {
  return {
    id: String(row.id),
    name: String(row.name),
    area: String(row.area),
    status: String(row.status) as Equipment["status"],
    nextMaintenance: String(row.next_maintenance_date),
    utilization: `${Number(row.utilization_percent ?? 0)}%`,
  };
}

function mapEmployee(row: Record<string, unknown>): Employee {
  return {
    id: String(row.id),
    name: String(row.name),
    role: String(row.role_name),
    shift: String(row.shift_name),
    skill: String(row.primary_skill),
    hoursToday: Number(row.hours_today ?? 0),
  };
}

function mapShift(row: Record<string, unknown>): ShiftRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    lead: String(row.lead_name),
    window: String(row.window_label),
    status: String(row.status) as ShiftRecord["status"],
  };
}

function mapLaborEntry(row: Record<string, unknown>): LaborEntry {
  return {
    id: String(row.id),
    employeeName: String(row.employee_name),
    orderCode: String(row.order_code),
    hours: Number(row.hours_worked ?? 0),
    shiftName: String(row.shift_name),
    efficiency: `${Number(row.efficiency_percent ?? 0)}%`,
  };
}

function mapProductionEvent(row: Record<string, unknown>): ProductionEventRecord {
  return {
    id: String(row.id),
    orderCode: String(row.order_code),
    eventType: String(row.event_type),
    note: String(row.event_note),
    actorName: String(row.actor_name),
    happenedAt: String(row.happened_at),
  };
}

function mapSchedule(row: Record<string, unknown>): ScheduleItem {
  return {
    id: String(row.id),
    workCenter: String(row.work_center),
    orderCode: String(row.order_code),
    slotStart: String(row.slot_start),
    slotEnd: String(row.slot_end),
    status: String(row.status) as ScheduleItem["status"],
  };
}

function mapBom(row: Record<string, unknown>): BomRecord {
  return {
    id: String(row.id),
    itemName: String(row.item_name),
    version: String(row.version),
    type: String(row.record_type) as BomRecord["type"],
    components: Array.isArray(row.components) ? row.components.map(String) : [],
    effectiveDate: String(row.effective_date),
  };
}

function mapDocument(row: Record<string, unknown>): DocumentRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    owner: String(row.owner_name),
    status: String(row.status) as DocumentRecord["status"],
    updatedAt: String(row.updated_at),
  };
}

function mapAuditLog(row: Record<string, unknown>): AuditLogRecord {
  return {
    id: String(row.id),
    module: String(row.module_name),
    action: String(row.action_name),
    actor: String(row.actor_name),
    timestamp: String(row.happened_at),
    note: String(row.note),
  };
}

async function selectMany<T>(
  context: MesContext,
  table: string,
  fallback: T[],
  mapper: (row: Record<string, unknown>) => T,
  orderBy: string,
  ascending = false,
): Promise<T[]> {
  if (context.source === "demo" || !context.supabase || !context.organizationId) {
    return fallback;
  }

  const { data, error } = await context.supabase
    .from(table)
    .select("*")
    .order(orderBy, { ascending });

  if (error || !data) {
    return fallback;
  }

  return data.map((row) => mapper(row as Record<string, unknown>));
}

function buildMetricsFromOrders(orders: ProductionOrder[]): Metric[] {
  if (orders.length === 0) {
    return [
      { label: "OEE", value: "0.0%", change: "+0.0%" },
      { label: "First Pass Yield", value: "0.0%", change: "+0.0%" },
      { label: "Throughput", value: "0 units", change: "+0.0%" },
      { label: "Schedule Adherence", value: "0.0%", change: "+0.0%" },
      { label: "Defect Rate", value: "0.0%", change: "+0.0%", inverse: true },
    ];
  }

  const totals = orders.reduce(
    (accumulator, order) => {
      accumulator.planned += order.plannedQty;
      accumulator.completed += order.completedQty;
      accumulator.scrap += order.scrapQty;
      if (new Date(order.dueDate).getTime() >= new Date(order.scheduledStart).getTime()) {
        accumulator.onTime += 1;
      }
      return accumulator;
    },
    {
      planned: 0,
      completed: 0,
      scrap: 0,
      onTime: 0,
    },
  );

  const oee = totals.planned ? (totals.completed / totals.planned) * 100 : 0;
  const yieldRate = totals.completed ? ((totals.completed - totals.scrap) / totals.completed) * 100 : 0;
  const defectRate = totals.planned ? (totals.scrap / totals.planned) * 100 : 0;
  const adherence = orders.length ? (totals.onTime / orders.length) * 100 : 0;

  return [
    { label: "OEE", value: `${oee.toFixed(1)}%`, change: "+0.0%" },
    { label: "First Pass Yield", value: `${yieldRate.toFixed(1)}%`, change: "+0.0%" },
    { label: "Throughput", value: `${totals.completed.toLocaleString()} units`, change: "+0.0%" },
    { label: "Schedule Adherence", value: `${adherence.toFixed(1)}%`, change: "+0.0%" },
    { label: "Defect Rate", value: `${defectRate.toFixed(1)}%`, change: "+0.0%", inverse: true },
  ];
}

export async function getDashboardData(): Promise<DashboardData> {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();
    const metrics = buildMetricsFromOrders(demoState.productionOrders);

    return {
      source: "demo",
      metrics,
      orders: demoState.productionOrders,
      alerts: demoState.alerts,
      qualityChecks: demoState.qualityChecks,
      materialLots: demoState.materialLots,
      reports: demoState.reports,
    };
  }

  const [orders, quality, lots, alerts, reports] = await Promise.all([
    selectMany(context, "production_orders", demoProductionOrders, mapProductionOrder, "scheduled_start", true),
    selectMany(context, "quality_checks", demoQualityChecks, mapQualityCheck, "checked_at"),
    selectMany(context, "material_lots", demoMaterialLots, mapMaterialLot, "created_at"),
    selectMany(context, "alerts", demoAlerts, mapAlert, "event_time"),
    selectMany(context, "report_snapshots", demoReports, mapReport, "generated_at"),
  ]);

  const metrics = buildMetricsFromOrders(orders);

  return {
    source: context.source,
    metrics,
    orders,
    alerts,
    qualityChecks: quality,
    materialLots: lots,
    reports,
  };
}

export async function getProductionOrdersData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      orders: demoState.productionOrders,
      schedules: demoState.schedules,
    };
  }

  const [orders, schedulesData] = await Promise.all([
    selectMany(context, "production_orders", demoProductionOrders, mapProductionOrder, "scheduled_start", true),
    selectMany(context, "schedules", demoSchedules, mapSchedule, "slot_start", true),
  ]);

  return {
    source: context.source,
    orders,
    schedules: schedulesData,
  };
}

export async function getWorkInstructionsData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      instructions: demoState.workInstructions,
    };
  }

  const instructions = await selectMany(
    context,
    "work_instructions",
    demoWorkInstructions,
    mapWorkInstruction,
    "updated_at",
  );

  return {
    source: context.source,
    instructions,
  };
}

export async function getQualityData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      checks: demoState.qualityChecks,
      nonConformanceRecords: demoState.nonConformances,
    };
  }

  const [checks, nonConformanceRecords] = await Promise.all([
    selectMany(context, "quality_checks", demoQualityChecks, mapQualityCheck, "checked_at"),
    selectMany(context, "non_conformances", demoNonConformances, mapNonConformance, "updated_at"),
  ]);

  return {
    source: context.source,
    checks,
    nonConformanceRecords,
  };
}

export async function getTraceabilityData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      orders: demoState.productionOrders,
      lots: demoState.materialLots,
    };
  }

  const [orders, lots] = await Promise.all([
    selectMany(context, "production_orders", demoProductionOrders, mapProductionOrder, "scheduled_start", true),
    selectMany(context, "material_lots", demoMaterialLots, mapMaterialLot, "created_at"),
  ]);

  return {
    source: context.source,
    orders,
    lots,
  };
}

export async function getInventoryData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      items: demoState.inventoryItems,
    };
  }

  const items = await selectMany(context, "inventory_items", demoInventoryItems, mapInventoryItem, "created_at");

  return {
    source: context.source,
    items,
  };
}

export async function getErpSyncData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      logs: demoState.syncLogs,
    };
  }

  const logs = await selectMany(context, "erp_sync_logs", demoSyncLogs, mapSyncLog, "last_run");

  return {
    source: context.source,
    logs,
  };
}

export async function getReportsData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      reports: demoState.reports,
    };
  }

  const reports = await selectMany(context, "report_snapshots", demoReports, mapReport, "generated_at");

  return {
    source: context.source,
    reports,
  };
}

export async function getOperationsData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      centers: demoState.workCenters,
      machines: demoState.equipment,
      people: demoState.employees,
      shiftData: demoState.shifts,
      laborData: demoState.laborEntries,
      eventData: demoState.productionEvents,
    };
  }

  const [centers, machines, people, shiftData, laborData, eventData] = await Promise.all([
    selectMany(context, "work_centers", demoWorkCenters, mapWorkCenter, "name", true),
    selectMany(context, "equipment", demoEquipment, mapEquipment, "name", true),
    selectMany(context, "employees", demoEmployees, mapEmployee, "name", true),
    selectMany(context, "shifts", demoShifts, mapShift, "name", true),
    selectMany(context, "labor_entries", demoLaborEntries, mapLaborEntry, "created_at"),
    selectMany(context, "production_events", demoProductionEvents, mapProductionEvent, "happened_at"),
  ]);

  return {
    source: context.source,
    centers,
    machines,
    people,
    shiftData,
    laborData,
    eventData,
  };
}

export async function getPlanningData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      scheduleData: demoState.schedules,
      bomData: demoState.boms,
    };
  }

  const [scheduleData, bomData] = await Promise.all([
    selectMany(context, "schedules", demoSchedules, mapSchedule, "slot_start", true),
    selectMany(context, "bom_records", demoBoms, mapBom, "effective_date"),
  ]);

  return {
    source: context.source,
    scheduleData,
    bomData,
  };
}

export async function getComplianceData() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      documentData: demoState.documents,
      auditData: demoState.auditLogs,
    };
  }

  const [documentData, auditData] = await Promise.all([
    selectMany(context, "documents", demoDocuments, mapDocument, "updated_at"),
    selectMany(context, "audit_logs", demoAuditLogs, mapAuditLog, "happened_at"),
  ]);

  return {
    source: context.source,
    documentData,
    auditData,
  };
}

export async function getWorkspaceSnapshot() {
  const context = await getMesContext();

  if (context.source === "demo") {
    const demoState = await getDemoState();

    return {
      source: "demo" as const,
      metrics: buildMetricsFromOrders(demoState.productionOrders),
      orders: demoState.productionOrders,
      reports: demoState.reports,
      alerts: demoState.alerts,
      checks: demoState.qualityChecks,
    };
  }

  const [orders, reports, alerts, checks] = await Promise.all([
    selectMany(context, "production_orders", demoProductionOrders, mapProductionOrder, "scheduled_start", true),
    selectMany(context, "report_snapshots", demoReports, mapReport, "generated_at"),
    selectMany(context, "alerts", demoAlerts, mapAlert, "event_time"),
    selectMany(context, "quality_checks", demoQualityChecks, mapQualityCheck, "checked_at"),
  ]);

  return {
    source: context.source,
    metrics: buildMetricsFromOrders(orders),
    orders,
    reports,
    alerts,
    checks,
  };
}

export function getDemoOperationsFallback() {
  return {
    centers: demoWorkCenters,
    machines: demoEquipment,
    people: demoEmployees,
    shiftData: demoShifts,
    laborData: demoLaborEntries,
    eventData: demoProductionEvents,
  };
}

export function getDemoPlanningFallback() {
  return {
    scheduleData: demoSchedules,
    bomData: demoBoms,
  };
}

export function getDemoComplianceFallback() {
  return {
    documentData: demoDocuments,
    auditData: demoAuditLogs,
  };
}

export function getDashboardMetricBundle(): DashboardMetricBundle {
  return {
    metrics: demoDashboardMetrics,
    alerts: demoAlerts,
  };
}
