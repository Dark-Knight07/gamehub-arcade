"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import GameGrid from "@/components/GameGrid";
import { HeartIcon } from "@/components/icons";
import { gameById } from "@/data/games";
import type { Game } from "@/data/types";
import { useHydrated, usePlayerData } from "@/lib/store";

export default function FavoritesView() {
  const { favorites } = usePlayerData();
  const hydrated = useHydrated();
  const list = favorites.map(gameById).filter((g): g is Game => Boolean(g));

  return (
    <div className="shell">
      <PageHeader title="Favorites" description="Games you've saved, ready whenever you are. Favorites are stored on this device." />
      {!hydrated ? null : list.length ? (
        <GameGrid games={list} />
      ) : (
        <div className="glass rounded-3xl px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-neon/15 text-rose-neon"><HeartIcon width={26} height={26} /></span>
          <p className="mt-5 font-display text-2xl font-semibold">No favorites yet</p>
          <p className="mx-auto mt-2 max-w-md text-dim">Tap the heart on any game to keep it here for quick access.</p>
          <Link href="/games" className="btn-play mt-6">Browse games</Link>
        </div>
      )}
    </div>
  );
}
