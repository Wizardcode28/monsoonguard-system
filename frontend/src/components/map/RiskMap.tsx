import { cn } from "@/lib/utils";
import { riskFromScore } from "@/utils/risk";
import type { RiskLevel, RiskMapLocation, RiskType } from "@/types";

const RISK_FILL: Record<RiskLevel, string> = {
  LOW: "bg-risk-low",
  MODERATE: "bg-risk-moderate",
  HIGH: "bg-risk-high",
  CRITICAL: "bg-risk-critical",
};

export function riskValue(loc: RiskMapLocation, type: RiskType) {
  switch (type) {
    case "onset":
      return loc.onsetRisk;
    case "drySpell":
      return loc.drySpellRisk;
    case "heavyRain":
      return loc.heavyRainRisk;
    default:
      return loc.overallScore;
  }
}

/** Stylised geographic block map — positions blocks by latitude/longitude. */
export function RiskMap({
  locations,
  riskType,
  selectedId,
  onSelect,
}: {
  locations: RiskMapLocation[];
  riskType: RiskType;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  if (locations.length === 0) return null;

  const lats = locations.map((l) => l.latitude);
  const lngs = locations.map((l) => l.longitude);
  const minLat = Math.min(...lats) - 0.15;
  const maxLat = Math.max(...lats) + 0.15;
  const minLng = Math.min(...lngs) - 0.15;
  const maxLng = Math.max(...lngs) + 0.15;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface grid-backdrop sm:aspect-[16/10]">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="mapglow" cx="50%" cy="40%">
            <stop offset="0%" stopColor="var(--rain-soft)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapglow)" />
      </svg>

      {locations.map((loc) => {
        const value = riskValue(loc, riskType);
        const level = riskType === "overall" ? loc.overallRisk : riskFromScore(value);
        const left = ((loc.longitude - minLng) / (maxLng - minLng)) * 100;
        const top = (1 - (loc.latitude - minLat) / (maxLat - minLat)) * 100;
        const selected = selectedId === loc.id;

        return (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelect(loc.id)}
            aria-label={`${loc.name}, ${level} risk, ${value}%`}
            aria-pressed={selected}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card/95 px-2.5 py-1.5 text-left shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selected ? "border-primary ring-2 ring-primary/40" : "border-border",
            )}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", RISK_FILL[level])} />
              <span className="text-xs font-semibold">{loc.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{value}%</span>
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {level}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function RiskLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-3 text-xs">
      {(["LOW", "MODERATE", "HIGH", "CRITICAL"] as RiskLevel[]).map((level) => (
        <li key={level} className="flex items-center gap-1.5">
          <span className={cn("h-3 w-3 rounded-sm", RISK_FILL[level])} />
          <span className="font-medium">{level}</span>
        </li>
      ))}
    </ul>
  );
}
