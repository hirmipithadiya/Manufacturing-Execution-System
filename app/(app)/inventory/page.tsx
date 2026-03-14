import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card } from "@/components/ui";
import { getInventoryData } from "@/lib/mes-data";
import type { PageSearchParamsPromise } from "@/lib/page-notice";
import { formatNumber } from "@/lib/utils";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getInventoryData(), searchParams]);

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Inventory snapshot"
        title="See stock levels before shortages slow production."
        description="Use this page to spot low stock, held lots, and upcoming reorder needs."
        badge={`${data.items.filter((item) => item.status !== "Healthy").length} replenishment risks`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">Stock positions</p>
          <div className="mt-5 overflow-hidden rounded-[26px] border border-slate-200">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 bg-slate-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              <span>Item</span>
              <span>On hand</span>
              <span>Location</span>
              <span>Status</span>
            </div>
            {data.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-700"
              >
                <div>
                  <p className="font-semibold text-slate-950">{item.item}</p>
                  <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
                    {item.sku}
                  </p>
                </div>
                <span>{formatNumber(item.onHand)}</span>
                <span>{item.location}</span>
                <div>
                  <Badge
                    tone={
                      item.status === "Healthy"
                        ? "emerald"
                        : item.status === "Low"
                          ? "amber"
                          : "rose"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <EntityForm
            entity="inventory_item"
            path="/inventory"
            title="Add inventory item"
            description="Track items and set reorder points so shortages surface early."
            fields={[
              { name: "item", label: "Item", placeholder: "Seal kit", required: true },
              { name: "sku", label: "SKU", placeholder: "RM-SK-41", required: true },
              { name: "onHand", label: "On hand", type: "number", required: true },
              { name: "reorderPoint", label: "Reorder point", type: "number", required: true },
              { name: "location", label: "Location", placeholder: "Rack B4", required: true },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Healthy", value: "Healthy" },
                  { label: "Low", value: "Low" },
                  { label: "Critical", value: "Critical" },
                ],
              },
            ]}
            submitLabel="Add item"
          />

          <Card className="bg-[#081410] text-white">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">Low stock alerts</p>
            <div className="mt-5 space-y-4">
              {data.items
                .filter((item) => item.status !== "Healthy")
                .map((item) => (
                  <div key={item.id} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold">{item.item}</h2>
                      <Badge tone={item.status === "Low" ? "amber" : "rose"}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/72">
                      On hand {item.onHand} vs reorder point {item.reorderPoint}. Reorder before the next run.
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
