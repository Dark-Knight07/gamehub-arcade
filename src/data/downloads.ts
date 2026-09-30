import manifest from "./downloads.generated.json";

type Manifest = Record<string, { file: string; bytes: number }>;
const files = manifest as Manifest;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Offline edition of any built-in game, with its real file size measured at build time. */
export function offlineEdition(id: string) {
  const entry = files[id];
  return entry ? { url: entry.file, size: formatBytes(entry.bytes) } : null;
}
