import Link from "next/link";
import { ArrowRight, Factory, ShieldCheck, Waypoints } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Badge, Card } from "@/components/ui";

import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const resolvedSearchParams = await searchParams;
  const redirectTo =
    typeof resolvedSearchParams.redirectTo === "string" ? resolvedSearchParams.redirectTo : undefined;
  const signupHref = redirectTo ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : "/signup";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(38,85,67,0.25),_transparent_26%),linear-gradient(180deg,_#091411_0%,_#11231d_38%,_#f7f3eb_38%,_#f7f3eb_100%)] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/55">
                ForgeFlow MES
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Pick up where your team left off.
              </h1>
            </div>
            <Link
              href="/"
              className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/8 md:inline-flex"
            >
              Back to home
            </Link>
          </div>
          <p className="max-w-xl text-base leading-8 text-white/72">
            Sign in to view production orders, quality alerts, lot history, and ERP sync health in one workspace.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Factory,
                title: "Production overview",
                body: "See active work centers, throughput, and blockers at a glance.",
              },
              {
                icon: ShieldCheck,
                title: "Quality checks",
                body: "Log inspections and track quality issues without leaving the floor view.",
              },
              {
                icon: Waypoints,
                title: "Traceability",
                body: "Trace finished lots back to source materials and suppliers.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-white/10 bg-white/6 text-white">
                <item.icon className="h-8 w-8 text-[#f9b233]" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">{item.body}</p>
              </Card>
            ))}
          </div>
          <Badge tone="amber" className="bg-white/10 text-white">
            Secure access for production, quality, and materials teams.
          </Badge>
        </div>

        <div className="lg:pt-12">
          <AuthForm mode="login" redirectTo={redirectTo} />
          <p className="mt-5 text-center text-sm text-slate-600">
            Need a new account?{" "}
            <Link className="font-semibold text-[#265543]" href={signupHref}>
              Request access
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
