import { useQuery } from "@tanstack/react-query";
import {
  advisoryService,
  alertService,
  analyticsService,
  forecastService,
  locationService,
} from "@/services";
import type { Crop, Horizon } from "@/types";

export function useLocations() {
  return useQuery({ queryKey: ["locations"], queryFn: () => locationService.getLocations() });
}

export function useDistricts() {
  return useQuery({ queryKey: ["districts"], queryFn: () => locationService.getDistricts() });
}

export function useBlockDetails(blockId: string) {
  return useQuery({
    queryKey: ["block", blockId],
    queryFn: () => locationService.getBlockDetails(blockId),
  });
}

export function useForecast(locationId: string, horizon: Horizon = 7) {
  return useQuery({
    queryKey: ["forecast", locationId, horizon],
    queryFn: () => forecastService.getForecast(locationId, horizon),
  });
}

export function useRiskMap(districtId?: string) {
  return useQuery({
    queryKey: ["risk-map", districtId],
    queryFn: () => forecastService.getRiskMap({ districtId }),
  });
}

export function useAdvisories(locationId: string, crop?: Crop, lang: string = "hi") {
  return useQuery({
    queryKey: ["advisories", locationId, crop, lang],
    queryFn: () => advisoryService.getAdvisories(locationId, crop, lang),
  });
}

export function useAlerts(locationId?: string) {
  return useQuery({
    queryKey: ["alerts", locationId],
    queryFn: () => alertService.getAlerts(locationId),
  });
}

export function useAnalytics(districtId: string) {
  return useQuery({
    queryKey: ["analytics", districtId],
    queryFn: () => analyticsService.getAnalytics(districtId),
  });
}
