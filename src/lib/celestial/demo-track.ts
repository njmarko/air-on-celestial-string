function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

function midiToHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

function env(t: number, attack: number, decay: number, sustain: number, dur: number, release: number): number {
  if (t < 0) return 0;
  if (t < attack) return t / attack;
  if (t < attack + decay) return 1 - (1 - sustain) * ((t - attack) / decay);
  if (t < dur) return sustain;
  const rel = t - dur;
  if (rel >= release) return 0;
  return sustain * (1 - rel / release);
}

type Kind = "melody" | "bass" | "chord" | "spark";
type Voice = { midi: number; start: number; dur: number; vel: number; kind: Kind };

/**
 * Synthesized waltz after Johann Strauss II, Op. 314 (public domain).
 * Original generated arrangement — not a commercial recording.
 */
export function createDemoTrackBlob(): Blob {
  const sampleRate = 44100;
  const beat = 1 / 3;
  const bar = 1;
  const intro = 6.2;
  const waltzBars = 32;
  const duration = intro + waltzBars * bar + 1.2;
  const n = Math.floor(sampleRate * duration);
  const samples = new Float32Array(n);
  const voices: Voice[] = [];

  const add = (midi: number, start: number, dur: number, vel: number, kind: Kind) => {
    voices.push({ midi, start, dur, vel, kind });
  };

  // Introduction — held A, then rising D-major horn calls, then the two-note lunge into the waltz.
  add(45, 0.05, 2.4, 0.16, "melody");
  add(33, 0.05, 5.8, 0.18, "bass");
  const introNotes = [38, 42, 45, 50, 54, 57, 62];
  introNotes.forEach((midi, i) => {
    add(midi, 0.7 + i * 0.62, 1.35, 0.2 - i * 0.01, i < 3 ? "bass" : "melody");
    add(midi + 12, 0.7 + i * 0.62, 1.1, 0.07, "spark");
  });
  add(45, 5.15, 0.28, 0.36, "bass");
  add(45, 5.5, 0.28, 0.34, "bass");
  add(38, 5.85, 0.55, 0.44, "bass");

  // Waltz 1, theme A — the famous D-major strain (pickup A, then D D | D C# D | E D B | A …).
  const themeA: Array<[number, number]> = [
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
    [69, 3],
  ];
  // Answer strain.
  const themeB: Array<[number, number]> = [
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
    [81, 3],
  ];

  const placeTheme = (notes: Array<[number, number]>, startBar: number, octave: number, vel: number) => {
    let t = intro + startBar * bar - beat;
    add(69 + octave, t, beat * 0.92, vel * 0.85, "melody");
    add(81 + octave, t, beat * 0.6, vel * 0.12, "spark");
    t += beat;
    for (const [midi, beats] of notes) {
      const dur = beats * beat;
      add(midi + octave, t, dur * 0.9, vel, "melody");
      add(midi + octave + 12, t, dur * 0.62, vel * 0.16, "spark");
      t += dur;
    }
  };

  placeTheme(themeA, 0, 0, 0.3);
  placeTheme(themeA, 8, 12, 0.24);
  placeTheme(themeB, 16, 0, 0.27);
  placeTheme(themeA, 24, 0, 0.3);

  // Harmony: I I I V | V V I V  — typical Strauss oom-pah-pah in D.
  const roots = [38, 38, 38, 45, 45, 45, 38, 45];
  const fifths = [45, 45, 45, 52, 52, 52, 45, 52];
  const thirds = [54, 54, 54, 61, 61, 61, 54, 61];

  for (let b = 0; b < waltzBars; b++) {
    const t = intro + b * bar;
    const i = b % 8;
    add(roots[i]!, t, beat * 0.82, 0.46, "bass");
    add(roots[i]! + 12, t, beat * 0.42, 0.14, "bass");
    add(fifths[i]!, t + beat, beat * 0.42, 0.18, "chord");
    add(thirds[i]!, t + beat, beat * 0.42, 0.12, "chord");
    add(fifths[i]! + 12, t + beat, beat * 0.28, 0.06, "spark");
    add(fifths[i]!, t + beat * 2, beat * 0.42, 0.16, "chord");
    add(thirds[i]!, t + beat * 2, beat * 0.42, 0.11, "chord");
    add(fifths[i]! + 12, t + beat * 2, beat * 0.32, 0.08, "spark");
    add(thirds[i]! + 12, t + beat * 2, beat * 0.22, 0.05, "spark");
  }

  for (const v of voices) {
    const freq = midiToHz(v.midi);
    const i0 = Math.max(0, Math.floor(v.start * sampleRate));
    const release = v.kind === "bass" ? 0.16 : v.kind === "melody" ? 0.15 : 0.08;
    const i1 = Math.min(n, Math.floor((v.start + v.dur + release) * sampleRate));
    const attack = v.kind === "melody" ? 0.016 : 0.004;
    const decay = v.kind === "bass" ? 0.1 : 0.07;
    const sustain = v.kind === "melody" ? 0.72 : v.kind === "bass" ? 0.32 : 0.26;

    for (let i = i0; i < i1; i++) {
      const t = i / sampleRate - v.start;
      const e = env(t, attack, decay, sustain, v.dur, release);
      if (e <= 0) continue;
      const phase = 2 * Math.PI * freq * t;
      let s = Math.sin(phase);
      if (v.kind === "melody") {
        s += 0.24 * Math.sin(2 * phase) + 0.08 * Math.sin(3 * phase);
      } else if (v.kind === "bass") {
        s = Math.sin(phase) * 0.82 + Math.sin(2 * phase) * 0.22 + Math.sin(phase * 0.5) * 0.16;
        s += Math.exp(-t * 42) * Math.sin(phase * 3) * 0.28;
      } else if (v.kind === "spark") {
        s = Math.sin(phase) + 0.45 * Math.sin(2 * phase) + 0.12 * Math.sin(4 * phase);
      }
      samples[i] += s * e * v.vel;
    }
  }

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    if (t < intro) {
      samples[i] += Math.sin(2 * Math.PI * 880 * t) * 0.01 * Math.sin(2 * Math.PI * 5 * t);
    }
    samples[i] = Math.max(-1, Math.min(1, samples[i]! * 0.7));
  }

  const bytes = n * 2;
  const buffer = new ArrayBuffer(44 + bytes);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + bytes, true);
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
    view.setInt16(o, Math.round(samples[i]! * 32767), true);
    o += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}
