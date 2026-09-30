// Shared frontend types. Keep all shapes here — do not redefine inside components.

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type Horizon = 7 | 14 | 30;
export type ConfidenceLevel = "Low" | "Medium" | "High";
export type Role = "farmer" | "officer";

export interface District {
  id: string;
  name: string;
  state: string;
}

export interface Block {
  id: string;
  name: string;
  districtId: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  panchayats: string[];
}

export interface DailyForecast {
  date: string; // ISO date
  rainfallMm: number;
  normalRainfallMm: number;
  anomalyPct: number;
  onsetProbability: number;
  drySpellProbability: number;
  heavyRainProbability: number;
}

export interface Forecast {
  locationId: string;
  locationName: string;
  district: string;
  state: string;
  forecastDate: string;
  horizon: Horizon;
  onsetProbability: number;
  falseOnsetProbability: number;
  drySpellProbability: number;
  heavyRainProbability: number;
  rainfallMin: number;
  rainfallMax: number;
  rainfallAnomaly: number;
  normalRainfall: number;
  expectedDrySpellDays: number;
  confidence: ConfidenceLevel;
  overallRisk: RiskLevel;
  updatedAt: string;
  drivers: string[];
  daily: DailyForecast[];
}

export interface RiskMapLocation {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  onsetRisk: number;
  drySpellRisk: number;
  heavyRainRisk: number;
  overallRisk: RiskLevel;
  overallScore: number;
  advisoryStatus: "Active" | "Pending" | "None";
}

export type RiskType = "overall" | "onset" | "drySpell" | "heavyRain";

export type Crop = "Soybean" | "Wheat" | "Maize" | "Paddy" | "Cotton" | "Chickpea";

export interface Advisory {
  id: string;
  locationId: string;
  crop: Crop;
  risk: string;
  action: string;
  severity: RiskLevel;
  title: string;
  message: string;
  recommendation: string;
  preparation: string[];
  confidence: ConfidenceLevel;
  validFrom: string;
  validUntil: string;
}

export interface AlertItem {
  id: string;
  locationId: string;
  locationName: string;
  title: string;
  severity: RiskLevel;
  status: "active" | "resolved";
  icon: "false-onset" | "heavy-rain" | "dry-spell" | "sowing";
  createdAt: string;
  explanation: string;
  action: string;
  read: boolean;
}

export interface DistrictAnalytics {
  districtId: string;
  districtName: string;
  totalBlocks: number;
  highRiskBlocks: number;
  falseOnsetBlocks: number;
  drySpellAlerts: number;
  heavyRainAlerts: number;
  onsetByBlock: { block: string; onset: number }[];
  drySpellDistribution: { level: RiskLevel; count: number }[];
  expectedRainfall: { date: string; rainfall: number; normal: number }[];
  riskTrend: { date: string; risk: number }[];
  alertsBySeverity: { severity: RiskLevel; count: number }[];
  advisoryDistribution: { crop: string; count: number }[];
}

export interface UserProfile {
  name: string;
  role: Role;
  phone: string;
  language: string;
  crops: Crop[];
}
