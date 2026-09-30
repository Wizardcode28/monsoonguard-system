import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CloudRain, Layers, Send, Sun, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { AlertCard } from "@/components/common/AlertCard";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { OutboundDispatchModal } from "@/components/common/OutboundDispatchModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS } from "@/data/mockData";
import { useAlerts, useAnalytics, useRiskMap } from "@/hooks/useMonsoonData";
import { useApp } from "@/hooks/useAppContext";

export const Route = createFileRoute("/officer/")({
  head: () => ({
    meta: [
      { title: "Officer Command Centre — MonsoonGuard" },
      {
        name: "description",
        content:
          "District-wide monsoon risk overview for agricultural officers: blocks at risk, advisory coverage and alert dispatch.",
      },
      { property: "og:title", content: "Officer Command Centre — MonsoonGuard" },
      {
        property: "og:description",
        content: "Monitor every block, see where risk is rising and dispatch advisories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfficerDashboard,
});

function OfficerDashboard() {
  const { districtId, setDistrictId, setBlockId } = useApp();
  const activeDistrict = districtId === "all" ? DISTRICTS[0]!.id : districtId;
  const { data: analytics, isLoading, isError, refetch } = useAnalytics(activeDistrict);
  const { data: locations = [] } = useRiskMap(activeDistrict);
  const { data: alerts = [] } = useAlerts();

  const ranked = [...locations].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="District Command Centre"
          subtitle="Block-level monsoon risk, advisory coverage and early warnings."
          actions={
            <>
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
              <OutboundDispatchModal
                blockId={ranked[0]?.id || "berasia"}
                blockName={ranked[0]?.name || "Berasia"}
                defaultTitle="District-Wide Monsoon Break & Moisture Advisory"
                defaultMessage="Dry spell predicted over next 5-8 days. Delay seed sowing or arrange supplemental micro-irrigation."
              />
            </>
          }
        />

        {isLoading && <LoadingSkeleton rows={4} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && !analytics && <EmptyState title="No district data available." />}

        {analytics && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Layers} label="Blocks monitored" value={analytics.totalBlocks} />
              <StatCard
                icon={AlertTriangle}
                label="Blocks at high risk"
                value={analytics.highRiskBlocks}
                tone="danger"
              />
              <StatCard
                icon={Sun}
                label="Dry spell alerts"
                value={analytics.drySpellAlerts}
                tone="warn"
              />
              <StatCard
                icon={CloudRain}
                label="Heavy rain alerts"
                value={analytics.heavyRainAlerts}
                tone="warn"
              />
            </div>

            <section className="card-elevated p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Blocks ranked by risk</h2>
                  <p className="text-sm text-muted-foreground">
                    {analytics.falseOnsetBlocks} blocks show a false-onset signal this week.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/officer/map">Open risk map</Link>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Block</th>
                      <th className="py-2 pr-3 font-medium">Onset</th>
                      <th className="py-2 pr-3 font-medium">Dry spell</th>
                      <th className="py-2 pr-3 font-medium">Heavy rain</th>
                      <th className="py-2 pr-3 font-medium">Advisory</th>
                      <th className="py-2 pr-3 font-medium">Risk</th>
                      <th className="py-2 font-medium sr-only">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((l) => (
                      <tr key={l.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3 pr-3 font-medium">{l.name}</td>
                        <td className="py-3 pr-3">{l.onsetRisk}%</td>
                        <td className="py-3 pr-3">{l.drySpellRisk}%</td>
                        <td className="py-3 pr-3">{l.heavyRainRisk}%</td>
                        <td className="py-3 pr-3 text-muted-foreground">{l.advisoryStatus}</td>
                        <td className="py-3 pr-3">
                          <RiskBadge level={l.overallRisk} />
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            onClick={() => setBlockId(l.id)}
                          >
                            <Link to="/forecast">Details</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="card-elevated p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
                  Advisory coverage
                </h2>
                <ul className="space-y-2 text-sm">
                  {analytics.advisoryDistribution.map((a) => (
                    <li key={a.crop} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 font-medium">{a.crop}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(100, a.count * 12)}%` }}
                        />
                      </span>
                      <span className="w-10 text-right text-muted-foreground">{a.count}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/advisories">Review advisories</Link>
                </Button>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Latest warnings</h2>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/alerts">View all</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((a) => (
                    <AlertCard key={a.id} alert={a} />
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
