import { localeForCountry } from "./geo";
import type { EngineName, Fingerprint, OsName } from "./types";
import { uid } from "./utils";

const WINDOWS_SCREENS = [
  [1920, 1080],
  [1366, 768],
  [1536, 864],
  [2560, 1440],
  [1280, 720],
  [1440, 900],
] as const;

const MAC_SCREENS = [
  [1440, 900],
  [1512, 982],
  [1680, 1050],
  [1920, 1080],
  [2560, 1600],
] as const;

const WIN_FONTS = [
  "Arial",
  "Calibri",
  "Cambria",
  "Consolas",
  "Courier New",
  "Georgia",
  "Segoe UI",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

const MAC_FONTS = [
  "Arial",
  "Geneva",
  "Helvetica",
  "Helvetica Neue",
  "Menlo",
  "Monaco",
  "San Francisco",
  "Times",
  "Verdana",
];

const LINUX_FONTS = [
  "DejaVu Sans",
  "Liberation Sans",
  "Noto Sans",
  "Ubuntu",
  "FreeSans",
  "Courier 10 Pitch",
];

const NVIDIA = [
  "ANGLE (NVIDIA GeForce GTX 1660 Super Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)",
];

const INTEL = [
  "ANGLE (Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)",
];

const APPLE_GPU = ["Apple M1", "Apple M2", "Apple M3", "Apple M4"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chromeVersion() {
  const major = pick([139, 140, 141, 142]);
  const build = randInt(7200, 7550);
  const patch = randInt(40, 180);
  return { major, full: `${major}.0.${build}.${patch}` };
}

function seed() {
  return uid("fp").replace("fp_", "");
}

export function generateFingerprint(opts?: {
  country?: string;
  os?: OsName;
  engine?: EngineName;
}): Fingerprint {
  const os = opts?.os ?? pick(["Windows 11", "Windows 11", "Windows 10", "macOS Sonoma", "Linux"]);
  const engine = opts?.engine ?? (os.startsWith("Windows") ? pick(["Chrome", "Chrome", "Edge"]) : "Chrome");
  const locale = localeForCountry(opts?.country);
  const ver = chromeVersion();

  let platform = "Win32";
  let screen: readonly [number, number] = pick(WINDOWS_SCREENS);
  let fonts = WIN_FONTS;
  let webglVendor = "Google Inc. (NVIDIA)";
  let webglRenderer = pick(NVIDIA);
  let hardwareConcurrency = pick([4, 8, 8, 12, 16]);
  let deviceMemory = pick([4, 8, 8, 16]);
  let pixelRatio = pick([1, 1, 1.25, 1.5]);
  let maxTouchPoints = 0;

  if (os === "Windows 10" || os === "Windows 11") {
    platform = "Win32";
    if (Math.random() < 0.4) {
      webglVendor = "Google Inc. (Intel)";
      webglRenderer = pick(INTEL);
    }
  } else if (os.startsWith("macOS")) {
    platform = "MacIntel";
    screen = pick(MAC_SCREENS);
    fonts = MAC_FONTS;
    webglVendor = "Google Inc. (Apple)";
    webglRenderer = `ANGLE (${pick(APPLE_GPU)} Metal Renderer)`;
    hardwareConcurrency = pick([8, 8, 10, 12]);
    deviceMemory = pick([8, 16, 16]);
    pixelRatio = pick([2, 2, 2]);
  } else {
    platform = "Linux x86_64";
    fonts = LINUX_FONTS;
    webglVendor = "Google Inc. (NVIDIA)";
    webglRenderer = pick(NVIDIA);
  }

  let userAgent = "";
  if (engine === "Firefox") {
    const fx = pick([131, 132, 133]);
    if (os.startsWith("macOS")) {
      userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 14.6; rv:${fx}.0) Gecko/20100101 Firefox/${fx}.0`;
    } else if (os === "Linux") {
      userAgent = `Mozilla/5.0 (X11; Linux x86_64; rv:${fx}.0) Gecko/20100101 Firefox/${fx}.0`;
    } else {
      userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${fx}.0) Gecko/20100101 Firefox/${fx}.0`;
    }
  } else {
    const gecko = `Mozilla/5.0`;
    const apple = `AppleWebKit/537.36 (KHTML, like Gecko)`;
    const chrome = `${engine === "Edge" ? "Chrome" : "Chrome"}/${ver.full} Safari/537.36`;
    const edge = engine === "Edge" ? ` Edg/${ver.full}` : "";
    if (os.startsWith("macOS")) {
      userAgent = `${gecko} (Macintosh; Intel Mac OS X 10_15_7) ${apple} ${chrome}${edge}`;
    } else if (os === "Linux") {
      userAgent = `${gecko} (X11; Linux x86_64) ${apple} ${chrome}${edge}`;
    } else {
      userAgent = `${gecko} (Windows NT 10.0; Win64; x64) ${apple} ${chrome}${edge}`;
    }
  }

  return {
    os,
    engine,
    browserVersion: engine === "Firefox" ? userAgent.match(/Firefox\/(\d+)/)?.[1] ?? "132" : ver.full,
    userAgent,
    platform,
    language: locale.language,
    languages: locale.languages,
    timezone: locale.timezone,
    screenWidth: screen[0],
    screenHeight: screen[1],
    colorDepth: 24,
    pixelRatio,
    hardwareConcurrency,
    deviceMemory,
    webglVendor,
    webglRenderer,
    canvasSeed: seed(),
    audioSeed: seed(),
    webrtcMode: "proxy",
    doNotTrack: false,
    maxTouchPoints,
    fonts,
  };
}

export function applyGeoToFingerprint(fp: Fingerprint, country?: string): Fingerprint {
  const locale = localeForCountry(country);
  return {
    ...fp,
    language: locale.language,
    languages: locale.languages,
    timezone: locale.timezone,
  };
}

export const DEFAULT_GROUPS = [
  { id: "g_default", name: "Mặc định" },
  { id: "g_ads", name: "Quảng cáo" },
  { id: "g_shop", name: "Thương mại" },
  { id: "g_test", name: "Thử nghiệm" },
];
