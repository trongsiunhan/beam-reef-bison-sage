export type ProxyType = "https" | "socks4" | "socks5";

export type ProxyNode = {
  ip: string;
  port: number;
  type: ProxyType;
  protocol: string;
  country: string;
  countryName: string;
  latency: number;
  speedTier: string;
  uptime: string;
  anonymity: string;
  status: string;
};

export type WebrtcMode = "disabled" | "proxy" | "real";
export type OsName = "Windows 11" | "Windows 10" | "macOS Sonoma" | "Linux";
export type EngineName = "Chrome" | "Edge" | "Firefox";

export type Fingerprint = {
  os: OsName;
  engine: EngineName;
  browserVersion: string;
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  webglVendor: string;
  webglRenderer: string;
  canvasSeed: string;
  audioSeed: string;
  webrtcMode: WebrtcMode;
  doNotTrack: boolean;
  maxTouchPoints: number;
  fonts: string[];
};

export type CookieItem = {
  id: string;
  name: string;
  value: string;
  domain: string;
  path: string;
};

export type StorageItem = {
  id: string;
  key: string;
  value: string;
};

export type HistoryItem = {
  url: string;
  title: string;
  at: number;
};

export type ProxyHealth = "none" | "assigned" | "live" | "dead" | "checking";

export type ProfileStatus = "idle" | "running";

export type Profile = {
  id: string;
  name: string;
  groupId: string;
  notes: string;
  createdAt: number;
  lastOpenedAt: number | null;
  status: ProfileStatus;
  fingerprint: Fingerprint;
  proxy: ProxyNode | null;
  proxyHealth: ProxyHealth;
  exitIp: string | null;
  lastCheckMs: number | null;
  cookies: CookieItem[];
  storage: StorageItem[];
  history: HistoryItem[];
  startUrl: string;
};

export type Group = {
  id: string;
  name: string;
};

export type AppSettings = {
  apiKey: string;
  defaultProxyType: ProxyType;
  autoAssignProxy: boolean;
  defaultStartUrl: string;
  syncGeoToProxy: boolean;
};

export type ClusterStats = {
  counts: { https: number; socks4: number; socks5: number; telegram?: number; total: number };
  client?: { ip?: string; tier?: string; quota?: number };
  lastRefreshed?: string;
  network?: string;
  cluster?: string;
};

export type CountryStat = {
  code: string;
  name: string;
  count: number;
  avgLatencyMs: number;
  status: string;
};

export type ProbeResult = {
  ok: boolean;
  ms: number;
  exitIp: string | null;
  status?: number;
  finalUrl?: string;
  title?: string;
  contentType?: string;
  snippet?: string;
  error?: string;
  via?: "proxy" | "direct";
  rotatedProxy?: ProxyNode;
};

export type BrowseFrame = {
  ok: boolean;
  ms: number;
  url: string;
  title: string;
  screenshot: string | null;
  html: string | null;
  snippet: string | null;
  via: "proxy" | "direct";
  engine: "chromium" | "fetch";
  exitIp: string | null;
  error?: string;
  proxyError?: string;
  rotatedProxy?: ProxyNode;
  viewport?: { width: number; height: number };
};
