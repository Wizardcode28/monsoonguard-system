import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskBadge } from "@/components/common/RiskBadge";
import { EmptyState, LoadingSkeleton } from "@/components/common/States";
import { RiskLegend, RiskMap, riskValue } from "@/components/map/RiskMap";
import { Button } from "@/components/ui/button";
import { OutboundDispatchModal } from "@/components/common/OutboundDispatchModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS, STATES } from "@/data/mockData";
import { useApp } from "@/hooks/useAppContext";
import { useRiskMap } from "@/hooks/useMonsoonData";
import type { Horizon, RiskType } from "@/types";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Hyperlocal Risk Map — MonsoonGuard" },
      {
        name: "description",
        content: "Block-level monsoon risk map for onset, dry spell and heavy rainfall.",
      },
      { property: "og:title", content: "Hyperlocal Risk Map — MonsoonGuard" },
      {
        property: "og:description",
        content: "Compare monsoon risk across blocks and open a detailed forecast.",
      },
    ],
  }),
  component: MapPage,
});

const RISK_LABELS: Record<RiskType, string> = {
  overall: "Overall Risk",
  onset: "Onset Risk",
  drySpell: "Dry Spell Risk",
  heavyRain: "Heavy Rain Risk",
};

export function RiskMapView({ officer = false }: { officer?: boolean }) {
  const { districtId, setDistrictId, blockId, setBlockId } = useApp();
  const [riskType, setRiskType] = useState<RiskType>("overall");
  const [horizon, setHorizon] = useState<Horizon>(7);
  const { data: locations = [], isLoading } = useRiskMap(districtId);
  const selected = useMemo(() => locations.find((l) => l.id === blockId), [locations, blockId]);

  return (
    <div className="space-y-4">
      <div className="card-elevated grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <Field label="State">
          <Select value={STATES[0] ?? "Madhya Pradesh"} onValueChange={() => undefined}>
            <SelectTrigger aria-label="State">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="District">
          <Select value={districtId} onValueChange={setDistrictId}>
            <SelectTrigger aria-label="District">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All districts</SelectItem>
              {DISTRICTS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Block">
          <Select value={blockId} onValueChange={setBlockId}>
            <SelectTrigger aria-label="Block">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Forecast horizon">
          <Select value={String(horizon)} onValueChange={(v) => setHorizon(Number(v) as Horizon)}>
            <SelectTrigger aria-label="Forecast horizon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Risk type">
          <Select value={riskType} onValueChange={(v) => setRiskType(v as RiskType)}>
            <SelectTrigger aria-label="Risk type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(RISK_LABELS) as RiskType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {RISK_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {isLoading ? (
            <LoadingSkeleton rows={2} />
          ) : locations.length === 0 ? (
            <EmptyState title="No blocks available for this district." />
          ) : (
            <RiskMap
              locations={locations}
              riskType={riskType}
              selectedId={blockId}
              onSelect={setBlockId}
            />
          )}
          <div className="card-elevated flex flex-wrap items-center justify-between gap-3 p-3">
            <RiskLegend />
            <p className="text-xs text-muted-foreground">
              Showing {RISK_LABELS[riskType]} · {horizon}-day horizon
            </p>
          </div>
        </div>

        <aside className="card-elevated h-fit p-5">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.district}</p>
                </div>
                <RiskBadge level={selected.overallRisk} />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Onset" value={`${selected.onsetRisk}%`} />
                <Row label="Dry Spell" value={`${selected.drySpellRisk}%`} />
                <Row label="Heavy Rain" value={`${selected.heavyRainRisk}%`} />
                <Row label={RISK_LABELS[riskType]} value={`${riskValue(selected, riskType)}%`} />
                <Row label="Advisory" value={selected.advisoryStatus} />
              </dl>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link to="/forecast">View Detailed Forecast</Link>
                </Button>
                <OutboundDispatchModal
                  blockId={selected.id}
                  blockName={selected.name}
                  defaultTitle={`Moisture & Break Alert for ${selected.name}`}
                  riskLevel={selected.overallRisk}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a block on the map to see details.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function MapPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Hyperlocal Risk Map"
          subtitle="Block-level monsoon risk across districts"
        />
        <RiskMapView />
      </div>
    </AppShell>
  );
}
