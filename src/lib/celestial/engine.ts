import type { SceneManager } from "./scene-manager";

export let engine: SceneManager | null = null;

export function setEngine(next: SceneManager | null): void {
  engine = next;
  if (typeof window !== "undefined") {
    (window as unknown as { __viz?: SceneManager | null }).__viz = next;
  }
}
