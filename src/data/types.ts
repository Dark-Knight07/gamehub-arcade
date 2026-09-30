export type GameType = "browser" | "offline";

/** How the game is built. "external" means an authorised third-party game URL. */
export type GameEngine = "html5-canvas" | "html5-dom" | "webgl" | "external";

export type CategorySlug =
  | "action"
  | "arcade"
  | "adventure"
  | "puzzle"
  | "racing"
  | "sports"
  | "strategy"
  | "simulation"
  | "casual"
  | "multiplayer"
  | "classic";

export interface Control {
  action: string;
  keys: string;
}

export interface Game {
  id: string;
  name: string;
  tagline: string;
  description: string;
  thumbnail: string;
  screenshots: string[];
  genre: string;
  categories: CategorySlug[];
  type: GameType;
  /** Editor rating out of 5 */
  rating: number;
  developer: string;
  engine: GameEngine;
  /**
   * Where the playable build lives. Built-in games are in /public/games/<id>/index.html,
   * kept separate from this catalog. External games use a full https:// URL you are
   * authorised to embed.
   */
  gameUrl: string;
  /** True when the game speaks the GameHub SDK protocol (pause, restart, sound, scores). */
  sdk: boolean;
  controls: Control[];
  touchControls: string;
  platforms: string[];
  /** Offline edition. File size is measured automatically at build time. */
  downloadUrl?: string;
  systemRequirements?: string[];
  installSteps?: string[];
  scoreLabel: string;
  /** Label for the saved personal best, when it measures something other than the live score */
  bestLabel?: string;
  bestFormat?: "number" | "time";
  lowerIsBetter?: boolean;
  orientation: "portrait" | "landscape" | "square";
  featured?: boolean;
  trendingRank?: number;
  addedAt: string;
  license: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  accent: string;
  icon: string;
}
