import { CROPS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Crop } from "@/types";

export function CropSelector({
  value,
  onChange,
}: {
  value: Crop;
  onChange: (c: Crop) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Select crop">
      {CROPS.map((crop) => (
        <button
          key={crop}
          type="button"
          onClick={() => onChange(crop)}
          aria-pressed={value === crop}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            value === crop
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:bg-secondary",
          )}
        >
          {crop}
        </button>
      ))}
    </div>
  );
}
