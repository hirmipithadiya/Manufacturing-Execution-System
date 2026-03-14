import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, MetricCard } from "@/components/ui";
import { getReportsData, getWorkspaceSnapshot } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, snapshot, resolvedSearchParams] = await Promise.all([
    getReportsData(),
    getWorkspaceSnapshot(),
    searchParams,
  ]);

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Reporting"
        title="See leadership KPIs without losing operational detail."
        description="Reports bring throughput, quality, schedule risk, and cost into one place for review."
        badge={`${data.reports.length} report packs`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {snapshot.metrics.slice(0, 4).map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            inverse={metric.inverse}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">Available reports</p>
          <div className="mt-5 grid gap-4">
            {data.reports.map((report) => (
              <div key={report.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{report.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{report.period}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>Owner: {report.owner}</p>
                    <p className="mt-1">Generated: {report.lastGenerated}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <EntityForm
            entity="report_snapshot"
            path="/reports"
            title="Create report snapshot"
            description="Create a report snapshot for leadership reviews or audit packs."
            fields={[
              { name: "name", label: "Report name", placeholder: "Schedule adherence summary", required: true },
              { name: "period", label: "Period", placeholder: "Last 7 days", required: true },
              { name: "owner", label: "Owner", placeholder: "Plant Manager", required: true },
              { name: "generatedAt", label: "Generated at", type: "datetime-local", required: true },
            ]}
            submitLabel="Create report"
          />

          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">Leadership review</p>
            <div className="mt-5 space-y-4">
              {[
                "Start with KPI tiles to align on plant performance.",
                "Drill into orders, quality, or traceability to isolate risk.",
                "Use reports to summarize trends, exceptions, and cost drivers.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f9b233] text-sm font-semibold text-[#10211c]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/74">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-4">
              <Badge tone="amber">Built for recurring operational reviews</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
