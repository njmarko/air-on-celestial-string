import { useEffect, useLayoutEffect, useRef, useState } from "react";

type HintState = {
  text: string;
  x: number;
  y: number;
  above: boolean;
};

const FIRST_DELAY = 450;
const NEXT_DELAY = 80;
const CHAIN_MS = 1400;

export function HintLayer() {
  const [hint, setHint] = useState<HintState | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef(0);
  const chainTimer = useRef(0);
  const lastAt = useRef(0);
  const chained = useRef(false);
  const current = useRef<Element | null>(null);

  useEffect(() => {
    const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hoverFine) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const read = (target: EventTarget | null): { el: Element; text: string } | null => {
      if (!(target instanceof Element)) return null;
      const el = target.closest("[data-hint]");
      if (!el) return null;
      const text = el.getAttribute("data-hint")?.trim();
      if (!text) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width * rect.height > window.innerWidth * window.innerHeight * 0.35) return null;
      return { el, text };
    };

    const hide = () => {
      current.current = null;
      setHint(null);
      window.clearTimeout(showTimer.current);
      window.clearTimeout(chainTimer.current);
      chainTimer.current = window.setTimeout(() => {
        chained.current = false;
      }, CHAIN_MS);
    };

    const place = (el: Element, text: string) => {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const spaceBelow = window.innerHeight - rect.bottom;
      const above = spaceBelow < 96 && rect.top > 96;
      const y = above ? rect.top - 8 : rect.bottom + 8;
      lastAt.current = performance.now();
      chained.current = true;
      setHint({ text, x, y, above });
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const found = read(event.target);
      if (!found) return;
      if (found.el === current.current) return;
      current.current = found.el;
      window.clearTimeout(showTimer.current);
      window.clearTimeout(chainTimer.current);
      const delay = reduced ? 0 : chained.current && performance.now() - lastAt.current < CHAIN_MS ? NEXT_DELAY : FIRST_DELAY;
      showTimer.current = window.setTimeout(() => place(found.el, found.text), delay);
    };

    const onOut = (event: PointerEvent) => {
      if (!current.current) return;
      const next = read(event.relatedTarget);
      if (next && next.el === current.current) return;
      hide();
    };

    const onDown = () => hide();
    const onKey = () => hide();
    const onScroll = () => hide();

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll, true);
      window.clearTimeout(showTimer.current);
      window.clearTimeout(chainTimer.current);
    };
  }, []);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !hint) return;
    const width = box.offsetWidth;
    const pad = 10;
    const half = width / 2;
    const x = Math.min(window.innerWidth - half - pad, Math.max(half + pad, hint.x));
    if (Math.abs(x - hint.x) > 0.5) setHint((current) => (current ? { ...current, x } : current));
  }, [hint]);

  if (!hint) return null;

  return (
    <div
      ref={boxRef}
      role="tooltip"
      className={`hud-hint ${hint.above ? "hud-hint-above" : "hud-hint-below"}`}
      style={{ left: hint.x, top: hint.y }}
    >
      {hint.text}
    </div>
  );
}
