import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateFingerprint } from "@/lib/fingerprint";
import { fetchProxyList, filterAndRank, livePickData, withoutProbe } from "@/lib/proxy-client";
import { pickLiveProxiesFn } from "@/lib/proxy-check.functions";
import { useOrbitStore } from "@/lib/store";
import type { ProxyNode, ProxyType } from "@/lib/types";

function stripProbe(node: ProxyNode & { probe?: unknown }): ProxyNode {
  return withoutProbe(node);
}

export function QuickCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const groups = useOrbitStore((s) => s.groups);
  const settings = useOrbitStore((s) => s.settings);
  const createProfile = useOrbitStore((s) => s.createProfile);
  const [count, setCount] = useState(4);
  const [prefix, setPrefix] = useState("Orbit");
  const [groupId, setGroupId] = useState("g_default");
  const [type, setType] = useState<ProxyType>(settings.defaultProxyType);
  const [country, setCountry] = useState(settings.preferredCountry || "ALL");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setType(settings.defaultProxyType);
    setCountry(settings.preferredCountry || "ALL");
  }, [open, settings.defaultProxyType, settings.preferredCountry]);

  const run = async () => {
    const n = Math.min(20, Math.max(1, count));
    setBusy(true);
    const toastId = toast.loading(`Đang tạo ${n} hồ sơ và dò node sống…`);
    try {
      const [livePack, list] = await Promise.all([
        pickLiveProxiesFn({
          data: livePickData(settings, {
            type,
            country: country === "ALL" ? undefined : country,
            count: Math.min(n, 8),
          }),
        }).catch(() => ({ live: [] as Array<ProxyNode & { probe?: unknown }>, tried: 0 })),
        fetchProxyList({
          apiKey: settings.apiKey,
          type,
          limit: n,
          country: country === "ALL" ? undefined : country,
        }),
      ]);
      const liveNodes = livePack.live.map(stripProbe);
      const rankedFallback = filterAndRank(list.proxies, {
        maxLatencyMs: settings.maxLatencyMs,
        minSpeed: settings.minSpeed,
      }).filter((p) => !liveNodes.some((n) => n.ip === p.ip && n.port === p.port));
      const assigned: Array<ProxyNode | null> = [...liveNodes];
      if (!settings.preferLiveOnly) {
        for (const node of rankedFallback) {
          if (assigned.length >= n) break;
          assigned.push(node);
        }
      }
      let liveUsed = 0;
      for (let i = 0; i < n; i++) {
        const proxy = assigned[i] ?? null;
        if (liveNodes[i]) liveUsed += 1;
        const idx = String(i + 1).padStart(2, "0");
        createProfile({
          name: `${prefix}-${idx}`,
          groupId,
          fingerprint: generateFingerprint({ country: proxy?.country }),
          proxy,
          startUrl: settings.defaultStartUrl,
          country: proxy?.country,
        });
      }
      toast.success(
        liveUsed === n
          ? `Đã tạo ${n} hồ sơ · ${n} node sống`
          : liveUsed
            ? settings.preferLiveOnly
              ? `Đã tạo ${n} hồ sơ · ${liveUsed} node sống, còn lại để trống`
              : `Đã tạo ${n} hồ sơ · ${liveUsed} node sống, phần còn lại xếp từ cụm`
            : `Đã tạo ${n} hồ sơ. Chưa dò được node sống — cửa sổ mở trực tiếp.`,
      );
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tạo được bộ hồ sơ");
    } finally {
      toast.dismiss(toastId);
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo nhanh nhiều hồ sơ</DialogTitle>
          <DialogDescription>
            Mỗi hồ sơ nhận vân tay riêng và một node NextProxy khác nhau.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="count">Số lượng</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="prefix">Tiền tố tên</Label>
              <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Nhóm</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Loại proxy</Label>
              <Select value={type} onValueChange={(v) => setType(v as ProxyType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https">HTTPS — ổn định hơn</SelectItem>
                  <SelectItem value="socks5">SOCKS5</SelectItem>
                  <SelectItem value="socks4">SOCKS4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Quốc gia</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Mọi vùng</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="NL">Netherlands</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => void run()} disabled={busy}>
            {busy ? "Đang tạo…" : "Tạo bộ hồ sơ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
