import { cn } from "@/lib/utils";

function hashSeed(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function Identicon({ seed, className }: { seed: string; className?: string }) {
  const h = hashSeed(seed || "orbit");
  const cells: boolean[] = [];
  for (let i = 0; i < 15; i++) cells.push(Boolean((h >> i) & 1));
  const hue = 110 + (h % 40);
  const fill = `oklch(0.72 0.07 ${hue})`;

  return (
    <svg
      viewBox="0 0 5 5"
      className={cn("size-8 rounded-xs", className)}
      aria-hidden
    >
      <rect width="5" height="5" fill="var(--color-elevated)" />
      {cells.map((on, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        if (!on) return null;
        const mirror = 4 - col;
        return (
          <g key={i} fill={fill}>
            <rect x={col} y={row} width="1" height="1" />
            {mirror !== col ? <rect x={mirror} y={row} width="1" height="1" /> : null}
          </g>
        );
      })}
    </svg>
  );
}
