import type { Game } from "@/data/types";
import { GlobeIcon, OfflineIcon, StarIcon } from "./icons";

export function TypeBadge({ type, className = "" }: { type: Game["type"]; className?: string }) {
  const online = type === "browser";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.1em] backdrop-blur-md ${
        online ? "border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon" : "border-[#ffc857]/40 bg-[#ffc857]/10 text-[#ffc857]"
      } ${className}`}
    >
      {online ? <GlobeIcon width={12} height={12} /> : <OfflineIcon width={12} height={12} />}
      {online ? "Online" : "Offline"}
    </span>
  );
}

export function Rating({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-[#ffc857] ${size === "lg" ? "text-base" : "text-xs"}`} aria-label={`Rated ${value} out of 5`}>
      <StarIcon width={size === "lg" ? 18 : 13} height={size === "lg" ? 18 : 13} />
      {value.toFixed(1)}
    </span>
  );
}

export function platformSummary(game: Game) {
  return game.type === "browser" ? "Browser, desktop and mobile" : "Desktop download";
}
