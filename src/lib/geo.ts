export const COUNTRY_LOCALE: Record<
  string,
  { timezone: string; language: string; languages: string[] }
> = {
  US: { timezone: "America/New_York", language: "en-US", languages: ["en-US", "en"] },
  GB: { timezone: "Europe/London", language: "en-GB", languages: ["en-GB", "en"] },
  DE: { timezone: "Europe/Berlin", language: "de-DE", languages: ["de-DE", "de", "en"] },
  NL: { timezone: "Europe/Amsterdam", language: "nl-NL", languages: ["nl-NL", "nl", "en"] },
  FR: { timezone: "Europe/Paris", language: "fr-FR", languages: ["fr-FR", "fr", "en"] },
  CA: { timezone: "America/Toronto", language: "en-CA", languages: ["en-CA", "en", "fr-CA"] },
  SG: { timezone: "Asia/Singapore", language: "en-SG", languages: ["en-SG", "en", "zh-SG"] },
  JP: { timezone: "Asia/Tokyo", language: "ja-JP", languages: ["ja-JP", "ja", "en"] },
  SE: { timezone: "Europe/Stockholm", language: "sv-SE", languages: ["sv-SE", "sv", "en"] },
  FI: { timezone: "Europe/Helsinki", language: "fi-FI", languages: ["fi-FI", "fi", "en"] },
  PL: { timezone: "Europe/Warsaw", language: "pl-PL", languages: ["pl-PL", "pl", "en"] },
  RO: { timezone: "Europe/Bucharest", language: "ro-RO", languages: ["ro-RO", "ro", "en"] },
  VN: { timezone: "Asia/Ho_Chi_Minh", language: "vi-VN", languages: ["vi-VN", "vi", "en"] },
};

export function localeForCountry(code: string | undefined) {
  if (!code) return COUNTRY_LOCALE.US;
  return COUNTRY_LOCALE[code.toUpperCase()] ?? COUNTRY_LOCALE.US;
}
