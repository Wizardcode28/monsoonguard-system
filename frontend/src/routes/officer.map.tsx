import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskMapView } from "@/routes/map";

export const Route = createFileRoute("/officer/map")({
  head: () => ({
    meta: [
      { title: "Regional Risk Map — MonsoonGuard" },
      {
        name: "description",
        content:
          "Compare monsoon onset, dry spell and heavy rainfall risk across every block in the district.",
      },
      { property: "og:title", content: "Regional Risk Map — MonsoonGuard" },
      {
        property: "og:description",
        content: "Block-by-block risk comparison for agricultural officers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfficerMapPage,
});

function OfficerMapPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Regional Risk Map"
          subtitle="Switch between onset, dry spell and heavy rainfall to see where risk is concentrated."
        />
        <RiskMapView officer />
      </div>
    </AppShell>
  );
}
