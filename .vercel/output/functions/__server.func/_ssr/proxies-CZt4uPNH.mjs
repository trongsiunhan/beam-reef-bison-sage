import { i as __toESM } from "../_runtime.mjs";
import { a as fetchProxyList, i as fetchCountries, l as withoutProbe, o as filterAndRank, r as fetchClusterStats, s as livePickData } from "./proxy-client-DNPLsrCj.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as formatLatency, l as useOrbitStore, s as hostPort, t as Button } from "./button-CF51ROdf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DS65vWDG.mjs";
import { t as Badge } from "./badge-zmTSTDk0.mjs";
import { t as Skeleton } from "./skeleton-DDmnMcph.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as checkProxyFn, u as pickLiveProxiesFn } from "./router-f65h8p9n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proxies-CZt4uPNH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProxyPool() {
	const settings = useOrbitStore((s) => s.settings);
	const profiles = useOrbitStore((s) => s.profiles);
	const assignProxy = useOrbitStore((s) => s.assignProxy);
	const updateProfile = useOrbitStore((s) => s.updateProfile);
	const selectedIds = useOrbitStore((s) => s.selectedIds);
	const [type, setType] = (0, import_react.useState)(settings.defaultProxyType);
	const [country, setCountry] = (0, import_react.useState)(settings.preferredCountry || "ALL");
	const [checking, setChecking] = (0, import_react.useState)(null);
	const [busyLive, setBusyLive] = (0, import_react.useState)(false);
	const [checked, setChecked] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		setType(settings.defaultProxyType);
		setCountry(settings.preferredCountry || "ALL");
	}, [settings.defaultProxyType, settings.preferredCountry]);
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
			country,
			settings.maxLatencyMs,
			settings.minSpeed
		],
		queryFn: async () => {
			const data = await fetchProxyList({
				apiKey: settings.apiKey,
				type,
				country: country === "ALL" ? void 0 : country,
				limit: 80
			});
			return {
				...data,
				proxies: filterAndRank(data.proxies, {
					maxLatencyMs: settings.maxLatencyMs,
					minSpeed: settings.minSpeed
				})
			};
		}
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
				type: proxy.type,
				timeoutMs: settings.probeTimeoutMs
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
	const probeBest = async () => {
		setBusyLive(true);
		try {
			const found = await pickLiveProxiesFn({ data: livePickData(settings, {
				type,
				country,
				count: 6
			}) });
			const next = { ...checked };
			for (const node of found.live) next[hostPort(node.ip, node.port)] = {
				ok: true,
				ms: node.probe.ms,
				exitIp: node.probe.exitIp
			};
			setChecked(next);
			toast.success(found.live.length ? `Sống ${found.live.length} node · đã dò ${found.tried}` : `Không có node sống (đã thử ${found.tried}). Nới bộ lọc trong Cài đặt.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không dò được cụm");
		} finally {
			setBusyLive(false);
		}
	};
	const assignLive = async () => {
		const target = selectedIds[0] ?? idleProfiles[0]?.id;
		if (!target) {
			toast.error("Hãy chọn hoặc tạo một hồ sơ trước");
			return;
		}
		setBusyLive(true);
		try {
			const next = (await pickLiveProxiesFn({ data: livePickData(settings, {
				type,
				country,
				count: 1
			}) })).live[0];
			if (!next) {
				toast.error("Không tìm thấy node sống khớp bộ lọc");
				return;
			}
			const node = withoutProbe(next);
			assignProxy(target, node);
			updateProfile(target, {
				proxyHealth: "live",
				exitIp: next.probe.exitIp,
				lastCheckMs: next.probe.ms
			});
			const name = profiles.find((p) => p.id === target)?.name ?? "hồ sơ";
			toast.success(`Live ${hostPort(node.ip, node.port)} → ${name} · ${next.probe.ms} ms`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không gán được");
		} finally {
			setBusyLive(false);
		}
	};
	const rows = listQ.data?.proxies ?? [];
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
				children: [
					statsQ.data?.client?.tier ?? "NextProxy",
					statsQ.data?.lastRefreshed ? ` · đồng bộ ${new Date(statsQ.data.lastRefreshed).toLocaleTimeString("vi-VN")}` : "",
					` · xếp ${settings.minSpeed === "fast" ? "Fast+" : settings.minSpeed === "good" ? "Good+" : "mọi tốc độ"}`,
					settings.maxLatencyMs > 0 ? ` · ≤${settings.maxLatencyMs} ms` : " · không lọc trễ"
				]
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
								value: "https",
								children: "HTTPS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "socks5",
								children: "SOCKS5"
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busyLive,
						onClick: () => void probeBest(),
						children: busyLive ? "Đang dò…" : "Dò node sống"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "live",
						disabled: busyLive,
						onClick: () => void assignLive(),
						children: "Gán node sống"
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Tốc độ"
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => {
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
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedMark, { tier: p.speedTier })
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 p-2 md:hidden",
						children: rows.map((p) => {
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
											p.speedTier || "—",
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
					}),
					rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-10 text-center text-sm text-muted",
						children: "Không còn node khớp bộ lọc. Nới tốc độ / độ trễ trong Cài đặt."
					}) : null
				]
			})
		]
	});
}
function SpeedMark({ tier }) {
	const t = tier.toLowerCase();
	if (t === "fast") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "live",
		children: "Fast"
	});
	if (t === "good") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "accent",
		children: "Good"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted",
		children: tier || "—"
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
				children: "Node xếp Fast/Good, độ trễ thấp, cổng phổ biến trước. Dò sống rồi gán — HTTPS mặc định, SOCKS tự fallback."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProxyPool, {})]
	});
}
//#endregion
export { ProxiesPage as component };
