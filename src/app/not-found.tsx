import Link from "next/link";
import { Logo } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <Logo className="h-14 w-14" />
      <p className="mt-8 font-display text-7xl font-bold text-gradient">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">This level doesn&apos;t exist</h1>
      <p className="mt-2 max-w-md text-dim">The page you&apos;re looking for has moved or never existed. Head back and pick a game.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-play">Back to home</Link>
        <Link href="/games" className="btn-ghost">Browse games</Link>
      </div>
    </main>
  );
}
