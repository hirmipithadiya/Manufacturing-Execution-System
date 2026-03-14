import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card } from "@/components/ui";
import { getErpSyncData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function ErpSyncPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getErpSyncData(), searchParams]);

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Integration hub"
        title="Coordinate ERP and warehouse handoffs without losing visibility on the plant floor."
        description="See master data moves, transaction status, and connector health so teams can fix issues before they affect execution."
        badge={`${data.logs.length} connector logs`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">Connector health</p>
          <div className="mt-5 space-y-4">
            {data.logs.map((log) => (
              <div key={log.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="slate">{log.direction}</Badge>
                      <Badge
                        tone={
                          log.status === "Healthy"
                            ? "emerald"
                            : log.status === "Retrying"
                              ? "amber"
                              : "rose"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-slate-950">{log.system}</h2>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-600">
                    <p>Last run: {log.lastRun.replace("T", " ").slice(0, 16)}</p>
                    <p>Records: {log.records}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <EntityForm
            entity="erp_sync_log"
            path="/erp-sync"
            title="Log sync job"
            description="Log inbound or outbound ERP syncs for visibility and troubleshooting."
            fields={[
              { name: "system", label: "System", placeholder: "SAP B1", required: true },
              {
                name: "direction",
                label: "Direction",
                type: "select",
                required: true,
                options: [
                  { label: "Inbound", value: "Inbound" },
                  { label: "Outbound", value: "Outbound" },
                ],
              },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Healthy", value: "Healthy" },
                  { label: "Retrying", value: "Retrying" },
                  { label: "Failed", value: "Failed" },
                ],
              },
              { name: "records", label: "Records", type: "number", required: true },
              { name: "lastRun", label: "Last run", type: "datetime-local", required: true },
            ]}
            submitLabel="Log sync"
          />

          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">Operational monitoring</p>
            <div className="mt-5 space-y-4">
              {[
                "Track healthy outbound postings for production completion and inventory updates.",
                "Monitor retrying inbound jobs so planners can respond before schedules are affected.",
                "Surface failed connector activity quickly to support escalation and recovery workflows.",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/74">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
