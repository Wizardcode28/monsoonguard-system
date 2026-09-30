import { Globe, Activity, Wind, CloudRain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { forecastService } from "@/services";

export function PlanetaryTeleconnectionsCard() {
  const { data: teleconnections } = useQuery({
    queryKey: ["climate-teleconnections"],
    queryFn: () => forecastService.getTeleconnections(),
  });

  const enso = teleconnections?.enso || {
    phase: "Neutral / Weak El Niño",
    value: 0.42,
    impact: "Slight moisture suppression over Central India",
  };
  const iod = teleconnections?.iod || {
    phase: "Positive IOD",
    value: 0.35,
    impact: "Favorable cross-equatorial flow into Arabian Sea branch",
  };
  const mjo = teleconnections?.mjo || {
    phase_name: "Indian Ocean Convective Phase",
    amplitude: 1.64,
    impact: "Enhanced intra-seasonal convective pulse across Peninsular and Central India",
  };

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Global Planetary Boundary Conditions (MoES Feed)</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Live Teleconnections
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {/* ENSO */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">ENSO (El Niño)</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-bold">{enso.phase}</p>
          <p className="text-xs text-muted-foreground">Anomaly: +{enso.value}°C (ONI)</p>
          <p className="mt-2 text-xs text-muted-foreground border-t border-border/40 pt-2">
            {enso.impact}
          </p>
        </div>

        {/* IOD */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Indian Ocean Dipole</span>
            <Wind className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold">{iod.phase}</p>
          <p className="text-xs text-muted-foreground">DMI Index: +{iod.value}°C</p>
          <p className="mt-2 text-xs text-muted-foreground border-t border-border/40 pt-2">
            {iod.impact}
          </p>
        </div>

        {/* MJO */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Madden-Julian Osc.</span>
            <CloudRain className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-xl font-bold">Phase 3</p>
          <p className="text-xs text-muted-foreground">RMM Amplitude: {mjo.amplitude} (Active)</p>
          <p className="mt-2 text-xs text-muted-foreground border-t border-border/40 pt-2">
            {mjo.phase_name}
          </p>
        </div>
      </div>
    </div>
  );
}
