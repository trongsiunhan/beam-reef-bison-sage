import { i as __toESM } from "../_runtime.mjs";
import { i as fetchProxyList, n as fetchClusterStats, r as fetchCountries } from "./proxy-client-CLfqVGVh.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as formatLatency, l as useOrbitStore, s as hostPort, t as Button } from "./button-DozfW7tv.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B5MD37xf.mjs";
import { t as Badge } from "./badge-DmBDS5in.mjs";
import { t as Skeleton } from "./skeleton-C1ttaMSq.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as checkProxyFn } from "./router-B--Rj75x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proxies-DRJg8Epa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProxyPool() {
	const settings = useOrbitStore((s) => s.settings);
	const profiles = useOrbitStore((s) => s.profiles);
	const assignProxy = useOrbitStore((s) => s.assignProxy);
	const selectedIds = useOrbitStore((s) => s.selectedIds);
	const [type, setType] = (0, import_react.useState)(settings.defaultProxyType);
	const [country, setCountry] = (0, import_react.useState)("ALL");
	const [checking, setChecking] = (0, import_react.useState)(null);
	const [checked, setChecked] = (0, import_react.useState)({});
	const statsQ = useQuery({
		queryKey: ["np-stats", settings.apiKey],
		queryFn: () => fetchClusterStats(settings.apiKey),
		refetchInterval: 2e4
	});
	const countriesQ = useQuery({
		queryKey: ["np-countries", settings.apiKey],
		queryFn: () => fetchCountries(settings.apiKey)
	});
	const listQ = useQuery({
		queryKey: [
			"np-list",
			settings.apiKey,
			type,
			country
		],
		queryFn: () => fetchProxyList({
			apiKey: settings.apiKey,
			type,
			country: country === "ALL" ? void 0 : country,
			limit: 50
		})
	});
	const counts = statsQ.data?.counts;
	const idleProfiles = (0, import_react.useMemo)(() => profiles.filter((p) => selectedIds.includes(p.id) || p.status === "idle"), [profiles, selectedIds]);
	const assignTo = (proxy, profileId) => {
		const target = profileId ?? selectedIds[0] ?? idleProfiles[0]?.id;
		if (!target) {
			toast.error("Hãy chọn hoặc tạo một hồ sơ trước");
			return;
		}
		assignProxy(target, proxy);
		const name = profiles.find((p) => p.id === target)?.name ?? "hồ sơ";
		toast.success(`Đã gán ${hostPort(proxy.ip, proxy.port)} → ${name}`);
	};
	const check = async (proxy) => {
		const key = hostPort(proxy.ip, proxy.port);
		setChecking(key);
		try {
			const res = await checkProxyFn({ data: {
				ip: proxy.ip,
				port: proxy.port,
				type: proxy.type
			} });
			setChecked((m) => ({
				...m,
				[key]: {
					ok: res.ok,
					ms: res.ms,
					exitIp: res.exitIp
				}
			}));
			toast[res.ok ? "success" : "error"](res.ok ? `Live · ${res.exitIp ?? key} · ${res.ms} ms` : res.error ?? "Chết");
		} finally {
			setChecking(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "HTTPS",
						value: counts?.https
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "SOCKS5",
						value: counts?.socks5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "SOCKS4",
						value: counts?.socks4
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tổng node",
						value: counts?.total
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [statsQ.data?.client?.tier ?? "NextProxy", statsQ.data?.lastRefreshed ? ` · đồng bộ ${new Date(statsQ.data.lastRefreshed).toLocaleTimeString("vi-VN")}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: (v) => setType(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Mọi loại"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "socks5",
								children: "SOCKS5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "https",
								children: "HTTPS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "socks4",
								children: "SOCKS4"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: country,
						onValueChange: setCountry,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "ALL",
							children: "Mọi quốc gia"
						}), (countriesQ.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.code,
							children: [
								c.code,
								" · ",
								c.name
							]
						}, c.code))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => void listQ.refetch(),
						children: "Làm mới"
					})
				]
			}),
			listQ.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" })
				]
			}) : listQ.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-danger/10 p-3 text-sm text-danger",
				children: "Không tải được cụm proxy. Kiểm tra API key trong Cài đặt."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-lg border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface text-xs text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Node"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Loại"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Quốc gia"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Độ trễ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Check"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (listQ.data?.proxies ?? []).map((p) => {
							const key = hostPort(p.ip, p.port);
							const result = checked[key];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs",
										children: key
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 uppercase text-muted",
										children: p.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-2",
										children: [
											p.country,
											" · ",
											p.countryName
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 tabular-nums text-muted",
										children: formatLatency(p.latency)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: result.ok ? "live" : "danger",
											children: result.ok ? `${result.ms} ms` : "dead"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-subtle",
											children: "—"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												disabled: checking === key,
												onClick: () => void check(p),
												children: checking === key ? "…" : "Check"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "secondary",
												onClick: () => assignTo(p),
												children: "Gán"
											})]
										})
									})
								]
							}, key);
						}) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 p-2 md:hidden",
					children: (listQ.data?.proxies ?? []).map((p) => {
						const key = hostPort(p.ip, p.port);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-md bg-surface p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs",
									children: key
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: [
										p.type.toUpperCase(),
										" · ",
										p.country,
										" · ",
										formatLatency(p.latency)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "flex-1",
										onClick: () => void check(p),
										children: "Check"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										className: "flex-1",
										onClick: () => assignTo(p),
										children: "Gán"
									})]
								})
							]
						}, key);
					})
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xl font-semibold tabular-nums tracking-tight",
			children: typeof value === "number" ? value.toLocaleString("vi-VN") : "—"
		})]
	});
}
function ProxiesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col gap-5 p-4 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-accent uppercase",
				children: "Nguồn dữ liệu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-semibold tracking-tight",
				children: "Cụm proxy NextProxy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "Node live HTTPS / SOCKS từ NextProxy. Check IP đi qua tunnel thật (SOCKS5 CONNECT), không chỉ bắt tay TCP."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProxyPool, {})]
	});
}
//#endregion
export { ProxiesPage as component };
