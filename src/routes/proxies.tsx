import { createFileRoute } from "@tanstack/react-router";
import { ProxyPool } from "@/components/proxy-pool";

export const Route = createFileRoute("/proxies")({ component: ProxiesPage });

function ProxiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <header>
        <p className="text-xs font-medium tracking-wide text-accent uppercase">Nguồn dữ liệu</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Cụm proxy NextProxy</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Node xếp Fast/Good, độ trễ thấp, cổng phổ biến trước. Dò sống rồi gán — HTTPS mặc định, SOCKS tự fallback.
        </p>
      </header>
      <ProxyPool />
    </div>
  );
}
