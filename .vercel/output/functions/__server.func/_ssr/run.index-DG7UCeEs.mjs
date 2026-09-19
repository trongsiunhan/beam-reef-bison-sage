import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as useOrbitStore, s as hostPort, t as Button } from "./button-DozfW7tv.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Identicon } from "./router-B--Rj75x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run.index-DG7UCeEs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RunIndex() {
	const profiles = useOrbitStore((s) => s.profiles);
	const running = (0, import_react.useMemo)(() => profiles.filter((p) => p.status === "running"), [profiles]);
	if (running.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid flex-1 place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Chưa có phiên nào chạy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Mở hồ sơ từ bảng điều khiển để làm việc đa cửa sổ."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Về hồ sơ"
				})
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col gap-4 p-4 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-accent uppercase",
				children: "Đa nhiệm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-semibold tracking-tight",
				children: "Phiên đang chạy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Mỗi ô là một môi trường độc lập — cookie và proxy không dùng chung."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: running.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/run/$id",
				params: { id: p.id },
				className: "rounded-xl border border-border bg-surface p-4 transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Identicon, { seed: p.fingerprint.canvasSeed }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-mono text-xs text-subtle",
							children: p.proxy ? hostPort(p.proxy.ip, p.proxy.port) : "Không proxy"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted",
					children: [
						p.fingerprint.os,
						" · ",
						p.fingerprint.engine,
						p.exitIp ? ` · ${p.exitIp}` : ""
					]
				})]
			}, p.id))
		})]
	});
}
//#endregion
export { RunIndex as component };
