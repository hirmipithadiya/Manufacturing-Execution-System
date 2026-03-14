import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, MetricCard } from "@/components/ui";
import { getQualityData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function QualityPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getQualityData(), searchParams]);
  const passCount = data.checks.filter((check) => check.result === "Pass").length;
  const failCount = data.checks.filter((check) => check.result === "Fail").length;
  const passRate = data.checks.length ? (passCount / data.checks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Quality control"
        title="Log inspections and track quality issues in one place."
        description="Inspectors can log findings quickly, and leaders can follow up without jumping between tools."
        badge={`${data.nonConformanceRecords.length} open quality issues`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Pass rate" value={`${passRate.toFixed(1)}%`} change="+0.0%" />
        <MetricCard label="Open issues" value={String(data.nonConformanceRecords.length)} change="+0" />
        <MetricCard label="Checks today" value={String(data.checks.length)} change="+0.0%" />
        <MetricCard label="Failures" value={String(failCount)} change="+0.0%" inverse />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">Recent inspections</p>
          <div className="mt-5 space-y-4">
            {data.checks.map((check) => (
              <div key={check.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                      {check.orderCode}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-950">{check.checkpoint}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {check.inspector} • {check.timestamp.replace("T", " ").slice(0, 16)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      check.result === "Pass"
                        ? "emerald"
                        : check.result === "Fail"
                          ? "rose"
                          : "amber"
                    }
                  >
                    {check.result}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{check.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <EntityForm
            entity="quality_check"
            path="/quality"
            title="Log inspection"
            description="Record the result and notes for an order."
            fields={[
              { name: "orderCode", label: "Order code", placeholder: "PO-1008", required: true },
              { name: "checkpoint", label: "Checkpoint", placeholder: "Leak test", required: true },
              {
                name: "result",
                label: "Result",
                required: true,
                type: "select",
                options: [
                  { label: "Pass", value: "Pass" },
                  { label: "Fail", value: "Fail" },
                  { label: "Monitor", value: "Monitor" },
                ],
              },
              { name: "inspector", label: "Inspector", placeholder: "Ishita D.", required: true },
              { name: "note", label: "Note", type: "textarea", placeholder: "Outcome and notes", required: true },
            ]}
            submitLabel="Save inspection"
          />

          <EntityForm
            entity="non_conformance"
            path="/quality"
            title="Create issue"
            description="Track the issue, root cause, and corrective action in one record."
            fields={[
              { name: "title", label: "Title", placeholder: "Fixture wear issue", required: true },
              {
                name: "severity",
                label: "Severity",
                type: "select",
                required: true,
                options: [
                  { label: "Minor", value: "Minor" },
                  { label: "Major", value: "Major" },
                  { label: "Critical", value: "Critical" },
                ],
              },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Open", value: "Open" },
                  { label: "Contained", value: "Contained" },
                  { label: "Closed", value: "Closed" },
                ],
              },
              { name: "sourceOrderCode", label: "Source order", placeholder: "PO-1015", required: true },
              { name: "rootCause", label: "Root cause", type: "textarea", required: true },
              { name: "correctiveAction", label: "Corrective action", type: "textarea", required: true },
            ]}
            submitLabel="Create issue"
          />

          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">Open quality issues</p>
            <div className="mt-5 space-y-4">
              {data.nonConformanceRecords.map((record) => (
                <div key={record.id} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{record.title}</h2>
                    <Badge tone={record.severity === "Critical" ? "rose" : record.severity === "Major" ? "amber" : "emerald"}>
                      {record.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/74">Root cause: {record.rootCause}</p>
                  <p className="mt-2 text-sm leading-7 text-white/74">
                    Corrective action: {record.correctiveAction}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
