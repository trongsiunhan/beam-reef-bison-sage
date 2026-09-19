import type { ClusterStats, CountryStat, ProxyNode, ProxyType } from "./types";

const BASE = "https://console.nextproxy.site";

export const DEFAULT_API_KEY = "nex_live_e05617cdb93c2534";

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
    limit: String(opts.limit ?? 40),
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
