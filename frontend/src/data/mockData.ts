// MOCK DATA — replace with backend API after integration.
// All numbers are fictional prototype values for demonstration only.

import type {
  Advisory,
  AlertItem,
  Block,
  Crop,
  DailyForecast,
  District,
  Forecast,
  Horizon,
  RiskMapLocation,
} from "@/types";
import { riskFromScore } from "@/utils/risk";

export const DISTRICTS: District[] = [
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh" },
  { id: "sehore", name: "Sehore", state: "Madhya Pradesh" },
  { id: "vidisha", name: "Vidisha", state: "Madhya Pradesh" },
];

export const STATES = ["Madhya Pradesh"];

export const BLOCKS: Block[] = [
  {
    id: "berasia",
    name: "Berasia",
    districtId: "bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.63,
    longitude: 77.43,
    panchayats: ["Nazirabad", "Parwalia", "Chandpur", "Kurana"],
  },
  {
    id: "phanda",
    name: "Phanda",
    districtId: "bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.28,
    longitude: 77.28,
    panchayats: ["Bilkisganj", "Ratibad", "Neelbad"],
  },
  {
    id: "huzur",
    name: "Huzur",
    districtId: "bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.19,
    longitude: 77.52,
    panchayats: ["Kolar", "Misrod", "Bagroda"],
  },
  {
    id: "ashta",
    name: "Ashta",
    districtId: "sehore",
    district: "Sehore",
    state: "Madhya Pradesh",
    latitude: 23.02,
    longitude: 76.72,
    panchayats: ["Jawar", "Kannod", "Siddiqganj"],
  },
  {
    id: "sehore-block",
    name: "Sehore",
    districtId: "sehore",
    district: "Sehore",
    state: "Madhya Pradesh",
    latitude: 23.2,
    longitude: 77.08,
    panchayats: ["Doraha", "Amlaha", "Shyampur"],
  },
  {
    id: "ichhawar",
    name: "Ichhawar",
    districtId: "sehore",
    district: "Sehore",
    state: "Madhya Pradesh",
    latitude: 23.03,
    longitude: 77.01,
    panchayats: ["Diwadiya", "Brijishnagar", "Nasrullaganj"],
  },
  {
    id: "vidisha-block",
    name: "Vidisha",
    districtId: "vidisha",
    district: "Vidisha",
    state: "Madhya Pradesh",
    latitude: 23.52,
    longitude: 77.81,
    panchayats: ["Pathari", "Sanchi Road", "Haidergarh"],
  },
  {
    id: "gyaraspur",
    name: "Gyaraspur",
    districtId: "vidisha",
    district: "Vidisha",
    state: "Madhya Pradesh",
    latitude: 23.67,
    longitude: 78.11,
    panchayats: ["Unarsi", "Pathari Kalan"],
  },
  {
    id: "basoda",
    name: "Basoda",
    districtId: "vidisha",
    district: "Vidisha",
    state: "Madhya Pradesh",
    latitude: 23.85,
    longitude: 77.93,
    panchayats: ["Tyonda", "Mandi Bamora"],
  },
  {
    id: "kurwai",
    name: "Kurwai",
    districtId: "vidisha",
    district: "Vidisha",
    state: "Madhya Pradesh",
    latitude: 24.11,
    longitude: 78.03,
    panchayats: ["Bahadurpur", "Pipalkheda"],
  },
];

interface BlockSignal {
  onset: number;
  falseOnset: number;
  drySpell: number;
  heavyRain: number;
  anomaly: number;
  drySpellDays: number;
  confidence: "Low" | "Medium" | "High";
}

export const BLOCK_SIGNALS: Record<string, BlockSignal> = {
  berasia: { onset: 82, falseOnset: 68, drySpell: 61, heavyRain: 34, anomaly: -12, drySpellDays: 9, confidence: "High" },
  phanda: { onset: 65, falseOnset: 54, drySpell: 73, heavyRain: 29, anomaly: -19, drySpellDays: 12, confidence: "Medium" },
  huzur: { onset: 89, falseOnset: 21, drySpell: 24, heavyRain: 48, anomaly: 8, drySpellDays: 4, confidence: "High" },
  ashta: { onset: 71, falseOnset: 44, drySpell: 52, heavyRain: 38, anomaly: -6, drySpellDays: 7, confidence: "Medium" },
  "sehore-block": { onset: 77, falseOnset: 31, drySpell: 41, heavyRain: 55, anomaly: 4, drySpellDays: 6, confidence: "High" },
  ichhawar: { onset: 58, falseOnset: 62, drySpell: 79, heavyRain: 22, anomaly: -24, drySpellDays: 14, confidence: "Medium" },
  "vidisha-block": { onset: 84, falseOnset: 27, drySpell: 33, heavyRain: 61, anomaly: 11, drySpellDays: 5, confidence: "High" },
  gyaraspur: { onset: 62, falseOnset: 58, drySpell: 68, heavyRain: 26, anomaly: -17, drySpellDays: 11, confidence: "Low" },
  basoda: { onset: 74, falseOnset: 39, drySpell: 47, heavyRain: 72, anomaly: 16, drySpellDays: 5, confidence: "Medium" },
  kurwai: { onset: 55, falseOnset: 49, drySpell: 57, heavyRain: 31, anomaly: -9, drySpellDays: 8, confidence: "Medium" },
};

export const DRIVERS = [
  "Recent rainfall in the last 10 days",
  "Historical rainfall patterns for this block",
  "ENSO (El Niño / La Niña) conditions",
  "Indian Ocean Dipole (IOD)",
  "Madden–Julian Oscillation (MJO)",
  "Temperature and humidity trends",
  "Soil moisture estimates",
  "Local geography and terrain",
];

/** Deterministic pseudo-random so the demo is stable across reloads. */
function seeded(seed: string, i: number) {
  let h = 0;
  const s = `${seed}-${i}`;
  for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) % 100000;
  return (h % 1000) / 1000;
}

export function overallScore(s: BlockSignal) {
  return Math.round(s.drySpell * 0.45 + s.heavyRain * 0.3 + (100 - s.onset) * 0.25);
}

function buildDaily(blockId: string, days: number): DailyForecast[] {
  const signal = BLOCK_SIGNALS[blockId]!;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const r = seeded(blockId, i);
    const onsetWave = Math.max(0, Math.sin((i / days) * Math.PI * 1.4));
    const normal = 6 + Math.round(onsetWave * 12);
    const rainfall = Math.max(
      0,
      Math.round((normal * (1 + signal.anomaly / 100) + (r - 0.45) * 14) * 10) / 10,
    );
    const date = new Date(start.getTime() + i * 86400000);
    return {
      date: date.toISOString().slice(0, 10),
      rainfallMm: rainfall,
      normalRainfallMm: normal,
      anomalyPct: Math.round(((rainfall - normal) / Math.max(normal, 1)) * 100),
      onsetProbability: Math.min(97, Math.round(signal.onset * (0.6 + 0.4 * (i / days)) + r * 8)),
      drySpellProbability: Math.min(96, Math.max(5, Math.round(signal.drySpell + (r - 0.5) * 22))),
      heavyRainProbability: Math.min(94, Math.max(3, Math.round(signal.heavyRain + (r - 0.5) * 20))),
    };
  });
}

export function buildForecast(blockId: string, horizon: Horizon): Forecast {
  const block = BLOCKS.find((b) => b.id === blockId) ?? BLOCKS[0]!;
  const signal = BLOCK_SIGNALS[block.id]!;
  const daily = buildDaily(block.id, horizon);
  const total = daily.reduce((a, d) => a + d.rainfallMm, 0);
  const normal = daily.reduce((a, d) => a + d.normalRainfallMm, 0);
  const updated = new Date();
  updated.setHours(6, 0, 0, 0);

  return {
    locationId: block.id,
    locationName: block.name,
    district: block.district,
    state: block.state,
    forecastDate: new Date().toISOString(),
    horizon,
    onsetProbability: signal.onset,
    falseOnsetProbability: signal.falseOnset,
    drySpellProbability: signal.drySpell,
    heavyRainProbability: signal.heavyRain,
    rainfallMin: Math.round(total * 0.8),
    rainfallMax: Math.round(total * 1.2),
    rainfallAnomaly: signal.anomaly,
    normalRainfall: Math.round(normal),
    expectedDrySpellDays: signal.drySpellDays,
    confidence: signal.confidence,
    overallRisk: riskFromScore(overallScore(signal)),
    updatedAt: updated.toISOString(),
    drivers: DRIVERS,
    daily,
  };
}

export function buildRiskMap(districtId?: string): RiskMapLocation[] {
  return BLOCKS.filter((b) => !districtId || districtId === "all" || b.districtId === districtId).map(
    (b) => {
      const s = BLOCK_SIGNALS[b.id]!;
      const score = overallScore(s);
      return {
        id: b.id,
        name: b.name,
        district: b.district,
        latitude: b.latitude,
        longitude: b.longitude,
        onsetRisk: s.onset,
        drySpellRisk: s.drySpell,
        heavyRainRisk: s.heavyRain,
        overallScore: score,
        overallRisk: riskFromScore(score),
        advisoryStatus: "Active" as const,
      };
    },
  );
}

export const CROPS: Crop[] = ["Soybean", "Wheat", "Maize", "Paddy", "Cotton", "Chickpea"];

interface CropTemplate {
  risk: string;
  action: string;
  reason: string;
  recommendation: string;
  preparation: string[];
}

const CROP_TEMPLATES: Record<Crop, CropTemplate> = {
  Soybean: {
    risk: "False onset",
    action: "Delay sowing",
    reason:
      "Rainfall may begin soon, but the probability of a dry spell after the initial rainfall is high.",
    recommendation: "Wait for more persistent rainfall before sowing.",
    preparation: ["Seed treatment", "Field preparation", "Irrigation backup", "Moisture conservation"],
  },
  Paddy: {
    risk: "Heavy rainfall",
    action: "Prepare field drainage",
    reason: "Short bursts of heavy rainfall are likely during the coming fortnight.",
    recommendation: "Clear drainage channels and strengthen bunds before the first heavy spell.",
    preparation: ["Clear drains", "Repair bunds", "Nursery protection", "Check pump sets"],
  },
  Cotton: {
    risk: "Dry spell",
    action: "Monitor soil moisture",
    reason: "A prolonged break in rainfall may follow the first showers.",
    recommendation: "Keep protective irrigation ready and mulch to conserve moisture.",
    preparation: ["Mulching", "Protective irrigation", "Weed control", "Soil moisture check"],
  },
  Maize: {
    risk: "Delayed onset",
    action: "Prepare, but wait for suitable moisture",
    reason: "Onset may arrive later than usual for this block.",
    recommendation: "Complete land preparation and sow only after 50–60 mm of accumulated rain.",
    preparation: ["Land preparation", "Seed selection", "Fertiliser planning", "Rain gauge check"],
  },
  Wheat: {
    risk: "Rainfall anomaly",
    action: "Plan residual moisture use",
    reason: "Below-normal rainfall may reduce stored soil moisture for the next season.",
    recommendation: "Prioritise moisture conservation practices through the monsoon.",
    preparation: ["Field bunding", "Residue retention", "Irrigation scheduling"],
  },
  Chickpea: {
    risk: "Dry spell",
    action: "Conserve soil moisture",
    reason: "Extended dry periods may reduce stored moisture for the following sowing window.",
    recommendation: "Adopt conservation tillage and avoid unnecessary field operations.",
    preparation: ["Conservation tillage", "Mulching", "Weed management"],
  },
};

export function buildAdvisories(locationId: string, crop?: Crop): Advisory[] {
  const block = BLOCKS.find((b) => b.id === locationId) ?? BLOCKS[0]!;
  const signal = BLOCK_SIGNALS[block.id]!;
  const from = new Date();
  const until = new Date(Date.now() + 10 * 86400000);
  const list = (crop ? [crop] : CROPS).map((c, i) => {
    const t = CROP_TEMPLATES[c];
    const score = Math.min(95, overallScore(signal) + i * 3);
    return {
      id: `${block.id}-${c.toLowerCase()}`,
      locationId: block.id,
      crop: c,
      risk: t.risk,
      action: t.action,
      severity: riskFromScore(score),
      title: `${c} Advisory`,
      message: t.reason,
      recommendation: t.recommendation,
      preparation: t.preparation,
      confidence: signal.confidence,
      validFrom: from.toISOString(),
      validUntil: until.toISOString(),
    } satisfies Advisory;
  });
  return list;
}

export function buildAlerts(locationId?: string): AlertItem[] {
  const now = Date.now();
  const base: Omit<AlertItem, "locationName">[] = [
    {
      id: "a1",
      locationId: "berasia",
      title: "Possible false onset detected",
      severity: "HIGH",
      status: "active",
      icon: "false-onset",
      createdAt: new Date(now - 2 * 3600000).toISOString(),
      explanation:
        "Early rainfall is likely within a week, but a dry spell of about 9 days may follow soon after.",
      action: "Delay sowing until rainfall becomes persistent.",
      read: false,
    },
    {
      id: "a2",
      locationId: "basoda",
      title: "Heavy rainfall risk",
      severity: "CRITICAL",
      status: "active",
      icon: "heavy-rain",
      createdAt: new Date(now - 5 * 3600000).toISOString(),
      explanation: "Very heavy rainfall is possible over 2–3 days in the coming week.",
      action: "Clear drainage and protect stored harvest.",
      read: false,
    },
    {
      id: "a3",
      locationId: "ichhawar",
      title: "Extended dry spell expected",
      severity: "HIGH",
      status: "active",
      icon: "dry-spell",
      createdAt: new Date(now - 26 * 3600000).toISOString(),
      explanation: "A break of up to 14 days is likely after the first showers.",
      action: "Keep protective irrigation ready.",
      read: true,
    },
    {
      id: "a4",
      locationId: "huzur",
      title: "Sowing window favourable",
      severity: "LOW",
      status: "active",
      icon: "sowing",
      createdAt: new Date(now - 30 * 3600000).toISOString(),
      explanation: "Persistent rainfall is likely with a low chance of an early break.",
      action: "Proceed with planned sowing.",
      read: true,
    },
    {
      id: "a5",
      locationId: "phanda",
      title: "Moderate dry spell watch",
      severity: "MODERATE",
      status: "active",
      icon: "dry-spell",
      createdAt: new Date(now - 48 * 3600000).toISOString(),
      explanation: "Rainfall may weaken mid-month across the block.",
      action: "Plan irrigation for young crops.",
      read: true,
    },
    {
      id: "a6",
      locationId: "berasia",
      title: "Heavy rainfall watch withdrawn",
      severity: "MODERATE",
      status: "resolved",
      icon: "heavy-rain",
      createdAt: new Date(now - 4 * 86400000).toISOString(),
      explanation: "The earlier heavy rainfall signal has weakened.",
      action: "No action needed.",
      read: true,
    },
  ];
  return base
    .filter((a) => !locationId || locationId === "all" || a.locationId === locationId)
    .map((a) => ({
      ...a,
      locationName: BLOCKS.find((b) => b.id === a.locationId)?.name ?? "Unknown",
    }));
}
