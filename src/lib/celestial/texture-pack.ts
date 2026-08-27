import * as THREE from "three";

const BODY_FILES: Record<string, string> = {
  sun: "/textures/2k_sun.jpg",
  mercury: "/textures/2k_mercury.jpg",
  venus: "/textures/2k_venus_surface.jpg",
  venusAtmosphere: "/textures/2k_venus_atmosphere.jpg",
  earth: "/textures/2k_earth_daymap.jpg",
  earthClouds: "/textures/2k_earth_clouds.jpg",
  moon: "/textures/2k_moon.jpg",
  mars: "/textures/2k_mars.jpg",
  jupiter: "/textures/2k_jupiter.jpg",
  saturn: "/textures/2k_saturn.jpg",
  saturnRing: "/textures/2k_saturn_ring_alpha.png",
  uranus: "/textures/2k_uranus.jpg",
  neptune: "/textures/2k_neptune.jpg",
};

const SKY_8K = "/textures/8k_stars_milky_way.jpg";
const SKY_2K = "/textures/2k_stars_milky_way.jpg";

export function textureFiles(mobile = false): Record<string, string> {
  return { ...BODY_FILES, milkyway: mobile ? SKY_2K : SKY_8K };
}

export const TEXTURE_URLS = Object.values(textureFiles(false));

export type BodyTextures = {
  map?: THREE.Texture;
  clouds?: THREE.Texture;
  atmosphere?: THREE.Texture;
  rings?: THREE.Texture;
};

export type TexturePack = {
  maps: Record<string, THREE.Texture>;
  body(name: string): BodyTextures;
  dispose(): void;
};

export function configureTexture(tex: THREE.Texture, kind: "color" | "ring" | "sky"): THREE.Texture {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (kind === "ring") {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
  } else if (kind === "sky") {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
  } else {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
  }
  tex.needsUpdate = true;
  return tex;
}

export function prefetchTexturePack(): void {
  if (typeof document === "undefined") return;
  const mobile = window.innerWidth < 700;
  for (const url of Object.values(textureFiles(mobile))) {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
}

export function loadTexturePack(mobile = false): Promise<TexturePack> {
  const loader = new THREE.TextureLoader();
  const maps: Record<string, THREE.Texture> = {};
  const files = textureFiles(mobile);

  return Promise.all(
    Object.entries(files).map(
      ([key, url]) =>
        new Promise<void>((resolve) => {
          loader.load(
            url,
            (tex) => {
              const kind = key === "saturnRing" ? "ring" : key === "milkyway" ? "sky" : "color";
              maps[key] = configureTexture(tex, kind);
              resolve();
            },
            undefined,
            () => resolve(),
          );
        }),
    ),
  ).then(() => ({
    maps,
    body(name: string): BodyTextures {
      const key = name.toLowerCase();
      if (key === "venus") return { map: maps.venus, atmosphere: maps.venusAtmosphere };
      if (key === "earth") return { map: maps.earth, clouds: maps.earthClouds };
      if (key === "saturn") return { map: maps.saturn, rings: maps.saturnRing };
      return { map: maps[key] };
    },
    dispose() {
      for (const tex of Object.values(maps)) tex.dispose();
    },
  }));
}
