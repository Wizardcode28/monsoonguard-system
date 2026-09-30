import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" role="img" aria-label="MonsoonGuard logo">
        <path
          d="M9 18a5 5 0 0 1 .6-9.96A7 7 0 0 1 23 9.5a4.5 4.5 0 0 1-.5 8.5z"
          fill="var(--rain-soft)"
          stroke="var(--rain)"
          strokeWidth="1.3"
        />
        <path d="M11 21l-1.5 4M16 21l-1.5 4M21 21l-1.5 4" stroke="var(--rain)" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M23 27c-4.2 0-6.6-2.4-6.6-6.4 4.4-.6 7.4 1.6 8 6.2z"
          fill="var(--leaf)"
        />
      </svg>
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          Monsoon<span className="text-primary">Guard</span>
        </span>
      )}
    </span>
  );
}
