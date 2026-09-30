import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingSkeleton, OfflineNotice } from "@/components/common/States";
import { ForecastTimeline } from "@/components/charts/ForecastTimeline";
import { RainfallChart } from "@/components/charts/RainfallChart";
import {
  DailyOutlook,
  ForecastCards,
  MonsoonStatusCard,
} from "@/components/forecast/ForecastSummary";
import { WhyThisForecast } from "@/components/forecast/WhyThisForecast";
import { FalseOnsetWarning } from "@/components/forecast/FalseOnsetWarning";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/hooks/useAppContext";
import { useForecast } from "@/hooks/useMonsoonData";
import type { Horizon } from "@/types";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Hyperlocal Forecast — MonsoonGuard" },
      {
        name: "description",
        content: "7, 14 and 30-day hyperlocal monsoon forecast for your block.",
      },
      { property: "og:title", content: "Hyperlocal Forecast — MonsoonGuard" },
      {
        property: "og:description",
        content: "Rainfall, dry spell and heavy rain probabilities for the next 30 days.",
      },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const { blockId, block } = useApp();
  const [horizon, setHorizon] = useState<Horizon>(7);
  const { data: forecast, isLoading, isError, refetch } = useForecast(blockId, horizon);
  const { data: long } = useForecast(blockId, 30);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Hyperlocal Monsoon Outlook"
          subtitle={`${block.name} Block · ${block.district}, ${block.state}`}
          actions={
            <Tabs value={String(horizon)} onValueChange={(v) => setHorizon(Number(v) as Horizon)}>
              <TabsList>
                <TabsTrigger value="7">7 Days</TabsTrigger>
                <TabsTrigger value="14">14 Days</TabsTrigger>
                <TabsTrigger value="30">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        />
        <OfflineNotice />

        {isLoading && <LoadingSkeleton rows={4} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && !forecast && <EmptyState />}

        {forecast && (
          <>
            <MonsoonStatusCard forecast={forecast} />
            <ForecastCards forecast={forecast} />
            <FalseOnsetWarning forecast={forecast} />

            <section>
              <h2 className="mb-3 text-lg font-semibold">7-Day Outlook</h2>
              <DailyOutlook forecast={forecast} />
            </section>

            <section className="card-elevated p-5">
              <h2 className="text-lg font-semibold">{horizon}-Day Trend</h2>
              <p className="mb-3 text-sm text-muted-foreground">
                Expected rainfall with dry spell and heavy rainfall probabilities.
              </p>
              <ForecastTimeline daily={forecast.daily} />
            </section>

            {long && (
              <section className="card-elevated p-5">
                <h2 className="text-lg font-semibold">Historical Context</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  Expected rainfall compared with the historical normal precipitation.
                </p>
                <RainfallChart
                  data={long.daily.map((d) => ({
                    date: d.date,
                    rainfall: d.rainfallMm,
                    normal: d.normalRainfallMm,
                  }))}
                />
              </section>
            )}

            <WhyThisForecast drivers={forecast.drivers} />
          </>
        )}
      </div>
    </AppShell>
  );
}
