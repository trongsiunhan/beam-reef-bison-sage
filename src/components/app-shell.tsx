import { Link, useRouterState } from "@tanstack/react-router";
import { Globe, LayoutGrid, Menu, Radio, Settings2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { RunningDock } from "@/components/running-dock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useOrbitStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Hồ sơ", icon: LayoutGrid },
  { to: "/proxies", label: "Proxy", icon: Globe },
  { to: "/run", label: "Đang chạy", icon: Radio },
  { to: "/settings", label: "Cài đặt", icon: Settings2 },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const running = useOrbitStore(
    (s) => s.profiles.reduce((n, p) => n + (p.status === "running" ? 1 : 0), 0),
  );

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
            )}
          >
            <Icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {item.to === "/run" && running > 0 ? (
              <span className="tabular-nums text-xs text-live">{running}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2 py-1">
      <span className="grid size-8 place-items-center rounded-sm bg-elevated shadow-[var(--shadow-border)]">
        <span className="size-3 rounded-full border-2 border-accent" />
      </span>
      <span>
        <span className="block text-sm font-semibold tracking-tight">Orbit</span>
        <span className="block text-xs text-subtle">Multi-profile</span>
      </span>
    </Link>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const profiles = useOrbitStore((s) => s.profiles.length);
  const running = useOrbitStore(
    (s) => s.profiles.reduce((n, p) => n + (p.status === "running" ? 1 : 0), 0),
  );

  return (
    <>
      <Brand />
      <div className="mt-6 flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <div className="rounded-md bg-elevated p-3 text-xs text-muted">
        <div className="flex justify-between tabular-nums">
          <span>Hồ sơ</span>
          <span className="text-fg">{profiles}</span>
        </div>
        <div className="mt-1 flex justify-between tabular-nums">
          <span>Phiên mở</span>
          <span className={running ? "text-live" : "text-fg"}>{running}</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          NextProxy US & EU Anycast · Developer Pro
        </p>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-bg text-fg">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Mở menu">
              <Menu className="size-5" />
            </Button>
            <SheetContent side="left">
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Brand />
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        <RunningDock />
      </div>
    </div>
  );
}
