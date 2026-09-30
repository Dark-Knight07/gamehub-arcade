"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ContinuePlaying from "@/components/ContinuePlaying";
import { PlayIcon, RestartIcon } from "@/components/icons";
import { gameById } from "@/data/games";
import { clearHistory, formatDuration, formatWhen, gameStats, readBest, recentGames, useHydrated, usePlayerData } from "@/lib/store";
import type { Game } from "@/data/types";

const OUTCOME = { gameover: "Game over", win: "Won", quit: "Left early" } as const;

function formatBest(g: Game, v: number | null) {
  if (v === null) return "–";
  if (g.bestFormat === "time") return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
  return String(v);
}

export default function RecentView() {
  const { history } = usePlayerData();
  const hydrated = useHydrated();
  const recent = recentGames(history);

  return (
    <div className="shell">
      <PageHeader title="Recently played" description="Your recent games, best scores and full play history. Everything is kept on this device only." />
      {!hydrated ? null : !history.length ? (
        <div className="glass rounded-3xl px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-neon/15 text-cyan-neon"><RestartIcon width={26} height={26} /></span>
          <p className="mt-5 font-display text-2xl font-semibold">Nothing played yet</p>
          <p className="mx-auto mt-2 max-w-md text-dim">Start a game and it will show up here, along with your best scores and play history.</p>
          <Link href="/online" className="btn-play mt-6"><PlayIcon width={16} height={16} /> Play a game</Link>
        </div>
      ) : (
        <>
          <ContinuePlaying limit={8} />

          <section className="mt-14">
            <h2 className="section-title">Recently played</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((s) => {
                const g = gameById(s.gameId);
                if (!g) return null;
                const st = gameStats(history, g.id);
                return (
                  <article key={g.id} className="flex gap-4 rounded-2xl glass p-3">
                    <Link href={`/game/${g.id}`} className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.thumbnail} alt="" className="h-20 w-32 rounded-xl object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link href={`/game/${g.id}`} className="truncate font-display text-lg font-semibold hover:text-cyan-neon">{g.name}</Link>
                      <p className="text-xs text-dim">Last played {formatWhen(s.startedAt)}</p>
                      <p className="mt-1 text-xs text-dim">{st.plays} {st.plays === 1 ? "session" : "sessions"}, {formatDuration(st.totalSec)} played</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-xs text-dim">{g.bestLabel ?? "Best"}: <b className="text-ink">{formatBest(g, readBest(g.id))}</b></span>
                        <Link href={`/play/${g.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-neon hover:underline"><PlayIcon width={13} height={13} /> Play</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="section-title">Game history</h2>
              <button type="button" onClick={() => { if (window.confirm("Clear your whole play history on this device?")) clearHistory(); }} className="text-sm font-semibold text-dim hover:text-rose-neon">
                Clear history
              </button>
            </div>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-edge">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-dim">
                  <tr><th className="px-4 py-3 font-semibold">Game</th><th className="px-4 py-3 font-semibold">When</th><th className="px-4 py-3 font-semibold">Time played</th><th className="px-4 py-3 font-semibold">Score</th><th className="px-4 py-3 font-semibold">Result</th></tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {history.slice(0, 50).map((s) => {
                    const g = gameById(s.gameId);
                    if (!g) return null;
                    return (
                      <tr key={s.id}>
                        <td className="px-4 py-3 font-semibold"><Link href={`/game/${g.id}`} className="hover:text-cyan-neon">{g.name}</Link></td>
                        <td className="px-4 py-3 text-dim">{formatWhen(s.startedAt)}</td>
                        <td className="px-4 py-3 text-dim">{formatDuration(s.durationSec)}</td>
                        <td className="px-4 py-3 text-dim">{s.score ?? "–"} {s.score !== null && <span className="text-xs">{g.scoreLabel.toLowerCase()}</span>}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.outcome === "win" ? "bg-lime-neon/15 text-lime-neon" : s.outcome === "gameover" ? "bg-rose-neon/15 text-rose-neon" : "bg-white/[0.06] text-dim"}`}>{OUTCOME[s.outcome]}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
