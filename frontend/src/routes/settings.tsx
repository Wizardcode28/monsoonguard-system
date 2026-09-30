import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { CropSelector } from "@/components/common/CropSelector";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import { LocationSelector } from "@/components/common/LocationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/hooks/useAppContext";
import type { Crop } from "@/types";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MonsoonGuard" },
      {
        name: "description",
        content:
          "Choose your language, main crop, default block and how you want to receive monsoon warnings.",
      },
      { property: "og:title", content: "Settings — MonsoonGuard" },
      {
        property: "og:description",
        content: "Language, crop, location and alert preferences for MonsoonGuard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const LANGUAGES = ["English", "हिन्दी", "मराठी"];

function SettingsPage() {
  const { language, setLanguage, role } = useApp();
  const [crop, setCrop] = useState<Crop>("Soybean");
  const [name, setName] = useState(role === "officer" ? "R. Verma" : "Sarthak Patil");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [channels, setChannels] = useState({ sms: true, whatsapp: true, voice: false, push: true });

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <PageHeader title="Settings" subtitle="Language, crop, location and how we reach you." />

        <section className="card-elevated space-y-4 p-5">
          <h2 className="text-lg font-semibold">Language</h2>
          <p className="text-sm text-muted-foreground">
            Advisories and warnings are shown in the language you pick.
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLanguage(l);
                  toast.success(`Language set to ${l}.`);
                }}
                aria-pressed={language === l}
                className={
                  language === l
                    ? "rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    : "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
                }
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        <section className="card-elevated space-y-4 p-5">
          <h2 className="text-lg font-semibold">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Mobile number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Default location</Label>
            <LocationSelector className="w-full sm:w-72" />
          </div>
          <div className="space-y-2">
            <Label>Main crop</Label>
            <CropSelector value={crop} onChange={setCrop} />
          </div>
        </section>

        <section className="card-elevated space-y-4 p-5">
          <h2 className="text-lg font-semibold">How should we warn you?</h2>
          {(
            [
              ["sms", "SMS", "Short text message, works on any phone."],
              ["whatsapp", "WhatsApp", "Full advisory with pictures."],
              ["voice", "Voice call", "Spoken advisory in your language."],
              ["push", "App notification", "Instant alert inside the app."],
            ] as const
          ).map(([key, label, hint]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{hint}</p>
              </div>
              <Switch
                checked={channels[key]}
                onCheckedChange={(v) => setChannels((c) => ({ ...c, [key]: v }))}
                aria-label={label}
              />
            </div>
          ))}
        </section>

        <section className="card-elevated space-y-3 p-5">
          <h2 className="text-lg font-semibold">View as</h2>
          <p className="text-sm text-muted-foreground">
            Switch between the farmer view and the agricultural officer view.
          </p>
          <RoleSwitcher />
        </section>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Your preferences are saved.")}>
            Save preferences
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          MonsoonGuard · Ministry of Earth Sciences (MoES) & NCMRWF · Hyperlocal Monsoon Prediction System
        </p>
      </div>
    </AppShell>
  );
}
