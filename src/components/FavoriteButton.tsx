"use client";

import { toggleFavorite, usePlayerData, useHydrated } from "@/lib/store";
import { HeartIcon } from "./icons";

export default function FavoriteButton({ gameId, name, variant = "icon" }: { gameId: string; name: string; variant?: "icon" | "full" }) {
  const { favorites } = usePlayerData();
  const hydrated = useHydrated();
  const on = hydrated && favorites.includes(gameId);
  const label = on ? `Remove ${name} from favorites` : `Add ${name} to favorites`;

  if (variant === "full") {
    return (
      <button type="button" onClick={() => toggleFavorite(gameId)} aria-pressed={on} className={`btn-ghost ${on ? "!border-rose-neon/60 text-rose-neon" : ""}`}>
        <HeartIcon filled={on} width={18} height={18} />
        {on ? "In favorites" : "Add to favorites"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(gameId); }}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
        on ? "border-rose-neon/60 bg-rose-neon/20 text-rose-neon" : "border-white/15 bg-void/50 text-ink/80 hover:border-rose-neon/60 hover:text-rose-neon"
      }`}
    >
      <HeartIcon filled={on} width={17} height={17} />
    </button>
  );
}
