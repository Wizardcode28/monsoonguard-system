import { MapPin } from "lucide-react";
import { BLOCKS, DISTRICTS } from "@/data/mockData";
import { useApp } from "@/hooks/useAppContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocationSelector({ className }: { className?: string }) {
  const { blockId, setBlockId, block } = useApp();

  return (
    <Select value={blockId} onValueChange={setBlockId}>
      <SelectTrigger className={className} aria-label="Select location">
        <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden />
        <span className="truncate font-medium">
          {block.district}: {block.name}
        </span>
      </SelectTrigger>
      <SelectContent>
        {DISTRICTS.map((d) => (
          <SelectGroup key={d.id}>
            <SelectLabel>{d.name}</SelectLabel>
            {BLOCKS.filter((b) => b.districtId === d.id).map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {d.name} → {b.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
