import Link from "next/link";
import Hero from "@/components/Hero";
import GameRail from "@/components/GameRail";
import CategoryTile from "@/components/CategoryTile";
import ContinuePlaying from "@/components/ContinuePlaying";
import PlayCTA from "@/components/PlayCTA";
import { TypeBadge, Rating } from "@/components/Badges";
import { games, browserGames, offlineGames, gameById } from "@/data/games";
import { categories } from "@/data/categories";

const featured = games.filter((g) => g.featured);
const trending = games.filter((g) => g.trendingRank).sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99));
const newest = [...games].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
const popularCategories = categories
  .map((c) => ({ c, list: games.filter((g) => g.categories.includes(c.slug)) }))
  .sort((a, b) => b.list.length - a.list.length)
  .slice(0, 8);

export default function HomePage() {
  const spotlight = gameById("star-sentinel") ?? games[0];
  const [lead, ...rest] = featured;

  return (
    <>
      <Hero spotlight={spotlight} stack={[gameById("pulse-runner")!, gameById("night-circuit")!, gameById("merge-2048")!]} />

      <div className="shell">
        <ContinuePlaying />

        <section className="mt-16" aria-labelledby="featured-title">
          <div className="mb-5 flex items-end justify-between">
            <h2 id="featured-title" className="section-title">Featured games</h2>
            <Link href="/games" className="text-sm font-semibold text-cyan-neon hover:underline">Full library</Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <article className="group relative overflow-hidden rounded-3xl border border-edge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lead.thumbnail} alt="" className="h-full min-h-[340px] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="flex items-center gap-3"><TypeBadge type={lead.type} /><Rating value={lead.rating} /><span className="text-xs text-dim">{lead.genre}</span></div>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-wide sm:text-4xl">{lead.name}</h3>
                <p className="mt-2 max-w-lg text-dim">{lead.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <PlayCTA game={lead} />
                  <Link href={`/game/${lead.id}`} className="btn-ghost">Details</Link>
                </div>
              </div>
            </article>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {rest.slice(0, 2).map((g) => (
                <article key={g.id} className="group relative min-h-[200px] overflow-hidden rounded-3xl border border-edge">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-5">
                    <div className="flex items-center gap-3"><TypeBadge type={g.type} /><Rating value={g.rating} /></div>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-wide">{g.name}</h3>
                    <p className="mt-1 text-sm text-dim">{g.tagline}</p>
                    <div className="mt-4 flex gap-3"><PlayCTA game={g} size="sm" /><Link href={`/game/${g.id}`} className="btn-ghost !px-3.5 !py-2 !text-xs">Details</Link></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <GameRail title="Trending now" description="Our top picks to play right now." games={trending} href="/games?sort=trending" />
        <GameRail title="Recently added" games={newest.slice(0, 8)} href="/games?sort=newest" />
        <GameRail title="Play online" description="Launch instantly in your browser. No install, no sign-up." games={browserGames} href="/online" hrefLabel="All online games" />
        <GameRail title="Offline games" description="Download once, play anywhere without internet." games={offlineGames} href="/offline" hrefLabel="All offline games" />

        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="section-title">Popular categories</h2>
            <Link href="/categories" className="text-sm font-semibold text-cyan-neon hover:underline">All categories</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map(({ c, list }) => (
              <CategoryTile key={c.slug} category={c} count={list.length} thumbs={list.map((g) => g.thumbnail)} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
