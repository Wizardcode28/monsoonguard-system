import { AlertTriangle, CheckCircle2, CircleAlert, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const CONFIG: Record<RiskLevel, { icon: typeof CheckCircle2; className: string }> = {
  LOW: { icon: CheckCircle2, className: "bg-risk-low/12 text-risk-low border-risk-low/30" },
  MODERATE: {
    icon: CircleAlert,
    className: "bg-risk-moderate/18 text-risk-moderate border-risk-moderate/40",
  },
  HIGH: { icon: AlertTriangle, className: "bg-risk-high/14 text-risk-high border-risk-high/35" },
  CRITICAL: {
    icon: ShieldAlert,
    className: "bg-risk-critical/12 text-risk-critical border-risk-critical/35",
  },
};

export function RiskBadge({
  level,
  label,
  className,
}: {
  level: RiskLevel;
  label?: string;
  className?: string;
}) {
  const { icon: Icon, className: tone } = CONFIG[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        tone,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label ?? level}
    </span>
  );
}
