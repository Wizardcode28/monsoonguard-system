import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Layers, Sun, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { RainfallChart } from "@/components/charts/RainfallChart";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/States";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS } from "@/data/mockData";
import { useAnalytics } from "@/hooks/useMonsoonData";
import { useApp } from "@/hooks/useAppContext";
import { riskHex } from "@/utils/risk";

export const Route = createFileRoute("/officer/analytics")({
  head: () => ({
    meta: [
      { title: "District Analytics — MonsoonGuard" },
      {
        name: "description",
        content:
          "Onset probability by block, dry spell distribution, rainfall anomaly and risk trend for the district.",
      },
      { property: "og:title", content: "District Analytics — MonsoonGuard" },
      {
        property: "og:description",
        content: "Data behind the monsoon advisories: trends, distributions and anomalies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfficerAnalyticsPage,
});

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
};

function OfficerAnalyticsPage() {
  const { districtId, setDistrictId } = useApp();
  const activeDistrict = districtId === "all" ? DISTRICTS[0]!.id : districtId;
  const { data: analytics, isLoading, isError, refetch } = useAnalytics(activeDistrict);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="District Analytics"
          subtitle="The signals and trends behind this week's advisories."
          actions={
            <Select value={activeDistrict} onValueChange={setDistrictId}>
              <SelectTrigger className="w-44" aria-label="District">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISTRICTS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        {isLoading && <LoadingSkeleton rows={4} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && !analytics && <EmptyState title="No analytics available." />}

        {analytics && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Layers} label="Blocks" value={analytics.totalBlocks} />
              <StatCard
                icon={AlertTriangle}
                label="High risk blocks"
                value={analytics.highRiskBlocks}
                tone="danger"
              />
              <StatCard
                icon={TrendingUp}
                label="False onset signals"
                value={analytics.falseOnsetBlocks}
                tone="warn"
              />
              <StatCard
                icon={Sun}
                label="Dry spell alerts"
                value={analytics.drySpellAlerts}
                tone="warn"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <section className="card-elevated p-5">
                <h2 className="text-lg font-semibold">Onset probability by block</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  Chance that the monsoon truly sets in within the next 14 days.
                </p>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.onsetByBlock}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="block" {...axis} interval={0} angle={-20} height={52} dy={12} />
                      <YAxis {...axis} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                      <Bar dataKey="onset" name="Onset probability" radius={[6, 6, 0, 0]} fill="var(--rain)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="card-elevated p-5">
                <h2 className="text-lg font-semibold">Dry spell risk distribution</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  How many blocks sit in each risk band right now.
                </p>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.drySpellDistribution}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="level" {...axis} />
                      <YAxis {...axis} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                      <Bar dataKey="count" name="Blocks" radius={[6, 6, 0, 0]}>
                        {analytics.drySpellDistribution.map((d) => (
                          <Cell key={d.level} fill={riskHex[d.level]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="card-elevated p-5">
                <h2 className="text-lg font-semibold">Expected vs normal rainfall</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  Rainfall anomaly across the coming weeks.
                </p>
                <RainfallChart data={analytics.expectedRainfall} />
              </section>

              <section className="card-elevated p-5">
                <h2 className="text-lg font-semibold">District risk trend</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  Combined risk score over the forecast window.
                </p>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.riskTrend}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="date" {...axis} />
                      <YAxis {...axis} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        name="Risk score"
                        stroke="var(--risk-high)"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <section className="card-elevated p-5">
              <h2 className="mb-3 text-lg font-semibold">Warnings by severity</h2>
              <div className="grid gap-3 sm:grid-cols-4">
                {analytics.alertsBySeverity.map((a) => (
                  <div key={a.severity} className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {a.severity}
                    </p>
                    <p className="text-2xl font-bold" style={{ color: riskHex[a.severity] }}>
                      {a.count}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
