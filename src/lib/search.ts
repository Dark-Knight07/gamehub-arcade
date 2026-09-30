import { games } from "@/data/games";
import { categoryBySlug } from "@/data/categories";
import type { Game } from "@/data/types";

/** Ranked search across name, genre, categories, tagline and description */
export function searchGames(query: string, pool: Game[] = games): Game[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  const terms = q.split(/\s+/);
  return pool
    .map((g) => {
      const name = g.name.toLowerCase();
      const cats = g.categories.map((c) => categoryBySlug(c)?.name.toLowerCase() ?? c).join(" ");
      const hay = `${name} ${g.genre.toLowerCase()} ${cats} ${g.tagline.toLowerCase()} ${g.description.toLowerCase()} ${g.type === "browser" ? "online browser" : "offline download"}`;
      if (!terms.every((t) => hay.includes(t))) return null;
      let score = 0;
      if (name === q) score += 100;
      if (name.startsWith(q)) score += 50;
      if (name.includes(q)) score += 25;
      if (g.genre.toLowerCase().includes(q)) score += 10;
      if (cats.includes(q)) score += 8;
      return { g, score };
    })
    .filter((x): x is { g: Game; score: number } => x !== null)
    .sort((a, b) => b.score - a.score || b.g.rating - a.g.rating)
    .map((x) => x.g);
}
