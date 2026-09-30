import { Suspense } from "react";
import type { Metadata } from "next";
import Library from "@/components/Library";
import PageHeader from "@/components/PageHeader";
import { games } from "@/data/games";

export const metadata: Metadata = { title: "Game library", description: "Search and filter every game on Owais GameHub." };

export default function GamesPage() {
  return (
    <div className="shell">
      <PageHeader title="Game library" description={`All ${games.length} games in one place. Search, filter by genre or rating, and play online or download for offline.`} />
      <Suspense fallback={null}><Library /></Suspense>
    </div>
  );
}
