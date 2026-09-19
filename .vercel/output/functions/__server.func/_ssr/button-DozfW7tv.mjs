import { i as __toESM } from "../_runtime.mjs";
import { t as DEFAULT_API_KEY } from "./proxy-client-CLfqVGVh.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as Slot, P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DozfW7tv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function formatRelative(ts) {
	if (!ts) return "Chưa mở";
	const diff = Date.now() - ts;
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "Vừa xong";
	if (mins < 60) return `${mins} phút trước`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours} giờ trước`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} ngày trước`;
	return new Date(ts).toLocaleDateString("vi-VN");
}
function formatLatency(ms) {
	if (!Number.isFinite(ms) || ms <= 0) return "—";
	return `${Math.round(ms)} ms`;
}
function hostPort(ip, port) {
	return `${ip}:${port}`;
}
var COUNTRY_LOCALE = {
	US: {
		timezone: "America/New_York",
		language: "en-US",
		languages: ["en-US", "en"]
	},
	GB: {
		timezone: "Europe/London",
		language: "en-GB",
		languages: ["en-GB", "en"]
	},
	DE: {
		timezone: "Europe/Berlin",
		language: "de-DE",
		languages: [
			"de-DE",
			"de",
			"en"
		]
	},
	NL: {
		timezone: "Europe/Amsterdam",
		language: "nl-NL",
		languages: [
			"nl-NL",
			"nl",
			"en"
		]
	},
	FR: {
		timezone: "Europe/Paris",
		language: "fr-FR",
		languages: [
			"fr-FR",
			"fr",
			"en"
		]
	},
	CA: {
		timezone: "America/Toronto",
		language: "en-CA",
		languages: [
			"en-CA",
			"en",
			"fr-CA"
		]
	},
	SG: {
		timezone: "Asia/Singapore",
		language: "en-SG",
		languages: [
			"en-SG",
			"en",
			"zh-SG"
		]
	},
	JP: {
		timezone: "Asia/Tokyo",
		language: "ja-JP",
		languages: [
			"ja-JP",
			"ja",
			"en"
		]
	},
	SE: {
		timezone: "Europe/Stockholm",
		language: "sv-SE",
		languages: [
			"sv-SE",
			"sv",
			"en"
		]
	},
	FI: {
		timezone: "Europe/Helsinki",
		language: "fi-FI",
		languages: [
			"fi-FI",
			"fi",
			"en"
		]
	},
	PL: {
		timezone: "Europe/Warsaw",
		language: "pl-PL",
		languages: [
			"pl-PL",
			"pl",
			"en"
		]
	},
	RO: {
		timezone: "Europe/Bucharest",
		language: "ro-RO",
		languages: [
			"ro-RO",
			"ro",
			"en"
		]
	},
	VN: {
		timezone: "Asia/Ho_Chi_Minh",
		language: "vi-VN",
		languages: [
			"vi-VN",
			"vi",
			"en"
		]
	}
};
function localeForCountry(code) {
	if (!code) return COUNTRY_LOCALE.US;
	return COUNTRY_LOCALE[code.toUpperCase()] ?? COUNTRY_LOCALE.US;
}
var WINDOWS_SCREENS = [
	[1920, 1080],
	[1366, 768],
	[1536, 864],
	[2560, 1440],
	[1280, 720],
	[1440, 900]
];
var MAC_SCREENS = [
	[1440, 900],
	[1512, 982],
	[1680, 1050],
	[1920, 1080],
	[2560, 1600]
];
var WIN_FONTS = [
	"Arial",
	"Calibri",
	"Cambria",
	"Consolas",
	"Courier New",
	"Georgia",
	"Segoe UI",
	"Tahoma",
	"Times New Roman",
	"Trebuchet MS",
	"Verdana"
];
var MAC_FONTS = [
	"Arial",
	"Geneva",
	"Helvetica",
	"Helvetica Neue",
	"Menlo",
	"Monaco",
	"San Francisco",
	"Times",
	"Verdana"
];
var LINUX_FONTS = [
	"DejaVu Sans",
	"Liberation Sans",
	"Noto Sans",
	"Ubuntu",
	"FreeSans",
	"Courier 10 Pitch"
];
var NVIDIA = [
	"ANGLE (NVIDIA GeForce GTX 1660 Super Direct3D11 vs_5_0 ps_5_0)",
	"ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)",
	"ANGLE (NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)"
];
var INTEL = ["ANGLE (Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)", "ANGLE (Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)"];
var APPLE_GPU = [
	"Apple M1",
	"Apple M2",
	"Apple M3",
	"Apple M4"
];
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function chromeVersion() {
	const major = pick([
		139,
		140,
		141,
		142
	]);
	return {
		major,
		full: `${major}.0.${randInt(7200, 7550)}.${randInt(40, 180)}`
	};
}
function seed() {
	return uid("fp").replace("fp_", "");
}
function generateFingerprint(opts) {
	const os = opts?.os ?? pick([
		"Windows 11",
		"Windows 11",
		"Windows 10",
		"macOS Sonoma",
		"Linux"
	]);
	const engine = opts?.engine ?? (os.startsWith("Windows") ? pick([
		"Chrome",
		"Chrome",
		"Edge"
	]) : "Chrome");
	const locale = localeForCountry(opts?.country);
	const ver = chromeVersion();
	let platform = "Win32";
	let screen = pick(WINDOWS_SCREENS);
	let fonts = WIN_FONTS;
	let webglVendor = "Google Inc. (NVIDIA)";
	let webglRenderer = pick(NVIDIA);
	let hardwareConcurrency = pick([
		4,
		8,
		8,
		12,
		16
	]);
	let deviceMemory = pick([
		4,
		8,
		8,
		16
	]);
	let pixelRatio = pick([
		1,
		1,
		1.25,
		1.5
	]);
	let maxTouchPoints = 0;
	if (os === "Windows 10" || os === "Windows 11") {
		platform = "Win32";
		if (Math.random() < .4) {
			webglVendor = "Google Inc. (Intel)";
			webglRenderer = pick(INTEL);
		}
	} else if (os.startsWith("macOS")) {
		platform = "MacIntel";
		screen = pick(MAC_SCREENS);
		fonts = MAC_FONTS;
		webglVendor = "Google Inc. (Apple)";
		webglRenderer = `ANGLE (${pick(APPLE_GPU)} Metal Renderer)`;
		hardwareConcurrency = pick([
			8,
			8,
			10,
			12
		]);
		deviceMemory = pick([
			8,
			16,
			16
		]);
		pixelRatio = pick([
			2,
			2,
			2
		]);
	} else {
		platform = "Linux x86_64";
		fonts = LINUX_FONTS;
		webglVendor = "Google Inc. (NVIDIA)";
		webglRenderer = pick(NVIDIA);
	}
	let userAgent = "";
	if (engine === "Firefox") {
		const fx = pick([
			131,
			132,
			133
		]);
		if (os.startsWith("macOS")) userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 14.6; rv:${fx}.0) Gecko/20100101 Firefox/${fx}.0`;
		else if (os === "Linux") userAgent = `Mozilla/5.0 (X11; Linux x86_64; rv:${fx}.0) Gecko/20100101 Firefox/${fx}.0`;
		else userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${fx}.0) Gecko/20100101 Firefox/${fx}.0`;
	} else {
		const gecko = `Mozilla/5.0`;
		const apple = `AppleWebKit/537.36 (KHTML, like Gecko)`;
		const chrome = `${engine === "Edge" ? "Chrome" : "Chrome"}/${ver.full} Safari/537.36`;
		const edge = engine === "Edge" ? ` Edg/${ver.full}` : "";
		if (os.startsWith("macOS")) userAgent = `${gecko} (Macintosh; Intel Mac OS X 10_15_7) ${apple} ${chrome}${edge}`;
		else if (os === "Linux") userAgent = `${gecko} (X11; Linux x86_64) ${apple} ${chrome}${edge}`;
		else userAgent = `${gecko} (Windows NT 10.0; Win64; x64) ${apple} ${chrome}${edge}`;
	}
	return {
		os,
		engine,
		browserVersion: engine === "Firefox" ? userAgent.match(/Firefox\/(\d+)/)?.[1] ?? "132" : ver.full,
		userAgent,
		platform,
		language: locale.language,
		languages: locale.languages,
		timezone: locale.timezone,
		screenWidth: screen[0],
		screenHeight: screen[1],
		colorDepth: 24,
		pixelRatio,
		hardwareConcurrency,
		deviceMemory,
		webglVendor,
		webglRenderer,
		canvasSeed: seed(),
		audioSeed: seed(),
		webrtcMode: "proxy",
		doNotTrack: false,
		maxTouchPoints,
		fonts
	};
}
function applyGeoToFingerprint(fp, country) {
	const locale = localeForCountry(country);
	return {
		...fp,
		language: locale.language,
		languages: locale.languages,
		timezone: locale.timezone
	};
}
var DEFAULT_GROUPS = [
	{
		id: "g_default",
		name: "Mặc định"
	},
	{
		id: "g_ads",
		name: "Quảng cáo"
	},
	{
		id: "g_shop",
		name: "Thương mại"
	},
	{
		id: "g_test",
		name: "Thử nghiệm"
	}
];
function blankProfile(partial) {
	const fp = applyGeoToFingerprint(partial?.fingerprint ?? generateFingerprint({ country: partial?.country }), partial?.country ?? partial?.proxy?.country);
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
		startUrl: partial?.startUrl ?? "https://api.ipify.org"
	};
}
var useOrbitStore = create()(persist((set, get) => ({
	profiles: [],
	groups: DEFAULT_GROUPS,
	settings: {
		apiKey: DEFAULT_API_KEY,
		defaultProxyType: "socks5",
		autoAssignProxy: true,
		defaultStartUrl: "https://api.ipify.org",
		syncGeoToProxy: true
	},
	selectedIds: [],
	activeSessionId: null,
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	setSelected: (ids) => set({ selectedIds: ids }),
	toggleSelected: (id) => set((s) => ({ selectedIds: s.selectedIds.includes(id) ? s.selectedIds.filter((x) => x !== id) : [...s.selectedIds, id] })),
	createGroup: (name) => {
		const id = uid("g");
		set((s) => ({ groups: [...s.groups, {
			id,
			name
		}] }));
		return id;
	},
	createProfile: (input) => {
		const settings = get().settings;
		const profile = blankProfile({
			startUrl: settings.defaultStartUrl,
			...input
		});
		set((s) => ({ profiles: [profile, ...s.profiles] }));
		return profile;
	},
	updateProfile: (id, patch) => set((s) => ({ profiles: s.profiles.map((p) => p.id === id ? {
		...p,
		...patch
	} : p) })),
	deleteProfiles: (ids) => set((s) => ({
		profiles: s.profiles.filter((p) => !ids.includes(p.id)),
		selectedIds: s.selectedIds.filter((id) => !ids.includes(id)),
		activeSessionId: ids.includes(s.activeSessionId ?? "") ? null : s.activeSessionId
	})),
	assignProxy: (id, proxy) => set((s) => ({ profiles: s.profiles.map((p) => {
		if (p.id !== id) return p;
		const fingerprint = proxy && s.settings.syncGeoToProxy ? applyGeoToFingerprint(p.fingerprint, proxy.country) : p.fingerprint;
		return {
			...p,
			proxy,
			fingerprint,
			proxyHealth: proxy ? "assigned" : "none",
			exitIp: null
		};
	}) })),
	startProfile: (id) => set((s) => ({
		profiles: s.profiles.map((p) => p.id === id ? {
			...p,
			status: "running",
			lastOpenedAt: Date.now()
		} : p),
		activeSessionId: id
	})),
	stopProfile: (id) => set((s) => ({
		profiles: s.profiles.map((p) => p.id === id ? {
			...p,
			status: "idle"
		} : p),
		activeSessionId: s.activeSessionId === id ? null : s.activeSessionId
	})),
	stopAll: () => set((s) => ({
		profiles: s.profiles.map((p) => ({
			...p,
			status: "idle"
		})),
		activeSessionId: null
	})),
	setSettings: (patch) => set((s) => ({ settings: {
		...s.settings,
		...patch
	} })),
	setActiveSession: (id) => set({ activeSessionId: id }),
	pushHistory: (id, url, title) => set((s) => ({ profiles: s.profiles.map((p) => p.id === id ? {
		...p,
		history: p.history[0]?.url === url ? [{
			url,
			title,
			at: Date.now()
		}, ...p.history.slice(1)].slice(0, 40) : [{
			url,
			title,
			at: Date.now()
		}, ...p.history].slice(0, 40)
	} : p) }))
}), {
	name: "orbit-login-v1",
	skipHydration: true,
	partialize: (s) => ({
		profiles: s.profiles,
		groups: s.groups,
		settings: s.settings
	})
}));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-[var(--ease-smooth-out)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-fg hover:bg-elevated",
			outline: "border border-border bg-transparent text-fg hover:bg-elevated",
			danger: "bg-danger text-primary-fg hover:opacity-90",
			live: "bg-live text-primary-fg hover:opacity-90"
		},
		size: {
			default: "h-10 px-3.5",
			sm: "h-8 px-2.5 text-xs",
			lg: "h-11 px-4",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { formatRelative as a, uid as c, formatLatency as i, useOrbitStore as l, buttonVariants as n, generateFingerprint as o, cn as r, hostPort as s, Button as t };
