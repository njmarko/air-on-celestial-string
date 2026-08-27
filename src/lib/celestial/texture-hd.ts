import * as THREE from "three";
import { configureTexture, type TexturePack } from "./texture-pack";

const CACHE = "sss-hires-v3";

/**
 * Highest Solar System Scope maps Wikimedia Commons actually hosts (CC BY 4.0).
 * Direct SSS downloads are captcha-gated. Use upload.wikimedia.org (CORS *),
 * not Special:FilePath (HTML redirects, no CORS). Uranus and Neptune have no
 * map larger than 2K on SSS — those stay on the bundled 2K files.
 */
export const HIRES_FILES: { key: string; url: string; label: string }[] = [
  {
    key: "saturnRing",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Solarsystemscope_texture_8k_saturn_ring_alpha.png",
    label: "Saturn rings 8K",
  },
  {
    key: "venusAtmosphere",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Solarsystemscope_texture_4k_venus_atmosphere.jpg",
    label: "Venus clouds 4K",
  },
  {
    key: "saturn",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_8k_saturn.jpg",
    label: "Saturn 8K",
  },
  {
    key: "earth",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg",
    label: "Earth 8K",
  },
  {
    key: "jupiter",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Solarsystemscope_texture_8k_jupiter.jpg",
    label: "Jupiter 8K",
  },
  {
    key: "sun",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Solarsystemscope_texture_8k_sun.jpg",
    label: "Sun 8K",
  },
  {
    key: "mars",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Solarsystemscope_texture_8k_mars.jpg",
    label: "Mars 8K",
  },
  {
    key: "earthClouds",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Solarsystemscope_texture_8k_earth_clouds.jpg",
    label: "Earth clouds 8K",
  },
  {
    key: "venus",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Solarsystemscope_texture_8k_venus_surface.jpg",
    label: "Venus 8K",
  },
  {
    key: "mercury",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Solarsystemscope_texture_8k_mercury.jpg",
    label: "Mercury 8K",
  },
  {
    key: "moon",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Solarsystemscope_texture_8k_moon.jpg",
    label: "Moon 8K",
  },
];

export const HIRES_TOTAL = HIRES_FILES.length;

function kindFor(key: string): "color" | "ring" | "sky" {
  if (key === "saturnRing") return "ring";
  if (key === "milkyway") return "sky";
  return "color";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBlob(url: string, signal?: AbortSignal): Promise<Blob> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    try {
      const response = await fetch(url, { mode: "cors", signal, credentials: "omit" });
      if (response.status === 429 || response.status === 503) {
        await sleep(500 * 2 ** attempt);
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const type = blob.type || "";
      if (blob.size < 4096) throw new Error("empty");
      if (type.startsWith("text/")) throw new Error("not-image");
      return blob;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("fetch");
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      await sleep(400 * 2 ** attempt);
    }
  }
  throw lastError ?? new Error("fetch");
}

async function blobToTexture(blob: Blob, maxSize: number, kind: "color" | "ring" | "sky"): Promise<THREE.Texture> {
  if (typeof createImageBitmap === "function") {
    let bitmap = await createImageBitmap(blob);
    if (bitmap.width > maxSize) {
      const width = maxSize;
      const height = Math.max(1, Math.round(bitmap.height * (maxSize / bitmap.width)));
      const resized = await createImageBitmap(bitmap, { resizeWidth: width, resizeHeight: height });
      bitmap.close();
      bitmap = resized;
    }
    const tex = new THREE.Texture(bitmap);
    tex.needsUpdate = true;
    return configureTexture(tex, kind);
  }

  const objectUrl = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      objectUrl,
      (tex) => {
        URL.revokeObjectURL(objectUrl);
        resolve(configureTexture(tex, kind));
      },
      undefined,
      () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("decode"));
      },
    );
  });
}

async function loadCachedImage(
  url: string,
  maxSize: number,
  kind: "color" | "ring" | "sky",
  signal?: AbortSignal,
): Promise<THREE.Texture> {
  const cache = await caches.open(CACHE);
  let response = await cache.match(url);
  if (!response?.ok) {
    const blob = await fetchBlob(url, signal);
    response = new Response(blob, {
      headers: { "Content-Type": blob.type || "image/jpeg", "Cache-Control": "max-age=31536000" },
    });
    try {
      await cache.put(url, response.clone());
    } catch {
      /* quota */
    }
  }
  const blob = await response.blob();
  if (blob.size < 4096) throw new Error("empty");
  return blobToTexture(blob, maxSize, kind);
}

export type HiResProgress = {
  key: string;
  label: string;
  tex: THREE.Texture | null;
  done: number;
  total: number;
  phase: "start" | "ok" | "fail";
};

export async function* fetchHiResMaps(
  maxSize = 8192,
  signal?: AbortSignal,
): AsyncGenerator<HiResProgress> {
  const total = HIRES_FILES.length;
  let done = 0;
  for (const entry of HIRES_FILES) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    yield { key: entry.key, label: entry.label, tex: null, done, total, phase: "start" };
    try {
      const tex = await loadCachedImage(entry.url, maxSize, kindFor(entry.key), signal);
      done += 1;
      yield { key: entry.key, label: entry.label, tex, done, total, phase: "ok" };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      done += 1;
      yield { key: entry.key, label: entry.label, tex: null, done, total, phase: "fail" };
    }
  }
}

export async function loadHiResPack(
  fallback: TexturePack,
  onProgress?: (done: number, total: number, label: string) => void,
  maxSize = 8192,
  signal?: AbortSignal,
): Promise<TexturePack> {
  const maps: Record<string, THREE.Texture> = { ...fallback.maps };
  for await (const step of fetchHiResMaps(maxSize, signal)) {
    if (step.tex) maps[step.key] = step.tex;
    onProgress?.(step.done, step.total, step.label);
  }
  return {
    maps,
    body(name: string) {
      const key = name.toLowerCase();
      if (key === "venus") return { map: maps.venus, atmosphere: maps.venusAtmosphere };
      if (key === "earth") return { map: maps.earth, clouds: maps.earthClouds };
      if (key === "saturn") return { map: maps.saturn, rings: maps.saturnRing };
      return { map: maps[key] };
    },
    dispose() {
      const keep = new Set(Object.values(fallback.maps));
      for (const tex of Object.values(maps)) {
        if (!keep.has(tex)) tex.dispose();
      }
    },
  };
}
