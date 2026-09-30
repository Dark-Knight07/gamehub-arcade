import Link from "next/link";
import type { Game } from "@/data/types";
import { offlineEdition } from "@/data/downloads";
import { DownloadIcon, PlayIcon } from "./icons";

export default function PlayCTA({ game, size = "md", className = "" }: { game: Game; size?: "sm" | "md" | "lg"; className?: string }) {
  const pad = size === "sm" ? "!px-3.5 !py-2 !text-xs" : size === "lg" ? "!px-7 !py-4 !text-base" : "";
  if (game.type === "offline") {
    const file = offlineEdition(game.id);
    const href = game.downloadUrl ?? file?.url;
    if (!href) return null;
    return (
      <a href={href} download className={`btn-download ${pad} ${className}`} aria-label={`Download ${game.name}`}>
        <DownloadIcon width={size === "lg" ? 20 : 16} height={size === "lg" ? 20 : 16} />
        Download
      </a>
    );
  }
  return (
    <Link href={`/play/${game.id}`} className={`btn-play ${pad} ${className}`} aria-label={`Play ${game.name} now`}>
      <PlayIcon width={size === "lg" ? 20 : 16} height={size === "lg" ? 20 : 16} />
      Play now
    </Link>
  );
}
