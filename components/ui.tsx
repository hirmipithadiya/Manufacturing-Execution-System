import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const badgeTones = {
  slate: "border-slate-200 bg-slate-100 text-slate-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.05)]",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  className,
  tone = "slate",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em]",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "font-mono text-xs uppercase tracking-[0.32em]",
          light ? "text-white/60" : "text-[#265543]",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl",
          light ? "text-white" : "text-slate-950",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 max-w-2xl text-sm leading-7", light ? "text-white/70" : "text-slate-600")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  change,
  inverse = false,
}: {
  label: string;
  value: string;
  change: string;
  inverse?: boolean;
}) {
  const isStable = /^\+?0(?:\.0+)?%?$/.test(change.trim());
  const positive = change.startsWith("+");
  const tone = isStable ? "slate" : inverse ? (positive ? "rose" : "emerald") : positive ? "emerald" : "amber";
  const displayChange = isStable ? "Stable" : change;

  return (
    <Card className="bg-white/95">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-2 text-sm text-slate-500">Current reading</p>
        </div>
        <Badge tone={tone}>{displayChange}</Badge>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      </div>
    </Card>
  );
}

export function ProgressBar({
  value,
  tone = "emerald",
  label = "Progress",
}: {
  value: number;
  tone?: "emerald" | "amber";
  label?: string;
}) {
  const width = `${Math.max(0, Math.min(value, 100))}%`;
  const roundedValue = Math.round(Math.max(0, Math.min(value, 100)));

  return (
    <div
      className="h-2.5 rounded-full bg-slate-200/80"
      role="progressbar"
      aria-label={label}
      aria-valuenow={roundedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-2.5 rounded-full",
          tone === "emerald" ? "bg-[#42c38c]" : "bg-[#f9b233]",
        )}
        style={{ width }}
      />
    </div>
  );
}
