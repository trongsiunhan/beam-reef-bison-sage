import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { checkProxyFn } from "@/lib/proxy-check.functions";
import { fetchCountries, fetchClusterStats, fetchProxyList } from "@/lib/proxy-client";
import { useOrbitStore } from "@/lib/store";
import type { ProxyNode, ProxyType } from "@/lib/types";
import { formatLatency, hostPort } from "@/lib/utils";

export function ProxyPool() {
  const settings = useOrbitStore((s) => s.settings);
  const profiles = useOrbitStore((s) => s.profiles);
  const assignProxy = useOrbitStore((s) => s.assignProxy);
  const selectedIds = useOrbitStore((s) => s.selectedIds);
  const [type, setType] = useState<ProxyType | "all">(settings.defaultProxyType);
  const [country, setCountry] = useState("ALL");
  const [checking, setChecking] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, { ok: boolean; ms: number; exitIp: string | null }>>({});

  const statsQ = useQuery({
    queryKey: ["np-stats", settings.apiKey],
    queryFn: () => fetchClusterStats(settings.apiKey),
    refetchInterval: 20_000,
  });
  const countriesQ = useQuery({
    queryKey: ["np-countries", settings.apiKey],
    queryFn: () => fetchCountries(settings.apiKey),
  });
  const listQ = useQuery({
    queryKey: ["np-list", settings.apiKey, type, country],
    queryFn: () =>
      fetchProxyList({
        apiKey: settings.apiKey,
        type,
        country: country === "ALL" ? undefined : country,
        limit: 50,
      }),
  });

  const counts = statsQ.data?.counts;
  const idleProfiles = useMemo(
    () => profiles.filter((p) => selectedIds.includes(p.id) || p.status === "idle"),
    [profiles, selectedIds],
  );

  const assignTo = (proxy: ProxyNode, profileId?: string) => {
    const target =
      profileId ??
      selectedIds[0] ??
      idleProfiles[0]?.id;
    if (!target) {
      toast.error("Hãy chọn hoặc tạo một hồ sơ trước");
      return;
    }
    assignProxy(target, proxy);
    const name = profiles.find((p) => p.id === target)?.name ?? "hồ sơ";
    toast.success(`Đã gán ${hostPort(proxy.ip, proxy.port)} → ${name}`);
  };

  const check = async (proxy: ProxyNode) => {
    const key = hostPort(proxy.ip, proxy.port);
    setChecking(key);
    try {
      const res = await checkProxyFn({
        data: { ip: proxy.ip, port: proxy.port, type: proxy.type },
      });
      setChecked((m) => ({ ...m, [key]: { ok: res.ok, ms: res.ms, exitIp: res.exitIp } }));
      toast[res.ok ? "success" : "error"](
        res.ok ? `Live · ${res.exitIp ?? key} · ${res.ms} ms` : res.error ?? "Chết",
      );
    } finally {
      setChecking(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="HTTPS" value={counts?.https} />
        <Stat label="SOCKS5" value={counts?.socks5} />
        <Stat label="SOCKS4" value={counts?.socks4} />
        <Stat label="Tổng node" value={counts?.total} />
      </div>
      <p className="text-xs text-subtle">
        {statsQ.data?.client?.tier ?? "NextProxy"}
        {statsQ.data?.lastRefreshed ? ` · đồng bộ ${new Date(statsQ.data.lastRefreshed).toLocaleTimeString("vi-VN")}` : ""}
      </p>

      <div className="flex flex-wrap gap-2">
        <Select value={type} onValueChange={(v) => setType(v as ProxyType | "all")}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi loại</SelectItem>
            <SelectItem value="socks5">SOCKS5</SelectItem>
            <SelectItem value="https">HTTPS</SelectItem>
            <SelectItem value="socks4">SOCKS4</SelectItem>
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Mọi quốc gia</SelectItem>
            {(countriesQ.data ?? []).map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} · {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={() => void listQ.refetch()}>
          Làm mới
        </Button>
      </div>

      {listQ.isLoading ? (
        <div className="grid gap-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : listQ.isError ? (
        <p className="rounded-md bg-danger/10 p-3 text-sm text-danger">
          Không tải được cụm proxy. Kiểm tra API key trong Cài đặt.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Node</th>
                  <th className="px-3 py-2 font-medium">Loại</th>
                  <th className="px-3 py-2 font-medium">Quốc gia</th>
                  <th className="px-3 py-2 font-medium">Độ trễ</th>
                  <th className="px-3 py-2 font-medium">Check</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {(listQ.data?.proxies ?? []).map((p) => {
                  const key = hostPort(p.ip, p.port);
                  const result = checked[key];
                  return (
                    <tr key={key} className="border-t border-border">
                      <td className="px-3 py-2 font-mono text-xs">{key}</td>
                      <td className="px-3 py-2 uppercase text-muted">{p.type}</td>
                      <td className="px-3 py-2">
                        {p.country} · {p.countryName}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-muted">{formatLatency(p.latency)}</td>
                      <td className="px-3 py-2">
                        {result ? (
                          <Badge variant={result.ok ? "live" : "danger"}>
                            {result.ok ? `${result.ms} ms` : "dead"}
                          </Badge>
                        ) : (
                          <span className="text-subtle">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={checking === key}
                            onClick={() => void check(p)}
                          >
                            {checking === key ? "…" : "Check"}
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => assignTo(p)}>
                            Gán
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2 p-2 md:hidden">
            {(listQ.data?.proxies ?? []).map((p) => {
              const key = hostPort(p.ip, p.port);
              return (
                <article key={key} className="rounded-md bg-surface p-3">
                  <p className="font-mono text-xs">{key}</p>
                  <p className="mt-1 text-xs text-muted">
                    {p.type.toUpperCase()} · {p.country} · {formatLatency(p.latency)}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => void check(p)}>
                      Check
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => assignTo(p)}>
                      Gán
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">
        {typeof value === "number" ? value.toLocaleString("vi-VN") : "—"}
      </p>
    </div>
  );
}
