import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Library from "@/components/Library";
import { CategoryGlyph } from "@/components/icons";
import { categories, categoryBySlug } from "@/data/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = categoryBySlug(params.slug);
  return c ? { title: `${c.name} games`, description: c.description } : {};
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const c = categoryBySlug(params.slug);
  if (!c) notFound();
  return (
    <div className="shell">
      <header className="relative pb-8 pt-12 sm:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -top-10 left-0 h-48 w-80 rounded-full opacity-25 blur-[90px]" style={{ background: c.accent }} />
        <Link href="/categories" className="relative text-sm font-semibold text-dim hover:text-ink">Categories</Link>
        <div className="relative mt-3 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]" style={{ color: c.accent }}>
            <CategoryGlyph path={c.icon} width={28} height={28} />
          </span>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">{c.name}</h1>
        </div>
        <p className="relative mt-3 max-w-2xl text-lg text-dim">{c.description}</p>
      </header>
      <Suspense fallback={null}><Library lockedCategory={c.slug} /></Suspense>
    </div>
  );
}
