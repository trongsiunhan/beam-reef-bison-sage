import { ProxyAgent, Socks5ProxyAgent, fetch as ufetch } from "undici";
import type { ProbeResult, ProxyNode, ProxyType } from "./types";

const IP_CHECK_URLS = [
  "https://api.ipify.org?format=json",
  "https://api64.ipify.org?format=json",
];

export function describeProxyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/timeout|aborted|UND_ERR_CONNECT_TIMEOUT|Hết thời gian/i.test(msg)) return "Hết thời gian chờ";
  if (/407/.test(msg)) return "Proxy yêu cầu xác thực (407)";
  if (/403/.test(msg)) return "Proxy từ chối (403)";
  if (/ECONNREFUSED|refused/i.test(msg)) return "Từ chối kết nối";
  if (/ENOTFOUND|EAI_AGAIN/i.test(msg)) return "Không resolve được host";
  if (/SOCKS/i.test(msg) && /fail|error/i.test(msg)) return "Bắt tay SOCKS thất bại";
  return msg.replace(/^Error:\s*/i, "").slice(0, 160) || "Proxy không phản hồi";
}

function parseExitIp(text: string): string | null {
  const trimmed = text.trim();
  try {
    const json = JSON.parse(trimmed) as { ip?: string };
    if (json.ip) return json.ip;
  } catch {
    /* plain */
  }
  const m = trimmed.match(/(\d{1,3}\.){3}\d{1,3}|[0-9a-f:]{4,}/i);
  return m ? m[0] : trimmed.slice(0, 64) || null;
}

function isSocks(type: string) {
  return type.toLowerCase().startsWith("socks");
}

function makeAgent(ip: string, port: number, type: string) {
  if (isSocks(type)) {
    return new Socks5ProxyAgent(`socks5://${ip}:${port}`);
  }
  return new ProxyAgent({
    uri: `http://${ip}:${port}`,
    connect: { timeout: 2500 },
  });
}

export type TunneledResponse = {
  ok: boolean;
  status: number;
  ms: number;
  body: Buffer;
  contentType: string;
  finalUrl: string;
  error?: string;
};

export async function fetchViaProxy(opts: {
  ip: string;
  port: number;
  type: string;
  url: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}): Promise<TunneledResponse> {
  const start = Date.now();
  const agent = makeAgent(opts.ip, opts.port, opts.type);
  try {
    const res = await ufetch(opts.url, {
      dispatcher: agent,
      signal: AbortSignal.timeout(opts.timeoutMs ?? 8000),
      headers: {
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...opts.headers,
      },
    });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: res.status < 500,
      status: res.status,
      ms: Date.now() - start,
      body: buf,
      contentType: res.headers.get("content-type") ?? "",
      finalUrl: res.url || opts.url,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      ms: Date.now() - start,
      body: Buffer.alloc(0),
      contentType: "",
      finalUrl: opts.url,
      error: describeProxyError(err),
    };
  } finally {
    await agent.close().catch(() => undefined);
  }
}

export async function fetchDirect(opts: {
  url: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}): Promise<TunneledResponse> {
  const start = Date.now();
  try {
    const res = await fetch(opts.url, {
      signal: AbortSignal.timeout(opts.timeoutMs ?? 12000),
      headers: {
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...opts.headers,
      },
      redirect: "follow",
    });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: res.status < 500,
      status: res.status,
      ms: Date.now() - start,
      body: buf,
      contentType: res.headers.get("content-type") ?? "",
      finalUrl: res.url || opts.url,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      ms: Date.now() - start,
      body: Buffer.alloc(0),
      contentType: "",
      finalUrl: opts.url,
      error: describeProxyError(err),
    };
  }
}

export async function probeProxy(node: {
  ip: string;
  port: number;
  type: string;
}): Promise<ProbeResult> {
  const res = await fetchViaProxy({
    ip: node.ip,
    port: node.port,
    type: node.type,
    url: IP_CHECK_URLS[0],
    timeoutMs: 2500,
    headers: { Accept: "application/json" },
  });
  if (res.ok && res.body.length) {
    return {
      ok: true,
      ms: res.ms,
      exitIp: parseExitIp(res.body.subarray(0, 200).toString("utf8")),
      status: res.status,
      via: "proxy",
    };
  }
  return {
    ok: false,
    ms: res.ms,
    exitIp: null,
    error: res.error ?? "Hết thời gian chờ",
    via: "proxy",
  };
}

export async function pickLiveProxies(opts: {
  apiKey: string;
  type?: ProxyType | "all";
  country?: string;
  count: number;
  budgetMs?: number;
}): Promise<{ live: Array<ProxyNode & { probe: ProbeResult }>; tried: number }> {
  const { fetchProxyList } = await import("./proxy-client");
  const list = await fetchProxyList({
    apiKey: opts.apiKey,
    type: opts.type && opts.type !== "all" ? opts.type : undefined,
    country: opts.country && opts.country !== "ALL" ? opts.country : undefined,
    limit: 40,
  });
  const budget = opts.budgetMs ?? 7000;
  const deadline = Date.now() + budget;
  const live: Array<ProxyNode & { probe: ProbeResult }> = [];
  const queue = [...list.proxies];
  let tried = 0;
  const concurrency = 6;

  const work = async () => {
    while (live.length < opts.count && Date.now() < deadline) {
      const node = queue.shift();
      if (!node) return;
      tried += 1;
      const probe = await probeProxy(node);
      if (probe.ok) live.push({ ...node, probe });
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => work()));
  return { live: live.slice(0, opts.count), tried };
}

export function parseTitle(html: string) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1]?.trim().slice(0, 180) ?? "";
}

export function prepareHtml(html: string, url: string) {
  let out = html;
  out = out.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
  if (!/<base\s/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1><base href="${url.replace(/"/g, "")}">`);
  }
  return out;
}
