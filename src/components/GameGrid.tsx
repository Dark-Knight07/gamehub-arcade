import type { Game } from "@/data/types";
import GameCard from "./GameCard";

export default function GameGrid({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((g, i) => <GameCard key={g.id} game={g} priority={i < 4} />)}
    </div>
  );
}
