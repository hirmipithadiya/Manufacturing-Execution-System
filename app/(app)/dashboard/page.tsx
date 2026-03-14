import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AlertTriangle, ArrowRight, Boxes, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card, MetricCard, ProgressBar } from "@/components/ui";
import { getDashboardData } from "@/lib/mes-data";

const quickActions = [
  {
    title: "Update orders",
    description: "Use this when a planner or supervisor needs to change status or create a new order.",
    href: "/production-orders",
    icon: ArrowRight,
  },
  {
    title: "Check quality",
    description: "Go here when you need inspection results, failures, or non-conformance history.",
    href: "/quality",
    icon: ShieldCheck,
  },
  {
    title: "Trace materials",
    description: "Open this when a lot, supplier, or genealogy question needs an answer quickly.",
    href: "/traceability",
    icon: Boxes,
  },
];

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Shift overview"
        title="Start here to see what needs attention across the plant."
        description="This page is the fastest way to understand production progress, current risks, and where to click next."
        badge={`${data.orders.length} visible orders`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <SourceBadge source={data.source} />
            <Link
              href="/production-orders"
              className="inline-flex items-center gap-2 rounded-full bg-[#265543] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4537]"
            >
              Open orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {quickActions.map((item) => (
          <Link key={item.title} href={item.href} className="group rounded-[28px]">
            <Card className="h-full bg-white transition group-hover:-translate-y-1 group-hover:border-[#265543]/40">
              <div className="flex items-center justify-between gap-3">
                <item.icon className="h-9 w-9 rounded-2xl bg-[#edf5f1] p-2 text-[#265543]" />
                <Badge tone="slate">Quick path</Badge>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {data.metrics.slice(0, 4).map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            inverse={metric.inverse}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                Orders running now
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Current work orders</h2>
              <p className="mt-2 text-sm text-slate-600">
                Read this section top to bottom to understand what is running, who owns it, and whether progress is healthy.
              </p>
            </div>
            <Badge tone="emerald">Shift A live</Badge>
          </div>

          <div className="mt-6 space-y-4">
            {data.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                        {order.code}
                      </p>
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
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">{order.itemName}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {order.workCenter} • {order.customer} • Operator {order.operator}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 md:min-w-[280px]">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        Start
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {format(parseISO(order.scheduledStart), "dd MMM, hh:mm a")}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        Due
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {format(parseISO(order.dueDate), "dd MMM, hh:mm a")}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        Completed
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {order.completedQty}/{order.plannedQty}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        Scrap
                      </p>
                      <p className="mt-2 font-medium text-slate-900">{order.scrapQty} units</p>
                    </div>
                  </div>
                </div>
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Completion progress</span>
                    <span>{Math.round((order.completedQty / order.plannedQty) * 100)}%</span>
                  </div>
                  <ProgressBar
                    value={(order.completedQty / order.plannedQty) * 100}
                    tone={order.status === "Blocked" ? "amber" : "emerald"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#081410] text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
                  Needs attention
                </p>
                <h2 className="mt-2 text-2xl font-semibold">What needs attention now</h2>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  Review these first if you need the shortest path to today’s biggest risks.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[#f9b233]" />
            </div>
            <div className="mt-6 space-y-4">
              {data.alerts.map((alert) => (
                <div key={alert.id} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <Badge
                      tone={
                        alert.severity === "Critical"
                          ? "rose"
                          : alert.severity === "Warning"
                            ? "amber"
                            : "emerald"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/72">{alert.detail}</p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                    {alert.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
              Helpful context
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">Latest inspection</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {data.qualityChecks[0]?.checkpoint} • {data.qualityChecks[0]?.result} •{" "}
                  {data.qualityChecks[0]?.inspector}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">Lot under review</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {data.materialLots[0]?.code} • {data.materialLots[0]?.material} •{" "}
                  {data.materialLots[0]?.status}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">Fresh report</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {data.reports[0]?.name} generated at {data.reports[0]?.lastGenerated}
                </p>
              </div>
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
                  <p className="text-sm leading-7 text-amber-900">
                    New here? Start with the alerts above, then open orders, quality, or traceability from the quick paths at the top of this page.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
