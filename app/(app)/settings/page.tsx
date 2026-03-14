import Link from "next/link";
import { CheckCircle2, HardDriveDownload, ShieldCheck, Waypoints } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/source-badge";
import { Badge, Card } from "@/components/ui";
import { getCurrentUserContext } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/mes-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function SettingsPage() {
  const [{ authenticated, demoMode }, snapshot] = await Promise.all([
    getCurrentUserContext(),
    getWorkspaceSnapshot(),
  ]);

  const checklist = [
    {
      icon: HardDriveDownload,
      title: "Environment wired",
      detail: hasSupabaseEnv
        ? "Supabase environment variables are set for local or deployed use."
        : "The app is running in preview mode without Supabase credentials.",
      tone: hasSupabaseEnv ? "emerald" : "amber",
    },
    {
      icon: ShieldCheck,
      title: "Access path ready",
      detail: authenticated
        ? "Signed-in sessions can use connected workspace flows."
        : "Preview mode is active. Sign in anytime to use live data.",
      tone: authenticated ? "emerald" : "amber",
    },
    {
      icon: Waypoints,
      title: "Core workflow coverage",
      detail: `${snapshot.orders.length} orders, ${snapshot.checks.length} quality checks, and ${snapshot.reports.length} reports are available in the current workspace.`,
      tone: snapshot.orders.length > 0 ? "emerald" : "amber",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Confirm the workspace is ready before you share it."
        description="See deployment readiness, access mode, and demo completeness in one place."
        badge={authenticated ? "Connected session" : "Preview session"}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <SourceBadge source={snapshot.source} />
            {!authenticated ? (
              <Link
                href="/login?redirectTo=%2Fsettings"
                className="inline-flex items-center gap-2 rounded-full bg-[#265543] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4537]"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {checklist.map((item) => (
          <Card key={item.title} className="bg-white/95">
            <div className="flex items-center justify-between gap-3">
              <item.icon className="h-9 w-9 rounded-2xl bg-[#edf5f1] p-2 text-[#265543]" />
              <Badge tone={item.tone}>{item.tone === "emerald" ? "Ready" : "Preview"}</Badge>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
            Share-ready checklist
          </p>
          <div className="mt-5 space-y-4">
            {[
              "Open dashboard and production screens to confirm preview data is visible.",
              "Sign in to use the connected Supabase workspace instead of preview records.",
              "Recheck reports, quality, and traceability after each environment change.",
            ].map((item, index) => (
              <div key={item} className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#265543] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#081410] text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
                Workspace state
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Operational handoff</h2>
            </div>
            <CheckCircle2 className="h-6 w-6 text-[#f9b233]" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm leading-7 text-white/74">
                Mode: {demoMode ? "Preview workspace with demo data." : "Connected workspace backed by Supabase."}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm leading-7 text-white/74">
                Authentication: {authenticated ? "Signed in and ready for live data." : "Preview access is available, and sign-in is one click away."}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm leading-7 text-white/74">
                Reporting: {snapshot.metrics.length} KPI tiles and {snapshot.alerts.length} alerts are ready for review.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
