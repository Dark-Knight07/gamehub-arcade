import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { TypeBadge, Rating } from "@/components/Badges";
import { DownloadIcon, PlayIcon } from "@/components/icons";
import FavoriteButton from "@/components/FavoriteButton";
import { browserGames, offlineGames } from "@/data/games";
import { offlineEdition } from "@/data/downloads";

export const metadata: Metadata = { title: "Offline games", description: "Download original games and play them without an internet connection." };

export default function OfflinePage() {
  return (
    <div className="shell">
      <PageHeader
        title="Offline games"
        description="Download a game once and play it anywhere, with no internet connection. Each download is a single, self-contained file that opens in your web browser. Nothing to install, no account needed."
      />

      <div className="grid gap-6">
        {offlineGames.map((g) => {
          const file = offlineEdition(g.id);
          return (
            <article key={g.id} className="grid overflow-hidden rounded-3xl border border-edge bg-panel/50 backdrop-blur-xl lg:grid-cols-[minmax(0,420px)_1fr]">
              <Link href={`/game/${g.id}`} className="group relative block aspect-[16/9] overflow-hidden lg:aspect-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.thumbnail} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                <TypeBadge type={g.type} className="absolute left-4 top-4" />
              </Link>
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-dim"><span>{g.genre}</span><Rating value={g.rating} /></div>
                    <h2 className="mt-1 font-display text-3xl font-bold tracking-wide"><Link href={`/game/${g.id}`} className="hover:text-cyan-neon">{g.name}</Link></h2>
                  </div>
                  <FavoriteButton gameId={g.id} name={g.name} />
                </div>
                <p className="mt-3 max-w-2xl leading-relaxed text-dim">{g.description}</p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <div><dt className="text-xs uppercase tracking-wider text-dim">File size</dt><dd className="mt-1 font-semibold">{file?.size ?? "Unavailable"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wider text-dim">Format</dt><dd className="mt-1 font-semibold">Single HTML file</dd></div>
                  <div className="col-span-2 sm:col-span-1"><dt className="text-xs uppercase tracking-wider text-dim">Platform</dt><dd className="mt-1 font-semibold">{g.platforms.join(", ")}</dd></div>
                </dl>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <details className="group rounded-2xl border border-edge bg-white/[0.02] p-4 open:bg-white/[0.04]">
                    <summary className="cursor-pointer list-none font-display font-semibold tracking-wide marker:hidden">System requirements <span className="float-right text-dim transition group-open:rotate-45">+</span></summary>
                    <ul className="mt-3 space-y-1.5 text-sm text-dim">
                      {g.systemRequirements?.map((r) => <li key={r} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ffc857]" />{r}</li>)}
                    </ul>
                  </details>
                  <details className="group rounded-2xl border border-edge bg-white/[0.02] p-4 open:bg-white/[0.04]">
                    <summary className="cursor-pointer list-none font-display font-semibold tracking-wide">Installation <span className="float-right text-dim transition group-open:rotate-45">+</span></summary>
                    <ol className="mt-3 space-y-1.5 text-sm text-dim">
                      {g.installSteps?.map((s, i) => <li key={s} className="flex gap-2"><span className="font-semibold text-[#ffc857]">{i + 1}.</span>{s}</li>)}
                    </ol>
                  </details>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                  {file && (
                    <a href={g.downloadUrl ?? file.url} download className="btn-download !px-6 !py-3.5">
                      <DownloadIcon width={18} height={18} /> Download <span className="font-sans text-xs normal-case tracking-normal opacity-75">({file.size})</span>
                    </a>
                  )}
                  <Link href={`/play/${g.id}`} className="btn-ghost"><PlayIcon width={16} height={16} /> Try it in the browser</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-16">
        <h2 className="section-title">Take any online game offline</h2>
        <p className="mt-1 max-w-2xl text-sm text-dim">Every online game also has an offline edition. Download it and play without internet. It works the same way as the games above.</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-edge">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-dim">
              <tr><th className="px-4 py-3 font-semibold">Game</th><th className="hidden px-4 py-3 font-semibold sm:table-cell">Genre</th><th className="px-4 py-3 font-semibold">Size</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {browserGames.map((g) => {
                const file = offlineEdition(g.id);
                if (!file) return null;
                return (
                  <tr key={g.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/game/${g.id}`} className="flex items-center gap-3 font-semibold hover:text-cyan-neon">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.thumbnail} alt="" className="h-9 w-14 rounded-md object-cover" />{g.name}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-dim sm:table-cell">{g.genre}</td>
                    <td className="px-4 py-3 text-dim">{file.size}</td>
                    <td className="px-4 py-3 text-right">
                      <a href={file.url} download className="inline-flex items-center gap-1.5 font-semibold text-[#ffc857] hover:underline" aria-label={`Download ${g.name} offline edition`}>
                        <DownloadIcon width={15} height={15} /> <span className="hidden sm:inline">Download</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
