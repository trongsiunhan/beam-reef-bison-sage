import { Link } from "@tanstack/react-router";
import { Square } from "lucide-react";
import { useMemo } from "react";
import { Identicon } from "@/components/identicon";
import { Button } from "@/components/ui/button";
import { stopAllOrbitProfiles, stopOrbitProfile } from "@/lib/session-actions";
import { useOrbitStore } from "@/lib/store";

export function RunningDock() {
  const profiles = useOrbitStore((s) => s.profiles);
  const running = useMemo(() => profiles.filter((p) => p.status === "running"), [profiles]);

  if (running.length === 0) return null;

  return (
    <div className="border-t border-border bg-surface px-3 py-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="shrink-0 text-xs font-medium text-muted">
          Đang chạy
          <span className="ml-1 tabular-nums text-live">{running.length}</span>
        </span>
        <div className="flex min-w-0 flex-1 gap-1.5">
          {running.map((p) => (
            <Link
              key={p.id}
              to="/run/$id"
              params={{ id: p.id }}
              className="flex h-10 min-w-40 items-center gap-2 rounded-sm bg-elevated px-2 text-left text-xs hover:shadow-[var(--shadow-border-hover)]"
            >
              <Identicon seed={p.fingerprint.canvasSeed} className="size-6 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-fg">{p.name}</span>
                <span className="block truncate font-mono text-xs text-subtle">
                  {p.proxy ? `${p.proxy.ip}:${p.proxy.port}` : "Không proxy"}
                </span>
              </span>
              <button
                type="button"
                className="grid size-7 place-items-center rounded-xs text-muted hover:bg-bg hover:text-fg"
                aria-label={`Dừng ${p.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void stopOrbitProfile(p.id);
                }}
              >
                <Square className="size-3 fill-current" />
              </button>
            </Link>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => void stopAllOrbitProfiles()} className="shrink-0">
          Dừng hết
        </Button>
      </div>
    </div>
  );
}
