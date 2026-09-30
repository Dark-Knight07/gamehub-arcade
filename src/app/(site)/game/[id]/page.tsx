import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games, gameById } from "@/data/games";
import { categoryBySlug } from "@/data/categories";
import { offlineEdition } from "@/data/downloads";
import { Rating, TypeBadge } from "@/components/Badges";
import PlayCTA from "@/components/PlayCTA";
import FavoriteButton from "@/components/FavoriteButton";
import GameRail from "@/components/GameRail";
import { PlayerStats, RateGame, Screenshots } from "@/components/GameExtras";
import { DownloadIcon, PlayIcon } from "@/components/icons";

export function generateStaticParams() {
  return games.map((g) => ({ id: g.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const g = gameById(params.id);
  if (!g) return {};
  return { title: g.name, description: g.tagline + " " + g.description.split(". ")[0] + ".", openGraph: { images: [g.thumbnail] } };
}

const ENGINE: Record<string, string> = { "html5-canvas": "HTML5 Canvas", "html5-dom": "HTML5 and JavaScript", webgl: "WebGL", external: "Embedded partner game" };

export default function GamePage({ params }: { params: { id: string } }) {
  const game = gameById(params.id);
  if (!game) notFound();
  const file = offlineEdition(game.id);
  const related = games.filter((g) => g.id !== game.id && g.categories.some((c) => game.categories.includes(c))).slice(0, 8);
  const offline = game.type === "offline";

  const info: [string, React.ReactNode][] = [
    ["Genre", game.genre],
    ["Categories", (
      <span className="flex flex-wrap gap-1.5">
        {game.categories.map((c) => (
          <Link key={c} href={`/categories/${c}`} className="rounded-full border border-edge px-2.5 py-0.5 text-xs hover:border-cyan-neon/50 hover:text-cyan-neon">{categoryBySlug(c)?.name}</Link>
        ))}
      </span>
    )],
    ["Status", <TypeBadge key="t" type={game.type} />],
    ["Developer", game.developer],
    ["Platform", game.platforms.join(", ")],
    ["Built with", ENGINE[game.engine]],
    ...(offline && file ? ([["File size", file.size]] as [string, React.ReactNode][]) : []),
    ["Added", new Date(game.addedAt + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
    ["License", game.license],
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={game.thumbnail} alt="" className="h-full w-full scale-110 object-cover opacity-30 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/80 to-void" />
        </div>
        <div className="shell grid gap-10 pb-12 pt-8 sm:pt-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl border border-edge shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.thumbnail} alt={`${game.name} artwork`} className="aspect-[16/9] w-full object-cover" />
          </div>
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-dim">
              <Link href="/games" className="hover:text-ink">Games</Link> <span className="px-1">/</span> <Link href={offline ? "/offline" : "/online"} className="hover:text-ink">{offline ? "Offline" : "Online"}</Link>
            </nav>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <TypeBadge type={game.type} />
              <Rating value={game.rating} size="lg" />
              <span className="text-sm text-dim">{game.genre}</span>
            </div>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">{game.name}</h1>
            <p className="mt-3 text-lg text-dim">{game.tagline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PlayCTA game={game} size="lg" />
              <FavoriteButton gameId={game.id} name={game.name} variant="full" />
            </div>
            {offline ? (
              <p className="mt-4 text-sm text-dim">
                {file ? `${file.size} download. ` : ""}Want to try first?{" "}
                <Link href={`/play/${game.id}`} className="font-semibold text-cyan-neon hover:underline">Play it in your browser</Link>
              </p>
            ) : file ? (
              <p className="mt-4 text-sm text-dim">
                Playing somewhere without internet?{" "}
                <a href={file.url} download className="font-semibold text-[#ffc857] hover:underline">Download the offline edition</a> ({file.size})
              </p>
            ) : null}
            <div className="mt-8"><PlayerStats game={game} /></div>
          </div>
        </div>
      </section>

      <div className="shell grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <section>
            <h2 className="section-title">About the game</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-dim">{game.description}</p>
          </section>

          <section className="mt-12">
            <h2 className="section-title">Screenshots</h2>
            <p className="mt-1 text-sm text-dim">Captured from the game running on GameHub.</p>
            <div className="mt-5"><Screenshots images={game.screenshots} name={game.name} /></div>
          </section>

          <section className="mt-12">
            <h2 className="section-title">Controls</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-edge">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-edge">
                  {game.controls.map((c) => (
                    <tr key={c.action}><th scope="row" className="w-1/2 px-4 py-3 font-semibold">{c.action}</th><td className="px-4 py-3 text-dim">{c.keys}</td></tr>
                  ))}
                  <tr><th scope="row" className="px-4 py-3 font-semibold">Touchscreen</th><td className="px-4 py-3 text-dim">{game.touchControls}</td></tr>
                  {game.sdk && <tr><th scope="row" className="px-4 py-3 font-semibold">Pause, restart, sound</th><td className="px-4 py-3 text-dim">P or Esc, R, M</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          {offline && (
            <section className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl glass p-6">
                <h2 className="font-display text-xl font-semibold tracking-wide">System requirements</h2>
                <ul className="mt-4 space-y-2 text-sm text-dim">
                  {game.systemRequirements?.map((r) => <li key={r} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ffc857]" />{r}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl glass p-6">
                <h2 className="font-display text-xl font-semibold tracking-wide">Installation</h2>
                <ol className="mt-4 space-y-2 text-sm text-dim">
                  {game.installSteps?.map((s, i) => <li key={s} className="flex gap-2"><span className="font-semibold text-[#ffc857]">{i + 1}.</span>{s}</li>)}
                </ol>
                {file && <a href={game.downloadUrl ?? file.url} download className="btn-download mt-6"><DownloadIcon width={16} height={16} /> Download ({file.size})</a>}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl glass p-6">
            <h2 className="font-display text-xl font-semibold tracking-wide">Game info</h2>
            <dl className="mt-4 divide-y divide-edge text-sm">
              {info.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-3"><dt className="text-dim">{k}</dt><dd className="min-w-0 font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl glass p-6">
            <h2 className="font-display text-xl font-semibold tracking-wide">Your rating</h2>
            <p className="mt-1 text-sm text-dim">Editor rating {game.rating.toFixed(1)} out of 5</p>
            <div className="mt-4"><RateGame game={game} /></div>
          </div>
          {!offline && (
            <Link href={`/play/${game.id}`} className="group flex items-center justify-between rounded-2xl border border-cyan-neon/30 bg-cyan-neon/[0.06] p-6 transition hover:bg-cyan-neon/[0.1]">
              <span><span className="block font-display text-xl font-semibold">Ready to play?</span><span className="text-sm text-dim">Runs right in your browser</span></span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-neon to-violet-neon text-void transition group-hover:scale-110"><PlayIcon /></span>
            </Link>
          )}
        </aside>
      </div>

      <div className="shell"><GameRail title="More like this" games={related} /></div>
    </>
  );
}
