import type { Browser, BrowserContext, Page } from "playwright";
import { fetchDirect, fetchViaProxy, parseTitle, prepareHtml, probeProxy } from "./proxy-tunnel.server";
import type { BrowseFrame, CookieItem, Fingerprint, ProxyNode } from "./types";

type FpLite = Pick<Fingerprint, "userAgent" | "language" | "timezone" | "screenWidth" | "screenHeight">;

type Session = {
  profileId: string;
  proxyKey: string;
  ua: string;
  context: BrowserContext;
  page: Page;
  viewport: { width: number; height: number };
  via: "proxy" | "direct";
  lastUsed: number;
  chain: Promise<unknown>;
};

const sessions = new Map<string, Session>();
let browserPromise: Promise<Browser> | null = null;
const MAX_SESSIONS = 3;
const VIEW_W = 1280;
const VIEW_H = 800;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loadChromium() {
  const mod = await import("playwright");
  return mod.chromium;
}

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = loadChromium().then((chromium) =>
      chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-blink-features=AutomationControlled",
        ],
      }),
    );
  }
  try {
    const browser = await browserPromise;
    if (!browser.isConnected()) throw new Error("disconnected");
    return browser;
  } catch {
    browserPromise = null;
    const chromium = await loadChromium();
    browserPromise = chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
    return browserPromise;
  }
}

function proxyKeyOf(proxy: ProxyNode | null, via: "proxy" | "direct") {
  if (!proxy || via === "direct") return "direct";
  return `${proxy.type}:${proxy.ip}:${proxy.port}`;
}

function playwrightProxy(proxy: ProxyNode) {
  const scheme = proxy.type.startsWith("socks") ? "socks5" : "http";
  return { server: `${scheme}://${proxy.ip}:${proxy.port}` };
}

async function evictOldest() {
  if (sessions.size < MAX_SESSIONS) return;
  let oldest: Session | null = null;
  for (const s of sessions.values()) {
    if (!oldest || s.lastUsed < oldest.lastUsed) oldest = s;
  }
  if (oldest) await closeSession(oldest.profileId);
}

async function screenshotOf(page: Page) {
  const buf = await page.screenshot({ type: "jpeg", quality: 58, timeout: 8000 });
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function cookieDomain(raw: string, fallbackHost: string) {
  const d = raw.trim();
  if (!d) return fallbackHost;
  return d.replace(/^\./, "");
}

export async function closeSession(profileId: string) {
  const s = sessions.get(profileId);
  if (!s) return;
  sessions.delete(profileId);
  await s.context.close().catch(() => undefined);
}

export async function closeAllSessions() {
  const ids = [...sessions.keys()];
  await Promise.all(ids.map((id) => closeSession(id)));
}

async function ensureSession(opts: {
  profileId: string;
  proxy: ProxyNode | null;
  fingerprint: FpLite;
  cookies?: CookieItem[];
}): Promise<{ session: Session; proxyError?: string }> {
  const existing = sessions.get(opts.profileId);
  const [browser, viaProbe] = await Promise.all([
    getBrowser(),
    opts.proxy ? probeProxy(opts.proxy) : Promise.resolve(null),
  ]);
  const via: "proxy" | "direct" = viaProbe?.ok ? "proxy" : "direct";
  const proxyError =
    opts.proxy && !viaProbe?.ok ? viaProbe?.error ?? "Node không tới được từ máy chủ" : undefined;
  const key = proxyKeyOf(opts.proxy, via);
  if (existing && existing.proxyKey === key && existing.ua === opts.fingerprint.userAgent) {
    existing.lastUsed = Date.now();
    return { session: existing, proxyError };
  }
  if (existing) await closeSession(opts.profileId);

  await evictOldest();
  const viewport = { width: VIEW_W, height: VIEW_H };
  const context = await browser.newContext({
    viewport,
    userAgent: opts.fingerprint.userAgent,
    locale: opts.fingerprint.language || "en-US",
    timezoneId: opts.fingerprint.timezone || "UTC",
    deviceScaleFactor: 1,
    colorScheme: "light",
    proxy: via === "proxy" && opts.proxy ? playwrightProxy(opts.proxy) : undefined,
    ignoreHTTPSErrors: true,
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  if (opts.cookies?.length) {
    const host = "chatgpt.com";
    await context
      .addCookies(
        opts.cookies
          .filter((c) => c.name)
          .map((c) => ({
            name: c.name,
            value: c.value,
            domain: cookieDomain(c.domain, host),
            path: c.path || "/",
          })),
      )
      .catch(() => undefined);
  }
  const session: Session = {
    profileId: opts.profileId,
    proxyKey: key,
    ua: opts.fingerprint.userAgent,
    context,
    page,
    viewport,
    via,
    lastUsed: Date.now(),
    chain: Promise.resolve(),
  };
  sessions.set(opts.profileId, session);
  return { session, proxyError };
}

function run<T>(session: Session, fn: () => Promise<T>): Promise<T> {
  const next = session.chain.then(fn, fn);
  session.chain = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function frameFromPage(
  session: Session,
  extra: { ms: number; proxyError?: string; exitIp?: string | null },
): Promise<BrowseFrame> {
  const page = session.page;
  const url = page.url();
  const title = await page.title().catch(() => "");
  let screenshot: string | null = null;
  try {
    screenshot = await screenshotOf(page);
  } catch {
    screenshot = null;
  }
  session.lastUsed = Date.now();
  return {
    ok: true,
    ms: extra.ms,
    url,
    title,
    screenshot,
    html: null,
    snippet: title,
    via: session.via,
    engine: "chromium",
    exitIp: extra.exitIp ?? null,
    proxyError: extra.proxyError,
    viewport: session.viewport,
  };
}

async function fetchFallback(opts: {
  url: string;
  proxy: ProxyNode | null;
  fingerprint: FpLite;
  proxyError?: string;
}): Promise<BrowseFrame> {
  const start = Date.now();
  let res = opts.proxy
    ? await fetchViaProxy({
        ip: opts.proxy.ip,
        port: opts.proxy.port,
        type: opts.proxy.type,
        url: opts.url,
        timeoutMs: 10000,
        headers: { "User-Agent": opts.fingerprint.userAgent },
      })
    : null;
  let via: "proxy" | "direct" = "proxy";
  if (!res?.ok) {
    via = "direct";
    res = await fetchDirect({
      url: opts.url,
      timeoutMs: 12000,
      headers: { "User-Agent": opts.fingerprint.userAgent },
    });
  }
  const raw = res.body.subarray(0, 400_000).toString("utf8");
  const isHtml = /html/i.test(res.contentType) || /<html/i.test(raw);
  const title = isHtml ? parseTitle(raw) : "";
  const snippet = raw.replace(/\s+/g, " ").trim().slice(0, 400);
  return {
    ok: res.ok,
    ms: Date.now() - start,
    url: res.finalUrl,
    title,
    screenshot: null,
    html: isHtml ? prepareHtml(raw, res.finalUrl) : null,
    snippet: isHtml ? snippet : raw.slice(0, 800),
    via,
    engine: "fetch",
    exitIp: null,
    error: res.ok ? undefined : res.error,
    proxyError: opts.proxyError ?? (via === "direct" && opts.proxy ? res.error : undefined),
  };
}

function extractIpFromBody(text: string): string | null {
  try {
    const json = JSON.parse(text) as { ip?: string };
    if (json.ip) return json.ip;
  } catch {
    /* ignore */
  }
  const m = text.match(/(\d{1,3}\.){3}\d{1,3}/);
  return m ? m[0] : null;
}

export async function browseNavigate(opts: {
  profileId: string;
  url: string;
  proxy: ProxyNode | null;
  fingerprint: FpLite;
  cookies?: CookieItem[];
}): Promise<BrowseFrame> {
  const start = Date.now();
  try {
    const { session, proxyError } = await ensureSession(opts);
    return await run(session, async () => {
      await session.page.goto(opts.url, { waitUntil: "domcontentloaded", timeout: 22000 });
      await sleep(1200);
      try {
        await session.page.waitForLoadState("networkidle", { timeout: 2500 });
      } catch {
        /* SPA / long poll */
      }
      return frameFromPage(session, { ms: Date.now() - start, proxyError });
    });
  } catch (err) {
    const proxyError = err instanceof Error ? err.message : "Chromium không mở được";
    try {
      return await fetchFallback({
        url: opts.url,
        proxy: opts.proxy,
        fingerprint: opts.fingerprint,
        proxyError,
      });
    } catch (fallbackErr) {
      return {
        ok: false,
        ms: Date.now() - start,
        url: opts.url,
        title: "",
        screenshot: null,
        html: null,
        snippet: null,
        via: "direct",
        engine: "fetch",
        exitIp: null,
        error: fallbackErr instanceof Error ? fallbackErr.message : "Không tải được trang",
        proxyError,
      };
    }
  }
}

export async function browseClick(opts: {
  profileId: string;
  nx: number;
  ny: number;
}): Promise<BrowseFrame> {
  const start = Date.now();
  const session = sessions.get(opts.profileId);
  if (!session) {
    return {
      ok: false,
      ms: 0,
      url: "",
      title: "",
      screenshot: null,
      html: null,
      snippet: null,
      via: "direct",
      engine: "chromium",
      exitIp: null,
      error: "Phiên Chromium chưa mở — nhập URL rồi Đi",
    };
  }
  return run(session, async () => {
    const x = Math.round(Math.min(1, Math.max(0, opts.nx)) * session.viewport.width);
    const y = Math.round(Math.min(1, Math.max(0, opts.ny)) * session.viewport.height);
    await session.page.mouse.click(x, y);
    await sleep(450);
    try {
      await session.page.waitForLoadState("domcontentloaded", { timeout: 4000 });
    } catch {
      /* stay */
    }
    return frameFromPage(session, { ms: Date.now() - start });
  });
}

export async function browseType(opts: {
  profileId: string;
  text?: string;
  key?: string;
}): Promise<BrowseFrame> {
  const start = Date.now();
  const session = sessions.get(opts.profileId);
  if (!session) {
    return {
      ok: false,
      ms: 0,
      url: "",
      title: "",
      screenshot: null,
      html: null,
      snippet: null,
      via: "direct",
      engine: "chromium",
      exitIp: null,
      error: "Phiên Chromium chưa mở",
    };
  }
  return run(session, async () => {
    if (opts.key) {
      await session.page.keyboard.press(opts.key);
    } else if (opts.text) {
      await session.page.keyboard.type(opts.text, { delay: 12 });
    }
    await sleep(200);
    return frameFromPage(session, { ms: Date.now() - start });
  });
}

export async function browseScroll(opts: { profileId: string; dy: number }): Promise<BrowseFrame> {
  const start = Date.now();
  const session = sessions.get(opts.profileId);
  if (!session) {
    return {
      ok: false,
      ms: 0,
      url: "",
      title: "",
      screenshot: null,
      html: null,
      snippet: null,
      via: "direct",
      engine: "chromium",
      exitIp: null,
      error: "Phiên Chromium chưa mở",
    };
  }
  return run(session, async () => {
    await session.page.mouse.wheel(0, opts.dy);
    await sleep(180);
    return frameFromPage(session, { ms: Date.now() - start });
  });
}

export async function browseCheckIp(opts: {
  profileId: string;
  proxy: ProxyNode | null;
  fingerprint: FpLite;
  cookies?: CookieItem[];
}): Promise<BrowseFrame> {
  const start = Date.now();
  let exitIp: string | null = null;
  if (opts.proxy) {
    const probe = await probeProxy(opts.proxy);
    if (probe.ok) exitIp = probe.exitIp;
  }
  const frame = await browseNavigate({
    ...opts,
    url: "https://api.ipify.org?format=json",
  });
  if (!exitIp && frame.snippet) exitIp = extractIpFromBody(frame.snippet);
  if (!exitIp) {
    try {
      const session = sessions.get(opts.profileId);
      const text = (await session?.page.textContent("body")) ?? "";
      exitIp = extractIpFromBody(text);
    } catch {
      /* ignore */
    }
  }
  return { ...frame, exitIp, ms: Date.now() - start };
}

setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.lastUsed > 5 * 60_000) void closeSession(id);
  }
}, 60_000).unref?.();
