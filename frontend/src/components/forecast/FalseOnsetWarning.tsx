import { AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Forecast } from "@/types";

export function FalseOnsetWarning({ forecast }: { forecast: Forecast }) {
  if (forecast.falseOnsetProbability < 50) return null;

  return (
    <section className="rounded-xl border border-risk-high/40 bg-risk-high/8 p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-risk-high">
        <AlertTriangle className="h-5 w-5" aria-hidden />
        Possible False Onset
      </h2>
      <p className="mt-2 text-sm">
        Initial rainfall is likely, but a prolonged dry spell may follow.
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-card p-3">
          <dt className="text-xs text-muted-foreground">Onset probability</dt>
          <dd className="text-2xl font-bold tabular-nums">{forecast.onsetProbability}%</dd>
        </div>
        <div className="rounded-lg bg-card p-3">
          <dt className="text-xs text-muted-foreground">Dry spell probability after onset</dt>
          <dd className="text-2xl font-bold tabular-nums">{forecast.falseOnsetProbability}%</dd>
        </div>
      </dl>

      <p className="mt-4 rounded-lg bg-card p-3 text-sm font-semibold">
        Recommendation: Consider delaying sowing until rainfall becomes more persistent.
      </p>

      <Accordion type="single" collapsible className="mt-2">
        <AccordionItem value="why" className="border-b-0">
          <AccordionTrigger className="text-sm">Why am I seeing this?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            The first rains of the season sometimes stop for a week or more. If you sow right after
            those first showers, young plants can dry out. For {forecast.locationName}, rain is
            likely to start soon, but the chance of a long gap after it is{" "}
            {forecast.falseOnsetProbability}%, with an expected dry period of about{" "}
            {forecast.expectedDrySpellDays} days. Waiting for steady rain is safer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
