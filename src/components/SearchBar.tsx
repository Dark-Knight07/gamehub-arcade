"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchGames } from "@/lib/search";
import { SearchIcon } from "./icons";
import { TypeBadge } from "./Badges";

export default function SearchBar({ onNavigate, autoFocus = false }: { onNavigate?: () => void; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => (q.trim() ? searchGames(q).slice(0, 6) : []), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false); setQ(""); setActive(-1);
    input.current?.blur();
    onNavigate?.();
    router.push(href);
  };

  const submit = () => {
    if (active >= 0 && results[active]) return go(`/game/${results[active].id}`);
    if (q.trim()) go(`/games?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="relative w-full">
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <label className="relative block">
          <span className="sr-only">Search games</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" width={17} height={17} />
          <input
            ref={input}
            autoFocus={autoFocus}
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
              if (e.key === "Escape") { setOpen(false); input.current?.blur(); }
            }}
            placeholder="Search games, genres, categories"
            className="field !rounded-full !bg-white/[0.04] !py-2.5 !pl-10 !pr-12"
            role="combobox"
            aria-expanded={open && results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          />
          <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-edge px-1.5 text-[11px] text-dim lg:block">/</kbd>
        </label>
      </form>
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-edge bg-deep/95 shadow-card backdrop-blur-xl">
          {results.length ? (
            <ul id={listId} role="listbox" className="p-1.5">
              {results.map((g, i) => (
                <li key={g.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(`/game/${g.id}`)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${i === active ? "bg-white/[0.07]" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.thumbnail} alt="" className="h-10 w-16 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display font-semibold">{g.name}</span>
                      <span className="block truncate text-xs text-dim">{g.genre}</span>
                    </span>
                    <TypeBadge type={g.type} className="shrink-0 scale-90" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(`/games?q=${encodeURIComponent(q.trim())}`)} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-cyan-neon hover:bg-white/[0.05]">
                  See all results for “{q.trim()}”
                </button>
              </li>
            </ul>
          ) : (
            <p className="p-4 text-sm text-dim">No games match “{q.trim()}”. Try a genre like puzzle or racing.</p>
          )}
        </div>
      )}
    </div>
  );
}
