//#region node_modules/.nitro/vite/services/ssr/assets/proxy-client-CLfqVGVh.js
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
	fetchClusterStats: () => fetchClusterStats,
	fetchCountries: () => fetchCountries,
	fetchProxyList: () => fetchProxyList,
	fetchRandomProxy: () => fetchRandomProxy,
	normalizeProxy: () => normalizeProxy
});
var BASE = "https://console.nextproxy.site";
var DEFAULT_API_KEY = "nex_live_e05617cdb93c2534";
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
async function fetchRandomProxy(apiKey) {
	const data = await getJson(`${BASE}/api/random`, apiKey);
	if (!data?.proxy) throw new Error("Không nhận được proxy");
	return normalizeProxy(data.proxy);
}
async function fetchProxyList(opts) {
	const params = new URLSearchParams({
		format: "json",
		limit: String(opts.limit ?? 40),
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
export { fetchRandomProxy as a, fetchProxyList as i, fetchClusterStats as n, proxy_client_exports as o, fetchCountries as r, __exportAll as s, DEFAULT_API_KEY as t };
