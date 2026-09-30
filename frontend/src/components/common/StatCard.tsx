import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "warn" | "danger" | "good";
}) {
  const tones = {
    default: "bg-rain/10 text-rain",
    warn: "bg-risk-moderate/20 text-risk-moderate",
    danger: "bg-risk-critical/12 text-risk-critical",
    good: "bg-risk-low/12 text-risk-low",
  } as const;

  return (
    <div className="card-elevated flex items-center gap-4 p-4">
      <span className={cn("rounded-xl p-2.5", tones[tone])}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
