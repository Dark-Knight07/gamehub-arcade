import type { Metadata } from "next";
import FavoritesView from "@/components/views/FavoritesView";

export const metadata: Metadata = { title: "Favorites", description: "Your saved games." };
export default function FavoritesPage() { return <FavoritesView />; }
