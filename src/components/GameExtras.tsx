"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/data/types";
import { formatDuration, gameStats, rateGame, readBest, useHydrated, usePlayerData } from "@/lib/store";
import { CloseIcon, StarIcon, ChevronIcon } from "./icons";

export function formatBestValue(game: Game, v: number | null) {
  if (v === null) return "–";
  if (game.bestFormat === "time") return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
  return v.toLocaleString();
}

export function PlayerStats({ game }: { game: Game }) {
  const { history } = usePlayerData();
  const hydrated = useHydrated();
  const st = gameStats(history, game.id);
  const best = hydrated ? readBest(game.id) : null;
  const items = [
    [game.bestLabel ?? `Best ${game.scoreLabel.toLowerCase()}`, hydrated ? formatBestValue(game, best) : "–"],
    ["Sessions", hydrated ? String(st.plays) : "–"],
    ["Time played", hydrated && st.totalSec ? formatDuration(st.totalSec) : "–"],
  ];
  return (
    <dl className="grid grid-cols-3 gap-3">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-2xl glass px-4 py-3">
          <dt className="truncate text-[11px] uppercase tracking-wider text-dim">{k}</dt>
          <dd className="mt-1 font-display text-xl font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RateGame({ game }: { game: Game }) {
  const { ratings } = usePlayerData();
  const hydrated = useHydrated();
  const mine = hydrated ? ratings[game.id] ?? 0 : 0;
  const [hover, setHover] = useState(0);
  const shown = hover || mine;
  return (
    <div>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={`Your rating for ${game.name}`} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={mine === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)} onClick={() => rateGame(game.id, mine === n ? 0 : n)}
            className={`rounded-md p-1 transition hover:scale-110 ${n <= shown ? "text-[#ffc857]" : "text-dim/40"}`}>
            <StarIcon filled={n <= shown} width={26} height={26} />
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-dim" aria-live="polite">{mine ? `You rated this ${mine} out of 5. Tap your rating again to remove it.` : "Tap a star to rate this game. Your rating is saved on this device."}</p>
    </div>
  );
}

export function Screenshots({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, images.length]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <button key={src} type="button" onClick={() => setOpen(i)} className="group relative overflow-hidden rounded-2xl border border-edge bg-deep" aria-label={`Open ${name} screenshot ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${name} gameplay screenshot ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full object-contain transition duration-500 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${name} screenshot ${open + 1}`} className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 p-4 backdrop-blur-md" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[open]} alt={`${name} gameplay screenshot ${open + 1}`} className="max-h-[86vh] max-w-full rounded-2xl border border-edge object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="btn-icon absolute right-4 top-4" onClick={() => setOpen(null)} aria-label="Close"><CloseIcon /></button>
          {images.length > 1 && (
            <>
              <button type="button" className="btn-icon absolute left-4 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + images.length) % images.length); }} aria-label="Previous screenshot"><ChevronIcon className="rotate-180" /></button>
              <button type="button" className="btn-icon absolute right-4 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % images.length); }} aria-label="Next screenshot"><ChevronIcon /></button>
            </>
          )}
        </div>
      )}
    </>
  );
}
