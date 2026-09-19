import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Identicon } from "@/components/identicon";
import { Button } from "@/components/ui/button";
import { useOrbitStore } from "@/lib/store";
import { hostPort } from "@/lib/utils";

export const Route = createFileRoute("/run/")({ component: RunIndex });

function RunIndex() {
  const profiles = useOrbitStore((s) => s.profiles);
  const running = useMemo(() => profiles.filter((p) => p.status === "running"), [profiles]);

  if (running.length === 0) {
    return (
      <div className="grid flex-1 place-items-center p-6 text-center">
        <div>
          <h1 className="text-xl font-semibold">Chưa có phiên nào chạy</h1>
          <p className="mt-2 text-sm text-muted">Mở hồ sơ từ bảng điều khiển để làm việc đa cửa sổ.</p>
          <Button className="mt-4" asChild>
            <Link to="/">Về hồ sơ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <header>
        <p className="text-xs font-medium tracking-wide text-accent uppercase">Đa nhiệm</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Phiên đang chạy</h1>
        <p className="mt-1 text-sm text-muted">Mỗi ô là một môi trường độc lập — cookie và proxy không dùng chung.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {running.map((p) => (
          <Link
            key={p.id}
            to="/run/$id"
            params={{ id: p.id }}
            className="rounded-xl border border-border bg-surface p-4 transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]"
          >
            <div className="flex items-center gap-3">
              <Identicon seed={p.fingerprint.canvasSeed} />
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate font-mono text-xs text-subtle">
                  {p.proxy ? hostPort(p.proxy.ip, p.proxy.port) : "Không proxy"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              {p.fingerprint.os} · {p.fingerprint.engine}
              {p.exitIp ? ` · ${p.exitIp}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
