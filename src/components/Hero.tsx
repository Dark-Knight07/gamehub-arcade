import Link from "next/link";
import type { Game } from "@/data/types";
import { ArrowIcon, PlayIcon } from "./icons";

export default function Hero({ spotlight, stack }: { spotlight: Game; stack: Game[] }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Animated backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] animate-drift rounded-full bg-violet-neon/25 blur-[120px]" />
        <div className="absolute -right-32 top-10 h-[460px] w-[460px] animate-drift2 rounded-full bg-cyan-neon/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[500px] animate-drift rounded-full bg-rose-neon/10 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] [perspective:600px]">
          <div
            className="absolute inset-x-[-50%] bottom-[-40%] h-[140%] origin-bottom animate-gridmove [transform:rotateX(62deg)]"
            style={{
              backgroundImage: "linear-gradient(rgba(64,224,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,255,.22) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "linear-gradient(to top, black 10%, transparent 75%)",
              WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 75%)",
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="shell grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-10">
        <div className="animate-rise">
          <h1 className="font-display text-[clamp(2.9rem,7.4vw,6rem)] font-bold uppercase leading-[0.92] tracking-tight">
            <span className="block">Your games.</span>
            <span className="text-gradient block drop-shadow-[0_0_40px_rgba(64,224,255,0.25)]">One place.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim sm:text-xl">
            Discover, play, and enjoy games online — anytime, anywhere.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/online" className="btn-play !px-7 !py-4 !text-base">
              <PlayIcon width={20} height={20} /> Play games
            </Link>
            <Link href="/games" className="btn-ghost !px-7 !py-4 !text-base">
              Explore library <ArrowIcon width={18} height={18} />
            </Link>
          </div>
          <Link href={`/play/${spotlight.id}`} className="group mt-12 flex max-w-md items-center gap-4 rounded-2xl glass p-3 pr-5 transition hover:border-cyan-neon/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={spotlight.thumbnail} alt="" className="h-16 w-28 rounded-xl object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-dim">Jump straight in</span>
              <span className="block truncate font-display text-lg font-semibold">{spotlight.name}</span>
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-neon to-violet-neon text-void transition group-hover:scale-110">
              <PlayIcon width={18} height={18} />
            </span>
          </Link>
        </div>

        <div className="relative hidden h-[520px] lg:block" aria-hidden="true">
          {stack.slice(0, 3).map((g, i) => {
            const pos = [
              "left-[4%] top-[6%] w-[74%] rotate-[-6deg] z-10",
              "right-0 top-[30%] w-[66%] rotate-[5deg] z-20",
              "left-[14%] bottom-0 w-[58%] rotate-[-2deg] z-30",
            ][i];
            return (
              <Link key={g.id} href={`/game/${g.id}`} tabIndex={-1}
                className={`absolute ${pos} overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition duration-500 hover:z-40 hover:rotate-0 hover:scale-[1.03]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.thumbnail} alt="" className="aspect-[16/9] w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-4 pt-10 font-display text-lg font-semibold">{g.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
