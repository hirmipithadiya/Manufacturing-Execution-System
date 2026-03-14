import { format, parseISO } from "date-fns";
import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, MetricCard } from "@/components/ui";
import { getOperationsData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";
import { formatNumber, formatPercent } from "@/lib/utils";

function parsePercent(value: string) {
  return Number(value.replace("%", ""));
}

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getOperationsData(), searchParams]);
  const activeShiftCount = data.shiftData.filter((shift) => shift.status === "Active").length;
  const runningCenterCount = data.centers.filter((center) => center.status === "Running").length;
  const availableEquipmentCount = data.machines.filter((machine) => machine.status === "Available").length;
  const averageEfficiency =
    data.laborData.length === 0
      ? 0
      : data.laborData.reduce((total, entry) => total + parsePercent(entry.efficiency), 0) /
        data.laborData.length;

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Operations"
        title="Track centers, equipment, shifts, and floor events in one view."
        description="Use this page to manage shifts, monitor equipment, and log floor activity."
        badge={`${data.eventData.length} live floor events`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Running centers" value={String(runningCenterCount)} change="+0" />
        <MetricCard label="Available equipment" value={String(availableEquipmentCount)} change="+0" />
        <MetricCard label="Active shifts" value={String(activeShiftCount)} change="+0" />
        <MetricCard
          label="Avg labor efficiency"
          value={formatPercent(averageEfficiency)}
          change="+0.0%"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
              Work centers
            </p>
            <div className="mt-5 grid gap-4">
              {data.centers.map((center) => (
                <div key={center.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{center.name}</h2>
                      <p className="mt-2 text-sm text-slate-600">{center.shift}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        tone={
                          center.status === "Running"
                            ? "emerald"
                            : center.status === "Constrained"
                              ? "amber"
                              : "slate"
                        }
                      >
                        {center.status}
                      </Badge>
                      <Badge tone="slate">{center.capacity} capacity</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
              Equipment readiness
            </p>
            <div className="mt-5 grid gap-4">
              {data.machines.map((machine) => (
                <div key={machine.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{machine.name}</h2>
                      <p className="mt-2 text-sm text-slate-600">{machine.area}</p>
                    </div>
                    <Badge
                      tone={
                        machine.status === "Available"
                          ? "emerald"
                          : machine.status === "Maintenance"
                            ? "amber"
                            : "rose"
                      }
                    >
                      {machine.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>Utilization {machine.utilization}</span>
                    <span>
                      Next maintenance {format(parseISO(machine.nextMaintenance), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
              Shift and labor summary
            </p>
            <div className="mt-5 space-y-4">
              {data.shiftData.map((shift) => (
                <div key={shift.id} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{shift.name}</h2>
                    <Badge
                      tone={
                        shift.status === "Active"
                          ? "emerald"
                          : shift.status === "Upcoming"
                            ? "amber"
                            : "slate"
                      }
                    >
                      {shift.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/72">
                    Lead {shift.lead} • {shift.window}
                  </p>
                </div>
              ))}
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <h2 className="font-semibold">Crew summary</h2>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {data.people.length} people visible • {formatNumber(data.laborData.length)} labor
                  entries • {formatPercent(averageEfficiency)} average efficiency
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
              Recent floor events
            </p>
            <div className="mt-5 space-y-4">
              {data.eventData.map((event) => (
                <div key={event.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                        {event.orderCode}
                      </p>
                      <h2 className="mt-2 font-semibold text-slate-950">{event.eventType}</h2>
                    </div>
                    <Badge tone="slate">{event.actorName}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{event.note}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    {format(parseISO(event.happenedAt), "dd MMM, hh:mm a")}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <EntityForm
            entity="work_center"
            path="/operations"
            title="Add work center"
            description="Track status and available capacity for the active shift."
            fields={[
              { name: "name", label: "Name", placeholder: "Assembly Pod 4", required: true },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Running", value: "Running" },
                  { label: "Constrained", value: "Constrained" },
                  { label: "Idle", value: "Idle" },
                ],
              },
              { name: "capacityPercent", label: "Capacity %", type: "number", required: true },
              { name: "shiftName", label: "Shift", placeholder: "Shift A", required: true },
            ]}
            submitLabel="Create center"
          />

          <EntityForm
            entity="production_event"
            path="/operations"
            title="Log floor event"
            description="Log a floor event so everyone stays aligned."
            fields={[
              { name: "orderCode", label: "Order code", placeholder: "PO-1008", required: true },
              { name: "eventType", label: "Event type", placeholder: "Downtime", required: true },
              { name: "eventNote", label: "Event note", type: "textarea", required: true },
              { name: "actorName", label: "Actor", placeholder: "Shift Lead", required: true },
            ]}
            submitLabel="Add event"
          />
        </div>
      </div>
    </div>
  );
}
