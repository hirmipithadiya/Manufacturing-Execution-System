import type { ReactNode } from "react";
import { Badge } from "@/components/ui";

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-6 rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_50px_rgba(17,24,39,0.05)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-8">
      <div className="max-w-3xl">
        <Badge tone="emerald" className="bg-[#edf5f1] text-[#265543]">
          {eyebrow}
        </Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 lg:min-w-[250px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
          At a glance
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {badge ? <Badge tone="amber">{badge}</Badge> : null}
          {action}
        </div>
      </div>
    </div>
  );
}
