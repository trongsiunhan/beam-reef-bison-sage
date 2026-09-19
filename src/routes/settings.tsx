import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_API_KEY, PROXY_PRESET } from "@/lib/proxy-client";
import { useOrbitStore } from "@/lib/store";
import type { ProxyType, SpeedFloor } from "@/lib/types";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useOrbitStore((s) => s.settings);
  const setSettings = useOrbitStore((s) => s.setSettings);
  const applyProxyPreset = useOrbitStore((s) => s.applyProxyPreset);
  const createGroup = useOrbitStore((s) => s.createGroup);
  const groups = useOrbitStore((s) => s.groups);

  const policy = [
    settings.defaultProxyType.toUpperCase(),
    settings.minSpeed === "fast" ? "Fast+" : settings.minSpeed === "good" ? "Good+" : "mọi tốc độ",
    settings.maxLatencyMs > 0 ? `≤${settings.maxLatencyMs} ms` : "không lọc trễ",
    settings.httpsFallback ? "fallback HTTPS" : null,
    settings.autoRotateDead ? "tự xoay" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 md:p-6">
      <header>
        <p className="text-xs font-medium tracking-wide text-accent uppercase">Kỹ thuật</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Cài đặt</h1>
        <p className="mt-1 text-sm text-muted">API key NextProxy lưu trên trình duyệt này, không gửi đi nơi khác.</p>
      </header>

      <section className="grid gap-3 rounded-xl border border-border bg-surface p-4">
        <div className="grid gap-1.5">
          <Label htmlFor="key">API key NextProxy</Label>
          <Input
            id="key"
            className="font-mono text-xs"
            value={settings.apiKey}
            onChange={(e) => setSettings({ apiKey: e.target.value.trim() })}
          />
        </div>
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => {
            setSettings({ apiKey: DEFAULT_API_KEY });
            toast.success("Đã khôi phục key Developer Pro");
          }}
        >
          Dùng key hiện tại
        </Button>
        <div className="grid gap-1.5">
          <Label htmlFor="start">URL khởi động mặc định</Label>
          <Input
            id="start"
            value={settings.defaultStartUrl}
            onChange={(e) => setSettings({ defaultStartUrl: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2">
          <div>
            <p className="text-sm font-medium">Tự gán proxy khi tạo</p>
            <p className="text-xs text-muted">Lấy node theo bộ lọc tối ưu, không lấy ngẫu nhiên.</p>
          </div>
          <Switch
            checked={settings.autoAssignProxy}
            onCheckedChange={(v) => setSettings({ autoAssignProxy: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2">
          <div>
            <p className="text-sm font-medium">Đồng bộ múi giờ theo proxy</p>
            <p className="text-xs text-muted">Gán IP xong sẽ khớp ngôn ngữ và timezone với quốc gia node.</p>
          </div>
          <Switch
            checked={settings.syncGeoToProxy}
            onCheckedChange={(v) => setSettings({ syncGeoToProxy: v })}
          />
        </div>
      </section>

      <section className="grid gap-3 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Tối ưu cụm proxy</h2>
            <p className="mt-1 text-xs text-muted">{policy}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              applyProxyPreset();
              toast.success("Đã áp dụng HTTPS · Good+ · ≤300 ms · tự xoay");
            }}
          >
            Áp dụng tối ưu
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Loại ưu tiên</Label>
            <Select
              value={settings.defaultProxyType}
              onValueChange={(v) => setSettings({ defaultProxyType: v as ProxyType })}
            >
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
            <Label>Tốc độ tối thiểu</Label>
            <Select
              value={settings.minSpeed}
              onValueChange={(v) => setSettings({ minSpeed: v as SpeedFloor })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Mọi mức</SelectItem>
                <SelectItem value="good">Good trở lên</SelectItem>
                <SelectItem value="fast">Chỉ Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Độ trễ tối đa</Label>
            <Select
              value={String(settings.maxLatencyMs)}
              onValueChange={(v) => setSettings({ maxLatencyMs: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="150">150 ms</SelectItem>
                <SelectItem value="250">250 ms</SelectItem>
                <SelectItem value="300">300 ms</SelectItem>
                <SelectItem value="450">450 ms</SelectItem>
                <SelectItem value="0">Không lọc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Thời gian dò mỗi node</Label>
            <Select
              value={String(settings.probeTimeoutMs)}
              onValueChange={(v) => setSettings({ probeTimeoutMs: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1500">1.5 giây — nhanh</SelectItem>
                <SelectItem value="2200">2.2 giây — cân bằng</SelectItem>
                <SelectItem value="3500">3.5 giây — khoan dung</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Quốc gia ưu tiên</Label>
            <Select
              value={settings.preferredCountry}
              onValueChange={(v) => setSettings({ preferredCountry: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Mọi vùng</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
                <SelectItem value="SG">Singapore</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2">
          <div>
            <p className="text-sm font-medium">Chỉ gán node đã dò sống</p>
            <p className="text-xs text-muted">Bỏ qua node random chưa check. Nếu không có node sống thì để trống.</p>
          </div>
          <Switch
            checked={settings.preferLiveOnly}
            onCheckedChange={(v) => setSettings({ preferLiveOnly: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2">
          <div>
            <p className="text-sm font-medium">Tự đổi node khi chết</p>
            <p className="text-xs text-muted">Mở phiên mà node không tới được thì dò node sống khác và đi tiếp.</p>
          </div>
          <Switch
            checked={settings.autoRotateDead}
            onCheckedChange={(v) => setSettings({ autoRotateDead: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2">
          <div>
            <p className="text-sm font-medium">Fallback HTTPS</p>
            <p className="text-xs text-muted">
              SOCKS hay chết. Bật để tự lấy HTTPS khi không dò được SOCKS. Đề xuất: {PROXY_PRESET.defaultProxyType.toUpperCase()}.
            </p>
          </div>
          <Switch
            checked={settings.httpsFallback}
            onCheckedChange={(v) => setSettings({ httpsFallback: v })}
          />
        </div>
      </section>

      <section className="grid gap-3 rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Nhóm hồ sơ</h2>
        <ul className="text-sm text-muted">
          {groups.map((g) => (
            <li key={g.id} className="border-b border-border py-2 last:border-0">
              {g.name}
            </li>
          ))}
        </ul>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get("g") ?? "").trim();
            if (!name) return;
            createGroup(name);
            e.currentTarget.reset();
            toast.success("Đã thêm nhóm");
          }}
        >
          <Input name="g" placeholder="Tên nhóm mới" />
          <Button type="submit" variant="secondary">
            Thêm
          </Button>
        </form>
      </section>
    </div>
  );
}
