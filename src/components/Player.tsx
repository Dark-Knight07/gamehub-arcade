"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Game } from "@/data/types";
import { readBest, recordSession, type Outcome } from "@/lib/store";
import { formatBestValue } from "./GameExtras";
import { CloseIcon, ExitIcon, ExpandIcon, InfoIcon, PauseIcon, PlayIcon, RestartIcon, ShrinkIcon, SoundOffIcon, SoundOnIcon } from "./icons";

interface SessionRef {
  startedAt: number;
  score: number | null;
  active: boolean;
  pausedMs: number;
  pauseAt: number | null;
}

const freshSession = (): SessionRef => ({ startedAt: Date.now(), score: null, active: true, pausedMs: 0, pauseAt: null });

export default function Player({ game }: { game: Game }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const session = useRef<SessionRef>(freshSession());
  const scoreTimer = useRef<number | null>(null);
  const pendingScore = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fakeFullscreen, setFakeFullscreen] = useState(false);
  const [panel, setPanel] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [rotateHint, setRotateHint] = useState(false);

  const external = game.engine === "external";
  const sdk = game.sdk;

  // ---------- session bookkeeping (feeds Recently Played, History, Continue Playing) ----------
  const flush = useCallback(
    (outcome: Outcome) => {
      const s = session.current;
      if (!s.active) return;
      s.active = false;
      const pausedNow = s.pauseAt ? Date.now() - s.pauseAt : 0;
      const durationSec = Math.round((Date.now() - s.startedAt - s.pausedMs - pausedNow) / 1000);
      recordSession({ gameId: game.id, startedAt: s.startedAt, durationSec: Math.max(0, durationSec), score: s.score, outcome });
    },
    [game.id]
  );

  useEffect(() => {
    try { setMuted(JSON.parse(localStorage.getItem("ogh:muted") ?? "false") === true); } catch { /* ignore */ }
    setBest(readBest(game.id));
    setPanel(window.innerWidth >= 1280);
    const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 760;
    setRotateHint(game.orientation === "landscape" && portrait);
    const onHide = () => flush("quit");
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      flush("quit");
    };
  }, [flush, game.id, game.orientation]);

  // ---------- host -> game ----------
  const post = useCallback((type: string, extra: Record<string, unknown> = {}) => {
    frame.current?.contentWindow?.postMessage({ source: "ogh-host", type, ...extra }, external ? "*" : window.location.origin);
  }, [external]);

  const focusGame = useCallback(() => {
    window.setTimeout(() => {
      frame.current?.focus();
      try { frame.current?.contentWindow?.focus(); } catch { /* cross-origin */ }
    }, 0);
  }, []);

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast((t) => (t === text ? null : t)), 3600);
  };

  const markPaused = (on: boolean) => {
    const s = session.current;
    if (on && !s.pauseAt) s.pauseAt = Date.now();
    if (!on && s.pauseAt) { s.pausedMs += Date.now() - s.pauseAt; s.pauseAt = null; }
    setPaused(on);
  };

  // ---------- game -> host ----------
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      const d = e.data;
      if (!d || d.source !== "ogh-game") return;
      switch (d.type) {
        case "ready":
          setLoaded(true);
          if (typeof d.muted === "boolean") setMuted(d.muted);
          break;
        case "score": {
          if (!session.current.active) session.current = freshSession();
          session.current.score = d.value;
          pendingScore.current = d.value;
          if (scoreTimer.current === null) {
            scoreTimer.current = window.setTimeout(() => {
              setScore(pendingScore.current);
              scoreTimer.current = null;
            }, 90);
          }
          break;
        }
        case "gameover":
        case "win": {
          if (typeof d.score === "number") { session.current.score = d.score; setScore(d.score); }
          flush(d.type);
          const nb = readBest(game.id);
          setBest(nb);
          const label = d.type === "win" ? "You win" : "Game over";
          showToast(d.isNew && nb !== null ? `${label}. New personal best: ${formatBestValue(game, nb)}` : `${label}. Score: ${d.score ?? 0}`);
          break;
        }
        case "paused":
          markPaused(true);
          break;
        case "resumed":
          markPaused(false);
          break;
        case "muted":
          setMuted(!!d.muted);
          break;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [flush, game]);

  // ---------- controls ----------
  const togglePause = useCallback(() => {
    if (!sdk) return;
    post(paused ? "resume" : "pause");
    markPaused(!paused);
    if (paused) focusGame();
  }, [sdk, paused, post, focusGame]);

  const restart = useCallback(() => {
    if (session.current.active && session.current.score !== null) flush("quit");
    session.current = freshSession();
    setScore(null);
    markPaused(false);
    if (sdk) post("restart");
    else { setLoaded(false); setFrameKey((k) => k + 1); }
    focusGame();
  }, [sdk, post, flush, focusGame]);

  const toggleMute = useCallback(() => {
    if (!sdk) return;
    const next = !muted;
    setMuted(next);
    post("mute", { muted: next });
    focusGame();
  }, [sdk, muted, post, focusGame]);

  const toggleFullscreen = useCallback(async () => {
    const el = root.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }) | null;
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> };
    try {
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        await (doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.());
      } else if (fakeFullscreen) {
        setFakeFullscreen(false);
      } else if (el?.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: "hide" });
      } else if (el?.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else {
        setFakeFullscreen(true); // iPhone Safari has no Fullscreen API for elements
      }
    } catch {
      setFakeFullscreen((f) => !f);
    }
    focusGame();
  }, [fakeFullscreen, focusGame]);

  useEffect(() => {
    const onChange = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      setFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const exit = useCallback(() => {
    flush("quit");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    router.push(`/game/${game.id}`);
  }, [flush, router, game.id]);

  // Shortcuts when the player UI (not the game) has focus. Inside the game the SDK handles them.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const k = e.key.toLowerCase();
      if (k === "p" || (k === "escape" && !document.fullscreenElement && !fakeFullscreen)) togglePause();
      else if (k === "escape" && fakeFullscreen) setFakeFullscreen(false);
      else if (k === "r" && !e.metaKey && !e.ctrlKey) restart();
      else if (k === "m") toggleMute();
      else if (k === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause, restart, toggleMute, toggleFullscreen, fakeFullscreen]);

  const isFull = fullscreen || fakeFullscreen;
  const tool = "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-edge bg-white/[0.04] px-2.5 text-ink transition hover:border-cyan-neon/50 hover:bg-white/[0.08] sm:px-3";
  const toolLabel = "hidden font-display text-xs font-semibold uppercase tracking-[0.08em] lg:inline";

  return (
    <div ref={root} className={`flex h-[100dvh] flex-col overflow-hidden overscroll-none bg-void ${fakeFullscreen ? "fixed inset-0 z-[100]" : ""}`}>
      {/* Toolbar */}
      <header className="relative z-20 flex h-14 shrink-0 items-center gap-2 border-b border-edge bg-deep/90 px-2 backdrop-blur-xl sm:h-16 sm:gap-3 sm:px-4" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <button type="button" onClick={exit} className={tool} aria-label="Exit game">
          <ExitIcon /><span className={toolLabel}>Exit</span>
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-semibold tracking-wide sm:text-lg">{game.name}</h1>
          <p className="hidden truncate text-xs text-dim sm:block">{game.genre}</p>
        </div>
        {sdk && (
          <div className="hidden items-center gap-2 md:flex" aria-live="polite">
            <span className="rounded-xl border border-edge bg-white/[0.03] px-3 py-1.5 text-xs text-dim">{game.scoreLabel} <b className="ml-1 font-display text-sm text-ink">{score ?? 0}</b></span>
            <span className="rounded-xl border border-edge bg-white/[0.03] px-3 py-1.5 text-xs text-dim">{game.bestLabel ?? "Best"} <b className="ml-1 font-display text-sm text-cyan-neon">{formatBestValue(game, best)}</b></span>
          </div>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {sdk && (
            <button type="button" onClick={togglePause} className={tool} aria-label={paused ? "Resume game" : "Pause game"} aria-pressed={paused}>
              {paused ? <PlayIcon /> : <PauseIcon />}<span className={toolLabel}>{paused ? "Resume" : "Pause"}</span>
            </button>
          )}
          <button type="button" onClick={restart} className={tool} aria-label="Restart game">
            <RestartIcon /><span className={toolLabel}>Restart</span>
          </button>
          {sdk && (
            <button type="button" onClick={toggleMute} className={tool} aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
              {muted ? <SoundOffIcon /> : <SoundOnIcon />}<span className={toolLabel}>Sound</span>
            </button>
          )}
          <button type="button" onClick={() => setPanel((p) => !p)} className={`${tool} ${panel ? "!border-cyan-neon/50 text-cyan-neon" : ""}`} aria-label="How to play" aria-expanded={panel} aria-controls="how-to-play">
            <InfoIcon /><span className={toolLabel}>Controls</span>
          </button>
          <button type="button" onClick={toggleFullscreen} className={tool} aria-label={isFull ? "Exit fullscreen" : "Fullscreen"}>
            {isFull ? <ShrinkIcon /> : <ExpandIcon />}<span className={toolLabel}>{isFull ? "Exit full" : "Fullscreen"}</span>
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Game viewport */}
        <div className="relative min-w-0 flex-1 bg-[radial-gradient(ellipse_at_center,#11163a_0%,#06070d_70%)]">
          <iframe
            key={frameKey}
            ref={frame}
            src={game.gameUrl}
            title={`${game.name} game`}
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
            {...(external ? { sandbox: "allow-scripts allow-same-origin allow-pointer-lock allow-forms" } : {})}
            onLoad={() => { if (!sdk) setLoaded(true); window.setTimeout(() => setLoaded(true), 1500); focusGame(); }}
          />

          {!loaded && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-neon/20 border-t-cyan-neon" />
              <p className="font-display text-sm uppercase tracking-[0.2em] text-dim">Loading {game.name}</p>
            </div>
          )}

          {paused && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/75 p-6 backdrop-blur-md">
              <div className="w-full max-w-sm rounded-3xl glass p-8 text-center">
                <p className="font-display text-4xl font-bold uppercase tracking-wide">Paused</p>
                <p className="mt-2 text-sm text-dim">Take your time. Your game is waiting.</p>
                <div className="mt-7 grid gap-3">
                  <button type="button" onClick={togglePause} className="btn-play" autoFocus><PlayIcon width={16} height={16} /> Resume</button>
                  <button type="button" onClick={restart} className="btn-ghost"><RestartIcon width={16} height={16} /> Restart</button>
                  <button type="button" onClick={exit} className="btn-ghost"><ExitIcon width={16} height={16} /> Exit game</button>
                </div>
                <p className="mt-5 text-xs text-dim">Shortcuts: P pause, R restart, M sound, F fullscreen</p>
              </div>
            </div>
          )}

          {toast && (
            <div role="status" className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-cyan-neon/40 bg-deep/90 px-5 py-2 text-sm font-semibold shadow-glow backdrop-blur-md">
              {toast}
            </div>
          )}

          {rotateHint && (
            <button type="button" onClick={() => setRotateHint(false)} className="absolute inset-x-3 bottom-3 z-10 rounded-2xl border border-edge bg-deep/90 px-4 py-3 text-left text-sm backdrop-blur-md">
              <b className="font-display">Tip:</b> <span className="text-dim">turn your phone sideways for a bigger view. Tap to dismiss.</span>
            </button>
          )}
        </div>

        {/* How to play */}
        {panel && (
          <>
            <button type="button" aria-label="Close controls" onClick={() => { setPanel(false); focusGame(); }} className="absolute inset-0 z-20 bg-void/60 xl:hidden" />
            <aside id="how-to-play" className="absolute inset-x-0 bottom-0 z-30 max-h-[75%] overflow-y-auto rounded-t-3xl border-t border-edge bg-deep/95 p-6 backdrop-blur-xl xl:static xl:max-h-none xl:w-[340px] xl:shrink-0 xl:rounded-none xl:border-l xl:border-t-0">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold tracking-wide">How to play</h2>
                <button type="button" onClick={() => { setPanel(false); focusGame(); }} className="btn-icon !h-9 !w-9" aria-label="Close controls"><CloseIcon width={18} height={18} /></button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-dim">{game.tagline}</p>
              <dl className="mt-5 space-y-3 text-sm">
                {game.controls.map((c) => (
                  <div key={c.action} className="rounded-xl border border-edge bg-white/[0.03] px-4 py-3"><dt className="text-xs uppercase tracking-wider text-dim">{c.action}</dt><dd className="mt-0.5 font-semibold">{c.keys}</dd></div>
                ))}
                <div className="rounded-xl border border-edge bg-white/[0.03] px-4 py-3"><dt className="text-xs uppercase tracking-wider text-dim">Touchscreen</dt><dd className="mt-0.5 font-semibold">{game.touchControls}</dd></div>
              </dl>
              {sdk && (
                <div className="mt-5 rounded-xl border border-edge p-4 text-sm">
                  <p className="font-semibold">Player shortcuts</p>
                  <p className="mt-1 text-dim">P or Esc pause, R restart, M sound, F fullscreen</p>
                </div>
              )}
              {sdk && (
                <div className="mt-5 grid grid-cols-2 gap-3 md:hidden">
                  <div className="rounded-xl border border-edge px-3 py-2 text-xs text-dim">{game.scoreLabel}<b className="block font-display text-lg text-ink">{score ?? 0}</b></div>
                  <div className="rounded-xl border border-edge px-3 py-2 text-xs text-dim">{game.bestLabel ?? "Best"}<b className="block font-display text-lg text-cyan-neon">{formatBestValue(game, best)}</b></div>
                </div>
              )}
              <Link href={`/game/${game.id}`} className="mt-6 inline-block text-sm font-semibold text-cyan-neon hover:underline">Game details</Link>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
