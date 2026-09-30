import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Player from "@/components/Player";
import { games, gameById } from "@/data/games";

export function generateStaticParams() {
  return games.map((g) => ({ id: g.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const g = gameById(params.id);
  return g ? { title: `Play ${g.name}`, description: g.tagline } : {};
}

export default function PlayPage({ params }: { params: { id: string } }) {
  const game = gameById(params.id);
  if (!game) notFound();
  return <Player game={game} />;
}
