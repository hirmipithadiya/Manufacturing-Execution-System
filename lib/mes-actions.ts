"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { appendDemoRecord, removeDemoProductionOrder, setDemoOrderStatus } from "@/lib/demo-state";
import { buildNoticeRedirectPath } from "@/lib/page-notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { isSupabaseAppReady, isSupabaseSchemaError } from "@/lib/supabase/runtime";

type MutationContext =
  | {
      mode: "demo";
    }
  | {
      mode: "supabase";
      supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
      organizationId: string;
    };

async function getMutationContext(): Promise<MutationContext> {
  if (!hasSupabaseEnv) {
    return {
      mode: "demo" as const,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      mode: "demo" as const,
    };
  }

  if (!(await isSupabaseAppReady(supabase))) {
    return {
      mode: "demo" as const,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      mode: "demo" as const,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.organization_id) {
    return {
      mode: "demo" as const,
    };
  }

  return {
    mode: "supabase" as const,
    supabase,
    organizationId: profile.organization_id,
  };
}

function splitLines(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumberValue(formData: FormData, key: string) {
  return Number(formData.get(key) ?? 0);
}

function revalidatePage(path: string) {
  revalidatePath(path);
  revalidatePath("/dashboard");
  revalidatePath("/operations");
  revalidatePath("/planning");
  revalidatePath("/compliance");
  revalidatePath("/reports");
}

function createDemoId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeActionError(message: string) {
  const loweredMessage = message.toLowerCase();

  if (
    loweredMessage.includes("row-level security") ||
    loweredMessage.includes("permission denied") ||
    loweredMessage.includes("jwt")
  ) {
    return "This action requires a connected signed-in workspace. Preview mode is still available.";
  }

  if (isSupabaseSchemaError(message)) {
    return "The connected database is not ready yet. Preview mode is still available.";
  }

  return message;
}

function redirectWithNotice(
  path: string,
  tone: "emerald" | "amber" | "rose",
  message: string,
): never {
  redirect(buildNoticeRedirectPath(path, { tone, message }));
}

function getCreateSuccessMessage(entity: string) {
  switch (entity) {
    case "production_order":
      return "Production order created.";
    case "work_instruction":
      return "Work instruction published.";
    case "quality_check":
      return "Quality check saved.";
    case "non_conformance":
      return "Non-conformance created.";
    case "material_lot":
      return "Material lot tracked.";
    case "inventory_item":
      return "Inventory item created.";
    case "erp_sync_log":
      return "ERP sync entry logged.";
    case "report_snapshot":
      return "Report snapshot created.";
    case "work_center":
      return "Work center created.";
    case "equipment":
      return "Equipment record created.";
    case "employee":
      return "Employee record created.";
    case "shift":
      return "Shift record created.";
    case "labor_entry":
      return "Labor entry saved.";
    case "production_event":
      return "Production event logged.";
    case "schedule":
      return "Schedule slot created.";
    case "bom_record":
      return "BOM or recipe saved.";
    case "document":
      return "Controlled document created.";
    case "audit_log":
      return "Audit event logged.";
    default:
      return "Record saved.";
  }
}

async function createDemoRecord(entity: string, formData: FormData) {
  switch (entity) {
    case "production_order":
      await appendDemoRecord("productionOrders", {
        id: createDemoId("po"),
        code: getValue(formData, "code"),
        itemName: getValue(formData, "itemName"),
        customer: getValue(formData, "customer"),
        workCenter: getValue(formData, "workCenter"),
        operator: getValue(formData, "operator"),
        status: (getValue(formData, "status") || "Scheduled") as
          | "Scheduled"
          | "In Progress"
          | "Blocked"
          | "Completed",
        priority: (getValue(formData, "priority") || "Medium") as "High" | "Medium" | "Low",
        plannedQty: getNumberValue(formData, "plannedQty"),
        completedQty: getNumberValue(formData, "completedQty"),
        scrapQty: getNumberValue(formData, "scrapQty"),
        lotNumber: getValue(formData, "lotNumber"),
        scheduledStart: getValue(formData, "scheduledStart"),
        dueDate: getValue(formData, "dueDate"),
      });
      return;
    case "work_instruction":
      await appendDemoRecord("workInstructions", {
        id: createDemoId("wi"),
        title: getValue(formData, "title"),
        version: getValue(formData, "version"),
        station: getValue(formData, "station"),
        steps: splitLines(formData.get("steps")),
        safetyNotes: splitLines(formData.get("safetyNotes")),
        updatedAt: new Date().toISOString(),
      });
      return;
    case "quality_check":
      await appendDemoRecord("qualityChecks", {
        id: createDemoId("qc"),
        orderCode: getValue(formData, "orderCode"),
        checkpoint: getValue(formData, "checkpoint"),
        result: (getValue(formData, "result") || "Monitor") as "Pass" | "Fail" | "Monitor",
        inspector: getValue(formData, "inspector"),
        timestamp: new Date().toISOString(),
        note: getValue(formData, "note"),
      });
      return;
    case "non_conformance":
      await appendDemoRecord("nonConformances", {
        id: createDemoId("nc"),
        title: getValue(formData, "title"),
        severity: (getValue(formData, "severity") || "Minor") as "Minor" | "Major" | "Critical",
        status: (getValue(formData, "status") || "Open") as "Open" | "Contained" | "Closed",
        sourceOrderCode: getValue(formData, "sourceOrderCode"),
        rootCause: getValue(formData, "rootCause"),
        correctiveAction: getValue(formData, "correctiveAction"),
      });
      return;
    case "material_lot":
      await appendDemoRecord("materialLots", {
        id: createDemoId("lot"),
        code: getValue(formData, "code"),
        material: getValue(formData, "material"),
        supplier: getValue(formData, "supplier"),
        status: (getValue(formData, "status") || "Released") as "Released" | "Hold" | "Consumed",
        quantity: getValue(formData, "quantity"),
        linkedOrder: getValue(formData, "linkedOrder"),
        genealogy: splitLines(formData.get("genealogy")),
      });
      return;
    case "inventory_item":
      await appendDemoRecord("inventoryItems", {
        id: createDemoId("inv"),
        item: getValue(formData, "item"),
        sku: getValue(formData, "sku"),
        onHand: getNumberValue(formData, "onHand"),
        reorderPoint: getNumberValue(formData, "reorderPoint"),
        location: getValue(formData, "location"),
        status: (getValue(formData, "status") || "Healthy") as "Healthy" | "Low" | "Critical",
      });
      return;
    case "erp_sync_log":
      await appendDemoRecord("syncLogs", {
        id: createDemoId("sync"),
        system: getValue(formData, "system"),
        direction: (getValue(formData, "direction") || "Outbound") as "Inbound" | "Outbound",
        status: (getValue(formData, "status") || "Healthy") as "Healthy" | "Retrying" | "Failed",
        records: getNumberValue(formData, "records"),
        lastRun: getValue(formData, "lastRun"),
      });
      return;
    case "report_snapshot":
      await appendDemoRecord("reports", {
        id: createDemoId("rep"),
        name: getValue(formData, "name"),
        period: getValue(formData, "period"),
        owner: getValue(formData, "owner"),
        lastGenerated: getValue(formData, "generatedAt"),
      });
      return;
    case "work_center":
      await appendDemoRecord("workCenters", {
        id: createDemoId("wc"),
        name: getValue(formData, "name"),
        status: (getValue(formData, "status") || "Running") as "Running" | "Constrained" | "Idle",
        capacity: `${getNumberValue(formData, "capacityPercent")}%`,
        shift: getValue(formData, "shiftName"),
      });
      return;
    case "equipment":
      await appendDemoRecord("equipment", {
        id: createDemoId("eq"),
        name: getValue(formData, "name"),
        area: getValue(formData, "area"),
        status: (getValue(formData, "status") || "Available") as
          | "Available"
          | "Maintenance"
          | "Downtime",
        nextMaintenance: getValue(formData, "nextMaintenanceDate"),
        utilization: `${getNumberValue(formData, "utilizationPercent")}%`,
      });
      return;
    case "employee":
      await appendDemoRecord("employees", {
        id: createDemoId("emp"),
        name: getValue(formData, "name"),
        role: getValue(formData, "roleName"),
        shift: getValue(formData, "shiftName"),
        skill: getValue(formData, "primarySkill"),
        hoursToday: getNumberValue(formData, "hoursToday"),
      });
      return;
    case "shift":
      await appendDemoRecord("shifts", {
        id: createDemoId("shift"),
        name: getValue(formData, "name"),
        lead: getValue(formData, "leadName"),
        window: getValue(formData, "windowLabel"),
        status: (getValue(formData, "status") || "Upcoming") as "Active" | "Upcoming" | "Closed",
      });
      return;
    case "labor_entry":
      await appendDemoRecord("laborEntries", {
        id: createDemoId("lab"),
        employeeName: getValue(formData, "employeeName"),
        orderCode: getValue(formData, "orderCode"),
        hours: getNumberValue(formData, "hoursWorked"),
        shiftName: getValue(formData, "shiftName"),
        efficiency: `${getNumberValue(formData, "efficiencyPercent")}%`,
      });
      return;
    case "production_event":
      await appendDemoRecord("productionEvents", {
        id: createDemoId("evt"),
        orderCode: getValue(formData, "orderCode"),
        eventType: getValue(formData, "eventType"),
        note: getValue(formData, "eventNote"),
        actorName: getValue(formData, "actorName"),
        happenedAt: new Date().toISOString(),
      });
      return;
    case "schedule":
      await appendDemoRecord("schedules", {
        id: createDemoId("sch"),
        workCenter: getValue(formData, "workCenter"),
        orderCode: getValue(formData, "orderCode"),
        slotStart: getValue(formData, "slotStart"),
        slotEnd: getValue(formData, "slotEnd"),
        status: (getValue(formData, "status") || "Planned") as "Locked" | "Planned" | "At Risk",
      });
      return;
    case "bom_record":
      await appendDemoRecord("boms", {
        id: createDemoId("bom"),
        itemName: getValue(formData, "itemName"),
        version: getValue(formData, "version"),
        type: (getValue(formData, "recordType") || "BOM") as "BOM" | "Recipe",
        components: splitLines(formData.get("components")),
        effectiveDate: getValue(formData, "effectiveDate"),
      });
      return;
    case "document":
      await appendDemoRecord("documents", {
        id: createDemoId("doc"),
        title: getValue(formData, "title"),
        category: getValue(formData, "category"),
        owner: getValue(formData, "ownerName"),
        status: (getValue(formData, "status") || "Draft") as "Approved" | "Draft" | "Expired",
        updatedAt: new Date().toISOString(),
      });
      return;
    case "audit_log":
      await appendDemoRecord("auditLogs", {
        id: createDemoId("audit"),
        module: getValue(formData, "moduleName"),
        action: getValue(formData, "actionName"),
        actor: getValue(formData, "actorName"),
        timestamp: new Date().toISOString(),
        note: getValue(formData, "note"),
      });
      return;
    default:
      return;
  }
}

export async function createMesRecordAction(formData: FormData) {
  const path = getValue(formData, "path") || "/dashboard";
  const entity = getValue(formData, "entity");
  const context = await getMutationContext();

  if (context.mode === "demo") {
    await createDemoRecord(entity, formData);
    revalidatePage(path);
    redirectWithNotice(path, "emerald", getCreateSuccessMessage(entity));
  }

  const { supabase, organizationId } = context;
  let errorMessage: string | null = null;

  switch (entity) {
    case "production_order": {
      errorMessage =
        (
          await supabase.from("production_orders").insert({
            organization_id: organizationId,
            code: getValue(formData, "code"),
            item_name: getValue(formData, "itemName"),
            customer_name: getValue(formData, "customer"),
            work_center: getValue(formData, "workCenter"),
            operator_name: getValue(formData, "operator"),
            status: getValue(formData, "status") || "Scheduled",
            priority: getValue(formData, "priority") || "Medium",
            planned_qty: getNumberValue(formData, "plannedQty"),
            completed_qty: getNumberValue(formData, "completedQty"),
            scrap_qty: getNumberValue(formData, "scrapQty"),
            lot_number: getValue(formData, "lotNumber"),
            scheduled_start: getValue(formData, "scheduledStart"),
            due_date: getValue(formData, "dueDate"),
          })
        ).error?.message ?? null;
      break;
    }
    case "work_instruction": {
      errorMessage =
        (
          await supabase.from("work_instructions").insert({
            organization_id: organizationId,
            title: getValue(formData, "title"),
            version: getValue(formData, "version"),
            station: getValue(formData, "station"),
            steps: splitLines(formData.get("steps")),
            safety_notes: splitLines(formData.get("safetyNotes")),
          })
        ).error?.message ?? null;
      break;
    }
    case "quality_check": {
      errorMessage =
        (
          await supabase.from("quality_checks").insert({
            organization_id: organizationId,
            order_code: getValue(formData, "orderCode"),
            checkpoint: getValue(formData, "checkpoint"),
            result: getValue(formData, "result"),
            inspector_name: getValue(formData, "inspector"),
            note: getValue(formData, "note"),
          })
        ).error?.message ?? null;
      break;
    }
    case "non_conformance": {
      errorMessage =
        (
          await supabase.from("non_conformances").insert({
            organization_id: organizationId,
            title: getValue(formData, "title"),
            severity: getValue(formData, "severity"),
            status: getValue(formData, "status"),
            source_order_code: getValue(formData, "sourceOrderCode"),
            root_cause: getValue(formData, "rootCause"),
            corrective_action: getValue(formData, "correctiveAction"),
          })
        ).error?.message ?? null;
      break;
    }
    case "material_lot": {
      errorMessage =
        (
          await supabase.from("material_lots").insert({
            organization_id: organizationId,
            code: getValue(formData, "code"),
            material_name: getValue(formData, "material"),
            supplier_name: getValue(formData, "supplier"),
            status: getValue(formData, "status"),
            quantity: getValue(formData, "quantity"),
            linked_order_code: getValue(formData, "linkedOrder"),
            genealogy: splitLines(formData.get("genealogy")),
          })
        ).error?.message ?? null;
      break;
    }
    case "inventory_item": {
      errorMessage =
        (
          await supabase.from("inventory_items").insert({
            organization_id: organizationId,
            item_name: getValue(formData, "item"),
            sku: getValue(formData, "sku"),
            on_hand: getNumberValue(formData, "onHand"),
            reorder_point: getNumberValue(formData, "reorderPoint"),
            location: getValue(formData, "location"),
            status: getValue(formData, "status"),
          })
        ).error?.message ?? null;
      break;
    }
    case "erp_sync_log": {
      errorMessage =
        (
          await supabase.from("erp_sync_logs").insert({
            organization_id: organizationId,
            system_name: getValue(formData, "system"),
            direction: getValue(formData, "direction"),
            status: getValue(formData, "status"),
            records_count: getNumberValue(formData, "records"),
            last_run: getValue(formData, "lastRun"),
          })
        ).error?.message ?? null;
      break;
    }
    case "report_snapshot": {
      errorMessage =
        (
          await supabase.from("report_snapshots").insert({
            organization_id: organizationId,
            name: getValue(formData, "name"),
            period: getValue(formData, "period"),
            owner_name: getValue(formData, "owner"),
            generated_at: getValue(formData, "generatedAt"),
          })
        ).error?.message ?? null;
      break;
    }
    case "work_center": {
      errorMessage =
        (
          await supabase.from("work_centers").insert({
            organization_id: organizationId,
            name: getValue(formData, "name"),
            status: getValue(formData, "status"),
            capacity_percent: getNumberValue(formData, "capacityPercent"),
            shift_name: getValue(formData, "shiftName"),
          })
        ).error?.message ?? null;
      break;
    }
    case "equipment": {
      errorMessage =
        (
          await supabase.from("equipment").insert({
            organization_id: organizationId,
            name: getValue(formData, "name"),
            area: getValue(formData, "area"),
            status: getValue(formData, "status"),
            next_maintenance_date: getValue(formData, "nextMaintenanceDate"),
            utilization_percent: getNumberValue(formData, "utilizationPercent"),
          })
        ).error?.message ?? null;
      break;
    }
    case "employee": {
      errorMessage =
        (
          await supabase.from("employees").insert({
            organization_id: organizationId,
            name: getValue(formData, "name"),
            role_name: getValue(formData, "roleName"),
            shift_name: getValue(formData, "shiftName"),
            primary_skill: getValue(formData, "primarySkill"),
            hours_today: getNumberValue(formData, "hoursToday"),
          })
        ).error?.message ?? null;
      break;
    }
    case "shift": {
      errorMessage =
        (
          await supabase.from("shifts").insert({
            organization_id: organizationId,
            name: getValue(formData, "name"),
            lead_name: getValue(formData, "leadName"),
            window_label: getValue(formData, "windowLabel"),
            status: getValue(formData, "status"),
          })
        ).error?.message ?? null;
      break;
    }
    case "labor_entry": {
      errorMessage =
        (
          await supabase.from("labor_entries").insert({
            organization_id: organizationId,
            employee_name: getValue(formData, "employeeName"),
            order_code: getValue(formData, "orderCode"),
            hours_worked: getNumberValue(formData, "hoursWorked"),
            shift_name: getValue(formData, "shiftName"),
            efficiency_percent: getNumberValue(formData, "efficiencyPercent"),
          })
        ).error?.message ?? null;
      break;
    }
    case "production_event": {
      errorMessage =
        (
          await supabase.from("production_events").insert({
            organization_id: organizationId,
            order_code: getValue(formData, "orderCode"),
            event_type: getValue(formData, "eventType"),
            event_note: getValue(formData, "eventNote"),
            actor_name: getValue(formData, "actorName"),
          })
        ).error?.message ?? null;
      break;
    }
    case "schedule": {
      errorMessage =
        (
          await supabase.from("schedules").insert({
            organization_id: organizationId,
            work_center: getValue(formData, "workCenter"),
            order_code: getValue(formData, "orderCode"),
            slot_start: getValue(formData, "slotStart"),
            slot_end: getValue(formData, "slotEnd"),
            status: getValue(formData, "status"),
          })
        ).error?.message ?? null;
      break;
    }
    case "bom_record": {
      errorMessage =
        (
          await supabase.from("bom_records").insert({
            organization_id: organizationId,
            item_name: getValue(formData, "itemName"),
            version: getValue(formData, "version"),
            record_type: getValue(formData, "recordType"),
            components: splitLines(formData.get("components")),
            effective_date: getValue(formData, "effectiveDate"),
          })
        ).error?.message ?? null;
      break;
    }
    case "document": {
      errorMessage =
        (
          await supabase.from("documents").insert({
            organization_id: organizationId,
            title: getValue(formData, "title"),
            category: getValue(formData, "category"),
            owner_name: getValue(formData, "ownerName"),
            status: getValue(formData, "status"),
          })
        ).error?.message ?? null;
      break;
    }
    case "audit_log": {
      errorMessage =
        (
          await supabase.from("audit_logs").insert({
            organization_id: organizationId,
            module_name: getValue(formData, "moduleName"),
            action_name: getValue(formData, "actionName"),
            actor_name: getValue(formData, "actorName"),
            note: getValue(formData, "note"),
          })
        ).error?.message ?? null;
      break;
    }
    default: {
      redirectWithNotice(path, "amber", "No matching save action was found for that form.");
    }
  }

  if (errorMessage) {
    redirectWithNotice(path, "rose", normalizeActionError(errorMessage));
  }

  revalidatePage(path);
  redirectWithNotice(path, "emerald", getCreateSuccessMessage(entity));
}

export async function updateOrderStatusAction(formData: FormData) {
  const path = getValue(formData, "path") || "/production-orders";
  const context = await getMutationContext();

  if (context.mode !== "supabase") {
    await setDemoOrderStatus(
      getValue(formData, "id"),
      (getValue(formData, "status") || "Scheduled") as
        | "Scheduled"
        | "In Progress"
        | "Blocked"
        | "Completed",
    );
    revalidatePage(path);
    redirectWithNotice(path, "emerald", "Production order status updated.");
  }

  const { supabase } = context;
  const { error } = await supabase
    .from("production_orders")
    .update({
      status: getValue(formData, "status"),
    })
    .eq("id", getValue(formData, "id"));

  if (error) {
    redirectWithNotice(path, "rose", normalizeActionError(error.message));
  }

  revalidatePage(path);
  redirectWithNotice(path, "emerald", "Production order status updated.");
}

export async function deleteProductionOrderAction(formData: FormData) {
  const path = getValue(formData, "path") || "/production-orders";
  const id = getValue(formData, "id");
  const code = getValue(formData, "code");
  const context = await getMutationContext();

  if (!id) {
    revalidatePage(path);
    redirectWithNotice(path, "amber", "Choose a production order before trying to remove it.");
  }

  if (context.mode !== "supabase") {
    await removeDemoProductionOrder(id, code);
    revalidatePage(path);
    redirectWithNotice(path, "emerald", "Production order removed.");
  }

  const { supabase } = context;
  const cleanupPromises = [
    supabase.from("production_orders").delete().eq("id", id),
  ];

  if (code) {
    cleanupPromises.push(
      supabase.from("quality_checks").delete().eq("order_code", code),
      supabase.from("non_conformances").delete().eq("source_order_code", code),
      supabase.from("material_lots").delete().eq("linked_order_code", code),
      supabase.from("production_events").delete().eq("order_code", code),
      supabase.from("labor_entries").delete().eq("order_code", code),
      supabase.from("schedules").delete().eq("order_code", code),
    );
  }

  const results = await Promise.all(cleanupPromises);
  const failedResult = results.find(
    (result: {
      error: {
        message: string;
      } | null;
    }) => result.error,
  );

  if (failedResult?.error) {
    redirectWithNotice(path, "rose", normalizeActionError(failedResult.error.message));
  }

  revalidatePage(path);
  redirectWithNotice(path, "emerald", "Production order removed.");
}
