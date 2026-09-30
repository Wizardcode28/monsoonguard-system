import {
  BarChart3,
  Bell,
  CloudRain,
  LayoutDashboard,
  Leaf,
  Map,
  MapPin,
  Settings,
} from "lucide-react";
import type { Role } from "@/types";

export type AppRoute =
  | "/"
  | "/dashboard"
  | "/forecast"
  | "/map"
  | "/advisories"
  | "/alerts"
  | "/locations"
  | "/settings"
  | "/officer"
  | "/officer/map"
  | "/officer/analytics";

export interface NavItem {
  to: AppRoute;
  label: string;
  icon: typeof Map;
}

export const FARMER_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/forecast", label: "Forecast", icon: CloudRain },
  { to: "/map", label: "Risk Map", icon: Map },
  { to: "/advisories", label: "Advisories", icon: Leaf },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/locations", label: "Locations", icon: MapPin },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const OFFICER_NAV: NavItem[] = [
  { to: "/officer", label: "Dashboard", icon: LayoutDashboard },
  { to: "/officer/map", label: "Risk Map", icon: Map },
  { to: "/officer/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/advisories", label: "Advisories", icon: Leaf },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function navForRole(role: Role) {
  return role === "officer" ? OFFICER_NAV : FARMER_NAV;
}

export const MOBILE_NAV: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/map", label: "Map", icon: Map },
  { to: "/forecast", label: "Forecast", icon: CloudRain },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "More", icon: Settings },
];
