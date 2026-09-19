import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./button-DozfW7tv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DmBDS5in.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums", {
	variants: { variant: {
		default: "bg-elevated text-muted",
		live: "bg-live/15 text-live",
		warn: "bg-warn/15 text-warn",
		danger: "bg-danger/15 text-danger",
		accent: "bg-accent/15 text-accent",
		outline: "border border-border text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
