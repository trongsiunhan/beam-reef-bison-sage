import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proxy-check.functions-BdV37iuV.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ProxyInput = object({
	ip: string().min(1),
	port: number().int().positive(),
	type: string()
});
var FpInput = object({
	userAgent: string(),
	language: string(),
	timezone: string(),
	screenWidth: number(),
	screenHeight: number()
});
var CookieInput = object({
	id: string().optional(),
	name: string(),
	value: string(),
	domain: string(),
	path: string()
});
var SessionInput = object({
	profileId: string().min(1),
	url: string().optional(),
	fingerprint: FpInput,
	cookies: array(CookieInput).optional(),
	proxy: object({
		ip: string(),
		port: number(),
		type: string(),
		protocol: string().optional(),
		country: string().optional(),
		countryName: string().optional(),
		latency: number().optional(),
		speedTier: string().optional(),
		uptime: string().optional(),
		anonymity: string().optional(),
		status: string().optional()
	}).nullable()
});
function asProxy(raw) {
	if (!raw) return null;
	const t = raw.type.toLowerCase();
	const type = t === "socks4" || t === "socks5" || t === "https" ? t : "https";
	return {
		ip: raw.ip,
		port: raw.port,
		type,
		protocol: raw.protocol ?? raw.type,
		country: raw.country ?? "",
		countryName: raw.countryName ?? "",
		latency: raw.latency ?? 0,
		speedTier: raw.speedTier ?? "",
		uptime: raw.uptime ?? "",
		anonymity: raw.anonymity ?? "",
		status: raw.status ?? "active"
	};
}
function asCookies(raw) {
	if (!raw) return void 0;
	return raw.map((c) => ({
		id: c.id ?? "",
		name: c.name,
		value: c.value,
		domain: c.domain,
		path: c.path
	}));
}
var checkProxyFn_createServerFn_handler = createServerRpc({
	id: "6c5df79f99d3073797733b11f7556710911f1ec277a54c770ed73c03e808157a",
	name: "checkProxyFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => checkProxyFn.__executeServer(opts));
var checkProxyFn = createServerFn({ method: "POST" }).validator(ProxyInput).handler(checkProxyFn_createServerFn_handler, async ({ data }) => {
	const { probeProxy } = await import("./proxy-tunnel.server-vfiJcj8w.mjs");
	return probeProxy({
		ip: data.ip,
		port: data.port,
		type: data.type
	});
});
var probeUrlFn_createServerFn_handler = createServerRpc({
	id: "a1315a8ac1ae3743a9af0d8272aa01185f81c71b64138ca828537d7d396aa0d6",
	name: "probeUrlFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => probeUrlFn.__executeServer(opts));
var probeUrlFn = createServerFn({ method: "POST" }).validator(SessionInput.extend({ url: string().min(1) })).handler(probeUrlFn_createServerFn_handler, async ({ data }) => {
	const { browseNavigate } = await import("./browser-engine.server-CVgnpNys.mjs");
	let href = data.url.trim();
	if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
	return browseNavigate({
		profileId: data.profileId,
		url: href,
		proxy: asProxy(data.proxy),
		fingerprint: data.fingerprint,
		cookies: asCookies(data.cookies)
	});
});
var browseClickFn_createServerFn_handler = createServerRpc({
	id: "6db96a05b968317a66c0eef7de6f8da57c8e04bb38d07d6e16cfe3d0350a5efa",
	name: "browseClickFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => browseClickFn.__executeServer(opts));
var browseClickFn = createServerFn({ method: "POST" }).validator(object({
	profileId: string(),
	nx: number(),
	ny: number()
})).handler(browseClickFn_createServerFn_handler, async ({ data }) => {
	const { browseClick } = await import("./browser-engine.server-CVgnpNys.mjs");
	return browseClick(data);
});
var browseTypeFn_createServerFn_handler = createServerRpc({
	id: "3051a87b5c35859027778f4bbbc946a01e0156c0e61b68dad73a539c9aad8cb8",
	name: "browseTypeFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => browseTypeFn.__executeServer(opts));
var browseTypeFn = createServerFn({ method: "POST" }).validator(object({
	profileId: string(),
	text: string().optional(),
	key: string().optional()
})).handler(browseTypeFn_createServerFn_handler, async ({ data }) => {
	const { browseType } = await import("./browser-engine.server-CVgnpNys.mjs");
	return browseType(data);
});
var browseScrollFn_createServerFn_handler = createServerRpc({
	id: "48776ec98a3f5f25f186509a55892db80af94381ae3992c81ebfca25c170a466",
	name: "browseScrollFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => browseScrollFn.__executeServer(opts));
var browseScrollFn = createServerFn({ method: "POST" }).validator(object({
	profileId: string(),
	dy: number()
})).handler(browseScrollFn_createServerFn_handler, async ({ data }) => {
	const { browseScroll } = await import("./browser-engine.server-CVgnpNys.mjs");
	return browseScroll(data);
});
var browseCheckIpFn_createServerFn_handler = createServerRpc({
	id: "0c931efe5e10ce58a01522f2ea9c5368d1555d5deb48a1f5ce9ec187cbc13549",
	name: "browseCheckIpFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => browseCheckIpFn.__executeServer(opts));
var browseCheckIpFn = createServerFn({ method: "POST" }).validator(SessionInput).handler(browseCheckIpFn_createServerFn_handler, async ({ data }) => {
	const { browseCheckIp } = await import("./browser-engine.server-CVgnpNys.mjs");
	return browseCheckIp({
		profileId: data.profileId,
		proxy: asProxy(data.proxy),
		fingerprint: data.fingerprint,
		cookies: asCookies(data.cookies)
	});
});
var closeSessionFn_createServerFn_handler = createServerRpc({
	id: "e4e439640e8e2b8ba0fdacbe5f1c82429a6bb70789d68628539a9066798036b7",
	name: "closeSessionFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => closeSessionFn.__executeServer(opts));
var closeSessionFn = createServerFn({ method: "POST" }).validator(object({ profileId: string() })).handler(closeSessionFn_createServerFn_handler, async ({ data }) => {
	const { closeSession } = await import("./browser-engine.server-CVgnpNys.mjs");
	await closeSession(data.profileId);
	return { ok: true };
});
var pickLiveProxiesFn_createServerFn_handler = createServerRpc({
	id: "ef5d275e416919a950c076c8aea0451bbb3d14b105cf5f8578f2565f42ceef59",
	name: "pickLiveProxiesFn",
	filename: "src/lib/proxy-check.functions.ts"
}, (opts) => pickLiveProxiesFn.__executeServer(opts));
var pickLiveProxiesFn = createServerFn({ method: "POST" }).validator(object({
	apiKey: string().min(1),
	type: _enum([
		"https",
		"socks4",
		"socks5",
		"all"
	]).optional(),
	country: string().optional(),
	count: number().int().min(1).max(10)
})).handler(pickLiveProxiesFn_createServerFn_handler, async ({ data }) => {
	const { pickLiveProxies } = await import("./proxy-tunnel.server-vfiJcj8w.mjs");
	return pickLiveProxies({
		apiKey: data.apiKey,
		type: data.type,
		country: data.country,
		count: data.count,
		budgetMs: 7e3
	});
});
//#endregion
export { browseCheckIpFn_createServerFn_handler, browseClickFn_createServerFn_handler, browseScrollFn_createServerFn_handler, browseTypeFn_createServerFn_handler, checkProxyFn_createServerFn_handler, closeSessionFn_createServerFn_handler, pickLiveProxiesFn_createServerFn_handler, probeUrlFn_createServerFn_handler };
