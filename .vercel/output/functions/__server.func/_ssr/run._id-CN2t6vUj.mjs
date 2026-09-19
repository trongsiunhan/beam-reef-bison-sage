import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as useOrbitStore, r as cn, s as hostPort, t as Button } from "./button-DozfW7tv.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ArrowRight, i as Square, p as Lock, s as RefreshCw, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-DmBDS5in.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as browseCheckIpFn, c as browseTypeFn, d as probeUrlFn, i as Identicon, n as Route, o as browseClickFn, r as stopOrbitProfile, s as browseScrollFn, u as pickLiveProxiesFn } from "./router-B--Rj75x.mjs";
import { n as Label, t as Input } from "./label-Ca_GbLpp.mjs";
import { a as Textarea, i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./textarea-CV7DeE_J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run._id-CN2t6vUj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK_URLS = [
	{
		label: "IP",
		href: "https://api.ipify.org?format=json"
	},
	{
		label: "whoer",
		href: "https://whoer.net"
	},
	{
		label: "ChatGPT",
		href: "https://chatgpt.com"
	},
	{
		label: "Google",
		href: "https://www.google.com/ncr"
	}
];
function FingerprintGrid({ profile }) {
	const fp = profile.fingerprint;
	const rows = [
		["Hệ điều hành", fp.os],
		["Engine", `${fp.engine} ${fp.browserVersion}`],
		["Nền tảng", fp.platform],
		["Màn hình", `${fp.screenWidth}×${fp.screenHeight} @${fp.pixelRatio}`],
		["CPU / RAM", `${fp.hardwareConcurrency} luồng · ${fp.deviceMemory} GB`],
		["Ngôn ngữ", fp.languages.join(", ")],
		["Múi giờ", fp.timezone],
		["WebGL", fp.webglRenderer],
		["WebRTC", fp.webrtcMode],
		["Fonts", `${fp.fonts.length} bộ`]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
		className: "grid gap-2 sm:grid-cols-2",
		children: [rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md bg-elevated p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-xs text-muted",
				children: k
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "mt-1 break-all text-sm",
				children: v
			})]
		}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md bg-elevated p-3 sm:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-xs text-muted",
				children: "User-Agent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "mt-1 font-mono text-xs leading-relaxed text-muted",
				children: fp.userAgent
			})]
		})]
	});
}
function fpPayload(profile) {
	const fp = profile.fingerprint;
	return {
		userAgent: fp.userAgent,
		language: fp.language,
		timezone: fp.timezone,
		screenWidth: fp.screenWidth,
		screenHeight: fp.screenHeight
	};
}
function BrowserSession({ profile }) {
	const updateProfile = useOrbitStore((s) => s.updateProfile);
	const assignProxy = useOrbitStore((s) => s.assignProxy);
	const pushHistory = useOrbitStore((s) => s.pushHistory);
	const settings = useOrbitStore((s) => s.settings);
	const [url, setUrl] = (0, import_react.useState)(profile.startUrl || "https://api.ipify.org?format=json");
	const [frame, setFrame] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const booted = (0, import_react.useRef)(false);
	const viewRef = (0, import_react.useRef)(null);
	const warnedDirect = (0, import_react.useRef)(false);
	const proxyLabel = (0, import_react.useMemo)(() => {
		if (!profile.proxy) return "Không proxy";
		return `${profile.proxy.type.toUpperCase()} ${hostPort(profile.proxy.ip, profile.proxy.port)}`;
	}, [profile.proxy]);
	const applyFrame = (res, href) => {
		setFrame(res);
		if (res.url) setUrl(res.url);
		if (res.rotatedProxy) assignProxy(profile.id, res.rotatedProxy);
		if (res.exitIp) updateProfile(profile.id, {
			exitIp: res.exitIp,
			proxyHealth: res.via === "proxy" ? "live" : profile.proxy ? "dead" : "none",
			lastCheckMs: res.ms
		});
		else if (profile.proxy && res.proxyError) updateProfile(profile.id, {
			proxyHealth: "dead",
			lastCheckMs: res.ms
		});
		const title = res.title || href || res.url;
		if (res.url) pushHistory(profile.id, res.url, title);
	};
	const go = async (next = url) => {
		let href = next.trim();
		if (!href) return;
		if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
		setUrl(href);
		setBusy(true);
		try {
			const res = await probeUrlFn({ data: {
				profileId: profile.id,
				url: href,
				fingerprint: fpPayload(profile),
				cookies: profile.cookies,
				proxy: profile.proxy
			} });
			applyFrame(res, href);
			if (!res.ok && res.error) toast.error(res.error);
			else if (res.via === "direct" && profile.proxy && !warnedDirect.current) {
				warnedDirect.current = true;
				toast.message("Node không tới được — cửa sổ Chromium đang tải trực tiếp");
			}
		} catch (err) {
			setFrame({
				ok: false,
				ms: 0,
				url: href,
				title: "",
				screenshot: null,
				html: null,
				snippet: null,
				via: "direct",
				engine: "fetch",
				exitIp: null,
				error: err instanceof Error ? err.message : "Lỗi tải trang"
			});
		} finally {
			setBusy(false);
		}
	};
	const checkIp = async () => {
		setBusy(true);
		try {
			const res = await browseCheckIpFn({ data: {
				profileId: profile.id,
				fingerprint: fpPayload(profile),
				cookies: profile.cookies,
				proxy: profile.proxy
			} });
			applyFrame(res);
			if (res.exitIp) toast.success(res.via === "proxy" ? `Exit IP ${res.exitIp} qua proxy · ${res.ms} ms` : `IP cửa sổ ${res.exitIp} (trực tiếp) · ${res.ms} ms`);
			else if (res.proxyError) toast.error(res.proxyError);
		} finally {
			setBusy(false);
		}
	};
	const rotateProxy = async () => {
		setBusy(true);
		try {
			const next = (await pickLiveProxiesFn({ data: {
				apiKey: settings.apiKey,
				type: profile.proxy?.type ?? settings.defaultProxyType,
				country: profile.proxy?.country,
				count: 1
			} })).live[0];
			if (!next) {
				toast.error("Không tìm thấy node sống từ cụm. Cửa sổ vẫn mở trực tiếp.");
				return;
			}
			const { probe, ...node } = next;
			assignProxy(profile.id, node);
			updateProfile(profile.id, {
				proxyHealth: "live",
				exitIp: probe.exitIp,
				lastCheckMs: probe.ms
			});
			toast.success(`Đã gán ${hostPort(next.ip, next.port)} · exit ${probe.exitIp ?? "OK"}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không đổi được node");
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (booted.current) return;
		booted.current = true;
		go(profile.startUrl || url);
	}, []);
	const onViewportClick = (e) => {
		if (busy || !frame?.screenshot) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const nx = (e.clientX - rect.left) / rect.width;
		const ny = (e.clientY - rect.top) / rect.height;
		setBusy(true);
		browseClickFn({ data: {
			profileId: profile.id,
			nx,
			ny
		} }).then((res) => applyFrame(res)).finally(() => setBusy(false));
	};
	const onWheel = (e) => {
		if (!frame?.screenshot) return;
		e.preventDefault();
		const dy = Math.max(-800, Math.min(800, e.deltaY));
		browseScrollFn({ data: {
			profileId: profile.id,
			dy
		} }).then((res) => applyFrame(res));
	};
	const onKeyDown = (e) => {
		if (!frame?.screenshot) return;
		const pass = [
			"Enter",
			"Backspace",
			"Tab",
			"Escape",
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Delete"
		];
		if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			browseTypeFn({ data: {
				profileId: profile.id,
				text: e.key
			} }).then((res) => applyFrame(res));
			return;
		}
		if (pass.includes(e.key)) {
			e.preventDefault();
			browseTypeFn({ data: {
				profileId: profile.id,
				key: e.key
			} }).then((res) => applyFrame(res));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Identicon, {
						seed: profile.fingerprint.canvasSeed,
						className: "size-7"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: profile.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-mono text-xs text-subtle",
							children: proxyLabel
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						profile.exitIp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "live",
							className: "font-mono",
							children: profile.exitIp
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: profile.proxyHealth === "dead" ? "danger" : "accent",
							children: profile.proxyHealth
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => void checkIp(),
							disabled: busy,
							children: "Check IP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => void rotateProxy(),
							disabled: busy,
							children: "Đổi node"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Về bảng"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void stopOrbitProfile(profile.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3 fill-current" }), "Dừng"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": "Back",
						disabled: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": "Forward",
						disabled: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": "Reload",
						onClick: () => void go(url),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", busy && "animate-spin") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex min-w-0 flex-1 items-center gap-2 rounded-full bg-bg px-3 shadow-[var(--shadow-border)]",
						onSubmit: (e) => {
							e.preventDefault();
							go();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: url,
							onChange: (e) => setUrl(e.target.value),
							className: "h-9 min-w-0 flex-1 bg-transparent text-sm outline-none",
							spellCheck: false,
							"aria-label": "Địa chỉ"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => void go(),
						disabled: busy,
						children: "Đi"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5 border-b border-border bg-surface px-3 py-2",
				children: QUICK_URLS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-7 rounded-full bg-elevated px-2.5 text-xs text-muted hover:text-fg",
					onClick: () => void go(q.href),
					children: q.label
				}, q.href))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "browser",
				className: "flex min-h-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "browser",
								children: "Cửa sổ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "vantay",
								children: "Vân tay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "cookie",
								children: "Cookie"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "notes",
								children: "Ghi chú"
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "browser",
						className: "flex min-h-0 flex-1 flex-col px-3 pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid min-h-0 flex-1 gap-3 lg:grid-cols-[1fr_280px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: viewRef,
								className: "relative min-h-0 overflow-auto rounded-lg border border-border bg-elevated outline-none",
								tabIndex: 0,
								onClick: onViewportClick,
								onWheel,
								onKeyDown,
								children: [frame?.screenshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: frame.screenshot,
									alt: frame.title || "Cửa sổ Chromium",
									className: "block w-full cursor-crosshair select-none",
									draggable: false
								}) : frame?.html ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									title: `Cửa sổ ${profile.name}`,
									srcDoc: frame.html,
									sandbox: "allow-scripts allow-forms allow-popups",
									className: "h-[min(62dvh,560px)] w-full bg-bg lg:h-full"
								}) : frame?.snippet && !frame.screenshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "h-[min(62dvh,560px)] overflow-auto p-4 font-mono text-xs leading-relaxed lg:h-full",
									children: frame.snippet
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-[min(62dvh,560px)] place-items-center p-6 text-center lg:h-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "Đang mở Chromium…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 max-w-sm text-sm text-muted",
										children: "Cửa sổ render thật, không nhúng iframe — ChatGPT và Google không còn bị chặn khung."
									})] })
								}), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 grid place-items-center bg-bg/45",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md bg-surface px-3 py-2 text-xs text-muted shadow-[var(--shadow-border)]",
										children: "Đang tải…"
									})
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: "rounded-lg border border-border bg-surface p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-muted",
										children: "Cửa sổ Chromium"
									}),
									frame ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: frame.ok ? "text-live" : "text-danger",
												children: [frame.ok ? "Đã render" : "Thất bại", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "ml-2 tabular-nums text-muted",
													children: [frame.ms, " ms"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted",
												children: [
													frame.engine === "chromium" ? "Chromium headless" : "Fetch HTML",
													" · ",
													frame.via === "proxy" ? "qua proxy" : "trực tiếp"
												]
											}),
											frame.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: frame.title
											}) : null,
											frame.exitIp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs",
												children: frame.exitIp
											}) : null,
											frame.proxyError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs leading-relaxed text-danger",
												children: [
													"Proxy: ",
													frame.proxyError,
													". Trang vẫn mở từ máy chủ."
												]
											}) : null,
											frame.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-danger",
												children: frame.error
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs leading-relaxed text-subtle",
												children: "Click, lăn chuột và gõ phím trên ảnh để điều khiển. Site chặn iframe (ChatGPT, Google) vẫn hiện."
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-subtle",
										children: "Nhập URL rồi Đi. Check IP đọc exit từ cùng phiên Chromium."
									}),
									profile.history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium text-muted",
											children: "Lịch sử phiên"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-1 space-y-1",
											children: profile.history.slice(0, 8).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "w-full truncate text-left text-xs text-fg hover:text-accent",
												onClick: () => void go(h.url),
												children: h.title
											}) }, `${h.at}-${h.url}`))
										})]
									}) : null
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "vantay",
						className: "px-3 pb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintGrid, { profile })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "cookie",
						className: "px-3 pb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieEditor, { profile })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "notes",
						className: "px-3 pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "notes",
							children: "Ghi chú hồ sơ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "notes",
							className: "mt-2",
							rows: 8,
							value: profile.notes,
							onChange: (e) => updateProfile(profile.id, { notes: e.target.value })
						})]
					})
				]
			})
		]
	});
}
function CookieEditor({ profile }) {
	const updateProfile = useOrbitStore((s) => s.updateProfile);
	const [name, setName] = (0, import_react.useState)("");
	const [value, setValue] = (0, import_react.useState)("");
	const [domain, setDomain] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "name",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "value",
					value,
					onChange: (e) => setValue(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "domain",
					value: domain,
					onChange: (e) => setDomain(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => {
						if (!name.trim()) return;
						updateProfile(profile.id, { cookies: [{
							id: `ck_${Date.now()}`,
							name: name.trim(),
							value,
							domain,
							path: "/"
						}, ...profile.cookies] });
						setName("");
						setValue("");
						setDomain("");
					},
					children: "Thêm"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-lg border border-border",
			children: profile.cookies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 py-8 text-center text-sm text-muted",
				children: "Chưa có cookie."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: profile.cookies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-2 border-b border-border px-3 py-2 last:border-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate font-mono text-xs",
						children: [
							c.name,
							"=",
							c.value
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: c.domain || "—"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => updateProfile(profile.id, { cookies: profile.cookies.filter((x) => x.id !== c.id) }),
					children: "Xóa"
				})]
			}, c.id)) })
		})]
	});
}
function RunProfile() {
	const { id } = Route.useParams();
	const profile = useOrbitStore((s) => s.profiles.find((p) => p.id === id) ?? null);
	const startProfile = useOrbitStore((s) => s.startProfile);
	const hydrated = useOrbitStore((s) => s.hydrated);
	(0, import_react.useEffect)(() => {
		if (profile && profile.status !== "running") startProfile(profile.id);
	}, [profile, startProfile]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 bg-surface" });
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid flex-1 place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-lg font-semibold",
			children: "Không tìm thấy hồ sơ"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Về bảng hồ sơ"
			})
		})] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserSession, { profile });
}
//#endregion
export { RunProfile as component };
