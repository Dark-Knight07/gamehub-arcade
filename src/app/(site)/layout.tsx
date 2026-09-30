import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-lg bg-cyan-neon px-4 py-2 font-semibold text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Navbar />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
