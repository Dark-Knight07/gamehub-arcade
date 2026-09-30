import type { Metadata } from "next";
import RecentView from "@/components/views/RecentView";

export const metadata: Metadata = { title: "Recently played", description: "Your recent games, best scores and play history." };
export default function RecentPage() { return <RecentView />; }
