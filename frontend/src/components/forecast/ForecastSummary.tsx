import { CloudRain, CloudSun, Droplets, Sun } from "lucide-react";
import { ProbabilityCard } from "@/components/common/ProbabilityCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import type { Forecast } from "@/types";
import { formatDateTime, riskFromScore } from "@/utils/risk";

export function MonsoonStatusCard({ forecast }: { forecast: Forecast }) {
  const likely = forecast.onsetProbability >= 60;
  return (
    <section className="card-elevated overflow-hidden">
      <div className="flex flex-col gap-6 bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            Monsoon status
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            {likely ? "Monsoon onset likely" : "Monsoon onset uncertain"}
          </h2>
          <p className="mt-1 text-sm opacity-90">
            {forecast.locationName}, {forecast.district} · Probability in next 7 days
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-5xl font-bold tabular-nums">{forecast.onsetProbability}%</p>
          <p className="text-sm opacity-90">onset probability</p>
        </div>
      </div>
      <dl className="grid gap-4 p-5 sm:grid-cols-4">
        <Meta label="Confidence" value={forecast.confidence} />
        <Meta label="Forecast horizon" value={`${forecast.horizon} days`} />
        <Meta label="Last updated" value={formatDateTime(forecast.updatedAt)} />
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Overall risk</dt>
          <dd className="mt-1">
            <RiskBadge level={forecast.overallRisk} />
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

export function ForecastCards({ forecast }: { forecast: Forecast }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ProbabilityCard
        icon={CloudSun}
        title="Monsoon Onset"
        value={`${forecast.onsetProbability}%`}
        period="Next 7 days"
        description="Chance that monsoon rains begin in your block within a week."
        level={riskFromScore(100 - forecast.onsetProbability)}
        accent="leaf"
        progress={forecast.onsetProbability}
      />
      <ProbabilityCard
        icon={Sun}
        title="Dry Spell Risk"
        value={`${forecast.drySpellProbability}%`}
        period="Next 14 days"
        description={`A break of about ${forecast.expectedDrySpellDays} days may follow the first showers.`}
        level={riskFromScore(forecast.drySpellProbability)}
        accent="warn"
        progress={forecast.drySpellProbability}
      />
      <ProbabilityCard
        icon={CloudRain}
        title="Heavy Rain Risk"
        value={`${forecast.heavyRainProbability}%`}
        period="Next 7 days"
        description="Chance of very heavy rainfall that may need drainage preparation."
        level={riskFromScore(forecast.heavyRainProbability)}
        accent="rain"
        progress={forecast.heavyRainProbability}
      />
      <ProbabilityCard
        icon={Droplets}
        title="Rainfall Anomaly"
        value={`${forecast.rainfallAnomaly > 0 ? "+" : ""}${forecast.rainfallAnomaly}%`}
        period={forecast.rainfallAnomaly < 0 ? "Below normal" : "Above normal"}
        description={`Expected ${forecast.rainfallMin}–${forecast.rainfallMax} mm against a normal of ${forecast.normalRainfall} mm.`}
        level={riskFromScore(Math.abs(forecast.rainfallAnomaly) * 3)}
        accent="rain"
        progress={Math.min(100, Math.abs(forecast.rainfallAnomaly) * 4)}
      />
    </div>
  );
}

export function DailyOutlook({ forecast }: { forecast: Forecast }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {forecast.daily.slice(0, 7).map((d) => (
        <div key={d.date} className="card-elevated p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            {new Date(d.date).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              weekday: "short",
              day: "numeric",
            })}
          </p>

          <CloudRain
            className="mx-auto my-2 h-6 w-6 text-rain"
            style={{ opacity: 0.3 + Math.min(0.7, d.rainfallMm / 25) }}
            aria-hidden
          />
          <p className="text-lg font-bold tabular-nums">{d.rainfallMm}</p>
          <p className="text-[11px] text-muted-foreground">mm expected</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Dry {d.drySpellProbability}%</p>
        </div>
      ))}
    </div>
  );
}
