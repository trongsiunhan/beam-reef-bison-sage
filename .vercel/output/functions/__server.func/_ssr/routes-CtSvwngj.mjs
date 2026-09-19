import { i as __toESM } from "../_runtime.mjs";
import { a as fetchProxyList, l as withoutProbe, o as filterAndRank, s as livePickData } from "./proxy-client-DNPLsrCj.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, a as Overlay2, c as Title2, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, i as Description2, l as Dialog$1, m as DialogPortal$1, n as Cancel, o as Portal2, p as DialogOverlay$1, r as Content2, s as Root2, t as Action, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as formatRelative, c as uid, l as useOrbitStore, n as buttonVariants, o as generateFingerprint, r as cn, s as hostPort, t as Button } from "./button-CF51ROdf.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Copy, d as Pencil, g as Ellipsis, h as Globe, i as Square, l as Plus, o as Search, r as Trash2, t as X, u as Play, y as Check } from "../_libs/lucide-react.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as Separator2, i as Root2$1, n as Item2, o as Trigger, r as Portal2$1, t as Content2$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DS65vWDG.mjs";
import { t as Badge } from "./badge-zmTSTDk0.mjs";
import { t as Skeleton } from "./skeleton-DDmnMcph.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Identicon, l as checkProxyFn, r as stopOrbitProfile, u as pickLiveProxiesFn } from "./router-f65h8p9n.mjs";
import { n as Label, t as Input } from "./label-CMZa8Kkt.mjs";
import { t as Switch } from "./switch-BCz34eij.mjs";
import { a as Textarea, i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./textarea-BfhRuG8F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CtSvwngj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-2xl max-h-[min(90dvh,760px)] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 rounded-sm p-1 text-muted hover:bg-elevated hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Đóng"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 flex flex-col gap-1 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function cookiesToText(profile) {
	if (!profile?.cookies.length) return "";
	return profile.cookies.map((c) => `${c.name}=${c.value}; Domain=${c.domain}`).join("\n");
}
function parseCookies(text) {
	return text.split(/\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
		const [nv, ...rest] = line.split(";");
		const [name, ...val] = (nv ?? "").split("=");
		const domainPart = rest.find((p) => p.trim().toLowerCase().startsWith("domain="));
		return {
			id: uid("ck"),
			name: (name ?? "cookie").trim(),
			value: val.join("=").trim(),
			domain: domainPart ? domainPart.split("=")[1]?.trim() ?? "" : "",
			path: "/"
		};
	});
}
function fromProfile(p, defaults) {
	const fp = p?.fingerprint ?? generateFingerprint();
	return {
		name: p?.name ?? "",
		groupId: p?.groupId ?? defaults?.groupId ?? "g_default",
		notes: p?.notes ?? "",
		startUrl: p?.startUrl ?? defaults?.startUrl ?? "https://api.ipify.org",
		fingerprint: fp,
		proxy: p?.proxy ?? null,
		cookiesText: cookiesToText(p)
	};
}
function ProfileFormDialog({ open, onOpenChange, profile }) {
	const groups = useOrbitStore((s) => s.groups);
	const settings = useOrbitStore((s) => s.settings);
	const createProfile = useOrbitStore((s) => s.createProfile);
	const updateProfile = useOrbitStore((s) => s.updateProfile);
	const [draft, setDraft] = (0, import_react.useState)(() => fromProfile(profile, {
		groupId: "g_default",
		startUrl: settings.defaultStartUrl
	}));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const setFp = (patch) => setDraft((d) => ({
		...d,
		fingerprint: {
			...d.fingerprint,
			...patch
		}
	}));
	const randomize = () => setDraft((d) => ({
		...d,
		fingerprint: generateFingerprint({
			country: d.proxy?.country,
			os: d.fingerprint.os,
			engine: d.fingerprint.engine
		})
	}));
	const grabProxy = async () => {
		setBusy(true);
		try {
			const live = (await pickLiveProxiesFn({ data: livePickData(settings, { count: 1 }) })).live[0];
			if (!live) {
				toast.error("Không dò được node sống. Nới bộ lọc trong Cài đặt.");
				return;
			}
			const proxy = withoutProbe(live);
			setDraft((d) => ({
				...d,
				proxy,
				fingerprint: generateFingerprint({
					country: proxy.country,
					os: d.fingerprint.os,
					engine: d.fingerprint.engine
				})
			}));
			toast.success(`Live ${proxy.ip}:${proxy.port} (${proxy.country}) · ${live.probe.ms} ms`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không lấy được proxy");
		} finally {
			setBusy(false);
		}
	};
	const save = async () => {
		const name = draft.name.trim() || "Hồ sơ mới";
		const cookies = parseCookies(draft.cookiesText);
		if (profile) {
			updateProfile(profile.id, {
				name,
				groupId: draft.groupId,
				notes: draft.notes,
				startUrl: draft.startUrl,
				fingerprint: draft.fingerprint,
				proxy: draft.proxy,
				proxyHealth: draft.proxy ? "assigned" : "none",
				cookies
			});
			toast.success("Đã lưu hồ sơ");
		} else {
			let proxy = draft.proxy;
			if (!proxy && settings.autoAssignProxy) {
				setBusy(true);
				try {
					const found = await pickLiveProxiesFn({ data: livePickData(settings, { count: 1 }) });
					if (found.live[0]) proxy = withoutProbe(found.live[0]);
					else toast.message("Tạo hồ sơ không proxy — chưa dò được node sống");
				} catch {
					toast.message("Tạo hồ sơ không proxy — NextProxy tạm không trả node");
				} finally {
					setBusy(false);
				}
			}
			createProfile({
				name,
				groupId: draft.groupId,
				notes: draft.notes,
				startUrl: draft.startUrl,
				fingerprint: draft.fingerprint,
				proxy: proxy ?? null,
				cookies,
				country: proxy?.country
			});
			toast.success("Đã tạo hồ sơ");
		}
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (v) setDraft(fromProfile(profile, {
				groupId: "g_default",
				startUrl: settings.defaultStartUrl
			}));
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: profile ? "Sửa hồ sơ" : "Tạo hồ sơ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Mỗi hồ sơ giữ cookie, vân tay máy và proxy riêng — giống một máy tính khác." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "chung",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full justify-start overflow-x-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "chung",
								children: "Chung"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "proxy",
								children: "Proxy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "vantay",
								children: "Vân tay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "cookie",
								children: "Cookie"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "chung",
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Tên hồ sơ"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: draft.name,
									placeholder: "Shopee-01, Ads-US…",
									onChange: (e) => setDraft((d) => ({
										...d,
										name: e.target.value
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nhóm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.groupId,
									onValueChange: (v) => setDraft((d) => ({
										...d,
										groupId: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: g.id,
										children: g.name
									}, g.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "start",
									children: "URL khởi động"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "start",
									value: draft.startUrl,
									onChange: (e) => setDraft((d) => ({
										...d,
										startUrl: e.target.value
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "notes",
									children: "Ghi chú"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "notes",
									rows: 3,
									value: draft.notes,
									placeholder: "Tài khoản, kịch bản, ghi nhớ…",
									onChange: (e) => setDraft((d) => ({
										...d,
										notes: e.target.value
									}))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "proxy",
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 rounded-md bg-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "NextProxy live"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Lấy node đã dò sống, xếp Good+ / thấp trễ trước."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: grabProxy,
									disabled: busy,
									children: busy ? "Đang lấy…" : "Lấy proxy"
								})]
							}),
							draft.proxy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-2 rounded-md border border-border p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Host"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "font-mono text-xs",
										children: [
											draft.proxy.ip,
											":",
											draft.proxy.port
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Loại"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "uppercase",
										children: draft.proxy.type
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Quốc gia"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
										draft.proxy.country,
										" · ",
										draft.proxy.countryName
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Độ trễ"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "tabular-nums",
										children: [draft.proxy.latency, " ms"]
									})] })
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Chưa gán proxy. Có thể mở hồ sơ không IP riêng."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "justify-start px-0",
								onClick: () => setDraft((d) => ({
									...d,
									proxy: null
								})),
								children: "Gỡ proxy"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "vantay",
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: randomize,
									children: "Random vân tay"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hệ điều hành" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: draft.fingerprint.os,
										onValueChange: (v) => setFp({ os: v }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Windows 11",
												children: "Windows 11"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Windows 10",
												children: "Windows 10"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "macOS Sonoma",
												children: "macOS Sonoma"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Linux",
												children: "Linux"
											})
										] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Engine" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: draft.fingerprint.engine,
										onValueChange: (v) => setFp({ engine: v }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Chrome",
												children: "Chrome"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Edge",
												children: "Edge"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Firefox",
												children: "Firefox"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "User-Agent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									className: "font-mono text-xs",
									value: draft.fingerprint.userAgent,
									onChange: (e) => setFp({ userAgent: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Màn hình" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: `${draft.fingerprint.screenWidth}×${draft.fingerprint.screenHeight}`,
											onChange: (e) => {
												const [w, h] = e.target.value.split(/[x×]/i).map((n) => Number(n.trim()));
												if (w && h) setFp({
													screenWidth: w,
													screenHeight: h
												});
											}
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Múi giờ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: draft.fingerprint.timezone,
											onChange: (e) => setFp({ timezone: e.target.value })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ngôn ngữ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: draft.fingerprint.language,
											onChange: (e) => setFp({ language: e.target.value })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "WebRTC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: draft.fingerprint.webrtcMode,
											onValueChange: (v) => setFp({ webrtcMode: v }),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "disabled",
													children: "Tắt"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "proxy",
													children: "Theo proxy"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "real",
													children: "Thật"
												})
											] })]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-md bg-elevated px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "dnt",
									children: "Do Not Track"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									id: "dnt",
									checked: draft.fingerprint.doNotTrack,
									onCheckedChange: (v) => setFp({ doNotTrack: v })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-subtle",
								children: [
									"Canvas ",
									draft.fingerprint.canvasSeed,
									" · Audio ",
									draft.fingerprint.audioSeed
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "cookie",
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cookies",
							children: "Mỗi dòng: name=value; Domain=example.com"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "cookies",
							rows: 8,
							className: "font-mono text-xs",
							value: draft.cookiesText,
							onChange: (e) => setDraft((d) => ({
								...d,
								cookiesText: e.target.value
							}))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Hủy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: busy,
				children: profile ? "Lưu" : "Tạo hồ sơ"
			})] })
		] })
	});
}
var AlertDialog = Root2;
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Portal2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, { className: "fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)]", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("text-lg font-semibold", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex justify-end gap-2", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants(), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		className: cn("relative size-4 shrink-0 rounded-xs border border-border-strong bg-bg data-[state=checked]:bg-primary data-[state=checked]:text-primary-fg after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
			className: "flex items-center justify-center text-current",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-3",
				strokeWidth: 3
			})
		})
	});
}
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		sideOffset,
		className: cn("z-50 min-w-40 overflow-hidden rounded-md border border-border bg-surface p-1 shadow-[var(--shadow-border)]", className),
		...props
	}) });
}
function DropdownMenuItem({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none data-[highlighted]:bg-elevated data-[disabled]:opacity-40", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("my-1 h-px bg-border", className),
		...props
	});
}
function HealthBadge({ profile }) {
	if (profile.proxyHealth === "live") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "live",
		children: "Live"
	});
	if (profile.proxyHealth === "dead") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "danger",
		children: "Chết"
	});
	if (profile.proxyHealth === "checking") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "warn",
		children: "Đang check"
	});
	if (profile.proxy) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "accent",
		children: "Đã gán"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Không proxy" });
}
function ProfileTable({ query, groupId }) {
	const navigate = useNavigate();
	const profiles = useOrbitStore((s) => s.profiles);
	const groups = useOrbitStore((s) => s.groups);
	const selectedIds = useOrbitStore((s) => s.selectedIds);
	const setSelected = useOrbitStore((s) => s.setSelected);
	const toggleSelected = useOrbitStore((s) => s.toggleSelected);
	const startProfile = useOrbitStore((s) => s.startProfile);
	const deleteProfiles = useOrbitStore((s) => s.deleteProfiles);
	const assignProxy = useOrbitStore((s) => s.assignProxy);
	const updateProfile = useOrbitStore((s) => s.updateProfile);
	const settings = useOrbitStore((s) => s.settings);
	const createProfile = useOrbitStore((s) => s.createProfile);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const groupName = (id) => groups.find((g) => g.id === id)?.name ?? "—";
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return profiles.filter((p) => {
			if (groupId !== "all" && p.groupId !== groupId) return false;
			if (!q) return true;
			return `${p.name} ${p.notes} ${p.proxy?.ip ?? ""} ${p.proxy?.country ?? ""} ${p.fingerprint.os}`.toLowerCase().includes(q);
		});
	}, [
		profiles,
		query,
		groupId
	]);
	const allChecked = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));
	const openProfile = (p) => {
		startProfile(p.id);
		navigate({
			to: "/run/$id",
			params: { id: p.id }
		});
	};
	const checkOne = async (p) => {
		if (!p.proxy) {
			toast.error("Hồ sơ chưa có proxy");
			return;
		}
		updateProfile(p.id, { proxyHealth: "checking" });
		try {
			const res = await checkProxyFn({ data: {
				ip: p.proxy.ip,
				port: p.proxy.port,
				type: p.proxy.type,
				timeoutMs: settings.probeTimeoutMs
			} });
			updateProfile(p.id, {
				proxyHealth: res.ok ? "live" : "dead",
				exitIp: res.exitIp,
				lastCheckMs: res.ms
			});
			toast[res.ok ? "success" : "error"](res.ok ? `Live ${res.exitIp ?? hostPort(p.proxy.ip, p.proxy.port)} · ${res.ms} ms` : res.error ?? "Proxy không phản hồi");
		} catch (err) {
			updateProfile(p.id, { proxyHealth: "dead" });
			toast.error(err instanceof Error ? err.message : "Lỗi kiểm tra");
		}
	};
	const assignRandom = async (ids) => {
		const toastId = toast.loading("Đang dò node sống NextProxy…");
		try {
			const found = await pickLiveProxiesFn({ data: livePickData(settings, { count: Math.min(10, Math.max(1, ids.length)) }) });
			let ok = 0;
			ids.forEach((id, i) => {
				const live = found.live[i];
				if (!live) return;
				assignProxy(id, withoutProbe(live));
				updateProfile(id, {
					proxyHealth: "live",
					exitIp: live.probe.exitIp,
					lastCheckMs: live.probe.ms
				});
				ok += 1;
			});
			toast.success(ok ? `Đã gán ${ok}/${ids.length} node sống` : "Không dò được node sống. Nới bộ lọc trong Cài đặt.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không gán được proxy");
		} finally {
			toast.dismiss(toastId);
		}
	};
	const duplicate = (p) => {
		createProfile({
			name: `${p.name} copy`,
			groupId: p.groupId,
			notes: p.notes,
			startUrl: p.startUrl,
			fingerprint: {
				...p.fingerprint,
				canvasSeed: `${p.fingerprint.canvasSeed}-c`
			},
			proxy: null
		});
		toast.success("Đã nhân bản hồ sơ");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		selectedIds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 rounded-md bg-elevated px-3 py-2 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-muted",
					children: [selectedIds.length, " đã chọn"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "live",
					onClick: () => {
						selectedIds.forEach((id) => {
							const p = profiles.find((x) => x.id === id);
							if (p) openProfile(p);
						});
					},
					children: "Mở"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => void assignRandom(selectedIds),
					children: "Gán proxy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => setPendingDelete(selectedIds),
					children: "Xóa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => setSelected([]),
					children: "Bỏ chọn"
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden overflow-hidden rounded-lg border border-border md:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-10 px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: allChecked,
								onCheckedChange: (v) => setSelected(v ? rows.map((r) => r.id) : []),
								"aria-label": "Chọn tất cả"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Hồ sơ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Nhóm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Proxy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Trạng thái"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Mở gần đây"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: cn("border-t border-border hover:bg-surface/80", selectedIds.includes(p.id) && "bg-surface"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: selectedIds.includes(p.id),
								onCheckedChange: () => toggleSelected(p.id),
								"aria-label": `Chọn ${p.name}`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Identicon, { seed: p.fingerprint.canvasSeed }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate text-xs text-subtle",
										children: [
											p.fingerprint.os,
											" · ",
											p.fingerprint.engine
										]
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-muted",
							children: groupName(p.groupId)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: p.proxy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-xs",
								children: [
									p.proxy.ip,
									":",
									p.proxy.port
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-subtle",
								children: [
									p.proxy.type.toUpperCase(),
									" · ",
									p.proxy.country,
									p.exitIp ? ` · ${p.exitIp}` : ""
								]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: p.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "live",
									children: "Đang chạy"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthBadge, { profile: p })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-xs text-muted",
							children: formatRelative(p.lastOpenedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [p.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => void stopOrbitProfile(p.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3 fill-current" }), "Dừng"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "live",
									onClick: () => openProfile(p),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3 fill-current" }), "Mở"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowMenu, {
									onEdit: () => setEditing(p),
									onCheck: () => void checkOne(p),
									onProxy: () => void assignRandom([p.id]),
									onDuplicate: () => duplicate(p),
									onDelete: () => setPendingDelete([p.id])
								})]
							})
						})
					]
				}, p.id)) })]
			}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-10 text-center text-sm text-muted",
				children: "Không có hồ sơ khớp bộ lọc."
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 md:hidden",
			children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: selectedIds.includes(p.id),
							onCheckedChange: () => toggleSelected(p.id),
							"aria-label": `Chọn ${p.name}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Identicon, { seed: p.fingerprint.canvasSeed }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate font-medium",
										children: p.name
									}), p.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "live",
										children: "Chạy"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthBadge, { profile: p })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: groupName(p.groupId)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xs text-subtle",
									children: p.proxy ? hostPort(p.proxy.ip, p.proxy.port) : "Không proxy"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [
						p.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							className: "flex-1",
							onClick: () => void stopOrbitProfile(p.id),
							children: "Dừng"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "live",
							className: "flex-1",
							onClick: () => openProfile(p),
							children: "Mở"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setEditing(p),
							children: "Sửa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							onClick: () => setPendingDelete([p.id]),
							"aria-label": "Xóa",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
				})]
			}, p.id))
		}),
		editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileFormDialog, {
			open: true,
			profile: editing,
			onOpenChange: (v) => {
				if (!v) setEditing(null);
			}
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!pendingDelete,
			onOpenChange: (v) => !v && setPendingDelete(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Xóa hồ sơ?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Cookie, ghi chú và vân tay của ",
				pendingDelete?.length ?? 0,
				" hồ sơ sẽ mất trên máy này."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Hủy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				className: "bg-danger text-primary-fg",
				onClick: () => {
					if (pendingDelete) {
						pendingDelete.forEach((id) => void stopOrbitProfile(id));
						deleteProfiles(pendingDelete);
					}
					setPendingDelete(null);
					toast.success("Đã xóa");
				},
				children: "Xóa"
			})] })] })
		})
	] });
}
function RowMenu({ onEdit, onCheck, onProxy, onDuplicate, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "icon-sm",
			variant: "ghost",
			"aria-label": "Thêm thao tác",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: onEdit,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), " Sửa"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: onCheck,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4" }), " Kiểm tra proxy"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: onProxy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4" }), " Gán proxy mới"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: onDuplicate,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Nhân bản"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: onDelete,
				className: "text-danger",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Xóa"]
			})
		]
	})] });
}
function stripProbe(node) {
	return withoutProbe(node);
}
function QuickCreateDialog({ open, onOpenChange }) {
	const groups = useOrbitStore((s) => s.groups);
	const settings = useOrbitStore((s) => s.settings);
	const createProfile = useOrbitStore((s) => s.createProfile);
	const [count, setCount] = (0, import_react.useState)(4);
	const [prefix, setPrefix] = (0, import_react.useState)("Orbit");
	const [groupId, setGroupId] = (0, import_react.useState)("g_default");
	const [type, setType] = (0, import_react.useState)(settings.defaultProxyType);
	const [country, setCountry] = (0, import_react.useState)(settings.preferredCountry || "ALL");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setType(settings.defaultProxyType);
		setCountry(settings.preferredCountry || "ALL");
	}, [
		open,
		settings.defaultProxyType,
		settings.preferredCountry
	]);
	const run = async () => {
		const n = Math.min(20, Math.max(1, count));
		setBusy(true);
		const toastId = toast.loading(`Đang tạo ${n} hồ sơ và dò node sống…`);
		try {
			const [livePack, list] = await Promise.all([pickLiveProxiesFn({ data: livePickData(settings, {
				type,
				country: country === "ALL" ? void 0 : country,
				count: Math.min(n, 8)
			}) }).catch(() => ({
				live: [],
				tried: 0
			})), fetchProxyList({
				apiKey: settings.apiKey,
				type,
				limit: n,
				country: country === "ALL" ? void 0 : country
			})]);
			const liveNodes = livePack.live.map(stripProbe);
			const rankedFallback = filterAndRank(list.proxies, {
				maxLatencyMs: settings.maxLatencyMs,
				minSpeed: settings.minSpeed
			}).filter((p) => !liveNodes.some((n) => n.ip === p.ip && n.port === p.port));
			const assigned = [...liveNodes];
			if (!settings.preferLiveOnly) for (const node of rankedFallback) {
				if (assigned.length >= n) break;
				assigned.push(node);
			}
			let liveUsed = 0;
			for (let i = 0; i < n; i++) {
				const proxy = assigned[i] ?? null;
				if (liveNodes[i]) liveUsed += 1;
				const idx = String(i + 1).padStart(2, "0");
				createProfile({
					name: `${prefix}-${idx}`,
					groupId,
					fingerprint: generateFingerprint({ country: proxy?.country }),
					proxy,
					startUrl: settings.defaultStartUrl,
					country: proxy?.country
				});
			}
			toast.success(liveUsed === n ? `Đã tạo ${n} hồ sơ · ${n} node sống` : liveUsed ? settings.preferLiveOnly ? `Đã tạo ${n} hồ sơ · ${liveUsed} node sống, còn lại để trống` : `Đã tạo ${n} hồ sơ · ${liveUsed} node sống, phần còn lại xếp từ cụm` : `Đã tạo ${n} hồ sơ. Chưa dò được node sống — cửa sổ mở trực tiếp.`);
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không tạo được bộ hồ sơ");
		} finally {
			toast.dismiss(toastId);
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tạo nhanh nhiều hồ sơ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Mỗi hồ sơ nhận vân tay riêng và một node NextProxy khác nhau." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "count",
									children: "Số lượng"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "count",
									type: "number",
									min: 1,
									max: 20,
									value: count,
									onChange: (e) => setCount(Number(e.target.value))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "prefix",
									children: "Tiền tố tên"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "prefix",
									value: prefix,
									onChange: (e) => setPrefix(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nhóm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: groupId,
								onValueChange: setGroupId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: g.id,
									children: g.name
								}, g.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Loại proxy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type,
									onValueChange: (v) => setType(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "https",
											children: "HTTPS — ổn định hơn"
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
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quốc gia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: country,
									onValueChange: setCountry,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ALL",
											children: "Mọi vùng"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "US",
											children: "United States"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "GB",
											children: "United Kingdom"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "DE",
											children: "Germany"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "NL",
											children: "Netherlands"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SG",
											children: "Singapore"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "JP",
											children: "Japan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "FR",
											children: "France"
										})
									] })]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Hủy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void run(),
					disabled: busy,
					children: busy ? "Đang tạo…" : "Tạo bộ hồ sơ"
				})] })
			]
		})
	});
}
function Home() {
	const hydrated = useOrbitStore((s) => s.hydrated);
	const profiles = useOrbitStore((s) => s.profiles);
	const groups = useOrbitStore((s) => s.groups);
	const [query, setQuery] = (0, import_react.useState)("");
	const [groupId, setGroupId] = (0, import_react.useState)("all");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [quickOpen, setQuickOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col gap-5 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-accent uppercase",
						children: "Bảng điều khiển"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight",
						children: "Hồ sơ trình duyệt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Nhiều cửa sổ, dữ liệu tách biệt. Gán proxy live từ NextProxy cho từng hồ sơ."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setQuickOpen(true),
						children: "Tạo nhanh"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setCreateOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Tạo hồ sơ"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Tìm tên, IP, quốc gia…",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: groupId,
					onValueChange: setGroupId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "sm:w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Tất cả nhóm"
					}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: g.id,
						children: g.name
					}, g.id))] })]
				})]
			}),
			!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14" })
				]
			}) : profiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				onCreate: () => setCreateOpen(true),
				onQuick: () => setQuickOpen(true)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileTable, {
				query,
				groupId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileFormDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickCreateDialog, {
				open: quickOpen,
				onOpenChange: setQuickOpen
			})
		]
	});
}
function EmptyState({ onCreate, onQuick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid flex-1 place-items-center rounded-xl border border-dashed border-border px-6 py-16 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Chưa có hồ sơ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Tạo một hồ sơ thủ công hoặc khởi tạo 4 hồ sơ và gán node NextProxy ngay."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onCreate,
						children: "Tạo hồ sơ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: onQuick,
						children: "Khởi tạo bộ mẫu"
					})]
				})
			]
		})
	});
}
//#endregion
export { Home as component };
