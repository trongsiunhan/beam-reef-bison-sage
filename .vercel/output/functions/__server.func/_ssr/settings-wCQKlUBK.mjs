import { t as DEFAULT_API_KEY } from "./proxy-client-CLfqVGVh.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as useOrbitStore, t as Button } from "./button-DozfW7tv.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B5MD37xf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-Ca_GbLpp.mjs";
import { t as Switch } from "./switch-B1ITnadI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-wCQKlUBK.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useOrbitStore((s) => s.settings);
	const setSettings = useOrbitStore((s) => s.setSettings);
	const createGroup = useOrbitStore((s) => s.createGroup);
	const groups = useOrbitStore((s) => s.groups);
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Loại proxy mặc định" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: settings.defaultProxyType,
							onValueChange: (v) => setSettings({ defaultProxyType: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
						})]
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
							children: "Lấy một node ngẫu nhiên từ NextProxy."
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
