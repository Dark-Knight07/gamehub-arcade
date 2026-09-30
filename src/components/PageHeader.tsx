export default function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <header className="relative pb-8 pt-12 sm:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 left-0 h-48 w-80 rounded-full bg-violet-neon/15 blur-[90px]" />
      <h1 className="relative font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">{title}</h1>
      {description && <p className="relative mt-3 max-w-2xl text-lg text-dim">{description}</p>}
      {children}
    </header>
  );
}
