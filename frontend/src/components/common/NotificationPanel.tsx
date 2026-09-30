import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RiskBadge } from "./RiskBadge";
import { useAlerts } from "@/hooks/useMonsoonData";
import { formatDateTime } from "@/utils/risk";

export function NotificationPanel() {
  const { data: alerts = [] } = useAlerts();
  const unread = alerts.filter((a) => !a.read && a.status === "active");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk-critical px-1 text-[10px] font-bold text-primary-foreground">
              {unread.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
        </div>
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {alerts.slice(0, 5).map((a) => (
            <li key={a.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{a.title}</p>
                <RiskBadge level={a.severity} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.locationName} · {formatDateTime(a.createdAt)}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" className="w-full">
            <Link to="/alerts">View all alerts</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
