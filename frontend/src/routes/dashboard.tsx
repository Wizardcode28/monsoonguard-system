import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AlertCard } from "@/components/common/AlertCard";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/States";
import { PageHeader } from "@/components/common/PageHeader";
import { FalseOnsetWarning } from "@/components/forecast/FalseOnsetWarning";
import { ForecastCards, MonsoonStatusCard } from "@/components/forecast/ForecastSummary";
import { WhyThisForecast } from "@/components/forecast/WhyThisForecast";
import { ForecastTimeline } from "@/components/charts/ForecastTimeline";
import { PlanetaryTeleconnectionsCard } from "@/components/forecast/PlanetaryTeleconnectionsCard";
import { Button } from "@/components/ui/button";
import { useAlerts, useForecast } from "@/hooks/useMonsoonData";
import { useApp } from "@/hooks/useAppContext";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — MonsoonGuard" },
      {
        name: "description",
        content: "Monsoon onset, dry spell and heavy rainfall outlook for your block.",
      },
      { property: "og:title", content: "Farmer Dashboard — MonsoonGuard" },
      {
        property: "og:description",
        content: "Your hyperlocal 30-day monsoon outlook and crop advisory at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { blockId, block } = useApp();
  const { data: forecast, isLoading, isError, refetch } = useForecast(blockId, 30);
  const { data: alerts = [] } = useAlerts(blockId);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={`Monsoon Outlook for ${block.name}`}
          subtitle={`${block.district}, ${block.state} · Next 30 days`}
          actions={
            <Button asChild variant="outline">
              <Link to="/advisories">
                What should I do? <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />

        {isLoading && <LoadingSkeleton rows={4} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && !forecast && <EmptyState />}

        {forecast && (
          <>
            <MonsoonStatusCard forecast={forecast} />
            <ForecastCards forecast={forecast} />
            <FalseOnsetWarning forecast={forecast} />

            <section className="card-elevated p-5">
              <h2 className="text-lg font-semibold">30-day forecast timeline</h2>
              <p className="mb-3 text-sm text-muted-foreground">
                Expected rainfall, anomaly and dry spell probability.
              </p>
              <ForecastTimeline daily={forecast.daily} />
            </section>

            <PlanetaryTeleconnectionsCard />

            <WhyThisForecast drivers={forecast.drivers} />

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent alerts</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/alerts">View all</Link>
                </Button>
              </div>
              {alerts.length === 0 ? (
                <EmptyState title="No alerts for this location." />
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {alerts.slice(0, 2).map((a) => (
                    <AlertCard key={a.id} alert={a} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
