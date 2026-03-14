import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card } from "@/components/ui";
import { getTraceabilityData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function TraceabilityPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getTraceabilityData(), searchParams]);
  const highlightedOrder = data.orders[0];

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Traceability"
        title="Track finished products back to material lots, suppliers, and receiving checks."
        description="Keep lot history and supplier exposure visible so teams can respond quickly to issues."
        badge={`${data.lots.length} tracked lots`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <Card className="bg-[#081410] text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">Finished lot</p>
                <h2 className="mt-3 text-2xl font-semibold">{highlightedOrder?.lotNumber}</h2>
                <p className="mt-2 text-sm text-white/70">
                  {highlightedOrder?.itemName} • {highlightedOrder?.code}
                </p>
              </div>
              <Badge tone="emerald">Shippable</Badge>
            </div>
            <div className="mt-8 space-y-4">
              {data.lots[0]?.genealogy.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f9b233] text-sm font-semibold text-[#11221c]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/74">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <EntityForm
            entity="material_lot"
            path="/traceability"
            title="Add material lot"
            description="Create a material lot record tied to a production order."
            fields={[
              { name: "code", label: "Lot code", placeholder: "RM-NEW-2210", required: true },
              { name: "material", label: "Material", placeholder: "Stainless shaft blank", required: true },
              { name: "supplier", label: "Supplier", placeholder: "FerraForge", required: true },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Released", value: "Released" },
                  { label: "Hold", value: "Hold" },
                  { label: "Consumed", value: "Consumed" },
                ],
              },
              { name: "quantity", label: "Quantity", placeholder: "480 pcs", required: true },
              { name: "linkedOrder", label: "Linked order", placeholder: "PO-1012", required: true },
              {
                name: "genealogy",
                label: "Trace steps",
                type: "textarea",
                placeholder: "One traceability event per line",
                required: true,
              },
            ]}
            submitLabel="Add lot"
          />
        </div>

        <div className="space-y-6">
          {data.lots.map((lot) => (
            <Card key={lot.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                      {lot.code}
                    </p>
                    <Badge
                      tone={
                        lot.status === "Released"
                          ? "emerald"
                          : lot.status === "Hold"
                            ? "rose"
                            : "amber"
                      }
                    >
                      {lot.status}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-slate-950">{lot.material}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Supplier {lot.supplier} • Qty {lot.quantity} • Linked order {lot.linkedOrder}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {lot.genealogy.map((event) => (
                  <div key={event} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    {event}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
