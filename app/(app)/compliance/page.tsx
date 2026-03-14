import { format, parseISO } from "date-fns";
import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, MetricCard } from "@/components/ui";
import { getComplianceData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function CompliancePage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getComplianceData(), searchParams]);
  const approvedDocumentCount = data.documentData.filter((document) => document.status === "Approved").length;
  const draftDocumentCount = data.documentData.filter((document) => document.status === "Draft").length;

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Compliance"
        title="Keep controlled documents and audit trails easy to find."
        description="Review compliance activity in a workflow view instead of digging through folders."
        badge={`${data.auditData.length} audit events`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Controlled docs" value={String(data.documentData.length)} change="+0" />
        <MetricCard label="Approved docs" value={String(approvedDocumentCount)} change="+0" />
        <MetricCard label="Draft docs" value={String(draftDocumentCount)} change="+0" />
        <MetricCard label="Audit events" value={String(data.auditData.length)} change="+0" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
            Controlled documents
          </p>
          <div className="mt-5 grid gap-4">
            {data.documentData.map((document) => (
              <div key={document.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{document.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {document.category} • Owner {document.owner}
                    </p>
                  </div>
                  <Badge
                    tone={
                      document.status === "Approved"
                        ? "emerald"
                        : document.status === "Draft"
                          ? "amber"
                          : "rose"
                    }
                  >
                    {document.status}
                  </Badge>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Updated {format(parseISO(document.updatedAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
              Audit trail
            </p>
            <div className="mt-5 space-y-4">
              {data.auditData.map((entry) => (
                <div key={entry.id} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/50">
                        {entry.module}
                      </p>
                      <h2 className="mt-2 font-semibold">{entry.action}</h2>
                    </div>
                    <Badge tone="slate">{entry.actor}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/72">{entry.note}</p>
                  <p className="mt-3 text-xs text-white/45">
                    {format(parseISO(entry.timestamp), "dd MMM, hh:mm a")}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <EntityForm
            entity="document"
            path="/compliance"
            title="Add controlled document"
            description="Track a governed document with category, owner, and approval state."
            fields={[
              { name: "title", label: "Title", placeholder: "Calibration SOP", required: true },
              { name: "category", label: "Category", placeholder: "Maintenance", required: true },
              { name: "ownerName", label: "Owner", placeholder: "Quality Lead", required: true },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Approved", value: "Approved" },
                  { label: "Draft", value: "Draft" },
                  { label: "Expired", value: "Expired" },
                ],
              },
            ]}
            submitLabel="Create document"
          />

          <EntityForm
            entity="audit_log"
            path="/compliance"
            title="Add audit event"
            description="Log an audit event so compliance context stays current."
            fields={[
              { name: "moduleName", label: "Module", placeholder: "Quality", required: true },
              { name: "actionName", label: "Action", placeholder: "Document approved", required: true },
              { name: "actorName", label: "Actor", placeholder: "Compliance Lead", required: true },
              { name: "note", label: "Note", type: "textarea", required: true },
            ]}
            submitLabel="Log event"
          />
        </div>
      </div>
    </div>
  );
}
