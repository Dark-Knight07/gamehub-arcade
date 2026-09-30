import type { Category } from "./types";

// Icons are 24x24 SVG path data
export const categories: Category[] = [
  { slug: "action", name: "Action", description: "Fast reflexes, dodging and blasting.", accent: "#ff4fa3", icon: "M13 2 4 14h7l-1 8 9-12h-7z" },
  { slug: "arcade", name: "Arcade", description: "Pick up and play, chase the high score.", accent: "#40e0ff", icon: "M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.2 2.4L9 15h6l1.8 2.4A3 3 0 0 0 22 15l-.7-6.4A4 4 0 0 0 17.3 5z" },
  { slug: "adventure", name: "Adventure", description: "Keep moving and see how far you get.", accent: "#ffc857", icon: "m3 20 6-12 4 7 3-4 5 9zM16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { slug: "puzzle", name: "Puzzle", description: "Think it through, one move at a time.", accent: "#8b6bff", icon: "M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z" },
  { slug: "racing", name: "Racing", description: "Speed, traffic and split-second lane changes.", accent: "#ff7a6b", icon: "M5 17h14M6 17l1.5-6h9L18 17M7 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM9 11l1-4h4l1 4" },
  { slug: "sports", name: "Sports", description: "Head-to-head matches against a rival.", accent: "#9dff6a", icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" },
  { slug: "strategy", name: "Strategy", description: "Plan ahead and outsmart your opponent.", accent: "#6bf2c4", icon: "M8 21h8M12 17v4M7 4h10l-1 6a4 4 0 0 1-8 0zM5 4h2M17 4h2" },
  { slug: "simulation", name: "Simulation", description: "Driving and systems that feel alive.", accent: "#57a6ff", icon: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { slug: "casual", name: "Casual", description: "Relaxed games for a quick break.", accent: "#ff9ad5", icon: "M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" },
  { slug: "multiplayer", name: "Multiplayer", description: "Play with a friend on the same device.", accent: "#b39bff", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" },
  { slug: "classic", name: "Classic", description: "Timeless games, rebuilt with a neon finish.", accent: "#e8ebff", icon: "M12 8v4l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
