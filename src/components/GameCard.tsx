import Link from "next/link";
import type { Game } from "@/data/types";
import { Rating, TypeBadge, platformSummary } from "./Badges";
import FavoriteButton from "./FavoriteButton";
import PlayCTA from "./PlayCTA";

export default function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel/60 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-neon/40 hover:shadow-glow">
      <Link href={`/game/${game.id}`} className="relative block aspect-[16/9] overflow-hidden" aria-label={`${game.name} details`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.thumbnail}
          alt=""
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent opacity-80" />
        <TypeBadge type={game.type} className="absolute left-3 top-3" />
      </Link>
      <div className="absolute right-3 top-3">
        <FavoriteButton gameId={game.id} name={game.name} />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <div className="flex items-center justify-between gap-2 text-xs text-dim">
          <span className="font-medium">{game.genre}</span>
          <Rating value={game.rating} />
        </div>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight tracking-wide">
          <Link href={`/game/${game.id}`} className="hover:text-cyan-neon">{game.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-dim">{game.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-[11px] leading-tight text-dim/80">{platformSummary(game)}</span>
          <PlayCTA game={game} size="sm" />
        </div>
      </div>
    </article>
  );
}
