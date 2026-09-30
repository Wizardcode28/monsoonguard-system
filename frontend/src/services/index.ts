// Service layer connecting to FastAPI backend with graceful fallback to mock data

import { API_ROUTES } from "@/config/api";
import {
  BLOCKS,
  DISTRICTS,
  STATES,
  buildAdvisories,
  buildAlerts,
  buildForecast,
  buildRiskMap,
  BLOCK_SIGNALS,
  overallScore,
} from "@/data/mockData";
import type {
  Advisory,
  AlertItem,
  Block,
  Crop,
  District,
  DistrictAnalytics,
  Forecast,
  Horizon,
  RiskMapLocation,
} from "@/types";
import { riskFromScore } from "@/utils/risk";

async function fetchWithFallback<T>(url: string, fallback: () => T | Promise<T>): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Fallback] Failed fetching ${url}:`, err);
    return await fallback();
  }
}

export const locationService = {
  getStates: (): Promise<string[]> => Promise.resolve(STATES),
  getDistricts: (): Promise<District[]> =>
    fetchWithFallback<District[]>(`${API_BASE_URL}/districts`, () => DISTRICTS),
  getLocations: (districtId?: string): Promise<Block[]> =>
    fetchWithFallback<Block[]>(
      `${API_BASE_URL}/locations${districtId && districtId !== "all" ? `?districtId=${districtId}` : ""}`,
      () => BLOCKS
    ),
  getBlockDetails: async (blockId: string): Promise<Block | undefined> => {
    const blocks = await locationService.getLocations();
    return blocks.find((b) => b.id === blockId);
  },
};

export const forecastService = {
  getForecast: (locationId: string, horizon: Horizon = 7): Promise<Forecast> =>
    fetchWithFallback<Forecast>(
      API_ROUTES.forecast(locationId, horizon),
      () => buildForecast(locationId, horizon)
    ),
  getRiskMap: (filters: { districtId?: string | undefined } = {}): Promise<RiskMapLocation[]> =>
    fetchWithFallback<RiskMapLocation[]>(
      API_ROUTES.riskMap(filters.districtId || "all"),
      () => buildRiskMap(filters.districtId)
    ),
  getTeleconnections: () =>
    fetchWithFallback<any>(`${API_BASE_URL}/climate-teleconnections`, () => ({
      enso: { phase: "Neutral / Weak El Niño", value: 0.42 },
      iod: { phase: "Positive IOD", value: 0.35 },
      mjo: { phase_name: "Indian Ocean Convective Phase", amplitude: 1.64 }
    })),
  getGeoJSON: () =>
    fetchWithFallback<any>(`${API_BASE_URL}/geojson`, () => null),
};

export const advisoryService = {
  getAdvisories: (locationId: string, crop?: Crop, lang: string = "hi"): Promise<Advisory[]> =>
    fetchWithFallback<any>(
      `${API_BASE_URL}/advisories/${locationId}?crop=${crop || "Soybean"}&lang=${lang}`,
      () => buildAdvisories(locationId, crop)
    ).then((res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.advisories)) {
        const from = new Date();
        const until = new Date(Date.now() + 10 * 86400000);
        return res.advisories.map((a: any, i: number) => ({
          id: `${locationId}-${crop || "all"}-${i}`,
          locationId,
          crop: (res.crop || crop || "Soybean") as Crop,
          risk: a.category || "Monsoon Break Risk",
          action: a.category === "SOWING" ? "Sowing Window" : a.category === "IRRIGATION" ? "Protective Irrigation" : "Field Drainage",
          severity: (a.urgency || "HIGH") as any,
          title: `${res.crop || crop || "Crop"} Advisory (${res.language || lang})`,
          message: a.rationale || a.message,
          recommendation: a.message,
          preparation: a.category === "SOWING"
            ? ["Seed treatment", "Delay sowing until steady rain", "Moisture check"]
            : a.category === "IRRIGATION"
              ? ["Arrange sprinkler / drip backup", "Mulching", "Weed control"]
              : ["Clear field bunds", "Ensure surface drainage", "Hold foliar sprays"],
          confidence: "High",
          validFrom: from.toISOString(),
          validUntil: until.toISOString(),
        }));
      }
      return buildAdvisories(locationId, crop);
    }),
};

export const alertService = {
  getAlerts: (locationId?: string): Promise<AlertItem[]> => Promise.resolve(buildAlerts(locationId)),
  dispatchNotification: async (payload: {
    recipient_type: string;
    contact: string;
    channel: string;
    language: string;
    block_id: string;
    title: string;
    message: string;
    risk_level: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/notifications/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
};

export const analyticsService = {
  getAnalytics: (districtId: string): Promise<DistrictAnalytics> => {
    const district = DISTRICTS.find((d) => d.id === districtId) ?? DISTRICTS[0]!;
    const blocks = BLOCKS.filter((b) => b.districtId === district.id);
    const map = buildRiskMap(district.id);
    const forecast = buildForecast(blocks[0]!.id, 30);

    const distribution = (["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map((level) => ({
      level,
      count: map.filter((m) => riskFromScore(m.drySpellRisk) === level).length,
    }));

    return Promise.resolve({
      districtId: district.id,
      districtName: district.name,
      totalBlocks: blocks.length,
      highRiskBlocks: map.filter((m) => m.overallRisk === "HIGH" || m.overallRisk === "CRITICAL")
        .length,
      falseOnsetBlocks: blocks.filter((b) => BLOCK_SIGNALS[b.id]!.falseOnset >= 50).length,
      drySpellAlerts: blocks.filter((b) => BLOCK_SIGNALS[b.id]!.drySpell >= 55).length,
      heavyRainAlerts: blocks.filter((b) => BLOCK_SIGNALS[b.id]!.heavyRain >= 45).length,
      onsetByBlock: blocks.map((b) => ({ block: b.name, onset: BLOCK_SIGNALS[b.id]!.onset })),
      drySpellDistribution: distribution,
      expectedRainfall: forecast.daily.map((d) => ({
        date: d.date,
        rainfall: d.rainfallMm,
        normal: d.normalRainfallMm,
      })),
      riskTrend: forecast.daily.map((d, i) => ({
        date: d.date,
        risk: Math.round(
          (d.drySpellProbability * 0.5 + d.heavyRainProbability * 0.3 + (100 - d.onsetProbability) * 0.2) +
            (i % 3),
        ),
      })),
      alertsBySeverity: (["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map((severity) => ({
        severity,
        count: buildAlerts().filter((a) => a.severity === severity).length,
      })),
      advisoryDistribution: blocks.map((b) => ({
        crop: b.name,
        count: Math.max(1, Math.round(overallScore(BLOCK_SIGNALS[b.id]!) / 12)),
      })),
    });
  },
};
