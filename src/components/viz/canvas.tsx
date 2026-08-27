import { useEffect, useRef, useState } from "react";
import { setEngine } from "@/lib/celestial/engine";
import { useVizStore } from "@/store/viz-store";

if (typeof document !== "undefined") {
  void import("@/lib/celestial/scene-manager");
  void import("@/lib/celestial/texture-pack").then((m) => m.prefetchTexturePack());
}

export function VizCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let raf = 0;
    let last = 0;
    let dispose: (() => void) | null = null;

    const mobile = (host.clientWidth || window.innerWidth) < 700;

    void Promise.all([
      import("@/lib/celestial/scene-manager"),
      import("@/lib/celestial/texture-pack").then((m) => m.loadTexturePack(mobile)),
    ])
      .then(([{ SceneManager }, pack]) => {
        if (cancelled || !host) {
          pack.dispose();
          return;
        }
        const next = new SceneManager(host, pack);
        dispose = () => {
          next.dispose();
          pack.dispose();
        };
        setEngine(next);

        useVizStore.setState(next.snapshot());

        const loop = (time: number) => {
          if (cancelled) return;
          if (time - last > 80) {
            last = time;
            useVizStore.setState(next.snapshot());
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      dispose?.();
      setEngine(null);
      useVizStore.setState({ ready: false });
    };
  }, []);

  return (
    <>
      <div
        ref={hostRef}
        className="absolute inset-0 bg-bg"
        data-hint="Click a world to select it. Two selected worlds can be woven into a string. Drag to orbit the camera."
      >
        <canvas className="block h-full w-full" aria-hidden="true" />
      </div>
      <div className="viz-vignette pointer-events-none absolute inset-0" />
      {failed ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg px-6 text-center">
          <p className="max-w-sm text-sm text-muted">
            This visualizer needs WebGL. Try another browser, or turn on hardware acceleration.
          </p>
        </div>
      ) : null}
    </>
  );
}
