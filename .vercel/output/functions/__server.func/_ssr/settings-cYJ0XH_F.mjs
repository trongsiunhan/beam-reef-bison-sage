import { n as PROXY_PRESET, t as DEFAULT_API_KEY } from "./proxy-client-DNPLsrCj.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as useOrbitStore, t as Button } from "./button-CF51ROdf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DS65vWDG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-CMZa8Kkt.mjs";
import { t as Switch } from "./switch-BCz34eij.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-cYJ0XH_F.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useOrbitStore((s) => s.settings);
	const setSettings = useOrbitStore((s) => s.setSettings);
	const applyProxyPreset = useOrbitStore((s) => s.applyProxyPreset);
	const createGroup = useOrbitStore((s) => s.createGroup);
	const groups = useOrbitStore((s) => s.groups);
	const policy = [
		settings.defaultProxyType.toUpperCase(),
		settings.minSpeed === "fast" ? "Fast+" : settings.minSpeed === "good" ? "Good+" : "mọi tốc độ",
		settings.maxLatencyMs > 0 ? `≤${settings.maxLatencyMs} ms` : "không lọc trễ",
		settings.httpsFallback ? "fallback HTTPS" : null,
		settings.autoRotateDead ? "tự xoay" : null
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-accent uppercase",
					children: "Kỹ thuật"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-semibold tracking-tight",
					children: "Cài đặt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "API key NextProxy lưu trên trình duyệt này, không gửi đi nơi khác."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "key",
							children: "API key NextProxy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "key",
							className: "font-mono text-xs",
							value: settings.apiKey,
							onChange: (e) => setSettings({ apiKey: e.target.value.trim() })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "w-fit",
						onClick: () => {
							setSettings({ apiKey: DEFAULT_API_KEY });
							toast.success("Đã khôi phục key Developer Pro");
						},
						children: "Dùng key hiện tại"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "start",
							children: "URL khởi động mặc định"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "start",
							value: settings.defaultStartUrl,
							onChange: (e) => setSettings({ defaultStartUrl: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Tự gán proxy khi tạo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Lấy node theo bộ lọc tối ưu, không lấy ngẫu nhiên."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.autoAssignProxy,
							onCheckedChange: (v) => setSettings({ autoAssignProxy: v })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Đồng bộ múi giờ theo proxy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Gán IP xong sẽ khớp ngôn ngữ và timezone với quốc gia node."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.syncGeoToProxy,
							onCheckedChange: (v) => setSettings({ syncGeoToProxy: v })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Tối ưu cụm proxy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: policy
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => {
								applyProxyPreset();
								toast.success("Đã áp dụng HTTPS · Good+ · ≤300 ms · tự xoay");
							},
							children: "Áp dụng tối ưu"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Loại ưu tiên" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: settings.defaultProxyType,
									onValueChange: (v) => setSettings({ defaultProxyType: v }),
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tốc độ tối thiểu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: settings.minSpeed,
									onValueChange: (v) => setSettings({ minSpeed: v }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "any",
											children: "Mọi mức"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "good",
											children: "Good trở lên"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "fast",
											children: "Chỉ Fast"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Độ trễ tối đa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: String(settings.maxLatencyMs),
									onValueChange: (v) => setSettings({ maxLatencyMs: Number(v) }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "150",
											children: "150 ms"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "250",
											children: "250 ms"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "300",
											children: "300 ms"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "450",
											children: "450 ms"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "0",
											children: "Không lọc"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Thời gian dò mỗi node" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: String(settings.probeTimeoutMs),
									onValueChange: (v) => setSettings({ probeTimeoutMs: Number(v) }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "1500",
											children: "1.5 giây — nhanh"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "2200",
											children: "2.2 giây — cân bằng"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "3500",
											children: "3.5 giây — khoan dung"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quốc gia ưu tiên" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: settings.preferredCountry,
									onValueChange: (v) => setSettings({ preferredCountry: v }),
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
											value: "DE",
											children: "Germany"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "GB",
											children: "United Kingdom"
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
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Chỉ gán node đã dò sống"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Bỏ qua node random chưa check. Nếu không có node sống thì để trống."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.preferLiveOnly,
							onCheckedChange: (v) => setSettings({ preferLiveOnly: v })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Tự đổi node khi chết"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Mở phiên mà node không tới được thì dò node sống khác và đi tiếp."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.autoRotateDead,
							onCheckedChange: (v) => setSettings({ autoRotateDead: v })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Fallback HTTPS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"SOCKS hay chết. Bật để tự lấy HTTPS khi không dò được SOCKS. Đề xuất: ",
								PROXY_PRESET.defaultProxyType.toUpperCase(),
								"."
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.httpsFallback,
							onCheckedChange: (v) => setSettings({ httpsFallback: v })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Nhóm hồ sơ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "text-sm text-muted",
						children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-b border-border py-2 last:border-0",
							children: g.name
						}, g.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							const name = String(fd.get("g") ?? "").trim();
							if (!name) return;
							createGroup(name);
							e.currentTarget.reset();
							toast.success("Đã thêm nhóm");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "g",
							placeholder: "Tên nhóm mới"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							children: "Thêm"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
