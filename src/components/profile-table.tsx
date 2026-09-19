import { useNavigate } from "@tanstack/react-router";
import {
  MoreHorizontal,
  Pencil,
  Play,
  Square,
  Trash2,
  Globe,
  Copy,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Identicon } from "@/components/identicon";
import { ProfileFormDialog } from "@/components/profile-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchRandomProxy } from "@/lib/proxy-client";
import { checkProxyFn } from "@/lib/proxy-check.functions";
import { stopOrbitProfile } from "@/lib/session-actions";
import { useOrbitStore } from "@/lib/store";
import type { Profile } from "@/lib/types";
import { cn, formatRelative, hostPort } from "@/lib/utils";

function HealthBadge({ profile }: { profile: Profile }) {
  if (profile.proxyHealth === "live") return <Badge variant="live">Live</Badge>;
  if (profile.proxyHealth === "dead") return <Badge variant="danger">Chết</Badge>;
  if (profile.proxyHealth === "checking") return <Badge variant="warn">Đang check</Badge>;
  if (profile.proxy) return <Badge variant="accent">Đã gán</Badge>;
  return <Badge>Không proxy</Badge>;
}

export function ProfileTable({
  query,
  groupId,
}: {
  query: string;
  groupId: string;
}) {
  const navigate = useNavigate();
  const profiles = useOrbitStore((s) => s.profiles);
  const groups = useOrbitStore((s) => s.groups);
  const selectedIds = useOrbitStore((s) => s.selectedIds);
  const setSelected = useOrbitStore((s) => s.setSelected);
  const toggleSelected = useOrbitStore((s) => s.toggleSelected);
  const startProfile = useOrbitStore((s) => s.startProfile);
  const deleteProfiles = useOrbitStore((s) => s.deleteProfiles);
  const assignProxy = useOrbitStore((s) => s.assignProxy);
  const updateProfile = useOrbitStore((s) => s.updateProfile);
  const settings = useOrbitStore((s) => s.settings);
  const createProfile = useOrbitStore((s) => s.createProfile);

  const [editing, setEditing] = useState<Profile | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);

  const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      if (groupId !== "all" && p.groupId !== groupId) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.notes} ${p.proxy?.ip ?? ""} ${p.proxy?.country ?? ""} ${p.fingerprint.os}`.toLowerCase();
      return hay.includes(q);
    });
  }, [profiles, query, groupId]);

  const allChecked = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));

  const openProfile = (p: Profile) => {
    startProfile(p.id);
    void navigate({ to: "/run/$id", params: { id: p.id } });
  };

  const checkOne = async (p: Profile) => {
    if (!p.proxy) {
      toast.error("Hồ sơ chưa có proxy");
      return;
    }
    updateProfile(p.id, { proxyHealth: "checking" });
    try {
      const res = await checkProxyFn({
        data: { ip: p.proxy.ip, port: p.proxy.port, type: p.proxy.type },
      });
      updateProfile(p.id, {
        proxyHealth: res.ok ? "live" : "dead",
        exitIp: res.exitIp,
        lastCheckMs: res.ms,
      });
      toast[res.ok ? "success" : "error"](
        res.ok
          ? `Live ${res.exitIp ?? hostPort(p.proxy.ip, p.proxy.port)} · ${res.ms} ms`
          : res.error ?? "Proxy không phản hồi",
      );
    } catch (err) {
      updateProfile(p.id, { proxyHealth: "dead" });
      toast.error(err instanceof Error ? err.message : "Lỗi kiểm tra");
    }
  };

  const assignRandom = async (ids: string[]) => {
    const toastId = toast.loading("Đang gán proxy NextProxy…");
    let ok = 0;
    for (const id of ids) {
      try {
        const proxy = await fetchRandomProxy(settings.apiKey);
        assignProxy(id, proxy);
        ok += 1;
      } catch {
        /* skip */
      }
    }
    toast.dismiss(toastId);
    toast.success(`Đã gán ${ok}/${ids.length} proxy`);
  };

  const duplicate = (p: Profile) => {
    createProfile({
      name: `${p.name} copy`,
      groupId: p.groupId,
      notes: p.notes,
      startUrl: p.startUrl,
      fingerprint: { ...p.fingerprint, canvasSeed: `${p.fingerprint.canvasSeed}-c` },
      proxy: null,
    });
    toast.success("Đã nhân bản hồ sơ");
  };

  return (
    <>
      {selectedIds.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md bg-elevated px-3 py-2 text-sm">
          <span className="tabular-nums text-muted">{selectedIds.length} đã chọn</span>
          <Button
            size="sm"
            variant="live"
            onClick={() => {
              selectedIds.forEach((id) => {
                const p = profiles.find((x) => x.id === id);
                if (p) openProfile(p);
              });
            }}
          >
            Mở
          </Button>
          <Button size="sm" variant="secondary" onClick={() => void assignRandom(selectedIds)}>
            Gán proxy
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPendingDelete(selectedIds)}>
            Xóa
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            Bỏ chọn
          </Button>
        </div>
      ) : null}

      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs text-muted">
            <tr>
              <th className="w-10 px-3 py-2">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) => setSelected(v ? rows.map((r) => r.id) : [])}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="px-3 py-2 font-medium">Hồ sơ</th>
              <th className="px-3 py-2 font-medium">Nhóm</th>
              <th className="px-3 py-2 font-medium">Proxy</th>
              <th className="px-3 py-2 font-medium">Trạng thái</th>
              <th className="px-3 py-2 font-medium">Mở gần đây</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                className={cn(
                  "border-t border-border hover:bg-surface/80",
                  selectedIds.includes(p.id) && "bg-surface",
                )}
              >
                <td className="px-3 py-2">
                  <Checkbox
                    checked={selectedIds.includes(p.id)}
                    onCheckedChange={() => toggleSelected(p.id)}
                    aria-label={`Chọn ${p.name}`}
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <Identicon seed={p.fingerprint.canvasSeed} />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="truncate text-xs text-subtle">
                        {p.fingerprint.os} · {p.fingerprint.engine}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-muted">{groupName(p.groupId)}</td>
                <td className="px-3 py-2">
                  {p.proxy ? (
                    <div>
                      <div className="font-mono text-xs">
                        {p.proxy.ip}:{p.proxy.port}
                      </div>
                      <div className="text-xs text-subtle">
                        {p.proxy.type.toUpperCase()} · {p.proxy.country}
                        {p.exitIp ? ` · ${p.exitIp}` : ""}
                      </div>
                    </div>
                  ) : (
                    <span className="text-subtle">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.status === "running" ? <Badge variant="live">Đang chạy</Badge> : <HealthBadge profile={p} />}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-muted">{formatRelative(p.lastOpenedAt)}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-1">
                    {p.status === "running" ? (
                      <Button size="sm" variant="secondary" onClick={() => void stopOrbitProfile(p.id)}>
                        <Square className="size-3 fill-current" />
                        Dừng
                      </Button>
                    ) : (
                      <Button size="sm" variant="live" onClick={() => openProfile(p)}>
                        <Play className="size-3 fill-current" />
                        Mở
                      </Button>
                    )}
                    <RowMenu
                      onEdit={() => setEditing(p)}
                      onCheck={() => void checkOne(p)}
                      onProxy={() => void assignRandom([p.id])}
                      onDuplicate={() => duplicate(p)}
                      onDelete={() => setPendingDelete([p.id])}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Không có hồ sơ khớp bộ lọc.</p>
        ) : null}
      </div>

      <div className="grid gap-2 md:hidden">
        {rows.map((p) => (
          <article key={p.id} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.includes(p.id)}
                onCheckedChange={() => toggleSelected(p.id)}
                aria-label={`Chọn ${p.name}`}
              />
              <Identicon seed={p.fingerprint.canvasSeed} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-medium">{p.name}</h3>
                  {p.status === "running" ? <Badge variant="live">Chạy</Badge> : <HealthBadge profile={p} />}
                </div>
                <p className="text-xs text-muted">{groupName(p.groupId)}</p>
                <p className="mt-1 font-mono text-xs text-subtle">
                  {p.proxy ? hostPort(p.proxy.ip, p.proxy.port) : "Không proxy"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {p.status === "running" ? (
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => void stopOrbitProfile(p.id)}>
                  Dừng
                </Button>
              ) : (
                <Button size="sm" variant="live" className="flex-1" onClick={() => openProfile(p)}>
                  Mở
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                Sửa
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => setPendingDelete([p.id])} aria-label="Xóa">
                <Trash2 className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {editing ? (
        <ProfileFormDialog
          open
          profile={editing}
          onOpenChange={(v) => {
            if (!v) setEditing(null);
          }}
        />
      ) : null}

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa hồ sơ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cookie, ghi chú và vân tay của {pendingDelete?.length ?? 0} hồ sơ sẽ mất trên máy này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-primary-fg"
              onClick={() => {
                if (pendingDelete) {
                  pendingDelete.forEach((id) => void stopOrbitProfile(id));
                  deleteProfiles(pendingDelete);
                }
                setPendingDelete(null);
                toast.success("Đã xóa");
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RowMenu({
  onEdit,
  onCheck,
  onProxy,
  onDuplicate,
  onDelete,
}: {
  onEdit: () => void;
  onCheck: () => void;
  onProxy: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost" aria-label="Thêm thao tác">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil className="size-4" /> Sửa
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onCheck}>
          <Globe className="size-4" /> Kiểm tra proxy
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onProxy}>
          <Globe className="size-4" /> Gán proxy mới
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDuplicate}>
          <Copy className="size-4" /> Nhân bản
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onDelete} className="text-danger">
          <Trash2 className="size-4" /> Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
