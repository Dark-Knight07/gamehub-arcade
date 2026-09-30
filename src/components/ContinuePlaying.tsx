"use client";

import Link from "next/link";
import { gameById } from "@/data/games";
import { formatWhen, hasSavedProgress, recentGames, useHydrated, usePlayerData } from "@/lib/store";
import { PlayIcon } from "./icons";

export default function ContinuePlaying({ limit = 4, title = "Continue playing" }: { limit?: number; title?: string }) {
  const { history } = usePlayerData();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const items = recentGames(history)
    .filter((s) => s.outcome === "quit" || hasSavedProgress(s.gameId))
    .map((s) => ({ s, g: gameById(s.gameId) }))
    .filter((x) => Boolean(x.g))
    .slice(0, limit);
  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h2 className="section-title">{title}</h2>
      <p className="mt-1 text-sm text-dim">Pick up where you left off.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ s, g }) => g && (
          <Link key={g.id} href={`/play/${g.id}`} className="group flex items-center gap-4 rounded-2xl glass p-3 transition hover:border-cyan-neon/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.thumbnail} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display font-semibold">{g.name}</span>
              <span className="block text-xs text-dim">{hasSavedProgress(g.id) ? "Progress saved" : "Last played"} {formatWhen(s.startedAt)}</span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-cyan-neon transition group-hover:bg-cyan-neon group-hover:text-void">
              <PlayIcon width={16} height={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
