import Link from "next/link";
import type { Category } from "@/data/types";
import { CategoryGlyph } from "./icons";

export default function CategoryTile({ category, count, thumbs = [] }: { category: Category; count: number; thumbs?: string[] }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-panel/50 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1"
      style={{ ["--accent" as string]: category.accent }}
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 blur-2xl transition duration-500 group-hover:opacity-40" style={{ background: category.accent }} />
      <span className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition group-hover:border-[color:var(--accent)]" style={{ opacity: 0.5 }} />
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]" style={{ color: category.accent }}>
        <CategoryGlyph path={category.icon} width={22} height={22} />
      </span>
      <span className="mt-6 flex items-end justify-between gap-3">
        <span>
          <span className="block font-display text-lg font-semibold tracking-wide">{category.name}</span>
          <span className="block text-xs text-dim">{count} {count === 1 ? "game" : "games"}</span>
        </span>
        {thumbs.length > 0 && (
          <span className="flex -space-x-3">
            {thumbs.slice(0, 3).map((t) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={t} src={t} alt="" className="h-8 w-8 rounded-full border-2 border-panel object-cover" />
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}
