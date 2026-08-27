import { engine } from "@/lib/celestial/engine";
import { useVizStore } from "@/store/viz-store";

export function pushSnapshot(): void {
  if (engine) useVizStore.setState(engine.snapshot());
}

export function act(fn: (e: NonNullable<typeof engine>) => void): void {
  if (!engine) return;
  fn(engine);
  pushSnapshot();
}

export function isAudioFile(file: File): boolean {
  if (file.type.startsWith("audio/")) return true;
  return /\.(mp3|wav|ogg|flac|m4a|aac|webm|opus)$/i.test(file.name);
}
