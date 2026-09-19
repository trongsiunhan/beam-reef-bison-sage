import { t as require_undici } from "../_libs/undici.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proxy-tunnel.server-vfiJcj8w.js
var import_undici = require_undici();
var IP_CHECK_URLS = ["https://api.ipify.org?format=json", "https://api64.ipify.org?format=json"];
function describeProxyError(err) {
	const msg = err instanceof Error ? err.message : String(err);
	if (/timeout|aborted|UND_ERR_CONNECT_TIMEOUT|Hết thời gian/i.test(msg)) return "Hết thời gian chờ";
	if (/407/.test(msg)) return "Proxy yêu cầu xác thực (407)";
	if (/403/.test(msg)) return "Proxy từ chối (403)";
	if (/ECONNREFUSED|refused/i.test(msg)) return "Từ chối kết nối";
	if (/ENOTFOUND|EAI_AGAIN/i.test(msg)) return "Không resolve được host";
	if (/SOCKS/i.test(msg) && /fail|error/i.test(msg)) return "Bắt tay SOCKS thất bại";
	return msg.replace(/^Error:\s*/i, "").slice(0, 160) || "Proxy không phản hồi";
}
function parseExitIp(text) {
	const trimmed = text.trim();
	try {
		const json = JSON.parse(trimmed);
		if (json.ip) return json.ip;
	} catch {}
	const m = trimmed.match(/(\d{1,3}\.){3}\d{1,3}|[0-9a-f:]{4,}/i);
	return m ? m[0] : trimmed.slice(0, 64) || null;
}
function isSocks(type) {
	return type.toLowerCase().startsWith("socks");
}
function makeAgent(ip, port, type) {
	if (isSocks(type)) return new import_undici.Socks5ProxyAgent(`socks5://${ip}:${port}`);
	return new import_undici.ProxyAgent({
		uri: `http://${ip}:${port}`,
		connect: { timeout: 2500 }
	});
}
async function fetchViaProxy(opts) {
	const start = Date.now();
	const agent = makeAgent(opts.ip, opts.port, opts.type);
	try {
		const res = await (0, import_undici.fetch)(opts.url, {
			dispatcher: agent,
			signal: AbortSignal.timeout(opts.timeoutMs ?? 8e3),
			headers: {
				Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.9",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
				...opts.headers
			}
		});
		const buf = Buffer.from(await res.arrayBuffer());
		return {
			ok: res.status < 500,
			status: res.status,
			ms: Date.now() - start,
			body: buf,
			contentType: res.headers.get("content-type") ?? "",
			finalUrl: res.url || opts.url
		};
	} catch (err) {
		return {
			ok: false,
			status: 0,
			ms: Date.now() - start,
			body: Buffer.alloc(0),
			contentType: "",
			finalUrl: opts.url,
			error: describeProxyError(err)
		};
	} finally {
		await agent.close().catch(() => void 0);
	}
}
async function fetchDirect(opts) {
	const start = Date.now();
	try {
		const res = await fetch(opts.url, {
			signal: AbortSignal.timeout(opts.timeoutMs ?? 12e3),
			headers: {
				Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
				...opts.headers
			},
			redirect: "follow"
		});
		const buf = Buffer.from(await res.arrayBuffer());
		return {
			ok: res.status < 500,
			status: res.status,
			ms: Date.now() - start,
			body: buf,
			contentType: res.headers.get("content-type") ?? "",
			finalUrl: res.url || opts.url
		};
	} catch (err) {
		return {
			ok: false,
			status: 0,
			ms: Date.now() - start,
			body: Buffer.alloc(0),
			contentType: "",
			finalUrl: opts.url,
			error: describeProxyError(err)
		};
	}
}
async function probeProxy(node) {
	const res = await fetchViaProxy({
		ip: node.ip,
		port: node.port,
		type: node.type,
		url: IP_CHECK_URLS[0],
		timeoutMs: 2500,
		headers: { Accept: "application/json" }
	});
	if (res.ok && res.body.length) return {
		ok: true,
		ms: res.ms,
		exitIp: parseExitIp(res.body.subarray(0, 200).toString("utf8")),
		status: res.status,
		via: "proxy"
	};
	return {
		ok: false,
		ms: res.ms,
		exitIp: null,
		error: res.error ?? "Hết thời gian chờ",
		via: "proxy"
	};
}
async function pickLiveProxies(opts) {
	const { fetchProxyList } = await import("./proxy-client-CLfqVGVh.mjs").then((n) => n.o);
	const list = await fetchProxyList({
		apiKey: opts.apiKey,
		type: opts.type && opts.type !== "all" ? opts.type : void 0,
		country: opts.country && opts.country !== "ALL" ? opts.country : void 0,
		limit: 40
	});
	const budget = opts.budgetMs ?? 7e3;
	const deadline = Date.now() + budget;
	const live = [];
	const queue = [...list.proxies];
	let tried = 0;
	const concurrency = 6;
	const work = async () => {
		while (live.length < opts.count && Date.now() < deadline) {
			const node = queue.shift();
			if (!node) return;
			tried += 1;
			const probe = await probeProxy(node);
			if (probe.ok) live.push({
				...node,
				probe
			});
		}
	};
	await Promise.all(Array.from({ length: concurrency }, () => work()));
	return {
		live: live.slice(0, opts.count),
		tried
	};
}
function parseTitle(html) {
	return html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim().slice(0, 180) ?? "";
}
function prepareHtml(html, url) {
	let out = html;
	out = out.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
	if (!/<base\s/i.test(out)) out = out.replace(/<head([^>]*)>/i, `<head$1><base href="${url.replace(/"/g, "")}">`);
	return out;
}
//#endregion
export { fetchDirect, fetchViaProxy, parseTitle, pickLiveProxies, prepareHtml, probeProxy };
