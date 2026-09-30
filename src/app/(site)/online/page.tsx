import { Suspense } from "react";
import type { Metadata } from "next";
import Library from "@/components/Library";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "Online games", description: "Play instantly in your browser, on desktop, tablet or phone." };

export default function OnlinePage() {
  return (
    <div className="shell">
      <PageHeader title="Online games" description="Every one of these runs right here in your browser. Press Play now and you're in, on desktop, tablet or phone." />
      <Suspense fallback={null}><Library lockedType="browser" /></Suspense>
    </div>
  );
}
