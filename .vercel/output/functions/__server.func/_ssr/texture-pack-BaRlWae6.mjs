import { u as __exportAll } from "./router-fV0YK9ce.mjs";
import { D as RepeatWrapping, I as TextureLoader, _ as LinearFilter, d as ClampToEdgeWrapping, k as SRGBColorSpace } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/texture-pack-BaRlWae6.js
var texture_pack_exports = /* @__PURE__ */ __exportAll({
	configureTexture: () => configureTexture,
	loadTexturePack: () => loadTexturePack,
	prefetchTexturePack: () => prefetchTexturePack,
	textureFiles: () => textureFiles
});
var BODY_FILES = {
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
	neptune: "/textures/2k_neptune.jpg"
};
var SKY_8K = "/textures/8k_stars_milky_way.jpg";
var SKY_2K = "/textures/2k_stars_milky_way.jpg";
function textureFiles(mobile = false) {
	return {
		...BODY_FILES,
		milkyway: mobile ? SKY_2K : SKY_8K
	};
}
Object.values(textureFiles(false));
function configureTexture(tex, kind) {
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 8;
	if (kind === "ring") {
		tex.wrapS = ClampToEdgeWrapping;
		tex.wrapT = ClampToEdgeWrapping;
		tex.generateMipmaps = false;
		tex.minFilter = LinearFilter;
		tex.magFilter = LinearFilter;
	} else if (kind === "sky") {
		tex.wrapS = RepeatWrapping;
		tex.wrapT = ClampToEdgeWrapping;
	} else {
		tex.wrapS = RepeatWrapping;
		tex.wrapT = ClampToEdgeWrapping;
	}
	tex.needsUpdate = true;
	return tex;
}
function prefetchTexturePack() {
	if (typeof document === "undefined") return;
	const mobile = window.innerWidth < 700;
	for (const url of Object.values(textureFiles(mobile))) {
		const img = new Image();
		img.decoding = "async";
		img.src = url;
	}
}
function loadTexturePack(mobile = false) {
	const loader = new TextureLoader();
	const maps = {};
	const files = textureFiles(mobile);
	return Promise.all(Object.entries(files).map(([key, url]) => new Promise((resolve) => {
		loader.load(url, (tex) => {
			maps[key] = configureTexture(tex, key === "saturnRing" ? "ring" : key === "milkyway" ? "sky" : "color");
			resolve();
		}, void 0, () => resolve());
	}))).then(() => ({
		maps,
		body(name) {
			const key = name.toLowerCase();
			if (key === "venus") return {
				map: maps.venus,
				atmosphere: maps.venusAtmosphere
			};
			if (key === "earth") return {
				map: maps.earth,
				clouds: maps.earthClouds
			};
			if (key === "saturn") return {
				map: maps.saturn,
				rings: maps.saturnRing
			};
			return { map: maps[key] };
		},
		dispose() {
			for (const tex of Object.values(maps)) tex.dispose();
		}
	}));
}
//#endregion
export { texture_pack_exports as n, configureTexture as t };
