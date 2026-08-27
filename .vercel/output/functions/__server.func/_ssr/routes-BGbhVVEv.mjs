import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ListMusic, a as Upload, c as Square, d as Pause, f as Orbit, g as Lock, h as Maximize2, i as Video, l as Plus, m as Minus, n as VolumeX, p as Music, r as Volume2, s as Trash2, t as X, u as Play, v as Eye, y as EyeOff } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BGbhVVEv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Real performances, not MIDI. Compositions are public domain;
* recordings are CC0, CC BY-SA, U.S. government, or Musopen PD.
*/
var LIBRARY = [
	{
		id: "danube",
		title: "The Blue Danube",
		composer: "Johann Strauss II",
		detail: "Op. 314 · orchestra",
		src: "/audio/strauss-blue-danube.mp3",
		credit: "Musopen · CC0"
	},
	{
		id: "nachtmusik",
		title: "Eine kleine Nachtmusik",
		composer: "W. A. Mozart",
		detail: "K. 525 · I. Allegro",
		src: "/audio/mozart-kleine-nachtmusik.mp3",
		credit: "Advent Chamber Orchestra · CC BY-SA"
	},
	{
		id: "air",
		title: "Air on the G String",
		composer: "J. S. Bach",
		detail: "from Orchestral Suite No. 3",
		src: "/audio/bach-air-on-the-g-string.mp3",
		credit: "U.S. Air Force Band · public domain"
	},
	{
		id: "moonlight",
		title: "Moonlight Sonata",
		composer: "Ludwig van Beethoven",
		detail: "Op. 27 No. 2 · I. Adagio",
		src: "/audio/beethoven-moonlight.mp3",
		credit: "Paul Pitman / Musopen · public domain"
	}
];
function libraryTrack(id) {
	return LIBRARY.find((track) => track.id === id);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}
var ASPECT = {
	"16:9": 16 / 9,
	"9:16": 9 / 16,
	"1:1": 1,
	"4:3": 4 / 3
};
var VIDEO_ASPECTS = [
	{
		id: "16:9",
		label: "16:9",
		hint: "Widescreen — the usual desktop frame."
	},
	{
		id: "9:16",
		label: "9:16",
		hint: "Tall frame for stories and phones."
	},
	{
		id: "1:1",
		label: "1:1",
		hint: "Square frame."
	},
	{
		id: "4:3",
		label: "4:3",
		hint: "Classic 4:3 frame."
	}
];
var VIDEO_QUALITIES = [
	{
		id: "720",
		label: "720",
		hint: "720 along the short edge. Lighter file."
	},
	{
		id: "1080",
		label: "1080",
		hint: "1080 along the short edge. Default."
	},
	{
		id: "1440",
		label: "1440",
		hint: "1440 along the short edge. Heavier file."
	}
];
function exportSize(aspect, quality) {
	const long = quality === "720" ? 1280 : quality === "1440" ? 2560 : 1920;
	const ratio = ASPECT[aspect];
	let width;
	let height;
	if (ratio >= 1) {
		width = long;
		height = Math.round(long / ratio);
	} else {
		height = long;
		width = Math.round(long * ratio);
	}
	width = Math.round(width / 2) * 2;
	height = Math.round(height / 2) * 2;
	return {
		width,
		height
	};
}
function pickRecorderMime(withAudio) {
	const mp4 = withAudio ? [
		`video/mp4;codecs="avc1.640028,mp4a.40.2"`,
		`video/mp4;codecs="avc1.4d0028,mp4a.40.2"`,
		`video/mp4;codecs="avc1.42E01E,mp4a.40.2"`,
		"video/mp4;codecs=avc1.640028,mp4a.40.2",
		"video/mp4;codecs=avc1.42E01E,mp4a.40.2",
		"video/mp4"
	] : [
		`video/mp4;codecs="avc1.640028"`,
		`video/mp4;codecs="avc1.42E01E"`,
		"video/mp4;codecs=avc1.42E01E",
		"video/mp4"
	];
	const webm = withAudio ? [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8,opus",
		"video/webm"
	] : [
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8",
		"video/webm"
	];
	if (typeof MediaRecorder !== "undefined") {
		for (const mime of mp4) if (MediaRecorder.isTypeSupported(mime)) return {
			mime,
			ext: "mp4"
		};
		for (const mime of webm) if (MediaRecorder.isTypeSupported(mime)) return {
			mime,
			ext: "webm"
		};
	}
	return {
		mime: "",
		ext: "webm"
	};
}
function videoBitrate(width, height) {
	return Math.min(24e6, Math.max(5e6, width * height * 4));
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.rel = "noopener";
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function stampFilename(ext, title = "celestial-strings") {
	const safe = title.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "celestial-strings";
	const now = /* @__PURE__ */ new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${safe}-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.${ext}`;
}
var CaptureSession = class {
	running = false;
	startedAt = 0;
	ext = "mp4";
	mime = "";
	note = "";
	recorder = null;
	chunks = [];
	canvasStream = null;
	start(canvas, audioStream, width, height, fps = 30) {
		if (typeof MediaRecorder === "undefined") {
			this.note = "This browser cannot record video.";
			return false;
		}
		let canvasStream;
		try {
			canvasStream = canvas.captureStream(fps);
		} catch {
			this.note = "Could not capture the sky — the canvas is protected.";
			return false;
		}
		const videoTrack = canvasStream.getVideoTracks()[0];
		if (!videoTrack) {
			this.note = "Could not capture the sky.";
			return false;
		}
		if ("contentHint" in videoTrack) videoTrack.contentHint = "detail";
		const tracks = [videoTrack];
		for (const track of audioStream.getAudioTracks()) if (track.readyState === "live") tracks.push(track);
		const mixed = new MediaStream(tracks);
		const recorder = createRecorder(mixed, width, height, mixed.getAudioTracks().length > 0);
		if (!recorder) {
			videoTrack.stop();
			this.note = "This browser cannot record video.";
			return false;
		}
		this.canvasStream = canvasStream;
		this.recorder = recorder;
		this.chunks = [];
		this.ext = mimeExt(recorder.mimeType);
		this.mime = recorder.mimeType || (this.ext === "mp4" ? "video/mp4" : "video/webm");
		this.note = this.ext === "mp4" ? "MP4" : "WebM — this browser encodes WebM, not MP4";
		this.startedAt = performance.now();
		this.running = true;
		recorder.ondataavailable = (event) => {
			if (event.data && event.data.size > 0) this.chunks.push(event.data);
		};
		try {
			if (this.ext === "mp4") recorder.start();
			else recorder.start(1e3);
		} catch {
			this.cleanupTracks();
			this.running = false;
			this.note = "Could not start the recorder.";
			return false;
		}
		return true;
	}
	elapsedSeconds() {
		if (!this.running) return 0;
		return (performance.now() - this.startedAt) / 1e3;
	}
	stop() {
		const recorder = this.recorder;
		if (!recorder) {
			this.running = false;
			this.cleanupTracks();
			return Promise.resolve(null);
		}
		return new Promise((resolve) => {
			const finish = () => {
				this.running = false;
				this.recorder = null;
				this.cleanupTracks();
				if (this.chunks.length === 0) {
					resolve(null);
					return;
				}
				const mime = this.mime || (this.ext === "mp4" ? "video/mp4" : "video/webm");
				resolve({
					blob: new Blob(this.chunks, { type: mime }),
					ext: this.ext,
					mime
				});
			};
			recorder.onstop = finish;
			recorder.onerror = () => finish();
			try {
				if (recorder.state === "recording") {
					try {
						recorder.requestData();
					} catch {}
					recorder.stop();
				} else finish();
			} catch {
				finish();
			}
		});
	}
	cleanupTracks() {
		this.canvasStream?.getVideoTracks().forEach((track) => track.stop());
		this.canvasStream = null;
	}
};
function mimeExt(mime) {
	return mime.includes("mp4") ? "mp4" : "webm";
}
function createRecorder(stream, width, height, hasAudio) {
	const picked = pickRecorderMime(hasAudio);
	const bitrate = videoBitrate(width, height);
	const attempts = [];
	if (picked.mime) {
		const withRates = {
			mimeType: picked.mime,
			videoBitsPerSecond: bitrate
		};
		if (hasAudio) withRates.audioBitsPerSecond = 192e3;
		attempts.push(withRates);
		attempts.push({ mimeType: picked.mime });
	}
	attempts.push({ videoBitsPerSecond: bitrate });
	attempts.push({});
	for (const options of attempts) try {
		return new MediaRecorder(stream, options);
	} catch {}
	return null;
}
var engine = null;
function setEngine(next) {
	engine = next;
	if (typeof window !== "undefined") window.__viz = next;
}
var quietBand = {
	enabled: true,
	sensitivity: 1.8,
	energy: 0,
	locked: false,
	playing: false,
	readiness: 0,
	weaveRate: 0
};
var initialSnapshot = {
	ready: false,
	fps: 60,
	paused: false,
	uiHidden: false,
	speed: 1,
	spinFactor: .01,
	linesPerSec: 6,
	maxWeave: 14,
	trailDuration: 40,
	orbitMode: "realistic",
	background: "milkyway",
	parallax: true,
	ambient: 1,
	bloom: .02,
	ringBrightness: 1.4,
	selectedCount: 0,
	canCreate: false,
	hiRes: true,
	hiResNote: "Fetching ultra maps…",
	autoOrbit: false,
	autoOrbitSpeed: .5,
	autoOrbitDir: "ccw",
	recording: false,
	recordElapsed: 0,
	recordNote: "",
	recordFormat: "",
	videoAspect: "16:9",
	videoQuality: "1080",
	bodies: [],
	connections: [],
	audio: {
		trackName: "No track loaded",
		trackId: "",
		hasTrack: false,
		playing: false,
		muted: false,
		current: 0,
		duration: 0,
		volume: .8,
		rate: 1,
		rhythmEnabled: true,
		rhythmMode: "advanced",
		autoMix: true,
		mixStatus: "idle",
		mixNote: "",
		mixVoice: "",
		bands: {
			bass: {
				...quietBand,
				sensitivity: 1.8
			},
			mid: {
				...quietBand,
				sensitivity: 1.7
			},
			high: {
				...quietBand,
				sensitivity: 2.1
			}
		}
	}
};
var useVizStore = create(() => initialSnapshot);
if (typeof document !== "undefined") {
	import("./scene-manager-Bl42Kj7_.mjs");
	import("./texture-pack-BaRlWae6.mjs").then((n) => n.n).then((m) => m.prefetchTexturePack());
}
function VizCanvas() {
	const hostRef = (0, import_react.useRef)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		if (!host) return;
		let cancelled = false;
		let raf = 0;
		let last = 0;
		let dispose = null;
		const mobile = (host.clientWidth || window.innerWidth) < 700;
		Promise.all([import("./scene-manager-Bl42Kj7_.mjs"), import("./texture-pack-BaRlWae6.mjs").then((n) => n.n).then((m) => m.loadTexturePack(mobile))]).then(([{ SceneManager }, pack]) => {
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
			const loop = (time) => {
				if (cancelled) return;
				if (time - last > 80) {
					last = time;
					useVizStore.setState(next.snapshot());
				}
				raf = requestAnimationFrame(loop);
			};
			raf = requestAnimationFrame(loop);
		}).catch(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: hostRef,
			className: "absolute inset-0 bg-bg",
			"data-hint": "Click a world to select it. Two selected worlds can be woven into a string. Drag to orbit the camera.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				className: "block h-full w-full",
				"aria-hidden": "true"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "viz-vignette pointer-events-none absolute inset-0" }),
		failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-20 flex items-center justify-center bg-bg px-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted",
				children: "This visualizer needs WebGL. Try another browser, or turn on hardware acceleration."
			})
		}) : null
	] });
}
function pushSnapshot() {
	if (engine) useVizStore.setState(engine.snapshot());
}
function act(fn) {
	if (!engine) return;
	fn(engine);
	pushSnapshot();
}
function isAudioFile(file) {
	if (file.type.startsWith("audio/")) return true;
	return /\.(mp3|wav|ogg|flac|m4a|aac|webm|opus)$/i.test(file.name);
}
var FIRST_DELAY = 450;
var NEXT_DELAY = 80;
var CHAIN_MS = 1400;
function HintLayer() {
	const [hint, setHint] = (0, import_react.useState)(null);
	const boxRef = (0, import_react.useRef)(null);
	const showTimer = (0, import_react.useRef)(0);
	const chainTimer = (0, import_react.useRef)(0);
	const lastAt = (0, import_react.useRef)(0);
	const chained = (0, import_react.useRef)(false);
	const current = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const read = (target) => {
			if (!(target instanceof Element)) return null;
			const el = target.closest("[data-hint]");
			if (!el) return null;
			const text = el.getAttribute("data-hint")?.trim();
			if (!text) return null;
			const rect = el.getBoundingClientRect();
			if (rect.width * rect.height > window.innerWidth * window.innerHeight * .35) return null;
			return {
				el,
				text
			};
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
		const place = (el, text) => {
			const rect = el.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const above = window.innerHeight - rect.bottom < 96 && rect.top > 96;
			const y = above ? rect.top - 8 : rect.bottom + 8;
			lastAt.current = performance.now();
			chained.current = true;
			setHint({
				text,
				x,
				y,
				above
			});
		};
		const onOver = (event) => {
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
		const onOut = (event) => {
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
	(0, import_react.useLayoutEffect)(() => {
		const box = boxRef.current;
		if (!box || !hint) return;
		const width = box.offsetWidth;
		const pad = 10;
		const half = width / 2;
		const x = Math.min(window.innerWidth - half - pad, Math.max(half + pad, hint.x));
		if (Math.abs(x - hint.x) > .5) setHint((current) => current ? {
			...current,
			x
		} : current);
	}, [hint]);
	if (!hint) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: boxRef,
		role: "tooltip",
		className: `hud-hint ${hint.above ? "hud-hint-above" : "hud-hint-below"}`,
		style: {
			left: hint.x,
			top: hint.y
		},
		children: hint.text
	});
}
function TrackList({ activeId, onPick, onAdd, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [LIBRARY.map((track) => {
			const active = track.id === activeId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-hint": `Play ${track.title} by ${track.composer}. ${track.credit}.`,
				onClick: () => onPick(track.id),
				className: cn("flex w-full items-center gap-3 rounded-lg px-3 text-left transition-colors duration-150", compact ? "h-11" : "h-12", active ? "bg-primary/15 text-fg" : "text-fg hover:bg-fg/10"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, {
					className: "size-4 shrink-0 text-muted",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-sm",
						children: track.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block truncate text-xs text-faint",
						children: [track.composer, compact ? "" : ` · ${track.detail}`]
					})]
				})]
			}, track.id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"data-hint": "Open a file from your device — MP3, WAV, FLAC, and similar.",
			onClick: onAdd,
			className: cn("flex w-full items-center gap-3 rounded-lg px-3 text-left text-fg transition-colors duration-150 hover:bg-fg/10", compact ? "h-11" : "h-12"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
				className: "size-4 shrink-0 text-muted",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "Add a track"
			})]
		})]
	});
}
function IconBtn({ label, hint, onClick, active, disabled, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		"data-hint": hint ?? label,
		disabled,
		onClick,
		className: cn("inline-flex size-11 shrink-0 items-center justify-center rounded-md text-fg", "transition-colors duration-150", "hover:bg-fg/10 disabled:pointer-events-none disabled:opacity-40", active && "bg-fg/10 text-primary", className),
		children
	});
}
function Panel({ title, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("panel rounded-2xl p-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 px-1 font-display text-lg font-medium tracking-tight text-fg",
			children: title
		}), children]
	});
}
function RangeField({ label, hint, value, min, max, step, onChange, display }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block py-1",
		"data-hint": hint ?? label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-2 flex items-baseline justify-between gap-3 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-faint",
				children: display ?? value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			className: "hud-range",
			min,
			max,
			step,
			value,
			"aria-label": label,
			onChange: (event) => onChange(Number(event.target.value))
		})]
	});
}
function Segmented({ label, hint, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex rounded-lg bg-surface-2 p-1",
			children: options.map((option) => {
				const selected = option.id === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-hint": option.hint ?? hint ?? `${label}: ${option.label}`,
					onClick: () => onChange(option.id),
					className: cn("h-9 min-w-0 flex-1 rounded-md px-2 text-xs font-medium transition-colors duration-150", selected ? "bg-fg text-bg" : "text-muted hover:text-fg"),
					children: option.label
				}, option.id);
			})
		})]
	});
}
function ToggleRow({ label, hint, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		"data-hint": hint ?? label,
		onClick: () => onChange(!checked),
		className: "flex h-11 w-full items-center justify-between rounded-lg px-2 text-sm text-fg hover:bg-fg/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-6 w-10 rounded-full p-0.5 transition-colors duration-150", checked ? "bg-primary" : "bg-fg/15"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-5 rounded-full transition-transform duration-150", checked ? "translate-x-4 bg-primary-fg" : "translate-x-0 bg-fg") })
		})]
	});
}
function MakerCredit({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cn("text-xs tracking-wide text-muted", className),
		children: [
			"Made by Marko Njegomir",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://x.com/njmarko",
				target: "_blank",
				rel: "noopener noreferrer",
				"data-hint": "Open Marko Njegomir on X.",
				className: "inline-flex h-6 items-center text-fg underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-primary hover:decoration-primary",
				children: "@njmarko"
			}),
			" ",
			"with Grok"
		]
	});
}
function IntroCard({ onOpenFile, visible, ready }) {
	if (!visible) return null;
	const play = (id) => act((engine) => {
		engine.loadLibrary(id);
		engine.playAudio();
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "intro-card pointer-events-auto max-h-dvh w-full max-w-lg overflow-y-auto rounded-3xl p-6 md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-center text-xs font-medium tracking-widest text-muted uppercase",
					children: "A living orrery"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-center text-5xl leading-tight font-medium tracking-tight text-fg md:text-6xl",
					children: [
						"Air ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-primary italic",
							children: "on"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Celestial Strings"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MakerCredit, { className: "mt-3 text-center" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-muted",
					children: "Real performances of Strauss, Mozart, Bach, and Beethoven — or add your own. Frequency bands stretch glowing strings between the worlds."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-2xl bg-surface-2/80 p-2",
					children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackList, {
						onPick: play,
						onAdd: onOpenFile
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-4 text-center text-sm text-muted",
						children: "Lighting the worlds…"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-center text-xs text-faint",
					children: "Click two planets, then Weave. Space plays. H hides the chrome. Hover any control for a hint."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-xs text-faint",
					children: "Worlds: Solar System Scope maps, CC BY 4.0 — the highest published size downloads in the background on first visit. Recordings: Musopen, Advent Chamber Orchestra, U.S. Air Force Band."
				})
			]
		})
	});
}
function ExportFields({ onStart }) {
	const aspect = useVizStore((s) => s.videoAspect);
	const quality = useVizStore((s) => s.videoQuality);
	const recording = useVizStore((s) => s.recording);
	const recordNote = useVizStore((s) => s.recordNote);
	const size = exportSize(aspect, quality);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				label: "Frame",
				value: aspect,
				options: VIDEO_ASPECTS,
				onChange: (value) => act((engine) => engine.setVideoAspect(value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				label: "Resolution",
				value: quality,
				options: VIDEO_QUALITIES,
				onChange: (value) => act((engine) => engine.setVideoQuality(value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-1 text-xs tabular-nums text-faint",
				children: [
					size.width,
					" × ",
					size.height
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 text-xs leading-relaxed text-faint",
				children: "Only the sky is saved — menus and the cursor stay out of the file. Drag to orbit while it records. MP4 when this browser can encode it."
			}),
			recordNote && !recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 text-xs leading-relaxed text-muted",
				children: recordNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: recording,
				"data-hint": "Start capturing the orrery and the music that is playing. Menus are not recorded.",
				className: "flex h-11 w-full items-center justify-center rounded-lg bg-fg text-sm font-medium text-bg hover:bg-fg/90 disabled:opacity-40",
				onClick: () => {
					onStart?.();
					act((engine) => engine.startRecording());
				},
				children: "Start recording"
			})
		]
	});
}
function RecPill() {
	const recording = useVizStore((s) => s.recording);
	const elapsed = useVizStore((s) => s.recordElapsed);
	const format = useVizStore((s) => s.recordFormat);
	const autoOrbit = useVizStore((s) => s.autoOrbit);
	const aspect = useVizStore((s) => s.videoAspect);
	const quality = useVizStore((s) => s.videoQuality);
	if (!recording) return null;
	const size = exportSize(aspect, quality);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay-safe pointer-events-none absolute inset-0 z-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto absolute top-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-surface px-2 py-1 shadow-panel ring-1 ring-border-strong",
			"data-hint": "Recording the sky and the music. Menus and the cursor stay out of the file. Drag to orbit. Escape stops.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rec-dot mx-1 size-2.5 shrink-0 rounded-full bg-danger" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-1 font-mono text-xs tabular-nums text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 font-sans font-medium tracking-wider text-danger",
							children: "REC"
						}),
						formatTime(elapsed),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-faint",
							children: [
								format || "MP4",
								" · ",
								size.width,
								"×",
								size.height
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-hint": autoOrbit ? "Stop circling the sun. You can still drag the camera." : "Let the camera slowly circle the sun. You can still drag to look around.",
					onClick: () => act((engine) => engine.setAutoOrbit(!autoOrbit)),
					className: `h-9 rounded-md px-2.5 text-xs font-medium ${autoOrbit ? "bg-fg/10 text-primary" : "text-muted hover:bg-fg/10 hover:text-fg"}`,
					children: "Circle"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Stop recording",
					hint: "Stop and download the video with the music.",
					className: "size-9 text-danger",
					onClick: () => act((engine) => void engine.stopRecording()),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
						className: "size-3.5 fill-current",
						strokeWidth: 1.5
					})
				})
			]
		})
	});
}
function CircleCameraSection() {
	const autoOrbit = useVizStore((s) => s.autoOrbit);
	const speed = useVizStore((s) => s.autoOrbitSpeed);
	const dir = useVizStore((s) => s.autoOrbitDir);
	const period = Math.round(60 / Math.max(.05, speed));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				label: "Circle camera",
				hint: "Orbit the camera around the sun. You can still drag to look around. Works while recording.",
				checked: autoOrbit,
				onChange: (value) => act((engine) => engine.setAutoOrbit(value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				label: "Circle direction",
				value: dir,
				options: [{
					id: "ccw",
					label: "CCW",
					hint: "Counter-clockwise around the sun, looking down from above."
				}, {
					id: "cw",
					label: "CW",
					hint: "Clockwise around the sun, looking down from above."
				}],
				onChange: (value) => act((engine) => engine.setAutoOrbitDir(value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
				label: "Circle speed",
				hint: "How fast the camera circles the sun. 0.50 is a slow two-minute orbit.",
				min: .15,
				max: 2.5,
				step: .05,
				value: speed,
				display: `${speed.toFixed(2)} · ${period}s / orbit`,
				onChange: (value) => act((engine) => engine.setAutoOrbitSpeed(value))
			})
		]
	});
}
var CHANNELS = [
	{
		id: "bass",
		label: "Bass",
		hint: "This string listens to the bass — left-hand piano, cellos, low notes.",
		tone: "data-[on=true]:bg-bass data-[on=true]:text-primary-fg"
	},
	{
		id: "mid",
		label: "Mids",
		hint: "This string listens to the mids — inner voices and the middle of the keyboard.",
		tone: "data-[on=true]:bg-mid data-[on=true]:text-primary-fg"
	},
	{
		id: "high",
		label: "Treble",
		hint: "This string listens to the treble — right-hand melody, violins, sparkle.",
		tone: "data-[on=true]:bg-high data-[on=true]:text-primary-fg"
	},
	{
		id: "all",
		label: "All",
		hint: "This string listens to the whole mix.",
		tone: "data-[on=true]:bg-fg data-[on=true]:text-bg"
	}
];
function WorldsPanel() {
	const bodies = useVizStore((s) => s.bodies);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Worlds",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "hud-scroll max-h-64 space-y-0.5 overflow-y-auto pr-1",
			children: bodies.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex h-11 items-center gap-1 rounded-lg px-1 ${body.selected ? "bg-primary/15" : "hover:bg-fg/10"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: body.visible ? `Hide ${body.name}` : `Show ${body.name}`,
						hint: body.visible ? `Hide ${body.name} and its orbit from the sky.` : `Show ${body.name} again.`,
						className: "size-9",
						onClick: () => act((engine) => engine.setBodyVisibility(body.name, !body.visible)),
						children: body.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
							className: "size-3.5",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
							className: "size-3.5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-w-0 flex-1 truncate px-1 text-left text-sm",
						"data-hint": `Select ${body.name}. Choose two worlds, then weave a string between them.`,
						onClick: () => act((engine) => engine.toggleSelectionByName(body.name)),
						children: body.name
					}),
					body.hasPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "color",
						"aria-label": `${body.name} orbit color`,
						"data-hint": `Color of ${body.name}'s orbit path.`,
						value: body.pathColor,
						className: "size-7 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent",
						onChange: (event) => act((engine) => engine.setPlanetPathColor(body.name, event.target.value))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-7" })
				]
			}) }, body.name))
		})
	});
}
function StringsPanel() {
	const connections = useVizStore((s) => s.connections);
	const canCreate = useVizStore((s) => s.canCreate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "Strings",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: !canCreate,
			"data-hint": canCreate ? "Stretch a glowing string between the two selected worlds." : "Select two worlds first — click them in the sky or in Worlds.",
			onClick: () => act((engine) => engine.createConnection()),
			className: "mb-2 flex h-10 w-full items-center justify-center rounded-lg bg-fg/10 text-xs font-medium text-fg hover:bg-fg/15 disabled:opacity-40",
			children: "Weave selected worlds"
		}), connections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-1 py-3 text-xs text-faint",
			children: "No strings yet. Select two worlds to weave."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "hud-scroll max-h-72 space-y-1 overflow-y-auto pr-1",
			children: connections.map((conn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-lg bg-surface-2/80 px-1.5 py-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1 truncate px-1 text-xs text-fg",
								children: [
									conn.a,
									" · ",
									conn.b
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								"aria-label": "String color",
								"data-hint": "Color of this string.",
								value: conn.color,
								className: "size-7 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent",
								onChange: (event) => act((engine) => engine.setConnectionColor(conn.id, event.target.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: conn.visible ? "Hide string" : "Show string",
								hint: conn.visible ? "Hide this string without removing it." : "Show this string again.",
								className: "size-8",
								onClick: () => act((engine) => engine.setConnectionVisibility(conn.id, !conn.visible)),
								children: conn.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
									className: "size-3.5",
									strokeWidth: 1.75
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
									className: "size-3.5",
									strokeWidth: 1.75
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Remove string",
								hint: "Cut this string and its trail.",
								className: "size-8 text-danger",
								onClick: () => act((engine) => engine.removeConnection(conn.id)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-3.5",
									strokeWidth: 1.75
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 px-1 text-xs text-muted",
						children: "Channel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 grid grid-cols-4 gap-1 px-1",
						children: CHANNELS.map((channel) => {
							const on = conn.rhythmType === channel.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-on": on,
								"data-hint": channel.hint,
								"aria-pressed": on,
								onClick: () => act((engine) => engine.setConnectionRhythmType(conn.id, channel.id)),
								className: cn("h-8 rounded-md text-xs font-medium transition-colors duration-150", "bg-fg/10 text-muted hover:text-fg", channel.tone),
								children: channel.label
							}, channel.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex items-center gap-1 px-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 20,
								max: 12e3,
								step: 10,
								"aria-label": "Low frequency",
								"data-hint": "Lowest frequency this string listens to, in Hertz.",
								value: conn.minFreq,
								className: "hud-select h-8 w-16 rounded-sm px-1 text-xs tabular-nums",
								onChange: (event) => {
									const min = Number(event.target.value);
									if (!Number.isFinite(min)) return;
									act((engine) => engine.setConnectionFreq(conn.id, min, conn.maxFreq));
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-faint",
								children: "–"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 20,
								max: 12e3,
								step: 10,
								"aria-label": "High frequency",
								"data-hint": "Highest frequency this string listens to, in Hertz.",
								value: conn.maxFreq,
								className: "hud-select h-8 w-16 rounded-sm px-1 text-xs tabular-nums",
								onChange: (event) => {
									const max = Number(event.target.value);
									if (!Number.isFinite(max)) return;
									act((engine) => engine.setConnectionFreq(conn.id, conn.minFreq, max));
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-faint",
								children: "Hz"
							}),
							conn.rhythmType === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto text-xs text-faint",
								children: "Custom"
							}) : null
						]
					})
				]
			}, conn.id))
		})]
	});
}
function MixPanel({ onRecordStart }) {
	const audio = useVizStore((s) => s.audio);
	const speed = useVizStore((s) => s.speed);
	const spinFactor = useVizStore((s) => s.spinFactor);
	const linesPerSec = useVizStore((s) => s.linesPerSec);
	const maxWeave = useVizStore((s) => s.maxWeave);
	const trailDuration = useVizStore((s) => s.trailDuration);
	const orbitMode = useVizStore((s) => s.orbitMode);
	const background = useVizStore((s) => s.background);
	const parallax = useVizStore((s) => s.parallax);
	const ambient = useVizStore((s) => s.ambient);
	const bloom = useVizStore((s) => s.bloom);
	const ringBrightness = useVizStore((s) => s.ringBrightness);
	const hiRes = useVizStore((s) => s.hiRes);
	const hiResNote = useVizStore((s) => s.hiResNote);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Mix",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud-scroll mix-scroll space-y-3 overflow-y-auto pr-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Hear the rhythm",
					hint: "When on, the music weaves the strings. When off, they idle at a steady pace.",
					checked: audio.rhythmEnabled,
					onChange: (value) => act((engine) => engine.setRhythmEnabled(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					label: "Onset",
					value: audio.rhythmMode,
					options: [{
						id: "advanced",
						label: "Onsets",
						hint: "Attacks add extra strands. Loudness of each band still sets how fast they keep drawing."
					}, {
						id: "simple",
						label: "Threshold",
						hint: "Loudness of each band sets how fast its strings draw. Below the floor they stop."
					}],
					onChange: (value) => act((engine) => engine.setRhythmMode(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Auto mix",
					hint: "Scan the recording for large sections. Park each band just above its quiet floor so single notes weave, then go silent between them. Drive how fast they draw from how busy the section is. Drag a slider to lock it.",
					checked: audio.autoMix,
					onChange: (value) => act((engine) => engine.setAutoMix(value))
				}),
				audio.mixNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "-mt-2 px-2 text-xs leading-relaxed text-faint",
					children: audio.mixNote
				}) : null,
				audio.mixVoice && audio.mixStatus === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "-mt-1 rounded-lg bg-surface-2/70 px-2 py-2",
					"data-hint": "What this section of the recording is doing. Bass follows the left hand and low notes; treble follows melody and the right hand.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted uppercase",
							children: "This section"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-snug text-fg",
							children: audio.mixVoice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceChip, {
									label: "Bass",
									on: audio.bands.bass.playing,
									tone: "bg-bass text-primary-fg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceChip, {
									label: "Mids",
									on: audio.bands.mid.playing,
									tone: "bg-mid text-primary-fg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceChip, {
									label: "Treble",
									on: audio.bands.high.playing,
									tone: "bg-high text-primary-fg"
								})
							]
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandRow, {
					band: "bass",
					label: "Bass"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandRow, {
					band: "mid",
					label: "Mids"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandRow, {
					band: "high",
					label: "Treble"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Orbit speed",
					hint: "How fast the planets travel. 1 is the default.",
					min: 0,
					max: 4,
					step: .05,
					value: speed,
					display: speed.toFixed(2),
					onChange: (value) => act((engine) => engine.setSpeed(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCameraSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Spin",
					hint: "How fast the worlds rotate on their axes.",
					min: 0,
					max: .08,
					step: .001,
					value: spinFactor,
					display: spinFactor.toFixed(3),
					onChange: (value) => act((engine) => engine.setSpinFactor(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Idle weave",
					hint: "How often strings draw while no music is driving them.",
					min: .5,
					max: 12,
					step: .1,
					value: linesPerSec,
					display: `${linesPerSec.toFixed(1)} /s`,
					onChange: (value) => act((engine) => engine.setLinesPerSec(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Max weave",
					hint: "Loudest notes in a band draw this many strands per second. Quieter notes draw fewer. Below the floor, none.",
					min: 3,
					max: 24,
					step: .5,
					value: maxWeave,
					display: `${maxWeave.toFixed(1)} /s`,
					onChange: (value) => act((engine) => engine.setMaxWeave(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Trail",
					hint: "How long each strand lingers before fading.",
					min: 4,
					max: 180,
					step: 1,
					value: trailDuration,
					display: `${Math.round(trailDuration)}s`,
					onChange: (value) => act((engine) => engine.setTrailDuration(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					label: "Paths",
					options: [
						{
							id: "realistic",
							label: "Kepler",
							hint: "Elliptical orbits, as in the real solar system."
						},
						{
							id: "circular",
							label: "Circle",
							hint: "Perfect circles — easier to read at a glance."
						},
						{
							id: "hidden",
							label: "Hide",
							hint: "Hide orbit paths; worlds still move."
						}
					],
					value: orbitMode,
					onChange: (value) => act((engine) => engine.setOrbitMode(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					label: "Sky",
					value: background,
					options: [
						{
							id: "milkyway",
							label: "Milky",
							hint: "Wrap the sky in the Milky Way map."
						},
						{
							id: "stars",
							label: "Stars",
							hint: "A quieter star field without the galaxy band."
						},
						{
							id: "none",
							label: "Void",
							hint: "Empty dark sky."
						}
					],
					onChange: (value) => act((engine) => engine.setBackground(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Ultra maps",
					hint: "On first visit the orrery downloads the highest Solar System Scope maps (8K where they publish them) and keeps them on this device. Uranus and Neptune stay 2K — that is the largest SSS makes. Turn off to use the bundled 2K maps.",
					checked: hiRes,
					onChange: (value) => act((engine) => void engine.setHiRes(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "-mt-2 px-1 text-xs leading-relaxed text-faint",
					children: [hiResNote, ". Solar System Scope, CC BY 4.0."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Parallax dust",
					hint: "Nearby dust motes that drift as you orbit the camera.",
					checked: parallax,
					onChange: (value) => act((engine) => engine.setParallax(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Ambient",
					hint: "Fill light on the night side of each world. 1 is the default.",
					min: 0,
					max: 1.4,
					step: .02,
					value: ambient,
					display: ambient.toFixed(2),
					onChange: (value) => act((engine) => engine.setAmbient(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Bloom",
					hint: "Glow around the sun and bright strings.",
					min: 0,
					max: 1.4,
					step: .02,
					value: bloom,
					display: bloom.toFixed(2),
					onChange: (value) => act((engine) => engine.setBloom(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeField, {
					label: "Saturn rings",
					hint: "How bright Saturn's rings read against the sky. Raise it if the ice bands look faint.",
					min: 0,
					max: 3,
					step: .05,
					value: ringBrightness,
					display: ringBrightness.toFixed(2),
					onChange: (value) => act((engine) => engine.setRingBrightness(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface-2/70 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 px-1 font-display text-base text-fg",
						children: "Export"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportFields, { onStart: onRecordStart })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-hint": "Send every planet back to its starting place.",
						className: "h-10 flex-1 rounded-lg bg-surface-2 text-xs font-medium text-fg hover:bg-fg/10",
						onClick: () => act((engine) => engine.resetPlanets()),
						children: "Reset worlds"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-hint": "Erase drawn strings. Worlds stay where they are.",
						className: "h-10 flex-1 rounded-lg bg-surface-2 text-xs font-medium text-fg hover:bg-fg/10",
						onClick: () => act((engine) => engine.clearTrails()),
						children: "Clear trails"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 px-1 text-xs leading-relaxed text-faint",
					children: "Maps from Solar System Scope, CC BY 4.0."
				})
			]
		})
	});
}
function VoiceChip({ label, on, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-6 items-center rounded-md px-2 text-xs font-medium", on ? tone : "bg-fg/10 text-faint"),
		children: on ? label : `${label} quiet`
	});
}
function BandRow({ band, label }) {
	const state = useVizStore((s) => s.audio.bands[band]);
	const autoMix = useVizStore((s) => s.audio.autoMix);
	const tone = band === "bass" ? "bg-bass" : band === "mid" ? "bg-mid" : "bg-high";
	const energy = Math.min(1, state.energy / 220);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface-2/70 px-2 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-hint": `Turn ${label.toLowerCase()} on or off. Off, strings on this channel stay quiet.`,
							onClick: () => act((engine) => engine.setBandEnabled(band, !state.enabled)),
							className: `text-xs font-medium ${state.enabled ? "text-fg" : "text-faint line-through"}`,
							children: label
						}),
						autoMix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs ${state.playing ? "text-fg" : "text-faint"}`,
							children: state.playing ? "playing" : "quiet"
						}) : null,
						state.weaveRate > .05 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs tabular-nums text-faint",
							children: [state.weaveRate.toFixed(1), " /s"]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [autoMix && state.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Unlock ${label}`,
						"data-hint": "This slider is locked. Click to let auto mix move it again.",
						className: "inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-fg/10 hover:text-fg",
						onClick: () => act((engine) => engine.unlockBand(band)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
							className: "size-3",
							strokeWidth: 1.75
						})
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs tabular-nums text-faint",
						children: [state.sensitivity.toFixed(1), "×"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1 overflow-hidden rounded-full bg-fg/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `energy-bar h-full ${tone}`,
					style: { transform: `scaleX(${state.enabled ? energy : 0})` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				className: "hud-range mt-2",
				min: .4,
				max: 3,
				step: .05,
				value: state.sensitivity,
				"aria-label": `${label} sensitivity`,
				"data-hint": `How quiet a ${label.toLowerCase()} note can be and still weave. Higher sits the floor lower so left-hand or melody notes fire, then go silent between them. Drag to lock.`,
				onPointerDown: () => act((engine) => engine.lockBand(band)),
				onChange: (event) => act((engine) => engine.setBandSensitivity(band, Number(event.target.value)))
			})
		]
	});
}
function Transport({ onOpenFile, onOpenSheet }) {
	const audio = useVizStore((s) => s.audio);
	const paused = useVizStore((s) => s.paused);
	const canCreate = useVizStore((s) => s.canCreate);
	const selectedCount = useVizStore((s) => s.selectedCount);
	const [libraryOpen, setLibraryOpen] = (0, import_react.useState)(false);
	const [exportOpen, setExportOpen] = (0, import_react.useState)(false);
	const recording = useVizStore((s) => s.recording);
	const progress = audio.duration > 0 ? audio.current / audio.duration : 0;
	const muted = audio.muted || audio.volume <= .001;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "pointer-events-auto relative w-full max-w-3xl",
		children: [
			libraryOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel absolute inset-x-0 bottom-full z-30 mb-2 rounded-2xl p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackList, {
					compact: true,
					activeId: audio.trackId,
					onPick: (id) => {
						act((engine) => {
							engine.loadLibrary(id);
							engine.playAudio();
						});
						setLibraryOpen(false);
					},
					onAdd: () => {
						setLibraryOpen(false);
						onOpenFile();
					}
				})
			}) : null,
			exportOpen && !recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel absolute inset-x-0 bottom-full z-30 mb-2 rounded-2xl p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 px-1 font-display text-lg text-fg",
					children: "Export video"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportFields, { onStart: () => setExportOpen(false) })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel rounded-2xl px-2 py-2 md:px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 md:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: audio.playing ? "Pause" : "Play",
							hint: audio.playing ? "Pause the recording. Space also toggles." : "Play the recording. Space also toggles.",
							onClick: () => act((engine) => {
								if (!engine.audio.hasTrack) engine.loadDemo();
								engine.toggleAudio();
							}),
							children: audio.playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "size-5 fill-current",
								strokeWidth: 1.5
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "ml-0.5 size-5 fill-current",
								strokeWidth: 1.5
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-fg",
									children: audio.trackName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "shrink-0 font-mono text-xs tabular-nums text-faint",
									children: [
										formatTime(audio.current),
										" / ",
										formatTime(audio.duration)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								className: "hud-range mt-2",
								min: 0,
								max: 1,
								step: .001,
								value: progress,
								disabled: !audio.hasTrack,
								"aria-label": "Seek",
								"data-hint": "Scrub the recording. Mix sliders follow the section under the playhead.",
								onChange: (event) => act((engine) => engine.seekAudio(Number(event.target.value)))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: muted ? "Unmute" : "Mute",
							hint: muted ? "Unmute the recording." : "Mute the recording. The speaker also toggles mute.",
							className: "size-9",
							active: muted,
							onClick: () => act((engine) => engine.toggleMute()),
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
								className: "size-4",
								strokeWidth: 1.75
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							className: "hud-range hidden w-20 sm:block",
							min: 0,
							max: 1,
							step: .01,
							value: audio.volume,
							"aria-label": "Volume",
							"data-hint": "Playback volume.",
							onChange: (event) => act((engine) => engine.setVolume(Number(event.target.value)))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Choose a track",
							hint: "Pick a public-domain recording or add your own.",
							active: libraryOpen,
							onClick: () => {
								setExportOpen(false);
								setLibraryOpen((open) => !open);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: paused ? "Resume orbits" : "Pause orbits",
							hint: paused ? "Let the planets move again. Music keeps playing." : "Freeze planetary motion. Music still plays.",
							active: paused,
							onClick: () => act((engine) => engine.togglePaused()),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orbit, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Export video",
							hint: "Record the sky and the music. Menus and the cursor stay out of the file. You can drag the camera while it records.",
							active: exportOpen || recording,
							className: "hidden md:inline-flex",
							onClick: () => {
								setLibraryOpen(false);
								setExportOpen((open) => !open);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onOpenSheet,
							"data-hint": "Open worlds, strings, and mix on a small screen.",
							className: "inline-flex h-11 items-center rounded-md px-3 text-xs font-medium text-muted hover:bg-fg/10 hover:text-fg lg:hidden",
							children: "Tune"
						})
					]
				}), (selectedCount > 0 || canCreate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center justify-between gap-3 px-2 pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: canCreate ? "Two worlds selected" : selectedCount === 1 ? "Select a second world" : `${selectedCount} selected`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !canCreate,
						"data-hint": "Stretch a glowing string between the two selected worlds.",
						onClick: () => act((engine) => engine.createConnection()),
						className: "h-9 rounded-md bg-fg px-3 text-xs font-medium text-bg disabled:opacity-40",
						children: "Weave string"
					})]
				})]
			})
		]
	});
}
function VizHud() {
	const fileRef = (0, import_react.useRef)(null);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [sheet, setSheet] = (0, import_react.useState)("none");
	const [fileReady, setFileReady] = (0, import_react.useState)(false);
	const uiHidden = useVizStore((s) => s.uiHidden);
	const hasTrack = useVizStore((s) => s.audio.hasTrack);
	const fps = useVizStore((s) => s.fps);
	const ready = useVizStore((s) => s.ready);
	const openFile = () => fileRef.current?.click();
	(0, import_react.useEffect)(() => {
		setFileReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) return;
			if (event.code === "Space") {
				event.preventDefault();
				act((engine) => {
					if (!engine.audio.hasTrack) engine.loadDemo();
					engine.toggleAudio();
				});
				return;
			}
			const key = event.key.toLowerCase();
			if (key === "h") act((engine) => engine.toggleUi());
			else if (key === "p" && !event.metaKey && !event.ctrlKey) act((engine) => engine.togglePaused());
			else if (key === "r") act((engine) => engine.resetPlanets());
			else if (key === "c") act((engine) => engine.clearTrails());
			else if (event.key === "=" || event.key === "+") act((engine) => engine.zoomBy(.82));
			else if (event.key === "-" || event.key === "_") act((engine) => engine.zoomBy(1.22));
			else if (key === "f") {
				if (document.fullscreenElement) document.exitFullscreen();
				else document.documentElement.requestFullscreen().catch(() => void 0);
			} else if (key === "escape") {
				act((engine) => {
					if (engine.recording) engine.stopRecording();
				});
				setSheet("none");
			}
		};
		const onDragOver = (event) => {
			if (!event.dataTransfer?.types.includes("Files")) return;
			event.preventDefault();
			setDragging(true);
		};
		const onDragLeave = (event) => {
			if (event.relatedTarget) return;
			setDragging(false);
		};
		const onDrop = (event) => {
			event.preventDefault();
			setDragging(false);
			const file = event.dataTransfer?.files?.[0];
			if (!file || !isAudioFile(file)) return;
			act((engine) => {
				engine.loadFile(file);
				engine.playAudio();
			});
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("dragover", onDragOver);
		window.addEventListener("dragleave", onDragLeave);
		window.addEventListener("drop", onDrop);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("dragover", onDragOver);
			window.removeEventListener("dragleave", onDragLeave);
			window.removeEventListener("drop", onDrop);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintLayer, {}),
		fileReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: fileRef,
			type: "file",
			accept: "audio/*",
			className: "hidden",
			onChange: (event) => {
				const file = event.target.files?.[0];
				event.target.value = "";
				if (!file || !isAudioFile(file)) return;
				act((engine) => {
					engine.loadFile(file);
					engine.playAudio();
				});
			}
		}) : null,
		dragging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-4 z-30 flex items-center justify-center rounded-3xl border border-dashed border-primary/50 bg-bg/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-fg",
				children: "Drop a song"
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecPill, {}),
		uiHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overlay-safe pointer-events-none absolute inset-0 z-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute top-3 right-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Show chrome",
					hint: "Show panels and the player. H also toggles them.",
					onClick: () => act((engine) => engine.toggleUi()),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
						className: "size-4",
						strokeWidth: 1.75
					})
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-safe pointer-events-none absolute inset-0 z-20 flex flex-col",
			children: [
				hasTrack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto px-1 pt-1",
						"data-hint": "A living orrery — music weaves glowing strings between the worlds.",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl leading-none tracking-tight text-fg",
								children: "Air on Celestial Strings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MakerCredit, { className: "mt-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs tracking-widest text-faint uppercase",
								children: ready ? `${Math.round(fps)} fps` : "Lighting the sky"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto flex items-center gap-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Zoom in",
								hint: "Move the camera closer to the sun. + also zooms in.",
								onClick: () => act((engine) => engine.zoomBy(.82)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									strokeWidth: 1.75
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Zoom out",
								hint: "Pull the camera back to see the outer worlds. − also zooms out.",
								onClick: () => act((engine) => engine.zoomBy(1.22)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
									className: "size-4",
									strokeWidth: 1.75
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Fullscreen",
								hint: "Fill the screen with the orrery. F also toggles fullscreen.",
								onClick: () => {
									if (document.fullscreenElement) document.exitFullscreen();
									else document.documentElement.requestFullscreen().catch(() => void 0);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, {
									className: "size-4",
									strokeWidth: 1.75
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Hide chrome",
								hint: "Hide panels and the player. Press H to bring them back.",
								onClick: () => act((engine) => engine.toggleUi()),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
									className: "size-4",
									strokeWidth: 1.75
								})
							})
						]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntroCard, {
					visible: !hasTrack,
					ready,
					onOpenFile: openFile
				}),
				hasTrack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-desktop mt-3 min-h-0 flex-1 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-auto flex min-h-0 flex-col gap-3 self-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldsPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StringsPanel, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-auto self-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixPanel, { onRecordStart: () => setSheet("none") })
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
				hasTrack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-auto flex justify-center pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transport, {
						onOpenFile: openFile,
						onOpenSheet: () => setSheet((current) => current === "none" ? "mix" : "none")
					})
				}) : null
			]
		}),
		sheet !== "none" && !uiHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 z-40 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close panel",
				"data-hint": "Close this panel.",
				className: "absolute inset-0 bg-bg/55",
				onClick: () => setSheet("none")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-panel absolute inset-x-0 bottom-0 overflow-y-auto rounded-t-3xl bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 rounded-lg bg-surface-2 p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-hint": "Worlds and strings.",
							onClick: () => setSheet("worlds"),
							className: `h-9 rounded-md px-3 text-xs font-medium ${sheet === "worlds" ? "bg-fg text-bg" : "text-muted"}`,
							children: "Worlds"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-hint": "Rhythm, mix, orbits, and sky.",
							onClick: () => setSheet("mix"),
							className: `h-9 rounded-md px-3 text-xs font-medium ${sheet === "mix" ? "bg-fg text-bg" : "text-muted"}`,
							children: "Mix"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: "Close",
						hint: "Close this panel.",
						onClick: () => setSheet("none"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							strokeWidth: 1.75
						})
					})]
				}), sheet === "worlds" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldsPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StringsPanel, {})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixPanel, { onRecordStart: () => setSheet("none") })]
			})]
		}) : null
	] });
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VizCanvas, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VizHud, {})]
	});
}
//#endregion
export { stampFilename as a, __exportAll as c, exportSize as i, CaptureSession as n, formatTime as o, downloadBlob as r, libraryTrack as s, routes_exports as t };
