//#region node_modules/.nitro/vite/services/ssr/assets/proxy-client-DNPLsrCj.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var proxy_client_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_API_KEY: () => DEFAULT_API_KEY,
	PROXY_PRESET: () => PROXY_PRESET,
	fetchClusterStats: () => fetchClusterStats,
	fetchCountries: () => fetchCountries,
	fetchProxyList: () => fetchProxyList,
	filterAndRank: () => filterAndRank,
	livePickData: () => livePickData,
	normalizeProxy: () => normalizeProxy,
	proxyScore: () => proxyScore,
	withoutProbe: () => withoutProbe
});
var BASE = "https://console.nextproxy.site";
var DEFAULT_API_KEY = "nex_live_e05617cdb93c2534";
var PROXY_PRESET = {
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
	proxyConfigVersion: 2
};
var COMMON_PORTS = /* @__PURE__ */ new Set([
	80,
	443,
	8080,
	8443,
	3128,
	3129,
	8888,
	8e3,
	1080,
	1081
]);
var SPEED_RANK = {
	fast: 3,
	good: 2,
	normal: 1
};
function asPort(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function asType(value) {
	const t = String(value ?? "").toLowerCase();
	if (t === "socks5" || t === "socks4" || t === "https") return t;
	return "https";
}
function normalizeProxy(raw) {
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
		status: String(raw.status ?? "active")
	};
}
async function getJson(url, apiKey) {
	const res = await fetch(url, { headers: {
		"X-API-Key": apiKey,
		Accept: "application/json"
	} });
	if (!res.ok) throw new Error(`NextProxy ${res.status}`);
	return res.json();
}
function proxyScore(p) {
	const speed = SPEED_RANK[p.speedTier.toLowerCase()] ?? 1;
	const lat = p.latency > 0 ? p.latency : 480;
	const portBonus = COMMON_PORTS.has(p.port) ? 55 : 0;
	const typeBonus = p.type === "https" ? 25 : p.type === "socks5" ? 8 : 0;
	const anon = /elite|anonymous/i.test(p.anonymity) ? 12 : 0;
	return speed * 110 + portBonus + typeBonus + anon - lat;
}
function filterAndRank(list, opts) {
	const floor = opts?.minSpeed === "fast" ? 3 : opts?.minSpeed === "good" ? 2 : 0;
	const maxLat = opts?.maxLatencyMs && opts.maxLatencyMs > 0 ? opts.maxLatencyMs : Number.POSITIVE_INFINITY;
	return list.filter((p) => {
		if ((SPEED_RANK[p.speedTier.toLowerCase()] ?? 1) < floor) return false;
		if (p.latency > 0 && p.latency > maxLat) return false;
		return Boolean(p.ip && p.port);
	}).sort((a, b) => proxyScore(b) - proxyScore(a));
}
function livePickData(settings, extra) {
	const country = extra?.country && extra.country !== "ALL" ? extra.country : settings.preferredCountry && settings.preferredCountry !== "ALL" ? settings.preferredCountry : void 0;
	return {
		apiKey: settings.apiKey,
		type: extra?.type ?? settings.defaultProxyType,
		country,
		count: extra?.count ?? 1,
		maxLatencyMs: settings.maxLatencyMs ?? 300,
		minSpeed: settings.minSpeed ?? "good",
		httpsFallback: settings.httpsFallback !== false,
		timeoutMs: settings.probeTimeoutMs ?? 2200
	};
}
function withoutProbe(node) {
	const { probe: _probe, ...rest } = node;
	return rest;
}
async function fetchProxyList(opts) {
	const params = new URLSearchParams({
		format: "json",
		limit: String(opts.limit ?? 80),
		key: opts.apiKey
	});
	if (opts.type && opts.type !== "all") params.set("type", opts.type);
	if (opts.country && opts.country !== "ALL") params.set("country", opts.country);
	if (opts.page) params.set("page", String(opts.page));
	const data = await getJson(`${BASE}/api/list?${params.toString()}`, opts.apiKey);
	const list = Array.isArray(data.proxies) ? data.proxies : [];
	return {
		proxies: list.map((p) => normalizeProxy(p)),
		total: Number(data.totalMatching ?? data.total ?? list.length),
		page: Number(data.page ?? 1),
		limit: Number(data.limit ?? list.length),
		counts: data.counts,
		clientTier: data.clientTier
	};
}
async function fetchClusterStats(apiKey) {
	const data = await getJson(`${BASE}/api/stats`, apiKey);
	return {
		counts: data.counts ?? {
			https: 0,
			socks4: 0,
			socks5: 0,
			total: 0
		},
		client: data.client,
		lastRefreshed: data.lastRefreshed,
		network: data.network,
		cluster: data.cluster
	};
}
async function fetchCountries(apiKey) {
	const data = await getJson(`${BASE}/api/countries`, apiKey);
	return Array.isArray(data.countries) ? data.countries : [];
}
//#endregion
export { fetchProxyList as a, proxy_client_exports as c, fetchCountries as i, withoutProbe as l, PROXY_PRESET as n, filterAndRank as o, fetchClusterStats as r, livePickData as s, DEFAULT_API_KEY as t, __exportAll as u };
