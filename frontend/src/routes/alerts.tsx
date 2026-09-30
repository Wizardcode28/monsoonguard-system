import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AlertCard } from "@/components/common/AlertCard";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { OutboundDispatchModal } from "@/components/common/OutboundDispatchModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlerts } from "@/hooks/useMonsoonData";
import { useApp } from "@/hooks/useAppContext";
import type { AlertItem } from "@/types";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Early Warnings — MonsoonGuard" },
      {
        name: "description",
        content:
          "Early warnings for false monsoon onset, long dry spells and heavy rainfall in your block.",
      },
      { property: "og:title", content: "Early Warnings — MonsoonGuard" },
      {
        property: "og:description",
        content: "Act before the damage: false onset, dry spell and heavy rain warnings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlertsPage,
});

type Filter = "all" | "active" | "unread" | "resolved";

function AlertsPage() {
  const { blockId, role } = useApp();
  const { data, isLoading, isError, refetch } = useAlerts(role === "officer" ? undefined : blockId);
  const [items, setItems] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));

  const markAllRead = () => {
    setItems((prev) => prev.map((a) => ({ ...a, read: true })));
    toast.success("All warnings marked as read.");
  };

  const visible = useMemo(
    () =>
      items.filter((a) =>
        filter === "all"
          ? true
          : filter === "unread"
            ? !a.read
            : filter === "active"
              ? a.status === "active"
              : a.status === "resolved",
      ),
    [items, filter],
  );

  const critical = items.filter((a) => a.severity === "CRITICAL").length;
  const active = items.filter((a) => a.status === "active").length;
  const unread = items.filter((a) => !a.read).length;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Early Warnings"
          subtitle="Warnings are sent before the weather changes, so there is time to act."
          actions={
            <div className="flex items-center gap-2">
              <OutboundDispatchModal blockId={blockId} blockName={useApp().block.name} />
              <Button variant="outline" onClick={markAllRead} disabled={unread === 0}>
                <CheckCheck className="h-4 w-4" aria-hidden /> Mark all read
              </Button>
            </div>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard icon={BellRing} label="Active warnings" value={active} tone="warn" />
          <StatCard icon={BellRing} label="Critical" value={critical} tone="danger" />
          <StatCard icon={BellRing} label="Unread" value={unread} />
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading && <LoadingSkeleton rows={3} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && visible.length === 0 && (
          <EmptyState
            title="No warnings here."
            description="You will be told as soon as something changes."
          />
        )}

        <div className="grid gap-3 lg:grid-cols-2">
          {visible.map((a) => (
            <AlertCard key={a.id} alert={a} onMarkRead={markRead} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
