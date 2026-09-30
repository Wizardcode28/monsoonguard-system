import { CloudOff, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No forecast available for this location.",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="card-elevated flex flex-col items-center gap-2 p-10 text-center">
      <CloudOff className="h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="card-elevated flex flex-col items-center gap-3 p-10 text-center">
      <p className="font-semibold">We couldn't load the forecast. Please try again.</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4" aria-hidden /> Try again
        </Button>
      )}
    </div>
  );
}

export function OfflineNotice() {
  return (
    <p className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
      <WifiOff className="h-3.5 w-3.5" aria-hidden /> Showing the latest available forecast.
    </p>
  );
}
