import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Clock, Menu, User } from "lucide-react";

import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { MOBILE_NAV, navForRole } from "./navConfig";
import { LocationSelector } from "@/components/common/LocationSelector";
import { NotificationPanel } from "@/components/common/NotificationPanel";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useApp } from "@/hooks/useAppContext";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1" aria-label="Main navigation">
      {navForRole(role).map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (pathname.startsWith("/officer") && role !== "officer") setRole("officer");
    else if (
      ["/dashboard", "/forecast", "/map", "/locations"].includes(pathname) &&
      role !== "farmer"
    )
      setRole("farmer");
  }, [pathname, role, setRole]);
  const today = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const [istTime, setIstTime] = useState(() =>
    new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setIstTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-6 px-1">
          <Logo />
        </Link>
        <NavLinks />
        <div className="mt-auto rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
          <p className="font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            MoES / NCMRWF Feed
          </p>
          <p className="mt-1 text-muted-foreground text-[11px] leading-tight">
            Hyperlocal Block & Panchayat Monsoon Prediction System.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Link to="/" className="mb-6 block" onClick={() => setMenuOpen(false)}>
                <Logo />
              </Link>
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Logo showText={false} className="lg:hidden" />

          <div className="hidden min-w-0 flex-1 sm:block">
            <LocationSelector className="w-[240px]" />
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-muted-foreground">
              {today} · Updated 6:00 AM IST
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">
              <Clock className="size-3 text-primary" />
              <span className="font-mono text-[11px] font-medium text-foreground">{istTime}</span>
              <span className="text-[10px] font-semibold text-primary">IST</span>
            </div>
          </div>


          <div className="ml-auto flex items-center gap-2">
            <RoleSwitcher />
            <NotificationPanel />
            <Button variant="outline" size="icon" aria-label="Profile">
              <User className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full sm:hidden">
            <LocationSelector className="w-full" />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card lg:hidden"
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
          <MobileLink key={to} to={to} label={label} Icon={Icon} />
        ))}
      </nav>
    </div>
  );
}

function MobileLink({
  to,
  label,
  Icon,
}: {
  to: (typeof MOBILE_NAV)[number]["to"];
  label: string;
  Icon: typeof Bell;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to;
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  );
}
