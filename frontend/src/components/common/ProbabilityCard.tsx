import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "./RiskBadge";
import type { RiskLevel } from "@/types";

export function ProbabilityCard({
  icon: Icon,
  title,
  value,
  period,
  description,
  level,
  accent = "rain",
  progress,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  period: string;
  description: string;
  level: RiskLevel;
  accent?: "rain" | "leaf" | "warn";
  progress?: number;
}) {
  const accents = {
    rain: "bg-rain/10 text-rain",
    leaf: "bg-leaf/12 text-leaf",
    warn: "bg-risk-high/12 text-risk-high",
  } as const;

  return (
    <article className="card-elevated flex flex-col gap-3 p-5 transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("rounded-xl p-2.5", accents[accent])}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <RiskBadge level={level} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
        <p className="text-xs font-medium text-muted-foreground">{period}</p>
      </div>
      {typeof progress === "number" && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full",
              level === "LOW"
                ? "bg-risk-low"
                : level === "MODERATE"
                  ? "bg-risk-moderate"
                  : level === "HIGH"
                    ? "bg-risk-high"
                    : "bg-risk-critical",
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
