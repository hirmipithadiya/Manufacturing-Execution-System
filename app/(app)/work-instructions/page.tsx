import { format, parseISO } from "date-fns";
import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card } from "@/components/ui";
import { getWorkInstructionsData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function WorkInstructionsPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getWorkInstructionsData(), searchParams]);

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Operator guidance"
        title="Work instructions keep every station aligned."
        description="Use this page to publish clear steps and safety notes so operators always know the right process."
        badge={`${data.instructions.length} published procedures`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {data.instructions.map((instruction) => (
            <Card key={instruction.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="emerald">{instruction.station}</Badge>
                    <Badge tone="slate">{instruction.version}</Badge>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                    {instruction.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Last updated {format(parseISO(instruction.updatedAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">Steps</p>
                  <div className="mt-4 space-y-3">
                    {instruction.steps.map((step, index) => (
                      <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#265543] text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
                    Safety notes
                  </p>
                  <div className="mt-4 space-y-3">
                    {instruction.safetyNotes.map((note) => (
                      <div
                        key={note}
                        className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <EntityForm
          entity="work_instruction"
          path="/work-instructions"
          title="Publish work instruction"
          description="Add a new instruction with steps and safety notes for the station."
          fields={[
            { name: "title", label: "Title", placeholder: "Rotor balancing flow", required: true },
            { name: "version", label: "Version", placeholder: "v1.0", required: true },
            { name: "station", label: "Station", placeholder: "Balancing Cell 4", required: true },
            {
              name: "steps",
              label: "Steps",
              type: "textarea",
              placeholder: "One instruction step per line",
              required: true,
            },
            {
              name: "safetyNotes",
              label: "Safety notes",
              type: "textarea",
              placeholder: "One safety note per line",
              required: true,
            },
          ]}
          submitLabel="Publish instruction"
        />
      </div>
    </div>
  );
}
