import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const PlayIcon = (p: P) => (<svg {...base} {...p}><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" /></svg>);
export const DownloadIcon = (p: P) => (<svg {...base} {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (<svg {...base} {...p}><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill={filled ? "currentColor" : "none"} /></svg>);
export const SearchIcon = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const StarIcon = ({ filled = true, ...p }: P & { filled?: boolean }) => (<svg {...base} {...p}><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill={filled ? "currentColor" : "none"} /></svg>);
export const PauseIcon = (p: P) => (<svg {...base} {...p}><path d="M8 5v14M16 5v14" strokeWidth={3} /></svg>);
export const RestartIcon = (p: P) => (<svg {...base} {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>);
export const SoundOnIcon = (p: P) => (<svg {...base} {...p}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>);
export const SoundOffIcon = (p: P) => (<svg {...base} {...p}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m22 9-6 6M16 9l6 6" /></svg>);
export const ExpandIcon = (p: P) => (<svg {...base} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
export const ShrinkIcon = (p: P) => (<svg {...base} {...p}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>);
export const ExitIcon = (p: P) => (<svg {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>);
export const CloseIcon = (p: P) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const MenuIcon = (p: P) => (<svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const InfoIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const ArrowIcon = (p: P) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ChevronIcon = (p: P) => (<svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>);
export const GlobeIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>);
export const OfflineIcon = (p: P) => (<svg {...base} {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>);

export function CategoryGlyph({ path, ...p }: P & { path: string }) {
  return (<svg {...base} {...p}><path d={path} /></svg>);
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#40e0ff" />
          <stop offset="1" stopColor="#8b6bff" />
        </linearGradient>
      </defs>
      <path d="M16 2 29 9.5v13L16 30 3 22.5v-13z" fill="none" stroke="url(#lg)" strokeWidth="2.2" />
      <path d="M13 11v10l8-5z" fill="url(#lg)" />
    </svg>
  );
}
