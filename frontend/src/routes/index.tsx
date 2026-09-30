import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CloudRain,
  CloudSun,
  Leaf,
  Map,
  Satellite,
  Sprout,
  Sun,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MonsoonGuard — Hyperlocal Monsoon Intelligence for Farmers" },
      {
        name: "description",
        content:
          "Predict monsoon onset, dry spells and heavy rainfall at block and village-cluster level up to 30 days ahead.",
      },
      { property: "og:title", content: "MonsoonGuard — Hyperlocal Monsoon Intelligence" },
      {
        property: "og:description",
        content:
          "AI-powered monsoon onset, break and heavy-rainfall prediction with crop advisories for Indian farmers and agricultural officers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <RoleSwitcher className="hidden sm:flex" />
            <Button asChild size="sm">
              <Link to="/dashboard">Open app</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-surface grid-backdrop">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <Satellite className="h-3.5 w-3.5" aria-hidden /> Block-level monsoon intelligence
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Know the Monsoon Before You Sow.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Hyperlocal AI-powered monsoon intelligence for smarter agricultural decisions.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Predict monsoon onset, dry spells and heavy rainfall at block and village-cluster
              level up to 30 days ahead.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/forecast">
                  Explore Forecast <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/map">View Risk Map</Link>
              </Button>
            </div>
          </div>

          <HeroIllustration />
        </div>
      </section>

      <Section
        title="Why Hyperlocal?"
        lead="District-level forecasts can hide major differences between nearby blocks."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "Berasia", onset: 82, note: "Dry spell likely after onset" },
            { name: "Phanda", onset: 65, note: "Extended break risk" },
            { name: "Huzur", onset: 89, note: "Steady rainfall expected" },
          ].map((b) => (
            <div key={b.name} className="card-elevated p-5">
              <p className="text-sm text-muted-foreground">{b.name} block</p>
              <p className="text-3xl font-bold tabular-nums">{b.onset}%</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Three blocks in the same district, three very different sowing decisions.
        </p>
      </Section>

      <Section title="What We Predict" className="bg-surface">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature
            icon={CloudSun}
            title="Monsoon Onset"
            text="When rains are likely to begin in your block — and how confident the model is."
          />
          <Feature
            icon={Sun}
            title="Dry Spell / Break"
            text="The chance and likely length of a break after the first showers."
          />
          <Feature
            icon={CloudRain}
            title="Heavy Rainfall"
            text="Short bursts of intense rain that need drainage and harvest protection."
          />
        </div>
      </Section>

      <Section title="How It Works">
        <ol className="grid gap-3 md:grid-cols-5">
          {[
            { icon: Satellite, label: "Climate Signals" },
            { icon: CloudRain, label: "Regional Weather" },
            { icon: Brain, label: "AI Model" },
            { icon: Map, label: "Hyperlocal Prediction" },
            { icon: Sprout, label: "Farmer Advisory" },
          ].map((s, i) => (
            <li key={s.label} className="card-elevated flex items-center gap-3 p-4">
              <s.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="text-sm font-medium">{s.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{i + 1}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-elevated p-6">
            <Leaf className="h-6 w-6 text-leaf" aria-hidden />
            <h3 className="mt-3 text-xl font-semibold">For Farmers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Simple, actionable alerts in plain language: what is likely to happen, and what to do
              about it — crop by crop.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/advisories">See advisories</Link>
            </Button>
          </div>
          <div className="card-elevated p-6">
            <BarChart3 className="h-6 w-6 text-rain" aria-hidden />
            <h3 className="mt-3 text-xl font-semibold">For Agricultural Officers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Block-level monitoring, risk mapping and district analytics to prioritise field
              action where it matters most.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/officer">Open officer dashboard</Link>
            </Button>
          </div>
        </div>
      </Section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Explore Your Area</h2>
          <p className="mt-2 text-muted-foreground">
            Pick a block and see the monsoon outlook, risk map and crop advisory instantly.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/dashboard">
              Explore Your Area <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
          MonsoonGuard prototype · All forecast values shown are demonstration data, not official
          predictions.
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  lead,
  children,
  className = "",
}: {
  title?: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-b border-border ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {title && <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>}
        {lead && <p className="mt-2 max-w-2xl text-muted-foreground">{lead}</p>}
        <div className={title ? "mt-6" : ""}>{children}</div>
      </div>
    </section>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CloudRain;
  title: string;
  text: string;
}) {
  return (
    <div className="card-elevated p-5">
      <Icon className="h-6 w-6 text-primary" aria-hidden />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="card-elevated relative overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Berasia · Bhopal</p>
        <span className="rounded-full bg-risk-moderate/20 px-2.5 py-1 text-xs font-semibold text-risk-moderate">
          MODERATE
        </span>
      </div>
      <p className="mt-4 text-5xl font-bold tabular-nums text-primary">82%</p>
      <p className="text-sm text-muted-foreground">monsoon onset probability · next 7 days</p>

      <div className="mt-6 flex h-32 items-end gap-1.5" aria-hidden>
        {[8, 14, 6, 18, 22, 10, 4, 2, 6, 16, 26, 20, 12, 7, 5].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-rain"
            style={{ height: `${(h / 26) * 100}%`, opacity: 0.35 + (h / 26) * 0.65 }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-secondary p-2">
          <p className="font-bold">61%</p>
          <p className="text-muted-foreground">Dry spell</p>
        </div>
        <div className="rounded-lg bg-secondary p-2">
          <p className="font-bold">34%</p>
          <p className="text-muted-foreground">Heavy rain</p>
        </div>
        <div className="rounded-lg bg-secondary p-2">
          <p className="font-bold">-12%</p>
          <p className="text-muted-foreground">Anomaly</p>
        </div>
      </div>
    </div>
  );
}
