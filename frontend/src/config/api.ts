// Central API configuration.
// Backend is NOT implemented yet — services currently return mock data.
// After backend integration, only src/services/* implementations change.

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  "https://monsoonguard-system.onrender.com/api";

export const API_ROUTES = {
  locations: () => `${API_BASE_URL}/locations`,
  location: (id: string) => `${API_BASE_URL}/locations/${id}`,
  forecast: (locationId: string, horizon: number) =>
    `${API_BASE_URL}/forecast/${locationId}?horizon=${horizon}`,
  riskMap: (district: string) => `${API_BASE_URL}/risk-map?district=${district}`,
  advisories: (locationId: string, crop?: string) =>
    `${API_BASE_URL}/advisories/${locationId}${crop ? `?crop=${crop}` : ""}`,
  alerts: (locationId: string) => `${API_BASE_URL}/alerts/${locationId}`,
  analytics: (districtId: string) => `${API_BASE_URL}/analytics/${districtId}`,
};

/** Simulated network latency so loading states are exercised in the prototype. */
export const MOCK_LATENCY_MS = 220;

export function mockResponse<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_LATENCY_MS));
}
