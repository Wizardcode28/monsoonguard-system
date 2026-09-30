import { AlertTriangle, CloudRain, MapPin, Sprout, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "./RiskBadge";
import type { AlertItem } from "@/types";
import { formatDateTime } from "@/utils/risk";

const ICONS = {
  "false-onset": AlertTriangle,
  "heavy-rain": CloudRain,
  "dry-spell": Sun,
  sowing: Sprout,
} as const;

export function AlertCard({
  alert,
  onMarkRead,
}: {
  alert: AlertItem;
  onMarkRead?: (id: string) => void;
}) {
  const Icon = ICONS[alert.icon];
  return (
    <article className="card-elevated flex gap-4 p-5">
      <span className="h-fit rounded-xl bg-muted p-2.5">
        <Icon className="h-5 w-5 text-foreground" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{alert.title}</h3>
          <RiskBadge level={alert.severity} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {alert.locationName} · {formatDateTime(alert.createdAt)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{alert.explanation}</p>
        <p className="mt-2 text-sm font-medium">Action: {alert.action}</p>
        {onMarkRead && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 -ml-2"
            disabled={alert.read}
            onClick={() => onMarkRead(alert.id)}
          >
            {alert.read ? "Read" : "Mark as read"}
          </Button>
        )}
      </div>
    </article>
  );
}
