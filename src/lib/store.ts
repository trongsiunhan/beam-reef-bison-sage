import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyGeoToFingerprint, DEFAULT_GROUPS, generateFingerprint } from "./fingerprint";
import { DEFAULT_API_KEY } from "./proxy-client";
import type { AppSettings, Group, Profile, ProxyNode } from "./types";
import { uid } from "./utils";

type OrbitState = {
  profiles: Profile[];
  groups: Group[];
  settings: AppSettings;
  selectedIds: string[];
  activeSessionId: string | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setSelected: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  createGroup: (name: string) => string;
  createProfile: (input?: Partial<Profile> & { country?: string }) => Profile;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
  deleteProfiles: (ids: string[]) => void;
  assignProxy: (id: string, proxy: ProxyNode | null) => void;
  startProfile: (id: string) => void;
  stopProfile: (id: string) => void;
  stopAll: () => void;
  setSettings: (patch: Partial<AppSettings>) => void;
  setActiveSession: (id: string | null) => void;
  pushHistory: (id: string, url: string, title: string) => void;
};

function blankProfile(partial?: Partial<Profile> & { country?: string }): Profile {
  const fp = applyGeoToFingerprint(
    partial?.fingerprint ?? generateFingerprint({ country: partial?.country }),
    partial?.country ?? partial?.proxy?.country,
  );
  return {
    id: partial?.id ?? uid("p"),
    name: partial?.name ?? "Hồ sơ mới",
    groupId: partial?.groupId ?? "g_default",
    notes: partial?.notes ?? "",
    createdAt: partial?.createdAt ?? Date.now(),
    lastOpenedAt: partial?.lastOpenedAt ?? null,
    status: "idle",
    fingerprint: fp,
    proxy: partial?.proxy ?? null,
    proxyHealth: partial?.proxy ? "assigned" : "none",
    exitIp: null,
    lastCheckMs: null,
    cookies: partial?.cookies ?? [],
    storage: partial?.storage ?? [],
    history: partial?.history ?? [],
    startUrl: partial?.startUrl ?? "https://api.ipify.org",
  };
}

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      profiles: [],
      groups: DEFAULT_GROUPS,
      settings: {
        apiKey: DEFAULT_API_KEY,
        defaultProxyType: "socks5",
        autoAssignProxy: true,
        defaultStartUrl: "https://api.ipify.org",
        syncGeoToProxy: true,
      },
      selectedIds: [],
      activeSessionId: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setSelected: (ids) => set({ selectedIds: ids }),
      toggleSelected: (id) =>
        set((s) => ({
          selectedIds: s.selectedIds.includes(id)
            ? s.selectedIds.filter((x) => x !== id)
            : [...s.selectedIds, id],
        })),
      createGroup: (name) => {
        const id = uid("g");
        set((s) => ({ groups: [...s.groups, { id, name }] }));
        return id;
      },
      createProfile: (input) => {
        const settings = get().settings;
        const profile = blankProfile({
          startUrl: settings.defaultStartUrl,
          ...input,
        });
        set((s) => ({ profiles: [profile, ...s.profiles] }));
        return profile;
      },
      updateProfile: (id, patch) =>
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteProfiles: (ids) =>
        set((s) => ({
          profiles: s.profiles.filter((p) => !ids.includes(p.id)),
          selectedIds: s.selectedIds.filter((id) => !ids.includes(id)),
          activeSessionId: ids.includes(s.activeSessionId ?? "") ? null : s.activeSessionId,
        })),
      assignProxy: (id, proxy) =>
        set((s) => ({
          profiles: s.profiles.map((p) => {
            if (p.id !== id) return p;
            const fingerprint =
              proxy && s.settings.syncGeoToProxy
                ? applyGeoToFingerprint(p.fingerprint, proxy.country)
                : p.fingerprint;
            return {
              ...p,
              proxy,
              fingerprint,
              proxyHealth: proxy ? "assigned" : "none",
              exitIp: null,
            };
          }),
        })),
      startProfile: (id) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === id ? { ...p, status: "running" as const, lastOpenedAt: Date.now() } : p,
          ),
          activeSessionId: id,
        })),
      stopProfile: (id) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === id ? { ...p, status: "idle" as const } : p,
          ),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        })),
      stopAll: () =>
        set((s) => ({
          profiles: s.profiles.map((p) => ({ ...p, status: "idle" as const })),
          activeSessionId: null,
        })),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setActiveSession: (id) => set({ activeSessionId: id }),
      pushHistory: (id, url, title) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === id
              ? {
                  ...p,
                  history:
                    p.history[0]?.url === url
                      ? [{ url, title, at: Date.now() }, ...p.history.slice(1)].slice(0, 40)
                      : [{ url, title, at: Date.now() }, ...p.history].slice(0, 40),
                }
              : p,
          ),
        })),
    }),
    {
      name: "orbit-login-v1",
      skipHydration: true,
      partialize: (s) => ({
        profiles: s.profiles,
        groups: s.groups,
        settings: s.settings,
      }),
    },
  ),
);
