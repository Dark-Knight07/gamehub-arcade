"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { CloseIcon, Logo, MenuIcon } from "./icons";
import { usePlayerData, useHydrated } from "@/lib/store";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/online", label: "Online" },
  { href: "/offline", label: "Offline" },
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorites" },
  { href: "/recent", label: "Recently played" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = usePlayerData();
  const hydrated = useHydrated();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 transition duration-300 ${scrolled || open ? "border-b border-edge bg-void/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="shell flex h-16 items-center gap-6 lg:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Owais GameHub home">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-wide">Owais <span className="text-gradient">GameHub</span></span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative rounded-lg px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.1em] transition ${isActive(n.href) ? "text-ink" : "text-dim hover:text-ink"}`}
            >
              {n.label}
              {n.href === "/favorites" && hydrated && favorites.length > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-neon/20 px-1.5 text-[10px] text-rose-neon">{favorites.length}</span>
              )}
              {isActive(n.href) && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-neon to-violet-neon" />}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-full max-w-[300px] md:block">
          <SearchBar />
        </div>
        <button type="button" className="btn-icon ml-auto xl:hidden md:ml-0" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="shell h-[calc(100dvh-64px)] overflow-y-auto pb-10 pt-2 xl:hidden">
          <div className="md:hidden"><SearchBar onNavigate={() => setOpen(false)} /></div>
          <nav className="mt-4 grid gap-1" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3.5 font-display text-base font-semibold uppercase tracking-[0.1em] transition ${isActive(n.href) ? "bg-white/[0.06] text-ink" : "text-dim hover:bg-white/[0.04] hover:text-ink"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
