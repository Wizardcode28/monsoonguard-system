import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Share2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AdvisoryCard } from "@/components/common/AdvisoryCard";
import { CropSelector } from "@/components/common/CropSelector";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdvisories } from "@/hooks/useMonsoonData";
import { useApp } from "@/hooks/useAppContext";
import type { Crop, RiskLevel } from "@/types";

export const Route = createFileRoute("/advisories")({
  head: () => ({
    meta: [
      { title: "Crop Advisories — MonsoonGuard" },
      {
        name: "description",
        content:
          "Crop-specific sowing, irrigation and protection advice based on the monsoon outlook for your block.",
      },
      { property: "og:title", content: "Crop Advisories — MonsoonGuard" },
      {
        property: "og:description",
        content: "Know whether to sow, wait, irrigate or drain — crop by crop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdvisoriesPage,
});

const SEVERITIES: (RiskLevel | "ALL")[] = ["ALL", "CRITICAL", "HIGH", "MODERATE", "LOW"];

function AdvisoriesPage() {
  const { blockId, block } = useApp();
  const [crop, setCrop] = useState<Crop | "All">("All");
  const [severity, setSeverity] = useState<RiskLevel | "ALL">("ALL");
  const [language, setLanguage] = useState<string>("hi");

  const {
    data: advisories = [],
    isLoading,
    isError,
    refetch,
  } = useAdvisories(blockId, crop === "All" ? undefined : crop, language);

  const visible = useMemo(
    () => advisories.filter((a) => severity === "ALL" || a.severity === severity),
    [advisories, severity],
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="What should I do?"
          subtitle={`Crop advice for ${block.name}, ${block.district}`}
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => toast.success("Reading the advisory aloud in your language.")}
              >
                <Volume2 className="h-4 w-4" aria-hidden /> Listen
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Advisory shared with your village group.")}
              >
                <Share2 className="h-4 w-4" aria-hidden /> Share
              </Button>
            </>
          }
        />

        <div className="card-elevated space-y-4 p-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Crop
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCrop("All")}
                aria-pressed={crop === "All"}
                className={
                  crop === "All"
                    ? "rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    : "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
                }
              >
                All crops
              </button>
              <CropSelector
                value={crop === "All" ? ("Soybean" as Crop) : crop}
                onChange={(c) => setCrop(c)}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Regional Language
              </p>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger aria-label="Select language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Urgency
              </p>
              <Select value={severity} onValueChange={(v) => setSeverity(v as RiskLevel | "ALL")}>
                <SelectTrigger aria-label="Filter by urgency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "ALL" ? "All urgency levels" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading && <LoadingSkeleton rows={3} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && visible.length === 0 && (
          <EmptyState
            title="No advisory matches these filters."
            description="Try another crop or urgency level."
          />
        )}

        {visible.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {visible.map((a) => (
              <AdvisoryCard key={a.id} advisory={a} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
