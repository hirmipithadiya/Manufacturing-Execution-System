"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Boxes,
  ClipboardList,
  Cog,
  FileText,
  Gauge,
  LayoutDashboard,
  Link2,
  Package,
  CalendarRange,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoUser } from "@/lib/types";
import { Badge } from "@/components/ui";

const navGroups = [
  {
    label: "Start here",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        description: "See today's plant health first.",
        shortLabel: "Overview",
        icon: LayoutDashboard,
      },
      {
        href: "/production-orders",
        label: "Production Orders",
        description: "Run and update work orders.",
        shortLabel: "Orders",
        icon: Gauge,
      },
      {
        href: "/operations",
        label: "Operations",
        description: "Track shifts, labor, and floor events.",
        shortLabel: "Operations",
        icon: Cog,
      },
    ],
  },
  {
    label: "Build quality",
    items: [
      {
        href: "/work-instructions",
        label: "Work Instructions",
        description: "Show operators the right steps.",
        shortLabel: "Instructions",
        icon: FileText,
      },
      {
        href: "/quality",
        label: "Quality",
        description: "Log checks and quality issues.",
        shortLabel: "Quality",
        icon: ShieldCheck,
      },
      {
        href: "/traceability",
        label: "Traceability",
        description: "Follow lots from input to output.",
        shortLabel: "Traceability",
        icon: Boxes,
      },
      {
        href: "/inventory",
        label: "Inventory",
        description: "Spot stock risk before it blocks work.",
        shortLabel: "Inventory",
        icon: Package,
      },
    ],
  },
  {
    label: "Plan and review",
    items: [
      {
        href: "/planning",
        label: "Scheduling & BOM",
        description: "Plan slots, recipes, and build content.",
        shortLabel: "Planning",
        icon: CalendarRange,
      },
      {
        href: "/erp-sync",
        label: "ERP Integration",
        description: "Check connector health and sync status.",
        shortLabel: "ERP",
        icon: Link2,
      },
      {
        href: "/compliance",
        label: "Compliance",
        description: "Review controlled docs and audit trails.",
        shortLabel: "Compliance",
        icon: ClipboardList,
      },
      {
        href: "/reports",
        label: "Reporting",
        description: "Open KPI summaries and snapshots.",
        shortLabel: "Reports",
        icon: Activity,
      },
      {
        href: "/settings",
        label: "Settings",
        description: "Check environment and workspace status.",
        shortLabel: "Settings",
        icon: Settings2,
      },
    ],
  },
];

export function AppShell({
  children,
  user,
  demoMode,
  authenticated,
}: {
  children: React.ReactNode;
  user: DemoUser;
  demoMode: boolean;
  authenticated: boolean;
}) {
  const pathname = usePathname();
  const authHref = pathname ? `/login?redirectTo=${encodeURIComponent(pathname)}` : "/login";

  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 md:px-6 md:py-6">
        <aside className="hidden w-[280px] shrink-0 md:block">
          <div className="sticky top-6 rounded-[32px] border border-white/70 bg-[#081410] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/50">
                ForgeFlow MES
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                Plant control center
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Start on Overview, then move into orders, quality, materials, or reporting.
              </p>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="mt-1 text-sm text-white/55">{user.email}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="emerald">{user.role}</Badge>
                {demoMode ? <Badge tone="amber">Preview workspace</Badge> : <Badge tone="slate">Connected site</Badge>}
              </div>
              {!authenticated ? (
                <Link
                  href={authHref}
                  className="mt-4 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  Sign in for live data
                </Link>
              ) : null}
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
                Quick guide
              </p>
              <div className="mt-4 space-y-3 text-sm text-white/72">
                <p>1. Open Overview to see what needs attention.</p>
                <p>2. Go to Production Orders to act on work.</p>
                <p>3. Use the other sections for quality, materials, and reporting.</p>
              </div>
            </div>

            <nav className="mt-8 space-y-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-3 px-1 font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
                    {group.label}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const active = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-start gap-3 rounded-2xl px-4 py-3 text-sm transition",
                            active
                              ? "bg-white text-[#0a1713]"
                              : "text-white/72 hover:bg-white/8 hover:text-white",
                          )}
                        >
                          <item.icon className="mt-0.5 h-4 w-4 shrink-0" />
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p
                              className={cn(
                                "mt-1 text-xs leading-5",
                                active ? "text-slate-600" : "text-white/45",
                              )}
                            >
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 rounded-[28px] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-[0_18px_50px_rgba(17,24,39,0.05)] md:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  ForgeFlow MES
                </p>
                <p className="mt-1 text-lg font-semibold">Plant floor control</p>
              </div>
              {demoMode ? <Badge tone="amber">Preview</Badge> : <Badge tone="emerald">Connected</Badge>}
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {navGroups.flatMap((group) => group.items).map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium",
                      active
                        ? "border-[#265543] bg-[#265543] text-white"
                        : "border-slate-200 bg-white text-slate-700",
                    )}
                  >
                    {item.shortLabel}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
