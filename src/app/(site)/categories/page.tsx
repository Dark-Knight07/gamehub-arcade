import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CategoryTile from "@/components/CategoryTile";
import { categories } from "@/data/categories";
import { games } from "@/data/games";

export const metadata: Metadata = { title: "Categories", description: "Browse games by category." };

export default function CategoriesPage() {
  return (
    <div className="shell">
      <PageHeader title="Categories" description="Find your kind of game, from quick arcade runs to slow-burn logic puzzles." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => {
          const list = games.filter((g) => g.categories.includes(c.slug));
          return <CategoryTile key={c.slug} category={c} count={list.length} thumbs={list.map((g) => g.thumbnail)} />;
        })}
      </div>
    </div>
  );
}
