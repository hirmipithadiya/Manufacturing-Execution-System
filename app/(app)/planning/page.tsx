import { format, parseISO } from "date-fns";
import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, MetricCard } from "@/components/ui";
import { getPlanningData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function PlanningPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getPlanningData(), searchParams]);
  const atRiskCount = data.scheduleData.filter((schedule) => schedule.status === "At Risk").length;
  const lockedCount = data.scheduleData.filter((schedule) => schedule.status === "Locked").length;
  const recipeCount = data.bomData.filter((record) => record.type === "Recipe").length;

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Planning"
        title="Align schedules, BOMs, and recipes before they hit the floor."
        description="Connect order timing to the materials and process definitions needed to run cleanly."
        badge={`${data.scheduleData.length} scheduled slots`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Locked slots" value={String(lockedCount)} change="+0" />
        <MetricCard label="At risk slots" value={String(atRiskCount)} change="+0" inverse />
        <MetricCard label="BOM records" value={String(data.bomData.length)} change="+0" />
        <MetricCard label="Recipes" value={String(recipeCount)} change="+0" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
            Schedule board
          </p>
          <div className="mt-5 space-y-4">
            {data.scheduleData.map((schedule) => (
              <div key={schedule.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                      {schedule.orderCode}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-950">{schedule.workCenter}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {format(parseISO(schedule.slotStart), "dd MMM, hh:mm a")} to{" "}
                      {format(parseISO(schedule.slotEnd), "dd MMM, hh:mm a")}
                    </p>
                  </div>
                  <Badge
                    tone={
                      schedule.status === "Locked"
                        ? "emerald"
                        : schedule.status === "At Risk"
                          ? "rose"
                          : "amber"
                    }
                  >
                    {schedule.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
              BOMs and recipes
            </p>
            <div className="mt-5 space-y-4">
              {data.bomData.map((record) => (
                <div key={record.id} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{record.itemName}</h2>
                    <Badge tone={record.type === "BOM" ? "emerald" : "amber"}>{record.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/72">
                    {record.version} • Effective {format(parseISO(record.effectiveDate), "dd MMM yyyy")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {record.components.map((component) => (
                      <Badge key={component} tone="slate" className="bg-white/10 text-white">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <EntityForm
            entity="schedule"
            path="/planning"
            title="Add schedule slot"
            description="Add a work-center slot and mark it planned, locked, or at risk."
            fields={[
              { name: "workCenter", label: "Work center", placeholder: "CNC Line 5", required: true },
              { name: "orderCode", label: "Order code", placeholder: "PO-1024", required: true },
              { name: "slotStart", label: "Slot start", type: "datetime-local", required: true },
              { name: "slotEnd", label: "Slot end", type: "datetime-local", required: true },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Locked", value: "Locked" },
                  { label: "Planned", value: "Planned" },
                  { label: "At Risk", value: "At Risk" },
                ],
              },
            ]}
            submitLabel="Create slot"
          />

          <EntityForm
            entity="bom_record"
            path="/planning"
            title="Add BOM or recipe"
            description="Capture the components or recipe steps required for a build."
            fields={[
              { name: "itemName", label: "Item name", placeholder: "Hydraulic Pump Housing", required: true },
              { name: "version", label: "Version", placeholder: "v3.0", required: true },
              {
                name: "recordType",
                label: "Record type",
                type: "select",
                required: true,
                options: [
                  { label: "BOM", value: "BOM" },
                  { label: "Recipe", value: "Recipe" },
                ],
              },
              {
                name: "components",
                label: "Components / steps",
                type: "textarea",
                placeholder: "One component or recipe step per line",
                required: true,
              },
              { name: "effectiveDate", label: "Effective date", type: "date", required: true },
            ]}
            submitLabel="Save record"
          />
        </div>
      </div>
    </div>
  );
}
