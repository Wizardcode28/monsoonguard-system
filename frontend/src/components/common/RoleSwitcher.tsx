import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/hooks/useAppContext";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export function RoleSwitcher({ className }: { className?: string }) {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  const select = (next: Role) => {
    setRole(next);
    navigate({ to: next === "officer" ? "/officer" : "/dashboard" });
  };

  return (
    <div
      className={cn("flex rounded-full border border-border bg-card p-0.5 text-xs", className)}
      role="group"
      aria-label="Switch role"
    >
      {(["farmer", "officer"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => select(r)}
          aria-pressed={role === r}
          className={cn(
            "rounded-full px-3 py-1.5 font-semibold capitalize transition-colors",
            role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {r === "officer" ? "Officer" : "Farmer"}
        </button>
      ))}
    </div>
  );
}
