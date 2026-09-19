import { i as __toESM } from "../_runtime.mjs";
import { u as __exportAll } from "./proxy-client-DNPLsrCj.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, d as DialogContent, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as useOrbitStore, r as cn, t as Button } from "./button-CF51ROdf.mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, c as union, i as literal, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as Settings2, c as Radio, f as Menu, h as Globe, i as Square, m as LayoutGrid, n as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proxy-check.functions-rTYWTC8G.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var checkProxyFn = createServerFn({ method: "POST" }).validator(ProxyInput.extend({ timeoutMs: number().int().min(800).max(8e3).optional() })).handler(createSsrRpc("6c5df79f99d3073797733b11f7556710911f1ec277a54c770ed73c03e808157a"));
var probeUrlFn = createServerFn({ method: "POST" }).validator(SessionInput.extend({ url: string().min(1) })).handler(createSsrRpc("a1315a8ac1ae3743a9af0d8272aa01185f81c71b64138ca828537d7d396aa0d6"));
var browseClickFn = createServerFn({ method: "POST" }).validator(object({
	profileId: string(),
	nx: number(),
	ny: number()
})).handler(createSsrRpc("6db96a05b968317a66c0eef7de6f8da57c8e04bb38d07d6e16cfe3d0350a5efa"));
var browseTypeFn = createServerFn({ method: "POST" }).validator(object({
	profileId: string(),
	text: string().optional(),
	key: string().optional()
})).handler(createSsrRpc("3051a87b5c35859027778f4bbbc946a01e0156c0e61b68dad73a539c9aad8cb8"));
var browseScrollFn = createServerFn({ method: "POST" }).validator(object({
	profileId: string(),
	dy: number()
})).handler(createSsrRpc("48776ec98a3f5f25f186509a55892db80af94381ae3992c81ebfca25c170a466"));
var browseCheckIpFn = createServerFn({ method: "POST" }).validator(SessionInput).handler(createSsrRpc("0c931efe5e10ce58a01522f2ea9c5368d1555d5deb48a1f5ce9ec187cbc13549"));
var closeSessionFn = createServerFn({ method: "POST" }).validator(object({ profileId: string() })).handler(createSsrRpc("e4e439640e8e2b8ba0fdacbe5f1c82429a6bb70789d68628539a9066798036b7"));
var pickLiveProxiesFn = createServerFn({ method: "POST" }).validator(object({
	apiKey: string().min(1),
	type: _enum([
		"https",
		"socks4",
		"socks5",
		"all"
	]).optional(),
	country: string().optional(),
	count: number().int().min(1).max(10),
	maxLatencyMs: number().optional(),
	minSpeed: _enum([
		"any",
		"good",
		"fast"
	]).optional(),
	httpsFallback: boolean().optional(),
	timeoutMs: number().int().min(800).max(8e3).optional()
})).handler(createSsrRpc("ef5d275e416919a950c076c8aea0451bbb3d14b105cf5f8578f2565f42ceef59"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-f65h8p9n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration: 250,
		children
	});
}
function AppProviders({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	const setHydrated = useOrbitStore((s) => s.setHydrated);
	(0, import_react.useEffect)(() => {
		useOrbitStore.persist.rehydrate();
		if (useOrbitStore.persist.hasHydrated()) setHydrated(true);
		return useOrbitStore.persist.onFinishHydration(() => setHydrated(true));
	}, [setHydrated]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "bottom-right",
			toastOptions: {
				className: "font-sans",
				style: {
					background: "var(--color-surface)",
					color: "var(--color-fg)",
					border: "1px solid var(--color-border)"
				}
			}
		})] })
	});
}
function hashSeed(seed) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function Identicon({ seed, className }) {
	const h = hashSeed(seed || "orbit");
	const cells = [];
	for (let i = 0; i < 15; i++) cells.push(Boolean(h >> i & 1));
	const fill = `oklch(0.72 0.07 ${110 + h % 40})`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 5 5",
		className: cn("size-8 rounded-xs", className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "5",
			height: "5",
			fill: "var(--color-elevated)"
		}), cells.map((on, i) => {
			const col = i % 3;
			const row = Math.floor(i / 3);
			if (!on) return null;
			const mirror = 4 - col;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: col,
					y: row,
					width: "1",
					height: "1"
				}), mirror !== col ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: mirror,
					y: row,
					width: "1",
					height: "1"
				}) : null]
			}, i);
		})]
	});
}
async function stopOrbitProfile(id) {
	useOrbitStore.getState().stopProfile(id);
	try {
		await closeSessionFn({ data: { profileId: id } });
	} catch {}
}
async function stopAllOrbitProfiles() {
	const ids = useOrbitStore.getState().profiles.filter((p) => p.status === "running").map((p) => p.id);
	useOrbitStore.getState().stopAll();
	await Promise.all(ids.map((id) => closeSessionFn({ data: { profileId: id } }).catch(() => void 0)));
}
function RunningDock() {
	const profiles = useOrbitStore((s) => s.profiles);
	const running = (0, import_react.useMemo)(() => profiles.filter((p) => p.status === "running"), [profiles]);
	if (running.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-t border-border bg-surface px-3 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 overflow-x-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-xs font-medium text-muted",
					children: ["Đang chạy", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 tabular-nums text-live",
						children: running.length
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 flex-1 gap-1.5",
					children: running.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/run/$id",
						params: { id: p.id },
						className: "flex h-10 min-w-40 items-center gap-2 rounded-sm bg-elevated px-2 text-left text-xs hover:shadow-[var(--shadow-border-hover)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Identicon, {
								seed: p.fingerprint.canvasSeed,
								className: "size-6 shrink-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-medium text-fg",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-mono text-xs text-subtle",
									children: p.proxy ? `${p.proxy.ip}:${p.proxy.port}` : "Không proxy"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-7 place-items-center rounded-xs text-muted hover:bg-bg hover:text-fg",
								"aria-label": `Dừng ${p.name}`,
								onClick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									stopOrbitProfile(p.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3 fill-current" })
							})
						]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => void stopAllOrbitProfiles(),
					className: "shrink-0",
					children: "Dừng hết"
				})
			]
		})
	});
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-72 flex-col border-border bg-surface p-4 shadow-[var(--shadow-border)]", side === "left" ? "inset-y-0 left-0 border-r" : "inset-y-0 right-0 border-l", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-1 text-muted hover:bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
var NAV = [
	{
		to: "/",
		label: "Hồ sơ",
		icon: LayoutGrid
	},
	{
		to: "/proxies",
		label: "Proxy",
		icon: Globe
	},
	{
		to: "/run",
		label: "Đang chạy",
		icon: Radio
	},
	{
		to: "/settings",
		label: "Cài đặt",
		icon: Settings2
	}
];
function NavLinks({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const running = useOrbitStore((s) => s.profiles.reduce((n, p) => n + (p.status === "running" ? 1 : 0), 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: item.label
					}),
					item.to === "/run" && running > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-xs text-live",
						children: running
					}) : null
				]
			}, item.to);
		})
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2.5 px-2 py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-8 place-items-center rounded-sm bg-elevated shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-full border-2 border-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-semibold tracking-tight",
			children: "Orbit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs text-subtle",
			children: "Multi-profile"
		})] })]
	});
}
function SidebarBody({ onNavigate }) {
	const profiles = useOrbitStore((s) => s.profiles.length);
	const running = useOrbitStore((s) => s.profiles.reduce((n, p) => n + (p.status === "running" ? 1 : 0), 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md bg-elevated p-3 text-xs text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hồ sơ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: profiles
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex justify-between tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phiên mở" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: running ? "text-live" : "text-fg",
						children: running
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs leading-relaxed text-subtle",
					children: "NextProxy US & EU Anycast · Developer Pro"
				})
			]
		})
	] });
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "hidden w-56 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center gap-3 border-b border-border px-4 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setOpen(true),
							"aria-label": "Mở menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
							side: "left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, { onNavigate: () => setOpen(false) })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex min-h-0 flex-1 flex-col",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunningDock, {})
			]
		})]
	});
}
var styles_default = "/assets/styles-DzMTou9L.css";
var APP_NAME = "Orbit";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0B0C0E"
			},
			{
				name: "description",
				content: "Orbit — quản lý nhiều hồ sơ trình duyệt, vân tay riêng và proxy NextProxy."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "vi",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-CtSvwngj.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./proxies-CZt4uPNH.mjs");
var Route$4 = createFileRoute("/proxies")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./run-cvljFpfU.mjs");
var Route$3 = createFileRoute("/run")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./settings-cYJ0XH_F.mjs");
var Route$2 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./run.index-CBtDd7Oz.mjs");
var Route$1 = createFileRoute("/run/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./run._id-BqI05pPp.mjs");
var Route = createFileRoute("/run/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var ProxiesRoute = Route$4.update({
	id: "/proxies",
	path: "/proxies",
	getParentRoute: () => Route$6
});
var RunRoute = Route$3.update({
	id: "/run",
	path: "/run",
	getParentRoute: () => Route$6
});
var SettingsRoute = Route$2.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$6
});
var RunIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => RunRoute
});
var RunRouteChildren = {
	RunIdRoute: Route.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => RunRoute
	}),
	RunIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	ProxiesRoute,
	RunRoute: RunRoute._addFileChildren(RunRouteChildren),
	SettingsRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { browseCheckIpFn as a, browseTypeFn as c, probeUrlFn as d, Identicon as i, checkProxyFn as l, Route as n, browseClickFn as o, stopOrbitProfile as r, browseScrollFn as s, router_exports as t, pickLiveProxiesFn as u };
