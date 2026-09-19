import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lock, RefreshCw, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Identicon } from "@/components/identicon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  browseCheckIpFn,
  browseClickFn,
  browseScrollFn,
  browseTypeFn,
  pickLiveProxiesFn,
  probeUrlFn,
} from "@/lib/proxy-check.functions";
import { stopOrbitProfile } from "@/lib/session-actions";
import { livePickData, withoutProbe } from "@/lib/proxy-client";
import { useOrbitStore } from "@/lib/store";
import type { BrowseFrame, Profile } from "@/lib/types";
import { cn, hostPort } from "@/lib/utils";

const QUICK_URLS = [
  { label: "IP", href: "https://api.ipify.org?format=json" },
  { label: "whoer", href: "https://whoer.net" },
  { label: "ChatGPT", href: "https://chatgpt.com" },
  { label: "Google", href: "https://www.google.com/ncr" },
];

function FingerprintGrid({ profile }: { profile: Profile }) {
  const fp = profile.fingerprint;
  const rows: [string, string][] = [
    ["Hệ điều hành", fp.os],
    ["Engine", `${fp.engine} ${fp.browserVersion}`],
    ["Nền tảng", fp.platform],
    ["Màn hình", `${fp.screenWidth}×${fp.screenHeight} @${fp.pixelRatio}`],
    ["CPU / RAM", `${fp.hardwareConcurrency} luồng · ${fp.deviceMemory} GB`],
    ["Ngôn ngữ", fp.languages.join(", ")],
    ["Múi giờ", fp.timezone],
    ["WebGL", fp.webglRenderer],
    ["WebRTC", fp.webrtcMode],
    ["Fonts", `${fp.fonts.length} bộ`],
  ];
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="rounded-md bg-elevated p-3">
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="mt-1 break-all text-sm">{v}</dd>
        </div>
      ))}
      <div className="rounded-md bg-elevated p-3 sm:col-span-2">
        <dt className="text-xs text-muted">User-Agent</dt>
        <dd className="mt-1 font-mono text-xs leading-relaxed text-muted">{fp.userAgent}</dd>
      </div>
    </dl>
  );
}

function fpPayload(profile: Profile) {
  const fp = profile.fingerprint;
  return {
    userAgent: fp.userAgent,
    language: fp.language,
    timezone: fp.timezone,
    screenWidth: fp.screenWidth,
    screenHeight: fp.screenHeight,
  };
}

export function BrowserSession({ profile }: { profile: Profile }) {
  const updateProfile = useOrbitStore((s) => s.updateProfile);
  const assignProxy = useOrbitStore((s) => s.assignProxy);
  const pushHistory = useOrbitStore((s) => s.pushHistory);
  const settings = useOrbitStore((s) => s.settings);
  const [url, setUrl] = useState(profile.startUrl || "https://api.ipify.org?format=json");
  const [frame, setFrame] = useState<BrowseFrame | null>(null);
  const [busy, setBusy] = useState(false);
  const booted = useRef(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const warnedDirect = useRef(false);

  const proxyLabel = useMemo(() => {
    if (!profile.proxy) return "Không proxy";
    return `${profile.proxy.type.toUpperCase()} ${hostPort(profile.proxy.ip, profile.proxy.port)}`;
  }, [profile.proxy]);

  const applyFrame = (res: BrowseFrame, href?: string) => {
    setFrame(res);
    if (res.url) setUrl(res.url);
    if (res.rotatedProxy) assignProxy(profile.id, res.rotatedProxy);
    if (res.exitIp) {
      updateProfile(profile.id, {
        exitIp: res.exitIp,
        proxyHealth: res.via === "proxy" ? "live" : profile.proxy ? "dead" : "none",
        lastCheckMs: res.ms,
      });
    } else if (profile.proxy && res.proxyError) {
      updateProfile(profile.id, { proxyHealth: "dead", lastCheckMs: res.ms });
    }
    const title = res.title || href || res.url;
    if (res.url) pushHistory(profile.id, res.url, title);
  };

  const go = async (next = url) => {
    let href = next.trim();
    if (!href) return;
    if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
    setUrl(href);
    setBusy(true);
    try {
      let res = await probeUrlFn({
        data: {
          profileId: profile.id,
          url: href,
          fingerprint: fpPayload(profile),
          cookies: profile.cookies,
          proxy: profile.proxy,
        },
      });
      if (res.via === "direct" && profile.proxy && settings.autoRotateDead) {
        const found = await pickLiveProxiesFn({
          data: livePickData(settings, {
            type: settings.defaultProxyType,
            country: profile.proxy.country,
            count: 1,
          }),
        });
        const live = found.live[0];
        if (live) {
          const node = withoutProbe(live);
          assignProxy(profile.id, node);
          updateProfile(profile.id, {
            proxyHealth: "live",
            exitIp: live.probe.exitIp,
            lastCheckMs: live.probe.ms,
          });
          res = await probeUrlFn({
            data: {
              profileId: profile.id,
              url: href,
              fingerprint: fpPayload(profile),
              cookies: profile.cookies,
              proxy: node,
            },
          });
          toast.success(`Đã xoay sang ${hostPort(node.ip, node.port)}`);
        }
      }
      applyFrame(res, href);
      if (!res.ok && res.error) toast.error(res.error);
      else if (res.via === "direct" && profile.proxy && !warnedDirect.current) {
        warnedDirect.current = true;
        toast.message("Node không tới được — cửa sổ Chromium đang tải trực tiếp");
      }
    } catch (err) {
      setFrame({
        ok: false,
        ms: 0,
        url: href,
        title: "",
        screenshot: null,
        html: null,
        snippet: null,
        via: "direct",
        engine: "fetch",
        exitIp: null,
        error: err instanceof Error ? err.message : "Lỗi tải trang",
      });
    } finally {
      setBusy(false);
    }
  };

  const checkIp = async () => {
    setBusy(true);
    try {
      const res = await browseCheckIpFn({
        data: {
          profileId: profile.id,
          fingerprint: fpPayload(profile),
          cookies: profile.cookies,
          proxy: profile.proxy,
        },
      });
      applyFrame(res);
      if (res.exitIp) {
        toast.success(
          res.via === "proxy"
            ? `Exit IP ${res.exitIp} qua proxy · ${res.ms} ms`
            : `IP cửa sổ ${res.exitIp} (trực tiếp) · ${res.ms} ms`,
        );
      } else if (res.proxyError) toast.error(res.proxyError);
    } finally {
      setBusy(false);
    }
  };

  const rotateProxy = async () => {
    setBusy(true);
    try {
      const found = await pickLiveProxiesFn({
        data: livePickData(settings, {
          type: settings.defaultProxyType,
          country: profile.proxy?.country,
          count: 1,
        }),
      });
      const next = found.live[0];
      if (!next) {
        toast.error("Không tìm thấy node sống từ cụm. Cửa sổ vẫn mở trực tiếp.");
        return;
      }
      const { probe, ...node } = next;
      assignProxy(profile.id, node);
      updateProfile(profile.id, {
        proxyHealth: "live",
        exitIp: probe.exitIp,
        lastCheckMs: probe.ms,
      });
      toast.success(`Đã gán ${hostPort(next.ip, next.port)} · exit ${probe.exitIp ?? "OK"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không đổi được node");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    void go(profile.startUrl || url);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once per session
  }, []);

  const onViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (busy || !frame?.screenshot) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setBusy(true);
    void browseClickFn({ data: { profileId: profile.id, nx, ny } })
      .then((res) => applyFrame(res))
      .finally(() => setBusy(false));
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!frame?.screenshot) return;
    e.preventDefault();
    const dy = Math.max(-800, Math.min(800, e.deltaY));
    void browseScrollFn({ data: { profileId: profile.id, dy } }).then((res) => applyFrame(res));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!frame?.screenshot) return;
    const pass = ["Enter", "Backspace", "Tab", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete"];
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      void browseTypeFn({ data: { profileId: profile.id, text: e.key } }).then((res) => applyFrame(res));
      return;
    }
    if (pass.includes(e.key)) {
      e.preventDefault();
      void browseTypeFn({ data: { profileId: profile.id, key: e.key } }).then((res) => applyFrame(res));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Identicon seed={profile.fingerprint.canvasSeed} className="size-7" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profile.name}</p>
            <p className="truncate font-mono text-xs text-subtle">{proxyLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {profile.exitIp ? (
            <Badge variant="live" className="font-mono">
              {profile.exitIp}
            </Badge>
          ) : (
            <Badge variant={profile.proxyHealth === "dead" ? "danger" : "accent"}>
              {profile.proxyHealth}
            </Badge>
          )}
          <Button size="sm" variant="secondary" onClick={() => void checkIp()} disabled={busy}>
            Check IP
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void rotateProxy()} disabled={busy}>
            Đổi node
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="/">Về bảng</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => void stopOrbitProfile(profile.id)}>
            <Square className="size-3 fill-current" />
            Dừng
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
        <Button size="icon-sm" variant="ghost" aria-label="Back" disabled>
          <ArrowLeft className="size-4" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Forward" disabled>
          <ArrowRight className="size-4" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Reload" onClick={() => void go(url)}>
          <RefreshCw className={cn("size-4", busy && "animate-spin")} />
        </Button>
        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-bg px-3 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            void go();
          }}
        >
          <Lock className="size-3.5 text-subtle" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
            spellCheck={false}
            aria-label="Địa chỉ"
          />
        </form>
        <Button size="sm" onClick={() => void go()} disabled={busy}>
          Đi
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border bg-surface px-3 py-2">
        {QUICK_URLS.map((q) => (
          <button
            key={q.href}
            type="button"
            className="h-7 rounded-full bg-elevated px-2.5 text-xs text-muted hover:text-fg"
            onClick={() => void go(q.href)}
          >
            {q.label}
          </button>
        ))}
      </div>

      <Tabs defaultValue="browser" className="flex min-h-0 flex-1 flex-col">
        <div className="px-3 pt-3">
          <TabsList>
            <TabsTrigger value="browser">Cửa sổ</TabsTrigger>
            <TabsTrigger value="vantay">Vân tay</TabsTrigger>
            <TabsTrigger value="cookie">Cookie</TabsTrigger>
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browser" className="flex min-h-0 flex-1 flex-col px-3 pb-3">
          <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1fr_280px]">
            <div
              ref={viewRef}
              className="relative min-h-0 overflow-auto rounded-lg border border-border bg-elevated outline-none"
              tabIndex={0}
              onClick={onViewportClick}
              onWheel={onWheel}
              onKeyDown={onKeyDown}
            >
              {frame?.screenshot ? (
                <img
                  src={frame.screenshot}
                  alt={frame.title || "Cửa sổ Chromium"}
                  className="block w-full cursor-crosshair select-none"
                  draggable={false}
                />
              ) : frame?.html ? (
                <iframe
                  title={`Cửa sổ ${profile.name}`}
                  srcDoc={frame.html}
                  sandbox="allow-scripts allow-forms allow-popups"
                  className="h-[min(62dvh,560px)] w-full bg-bg lg:h-full"
                />
              ) : frame?.snippet && !frame.screenshot ? (
                <pre className="h-[min(62dvh,560px)] overflow-auto p-4 font-mono text-xs leading-relaxed lg:h-full">
                  {frame.snippet}
                </pre>
              ) : (
                <div className="grid h-[min(62dvh,560px)] place-items-center p-6 text-center lg:h-full">
                  <div>
                    <p className="text-sm font-medium">Đang mở Chromium…</p>
                    <p className="mt-1 max-w-sm text-sm text-muted">
                      Cửa sổ render thật, không nhúng iframe — ChatGPT và Google không còn bị chặn khung.
                    </p>
                  </div>
                </div>
              )}
              {busy ? (
                <div className="absolute inset-0 grid place-items-center bg-bg/45">
                  <div className="rounded-md bg-surface px-3 py-2 text-xs text-muted shadow-[var(--shadow-border)]">
                    Đang tải…
                  </div>
                </div>
              ) : null}
            </div>
            <aside className="rounded-lg border border-border bg-surface p-3 text-sm">
              <p className="text-xs font-medium text-muted">Cửa sổ Chromium</p>
              {frame ? (
                <div className="mt-2 space-y-2">
                  <p className={frame.ok ? "text-live" : "text-danger"}>
                    {frame.ok ? "Đã render" : "Thất bại"}
                    <span className="ml-2 tabular-nums text-muted">{frame.ms} ms</span>
                  </p>
                  <p className="text-xs text-muted">
                    {frame.engine === "chromium" ? "Chromium headless" : "Fetch HTML"}
                    {" · "}
                    {frame.via === "proxy" ? "qua proxy" : "trực tiếp"}
                  </p>
                  {frame.title ? <p className="font-medium">{frame.title}</p> : null}
                  {frame.exitIp ? <p className="font-mono text-xs">{frame.exitIp}</p> : null}
                  {frame.proxyError ? (
                    <p className="text-xs leading-relaxed text-danger">
                      Proxy: {frame.proxyError}. Trang vẫn mở từ máy chủ.
                    </p>
                  ) : null}
                  {frame.error ? <p className="text-xs text-danger">{frame.error}</p> : null}
                  <p className="text-xs leading-relaxed text-subtle">
                    Click, lăn chuột và gõ phím trên ảnh để điều khiển. Site chặn iframe (ChatGPT, Google) vẫn hiện.
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-subtle">Nhập URL rồi Đi. Check IP đọc exit từ cùng phiên Chromium.</p>
              )}
              {profile.history.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted">Lịch sử phiên</p>
                  <ul className="mt-1 space-y-1">
                    {profile.history.slice(0, 8).map((h) => (
                      <li key={`${h.at}-${h.url}`}>
                        <button
                          type="button"
                          className="w-full truncate text-left text-xs text-fg hover:text-accent"
                          onClick={() => void go(h.url)}
                        >
                          {h.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="vantay" className="px-3 pb-6">
          <FingerprintGrid profile={profile} />
        </TabsContent>

        <TabsContent value="cookie" className="px-3 pb-6">
          <CookieEditor profile={profile} />
        </TabsContent>

        <TabsContent value="notes" className="px-3 pb-6">
          <Label htmlFor="notes">Ghi chú hồ sơ</Label>
          <Textarea
            id="notes"
            className="mt-2"
            rows={8}
            value={profile.notes}
            onChange={(e) => updateProfile(profile.id, { notes: e.target.value })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CookieEditor({ profile }: { profile: Profile }) {
  const updateProfile = useOrbitStore((s) => s.updateProfile);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [domain, setDomain] = useState("");

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="value" value={value} onChange={(e) => setValue(e.target.value)} />
        <Input placeholder="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <Button
          variant="secondary"
          onClick={() => {
            if (!name.trim()) return;
            updateProfile(profile.id, {
              cookies: [
                {
                  id: `ck_${Date.now()}`,
                  name: name.trim(),
                  value,
                  domain,
                  path: "/",
                },
                ...profile.cookies,
              ],
            });
            setName("");
            setValue("");
            setDomain("");
          }}
        >
          Thêm
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        {profile.cookies.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted">Chưa có cookie.</p>
        ) : (
          <ul>
            {profile.cookies.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">
                    {c.name}={c.value}
                  </p>
                  <p className="text-xs text-subtle">{c.domain || "—"}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    updateProfile(profile.id, {
                      cookies: profile.cookies.filter((x) => x.id !== c.id),
                    })
                  }
                >
                  Xóa
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
