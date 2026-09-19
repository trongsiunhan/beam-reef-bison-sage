import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BrowseFrame, CookieItem, ProbeResult, ProxyNode, ProxyType } from "./types";

const ProxyInput = z.object({
  ip: z.string().min(1),
  port: z.number().int().positive(),
  type: z.string(),
});

const FpInput = z.object({
  userAgent: z.string(),
  language: z.string(),
  timezone: z.string(),
  screenWidth: z.number(),
  screenHeight: z.number(),
});

const CookieInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  value: z.string(),
  domain: z.string(),
  path: z.string(),
});

const SessionInput = z.object({
  profileId: z.string().min(1),
  url: z.string().optional(),
  fingerprint: FpInput,
  cookies: z.array(CookieInput).optional(),
  proxy: z
    .object({
      ip: z.string(),
      port: z.number(),
      type: z.string(),
      protocol: z.string().optional(),
      country: z.string().optional(),
      countryName: z.string().optional(),
      latency: z.number().optional(),
      speedTier: z.string().optional(),
      uptime: z.string().optional(),
      anonymity: z.string().optional(),
      status: z.string().optional(),
    })
    .nullable(),
});

function asProxy(raw: z.infer<typeof SessionInput>["proxy"]): ProxyNode | null {
  if (!raw) return null;
  const t = raw.type.toLowerCase();
  const type: ProxyType = t === "socks4" || t === "socks5" || t === "https" ? t : "https";
  return {
    ip: raw.ip,
    port: raw.port,
    type,
    protocol: raw.protocol ?? raw.type,
    country: raw.country ?? "",
    countryName: raw.countryName ?? "",
    latency: raw.latency ?? 0,
    speedTier: raw.speedTier ?? "",
    uptime: raw.uptime ?? "",
    anonymity: raw.anonymity ?? "",
    status: raw.status ?? "active",
  };
}

function asCookies(raw: z.infer<typeof SessionInput>["cookies"]): CookieItem[] | undefined {
  if (!raw) return undefined;
  return raw.map((c) => ({
    id: c.id ?? "",
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path,
  }));
}

export const checkProxyFn = createServerFn({ method: "POST" })
  .validator(ProxyInput)
  .handler(async ({ data }): Promise<ProbeResult> => {
    const { probeProxy } = await import("./proxy-tunnel.server");
    return probeProxy({ ip: data.ip, port: data.port, type: data.type });
  });

export const probeUrlFn = createServerFn({ method: "POST" })
  .validator(SessionInput.extend({ url: z.string().min(1) }))
  .handler(async ({ data }): Promise<BrowseFrame> => {
    const { browseNavigate } = await import("./browser-engine.server");
    let href = data.url!.trim();
    if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
    return browseNavigate({
      profileId: data.profileId,
      url: href,
      proxy: asProxy(data.proxy),
      fingerprint: data.fingerprint,
      cookies: asCookies(data.cookies),
    });
  });

export const browseClickFn = createServerFn({ method: "POST" })
  .validator(z.object({ profileId: z.string(), nx: z.number(), ny: z.number() }))
  .handler(async ({ data }): Promise<BrowseFrame> => {
    const { browseClick } = await import("./browser-engine.server");
    return browseClick(data);
  });

export const browseTypeFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string(),
      text: z.string().optional(),
      key: z.string().optional(),
    }),
  )
  .handler(async ({ data }): Promise<BrowseFrame> => {
    const { browseType } = await import("./browser-engine.server");
    return browseType(data);
  });

export const browseScrollFn = createServerFn({ method: "POST" })
  .validator(z.object({ profileId: z.string(), dy: z.number() }))
  .handler(async ({ data }): Promise<BrowseFrame> => {
    const { browseScroll } = await import("./browser-engine.server");
    return browseScroll(data);
  });

export const browseCheckIpFn = createServerFn({ method: "POST" })
  .validator(SessionInput)
  .handler(async ({ data }): Promise<BrowseFrame> => {
    const { browseCheckIp } = await import("./browser-engine.server");
    return browseCheckIp({
      profileId: data.profileId,
      proxy: asProxy(data.proxy),
      fingerprint: data.fingerprint,
      cookies: asCookies(data.cookies),
    });
  });

export const closeSessionFn = createServerFn({ method: "POST" })
  .validator(z.object({ profileId: z.string() }))
  .handler(async ({ data }) => {
    const { closeSession } = await import("./browser-engine.server");
    await closeSession(data.profileId);
    return { ok: true as const };
  });

export const pickLiveProxiesFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      apiKey: z.string().min(1),
      type: z.enum(["https", "socks4", "socks5", "all"]).optional(),
      country: z.string().optional(),
      count: z.number().int().min(1).max(10),
    }),
  )
  .handler(async ({ data }) => {
    const { pickLiveProxies } = await import("./proxy-tunnel.server");
    return pickLiveProxies({
      apiKey: data.apiKey,
      type: data.type,
      country: data.country,
      count: data.count,
      budgetMs: 7000,
    });
  });
