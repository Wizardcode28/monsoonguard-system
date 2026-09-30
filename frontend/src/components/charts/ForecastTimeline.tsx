import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyForecast } from "@/types";
import { formatDate } from "@/utils/risk";

export function ForecastTimeline({ daily }: { daily: DailyForecast[] }) {
  const data = daily.map((d) => ({ ...d, label: formatDate(d.date) }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis yAxisId="mm" tick={{ fontSize: 11 }} />
          <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [
              name.includes("probability") || name.includes("Probability")
                ? `${value}%`
                : `${value} mm`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="mm"
            dataKey="rainfallMm"
            name="Expected rainfall"
            fill="var(--rain)"
            radius={[4, 4, 0, 0]}
            barSize={10}
          />
          <Area
            yAxisId="pct"
            dataKey="drySpellProbability"
            name="Dry spell probability"
            stroke="var(--risk-high)"
            fill="var(--risk-high)"
            fillOpacity={0.12}
          />
          <Line
            yAxisId="pct"
            dataKey="heavyRainProbability"
            name="Heavy rainfall probability"
            stroke="var(--chart-5)"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="pct"
            dataKey="anomalyPct"
            name="Rainfall anomaly (%)"
            stroke="var(--risk-moderate)"
            dot={false}
            strokeDasharray="4 4"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
