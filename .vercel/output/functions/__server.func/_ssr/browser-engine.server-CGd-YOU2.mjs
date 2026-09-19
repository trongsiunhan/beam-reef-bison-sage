import { fetchDirect, fetchViaProxy, parseTitle, prepareHtml, probeProxy } from "./proxy-tunnel.server-C0Jwv65i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browser-engine.server-CGd-YOU2.js
var sessions = /* @__PURE__ */ new Map();
var browserPromise = null;
var MAX_SESSIONS = 3;
var VIEW_W = 1280;
var VIEW_H = 800;
function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
async function loadChromium() {
	return (await import("playwright")).chromium;
}
async function getBrowser() {
	if (!browserPromise) browserPromise = loadChromium().then((chromium) => chromium.launch({
		headless: true,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--disable-gpu",
			"--disable-blink-features=AutomationControlled"
		]
	}));
	try {
		const browser = await browserPromise;
		if (!browser.isConnected()) throw new Error("disconnected");
		return browser;
	} catch {
		browserPromise = null;
		browserPromise = (await loadChromium()).launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-gpu"
			]
		});
		return browserPromise;
	}
}
function proxyKeyOf(proxy, via) {
	if (!proxy || via === "direct") return "direct";
	return `${proxy.type}:${proxy.ip}:${proxy.port}`;
}
function playwrightProxy(proxy) {
	return { server: `${proxy.type.startsWith("socks") ? "socks5" : "http"}://${proxy.ip}:${proxy.port}` };
}
async function evictOldest() {
	if (sessions.size < MAX_SESSIONS) return;
	let oldest = null;
	for (const s of sessions.values()) if (!oldest || s.lastUsed < oldest.lastUsed) oldest = s;
	if (oldest) await closeSession(oldest.profileId);
}
async function screenshotOf(page) {
	return `data:image/jpeg;base64,${(await page.screenshot({
		type: "jpeg",
		quality: 58,
		timeout: 8e3
	})).toString("base64")}`;
}
function cookieDomain(raw, fallbackHost) {
	const d = raw.trim();
	if (!d) return fallbackHost;
	return d.replace(/^\./, "");
}
async function closeSession(profileId) {
	const s = sessions.get(profileId);
	if (!s) return;
	sessions.delete(profileId);
	await s.context.close().catch(() => void 0);
}
async function ensureSession(opts) {
	const existing = sessions.get(opts.profileId);
	const [browser, viaProbe] = await Promise.all([getBrowser(), opts.proxy ? probeProxy(opts.proxy) : Promise.resolve(null)]);
	const via = viaProbe?.ok ? "proxy" : "direct";
	const proxyError = opts.proxy && !viaProbe?.ok ? viaProbe?.error ?? "Node không tới được từ máy chủ" : void 0;
	const key = proxyKeyOf(opts.proxy, via);
	if (existing && existing.proxyKey === key && existing.ua === opts.fingerprint.userAgent) {
		existing.lastUsed = Date.now();
		return {
			session: existing,
			proxyError
		};
	}
	if (existing) await closeSession(opts.profileId);
	await evictOldest();
	const viewport = {
		width: VIEW_W,
		height: VIEW_H
	};
	const context = await browser.newContext({
		viewport,
		userAgent: opts.fingerprint.userAgent,
		locale: opts.fingerprint.language || "en-US",
		timezoneId: opts.fingerprint.timezone || "UTC",
		deviceScaleFactor: 1,
		colorScheme: "light",
		proxy: via === "proxy" && opts.proxy ? playwrightProxy(opts.proxy) : void 0,
		ignoreHTTPSErrors: true
	});
	await context.addInitScript(() => {
		Object.defineProperty(navigator, "webdriver", { get: () => void 0 });
	});
	const page = await context.newPage();
	page.setDefaultTimeout(2e4);
	if (opts.cookies?.length) {
		const host = "chatgpt.com";
		await context.addCookies(opts.cookies.filter((c) => c.name).map((c) => ({
			name: c.name,
			value: c.value,
			domain: cookieDomain(c.domain, host),
			path: c.path || "/"
		}))).catch(() => void 0);
	}
	const session = {
		profileId: opts.profileId,
		proxyKey: key,
		ua: opts.fingerprint.userAgent,
		context,
		page,
		viewport,
		via,
		lastUsed: Date.now(),
		chain: Promise.resolve()
	};
	sessions.set(opts.profileId, session);
	return {
		session,
		proxyError
	};
}
function run(session, fn) {
	const next = session.chain.then(fn, fn);
	session.chain = next.then(() => void 0, () => void 0);
	return next;
}
async function frameFromPage(session, extra) {
	const page = session.page;
	const url = page.url();
	const title = await page.title().catch(() => "");
	let screenshot = null;
	try {
		screenshot = await screenshotOf(page);
	} catch {
		screenshot = null;
	}
	session.lastUsed = Date.now();
	return {
		ok: true,
		ms: extra.ms,
		url,
		title,
		screenshot,
		html: null,
		snippet: title,
		via: session.via,
		engine: "chromium",
		exitIp: extra.exitIp ?? null,
		proxyError: extra.proxyError,
		viewport: session.viewport
	};
}
async function fetchFallback(opts) {
	const start = Date.now();
	let res = opts.proxy ? await fetchViaProxy({
		ip: opts.proxy.ip,
		port: opts.proxy.port,
		type: opts.proxy.type,
		url: opts.url,
		timeoutMs: 1e4,
		headers: { "User-Agent": opts.fingerprint.userAgent }
	}) : null;
	let via = "proxy";
	if (!res?.ok) {
		via = "direct";
		res = await fetchDirect({
			url: opts.url,
			timeoutMs: 12e3,
			headers: { "User-Agent": opts.fingerprint.userAgent }
		});
	}
	const raw = res.body.subarray(0, 4e5).toString("utf8");
	const isHtml = /html/i.test(res.contentType) || /<html/i.test(raw);
	const title = isHtml ? parseTitle(raw) : "";
	const snippet = raw.replace(/\s+/g, " ").trim().slice(0, 400);
	return {
		ok: res.ok,
		ms: Date.now() - start,
		url: res.finalUrl,
		title,
		screenshot: null,
		html: isHtml ? prepareHtml(raw, res.finalUrl) : null,
		snippet: isHtml ? snippet : raw.slice(0, 800),
		via,
		engine: "fetch",
		exitIp: null,
		error: res.ok ? void 0 : res.error,
		proxyError: opts.proxyError ?? (via === "direct" && opts.proxy ? res.error : void 0)
	};
}
function extractIpFromBody(text) {
	try {
		const json = JSON.parse(text);
		if (json.ip) return json.ip;
	} catch {}
	const m = text.match(/(\d{1,3}\.){3}\d{1,3}/);
	return m ? m[0] : null;
}
async function browseNavigate(opts) {
	const start = Date.now();
	try {
		const { session, proxyError } = await ensureSession(opts);
		return await run(session, async () => {
			await session.page.goto(opts.url, {
				waitUntil: "domcontentloaded",
				timeout: 22e3
			});
			await sleep(1200);
			try {
				await session.page.waitForLoadState("networkidle", { timeout: 2500 });
			} catch {}
			return frameFromPage(session, {
				ms: Date.now() - start,
				proxyError
			});
		});
	} catch (err) {
		const proxyError = err instanceof Error ? err.message : "Chromium không mở được";
		try {
			return await fetchFallback({
				url: opts.url,
				proxy: opts.proxy,
				fingerprint: opts.fingerprint,
				proxyError
			});
		} catch (fallbackErr) {
			return {
				ok: false,
				ms: Date.now() - start,
				url: opts.url,
				title: "",
				screenshot: null,
				html: null,
				snippet: null,
				via: "direct",
				engine: "fetch",
				exitIp: null,
				error: fallbackErr instanceof Error ? fallbackErr.message : "Không tải được trang",
				proxyError
			};
		}
	}
}
async function browseClick(opts) {
	const start = Date.now();
	const session = sessions.get(opts.profileId);
	if (!session) return {
		ok: false,
		ms: 0,
		url: "",
		title: "",
		screenshot: null,
		html: null,
		snippet: null,
		via: "direct",
		engine: "chromium",
		exitIp: null,
		error: "Phiên Chromium chưa mở — nhập URL rồi Đi"
	};
	return run(session, async () => {
		const x = Math.round(Math.min(1, Math.max(0, opts.nx)) * session.viewport.width);
		const y = Math.round(Math.min(1, Math.max(0, opts.ny)) * session.viewport.height);
		await session.page.mouse.click(x, y);
		await sleep(450);
		try {
			await session.page.waitForLoadState("domcontentloaded", { timeout: 4e3 });
		} catch {}
		return frameFromPage(session, { ms: Date.now() - start });
	});
}
async function browseType(opts) {
	const start = Date.now();
	const session = sessions.get(opts.profileId);
	if (!session) return {
		ok: false,
		ms: 0,
		url: "",
		title: "",
		screenshot: null,
		html: null,
		snippet: null,
		via: "direct",
		engine: "chromium",
		exitIp: null,
		error: "Phiên Chromium chưa mở"
	};
	return run(session, async () => {
		if (opts.key) await session.page.keyboard.press(opts.key);
		else if (opts.text) await session.page.keyboard.type(opts.text, { delay: 12 });
		await sleep(200);
		return frameFromPage(session, { ms: Date.now() - start });
	});
}
async function browseScroll(opts) {
	const start = Date.now();
	const session = sessions.get(opts.profileId);
	if (!session) return {
		ok: false,
		ms: 0,
		url: "",
		title: "",
		screenshot: null,
		html: null,
		snippet: null,
		via: "direct",
		engine: "chromium",
		exitIp: null,
		error: "Phiên Chromium chưa mở"
	};
	return run(session, async () => {
		await session.page.mouse.wheel(0, opts.dy);
		await sleep(180);
		return frameFromPage(session, { ms: Date.now() - start });
	});
}
async function browseCheckIp(opts) {
	const start = Date.now();
	let exitIp = null;
	if (opts.proxy) {
		const probe = await probeProxy(opts.proxy);
		if (probe.ok) exitIp = probe.exitIp;
	}
	const frame = await browseNavigate({
		...opts,
		url: "https://api.ipify.org?format=json"
	});
	if (!exitIp && frame.snippet) exitIp = extractIpFromBody(frame.snippet);
	if (!exitIp) try {
		exitIp = extractIpFromBody(await sessions.get(opts.profileId)?.page.textContent("body") ?? "");
	} catch {}
	return {
		...frame,
		exitIp,
		ms: Date.now() - start
	};
}
setInterval(() => {
	const now = Date.now();
	for (const [id, s] of sessions) if (now - s.lastUsed > 3e5) closeSession(id);
}, 6e4).unref?.();
//#endregion
export { browseCheckIp, browseClick, browseNavigate, browseScroll, browseType, closeSession };
