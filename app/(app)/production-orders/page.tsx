import { format, parseISO } from "date-fns";
import { ActionNotice } from "@/components/action-notice";
import { EntityForm } from "@/components/entity-form";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, ProgressBar } from "@/components/ui";
import { getProductionOrdersData } from "@/lib/mes-data";
import { deleteProductionOrderAction, updateOrderStatusAction } from "@/lib/mes-actions";
import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function ProductionOrdersPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const [data, resolvedSearchParams] = await Promise.all([getProductionOrdersData(), searchParams]);

  return (
    <div className="space-y-6">
      <ActionNotice searchParams={resolvedSearchParams} />
      <PageHeader
        eyebrow="Production planning"
        title="Manage production orders with clear owners, status, and due dates."
        description="Use this page to prioritize work, update progress, and keep delivery on track."
        badge={`${data.orders.length} active orders`}
        action={<SourceBadge source={data.source} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="grid gap-4">
            {data.orders.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-950">No production orders yet</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Create a new order from the panel on the right to populate this view.
                </p>
              </div>
            ) : (
              data.orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                          {order.code}
                        </p>
                        <Badge
                          tone={
                            order.priority === "High"
                              ? "rose"
                              : order.priority === "Medium"
                                ? "amber"
                                : "slate"
                          }
                        >
                          {order.priority} priority
                        </Badge>
                        <Badge
                          tone={
                            order.status === "Completed"
                              ? "emerald"
                              : order.status === "Blocked"
                                ? "rose"
                                : order.status === "In Progress"
                                  ? "amber"
                                  : "slate"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                          {order.itemName}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Customer {order.customer} • {order.workCenter} • Finished lot {order.lotNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:min-w-[360px]">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                          Start
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {format(parseISO(order.scheduledStart), "dd MMM, hh:mm a")}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                          Due
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {format(parseISO(order.dueDate), "dd MMM, hh:mm a")}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                          Planned
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {order.plannedQty} units
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                          Operator
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-950">{order.operator}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Progress</span>
                      <span>{Math.round((order.completedQty / order.plannedQty) * 100)}%</span>
                    </div>
                    <ProgressBar
                      value={(order.completedQty / order.plannedQty) * 100}
                      tone={order.status === "Blocked" ? "amber" : "emerald"}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <form action={updateOrderStatusAction} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="path" value="/production-orders" />
                      <select
                        name="status"
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                        defaultValue={order.status}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Blocked">Blocked</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        className="rounded-full bg-[#265543] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4537]"
                        type="submit"
                      >
                        Update status
                      </button>
                    </form>

                    <form action={deleteProductionOrderAction}>
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="code" value={order.code} />
                      <input type="hidden" name="path" value="/production-orders" />
                      <button
                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                        type="submit"
                      >
                        Remove order
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <EntityForm
            entity="production_order"
            path="/production-orders"
            title="Create production order"
            description="Add a new work order with schedule and quantity targets."
            fields={[
              { name: "code", label: "Order code", placeholder: "PO-1020", required: true },
              { name: "itemName", label: "Item name", placeholder: "Brake caliper bracket", required: true },
              { name: "customer", label: "Customer", placeholder: "Apex Mobility", required: true },
              { name: "workCenter", label: "Work center", placeholder: "Assembly Pod 2", required: true },
              { name: "operator", label: "Operator", placeholder: "Riya M.", required: true },
              {
                name: "priority",
                label: "Priority",
                required: true,
                type: "select",
                options: [
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ],
              },
              {
                name: "status",
                label: "Status",
                required: true,
                type: "select",
                options: [
                  { label: "Scheduled", value: "Scheduled" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Blocked", value: "Blocked" },
                  { label: "Completed", value: "Completed" },
                ],
              },
              { name: "plannedQty", label: "Planned qty", type: "number", required: true },
              { name: "completedQty", label: "Completed qty", type: "number", required: true },
              { name: "scrapQty", label: "Scrap qty", type: "number", required: true },
              { name: "lotNumber", label: "Lot number", placeholder: "FG-NEW-2001", required: true },
              { name: "scheduledStart", label: "Scheduled start", type: "datetime-local", required: true },
              { name: "dueDate", label: "Due date", type: "datetime-local", required: true },
            ]}
            submitLabel="Create order"
          />

          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">Schedule board</p>
            <div className="mt-5 space-y-3">
              {data.schedules.map((schedule) => (
                <div key={schedule.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-950">{schedule.orderCode}</h3>
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
                  <p className="mt-2 text-sm text-slate-600">
                    {schedule.workCenter} • {format(parseISO(schedule.slotStart), "dd MMM, hh:mm a")} to{" "}
                    {format(parseISO(schedule.slotEnd), "dd MMM, hh:mm a")}
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
