import Link from "next/link";
import {
  Activity,
  BarChart3,
  Boxes,
  Braces,
  CalendarRange,
  ClipboardList,
  Cog,
  FileText,
  Gauge,
  Link2,
  Menu,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { dashboardMetrics, productionOrders } from "@/lib/demo-data";
import { Badge, Card, MetricCard, ProgressBar, SectionHeading } from "@/components/ui";

const navItems = [
  { label: "Start Here", href: "#start-here" },
  { label: "Daily Work", href: "#execution" },
  { label: "Quality", href: "#quality" },
  { label: "Materials", href: "#materials" },
  { label: "Systems", href: "#operations" },
];

const startingPoints = [
  {
    title: "Plant manager",
    description: "Start on Overview to see alerts, risks, and the fastest next steps.",
    href: "/dashboard",
  },
  {
    title: "Planner or supervisor",
    description: "Go to Production Orders to move work forward or create a new order.",
    href: "/production-orders",
  },
  {
    title: "Quality or materials team",
    description: "Open Quality or Traceability to log checks or verify lots and suppliers quickly.",
    href: "/quality",
  },
];

const featureGroups = [
  {
    id: "execution",
    title: "Run Today’s Work",
    description:
      "Open one of these pages to see what is running, what is blocked, and where to act first.",
    items: [
      {
        title: "Production Orders",
        description: "Update status, check due times, and create new work orders.",
        href: "/production-orders",
        icon: Gauge,
      },
      {
        title: "Overview Dashboard",
        description: "Quick summary of plant health, progress, and alerts.",
        href: "/dashboard",
        icon: Activity,
      },
      {
        title: "Work Instructions",
        description: "Show operators the exact steps and safety notes for the job at hand.",
        href: "/work-instructions",
        icon: FileText,
      },
      {
        title: "Operations",
        description: "Track shifts, floor events, and team activity in one view.",
        href: "/operations",
        icon: Users,
      },
    ],
  },
  {
    id: "quality",
    title: "Protect Quality",
    description:
      "Use these to log inspections, capture issues, and stay audit-ready.",
    items: [
      {
        title: "Quality Checks",
        description: "Log inspection results, track failures, and capture issues in one place.",
        href: "/quality",
        icon: ShieldCheck,
      },
      {
        title: "Compliance",
        description: "Find controlled docs and audit events quickly.",
        href: "/compliance",
        icon: ClipboardList,
      },
      {
        title: "Traceability",
        description: "Trace finished lots back to material lots and suppliers.",
        href: "/traceability",
        icon: Boxes,
      },
    ],
  },
  {
    id: "materials",
    title: "Manage Materials",
    description:
      "Check stock, structure, and genealogy so materials do not block production.",
    items: [
      {
        title: "Inventory",
        description: "See stock, low-inventory risks, and reorder pressure fast.",
        href: "/inventory",
        icon: Package,
      },
      {
        title: "Traceability",
        description: "Open for genealogy, supplier links, or lot-level context.",
        href: "/traceability",
        icon: Boxes,
      },
      {
        title: "Scheduling & BOM",
        description: "Plan capacity and maintain BOM/recipe definitions used on the floor.",
        href: "/planning",
        icon: Braces,
      },
    ],
  },
  {
    id: "operations",
    title: "Connect Systems And Reviews",
    description:
      "Keep integrations healthy, review KPIs, and confirm the environment is ready.",
    items: [
      {
        title: "ERP Integration",
        description: "Check whether master data and transaction syncs are healthy or failing.",
        href: "/erp-sync",
        icon: Link2,
      },
      {
        title: "Reporting",
        description: "Open KPI summaries and report snapshots for leadership or reviews.",
        href: "/reports",
        icon: BarChart3,
      },
      {
        title: "Settings",
        description: "Confirm preview mode, environment wiring, and workspace readiness.",
        href: "/settings",
        icon: Cog,
      },
      {
        title: "Planning",
        description: "Go here to review the schedule, slot risk, or build definitions.",
        href: "/planning",
        icon: CalendarRange,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 px-6 py-4 text-slate-900 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500">
              ForgeFlow MES
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Guidance that keeps production teams aligned.
            </p>
          </div>
          <nav
            className="hidden items-center gap-6 text-sm text-slate-700 lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center whitespace-nowrap leading-none transition hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <details className="relative lg:hidden">
              <summary className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]">
                <Menu className="h-4 w-4" />
                Menu
              </summary>
              <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
                <nav className="flex flex-col gap-2 text-sm text-slate-800" aria-label="Mobile">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl px-3 py-2 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <Link
                    href="/login"
                    className="block rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </details>
            <Link
              href="/login"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#1f6f63] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#195d53] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </header>

      <main id="content">
        <section className="px-6 pb-20 pt-12 text-slate-900 md:px-10 md:pb-24 md:pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr_0.95fr]">
            <div className="space-y-8">
              <Badge tone="amber">Manufacturing execution platform</Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                  Manufacturing execution that helps real teams stay in sync.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-700">
                  Keep production, quality, and materials aligned with clear workflows and quick navigation.
                  The right page is one click away.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#start-here"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0b1512] transition hover:bg-[#f0eadb]"
                >
                  Get started
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  Explore the workspace
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {dashboardMetrics.slice(0, 3).map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    change={metric.change}
                    inverse={metric.inverse}
                  />
                ))}
              </div>
            </div>

            <Card className="overflow-hidden border-slate-200 bg-white p-0 text-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.16)]">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                      Product snapshot
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">See the workflow in action</h2>
                  </div>
                  <Badge tone="emerald">North Plant • Shift A</Badge>
                </div>
              </div>
              <div className="space-y-5 px-6 py-6">
                {productionOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                          {order.code}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">{order.itemName}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.workCenter} • Operator {order.operator}
                        </p>
                      </div>
                      <Badge tone={order.status === "In Progress" ? "emerald" : "amber"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                        <span>Completion</span>
                        <span>
                          {order.completedQty}/{order.plannedQty}
                        </span>
                      </div>
                      <ProgressBar
                        value={(order.completedQty / order.plannedQty) * 100}
                        tone={order.status === "Blocked" ? "amber" : "emerald"}
                        label={`Completion for ${order.code}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="start-here" className="px-6 py-14 md:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Getting started"
              title="Pick your starting point by role."
              description="These starting points take you to the right screen without guesswork."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {startingPoints.map((item) => (
                <Card key={item.title} className="bg-white">
                  <Badge tone="slate">{item.title}</Badge>
                  <p className="mt-5 text-lg font-semibold text-slate-950">Start here</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <Link href={item.href} className="mt-6 inline-flex text-sm font-semibold text-[#265543]">
                    Open page
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {featureGroups.map((group) => (
          <section key={group.id} id={group.id} className="px-6 py-16 md:px-10">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Workflows"
                title={group.title}
                description={group.description}
              />
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9b233]"
                  >
                    <Card className="h-full bg-white transition group-hover:-translate-y-1 group-hover:border-[#265543]/40 group-hover:shadow-[0_22px_60px_rgba(17,24,39,0.12)] group-focus-visible:translate-y-0 group-focus-visible:border-[#265543]/50 group-focus-visible:shadow-[0_22px_60px_rgba(17,24,39,0.12)]">
                      <div className="flex items-center justify-between">
                        <item.icon className="h-10 w-10 rounded-2xl bg-[#edf5f1] p-2 text-[#265543]" />
                        <Badge tone="slate">Open page</Badge>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                      <p className="mt-6 text-sm font-semibold text-[#265543]">Go to {item.title}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-slate-200/70 bg-white px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-400">ForgeFlow MES</p>
            <p className="mt-2 text-sm text-slate-600">
              Shop-floor execution, quality, and traceability in one focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-semibold text-[#265543]">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
