"use client";

import { useSyncExternalStore } from "react";

/*
 * Local player data, kept in the browser with localStorage.
 * Games themselves save bests and progress under "ogh:best:<id>" and "ogh:save:<id>".
 */

export type Outcome = "gameover" | "win" | "quit";

export interface Session {
  id: string;
  gameId: string;
  startedAt: number;
  durationSec: number;
  score: number | null;
  outcome: Outcome;
}

interface State {
  favorites: string[];
  history: Session[];
  ratings: Record<string, number>;
}

const KEYS = { favorites: "ogh:favorites", history: "ogh:history", ratings: "ogh:ratings" } as const;
const MAX_HISTORY = 150;
const EMPTY: State = { favorites: [], history: [], ratings: {} };

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: keep working for this visit */
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = {
    favorites: read<string[]>(KEYS.favorites, []),
    history: read<Session[]>(KEYS.history, []),
    ratings: read<Record<string, number>>(KEYS.ratings, {}),
  };
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  if (next.favorites) write(KEYS.favorites, state.favorites);
  if (next.history) write(KEYS.history, state.history);
  if (next.ratings) write(KEYS.ratings, state.ratings);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key && e.key.startsWith("ogh:")) {
      loaded = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

export function usePlayerData() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Becomes true after the first client render, so saved data can be shown without hydration mismatches. */
export function useHydrated() {
  return useSyncExternalStore(
    (l) => {
      l();
      return () => {};
    },
    () => true,
    () => false
  );
}

export function toggleFavorite(gameId: string) {
  load();
  const has = state.favorites.includes(gameId);
  set({ favorites: has ? state.favorites.filter((f) => f !== gameId) : [gameId, ...state.favorites] });
  return !has;
}

export function rateGame(gameId: string, stars: number) {
  load();
  const ratings = { ...state.ratings };
  if (stars <= 0) delete ratings[gameId];
  else ratings[gameId] = Math.max(1, Math.min(5, Math.round(stars)));
  set({ ratings });
}

export function recordSession(session: Omit<Session, "id">) {
  load();
  if (session.durationSec < 2 && session.score === null) return;
  const entry: Session = { ...session, id: `${session.gameId}-${session.startedAt}` };
  const history = [entry, ...state.history.filter((s) => s.id !== entry.id)].slice(0, MAX_HISTORY);
  set({ history });
}

export function clearHistory() {
  load();
  set({ history: [] });
}

/** Most recent session per game, newest first */
export function recentGames(history: Session[]) {
  const seen = new Set<string>();
  const out: Session[] = [];
  for (const s of history) {
    if (seen.has(s.gameId)) continue;
    seen.add(s.gameId);
    out.push(s);
  }
  return out;
}

export function gameStats(history: Session[], gameId: string) {
  const list = history.filter((s) => s.gameId === gameId);
  return {
    plays: list.length,
    totalSec: list.reduce((t, s) => t + s.durationSec, 0),
    last: list[0] ?? null,
  };
}

export function readBest(gameId: string): number | null {
  if (typeof window === "undefined") return null;
  return read<number | null>(`ogh:best:${gameId}`, null);
}

export function hasSavedProgress(gameId: string) {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(`ogh:save:${gameId}`) !== null;
  } catch {
    return false;
  }
}

export function formatDuration(sec: number) {
  if (sec < 60) return `${Math.max(1, Math.round(sec))}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ${Math.round(sec % 60)}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export function formatWhen(ts: number) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
