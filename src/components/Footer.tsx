import Link from "next/link";
import { Logo } from "./icons";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-edge">
      <div className="shell flex flex-col gap-6 py-10 pb-14 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7" />
          <div>
            <p className="font-display text-base font-bold tracking-wide">Owais GameHub</p>
            <p className="text-sm text-dim">Play. Explore. Enjoy.</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-dim" aria-label="Footer">
          <Link href="/games" className="hover:text-ink">All games</Link>
          <Link href="/online" className="hover:text-ink">Online</Link>
          <Link href="/offline" className="hover:text-ink">Offline</Link>
          <Link href="/categories" className="hover:text-ink">Categories</Link>
        </nav>
      </div>
      <p className="absolute bottom-3 right-4 font-display text-[11px] italic tracking-[0.2em] text-dim/60 sm:right-6 lg:right-10">MD Owais</p>
    </footer>
  );
}
