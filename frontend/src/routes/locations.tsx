import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, MapPin, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskBadge } from "@/components/common/RiskBadge";
import { EmptyState, LoadingSkeleton } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DISTRICTS } from "@/data/mockData";
import { useApp } from "@/hooks/useAppContext";
import { useLocations, useRiskMap } from "@/hooks/useMonsoonData";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "My Locations — MonsoonGuard" },
      {
        name: "description",
        content:
          "Browse blocks and panchayats across Madhya Pradesh and set the location you farm in.",
      },
      { property: "og:title", content: "My Locations — MonsoonGuard" },
      {
        property: "og:description",
        content: "Pick your block to get rainfall predictions made for that exact area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  const { blockId, setBlockId } = useApp();
  const { data: blocks = [], isLoading } = useLocations();
  const { data: riskMap = [] } = useRiskMap();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blocks;
    return blocks.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q) ||
        b.panchayats.some((p) => p.toLowerCase().includes(q)),
    );
  }, [blocks, query]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="My Locations"
          subtitle={`${blocks.length} blocks across ${DISTRICTS.length} districts of Madhya Pradesh`}
        />

        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search block, district or village"
            aria-label="Search locations"
            className="pl-9"
          />
        </div>

        {isLoading && <LoadingSkeleton rows={3} />}
        {!isLoading && results.length === 0 && (
          <EmptyState
            title="No location found."
            description="Try the name of your block or district."
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((b) => {
            const risk = riskMap.find((r) => r.id === b.id);
            const selected = b.id === blockId;
            return (
              <article
                key={b.id}
                className={`card-elevated flex h-full flex-col gap-3 p-5 ${
                  selected ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="flex items-center gap-1.5 text-lg font-semibold">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden />
                      {b.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {b.district}, {b.state}
                    </p>
                  </div>
                  {risk && <RiskBadge level={risk.overallRisk} />}
                </div>

                {risk && (
                  <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3 text-center text-xs">
                    <div>
                      <dt className="text-muted-foreground">Onset</dt>
                      <dd className="text-base font-semibold">{risk.onsetRisk}%</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Dry spell</dt>
                      <dd className="text-base font-semibold">{risk.drySpellRisk}%</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Heavy rain</dt>
                      <dd className="text-base font-semibold">{risk.heavyRainRisk}%</dd>
                    </div>
                  </dl>
                )}

                <p className="text-xs text-muted-foreground">
                  Villages: {b.panchayats.slice(0, 3).join(", ")}
                </p>

                <div className="mt-auto flex gap-2 pt-2">
                  <Button
                    variant={selected ? "secondary" : "default"}
                    className="flex-1"
                    onClick={() => setBlockId(b.id)}
                  >
                    {selected ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden /> Current
                      </>
                    ) : (
                      "Set as my area"
                    )}
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/forecast" onClick={() => setBlockId(b.id)}>
                      Forecast
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
