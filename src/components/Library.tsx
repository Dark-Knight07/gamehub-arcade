"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { games, genres } from "@/data/games";
import { categories } from "@/data/categories";
import type { GameType } from "@/data/types";
import { searchGames } from "@/lib/search";
import GameGrid from "./GameGrid";
import { SearchIcon } from "./icons";

const SORTS = [
  ["featured", "Featured"],
  ["trending", "Trending"],
  ["rating", "Top rated"],
  ["newest", "Newest"],
  ["name", "A to Z"],
] as const;

export default function Library({ lockedType, lockedCategory }: { lockedType?: GameType; lockedCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const genre = params.get("genre") ?? "";
  const type = (lockedType ?? params.get("type") ?? "") as GameType | "";
  const minRating = Number(params.get("rating") ?? 0);
  const category = lockedCategory ?? params.get("category") ?? "";
  const sort = params.get("sort") ?? "featured";
  const [text, setText] = useState(q);
  const typing = useRef(false);

  useEffect(() => setText(q), [q]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (!typing.current) return;
    const t = setTimeout(() => {
      typing.current = false;
      if (text.trim() !== q) update("q", text.trim());
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const results = useMemo(() => {
    let list = games.filter(
      (g) =>
        (!genre || g.genre === genre) &&
        (!type || g.type === type) &&
        (!minRating || g.rating >= minRating) &&
        (!category || g.categories.includes(category as never))
    );
    if (q) return searchGames(q, list);
    list = [...list];
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "trending") list.sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99) || b.rating - a.rating);
    else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (a.trendingRank ?? 99) - (b.trendingRank ?? 99));
    return list;
  }, [q, genre, type, minRating, category, sort]);

  const clearAll = () => {
    typing.current = false;
    setText("");
    router.replace(pathname, { scroll: false });
  };

  const active = Boolean(q || genre || (!lockedType && type) || minRating || (!lockedCategory && category) || sort !== "featured");
  const selectCls = "field !w-auto min-w-[140px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238f96bf%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat !pr-9";

  return (
    <div>
      <div className="glass sticky top-[72px] z-20 -mx-1 rounded-2xl p-3 sm:p-4 lg:top-[80px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search the library</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" width={17} height={17} />
            <input type="search" value={text} onChange={(e) => { typing.current = true; setText(e.target.value); }} placeholder="Search by name, genre or category" className="field !pl-10" />
          </label>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
            {!lockedType && (
              <div className="flex shrink-0 rounded-xl border border-edge bg-deep/80 p-1" role="group" aria-label="Game type">
                {([["", "All"], ["browser", "Online"], ["offline", "Offline"]] as const).map(([v, label]) => (
                  <button key={label} type="button" onClick={() => update("type", v)} aria-pressed={type === v}
                    className={`rounded-lg px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.08em] transition ${type === v ? "bg-white/[0.1] text-ink" : "text-dim hover:text-ink"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            <select aria-label="Genre" value={genre} onChange={(e) => update("genre", e.target.value)} className={selectCls}>
              <option value="">All genres</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {!lockedCategory && (
              <select aria-label="Category" value={category} onChange={(e) => update("category", e.target.value)} className={selectCls}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            )}
            <select aria-label="Minimum rating" value={minRating || ""} onChange={(e) => update("rating", e.target.value)} className={selectCls}>
              <option value="">Any rating</option>
              <option value="4">4.0 and up</option>
              <option value="4.5">4.5 and up</option>
            </select>
            <select aria-label="Sort by" value={sort} onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)} className={selectCls} disabled={!!q}>
              {SORTS.map(([v, label]) => <option key={v} value={v}>{q ? "Best match" : label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-5 mt-6 flex items-center justify-between gap-4 text-sm text-dim">
        <p aria-live="polite">{results.length} {results.length === 1 ? "game" : "games"}{q && <> for “<span className="text-ink">{q}</span>”</>}</p>
        {active && (
          <button type="button" onClick={clearAll} className="font-semibold text-cyan-neon hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length ? (
        <GameGrid games={results} />
      ) : (
        <div className="glass rounded-3xl px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">No games match these filters</p>
          <p className="mx-auto mt-2 max-w-md text-dim">Try a broader search, or clear the filters to see the full library.</p>
          <button type="button" onClick={clearAll} className="btn-ghost mt-6">Clear filters</button>
        </div>
      )}
    </div>
  );
}
