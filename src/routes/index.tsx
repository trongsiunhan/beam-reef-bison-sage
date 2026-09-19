import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { ProfileFormDialog } from "@/components/profile-form";
import { ProfileTable } from "@/components/profile-table";
import { QuickCreateDialog } from "@/components/quick-create";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrbitStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrated = useOrbitStore((s) => s.hydrated);
  const profiles = useOrbitStore((s) => s.profiles);
  const groups = useOrbitStore((s) => s.groups);
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-accent uppercase">Bảng điều khiển</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Hồ sơ trình duyệt</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Nhiều cửa sổ, dữ liệu tách biệt. Gán proxy live từ NextProxy cho từng hồ sơ.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setQuickOpen(true)}>
            Tạo nhanh
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Tạo hồ sơ
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <Input
            className="pl-9"
            placeholder="Tìm tên, IP, quốc gia…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={groupId} onValueChange={setGroupId}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhóm</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hydrated ? (
        <div className="grid gap-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} onQuick={() => setQuickOpen(true)} />
      ) : (
        <ProfileTable query={query} groupId={groupId} />
      )}

      <ProfileFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <QuickCreateDialog open={quickOpen} onOpenChange={setQuickOpen} />
    </div>
  );
}

function EmptyState({ onCreate, onQuick }: { onCreate: () => void; onQuick: () => void }) {
  return (
    <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <div className="max-w-md">
        <h2 className="text-lg font-semibold">Chưa có hồ sơ</h2>
        <p className="mt-2 text-sm text-muted">
          Tạo một hồ sơ thủ công hoặc khởi tạo 4 hồ sơ và gán node NextProxy ngay.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button onClick={onCreate}>Tạo hồ sơ</Button>
          <Button variant="secondary" onClick={onQuick}>
            Khởi tạo bộ mẫu
          </Button>
        </div>
      </div>
    </div>
  );
}
