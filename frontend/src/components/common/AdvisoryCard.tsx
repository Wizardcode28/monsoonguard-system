import { CalendarClock, Leaf, ShieldCheck } from "lucide-react";
import { RiskBadge } from "./RiskBadge";
import type { Advisory } from "@/types";
import { formatDate } from "@/utils/risk";

export function AdvisoryCard({ advisory }: { advisory: Advisory }) {
  return (
    <article className="card-elevated flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Leaf className="h-5 w-5 text-leaf" aria-hidden />
          {advisory.crop}
        </h3>
        <RiskBadge level={advisory.severity} />
      </div>

      <div className="rounded-lg bg-secondary p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Action</p>
        <p className="text-base font-semibold text-secondary-foreground">{advisory.action}</p>
        <p className="mt-1 text-xs text-muted-foreground">Risk: {advisory.risk}</p>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Reason: </span>
          <span className="text-muted-foreground">{advisory.message}</span>
        </p>
        <p>
          <span className="font-medium">Recommendation: </span>
          <span className="text-muted-foreground">{advisory.recommendation}</span>
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Prepare
        </p>
        <ul className="flex flex-wrap gap-2">
          {advisory.preparation.map((p) => (
            <li key={p} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Confidence: {advisory.confidence}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden />
          Valid {formatDate(advisory.validFrom)} – {formatDate(advisory.validUntil)}
        </span>
      </div>
    </article>
  );
}
