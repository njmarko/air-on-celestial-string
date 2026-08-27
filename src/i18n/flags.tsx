import type { FlagCode } from "./catalog";

export function Flag({ code, className }: { code: FlagCode; className?: string }) {
  return (
    <svg
      viewBox="0 0 21 15"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {code === "gb" ? <UnionJack /> : code === "rs" ? <Serbia /> : <Unknown />}
    </svg>
  );
}

function Unknown() {
  return (
    <>
      <rect width="21" height="15" fill="#2a3140" />
      <rect x="2" y="2" width="17" height="11" fill="none" stroke="#8b96a8" strokeWidth="1" />
    </>
  );
}

function UnionJack() {
  return (
    <>
      <rect width="21" height="15" fill="#012169" />
      <path d="M0 0 L21 15 M21 0 L0 15" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 L21 15 M21 0 L0 15" stroke="#c8102e" strokeWidth="1.4" />
      <path d="M10.5 0 V15 M0 7.5 H21" stroke="#fff" strokeWidth="5" />
      <path d="M10.5 0 V15 M0 7.5 H21" stroke="#c8102e" strokeWidth="3" />
    </>
  );
}

function Serbia() {
  return (
    <>
      <rect width="21" height="15" fill="#c6363c" />
      <rect y="5" width="21" height="5" fill="#0c4076" />
      <rect y="10" width="21" height="5" fill="#fff" />
    </>
  );
}
