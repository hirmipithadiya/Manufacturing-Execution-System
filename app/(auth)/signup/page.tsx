import Link from "next/link";
import { ArrowRight, Building2, ChartNoAxesCombined, Users } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";

import type { PageSearchParamsPromise } from "@/lib/page-notice";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: PageSearchParamsPromise;
}) {
  const resolvedSearchParams = await searchParams;
  const redirectTo =
    typeof resolvedSearchParams.redirectTo === "string" ? resolvedSearchParams.redirectTo : undefined;
  const loginHref = redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(249,178,51,0.18),_transparent_22%),linear-gradient(180deg,_#081410_0%,_#12251e_42%,_#f7f3eb_42%,_#f7f3eb_100%)] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="lg:order-2 lg:pt-12">
          <AuthForm mode="signup" redirectTo={redirectTo} />
          <p className="mt-5 text-center text-sm text-slate-600">
            Already have access?{" "}
            <Link className="font-semibold text-[#265543]" href={loginHref}>
              Sign in
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </p>
        </div>

        <div className="space-y-6 text-white lg:order-1">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/55">
              Get started
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Give your team one shared workspace for production, quality, and materials.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
              Set up a secure plant account and start working in minutes.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              {
                icon: Building2,
                title: "Plant-ready setup",
                body: "Start with work centers, production orders, traceability, and shift visibility right away.",
              },
              {
                icon: Users,
                title: "Role-based access",
                body: "Admin, planner, operator, and quality flows are already mapped into the product.",
              },
              {
                icon: ChartNoAxesCombined,
                title: "Performance insights",
                body: "OEE, yield, throughput, and defect trends help leaders spot risk early.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-white/10 bg-white/6 text-white">
                <item.icon className="h-8 w-8 text-[#f9b233]" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
