import type { AppSettings, ClusterStats, CountryStat, ProxyNode, ProxyType, SpeedFloor } from "./types";

const BASE = "https://console.nextproxy.site";

export const DEFAULT_API_KEY = "nex_live_e05617cdb93c2534";

export const PROXY_PRESET: Pick<
  AppSettings,
  | "defaultProxyType"
  | "preferLiveOnly"
  | "autoRotateDead"
  | "httpsFallback"
  | "maxLatencyMs"
  | "minSpeed"
  | "preferredCountry"
  | "probeTimeoutMs"
  | "autoAssignProxy"
  | "syncGeoToProxy"
  | "proxyConfigVersion"
> = {
  defaultProxyType: "https",
  preferLiveOnly: true,
  autoRotateDead: true,
  httpsFallback: true,
  maxLatencyMs: 300,
  minSpeed: "good",
  preferredCountry: "ALL",
  probeTimeoutMs: 2200,
  autoAssignProxy: true,
  syncGeoToProxy: true,
  proxyConfigVersion: 2,
};

const COMMON_PORTS = new Set([80, 443, 8080, 8443, 3128, 3129, 8888, 8000, 1080, 1081]);
const SPEED_RANK: Record<string, number> = { fast: 3, good: 2, normal: 1 };

function asPort(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asType(value: unknown): ProxyType {
  const t = String(value ?? "").toLowerCase();
  if (t === "socks5" || t === "socks4" || t === "https") return t;
  return "https";
}

export function normalizeProxy(raw: Record<string, unknown>): ProxyNode {
  return {
    ip: String(raw.ip ?? ""),
    port: asPort(raw.port),
    type: asType(raw.type ?? raw.protocol),
    protocol: String(raw.protocol ?? raw.type ?? "https"),
    country: String(raw.country ?? ""),
    countryName: String(raw.countryName ?? raw.country ?? ""),
    latency: Number(raw.latency ?? 0),
    speedTier: String(raw.speedTier ?? ""),
    uptime: String(raw.uptime ?? ""),
    anonymity: String(raw.anonymity ?? ""),
    status: String(raw.status ?? "active"),
  };
}

async function getJson(url: string, apiKey: string) {
  const res = await fetch(url, {
    headers: { "X-API-Key": apiKey, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`NextProxy ${res.status}`);
  }
  return res.json();
}

export function proxyScore(p: ProxyNode) {
  const speed = SPEED_RANK[p.speedTier.toLowerCase()] ?? 1;
  const lat = p.latency > 0 ? p.latency : 480;
  const portBonus = COMMON_PORTS.has(p.port) ? 55 : 0;
  const typeBonus = p.type === "https" ? 25 : p.type === "socks5" ? 8 : 0;
  const anon = /elite|anonymous/i.test(p.anonymity) ? 12 : 0;
  return speed * 110 + portBonus + typeBonus + anon - lat;
}

export function filterAndRank(
  list: ProxyNode[],
  opts?: { maxLatencyMs?: number; minSpeed?: SpeedFloor },
): ProxyNode[] {
  const floor = opts?.minSpeed === "fast" ? 3 : opts?.minSpeed === "good" ? 2 : 0;
  const maxLat = opts?.maxLatencyMs && opts.maxLatencyMs > 0 ? opts.maxLatencyMs : Number.POSITIVE_INFINITY;
  return list
    .filter((p) => {
      const s = SPEED_RANK[p.speedTier.toLowerCase()] ?? 1;
      if (s < floor) return false;
      if (p.latency > 0 && p.latency > maxLat) return false;
      return Boolean(p.ip && p.port);
    })
    .sort((a, b) => proxyScore(b) - proxyScore(a));
}

export function livePickData(
  settings: AppSettings,
  extra?: { type?: ProxyType | "all"; country?: string; count?: number },
) {
  const country =
    extra?.country && extra.country !== "ALL"
      ? extra.country
      : settings.preferredCountry && settings.preferredCountry !== "ALL"
        ? settings.preferredCountry
        : undefined;
  return {
    apiKey: settings.apiKey,
    type: extra?.type ?? settings.defaultProxyType,
    country,
    count: extra?.count ?? 1,
    maxLatencyMs: settings.maxLatencyMs ?? 300,
    minSpeed: settings.minSpeed ?? "good",
    httpsFallback: settings.httpsFallback !== false,
    timeoutMs: settings.probeTimeoutMs ?? 2200,
  };
}

export function withoutProbe<T extends ProxyNode & { probe?: unknown }>(node: T): ProxyNode {
  const { probe: _probe, ...rest } = node;
  return rest;
}

export async function fetchRandomProxy(apiKey: string): Promise<ProxyNode> {
  const data = await getJson(`${BASE}/api/random`, apiKey);
  if (!data?.proxy) throw new Error("Không nhận được proxy");
  return normalizeProxy(data.proxy);
}

export async function fetchProxyList(opts: {
  apiKey: string;
  type?: ProxyType | "all";
  limit?: number;
  country?: string;
  page?: number;
}): Promise<{
  proxies: ProxyNode[];
  total: number;
  page: number;
  limit: number;
  counts?: ClusterStats["counts"];
  clientTier?: string;
}> {
  const params = new URLSearchParams({
    format: "json",
    limit: String(opts.limit ?? 80),
    key: opts.apiKey,
  });
  if (opts.type && opts.type !== "all") params.set("type", opts.type);
  if (opts.country && opts.country !== "ALL") params.set("country", opts.country);
  if (opts.page) params.set("page", String(opts.page));
  const data = await getJson(`${BASE}/api/list?${params.toString()}`, opts.apiKey);
  const list = Array.isArray(data.proxies) ? data.proxies : [];
  return {
    proxies: list.map((p: Record<string, unknown>) => normalizeProxy(p)),
    total: Number(data.totalMatching ?? data.total ?? list.length),
    page: Number(data.page ?? 1),
    limit: Number(data.limit ?? list.length),
    counts: data.counts,
    clientTier: data.clientTier,
  };
}

export async function fetchClusterStats(apiKey: string): Promise<ClusterStats> {
  const data = await getJson(`${BASE}/api/stats`, apiKey);
  return {
    counts: data.counts ?? { https: 0, socks4: 0, socks5: 0, total: 0 },
    client: data.client,
    lastRefreshed: data.lastRefreshed,
    network: data.network,
    cluster: data.cluster,
  };
}

export async function fetchCountries(apiKey: string): Promise<CountryStat[]> {
  const data = await getJson(`${BASE}/api/countries`, apiKey);
  return Array.isArray(data.countries) ? data.countries : [];
}
