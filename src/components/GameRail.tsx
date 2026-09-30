"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Game } from "@/data/types";
import GameCard from "./GameCard";
import { ChevronIcon } from "./icons";

export default function GameRail({ title, games, href, hrefLabel = "View all", description }: { title: string; games: Game[]; href?: string; hrefLabel?: string; description?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: "smooth" });
  if (!games.length) return null;
  return (
    <section className="mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {description && <p className="mt-1 text-sm text-dim">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && <Link href={href} className="mr-2 hidden text-sm font-semibold text-cyan-neon hover:underline sm:inline">{hrefLabel}</Link>}
          <button type="button" className="btn-icon hidden sm:inline-flex" onClick={() => scroll(-1)} aria-label={`Scroll ${title} back`}><ChevronIcon className="rotate-180" /></button>
          <button type="button" className="btn-icon hidden sm:inline-flex" onClick={() => scroll(1)} aria-label={`Scroll ${title} forward`}><ChevronIcon /></button>
        </div>
      </div>
      <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        {games.map((g) => (
          <div key={g.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[31%] xl:w-[23.5%]">
            <GameCard game={g} />
          </div>
        ))}
      </div>
      {href && <Link href={href} className="mt-1 inline-block text-sm font-semibold text-cyan-neon sm:hidden">{hrefLabel}</Link>}
    </section>
  );
}
