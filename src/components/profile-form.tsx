import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { generateFingerprint } from "@/lib/fingerprint";
import { livePickData, withoutProbe } from "@/lib/proxy-client";
import { pickLiveProxiesFn } from "@/lib/proxy-check.functions";
import { useOrbitStore } from "@/lib/store";
import type { EngineName, Fingerprint, OsName, Profile, ProxyNode, WebrtcMode } from "@/lib/types";
import { uid } from "@/lib/utils";

type Draft = {
  name: string;
  groupId: string;
  notes: string;
  startUrl: string;
  fingerprint: Fingerprint;
  proxy: ProxyNode | null;
  cookiesText: string;
};

function cookiesToText(profile?: Profile) {
  if (!profile?.cookies.length) return "";
  return profile.cookies.map((c) => `${c.name}=${c.value}; Domain=${c.domain}`).join("\n");
}

function parseCookies(text: string) {
  return text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [nv, ...rest] = line.split(";");
      const [name, ...val] = (nv ?? "").split("=");
      const domainPart = rest.find((p) => p.trim().toLowerCase().startsWith("domain="));
      return {
        id: uid("ck"),
        name: (name ?? "cookie").trim(),
        value: val.join("=").trim(),
        domain: domainPart ? domainPart.split("=")[1]?.trim() ?? "" : "",
        path: "/",
      };
    });
}

function fromProfile(p?: Profile, defaults?: { groupId: string; startUrl: string }): Draft {
  const fp = p?.fingerprint ?? generateFingerprint();
  return {
    name: p?.name ?? "",
    groupId: p?.groupId ?? defaults?.groupId ?? "g_default",
    notes: p?.notes ?? "",
    startUrl: p?.startUrl ?? defaults?.startUrl ?? "https://api.ipify.org",
    fingerprint: fp,
    proxy: p?.proxy ?? null,
    cookiesText: cookiesToText(p),
  };
}

export function ProfileFormDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile?: Profile;
}) {
  const groups = useOrbitStore((s) => s.groups);
  const settings = useOrbitStore((s) => s.settings);
  const createProfile = useOrbitStore((s) => s.createProfile);
  const updateProfile = useOrbitStore((s) => s.updateProfile);
  const [draft, setDraft] = useState<Draft>(() =>
    fromProfile(profile, { groupId: "g_default", startUrl: settings.defaultStartUrl }),
  );
  const [busy, setBusy] = useState(false);

  const setFp = (patch: Partial<Fingerprint>) =>
    setDraft((d) => ({ ...d, fingerprint: { ...d.fingerprint, ...patch } }));

  const randomize = () =>
    setDraft((d) => ({
      ...d,
      fingerprint: generateFingerprint({
        country: d.proxy?.country,
        os: d.fingerprint.os,
        engine: d.fingerprint.engine,
      }),
    }));

  const grabProxy = async () => {
    setBusy(true);
    try {
      const found = await pickLiveProxiesFn({
        data: livePickData(settings, { count: 1 }),
      });
      const live = found.live[0];
      if (!live) {
        toast.error("Không dò được node sống. Nới bộ lọc trong Cài đặt.");
        return;
      }
      const proxy = withoutProbe(live);
      setDraft((d) => ({
        ...d,
        proxy,
        fingerprint: generateFingerprint({
          country: proxy.country,
          os: d.fingerprint.os,
          engine: d.fingerprint.engine,
        }),
      }));
      toast.success(`Live ${proxy.ip}:${proxy.port} (${proxy.country}) · ${live.probe.ms} ms`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không lấy được proxy");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    const name = draft.name.trim() || "Hồ sơ mới";
    const cookies = parseCookies(draft.cookiesText);
    if (profile) {
      updateProfile(profile.id, {
        name,
        groupId: draft.groupId,
        notes: draft.notes,
        startUrl: draft.startUrl,
        fingerprint: draft.fingerprint,
        proxy: draft.proxy,
        proxyHealth: draft.proxy ? "assigned" : "none",
        cookies,
      });
      toast.success("Đã lưu hồ sơ");
    } else {
      let proxy = draft.proxy;
      if (!proxy && settings.autoAssignProxy) {
        setBusy(true);
        try {
          const found = await pickLiveProxiesFn({
            data: livePickData(settings, { count: 1 }),
          });
          if (found.live[0]) proxy = withoutProbe(found.live[0]);
          else toast.message("Tạo hồ sơ không proxy — chưa dò được node sống");
        } catch {
          toast.message("Tạo hồ sơ không proxy — NextProxy tạm không trả node");
        } finally {
          setBusy(false);
        }
      }
      createProfile({
        name,
        groupId: draft.groupId,
        notes: draft.notes,
        startUrl: draft.startUrl,
        fingerprint: draft.fingerprint,
        proxy: proxy ?? null,
        cookies,
        country: proxy?.country,
      });
      toast.success("Đã tạo hồ sơ");
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setDraft(fromProfile(profile, { groupId: "g_default", startUrl: settings.defaultStartUrl }));
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{profile ? "Sửa hồ sơ" : "Tạo hồ sơ"}</DialogTitle>
          <DialogDescription>
            Mỗi hồ sơ giữ cookie, vân tay máy và proxy riêng — giống một máy tính khác.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="chung">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="chung">Chung</TabsTrigger>
            <TabsTrigger value="proxy">Proxy</TabsTrigger>
            <TabsTrigger value="vantay">Vân tay</TabsTrigger>
            <TabsTrigger value="cookie">Cookie</TabsTrigger>
          </TabsList>

          <TabsContent value="chung" className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Tên hồ sơ</Label>
              <Input
                id="name"
                value={draft.name}
                placeholder="Shopee-01, Ads-US…"
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Nhóm</Label>
              <Select value={draft.groupId} onValueChange={(v) => setDraft((d) => ({ ...d, groupId: v }))}>
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
            <div className="grid gap-1.5">
              <Label htmlFor="start">URL khởi động</Label>
              <Input
                id="start"
                value={draft.startUrl}
                onChange={(e) => setDraft((d) => ({ ...d, startUrl: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                rows={3}
                value={draft.notes}
                placeholder="Tài khoản, kịch bản, ghi nhớ…"
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="proxy" className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-elevated p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">NextProxy live</p>
                <p className="text-xs text-muted">Lấy node đã dò sống, xếp Good+ / thấp trễ trước.</p>
              </div>
              <Button variant="secondary" onClick={grabProxy} disabled={busy}>
                {busy ? "Đang lấy…" : "Lấy proxy"}
              </Button>
            </div>
            {draft.proxy ? (
              <dl className="grid grid-cols-2 gap-2 rounded-md border border-border p-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Host</dt>
                  <dd className="font-mono text-xs">
                    {draft.proxy.ip}:{draft.proxy.port}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Loại</dt>
                  <dd className="uppercase">{draft.proxy.type}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Quốc gia</dt>
                  <dd>
                    {draft.proxy.country} · {draft.proxy.countryName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Độ trễ</dt>
                  <dd className="tabular-nums">{draft.proxy.latency} ms</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted">Chưa gán proxy. Có thể mở hồ sơ không IP riêng.</p>
            )}
            <Button variant="ghost" className="justify-start px-0" onClick={() => setDraft((d) => ({ ...d, proxy: null }))}>
              Gỡ proxy
            </Button>
          </TabsContent>

          <TabsContent value="vantay" className="grid gap-3">
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={randomize}>
                Random vân tay
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Hệ điều hành</Label>
                <Select value={draft.fingerprint.os} onValueChange={(v) => setFp({ os: v as OsName })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Windows 11">Windows 11</SelectItem>
                    <SelectItem value="Windows 10">Windows 10</SelectItem>
                    <SelectItem value="macOS Sonoma">macOS Sonoma</SelectItem>
                    <SelectItem value="Linux">Linux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Engine</Label>
                <Select
                  value={draft.fingerprint.engine}
                  onValueChange={(v) => setFp({ engine: v as EngineName })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chrome">Chrome</SelectItem>
                    <SelectItem value="Edge">Edge</SelectItem>
                    <SelectItem value="Firefox">Firefox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>User-Agent</Label>
              <Textarea
                rows={3}
                className="font-mono text-xs"
                value={draft.fingerprint.userAgent}
                onChange={(e) => setFp({ userAgent: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Màn hình</Label>
                <Input
                  value={`${draft.fingerprint.screenWidth}×${draft.fingerprint.screenHeight}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split(/[x×]/i).map((n) => Number(n.trim()));
                    if (w && h) setFp({ screenWidth: w, screenHeight: h });
                  }}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Múi giờ</Label>
                <Input
                  value={draft.fingerprint.timezone}
                  onChange={(e) => setFp({ timezone: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Ngôn ngữ</Label>
                <Input
                  value={draft.fingerprint.language}
                  onChange={(e) => setFp({ language: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>WebRTC</Label>
                <Select
                  value={draft.fingerprint.webrtcMode}
                  onValueChange={(v) => setFp({ webrtcMode: v as WebrtcMode })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Tắt</SelectItem>
                    <SelectItem value="proxy">Theo proxy</SelectItem>
                    <SelectItem value="real">Thật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-elevated px-3 py-2">
              <Label htmlFor="dnt">Do Not Track</Label>
              <Switch
                id="dnt"
                checked={draft.fingerprint.doNotTrack}
                onCheckedChange={(v) => setFp({ doNotTrack: v })}
              />
            </div>
            <p className="font-mono text-xs text-subtle">
              Canvas {draft.fingerprint.canvasSeed} · Audio {draft.fingerprint.audioSeed}
            </p>
          </TabsContent>

          <TabsContent value="cookie" className="grid gap-2">
            <Label htmlFor="cookies">Mỗi dòng: name=value; Domain=example.com</Label>
            <Textarea
              id="cookies"
              rows={8}
              className="font-mono text-xs"
              value={draft.cookiesText}
              onChange={(e) => setDraft((d) => ({ ...d, cookiesText: e.target.value }))}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={save} disabled={busy}>
            {profile ? "Lưu" : "Tạo hồ sơ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
