import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_API_KEY } from "@/lib/proxy-client";
import { useOrbitStore } from "@/lib/store";
import type { ProxyType } from "@/lib/types";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useOrbitStore((s) => s.settings);
  const setSettings = useOrbitStore((s) => s.setSettings);
  const createGroup = useOrbitStore((s) => s.createGroup);
  const groups = useOrbitStore((s) => s.groups);

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
          <Label>Loại proxy mặc định</Label>
          <Select
            value={settings.defaultProxyType}
            onValueChange={(v) => setSettings({ defaultProxyType: v as ProxyType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="socks5">SOCKS5</SelectItem>
              <SelectItem value="https">HTTPS</SelectItem>
              <SelectItem value="socks4">SOCKS4</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <p className="text-xs text-muted">Lấy một node ngẫu nhiên từ NextProxy.</p>
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
