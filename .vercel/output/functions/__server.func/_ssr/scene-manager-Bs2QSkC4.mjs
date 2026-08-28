import { a as fpsValue, c as EMPTY_NOTE, i as exportSize, l as note, n as CaptureSession, o as stampFilename, r as downloadBlob, s as formatTime, u as libraryTrack } from "./routes-NQuUc6bE.mjs";
import { A as RepeatWrapping, B as Timer, C as MeshBasicMaterial, D as Points, E as PointLight, F as SphereGeometry, H as Vector3, I as Sprite, L as SpriteMaterial, M as SRGBColorSpace, N as Scene, O as PointsMaterial, P as ShaderMaterial, R as Texture, S as Mesh, T as PerspectiveCamera, V as Vector2, _ as ClampToEdgeWrapping, a as LineMaterial, c as OutputPass, d as OrbitControls, f as WebGLRenderer, g as CanvasTexture, h as BufferGeometry, i as LineSegmentsGeometry, j as RingGeometry, k as Raycaster, l as FXAAPass, m as BufferAttribute, n as LineGeometry, o as UnrealBloomPass, p as AmbientLight, r as LineSegments2, s as RenderPass, t as Line2, u as EffectComposer, v as Color, w as MeshStandardMaterial, x as MathUtils, y as Group, z as TextureLoader } from "../_libs/three.mjs";
import { t as configureTexture } from "./texture-pack-BaRlWae6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scene-manager-Bs2QSkC4.js
function writeString(view, offset, value) {
	for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
}
function midiToHz(midi) {
	return 440 * 2 ** ((midi - 69) / 12);
}
function env(t, attack, decay, sustain, dur, release) {
	if (t < 0) return 0;
	if (t < attack) return t / attack;
	if (t < attack + decay) return 1 - (1 - sustain) * ((t - attack) / decay);
	if (t < dur) return sustain;
	const rel = t - dur;
	if (rel >= release) return 0;
	return sustain * (1 - rel / release);
}
/**
* Synthesized waltz after Johann Strauss II, Op. 314 (public domain).
* Original generated arrangement — not a commercial recording.
*/
function createDemoTrackBlob() {
	const sampleRate = 44100;
	const beat = 1 / 3;
	const bar = 1;
	const intro = 6.2;
	const waltzBars = 32;
	const n = Math.floor(sampleRate * (38.2 + 1.2));
	const samples = new Float32Array(n);
	const voices = [];
	const add = (midi, start, dur, vel, kind) => {
		voices.push({
			midi,
			start,
			dur,
			vel,
			kind
		});
	};
	add(45, .05, 2.4, .16, "melody");
	add(33, .05, 5.8, .18, "bass");
	[
		38,
		42,
		45,
		50,
		54,
		57,
		62
	].forEach((midi, i) => {
		add(midi, .7 + i * .62, 1.35, .2 - i * .01, i < 3 ? "bass" : "melody");
		add(midi + 12, .7 + i * .62, 1.1, .07, "spark");
	});
	add(45, 5.15, .28, .36, "bass");
	add(45, 5.5, .28, .34, "bass");
	add(38, 5.85, .55, .44, "bass");
	const themeA = [
		[74, 2],
		[74, 1],
		[74, 2],
		[74, 1],
		[74, 1],
		[73, 1],
		[74, 1],
		[76, 1],
		[74, 1],
		[71, 1],
		[69, 3],
		[69, 1],
		[71, 1],
		[73, 1],
		[74, 1],
		[73, 1],
		[71, 1],
		[69, 3]
	];
	const themeB = [
		[78, 1],
		[74, 1],
		[69, 1],
		[71, 1],
		[73, 1],
		[74, 1],
		[73, 1],
		[71, 1],
		[69, 1],
		[66, 3],
		[78, 1],
		[74, 1],
		[69, 1],
		[71, 1],
		[73, 1],
		[74, 1],
		[76, 1],
		[78, 1],
		[79, 1],
		[81, 3]
	];
	const placeTheme = (notes, startBar, octave, vel) => {
		let t = intro + startBar * bar - beat;
		add(69 + octave, t, beat * .92, vel * .85, "melody");
		add(81 + octave, t, beat * .6, vel * .12, "spark");
		t += beat;
		for (const [midi, beats] of notes) {
			const dur = beats * beat;
			add(midi + octave, t, dur * .9, vel, "melody");
			add(midi + octave + 12, t, dur * .62, vel * .16, "spark");
			t += dur;
		}
	};
	placeTheme(themeA, 0, 0, .3);
	placeTheme(themeA, 8, 12, .24);
	placeTheme(themeB, 16, 0, .27);
	placeTheme(themeA, 24, 0, .3);
	const roots = [
		38,
		38,
		38,
		45,
		45,
		45,
		38,
		45
	];
	const fifths = [
		45,
		45,
		45,
		52,
		52,
		52,
		45,
		52
	];
	const thirds = [
		54,
		54,
		54,
		61,
		61,
		61,
		54,
		61
	];
	for (let b = 0; b < waltzBars; b++) {
		const t = intro + b * bar;
		const i = b % 8;
		add(roots[i], t, beat * .82, .46, "bass");
		add(roots[i] + 12, t, beat * .42, .14, "bass");
		add(fifths[i], t + beat, beat * .42, .18, "chord");
		add(thirds[i], t + beat, beat * .42, .12, "chord");
		add(fifths[i] + 12, t + beat, beat * .28, .06, "spark");
		add(fifths[i], t + beat * 2, beat * .42, .16, "chord");
		add(thirds[i], t + beat * 2, beat * .42, .11, "chord");
		add(fifths[i] + 12, t + beat * 2, beat * .32, .08, "spark");
		add(thirds[i] + 12, t + beat * 2, beat * .22, .05, "spark");
	}
	for (const v of voices) {
		const freq = midiToHz(v.midi);
		const i0 = Math.max(0, Math.floor(v.start * sampleRate));
		const release = v.kind === "bass" ? .16 : v.kind === "melody" ? .15 : .08;
		const i1 = Math.min(n, Math.floor((v.start + v.dur + release) * sampleRate));
		const attack = v.kind === "melody" ? .016 : .004;
		const decay = v.kind === "bass" ? .1 : .07;
		const sustain = v.kind === "melody" ? .72 : v.kind === "bass" ? .32 : .26;
		for (let i = i0; i < i1; i++) {
			const t = i / sampleRate - v.start;
			const e = env(t, attack, decay, sustain, v.dur, release);
			if (e <= 0) continue;
			const phase = 2 * Math.PI * freq * t;
			let s = Math.sin(phase);
			if (v.kind === "melody") s += .24 * Math.sin(2 * phase) + .08 * Math.sin(3 * phase);
			else if (v.kind === "bass") {
				s = Math.sin(phase) * .82 + Math.sin(2 * phase) * .22 + Math.sin(phase * .5) * .16;
				s += Math.exp(-t * 42) * Math.sin(phase * 3) * .28;
			} else if (v.kind === "spark") s = Math.sin(phase) + .45 * Math.sin(2 * phase) + .12 * Math.sin(4 * phase);
			samples[i] += s * e * v.vel;
		}
	}
	for (let i = 0; i < n; i++) {
		const t = i / sampleRate;
		if (t < intro) samples[i] += Math.sin(2 * Math.PI * 880 * t) * .01 * Math.sin(2 * Math.PI * 5 * t);
		samples[i] = Math.max(-1, Math.min(1, samples[i] * .7));
	}
	const bytes = n * 2;
	const buffer = /* @__PURE__ */ new ArrayBuffer(3475124);
	const view = new DataView(buffer);
	writeString(view, 0, "RIFF");
	view.setUint32(4, 3475116, true);
	writeString(view, 8, "WAVE");
	writeString(view, 12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 1, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * 2, true);
	view.setUint16(32, 2, true);
	view.setUint16(34, 16, true);
	writeString(view, 36, "data");
	view.setUint32(40, bytes, true);
	let o = 44;
	for (let i = 0; i < n; i++) {
		view.setInt16(o, Math.round(samples[i] * 32767), true);
		o += 2;
	}
	return new Blob([buffer], { type: "audio/wav" });
}
var BANDS$1 = [
	"bass",
	"mid",
	"high"
];
var BAND_HZ$1 = {
	bass: [20, 220],
	mid: [220, 800],
	high: [800, 6e3]
};
var BAND_THRESHOLD = {
	bass: 150,
	mid: 85,
	high: 40
};
var FFT_SIZE = 2048;
var TARGET_RATE = 11025;
var HOP_SEC = .28;
var MIN_SECTION = 14;
var MIN_DB = -100;
var FALLBACK_SENS = {
	bass: 1.8,
	mid: 1.7,
	high: 2.1
};
var FALLBACK_PEAK = {
	bass: 140,
	mid: 95,
	high: 55
};
var FALLBACK_DRIVE = {
	bass: .7,
	mid: .65,
	high: .75
};
function sectionAt(profile, time) {
	const sections = profile.sections;
	if (sections.length === 0) return {
		index: 0,
		section: fallbackSection(Math.max(profile.duration, 1))
	};
	const t = Math.max(0, Math.min(time, profile.duration));
	for (let i = sections.length - 1; i >= 0; i--) {
		const section = sections[i];
		if (t >= section.start) return {
			index: i,
			section
		};
	}
	return {
		index: 0,
		section: sections[0]
	};
}
async function analyzeMixBuffer(buffer, signal) {
	const duration = Number.isFinite(buffer.duration) ? buffer.duration : 0;
	if (duration <= 0 || buffer.length < 32) return {
		duration,
		sections: [fallbackSection(Math.max(duration, 1))]
	};
	const samples = downsampleMono(buffer, TARGET_RATE);
	const hop = Math.max(512, Math.round(TARGET_RATE * HOP_SEC));
	const frameCount = Math.max(1, Math.floor(Math.max(0, samples.length - FFT_SIZE) / hop) + 1);
	const window = hann(FFT_SIZE);
	const re = new Float32Array(FFT_SIZE);
	const im = new Float32Array(FFT_SIZE);
	const energies = {
		bass: new Float32Array(frameCount),
		mid: new Float32Array(frameCount),
		high: new Float32Array(frameCount)
	};
	const nyquist = TARGET_RATE / 2;
	const binHz = TARGET_RATE / FFT_SIZE;
	for (let f = 0; f < frameCount; f++) {
		if (signal?.aborted) throw abortError();
		if (f > 0 && f % 64 === 0) await yieldSlice();
		const offset = f * hop;
		re.fill(0);
		im.fill(0);
		const take = Math.min(FFT_SIZE, samples.length - offset);
		for (let i = 0; i < take; i++) re[i] = (samples[offset + i] ?? 0) * (window[i] ?? 0);
		fftRadix2(re, im);
		for (const key of BANDS$1) {
			const [lo, hi] = BAND_HZ$1[key];
			const startBin = Math.max(1, Math.floor(lo / binHz));
			const endBin = Math.min(FFT_SIZE / 2, Math.ceil(Math.min(hi, nyquist) / binHz));
			let sum = 0;
			let sumSq = 0;
			let count = 0;
			for (let k = startBin; k < endBin; k++) {
				const mag = Math.hypot(re[k] ?? 0, im[k] ?? 0) / (FFT_SIZE / 2);
				const byte = ((mag > 1e-12 ? 20 * Math.log10(mag) : MIN_DB) - MIN_DB) / 70 * 255;
				const v = byte < 0 ? 0 : byte > 255 ? 255 : byte;
				sum += v;
				sumSq += v * v;
				count += 1;
			}
			if (!count) {
				energies[key][f] = 0;
				continue;
			}
			const mean = sum / count;
			const rms = Math.sqrt(sumSq / count);
			energies[key][f] = .4 * mean + .6 * rms;
		}
	}
	const novelty = new Float32Array(frameCount);
	for (let f = 1; f < frameCount; f++) {
		let flux = 0;
		for (const key of BANDS$1) {
			const d = (energies[key][f] ?? 0) - (energies[key][f - 1] ?? 0);
			if (d > 0) flux += d;
		}
		novelty[f] = flux;
	}
	const smooth = movingAverage(novelty, 5);
	const hopTime = hop / TARGET_RATE;
	const bounds = pickBoundaries(smooth, hopTime, duration);
	const sections = [];
	for (let i = 0; i < bounds.length - 1; i++) {
		const start = bounds[i];
		const end = bounds[i + 1];
		const startFrame = Math.max(0, Math.min(frameCount - 1, Math.floor(start / hopTime)));
		const endFrame = Math.max(startFrame + 1, Math.min(frameCount, Math.ceil(end / hopTime)));
		sections.push(sectionFromFrames(start, end, startFrame, endFrame, energies));
	}
	if (sections.length === 0) sections.push(fallbackSection(duration));
	return {
		duration,
		sections
	};
}
function sectionFromFrames(start, end, startFrame, endFrame, energies) {
	const sensitivity = { ...FALLBACK_SENS };
	const pivot = {
		bass: 0,
		mid: 0,
		high: 0
	};
	const peak = { ...FALLBACK_PEAK };
	const drive = { ...FALLBACK_DRIVE };
	const presence = {
		bass: 0,
		mid: 0,
		high: 0
	};
	const readiness = {
		bass: 0,
		mid: 0,
		high: 0
	};
	for (const key of BANDS$1) {
		const slice = energies[key].subarray(startFrame, endFrame);
		const floor = percentile(slice, .12);
		const p25 = percentile(slice, .25);
		const p75 = percentile(slice, .75);
		const p90 = percentile(slice, .9);
		const spread = Math.max(0, p90 - floor);
		const iqr = Math.max(0, p75 - p25);
		const gate = floor + .1 * Math.max(spread, 6);
		let hits = 0;
		let rises = 0;
		for (let i = 0; i < slice.length; i++) {
			const v = slice[i] ?? 0;
			if (v > gate) hits += 1;
			if (i > 0) {
				if (v - (slice[i - 1] ?? 0) > 2.5) rises += 1;
			}
		}
		const present = slice.length ? hits / slice.length : 0;
		const noteDensity = slice.length > 1 ? rises / (slice.length - 1) : 0;
		presence[key] = present;
		const motion = clamp$1(iqr / 48, 0, 1);
		readiness[key] = clamp$1(present * (.38 + .62 * clamp$1(spread / 70, 0, 1)) + .15 * noteDensity, 0, 1);
		pivot[key] = floor + .14 * Math.max(spread, 6);
		peak[key] = Math.max(gate + 16, p90);
		const target = Math.max(5.5, floor + .11 * Math.max(spread, 8));
		sensitivity[key] = quantize(clamp$1(BAND_THRESHOLD[key] * .82 / target, 1.15, 3.2), .05);
		drive[key] = quantize(clamp$1(.22 + .42 * present + .28 * motion + .18 * noteDensity, .18, 1), .02);
	}
	const playing = {
		bass: presence.bass > .055 || readiness.bass > .14,
		mid: presence.mid > .055 || readiness.mid > .14,
		high: presence.high > .055 || readiness.high > .14
	};
	return {
		start,
		end,
		sensitivity,
		pivot,
		peak,
		drive,
		presence,
		readiness,
		playing,
		voice: voiceKey(playing, readiness)
	};
}
function voiceKey(playing, readiness) {
	const { bass, mid, high } = playing;
	if (!bass && !mid && !high) return "voice.quiet";
	if (bass && high && !mid) return "voice.bassTreble";
	if (bass && !mid && !high) return "voice.bass";
	if (!bass && !mid && high) return "voice.treble";
	if (!bass && mid && !high) return "voice.mids";
	if (bass && mid && high) {
		const top = [
			"bass",
			"mid",
			"high"
		].sort((a, b) => readiness[b] - readiness[a])[0];
		if (top === "high") return "voice.fullMelody";
		if (top === "bass") return "voice.fullBass";
		return "voice.full";
	}
	if (bass && mid) return "voice.bassMids";
	return "voice.midsTreble";
}
function fallbackSection(duration) {
	return {
		start: 0,
		end: duration,
		sensitivity: { ...FALLBACK_SENS },
		pivot: {
			bass: 40,
			mid: 32,
			high: 22
		},
		peak: { ...FALLBACK_PEAK },
		drive: { ...FALLBACK_DRIVE },
		presence: {
			bass: 0,
			mid: 0,
			high: 0
		},
		readiness: {
			bass: 0,
			mid: 0,
			high: 0
		},
		playing: {
			bass: false,
			mid: false,
			high: false
		},
		voice: "voice.listening"
	};
}
function pickBoundaries(novelty, hopTime, duration) {
	const n = novelty.length;
	if (n < 4) return [0, duration];
	let mean = 0;
	for (let i = 0; i < n; i++) mean += novelty[i] ?? 0;
	mean /= n;
	let variance = 0;
	for (let i = 0; i < n; i++) {
		const d = (novelty[i] ?? 0) - mean;
		variance += d * d;
	}
	const std = Math.sqrt(variance / n);
	const gate = mean + .65 * std;
	const minGap = Math.max(2, Math.round(MIN_SECTION / hopTime));
	const peaks = [];
	for (let i = 2; i < n - 2; i++) {
		const v = novelty[i] ?? 0;
		if (v < gate) continue;
		if (v >= (novelty[i - 1] ?? 0) && v >= (novelty[i + 1] ?? 0) && v >= (novelty[i - 2] ?? 0) && v >= (novelty[i + 2] ?? 0)) peaks.push({
			i,
			v
		});
	}
	peaks.sort((a, b) => b.v - a.v);
	const chosen = [];
	for (const peak of peaks) {
		if (chosen.length >= 8) break;
		if (chosen.some((j) => Math.abs(j - peak.i) < minGap)) continue;
		const t = peak.i * hopTime;
		if (t < MIN_SECTION || t > duration - MIN_SECTION) continue;
		chosen.push(peak.i);
	}
	chosen.sort((a, b) => a - b);
	const bounds = [0];
	for (const i of chosen) bounds.push(i * hopTime);
	bounds.push(duration);
	return bounds;
}
function downsampleMono(buffer, targetRate) {
	const ratio = (buffer.sampleRate || targetRate) / targetRate;
	const outLen = Math.max(1, Math.floor(buffer.length / ratio));
	const out = new Float32Array(outLen);
	const channels = Math.max(1, buffer.numberOfChannels);
	const chans = [];
	for (let c = 0; c < channels; c++) chans.push(buffer.getChannelData(c));
	for (let i = 0; i < outLen; i++) {
		const s = Math.min(buffer.length - 1, Math.floor(i * ratio));
		let mix = 0;
		for (const ch of chans) mix += ch[s] ?? 0;
		out[i] = mix / channels;
	}
	return out;
}
function hann(n) {
	const w = new Float32Array(n);
	if (n < 2) {
		w[0] = 1;
		return w;
	}
	for (let i = 0; i < n; i++) w[i] = .5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
	return w;
}
function fftRadix2(re, im) {
	const n = re.length;
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			const tr = re[i];
			re[i] = re[j];
			re[j] = tr;
			const ti = im[i];
			im[i] = im[j];
			im[j] = ti;
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const ang = -2 * Math.PI / len;
		const wlenRe = Math.cos(ang);
		const wlenIm = Math.sin(ang);
		const half = len >> 1;
		for (let i = 0; i < n; i += len) {
			let wRe = 1;
			let wIm = 0;
			for (let j = 0; j < half; j++) {
				const even = i + j;
				const odd = even + half;
				const vr = re[odd] * wRe - im[odd] * wIm;
				const vi = re[odd] * wRe + im[odd] * wIm;
				re[odd] = re[even] - vr;
				im[odd] = im[even] - vi;
				re[even] += vr;
				im[even] += vi;
				const nextRe = wRe * wlenRe - wIm * wlenIm;
				wIm = wRe * wlenIm + wIm * wlenRe;
				wRe = nextRe;
			}
		}
	}
}
function movingAverage(data, radius) {
	const n = data.length;
	const out = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		let sum = 0;
		let count = 0;
		const a = Math.max(0, i - radius);
		const b = Math.min(n - 1, i + radius);
		for (let j = a; j <= b; j++) {
			sum += data[j] ?? 0;
			count += 1;
		}
		out[i] = count ? sum / count : 0;
	}
	return out;
}
function percentile(values, p) {
	const n = values.length;
	if (n === 0) return 0;
	const sorted = new Float32Array(n);
	for (let i = 0; i < n; i++) sorted[i] = values[i] ?? 0;
	sorted.sort();
	const idx = clamp$1(p, 0, 1) * (n - 1);
	const lo = Math.floor(idx);
	const hi = Math.ceil(idx);
	if (lo === hi) return sorted[lo] ?? 0;
	const t = idx - lo;
	return (sorted[lo] ?? 0) * (1 - t) + (sorted[hi] ?? 0) * t;
}
function clamp$1(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function quantize(value, step) {
	return Math.round(value / step) * step;
}
function abortError() {
	return new DOMException("Aborted", "AbortError");
}
function yieldSlice() {
	return new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}
var BAND_HZ = {
	bass: [20, 220],
	mid: [220, 800],
	high: [800, 6e3],
	all: [20, 8e3]
};
function presetFromHz(min, max) {
	for (const [key, range] of Object.entries(BAND_HZ)) if (range[0] === min && range[1] === max) return key;
	return "custom";
}
function hzForPreset(preset) {
	if (preset === "custom") return [20, 8e3];
	return BAND_HZ[preset];
}
var PLANET_DEFS = [
	{
		name: "Mercury",
		radius: 4.8,
		semiMajor: 80,
		orbitSpeed: .04,
		axialTilt: 0,
		rotationPeriodDays: 58.65,
		eccentricity: .2056,
		rings: false,
		atmosphere: false
	},
	{
		name: "Venus",
		radius: 9.2,
		semiMajor: 120,
		orbitSpeed: .015,
		axialTilt: 177.3,
		rotationPeriodDays: -243.02,
		eccentricity: .0068,
		rings: false,
		atmosphere: true
	},
	{
		name: "Earth",
		radius: 9.8,
		semiMajor: 170,
		orbitSpeed: .01,
		axialTilt: 23.4,
		rotationPeriodDays: .997,
		eccentricity: .0167,
		rings: false,
		atmosphere: true
	},
	{
		name: "Moon",
		radius: 2.7,
		semiMajor: 28,
		orbitSpeed: .25,
		axialTilt: 6.7,
		rotationPeriodDays: 27.32,
		eccentricity: .0549,
		rings: false,
		atmosphere: false,
		parent: "Earth"
	},
	{
		name: "Mars",
		radius: 5.2,
		semiMajor: 230,
		orbitSpeed: .008,
		axialTilt: 25.2,
		rotationPeriodDays: 1.026,
		eccentricity: .0934,
		rings: false,
		atmosphere: false
	},
	{
		name: "Jupiter",
		radius: 28,
		semiMajor: 340,
		orbitSpeed: .002,
		axialTilt: 3.1,
		rotationPeriodDays: .413,
		eccentricity: .0489,
		rings: false,
		atmosphere: false
	},
	{
		name: "Saturn",
		radius: 24,
		semiMajor: 460,
		orbitSpeed: 9e-4,
		axialTilt: 26.7,
		rotationPeriodDays: .444,
		eccentricity: .0565,
		rings: true,
		atmosphere: false
	},
	{
		name: "Uranus",
		radius: 16,
		semiMajor: 580,
		orbitSpeed: 4e-4,
		axialTilt: 97.8,
		rotationPeriodDays: .718,
		eccentricity: .0463,
		rings: false,
		atmosphere: true
	},
	{
		name: "Neptune",
		radius: 15.5,
		semiMajor: 680,
		orbitSpeed: 2e-4,
		axialTilt: 28.3,
		rotationPeriodDays: .671,
		eccentricity: .0097,
		rings: false,
		atmosphere: true
	}
];
var SPIN_RATES = {
	Mercury: 1.8,
	Venus: -.35,
	Earth: 3.2,
	Moon: .6,
	Mars: 2.9,
	Jupiter: 14.5,
	Saturn: 12.8,
	Uranus: 5.8,
	Neptune: 5.4
};
var DEFAULT_WEAVE = [{
	a: "Venus",
	b: "Earth",
	rhythm: "all",
	color: 9426104
}];
var PATH_COLORS = {
	sun: "#e8dcc0",
	mercury: "#b7aaa0",
	venus: "#d4c4a8",
	earth: "#8ec4d4",
	moon: "#c8c8c8",
	mars: "#d4a08c",
	jupiter: "#d4c0a0",
	saturn: "#e0d4b0",
	uranus: "#9fd0d0",
	neptune: "#7ea0d0"
};
var mixCache = /* @__PURE__ */ new Map();
var MIX_CACHE_VER = "v4";
var BANDS = [
	"bass",
	"mid",
	"high"
];
var FLUX_LEN = {
	bass: 28,
	mid: 22,
	high: 16
};
var ONSET_COOLDOWN = {
	bass: 95,
	mid: 72,
	high: 52
};
var AudioManager = class {
	audio;
	context = null;
	analyser = null;
	source = null;
	outputGain = null;
	captureDest = null;
	speakerVolume = .8;
	maxWeave = 14;
	dataArray = null;
	prevSpectrum = null;
	objectUrl = null;
	demoUrl = null;
	wired = /* @__PURE__ */ new Set();
	mixAbort = null;
	mixProfile = null;
	isPlaying = false;
	muted = false;
	preMuteVolume = .8;
	rhythmEnabled = true;
	rhythmMode = "advanced";
	trackName = "No track loaded";
	trackId = "";
	hasTrack = false;
	autoMix = true;
	mixStatus = "idle";
	mixNote = EMPTY_NOTE;
	mixVoice = "";
	mixIndex = 0;
	locked = {
		bass: false,
		mid: false,
		high: false
	};
	playing = {
		bass: false,
		mid: false,
		high: false
	};
	readiness = {
		bass: 0,
		mid: 0,
		high: 0
	};
	bands = {
		bass: {
			enabled: true,
			sensitivity: 1.8,
			minFreq: 20,
			maxFreq: 220,
			threshold: 150,
			energy: 0,
			drive: .7,
			peak: 140,
			weaveRate: 0
		},
		mid: {
			enabled: true,
			sensitivity: 1.7,
			minFreq: 220,
			maxFreq: 800,
			threshold: 85,
			energy: 0,
			drive: .65,
			peak: 95,
			weaveRate: 0
		},
		high: {
			enabled: true,
			sensitivity: 2.1,
			minFreq: 800,
			maxFreq: 6e3,
			threshold: 40,
			energy: 0,
			drive: .75,
			peak: 55,
			weaveRate: 0
		}
	};
	lastBeat = {
		bass: 0,
		mid: 0,
		high: 0
	};
	fluxHistory = [];
	bandFlux = {
		bass: [],
		mid: [],
		high: []
	};
	constructor() {
		this.audio = new Audio();
		this.audio.crossOrigin = "anonymous";
		this.audio.preload = "auto";
		this.audio.loop = true;
		this.audio.volume = .8;
	}
	ensureContext() {
		if (!this.context) {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			this.context = new Ctx({ latencyHint: "playback" });
			this.analyser = this.context.createAnalyser();
			this.analyser.fftSize = 2048;
			this.analyser.smoothingTimeConstant = .52;
			this.dataArray = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
			this.prevSpectrum = new Float32Array(this.analyser.frequencyBinCount);
			this.source = this.context.createMediaElementSource(this.audio);
			this.outputGain = this.context.createGain();
			this.outputGain.gain.value = this.muted ? 0 : this.speakerVolume;
			this.captureDest = this.context.createMediaStreamDestination();
			this.source.connect(this.analyser);
			this.analyser.connect(this.outputGain);
			this.analyser.connect(this.captureDest);
			this.outputGain.connect(this.context.destination);
			this.audio.volume = 1;
		}
		if (this.context.state === "suspended") this.context.resume();
	}
	loadFile(file) {
		this.revokeCurrent();
		this.objectUrl = URL.createObjectURL(file);
		this.audio.src = this.objectUrl;
		this.audio.load();
		this.trackName = file.name.replace(/\.[^.]+$/, "");
		this.trackId = "file";
		this.hasTrack = true;
		this.kickAnalysis();
	}
	loadLibrary(id) {
		const track = libraryTrack(id);
		if (!track) {
			this.loadDemo();
			return;
		}
		this.revokeCurrent();
		this.audio.src = track.src;
		this.audio.load();
		this.trackName = `${track.title} — ${track.composer}`;
		this.trackId = track.id;
		this.hasTrack = true;
		this.kickAnalysis();
	}
	loadDemo() {
		this.loadLibrary("danube");
	}
	loadGeneratedWaltz() {
		if (!this.demoUrl) this.demoUrl = URL.createObjectURL(createDemoTrackBlob());
		this.revokeCurrent(false);
		this.audio.src = this.demoUrl;
		this.audio.load();
		this.trackName = "The Blue Danube — generated";
		this.trackId = "generated";
		this.hasTrack = true;
		this.kickAnalysis();
	}
	play() {
		if (!this.audio.src) return;
		this.ensureContext();
		const playResult = this.audio.play();
		this.isPlaying = true;
		if (playResult && typeof playResult.then === "function") playResult.catch(() => {
			if (this.trackId !== "generated" && this.trackId === "danube") {
				this.loadGeneratedWaltz();
				this.audio.play().catch(() => {
					this.isPlaying = false;
				});
				return;
			}
			this.isPlaying = false;
		});
	}
	pause() {
		this.audio.pause();
		this.isPlaying = false;
	}
	stop() {
		this.pause();
		this.audio.currentTime = 0;
	}
	toggle() {
		if (this.isPlaying) this.pause();
		else this.play();
	}
	seek(percent) {
		const duration = this.audio.duration || 0;
		this.audio.currentTime = duration * percent;
		this.followMix(this.audio.currentTime, true);
	}
	setVolume(value) {
		const next = Math.min(1, Math.max(0, value));
		this.speakerVolume = next;
		this.muted = next <= .001;
		if (next > .001) this.preMuteVolume = next;
		this.applySpeakerGain();
	}
	toggleMute() {
		if (this.muted || this.speakerVolume <= .001) {
			this.muted = false;
			this.speakerVolume = this.preMuteVolume > .001 ? this.preMuteVolume : .8;
			this.applySpeakerGain();
			return;
		}
		this.preMuteVolume = this.speakerVolume;
		this.muted = true;
		this.applySpeakerGain();
	}
	captureStream() {
		this.ensureContext();
		return this.captureDest?.stream ?? new MediaStream();
	}
	applySpeakerGain() {
		const gain = this.muted ? 0 : this.speakerVolume;
		if (this.outputGain) {
			this.outputGain.gain.value = gain;
			this.audio.volume = 1;
			return;
		}
		this.audio.volume = gain;
	}
	setRate(value) {
		this.audio.playbackRate = Math.min(4, Math.max(.25, value));
	}
	setMaxWeave(value) {
		this.maxWeave = Math.min(24, Math.max(3, value));
	}
	setAutoMix(value) {
		this.autoMix = value;
		if (value) {
			this.locked = {
				bass: false,
				mid: false,
				high: false
			};
			this.followMix(this.audio.currentTime || 0, true);
			return;
		}
		this.mixNote = this.mixStatus === "live" ? note("mixNote.off") : this.mixNote;
	}
	lockBand(band) {
		this.locked[band] = true;
		this.refreshMixNote();
	}
	unlockBand(band) {
		this.locked[band] = false;
		this.followMix(this.audio.currentTime || 0, true);
	}
	followMix(time, snap = false) {
		if (!this.autoMix || !this.mixProfile || this.mixStatus !== "live") return;
		const { index, section } = sectionAt(this.mixProfile, time);
		this.mixIndex = index;
		this.mixVoice = section.voice;
		BANDS.forEach((key) => {
			this.playing[key] = section.playing[key];
			this.readiness[key] = section.readiness[key];
			const band = this.bands[key];
			band.peak = section.peak[key];
			if (this.locked[key]) return;
			const targetSens = section.sensitivity[key];
			const targetDrive = section.drive[key];
			if (snap) {
				band.sensitivity = targetSens;
				band.drive = targetDrive;
				return;
			}
			band.sensitivity += (targetSens - band.sensitivity) * .18;
			band.drive += (targetDrive - band.drive) * .18;
		});
		this.refreshMixNote();
	}
	update(delta) {
		if (!this.isPlaying || !this.rhythmEnabled || !this.analyser || !this.dataArray) {
			BANDS.forEach((key) => {
				this.bands[key].weaveRate = 0;
			});
			return;
		}
		this.analyser.getByteFrequencyData(this.dataArray);
		const now = performance.now();
		const nyquist = (this.context?.sampleRate ?? 44100) / 2;
		const binCount = this.analyser.frequencyBinCount;
		BANDS.forEach((key) => {
			const band = this.bands[key];
			band.energy = this.getBandEnergy(band.minFreq, band.maxFreq, nyquist, binCount);
		});
		for (const conn of this.wired) conn.energy = this.getBandEnergy(conn.minFreq, conn.maxFreq, nyquist, binCount);
		this.driveRates(delta, now);
		if (this.rhythmMode === "advanced") this.detectOnsets(now, nyquist, binCount);
		if (this.prevSpectrum && this.dataArray) this.prevSpectrum.set(this.dataArray);
	}
	registerConnection(connection, rhythmType = "all") {
		this.wired.add(connection);
		connection.rhythmType = rhythmType;
		connection.weaveAcc = 0;
		if (rhythmType !== "custom") {
			const [min, max] = hzForPreset(rhythmType);
			connection.minFreq = min;
			connection.maxFreq = max;
		}
	}
	removeConnection(connection) {
		this.wired.delete(connection);
	}
	driveRates(delta, now) {
		const dt = Math.min(.08, Math.max(0, delta));
		BANDS.forEach((key) => {
			const band = this.bands[key];
			band.weaveRate = band.enabled ? this.energyToRate(key, band.energy) : 0;
		});
		for (const conn of this.wired) {
			if (!this.rangeEnabled(conn)) {
				conn.weaveAcc = 0;
				continue;
			}
			const rate = this.rateForConnection(conn);
			conn.weaveAcc += rate * dt;
			if (conn.weaveAcc > 3) conn.weaveAcc = 3;
			let n = 0;
			while (conn.weaveAcc >= 1 && n < 4) {
				conn.weaveAcc -= 1;
				this.strike(conn, now);
				n += 1;
			}
		}
	}
	rateForConnection(conn) {
		const key = conn.rhythmType;
		if (key === "bass" || key === "mid" || key === "high") return this.bands[key].weaveRate;
		return this.energyToRateFromParams(conn.energy, this.averageGate(), this.averagePeak(), this.averageDrive());
	}
	energyToRate(key, energy) {
		const band = this.bands[key];
		const gate = this.gateFor(key);
		return this.energyToRateFromParams(energy, gate, band.peak, band.drive);
	}
	energyToRateFromParams(energy, gate, peak, drive) {
		const cap = 1 + Math.max(.15, drive) * (this.maxWeave - 1);
		if (energy <= gate) return 0;
		const span = Math.max(12, peak - gate);
		const t = clamp((energy - gate) / span, 0, 1);
		return Math.min(cap, .45 + Math.pow(t, .55) * (cap - .45));
	}
	gateFor(key) {
		const band = this.bands[key];
		return band.threshold * .82 / Math.max(.01, band.sensitivity);
	}
	averageGate() {
		const enabled = BANDS.filter((key) => this.bands[key].enabled);
		const keys = enabled.length ? enabled : BANDS;
		return keys.reduce((sum, key) => sum + this.gateFor(key), 0) / keys.length;
	}
	averagePeak() {
		const enabled = BANDS.filter((key) => this.bands[key].enabled);
		const keys = enabled.length ? enabled : BANDS;
		return keys.reduce((sum, key) => sum + this.bands[key].peak, 0) / keys.length;
	}
	averageDrive() {
		const enabled = BANDS.filter((key) => this.bands[key].enabled);
		const keys = enabled.length ? enabled : BANDS;
		return keys.reduce((sum, key) => sum + this.bands[key].drive, 0) / keys.length;
	}
	strike(conn, now) {
		conn.lastBeat = now;
		conn.addSegment();
	}
	rangeEnabled(conn) {
		if (conn.rhythmType === "all" || conn.rhythmType === "custom") return this.bands.bass.enabled || this.bands.mid.enabled || this.bands.high.enabled;
		if (conn.rhythmType === "bass" || conn.rhythmType === "mid" || conn.rhythmType === "high") return this.bands[conn.rhythmType].enabled;
		return true;
	}
	detectOnsets(now, nyquist, binCount) {
		if (!this.dataArray || !this.prevSpectrum) return;
		let flux = 0;
		for (let i = 0; i < binCount; i++) {
			const d = (this.dataArray[i] ?? 0) - (this.prevSpectrum[i] ?? 0);
			if (d > 0) flux += d;
		}
		this.fluxHistory.push(flux);
		if (this.fluxHistory.length > 36) this.fluxHistory.shift();
		const gMed = medianOf(this.fluxHistory);
		const gMad = madOf(this.fluxHistory, gMed);
		const globalGate = gMed + 2.1 / Math.max(.5, this.averageSensitivity()) * Math.max(gMad, 8);
		if (flux > globalGate && flux > 18) for (const conn of this.wired) {
			if (!this.rangeEnabled(conn)) continue;
			if (conn.rhythmType === "all" && now - conn.lastBeat > 70) {
				this.strike(conn, now);
				conn.weaveAcc += .35;
			}
		}
		for (const key of BANDS) {
			const band = this.bands[key];
			if (!band.enabled) continue;
			const bandFlux = this.spectralFlux(band.minFreq, band.maxFreq, nyquist, binCount);
			const hist = this.bandFlux[key];
			hist.push(bandFlux);
			if (hist.length > FLUX_LEN[key]) hist.shift();
			const med = medianOf(hist);
			const mad = madOf(hist, med);
			const gate = med + clamp(2.5 / Math.max(.5, band.sensitivity), .7, 3.1) * Math.max(mad, 1.1);
			const absMin = 6.5 / Math.max(.55, band.sensitivity);
			if (bandFlux > gate && bandFlux > absMin && now - this.lastBeat[key] > ONSET_COOLDOWN[key]) {
				this.lastBeat[key] = now;
				this.strikeBand(key, now, ONSET_COOLDOWN[key] - 20);
			}
		}
		for (const conn of this.wired) {
			if (!this.rangeEnabled(conn)) continue;
			if (conn.rhythmType !== "custom") continue;
			const threshold = this.averageGate();
			if (conn.energy > threshold && now - conn.lastBeat > 90) this.strike(conn, now);
		}
	}
	spectralFlux(minFreq, maxFreq, nyquist, binCount) {
		if (!this.dataArray || !this.prevSpectrum) return 0;
		const startBin = Math.max(0, Math.floor(minFreq / nyquist * binCount));
		const endBin = Math.min(binCount, Math.floor(maxFreq / nyquist * binCount));
		if (endBin <= startBin) return 0;
		let flux = 0;
		for (let i = startBin; i < endBin; i++) {
			const d = (this.dataArray[i] ?? 0) - (this.prevSpectrum[i] ?? 0);
			if (d > 0) flux += d;
		}
		return flux / (endBin - startBin);
	}
	strikeBand(key, now, minGap) {
		for (const conn of this.wired) {
			if (!this.rangeEnabled(conn)) continue;
			if (conn.rhythmType !== key) continue;
			if (now - conn.lastBeat > minGap) {
				this.strike(conn, now);
				conn.weaveAcc += .4;
			}
		}
	}
	averageSensitivity() {
		const vals = Object.values(this.bands).map((b) => b.sensitivity);
		return vals.reduce((a, b) => a + b, 0) / vals.length;
	}
	getBandEnergy(minFreq, maxFreq, nyquist, binCount) {
		if (!this.dataArray) return 0;
		const startBin = Math.max(0, Math.floor(minFreq / nyquist * binCount));
		const endBin = Math.min(binCount, Math.floor(maxFreq / nyquist * binCount));
		if (endBin <= startBin) return 0;
		let sum = 0;
		let sumSq = 0;
		for (let i = startBin; i < endBin; i++) {
			const v = this.dataArray[i] ?? 0;
			sum += v;
			sumSq += v * v;
		}
		const n = endBin - startBin;
		const mean = sum / n;
		const rms = Math.sqrt(sumSq / n);
		return .4 * mean + .6 * rms;
	}
	kickAnalysis() {
		this.mixAbort?.abort();
		this.mixProfile = null;
		this.mixIndex = 0;
		this.locked = {
			bass: false,
			mid: false,
			high: false
		};
		this.mixVoice = "";
		this.playing = {
			bass: false,
			mid: false,
			high: false
		};
		this.readiness = {
			bass: 0,
			mid: 0,
			high: 0
		};
		const src = this.audio.src;
		if (!src) {
			this.mixStatus = "idle";
			this.mixNote = EMPTY_NOTE;
			return;
		}
		this.mixStatus = "analyzing";
		this.mixNote = note("mixNote.analyzing");
		const abort = new AbortController();
		this.mixAbort = abort;
		this.runAnalysis(src, abort.signal);
	}
	async runAnalysis(src, signal) {
		try {
			const cached = mixCache.get(`${MIX_CACHE_VER}:${src}`);
			const profile = cached ?? await decodeAndAnalyze(src, signal);
			if (signal.aborted) return;
			if (!cached) mixCache.set(`${MIX_CACHE_VER}:${src}`, profile);
			this.mixProfile = profile;
			this.mixStatus = "live";
			this.followMix(this.audio.currentTime || 0, true);
		} catch (error) {
			if (signal.aborted || error instanceof DOMException && error.name === "AbortError") return;
			this.mixStatus = "failed";
			this.mixNote = note("mixNote.failed");
			this.mixProfile = null;
		}
	}
	refreshMixNote() {
		if (!this.autoMix) {
			this.mixNote = this.mixStatus === "live" ? note("mixNote.off") : this.mixNote;
			return;
		}
		if (this.mixStatus === "analyzing") {
			this.mixNote = note("mixNote.analyzing");
			return;
		}
		if (this.mixStatus !== "live" || !this.mixProfile) return;
		const section = this.mixProfile.sections[this.mixIndex];
		if (!section) {
			this.mixNote = note("mixNote.ready");
			return;
		}
		const n = this.mixProfile.sections.length;
		const span = `${formatTime(section.start)}–${formatTime(section.end)}`;
		const lockedCount = BANDS.filter((key) => this.locked[key]).length;
		if (lockedCount === 3) this.mixNote = note("mixNote.sectionAllLocked", {
			n: this.mixIndex + 1,
			total: n,
			span
		});
		else if (lockedCount) this.mixNote = note("mixNote.sectionLocked", {
			n: this.mixIndex + 1,
			total: n,
			span,
			locked: lockedCount
		});
		else this.mixNote = note("mixNote.section", {
			n: this.mixIndex + 1,
			total: n,
			span
		});
		this.mixVoice = section.voice;
	}
	revokeCurrent(includeDemo = true) {
		if (this.objectUrl) {
			URL.revokeObjectURL(this.objectUrl);
			this.objectUrl = null;
		}
		if (includeDemo && this.demoUrl) {
			URL.revokeObjectURL(this.demoUrl);
			this.demoUrl = null;
		}
	}
	dispose() {
		this.mixAbort?.abort();
		this.pause();
		this.revokeCurrent(true);
		this.wired.clear();
		this.source?.disconnect();
		this.analyser?.disconnect();
		this.outputGain?.disconnect();
		this.captureDest?.disconnect();
		this.context?.close();
		this.context = null;
	}
};
function medianOf(values) {
	const n = values.length;
	if (n === 0) return 0;
	const sorted = values.slice().sort((a, b) => a - b);
	const mid = n >> 1;
	return n % 2 ? sorted[mid] ?? 0 : .5 * ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0));
}
function madOf(values, med) {
	if (values.length === 0) return 0;
	return medianOf(values.map((v) => Math.abs(v - med)));
}
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
async function decodeAndAnalyze(src, signal) {
	const response = await fetch(src, { signal });
	if (!response.ok) throw new Error(`mix fetch ${response.status}`);
	const bytes = await response.arrayBuffer();
	if (signal.aborted) throw new DOMException("Aborted", "AbortError");
	return analyzeMixBuffer(await new OfflineAudioContext(1, 44100, 44100).decodeAudioData(bytes.slice(0)), signal);
}
var Connection = class {
	id = "";
	body1;
	body2;
	color;
	baseAlpha = 1;
	maxAge = 60;
	visible = true;
	rhythmType = "all";
	minFreq = 20;
	maxFreq = 8e3;
	energy = 0;
	lastBeat = 0;
	weaveAcc = 0;
	beatCallbacks = [];
	scene;
	segments = [];
	geometry;
	material;
	line;
	pos;
	col;
	_p1 = new Vector3();
	_p2 = new Vector3();
	maxSegments = 4e3;
	constructor(scene, body1, body2, color = 8978346, width = 2) {
		this.scene = scene;
		this.body1 = body1;
		this.body2 = body2;
		this.color = new Color(color);
		this.pos = new Float32Array(this.maxSegments * 6);
		this.col = new Float32Array(this.maxSegments * 6);
		this.geometry = new LineSegmentsGeometry();
		this.geometry.setPositions(this.pos);
		this.geometry.setColors(this.col);
		this.geometry.instanceCount = 0;
		this.material = new LineMaterial({
			color: 16777215,
			linewidth: width,
			vertexColors: true,
			transparent: true,
			blending: 2,
			depthWrite: false,
			toneMapped: false
		});
		this.line = new LineSegments2(this.geometry, this.material);
		this.line.frustumCulled = false;
		scene.add(this.line);
	}
	addSegment() {
		if (!this.visible) return;
		const p1 = this.body1.getWorldPosition(this._p1).clone();
		const p2 = this.body2.getWorldPosition(this._p2).clone();
		this.segments.push({
			p1,
			p2,
			time: performance.now()
		});
		if (this.segments.length > this.maxSegments) this.segments.splice(0, this.segments.length - this.maxSegments);
	}
	update() {
		const now = performance.now();
		if (this.maxAge > 0) {
			const maxMs = this.maxAge * 1e3;
			this.segments = this.segments.filter((seg) => now - seg.time <= maxMs);
		}
		const count = this.segments.length;
		const col = this.color;
		let drawn = 0;
		let v = 0;
		let c = 0;
		for (let i = 0; i < count; i++) {
			const seg = this.segments[i];
			const age = (now - seg.time) / 1e3;
			let fade = 1;
			if (this.maxAge > 0) fade = Math.max(0, 1 - age / this.maxAge);
			const alpha = fade * this.baseAlpha;
			if (alpha <= .01) continue;
			this.pos[v++] = seg.p1.x;
			this.pos[v++] = seg.p1.y;
			this.pos[v++] = seg.p1.z;
			this.pos[v++] = seg.p2.x;
			this.pos[v++] = seg.p2.y;
			this.pos[v++] = seg.p2.z;
			const r = col.r * alpha;
			const g = col.g * alpha;
			const b = col.b * alpha;
			this.col[c++] = r;
			this.col[c++] = g;
			this.col[c++] = b;
			this.col[c++] = r;
			this.col[c++] = g;
			this.col[c++] = b;
			drawn++;
		}
		const start = this.geometry.getAttribute("instanceStart");
		const colorStart = this.geometry.getAttribute("instanceColorStart");
		if (start) start.needsUpdate = true;
		if (colorStart) colorStart.needsUpdate = true;
		this.geometry.instanceCount = drawn;
		this.line.visible = this.visible && drawn > 0;
	}
	setColor(newColor) {
		this.color.set(newColor);
	}
	setBaseAlpha(alpha) {
		this.baseAlpha = MathUtils.clamp(alpha, 0, 1);
	}
	setWidth(width) {
		this.material.linewidth = Math.max(.25, width);
	}
	setVisible(isVisible) {
		this.visible = isVisible;
		this.line.visible = isVisible && this.segments.length > 0;
	}
	segmentCount() {
		return this.segments.length;
	}
	clear() {
		this.segments = [];
		this.weaveAcc = 0;
		this.geometry.instanceCount = 0;
		this.line.visible = false;
	}
	dispose() {
		this.scene.remove(this.line);
		this.geometry.dispose();
		this.material.dispose();
	}
};
var OrbitMath = class {
	static eccentricAnomaly(M, e, iterations = 12) {
		let E = M;
		for (let i = 0; i < iterations; i++) E = M + e * Math.sin(E);
		return E;
	}
	static trueAnomaly(E, e) {
		return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
	}
	static getPosition(semiMajor, eccentricity, meanAnomaly) {
		if (eccentricity < .001) return {
			x: semiMajor * Math.cos(meanAnomaly),
			z: semiMajor * Math.sin(meanAnomaly)
		};
		const E = this.eccentricAnomaly(meanAnomaly, eccentricity);
		const nu = this.trueAnomaly(E, eccentricity);
		const r = semiMajor * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(nu));
		return {
			x: r * Math.cos(nu),
			z: r * Math.sin(nu)
		};
	}
};
var OrbitPath = class {
	mesh;
	geometry;
	material;
	constructor(host, semiMajor, eccentricity = 0, color = 4500223, width = 1.5) {
		const points = [];
		const segments = 256;
		for (let i = 0; i <= segments; i++) {
			const theta = i / segments * Math.PI * 2;
			const pos = OrbitMath.getPosition(semiMajor, eccentricity, theta);
			points.push(new Vector3(pos.x, 0, pos.z));
		}
		this.geometry = new LineGeometry();
		this.geometry.setFromPoints(points);
		this.material = new LineMaterial({
			color,
			linewidth: width,
			transparent: true,
			opacity: .42,
			blending: 2,
			depthWrite: false,
			toneMapped: false
		});
		this.mesh = new Line2(this.geometry, this.material);
		host.add(this.mesh);
	}
	setColor(color) {
		this.material.color.set(color);
	}
	setWidth(width) {
		this.material.linewidth = Math.max(.25, width);
	}
	dispose() {
		this.mesh.parent?.remove(this.mesh);
		this.geometry.dispose();
		this.material.dispose();
	}
};
function hash(ix, iy, seed) {
	let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1274126177);
	n = Math.imul(n ^ n >>> 13, 1274126177);
	return ((n ^ n >>> 16) >>> 0) / 4294967296;
}
function noise2(x, y, seed) {
	const x0 = Math.floor(x);
	const y0 = Math.floor(y);
	const fx = x - x0;
	const fy = y - y0;
	const sx = fx * fx * (3 - 2 * fx);
	const sy = fy * fy * (3 - 2 * fy);
	const a = hash(x0, y0, seed);
	const b = hash(x0 + 1, y0, seed);
	const c = hash(x0, y0 + 1, seed);
	const d = hash(x0 + 1, y0 + 1, seed);
	return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function fbm(x, y, seed, octaves = 5) {
	let v = 0;
	let a = .5;
	let f = 1;
	let s = 0;
	for (let i = 0; i < octaves; i++) {
		v += a * noise2(x * f, y * f, seed + i * 19);
		s += a;
		a *= .5;
		f *= 2;
	}
	return v / s;
}
function mix(a, b, t) {
	return a + (b - a) * t;
}
function clamp01(v) {
	return Math.min(1, Math.max(0, v));
}
function lerpColor(a, b, t) {
	return [
		mix(a[0], b[0], t),
		mix(a[1], b[1], t),
		mix(a[2], b[2], t)
	];
}
function paintCanvas(width, height, paint) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return canvas;
	const img = ctx.createImageData(width, height);
	const data = img.data;
	for (let y = 0; y < height; y++) {
		const v = y / (height - 1);
		for (let x = 0; x < width; x++) {
			const c = paint(x / (width - 1), v, x, y);
			const i = (y * width + x) * 4;
			data[i] = c[0];
			data[i + 1] = c[1];
			data[i + 2] = c[2];
			data[i + 3] = c[3] ?? 255;
		}
	}
	ctx.putImageData(img, 0, 0);
	return canvas;
}
function toTexture(canvas, srgb = true) {
	const texture = new CanvasTexture(canvas);
	if (srgb) texture.colorSpace = SRGBColorSpace;
	texture.anisotropy = 8;
	texture.wrapS = RepeatWrapping;
	texture.wrapT = ClampToEdgeWrapping;
	texture.needsUpdate = true;
	return texture;
}
function cratered(u, v, seed, base, high) {
	const n = fbm(u * 8, v * 4, seed, 6);
	const crater = Math.pow(clamp01(1 - Math.abs(fbm(u * 14, v * 7, seed + 3, 3) - .55) * 8), 2);
	return lerpColor(base, high, clamp01(n * .75 + crater * .35));
}
function banded(u, v, seed, colors) {
	const band = (v + fbm(u * 6, v * 10, seed, 4) * .08 + fbm(u * 2, v * 18, seed + 2, 3) * .04) * colors.length;
	const i = Math.min(colors.length - 2, Math.max(0, Math.floor(band)));
	const t = band - i;
	return lerpColor(colors[i], colors[i + 1], t * t * (3 - 2 * t));
}
function createPlanetTexture(name, size = 512) {
	const w = size;
	const h = Math.floor(size / 2);
	const key = name.toLowerCase();
	return toTexture(paintCanvas(w, h, (u, v) => {
		if (key === "mercury") return cratered(u, v, 11, [
			90,
			82,
			74
		], [
			168,
			156,
			142
		]);
		if (key === "venus") return lerpColor([
			168,
			126,
			72
		], [
			214,
			186,
			132
		], fbm(u * 5, v * 4, 21, 6));
		if (key === "earth") {
			const n = fbm(u * 6, v * 3.2, 7, 6);
			if (v < .08 || v > .92 || v < .14 && n > .55 || v > .86 && n > .55) return lerpColor([
				210,
				224,
				232
			], [
				244,
				248,
				252
			], n);
			if (n > .54) return fbm(u * 9, v * 5, 9, 4) > .62 ? lerpColor([
				176,
				150,
				92
			], [
				140,
				122,
				72
			], n) : lerpColor([
				46,
				102,
				62
			], [
				92,
				140,
				78
			], n);
			return lerpColor([
				18,
				54,
				96
			], [
				42,
				108,
				148
			], n);
		}
		if (key === "moon") return cratered(u, v, 33, [
			92,
			92,
			94
		], [
			188,
			186,
			180
		]);
		if (key === "mars") {
			const n = fbm(u * 7, v * 4, 44, 6);
			if (v < .07 || v > .93) return [
				228,
				232,
				236
			];
			return lerpColor([
				128,
				52,
				32
			], [
				196,
				110,
				64
			], n);
		}
		if (key === "jupiter") return banded(u, v, 55, [
			[
				168,
				124,
				82
			],
			[
				214,
				178,
				128
			],
			[
				156,
				108,
				74
			],
			[
				228,
				204,
				164
			],
			[
				176,
				132,
				90
			],
			[
				210,
				168,
				120
			]
		]);
		if (key === "saturn") return banded(u, v, 66, [
			[
				196,
				176,
				128
			],
			[
				220,
				204,
				156
			],
			[
				186,
				164,
				116
			],
			[
				232,
				218,
				176
			]
		]);
		if (key === "uranus") return lerpColor([
			126,
			196,
			198
		], [
			168,
			220,
			214
		], fbm(u * 4, v * 3, 77, 4));
		if (key === "neptune") return lerpColor([
			32,
			72,
			148
		], [
			72,
			126,
			196
		], fbm(u * 5, v * 3, 88, 5));
		return cratered(u, v, 1, [
			80,
			80,
			80
		], [
			160,
			160,
			160
		]);
	}));
}
function createSunTexture(size = 512) {
	return toTexture(paintCanvas(size, Math.floor(size / 2), (u, v) => {
		const n = fbm(u * 8, v * 5, 99, 6);
		const gran = fbm(u * 22, v * 14, 101, 3);
		return lerpColor([
			232,
			140,
			48
		], [
			255,
			228,
			168
		], clamp01(n * .7 + gran * .3));
	}));
}
function createRingTexture(size = 512) {
	const texture = toTexture(paintCanvas(size, 64, (u) => {
		const r = Math.abs(u - .5) * 2;
		const gap = Math.abs(r - .42) < .03 || Math.abs(r - .7) < .015;
		const bands = .35 + .65 * Math.abs(Math.sin(u * Math.PI * 48));
		const n = fbm(u * 40, .5, 12, 3);
		const a = gap ? 0 : clamp01(.15 + bands * .75 * n) * 255;
		const col = lerpColor([
			210,
			196,
			160
		], [
			168,
			154,
			122
		], n);
		return [
			col[0],
			col[1],
			col[2],
			a
		];
	}));
	texture.wrapS = ClampToEdgeWrapping;
	return texture;
}
function createSkyTexture(kind, size = 1024) {
	const w = size;
	const h = Math.floor(size / 2);
	const texture = toTexture(paintCanvas(w, h, (u, v) => {
		let r = 5;
		let g = 6;
		let b = 10;
		if (kind === "milkyway") {
			const band = Math.exp(-Math.pow((v - .48) * 5.2, 2));
			const neb = fbm(u * 3.5, v * 2.2, 4, 5);
			const dust = fbm(u * 8, v * 4, 8, 4);
			r += (18 + neb * 42) * band;
			g += (22 + neb * 48) * band;
			b += (28 + dust * 36) * band;
		}
		const star = hash(Math.floor(u * w), Math.floor(v * h), 17);
		if (star > .996) {
			const br = 180 + (star - .996) * 18e3;
			r = Math.min(255, r + br);
			g = Math.min(255, g + br);
			b = Math.min(255, b + br * .92);
		}
		return [
			r,
			g,
			b
		];
	}));
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	return texture;
}
function createGlowTexture() {
	const size = 128;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
		g.addColorStop(0, "rgba(255, 236, 190, 1)");
		g.addColorStop(.25, "rgba(255, 180, 80, 0.55)");
		g.addColorStop(.6, "rgba(232, 120, 40, 0.12)");
		g.addColorStop(1, "rgba(0, 0, 0, 0)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, size, size);
	}
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	return texture;
}
var Planet = class {
	name;
	mesh;
	group;
	visible = true;
	semiMajor;
	originalEccentricity;
	eccentricity;
	orbitPath = null;
	parentBody = null;
	orbitSpeed;
	spinSpeed;
	meanAnomaly;
	map;
	ownsMap;
	ringTex = null;
	ownsRing = false;
	rings = null;
	ringBrightness = 1.4;
	atmosphere = null;
	clouds = null;
	selectionRing;
	_world = new Vector3();
	constructor(def, segments = 48, maps = {}) {
		this.name = def.name;
		this.semiMajor = def.semiMajor;
		this.orbitSpeed = def.orbitSpeed;
		this.originalEccentricity = def.eccentricity;
		this.eccentricity = def.eccentricity;
		this.spinSpeed = SPIN_RATES[def.name] ?? 3;
		this.meanAnomaly = Math.random() * Math.PI * 2;
		this.group = new Group();
		this.group.name = def.name;
		const geometry = new SphereGeometry(def.radius, segments, Math.max(24, Math.floor(segments * .7)));
		this.ownsMap = !maps.map;
		this.map = maps.map ?? createPlanetTexture(def.name);
		const material = new MeshStandardMaterial({
			map: this.map,
			roughness: .72,
			metalness: .04
		});
		this.mesh = new Mesh(geometry, material);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.group.add(this.mesh);
		if (maps.clouds) this.createClouds(def.radius, maps.clouds, segments);
		if (def.atmosphere) this.createAtmosphere(def.radius, def.name, maps.atmosphere);
		if (def.rings) this.createRings(def.radius, maps.rings);
		this.selectionRing = this.createSelectionRing(def.radius);
		this.mesh.add(this.selectionRing);
		this.setSelected(false);
		this.group.rotation.x = MathUtils.degToRad(def.axialTilt);
	}
	createClouds(radius, map, segments) {
		const geo = new SphereGeometry(radius * 1.025, segments, Math.max(24, Math.floor(segments * .7)));
		const mat = new MeshStandardMaterial({
			map,
			alphaMap: map,
			transparent: true,
			opacity: .92,
			depthWrite: false,
			roughness: 1,
			metalness: 0
		});
		this.clouds = new Mesh(geo, mat);
		this.mesh.add(this.clouds);
	}
	createAtmosphere(radius, name, map) {
		if (map) {
			const geo = new SphereGeometry(radius * 1.045, 48, 32);
			const mat = new MeshStandardMaterial({
				map,
				transparent: true,
				opacity: name === "Venus" ? .88 : .62,
				depthWrite: false,
				roughness: .9,
				metalness: 0
			});
			this.atmosphere = new Mesh(geo, mat);
			this.mesh.add(this.atmosphere);
			return;
		}
		const tint = name === "Venus" ? new Color(15255688) : name === "Uranus" ? new Color(10475732) : name === "Neptune" ? new Color(7250144) : new Color(10078440);
		const geo = new SphereGeometry(radius * 1.1, 32, 24);
		const mat = new ShaderMaterial({
			uniforms: { glowColor: { value: tint } },
			vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.6);
          gl_FragColor = vec4(glowColor, intensity * 0.55);
        }
      `,
			blending: 2,
			side: 1,
			transparent: true,
			depthWrite: false
		});
		this.atmosphere = new Mesh(geo, mat);
		this.mesh.add(this.atmosphere);
	}
	createRings(radius, map) {
		const inner = radius * 1.55;
		const outer = radius * 2.85;
		const geo = new RingGeometry(inner, outer, 96);
		const pos = geo.attributes.position;
		const uv = geo.attributes.uv;
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			const radial = (Math.hypot(x, y) - inner) / (outer - inner);
			uv.setXY(i, radial, .5);
		}
		uv.needsUpdate = true;
		this.ownsRing = !map;
		this.ringTex = map ?? createRingTexture();
		const mat = new MeshStandardMaterial({
			map: this.ringTex,
			alphaMap: this.ringTex,
			emissiveMap: this.ringTex,
			emissive: new Color(15918800),
			emissiveIntensity: 0,
			color: new Color(15920352),
			side: 2,
			transparent: true,
			roughness: .48,
			metalness: .05,
			depthWrite: false
		});
		this.rings = new Mesh(geo, mat);
		this.rings.rotation.x = Math.PI * .5;
		this.group.add(this.rings);
		this.applyRingBrightness();
	}
	setRingBrightness(value) {
		this.ringBrightness = Math.max(0, value);
		this.applyRingBrightness();
	}
	applyRingBrightness() {
		if (!this.rings) return;
		const mat = this.rings.material;
		const v = this.ringBrightness;
		const gain = .5 + v * .9;
		mat.color.setRGB(gain, gain * .96, gain * .86);
		mat.emissiveIntensity = v * .62;
		mat.opacity = Math.min(1, .35 + v * .45);
		mat.needsUpdate = true;
	}
	createSelectionRing(radius) {
		const geo = new RingGeometry(radius * 1.22, radius * 1.38, 64);
		const mat = new MeshBasicMaterial({
			color: 9425114,
			transparent: true,
			opacity: .85,
			side: 2,
			blending: 2,
			depthWrite: false
		});
		const ring = new Mesh(geo, mat);
		ring.rotation.x = Math.PI / 2;
		ring.visible = false;
		return ring;
	}
	applyTextures(maps) {
		if (maps.map && maps.map !== this.map) {
			if (this.ownsMap) this.map.dispose();
			this.map = maps.map;
			this.ownsMap = false;
			const material = this.mesh.material;
			material.map = this.map;
			material.needsUpdate = true;
		}
		const radius = this.mesh.geometry.parameters.radius;
		if (maps.clouds) {
			if (this.clouds) {
				const mat = this.clouds.material;
				mat.map = maps.clouds;
				mat.alphaMap = maps.clouds;
				mat.needsUpdate = true;
			} else this.createClouds(radius, maps.clouds, 48);
		}
		if (maps.atmosphere && this.atmosphere) {
			const mat = this.atmosphere.material;
			if (mat.map !== void 0) {
				mat.map = maps.atmosphere;
				mat.needsUpdate = true;
			}
		}
		if (maps.rings) {
			if (this.rings && this.ringTex !== maps.rings) {
				if (this.ownsRing) this.ringTex?.dispose();
				this.ringTex = maps.rings;
				this.ownsRing = false;
				const mat = this.rings.material;
				mat.map = maps.rings;
				mat.alphaMap = maps.rings;
				mat.emissiveMap = maps.rings;
				mat.needsUpdate = true;
				this.applyRingBrightness();
			}
		}
	}
	setSelected(isSelected) {
		this.selectionRing.visible = isSelected;
		const mat = this.mesh.material;
		mat.emissive = isSelected ? new Color(3828336) : new Color(0);
		mat.emissiveIntensity = isSelected ? .55 : 0;
	}
	update(delta, isCircular, simSpeed = 1, spinFactor = .01) {
		this.meanAnomaly += this.orbitSpeed * delta * 22;
		const ecc = isCircular ? 0 : this.originalEccentricity;
		const pos = OrbitMath.getPosition(this.semiMajor, ecc, this.meanAnomaly);
		this.group.position.x = pos.x;
		this.group.position.z = pos.z;
		this.mesh.rotation.y += this.spinSpeed * simSpeed * spinFactor * delta * 25;
		if (this.clouds) this.clouds.rotation.y += delta * .08;
		if (this.atmosphere && this.name === "Venus") this.atmosphere.rotation.y += delta * .03;
	}
	getWorldPosition(target = this._world) {
		return this.group.getWorldPosition(target);
	}
	setVisible(visible) {
		this.visible = visible;
		this.group.visible = visible;
		if (this.orbitPath) this.orbitPath.visible = visible;
	}
	resetAngle() {
		this.meanAnomaly = Math.random() * Math.PI * 2;
	}
	setOrbitPath(pathMesh) {
		this.orbitPath = pathMesh;
	}
	dispose() {
		this.group.parent?.remove(this.group);
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		if (this.ownsMap) this.map.dispose();
		this.selectionRing.geometry.dispose();
		this.selectionRing.material.dispose();
		if (this.atmosphere) {
			this.atmosphere.geometry.dispose();
			this.atmosphere.material.dispose();
		}
		if (this.clouds) {
			this.clouds.geometry.dispose();
			this.clouds.material.dispose();
		}
		if (this.rings) {
			this.rings.geometry.dispose();
			this.rings.material.dispose();
		}
		if (this.ownsRing) this.ringTex?.dispose();
	}
};
var Starfield = class {
	layers = [];
	geometries = [];
	materials = [];
	constructor(scene) {
		this.createLayer(scene, 2200, 1.1, .7, 2800, 3600);
		this.createLayer(scene, 3e3, .7, .45, 3600, 4300);
		this.createLayer(scene, 4e3, .4, .28, 4300, 4900);
	}
	createLayer(scene, count, size, opacity, minRadius, maxRadius) {
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const r = minRadius + Math.random() * (maxRadius - minRadius);
			const i3 = i * 3;
			positions[i3] = r * Math.sin(phi) * Math.cos(theta);
			positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			positions[i3 + 2] = r * Math.cos(phi);
			const warmth = Math.random();
			const b = .72 + Math.random() * .28;
			colors[i3] = b;
			colors[i3 + 1] = b * (.94 + warmth * .06);
			colors[i3 + 2] = b * (.9 + (1 - warmth) * .1);
		}
		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new BufferAttribute(positions, 3));
		geometry.setAttribute("color", new BufferAttribute(colors, 3));
		const material = new PointsMaterial({
			size,
			vertexColors: true,
			transparent: true,
			opacity,
			blending: 2,
			depthWrite: false,
			sizeAttenuation: true
		});
		const points = new Points(geometry, material);
		points.renderOrder = -1;
		points.frustumCulled = false;
		scene.add(points);
		this.layers.push(points);
		this.geometries.push(geometry);
		this.materials.push(material);
	}
	update(cameraPos, delta = 0) {
		this.layers.forEach((layer, i) => {
			const factor = 55e-5 * (i + 1);
			layer.position.x = -cameraPos.x * factor;
			layer.position.z = -cameraPos.z * factor;
			layer.rotation.y += delta * .003 * (i + 1);
		});
	}
	setVisible(visible) {
		for (const layer of this.layers) layer.visible = visible;
	}
	dispose() {
		for (const layer of this.layers) layer.parent?.remove(layer);
		for (const g of this.geometries) g.dispose();
		for (const m of this.materials) m.dispose();
		this.layers = [];
	}
};
var Sun = class {
	name = "Sun";
	mesh;
	group;
	visible = true;
	semiMajor = 0;
	originalEccentricity = 0;
	eccentricity = 0;
	orbitPath = null;
	parentBody = null;
	light;
	corona;
	glowTex;
	map;
	ownsMap;
	_world = new Vector3();
	pulse = 1;
	constructor(scene, map) {
		this.group = new Group();
		this.group.name = "Sun";
		this.ownsMap = !map;
		this.map = map ?? createSunTexture();
		const geometry = new SphereGeometry(38, 64, 48);
		const material = new MeshBasicMaterial({ map: this.map });
		this.mesh = new Mesh(geometry, material);
		this.group.add(this.mesh);
		this.light = new PointLight(16773584, 4.8, 0, 1.6);
		this.light.castShadow = true;
		this.light.shadow.mapSize.set(1024, 1024);
		this.light.shadow.camera.near = 40;
		this.light.shadow.camera.far = 1400;
		this.light.shadow.bias = -2e-4;
		this.group.add(this.light);
		this.glowTex = createGlowTexture();
		const spriteMat = new SpriteMaterial({
			map: this.glowTex,
			blending: 2,
			depthWrite: false,
			transparent: true,
			opacity: .9
		});
		this.corona = new Sprite(spriteMat);
		this.corona.scale.set(220, 220, 1);
		this.group.add(this.corona);
		scene.add(this.group);
	}
	setMap(map) {
		if (!map || map === this.map) return;
		if (this.ownsMap) this.map.dispose();
		this.map = map;
		this.ownsMap = false;
		const material = this.mesh.material;
		material.map = map;
		material.needsUpdate = true;
	}
	setPulse(amount) {
		this.pulse = MathUtils.lerp(this.pulse, 1 + amount * .18, .2);
		this.corona.scale.setScalar(220 * this.pulse);
		this.light.intensity = 4.8 + amount * 2.4;
	}
	update(delta) {
		this.mesh.rotation.y += delta * .045;
	}
	setSelected(selected) {
		this.corona.material.opacity = selected ? 1 : .9;
		this.corona.scale.setScalar(selected ? 248 : 220 * this.pulse);
	}
	setVisible(visible) {
		this.visible = visible;
		this.group.visible = visible;
	}
	getWorldPosition(target = this._world) {
		return this.group.getWorldPosition(target);
	}
	resetAngle() {}
	setOrbitPath(pathMesh) {
		this.orbitPath = pathMesh;
	}
	dispose() {
		this.group.parent?.remove(this.group);
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		if (this.ownsMap) this.map.dispose();
		this.glowTex.dispose();
		this.corona.material.dispose();
	}
};
var CACHE = "sss-hires-v3";
/**
* Highest Solar System Scope maps Wikimedia Commons actually hosts (CC BY 4.0).
* Direct SSS downloads are captcha-gated. Use upload.wikimedia.org (CORS *),
* not Special:FilePath (HTML redirects, no CORS). Uranus and Neptune have no
* map larger than 2K on SSS — those stay on the bundled 2K files.
*/
var HIRES_FILES = [
	{
		key: "saturnRing",
		url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Solarsystemscope_texture_8k_saturn_ring_alpha.png",
		label: "Saturn rings 8K"
	},
	{
		key: "venusAtmosphere",
		url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Solarsystemscope_texture_4k_venus_atmosphere.jpg",
		label: "Venus clouds 4K"
	},
	{
		key: "saturn",
		url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_8k_saturn.jpg",
		label: "Saturn 8K"
	},
	{
		key: "earth",
		url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg",
		label: "Earth 8K"
	},
	{
		key: "jupiter",
		url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Solarsystemscope_texture_8k_jupiter.jpg",
		label: "Jupiter 8K"
	},
	{
		key: "sun",
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Solarsystemscope_texture_8k_sun.jpg",
		label: "Sun 8K"
	},
	{
		key: "mars",
		url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Solarsystemscope_texture_8k_mars.jpg",
		label: "Mars 8K"
	},
	{
		key: "earthClouds",
		url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Solarsystemscope_texture_8k_earth_clouds.jpg",
		label: "Earth clouds 8K"
	},
	{
		key: "venus",
		url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Solarsystemscope_texture_8k_venus_surface.jpg",
		label: "Venus 8K"
	},
	{
		key: "mercury",
		url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Solarsystemscope_texture_8k_mercury.jpg",
		label: "Mercury 8K"
	},
	{
		key: "moon",
		url: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Solarsystemscope_texture_8k_moon.jpg",
		label: "Moon 8K"
	}
];
HIRES_FILES.length;
function kindFor(key) {
	if (key === "saturnRing") return "ring";
	if (key === "milkyway") return "sky";
	return "color";
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchBlob(url, signal) {
	let lastError = null;
	for (let attempt = 0; attempt < 3; attempt++) {
		if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
		try {
			const response = await fetch(url, {
				mode: "cors",
				signal,
				credentials: "omit"
			});
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
			lastError = error instanceof Error ? error : /* @__PURE__ */ new Error("fetch");
			if (error instanceof DOMException && error.name === "AbortError") throw error;
			await sleep(400 * 2 ** attempt);
		}
	}
	throw lastError ?? /* @__PURE__ */ new Error("fetch");
}
async function blobToTexture(blob, maxSize, kind) {
	if (typeof createImageBitmap === "function") {
		let bitmap = await createImageBitmap(blob);
		if (bitmap.width > maxSize) {
			const width = maxSize;
			const height = Math.max(1, Math.round(bitmap.height * (maxSize / bitmap.width)));
			const resized = await createImageBitmap(bitmap, {
				resizeWidth: width,
				resizeHeight: height
			});
			bitmap.close();
			bitmap = resized;
		}
		const tex = new Texture(bitmap);
		tex.needsUpdate = true;
		return configureTexture(tex, kind);
	}
	const objectUrl = URL.createObjectURL(blob);
	return new Promise((resolve, reject) => {
		new TextureLoader().load(objectUrl, (tex) => {
			URL.revokeObjectURL(objectUrl);
			resolve(configureTexture(tex, kind));
		}, void 0, () => {
			URL.revokeObjectURL(objectUrl);
			reject(/* @__PURE__ */ new Error("decode"));
		});
	});
}
async function loadCachedImage(url, maxSize, kind, signal) {
	const cache = await caches.open(CACHE);
	let response = await cache.match(url);
	if (!response?.ok) {
		const blob = await fetchBlob(url, signal);
		response = new Response(blob, { headers: {
			"Content-Type": blob.type || "image/jpeg",
			"Cache-Control": "max-age=31536000"
		} });
		try {
			await cache.put(url, response.clone());
		} catch {}
	}
	const blob = await response.blob();
	if (blob.size < 4096) throw new Error("empty");
	return blobToTexture(blob, maxSize, kind);
}
async function* fetchHiResMaps(maxSize = 8192, signal) {
	const total = HIRES_FILES.length;
	let done = 0;
	for (const entry of HIRES_FILES) {
		if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
		yield {
			key: entry.key,
			label: entry.label,
			tex: null,
			done,
			total,
			phase: "start"
		};
		try {
			const tex = await loadCachedImage(entry.url, maxSize, kindFor(entry.key), signal);
			done += 1;
			yield {
				key: entry.key,
				label: entry.label,
				tex,
				done,
				total,
				phase: "ok"
			};
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") throw error;
			done += 1;
			yield {
				key: entry.key,
				label: entry.label,
				tex: null,
				done,
				total,
				phase: "fail"
			};
		}
	}
}
var PALETTE = [
	9425114,
	9426104,
	15250620,
	13159636,
	10473680,
	13943976
];
var SceneManager = class {
	audio = new AudioManager();
	paused = false;
	uiHidden = false;
	speed = 1;
	spinFactor = .01;
	linesPerSec = 6;
	trailDuration = 60;
	pathWidth = 1.5;
	stringWidth = 2;
	orbitMode = "realistic";
	background = "milkyway";
	parallax = true;
	fps = 60;
	ready = false;
	ringBrightness = 1.4;
	container;
	scene;
	camera;
	renderer;
	composer = null;
	bloomPass = null;
	fxaaPass = null;
	controls;
	timer = new Timer();
	raycaster = new Raycaster();
	mouse = new Vector2();
	ambientLight;
	sun;
	starfield;
	bodies = [];
	paths = /* @__PURE__ */ new Map();
	connections = [];
	selected = [];
	pathColors = { ...PATH_COLORS };
	sky = null;
	skyMap = null;
	skyFromPack = false;
	pack;
	basePack;
	hiPack = null;
	hiRes = true;
	hiResNote = note("maps.fetching");
	autoOrbit = false;
	autoOrbitSpeed = .5;
	autoOrbitDir = "ccw";
	recording = false;
	recordNote = EMPTY_NOTE;
	videoAspect = "16:9";
	videoQuality = "1080";
	videoFps = "30";
	antialias = true;
	hiResBusy = false;
	ultraComplete = false;
	ultraAbort = null;
	connCount = 0;
	frameAcc = 0;
	pointer = {
		x: 0,
		y: 0,
		down: false,
		moved: false
	};
	ro = null;
	disposed = false;
	useBloom;
	capture = null;
	exportFrame = null;
	viewRestore = null;
	constructor(container, pack) {
		this.container = container;
		this.pack = pack ?? null;
		this.basePack = pack ?? null;
		const w = Math.max(1, container.clientWidth || window.innerWidth);
		const h = Math.max(1, container.clientHeight || window.innerHeight);
		const mobile = w < 700;
		const existingCanvas = container.querySelector("canvas");
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(50, w / h, .8, 9e3);
		this.camera.position.set(0, 220, 480);
		this.renderer = new WebGLRenderer({
			canvas: existingCanvas ?? void 0,
			antialias: !mobile,
			powerPreference: "high-performance",
			alpha: false,
			preserveDrawingBuffer: true
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2));
		this.renderer.setSize(w, h, false);
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.shadowMap.enabled = !mobile;
		this.renderer.shadowMap.type = 1;
		this.renderer.domElement.className = "block h-full w-full";
		this.renderer.domElement.style.touchAction = "none";
		if (!existingCanvas) this.container.appendChild(this.renderer.domElement);
		if (this.pack) {
			const ani = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
			for (const tex of Object.values(this.pack.maps)) tex.anisotropy = ani;
		}
		this.antialias = !mobile;
		this.useBloom = !mobile;
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.bloomPass = new UnrealBloomPass(new Vector2(w, h), .02, .55, .18);
		this.bloomPass.enabled = this.useBloom;
		this.composer.addPass(this.bloomPass);
		this.composer.addPass(new OutputPass());
		this.fxaaPass = new FXAAPass();
		this.fxaaPass.enabled = this.antialias;
		this.composer.addPass(this.fxaaPass);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = .08;
		this.controls.minDistance = 40;
		this.controls.maxDistance = 4200;
		this.controls.target.set(0, 0, 0);
		this.ambientLight = new AmbientLight(14213354, 1);
		this.scene.add(this.ambientLight);
		this.sun = new Sun(this.scene, this.pack?.maps.sun);
		this.starfield = new Starfield(this.scene);
		this.starfield.setVisible(this.parallax);
		this.createBodies();
		this.setRingBrightness(this.ringBrightness);
		this.seedDefaultWeave();
		this.updateBackground();
		this.bindPointer();
		this.ro = new ResizeObserver(() => this.onResize());
		this.ro.observe(this.container);
		document.addEventListener("visibilitychange", this.onVisibility);
		this.renderer.setAnimationLoop(() => this.tick());
		this.queueUltraMaps();
	}
	snapshot() {
		const a = this.audio;
		return {
			ready: this.ready,
			fps: this.fps,
			paused: this.paused,
			uiHidden: this.uiHidden,
			speed: this.speed,
			spinFactor: this.spinFactor,
			linesPerSec: this.linesPerSec,
			maxWeave: this.audio.maxWeave,
			trailDuration: this.trailDuration,
			pathWidth: this.pathWidth,
			stringWidth: this.stringWidth,
			orbitMode: this.orbitMode,
			background: this.background,
			parallax: this.parallax,
			ambient: this.ambientLight.intensity,
			bloom: this.bloomPass?.strength ?? 0,
			antialias: this.antialias,
			ringBrightness: this.ringBrightness,
			selectedCount: this.selected.length,
			canCreate: this.selected.length === 2,
			hiRes: this.hiRes,
			hiResNote: this.hiResNote,
			autoOrbit: this.autoOrbit,
			autoOrbitSpeed: this.autoOrbitSpeed,
			autoOrbitDir: this.autoOrbitDir,
			recording: this.recording,
			recordElapsed: this.capture?.elapsedSeconds() ?? 0,
			recordNote: this.recordNote,
			recordFormat: this.capture?.ext === "mp4" ? "MP4" : this.capture ? "WebM" : "",
			videoAspect: this.videoAspect,
			videoQuality: this.videoQuality,
			videoFps: this.videoFps,
			bodies: this.bodyRows(),
			connections: this.connRows(),
			audio: {
				trackName: a.trackName,
				trackId: a.trackId,
				hasTrack: a.hasTrack,
				playing: a.isPlaying,
				muted: a.muted,
				current: a.audio.currentTime || 0,
				duration: Number.isFinite(a.audio.duration) ? a.audio.duration : 0,
				volume: a.speakerVolume,
				rate: a.audio.playbackRate,
				rhythmEnabled: a.rhythmEnabled,
				rhythmMode: a.rhythmMode,
				autoMix: a.autoMix,
				mixStatus: a.mixStatus,
				mixNote: a.mixNote,
				mixVoice: a.mixVoice,
				bands: {
					bass: {
						enabled: a.bands.bass.enabled,
						sensitivity: a.bands.bass.sensitivity,
						energy: a.bands.bass.energy,
						locked: a.locked.bass,
						playing: a.playing.bass,
						readiness: a.readiness.bass,
						weaveRate: a.bands.bass.weaveRate
					},
					mid: {
						enabled: a.bands.mid.enabled,
						sensitivity: a.bands.mid.sensitivity,
						energy: a.bands.mid.energy,
						locked: a.locked.mid,
						playing: a.playing.mid,
						readiness: a.readiness.mid,
						weaveRate: a.bands.mid.weaveRate
					},
					high: {
						enabled: a.bands.high.enabled,
						sensitivity: a.bands.high.sensitivity,
						energy: a.bands.high.energy,
						locked: a.locked.high,
						playing: a.playing.high,
						readiness: a.readiness.high,
						weaveRate: a.bands.high.weaveRate
					}
				}
			}
		};
	}
	setPaused(value) {
		this.paused = value;
	}
	togglePaused() {
		this.paused = !this.paused;
	}
	setSpeed(value) {
		this.speed = Math.max(0, value);
	}
	setSpinFactor(value) {
		this.spinFactor = Math.max(0, value);
	}
	setLinesPerSec(value) {
		this.linesPerSec = Math.max(.1, value);
	}
	setMaxWeave(value) {
		this.audio.setMaxWeave(value);
	}
	setTrailDuration(value) {
		this.trailDuration = Math.max(0, value);
	}
	setPathWidth(value) {
		this.pathWidth = MathUtils.clamp(value, .25, 16);
		for (const path of this.paths.values()) path.setWidth(this.pathWidth);
	}
	setStringWidth(value) {
		this.stringWidth = MathUtils.clamp(value, .25, 24);
		for (const conn of this.connections) conn.setWidth(this.stringWidth);
	}
	setOrbitMode(mode) {
		if (mode === "hidden") {
			this.orbitMode = "hidden";
			this.applyPathVisibility();
			return;
		}
		const circular = mode === "circular";
		const changed = this.orbitMode === "circular" !== circular;
		this.orbitMode = circular ? "circular" : "realistic";
		if (changed) this.recreatePaths();
		else this.applyPathVisibility();
	}
	setBackground(type) {
		this.background = type;
		this.updateBackground();
	}
	setParallax(value) {
		this.parallax = value;
		this.starfield.setVisible(value);
	}
	setAmbient(value) {
		this.ambientLight.intensity = Math.max(0, value);
	}
	setBloom(value) {
		if (this.bloomPass) this.bloomPass.strength = Math.max(0, value);
	}
	setAntialias(value) {
		this.antialias = value;
		if (this.fxaaPass) this.fxaaPass.enabled = value;
	}
	setRingBrightness(value) {
		this.ringBrightness = Math.max(0, value);
		for (const body of this.bodies) if (body instanceof Planet) body.setRingBrightness(this.ringBrightness);
	}
	toggleUi() {
		this.uiHidden = !this.uiHidden;
	}
	resetPlanets() {
		for (const body of this.bodies) body.resetAngle();
		this.selected = [];
		this.updateHighlights();
		this.clearTrails();
	}
	clearTrails() {
		for (const conn of this.connections) conn.clear();
	}
	trailCount() {
		return this.connections.reduce((sum, conn) => sum + conn.segmentCount(), 0);
	}
	toggleSelectionByName(name) {
		const body = this.bodies.find((b) => b.name === name);
		if (body) this.toggleSelection(body);
	}
	setBodyVisibility(name, visible) {
		const body = this.bodies.find((b) => b.name === name);
		if (!body) return;
		body.setVisible(visible);
		if (!visible) this.selected = this.selected.filter((b) => b !== body);
		this.applyPathVisibility();
		this.updateHighlights();
	}
	setPlanetPathColor(name, color) {
		const key = name.toLowerCase();
		const hex = `#${new Color(color).getHexString()}`;
		this.pathColors[key] = hex;
		this.paths.get(key)?.setColor(hex);
	}
	createConnection() {
		if (this.selected.length !== 2) return null;
		const [a, b] = this.selected;
		if (!a || !b) return null;
		const conn = this.connectBodies(a, b, "all", PALETTE[this.connCount % PALETTE.length]);
		this.selected = [];
		this.updateHighlights();
		return conn;
	}
	removeConnection(id) {
		const index = this.connections.findIndex((c) => c.id === id);
		if (index < 0) return;
		const conn = this.connections[index];
		this.audio.removeConnection(conn);
		conn.dispose();
		this.connections.splice(index, 1);
	}
	setConnectionColor(id, color, alpha) {
		const conn = this.connections.find((c) => c.id === id);
		if (!conn) return;
		conn.setColor(color);
		if (alpha !== void 0) conn.setBaseAlpha(alpha);
	}
	setConnectionVisibility(id, visible) {
		this.connections.find((c) => c.id === id)?.setVisible(visible);
	}
	setConnectionRhythmType(id, rhythmType) {
		const conn = this.connections.find((c) => c.id === id);
		if (!conn) return;
		this.audio.removeConnection(conn);
		conn.rhythmType = rhythmType;
		if (rhythmType !== "custom") {
			const [min, max] = hzForPreset(rhythmType);
			conn.minFreq = min;
			conn.maxFreq = max;
		}
		this.audio.registerConnection(conn, rhythmType);
	}
	seedDefaultWeave() {
		for (const pair of DEFAULT_WEAVE) {
			const a = this.bodies.find((b) => b.name === pair.a);
			const b = this.bodies.find((b) => b.name === pair.b);
			if (a && b) this.connectBodies(a, b, pair.rhythm, pair.color);
		}
	}
	weaveIfEmpty() {
		if (this.connections.length === 0) this.seedDefaultWeave();
	}
	loadFile(file) {
		this.audio.loadFile(file);
		this.weaveIfEmpty();
		this.clearTrails();
	}
	loadLibrary(id) {
		this.audio.loadLibrary(id);
		this.weaveIfEmpty();
		this.clearTrails();
	}
	loadDemo() {
		this.audio.loadDemo();
		this.weaveIfEmpty();
		this.clearTrails();
	}
	toggleMute() {
		this.audio.toggleMute();
	}
	setConnectionFreq(id, minFreq, maxFreq) {
		const conn = this.connections.find((c) => c.id === id);
		if (!conn) return;
		conn.minFreq = Math.min(minFreq, maxFreq);
		conn.maxFreq = Math.max(minFreq, maxFreq);
		conn.rhythmType = presetFromHz(conn.minFreq, conn.maxFreq);
	}
	async setHiRes(enabled) {
		if (!enabled) {
			this.ultraAbort?.abort();
			this.ultraAbort = null;
			this.hiResBusy = false;
			this.hiRes = false;
			this.hiResNote = note("maps.twoK");
			this.pack = this.basePack;
			this.applyCurrentPack();
			try {
				localStorage.setItem("viz-hires", "0");
			} catch {}
			return;
		}
		if (this.hiResBusy) return;
		if (this.hiPack && this.ultraComplete) {
			this.hiRes = true;
			this.pack = this.hiPack;
			this.applyCurrentPack();
			this.hiResNote = note("maps.ready");
			try {
				localStorage.setItem("viz-hires", "1");
			} catch {}
			return;
		}
		if (!this.basePack) return;
		this.hiResBusy = true;
		this.hiRes = true;
		this.hiResNote = note("maps.fetching");
		try {
			localStorage.setItem("viz-hires", "1");
		} catch {}
		this.ultraAbort?.abort();
		this.ultraAbort = new AbortController();
		const { signal } = this.ultraAbort;
		const fallback = this.basePack;
		if (!this.hiPack) {
			const maps = { ...fallback.maps };
			this.hiPack = {
				maps,
				body: (name) => {
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
				dispose: () => {
					const keep = new Set(Object.values(fallback.maps));
					for (const tex of Object.values(maps)) if (!keep.has(tex)) tex.dispose();
				}
			};
		}
		this.pack = this.hiPack;
		const maps = this.hiPack.maps;
		const maxSize = Math.min(8192, this.renderer.capabilities.maxTextureSize || 4096);
		let applied = 0;
		try {
			for await (const step of fetchHiResMaps(maxSize, signal)) {
				if (this.disposed || signal.aborted) return;
				if (step.phase === "start") {
					this.hiResNote = note("maps.fetchingItem", {
						n: step.done + 1,
						total: step.total,
						map: step.key
					});
					continue;
				}
				if (step.phase !== "ok" || !step.tex) {
					this.hiResNote = note("maps.skipped", {
						n: step.done,
						total: step.total,
						map: step.key
					});
					continue;
				}
				const current = maps[step.key];
				if (current && current !== fallback.maps[step.key]) {
					step.tex.dispose();
					applied += 1;
					this.hiResNote = note("maps.ultraItem", {
						n: step.done,
						total: step.total,
						map: step.key
					});
					continue;
				}
				maps[step.key] = step.tex;
				this.applyMapKey(step.key);
				applied += 1;
				this.hiResNote = note("maps.ultraItem", {
					n: step.done,
					total: step.total,
					map: step.key
				});
			}
			if (this.disposed || signal.aborted) return;
			this.hiResNote = applied > 0 ? note("maps.ready") : note("maps.unavailable");
			this.ultraComplete = applied > 0;
		} catch {
			if (signal.aborted || this.disposed) return;
			this.hiResNote = applied > 0 ? note("maps.ready") : note("maps.failed");
		} finally {
			this.hiResBusy = false;
		}
	}
	queueUltraMaps() {
		let prefer = true;
		try {
			prefer = localStorage.getItem("viz-hires") !== "0";
		} catch {
			prefer = true;
		}
		if (!prefer) {
			this.hiRes = false;
			this.hiResNote = note("maps.twoK");
			return;
		}
		this.setHiRes(true);
	}
	applyMapKey(key) {
		const pack = this.pack;
		if (!pack) return;
		if (key === "sun") {
			this.sun.setMap(pack.maps.sun);
			return;
		}
		const name = {
			mercury: "Mercury",
			venus: "Venus",
			venusAtmosphere: "Venus",
			earth: "Earth",
			earthClouds: "Earth",
			moon: "Moon",
			mars: "Mars",
			jupiter: "Jupiter",
			saturn: "Saturn",
			saturnRing: "Saturn",
			uranus: "Uranus",
			neptune: "Neptune"
		}[key];
		if (!name) return;
		const body = this.bodies.find((item) => item.name === name);
		if (body instanceof Planet) body.applyTextures(pack.body(name));
	}
	applyCurrentPack() {
		const pack = this.pack;
		if (!pack) return;
		this.sun.setMap(pack.maps.sun);
		for (const body of this.bodies) if (body instanceof Planet) body.applyTextures(pack.body(body.name));
		if (this.background === "milkyway") this.updateBackground();
	}
	playAudio() {
		this.audio.play();
	}
	toggleAudio() {
		this.audio.toggle();
	}
	seekAudio(percent) {
		this.audio.seek(percent);
	}
	setVolume(value) {
		this.audio.setVolume(value);
	}
	setRate(value) {
		this.audio.setRate(value);
	}
	setRhythmEnabled(value) {
		this.audio.rhythmEnabled = value;
	}
	setRhythmMode(mode) {
		this.audio.rhythmMode = mode;
	}
	setBandEnabled(band, enabled) {
		this.audio.bands[band].enabled = enabled;
	}
	setBandSensitivity(band, value) {
		this.audio.bands[band].sensitivity = value;
		this.audio.lockBand(band);
	}
	setAutoMix(value) {
		this.audio.setAutoMix(value);
	}
	lockBand(band) {
		this.audio.lockBand(band);
	}
	unlockBand(band) {
		this.audio.unlockBand(band);
	}
	setAutoOrbit(value) {
		this.autoOrbit = value;
		this.applyOrbitSpin();
	}
	setAutoOrbitSpeed(value) {
		this.autoOrbitSpeed = Math.min(3, Math.max(.15, value));
		this.applyOrbitSpin();
	}
	setAutoOrbitDir(dir) {
		this.autoOrbitDir = dir;
		this.applyOrbitSpin();
	}
	applyOrbitSpin() {
		this.controls.autoRotate = this.autoOrbit;
		const sign = this.autoOrbitDir === "ccw" ? 1 : -1;
		this.controls.autoRotateSpeed = this.autoOrbitSpeed * sign;
	}
	setVideoAspect(aspect) {
		this.videoAspect = aspect;
	}
	setVideoQuality(quality) {
		this.videoQuality = quality;
	}
	setVideoFps(fps) {
		this.videoFps = fps;
	}
	startRecording(aspect, quality) {
		if (this.recording) return;
		if (aspect) this.videoAspect = aspect;
		if (quality) this.videoQuality = quality;
		const raw = exportSize(this.videoAspect, this.videoQuality);
		const { width, height } = this.clampExportSize(raw.width, raw.height);
		const fps = fpsValue(this.videoFps);
		this.prepareExportFrame(width, height);
		this.audio.ensureContext();
		if (this.composer) this.composer.render();
		else this.renderer.render(this.scene, this.camera);
		const session = new CaptureSession();
		if (!session.start(this.renderer.domElement, this.audio.captureStream(), width, height, fps)) {
			this.restoreExportFrame();
			this.recordNote = session.note.key ? session.note : note("record.noSupport");
			return;
		}
		this.capture = session;
		this.recording = true;
		this.recordNote = session.note;
	}
	async stopRecording() {
		if (!this.recording && !this.capture) return;
		this.recording = false;
		const session = this.capture;
		this.capture = null;
		this.restoreExportFrame();
		if (!session) return;
		const result = await session.stop();
		if (!result) {
			this.recordNote = note("record.nothing");
			return;
		}
		const name = stampFilename(result.ext, this.audio.trackName);
		downloadBlob(result.blob, name);
		this.recordNote = note("record.saved", { name });
	}
	zoomBy(factor) {
		const viewDir = new Vector3().subVectors(this.camera.position, this.controls.target);
		const next = MathUtils.clamp(viewDir.length() * factor, this.controls.minDistance, this.controls.maxDistance);
		viewDir.setLength(next);
		this.camera.position.copy(this.controls.target).add(viewDir);
		this.controls.update();
	}
	onResize() {
		if (this.disposed) return;
		if (this.exportFrame) {
			this.fitExportCss(this.exportFrame.width, this.exportFrame.height);
			return;
		}
		const w = Math.max(1, this.container.clientWidth);
		const h = Math.max(1, this.container.clientHeight);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(w, h, false);
		this.composer?.setSize(w, h);
		this.bloomPass?.setSize(w, h);
	}
	clampExportSize(width, height) {
		const max = Math.min(this.renderer.capabilities.maxTextureSize || 8192, 8192);
		if (width <= max && height <= max) return {
			width,
			height
		};
		const scale = max / Math.max(width, height);
		return {
			width: Math.max(2, Math.round(width * scale / 2) * 2),
			height: Math.max(2, Math.round(height * scale / 2) * 2)
		};
	}
	prepareExportFrame(width, height) {
		const canvas = this.renderer.domElement;
		this.viewRestore = {
			width: Math.max(1, this.container.clientWidth),
			height: Math.max(1, this.container.clientHeight),
			pixelRatio: this.renderer.getPixelRatio()
		};
		this.exportFrame = {
			width,
			height
		};
		this.renderer.setPixelRatio(1);
		this.renderer.setSize(width, height, false);
		this.composer?.setSize(width, height);
		this.bloomPass?.setSize(width, height);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.fitExportCss(width, height);
		canvas.style.background = "var(--color-bg)";
	}
	restoreExportFrame() {
		const restore = this.viewRestore;
		this.exportFrame = null;
		this.viewRestore = null;
		const canvas = this.renderer.domElement;
		canvas.style.position = "";
		canvas.style.left = "";
		canvas.style.top = "";
		canvas.style.transform = "";
		canvas.style.width = "";
		canvas.style.height = "";
		canvas.style.background = "";
		canvas.className = "block h-full w-full";
		const w = Math.max(1, this.container.clientWidth);
		const h = Math.max(1, this.container.clientHeight);
		this.renderer.setPixelRatio(restore?.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2));
		this.renderer.setSize(w, h, false);
		this.composer?.setSize(w, h);
		this.bloomPass?.setSize(w, h);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
	}
	fitExportCss(width, height) {
		const canvas = this.renderer.domElement;
		const cw = Math.max(1, this.container.clientWidth);
		const ch = Math.max(1, this.container.clientHeight);
		const frameAspect = width / height;
		const boxAspect = cw / ch;
		let cssW;
		let cssH;
		if (boxAspect > frameAspect) {
			cssH = ch;
			cssW = ch * frameAspect;
		} else {
			cssW = cw;
			cssH = cw / frameAspect;
		}
		canvas.style.position = "absolute";
		canvas.style.left = "50%";
		canvas.style.top = "50%";
		canvas.style.transform = "translate(-50%, -50%)";
		canvas.style.width = `${Math.round(cssW)}px`;
		canvas.style.height = `${Math.round(cssH)}px`;
	}
	dispose() {
		this.disposed = true;
		this.ultraAbort?.abort();
		if (this.capture) {
			this.capture.stop();
			this.capture = null;
			this.recording = false;
			this.restoreExportFrame();
		}
		this.renderer.setAnimationLoop(null);
		this.ro?.disconnect();
		document.removeEventListener("visibilitychange", this.onVisibility);
		this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
		this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
		this.renderer.domElement.removeEventListener("pointerup", this.onPointerUp);
		this.renderer.domElement.removeEventListener("pointercancel", this.onPointerUp);
		this.renderer.domElement.removeEventListener("contextmenu", this.onContextMenu);
		for (const conn of this.connections) {
			this.audio.removeConnection(conn);
			conn.dispose();
		}
		this.connections = [];
		for (const path of this.paths.values()) path.dispose();
		this.paths.clear();
		for (const body of this.bodies) body.dispose();
		this.starfield.dispose();
		this.clearSky();
		this.hiPack?.dispose();
		this.hiPack = null;
		this.controls.dispose();
		this.composer?.dispose();
		this.renderer.dispose();
		if (!this.renderer.domElement.hasAttribute("aria-hidden")) this.renderer.domElement.remove();
		this.audio.dispose();
	}
	tick = () => {
		if (this.disposed) return;
		this.timer.update();
		const delta = Math.min(this.timer.getDelta(), .1);
		this.fps = MathUtils.lerp(this.fps, 1 / Math.max(delta, 1 / 240), .08);
		this.controls.update();
		this.audio.followMix(this.audio.audio.currentTime || 0);
		if (!this.paused) {
			const simDelta = delta * this.speed;
			if (this.parallax) this.starfield.update(this.camera.position, delta);
			for (const body of this.bodies) body.update(simDelta, this.orbitMode === "circular", this.speed, this.spinFactor);
			this.audio.update(delta);
			this.sun.setPulse(this.audio.isPlaying ? this.audio.bands.bass.energy / 220 : 0);
			if (!(this.audio.isPlaying && this.audio.rhythmEnabled)) {
				this.frameAcc += delta;
				const interval = 1 / Math.max(this.linesPerSec, .05);
				while (this.frameAcc >= interval) {
					this.frameAcc -= interval;
					for (const conn of this.connections) conn.addSegment();
				}
			}
		}
		for (const conn of this.connections) {
			conn.maxAge = this.trailDuration;
			conn.update();
		}
		if (this.composer) this.composer.render();
		else this.renderer.render(this.scene, this.camera);
		this.ready = true;
	};
	createBodies() {
		this.bodies = [this.sun];
		const byName = /* @__PURE__ */ new Map();
		byName.set("sun", this.sun);
		const segments = (this.container.clientWidth || window.innerWidth) < 700 ? 32 : 64;
		for (const def of PLANET_DEFS) {
			const planet = new Planet(def, segments, this.pack?.body(def.name) ?? {});
			const parent = def.parent ? byName.get(def.parent.toLowerCase()) : null;
			planet.parentBody = parent ?? null;
			if (parent?.group) parent.group.add(planet.group);
			else this.scene.add(planet.group);
			if (def.semiMajor > 0) {
				const host = parent?.group ?? this.scene;
				const ecc = this.orbitMode === "circular" ? 0 : def.eccentricity;
				const color = this.pathColors[def.name.toLowerCase()] ?? "#8aa4b8";
				const path = new OrbitPath(host, def.semiMajor, ecc, new Color(color).getHex(), this.pathWidth);
				planet.setOrbitPath(path.mesh);
				this.paths.set(def.name.toLowerCase(), path);
			}
			byName.set(def.name.toLowerCase(), planet);
			this.bodies.push(planet);
		}
		this.applyPathVisibility();
	}
	recreatePaths() {
		for (const path of this.paths.values()) path.dispose();
		this.paths.clear();
		for (const body of this.bodies) {
			if (body === this.sun || body.semiMajor <= 0) continue;
			const ecc = this.orbitMode === "circular" ? 0 : body.originalEccentricity;
			const host = body.parentBody?.group ?? this.scene;
			const color = this.pathColors[body.name.toLowerCase()] ?? "#8aa4b8";
			const path = new OrbitPath(host, body.semiMajor, ecc, new Color(color).getHex(), this.pathWidth);
			body.setOrbitPath(path.mesh);
			this.paths.set(body.name.toLowerCase(), path);
		}
		this.applyPathVisibility();
	}
	applyPathVisibility() {
		const visible = this.orbitMode !== "hidden";
		for (const body of this.bodies) if (body.orbitPath) body.orbitPath.visible = visible && body.visible;
	}
	connectBodies(a, b, rhythm, color) {
		if (this.connections.some((c) => c.body1 === a && c.body2 === b || c.body1 === b && c.body2 === a)) return null;
		const conn = new Connection(this.scene, a, b, color, this.stringWidth);
		conn.id = `conn-${++this.connCount}`;
		conn.maxAge = this.trailDuration;
		conn.rhythmType = rhythm;
		this.connections.push(conn);
		this.audio.registerConnection(conn, rhythm);
		return conn;
	}
	toggleSelection(planet) {
		if (planet.visible === false) return;
		const index = this.selected.indexOf(planet);
		if (index >= 0) this.selected.splice(index, 1);
		else if (this.selected.length < 2) this.selected.push(planet);
		this.updateHighlights();
	}
	updateHighlights() {
		for (const body of this.bodies) body.setSelected(this.selected.includes(body));
	}
	bodyRows() {
		return this.bodies.map((b) => ({
			name: b.name,
			selected: this.selected.includes(b),
			visible: b.visible,
			pathColor: this.pathColors[b.name.toLowerCase()] ?? "#8aa4b8",
			hasPath: Boolean(b.orbitPath) && this.orbitMode !== "hidden"
		}));
	}
	connRows() {
		return this.connections.map((c) => ({
			id: c.id,
			a: c.body1.name,
			b: c.body2.name,
			color: `#${c.color.getHexString()}`,
			alpha: c.baseAlpha,
			visible: c.visible,
			rhythmType: c.rhythmType,
			minFreq: c.minFreq,
			maxFreq: c.maxFreq
		}));
	}
	updateBackground() {
		this.clearSky();
		if (this.background === "none") {
			this.scene.background = new Color(460812);
			return;
		}
		this.scene.background = null;
		const packSky = this.background === "milkyway" ? this.pack?.maps.milkyway : void 0;
		this.skyFromPack = Boolean(packSky);
		this.skyMap = packSky ?? createSkyTexture(this.background, 1024);
		const geo = new SphereGeometry(5200, this.skyFromPack ? 96 : 48, this.skyFromPack ? 64 : 32);
		const mat = new MeshBasicMaterial({
			map: this.skyMap,
			side: 1,
			depthWrite: false
		});
		this.sky = new Mesh(geo, mat);
		this.sky.renderOrder = -2;
		this.scene.add(this.sky);
	}
	clearSky() {
		if (this.sky) {
			this.scene.remove(this.sky);
			this.sky.geometry.dispose();
			this.sky.material.dispose();
			this.sky = null;
		}
		if (this.skyMap && !this.skyFromPack) this.skyMap.dispose();
		this.skyMap = null;
		this.skyFromPack = false;
	}
	bindPointer() {
		const el = this.renderer.domElement;
		el.addEventListener("pointerdown", this.onPointerDown);
		el.addEventListener("pointermove", this.onPointerMove);
		el.addEventListener("pointerup", this.onPointerUp);
		el.addEventListener("pointercancel", this.onPointerUp);
		el.addEventListener("contextmenu", this.onContextMenu);
	}
	onPointerDown = (event) => {
		this.pointer.x = event.clientX;
		this.pointer.y = event.clientY;
		this.pointer.down = true;
		this.pointer.moved = false;
	};
	onPointerMove = (event) => {
		if (!this.pointer.down) return;
		const dx = event.clientX - this.pointer.x;
		const dy = event.clientY - this.pointer.y;
		if (dx * dx + dy * dy > 16) this.pointer.moved = true;
	};
	onPointerUp = (event) => {
		if (!this.pointer.down) return;
		this.pointer.down = false;
		if (this.pointer.moved) return;
		if (event.button !== 0) return;
		this.pick(event);
	};
	onContextMenu = (event) => {
		event.preventDefault();
		if (this.selected.length === 2) {
			this.createConnection();
			return;
		}
		this.pick(event);
		if (this.selected.length === 2) this.createConnection();
	};
	pick(event) {
		const rect = this.renderer.domElement.getBoundingClientRect();
		this.mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const meshes = this.bodies.map((b) => b.mesh);
		const hits = this.raycaster.intersectObjects(meshes, false);
		if (hits.length === 0) return;
		const mesh = hits[0]?.object;
		const planet = this.bodies.find((b) => b.mesh === mesh);
		if (planet) this.toggleSelection(planet);
	}
	onVisibility = () => {
		if (document.visibilityState === "visible") this.audio.ensureContext();
	};
};
//#endregion
export { SceneManager };
