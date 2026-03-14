import { cookies } from "next/headers";
import {
  alerts as baseAlerts,
  auditLogs as baseAuditLogs,
  boms as baseBoms,
  documents as baseDocuments,
  employees as baseEmployees,
  equipment as baseEquipment,
  inventoryItems as baseInventoryItems,
  laborEntries as baseLaborEntries,
  materialLots as baseMaterialLots,
  nonConformances as baseNonConformances,
  productionEvents as baseProductionEvents,
  productionOrders as baseProductionOrders,
  qualityChecks as baseQualityChecks,
  reports as baseReports,
  schedules as baseSchedules,
  shifts as baseShifts,
  syncLogs as baseSyncLogs,
  workCenters as baseWorkCenters,
  workInstructions as baseWorkInstructions,
} from "@/lib/demo-data";
import type {
  AlertItem,
  AuditLogRecord,
  BomRecord,
  DocumentRecord,
  Employee,
  Equipment,
  InventoryItem,
  LaborEntry,
  MaterialLot,
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

type DemoCookieCollections = {
  alerts: AlertItem[];
  auditLogs: AuditLogRecord[];
  boms: BomRecord[];
  documents: DocumentRecord[];
  employees: Employee[];
  equipment: Equipment[];
  inventoryItems: InventoryItem[];
  laborEntries: LaborEntry[];
  materialLots: MaterialLot[];
  nonConformances: NonConformance[];
  productionEvents: ProductionEventRecord[];
  productionOrders: ProductionOrder[];
  qualityChecks: QualityCheck[];
  reports: ReportItem[];
  schedules: ScheduleItem[];
  shifts: ShiftRecord[];
  syncLogs: SyncLog[];
  workCenters: WorkCenter[];
  workInstructions: WorkInstruction[];
};

export type DemoCollectionKey = keyof DemoCookieCollections;

type DemoState = DemoCookieCollections & {
  deletedOrderCodes: string[];
  deletedOrderIds: string[];
  orderStatusOverrides: Record<string, ProductionOrder["status"]>;
};

const cookieKeys: Record<
  DemoCollectionKey | "deletedOrderCodes" | "deletedOrderIds" | "orderStatusOverrides",
  string
> = {
  alerts: "ff_demo_alerts",
  auditLogs: "ff_demo_audit",
  boms: "ff_demo_boms",
  deletedOrderCodes: "ff_demo_deleted_order_codes",
  deletedOrderIds: "ff_demo_deleted_order_ids",
  documents: "ff_demo_docs",
  employees: "ff_demo_emps",
  equipment: "ff_demo_eq",
  inventoryItems: "ff_demo_inv",
  laborEntries: "ff_demo_labor",
  materialLots: "ff_demo_lots",
  nonConformances: "ff_demo_nc",
  orderStatusOverrides: "ff_demo_status",
  productionEvents: "ff_demo_events",
  productionOrders: "ff_demo_orders",
  qualityChecks: "ff_demo_qc",
  reports: "ff_demo_reports",
  schedules: "ff_demo_sched",
  shifts: "ff_demo_shifts",
  syncLogs: "ff_demo_sync",
  workCenters: "ff_demo_wc",
  workInstructions: "ff_demo_wi",
};

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 14,
  path: "/",
  sameSite: "lax" as const,
};

const maxRecordsPerCollection = 12;

function encodeCookieValue(value: unknown) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeCookieValue<T>(value: string | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return fallback;
  }
}

function mergeRecords<T extends { id: string }>(baseRecords: T[], extraRecords: T[]) {
  const extraIds = new Set(extraRecords.map((record) => record.id));
  return [...extraRecords, ...baseRecords.filter((record) => !extraIds.has(record.id))];
}

function applyOrderStatusOverrides(
  orders: ProductionOrder[],
  overrides: Record<string, ProductionOrder["status"]>,
) {
  return orders.map((order) =>
    overrides[order.id]
      ? {
          ...order,
          status: overrides[order.id],
        }
      : order,
  );
}

function filterDeletedOrderLinkedRecords<T>(
  records: T[],
  deletedOrderCodes: string[],
  getOrderCode: (record: T) => string,
) {
  if (deletedOrderCodes.length === 0) {
    return records;
  }

  const deletedCodes = new Set(deletedOrderCodes);
  return records.filter((record) => !deletedCodes.has(getOrderCode(record)));
}

async function readCollection<Key extends DemoCollectionKey>(
  key: Key,
): Promise<DemoCookieCollections[Key]> {
  const cookieStore = await cookies();
  return decodeCookieValue(cookieStore.get(cookieKeys[key])?.value, []);
}

async function writeCollection<Key extends DemoCollectionKey>(
  key: Key,
  records: DemoCookieCollections[Key],
) {
  const cookieStore = await cookies();
  cookieStore.set(
    cookieKeys[key],
    encodeCookieValue(records.slice(0, maxRecordsPerCollection)),
    cookieOptions,
  );
}

async function readOrderStatusOverrides() {
  const cookieStore = await cookies();
  return decodeCookieValue<Record<string, ProductionOrder["status"]>>(
    cookieStore.get(cookieKeys.orderStatusOverrides)?.value,
    {},
  );
}

async function readDeletedOrderIds() {
  const cookieStore = await cookies();
  return decodeCookieValue<string[]>(cookieStore.get(cookieKeys.deletedOrderIds)?.value, []);
}

async function writeDeletedOrderIds(ids: string[]) {
  const cookieStore = await cookies();
  cookieStore.set(cookieKeys.deletedOrderIds, encodeCookieValue(ids), cookieOptions);
}

async function readDeletedOrderCodes() {
  const cookieStore = await cookies();
  return decodeCookieValue<string[]>(cookieStore.get(cookieKeys.deletedOrderCodes)?.value, []);
}

async function writeDeletedOrderCodes(codes: string[]) {
  const cookieStore = await cookies();
  cookieStore.set(cookieKeys.deletedOrderCodes, encodeCookieValue(codes), cookieOptions);
}

async function writeOrderStatusOverrides(overrides: Record<string, ProductionOrder["status"]>) {
  const cookieStore = await cookies();
  cookieStore.set(
    cookieKeys.orderStatusOverrides,
    encodeCookieValue(overrides),
    cookieOptions,
  );
}

export async function getDemoState(): Promise<DemoState> {
  const [
    alerts,
    auditLogs,
    boms,
    documents,
    employees,
    equipment,
    inventoryItems,
    laborEntries,
    materialLots,
    nonConformances,
    deletedOrderCodes,
    deletedOrderIds,
    orderStatusOverrides,
    productionEvents,
    productionOrders,
    qualityChecks,
    reports,
    schedules,
    shifts,
    syncLogs,
    workCenters,
    workInstructions,
  ] = await Promise.all([
    readCollection("alerts"),
    readCollection("auditLogs"),
    readCollection("boms"),
    readCollection("documents"),
    readCollection("employees"),
    readCollection("equipment"),
    readCollection("inventoryItems"),
    readCollection("laborEntries"),
    readCollection("materialLots"),
    readCollection("nonConformances"),
    readDeletedOrderCodes(),
    readDeletedOrderIds(),
    readOrderStatusOverrides(),
    readCollection("productionEvents"),
    readCollection("productionOrders"),
    readCollection("qualityChecks"),
    readCollection("reports"),
    readCollection("schedules"),
    readCollection("shifts"),
    readCollection("syncLogs"),
    readCollection("workCenters"),
    readCollection("workInstructions"),
  ]);

  const deletedIds = new Set(deletedOrderIds);
  const visibleOrders = applyOrderStatusOverrides(
    mergeRecords(baseProductionOrders, productionOrders),
    orderStatusOverrides,
  ).filter((order) => !deletedIds.has(order.id) && !deletedOrderCodes.includes(order.code));

  return {
    alerts: mergeRecords(baseAlerts, alerts),
    auditLogs: mergeRecords(baseAuditLogs, auditLogs),
    boms: mergeRecords(baseBoms, boms),
    deletedOrderCodes,
    deletedOrderIds,
    documents: mergeRecords(baseDocuments, documents),
    employees: mergeRecords(baseEmployees, employees),
    equipment: mergeRecords(baseEquipment, equipment),
    inventoryItems: mergeRecords(baseInventoryItems, inventoryItems),
    laborEntries: filterDeletedOrderLinkedRecords(
      mergeRecords(baseLaborEntries, laborEntries),
      deletedOrderCodes,
      (entry) => entry.orderCode,
    ),
    materialLots: filterDeletedOrderLinkedRecords(
      mergeRecords(baseMaterialLots, materialLots),
      deletedOrderCodes,
      (lot) => lot.linkedOrder,
    ),
    nonConformances: filterDeletedOrderLinkedRecords(
      mergeRecords(baseNonConformances, nonConformances),
      deletedOrderCodes,
      (record) => record.sourceOrderCode,
    ),
    orderStatusOverrides,
    productionEvents: filterDeletedOrderLinkedRecords(
      mergeRecords(baseProductionEvents, productionEvents),
      deletedOrderCodes,
      (event) => event.orderCode,
    ),
    productionOrders: visibleOrders,
    qualityChecks: filterDeletedOrderLinkedRecords(
      mergeRecords(baseQualityChecks, qualityChecks),
      deletedOrderCodes,
      (check) => check.orderCode,
    ),
    reports: mergeRecords(baseReports, reports),
    schedules: filterDeletedOrderLinkedRecords(
      mergeRecords(baseSchedules, schedules),
      deletedOrderCodes,
      (schedule) => schedule.orderCode,
    ),
    shifts: mergeRecords(baseShifts, shifts),
    syncLogs: mergeRecords(baseSyncLogs, syncLogs),
    workCenters: mergeRecords(baseWorkCenters, workCenters),
    workInstructions: mergeRecords(baseWorkInstructions, workInstructions),
  };
}

export async function appendDemoRecord<Key extends DemoCollectionKey>(
  key: Key,
  record: DemoCookieCollections[Key][number],
) {
  const records = await readCollection(key);
  await writeCollection(key, [record, ...records] as DemoCookieCollections[Key]);
}

export async function setDemoOrderStatus(id: string, status: ProductionOrder["status"]) {
  const overrides = await readOrderStatusOverrides();
  overrides[id] = status;
  await writeOrderStatusOverrides(overrides);
}

export async function removeDemoProductionOrder(id: string, code: string) {
  await Promise.all([
    writeCollection(
      "productionOrders",
      (await readCollection("productionOrders")).filter(
        (order) => order.id !== id && order.code !== code,
      ),
    ),
    writeCollection(
      "qualityChecks",
      (await readCollection("qualityChecks")).filter((check) => check.orderCode !== code),
    ),
    writeCollection(
      "nonConformances",
      (await readCollection("nonConformances")).filter((record) => record.sourceOrderCode !== code),
    ),
    writeCollection(
      "materialLots",
      (await readCollection("materialLots")).filter((lot) => lot.linkedOrder !== code),
    ),
    writeCollection(
      "productionEvents",
      (await readCollection("productionEvents")).filter((event) => event.orderCode !== code),
    ),
    writeCollection(
      "laborEntries",
      (await readCollection("laborEntries")).filter((entry) => entry.orderCode !== code),
    ),
    writeCollection(
      "schedules",
      (await readCollection("schedules")).filter((schedule) => schedule.orderCode !== code),
    ),
  ]);

  const deletedIds = await readDeletedOrderIds();
  const deletedCodes = await readDeletedOrderCodes();
  const overrides = await readOrderStatusOverrides();

  if (!deletedIds.includes(id)) {
    deletedIds.unshift(id);
  }

  if (!deletedCodes.includes(code)) {
    deletedCodes.unshift(code);
  }

  delete overrides[id];

  await Promise.all([
    writeDeletedOrderIds(deletedIds.slice(0, maxRecordsPerCollection * 2)),
    writeDeletedOrderCodes(deletedCodes.slice(0, maxRecordsPerCollection * 2)),
    writeOrderStatusOverrides(overrides),
  ]);
}
