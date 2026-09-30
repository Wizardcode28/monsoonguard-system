import { Check } from "lucide-react";

export function WhyThisForecast({ drivers }: { drivers: string[] }) {
  return (
    <section className="card-elevated p-5">
      <h2 className="text-lg font-semibold">Why this forecast?</h2>
      <p className="mt-1 text-sm text-muted-foreground">The prediction considers:</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {drivers.map((d) => (
          <li key={d} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
    </section>
  );
}
