import { Eye, EyeOff, Lock, Trash2 } from "lucide-react";
import type { BackgroundType, OrbitMode, RhythmBand, RhythmMode } from "@/lib/celestial/types";
import { cn } from "@/lib/utils";
import { act } from "@/lib/viz-actions";
import { useVizStore } from "@/store/viz-store";
import { CircleCameraSection, ExportFields } from "./export";
import { IconBtn, Panel, RangeField, Segmented, ToggleRow } from "./widgets";

const CHANNELS: { id: Exclude<RhythmBand, "custom">; label: string; hint: string; tone: string }[] = [
  {
    id: "bass",
    label: "Bass",
    hint: "This string listens to the bass — left-hand piano, cellos, low notes.",
    tone: "data-[on=true]:bg-bass data-[on=true]:text-primary-fg",
  },
  {
    id: "mid",
    label: "Mids",
    hint: "This string listens to the mids — inner voices and the middle of the keyboard.",
    tone: "data-[on=true]:bg-mid data-[on=true]:text-primary-fg",
  },
  {
    id: "high",
    label: "Treble",
    hint: "This string listens to the treble — right-hand melody, violins, sparkle.",
    tone: "data-[on=true]:bg-high data-[on=true]:text-primary-fg",
  },
  {
    id: "all",
    label: "All",
    hint: "This string listens to the whole mix.",
    tone: "data-[on=true]:bg-fg data-[on=true]:text-bg",
  },
];

export function WorldsPanel() {
  const bodies = useVizStore((s) => s.bodies);

  return (
    <Panel title="Worlds">
      <ul className="hud-scroll max-h-64 space-y-0.5 overflow-y-auto pr-1">
        {bodies.map((body) => (
          <li key={body.name}>
            <div
              className={`flex h-11 items-center gap-1 rounded-lg px-1 ${
                body.selected ? "bg-primary/15" : "hover:bg-fg/10"
              }`}
            >
              <IconBtn
                label={body.visible ? `Hide ${body.name}` : `Show ${body.name}`}
                hint={
                  body.visible
                    ? `Hide ${body.name} and its orbit from the sky.`
                    : `Show ${body.name} again.`
                }
                className="size-9"
                onClick={() => act((engine) => engine.setBodyVisibility(body.name, !body.visible))}
              >
                {body.visible ? (
                  <Eye className="size-3.5" strokeWidth={1.75} />
                ) : (
                  <EyeOff className="size-3.5" strokeWidth={1.75} />
                )}
              </IconBtn>
              <button
                type="button"
                className="min-w-0 flex-1 truncate px-1 text-left text-sm"
                data-hint={`Select ${body.name}. Choose two worlds, then weave a string between them.`}
                onClick={() => act((engine) => engine.toggleSelectionByName(body.name))}
              >
                {body.name}
              </button>
              {body.hasPath ? (
                <input
                  type="color"
                  aria-label={`${body.name} orbit color`}
                  data-hint={`Color of ${body.name}'s orbit path.`}
                  value={body.pathColor}
                  className="size-7 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent"
                  onChange={(event) =>
                    act((engine) => engine.setPlanetPathColor(body.name, event.target.value))
                  }
                />
              ) : (
                <span className="size-7" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function StringsPanel() {
  const connections = useVizStore((s) => s.connections);
  const canCreate = useVizStore((s) => s.canCreate);

  return (
    <Panel title="Strings">
      <button
        type="button"
        disabled={!canCreate}
        data-hint={
          canCreate
            ? "Stretch a glowing string between the two selected worlds."
            : "Select two worlds first — click them in the sky or in Worlds."
        }
        onClick={() => act((engine) => engine.createConnection())}
        className="mb-2 flex h-10 w-full items-center justify-center rounded-lg bg-fg/10 text-xs font-medium text-fg hover:bg-fg/15 disabled:opacity-40"
      >
        Weave selected worlds
      </button>
      {connections.length === 0 ? (
        <p className="px-1 py-3 text-xs text-faint">No strings yet. Select two worlds to weave.</p>
      ) : (
        <ul className="hud-scroll max-h-72 space-y-1 overflow-y-auto pr-1">
          {connections.map((conn) => (
            <li key={conn.id} className="rounded-lg bg-surface-2/80 px-1.5 py-1.5">
              <div className="flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate px-1 text-xs text-fg">
                  {conn.a} · {conn.b}
                </span>
                <input
                  type="color"
                  aria-label="String color"
                  data-hint="Color of this string."
                  value={conn.color}
                  className="size-7 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent"
                  onChange={(event) =>
                    act((engine) => engine.setConnectionColor(conn.id, event.target.value))
                  }
                />
                <IconBtn
                  label={conn.visible ? "Hide string" : "Show string"}
                  hint={conn.visible ? "Hide this string without removing it." : "Show this string again."}
                  className="size-8"
                  onClick={() => act((engine) => engine.setConnectionVisibility(conn.id, !conn.visible))}
                >
                  {conn.visible ? (
                    <Eye className="size-3.5" strokeWidth={1.75} />
                  ) : (
                    <EyeOff className="size-3.5" strokeWidth={1.75} />
                  )}
                </IconBtn>
                <IconBtn
                  label="Remove string"
                  hint="Cut this string and its trail."
                  className="size-8 text-danger"
                  onClick={() => act((engine) => engine.removeConnection(conn.id))}
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} />
                </IconBtn>
              </div>
              <p className="mt-1.5 px-1 text-xs text-muted">Channel</p>
              <div className="mt-1 grid grid-cols-4 gap-1 px-1">
                {CHANNELS.map((channel) => {
                  const on = conn.rhythmType === channel.id;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      data-on={on}
                      data-hint={channel.hint}
                      aria-pressed={on}
                      onClick={() =>
                        act((engine) => engine.setConnectionRhythmType(conn.id, channel.id))
                      }
                      className={cn(
                        "h-8 rounded-md text-xs font-medium transition-colors duration-150",
                        "bg-fg/10 text-muted hover:text-fg",
                        channel.tone,
                      )}
                    >
                      {channel.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-1.5 flex items-center gap-1 px-1">
                <input
                  type="number"
                  min={20}
                  max={12000}
                  step={10}
                  aria-label="Low frequency"
                  data-hint="Lowest frequency this string listens to, in Hertz."
                  value={conn.minFreq}
                  className="hud-select h-8 w-16 rounded-sm px-1 text-xs tabular-nums"
                  onChange={(event) => {
                    const min = Number(event.target.value);
                    if (!Number.isFinite(min)) return;
                    act((engine) => engine.setConnectionFreq(conn.id, min, conn.maxFreq));
                  }}
                />
                <span className="text-xs text-faint">–</span>
                <input
                  type="number"
                  min={20}
                  max={12000}
                  step={10}
                  aria-label="High frequency"
                  data-hint="Highest frequency this string listens to, in Hertz."
                  value={conn.maxFreq}
                  className="hud-select h-8 w-16 rounded-sm px-1 text-xs tabular-nums"
                  onChange={(event) => {
                    const max = Number(event.target.value);
                    if (!Number.isFinite(max)) return;
                    act((engine) => engine.setConnectionFreq(conn.id, conn.minFreq, max));
                  }}
                />
                <span className="text-xs text-faint">Hz</span>
                {conn.rhythmType === "custom" ? (
                  <span className="ml-auto text-xs text-faint">Custom</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function MixPanel({ onRecordStart }: { onRecordStart?: () => void }) {
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

  return (
    <Panel title="Mix">
      <div className="hud-scroll mix-scroll space-y-3 overflow-y-auto pr-1">
        <ToggleRow
          label="Hear the rhythm"
          hint="When on, the music weaves the strings. When off, they idle at a steady pace."
          checked={audio.rhythmEnabled}
          onChange={(value) => act((engine) => engine.setRhythmEnabled(value))}
        />
        <Segmented<RhythmMode>
          label="Onset"
          value={audio.rhythmMode}
          options={[
            {
              id: "advanced",
              label: "Onsets",
              hint: "Attacks add extra strands. Loudness of each band still sets how fast they keep drawing.",
            },
            {
              id: "simple",
              label: "Threshold",
              hint: "Loudness of each band sets how fast its strings draw. Below the floor they stop.",
            },
          ]}
          onChange={(value) => act((engine) => engine.setRhythmMode(value))}
        />

        <ToggleRow
          label="Auto mix"
          hint="Scan the recording for large sections. Park each band just above its quiet floor so single notes weave, then go silent between them. Drive how fast they draw from how busy the section is. Drag a slider to lock it."
          checked={audio.autoMix}
          onChange={(value) => act((engine) => engine.setAutoMix(value))}
        />
        {audio.mixNote ? (
          <p className="-mt-2 px-2 text-xs leading-relaxed text-faint">{audio.mixNote}</p>
        ) : null}
        {audio.mixVoice && audio.mixStatus === "live" ? (
          <div
            className="-mt-1 rounded-lg bg-surface-2/70 px-2 py-2"
            data-hint="What this section of the recording is doing. Bass follows the left hand and low notes; treble follows melody and the right hand."
          >
            <p className="text-xs tracking-wide text-muted uppercase">This section</p>
            <p className="mt-1 text-sm leading-snug text-fg">{audio.mixVoice}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <VoiceChip label="Bass" on={audio.bands.bass.playing} tone="bg-bass text-primary-fg" />
              <VoiceChip label="Mids" on={audio.bands.mid.playing} tone="bg-mid text-primary-fg" />
              <VoiceChip label="Treble" on={audio.bands.high.playing} tone="bg-high text-primary-fg" />
            </div>
          </div>
        ) : null}

        <BandRow band="bass" label="Bass" />
        <BandRow band="mid" label="Mids" />
        <BandRow band="high" label="Treble" />

        <RangeField
          label="Orbit speed"
          hint="How fast the planets travel. 1 is the default."
          min={0}
          max={4}
          step={0.05}
          value={speed}
          display={speed.toFixed(2)}
          onChange={(value) => act((engine) => engine.setSpeed(value))}
        />
        <CircleCameraSection />
        <RangeField
          label="Spin"
          hint="How fast the worlds rotate on their axes."
          min={0}
          max={0.08}
          step={0.001}
          value={spinFactor}
          display={spinFactor.toFixed(3)}
          onChange={(value) => act((engine) => engine.setSpinFactor(value))}
        />
        <RangeField
          label="Idle weave"
          hint="How often strings draw while no music is driving them."
          min={0.5}
          max={12}
          step={0.1}
          value={linesPerSec}
          display={`${linesPerSec.toFixed(1)} /s`}
          onChange={(value) => act((engine) => engine.setLinesPerSec(value))}
        />
        <RangeField
          label="Max weave"
          hint="Loudest notes in a band draw this many strands per second. Quieter notes draw fewer. Below the floor, none."
          min={3}
          max={24}
          step={0.5}
          value={maxWeave}
          display={`${maxWeave.toFixed(1)} /s`}
          onChange={(value) => act((engine) => engine.setMaxWeave(value))}
        />
        <RangeField
          label="Trail"
          hint="How long each strand lingers before fading."
          min={4}
          max={180}
          step={1}
          value={trailDuration}
          display={`${Math.round(trailDuration)}s`}
          onChange={(value) => act((engine) => engine.setTrailDuration(value))}
        />

        <Segmented<OrbitMode>
          label="Paths"
          options={[
            { id: "realistic", label: "Kepler", hint: "Elliptical orbits, as in the real solar system." },
            { id: "circular", label: "Circle", hint: "Perfect circles — easier to read at a glance." },
            { id: "hidden", label: "Hide", hint: "Hide orbit paths; worlds still move." },
          ]}
          value={orbitMode}
          onChange={(value) => act((engine) => engine.setOrbitMode(value))}
        />
        <Segmented<BackgroundType>
          label="Sky"
          value={background}
          options={[
            { id: "milkyway", label: "Milky", hint: "Wrap the sky in the Milky Way map." },
            { id: "stars", label: "Stars", hint: "A quieter star field without the galaxy band." },
            { id: "none", label: "Void", hint: "Empty dark sky." },
          ]}
          onChange={(value) => act((engine) => engine.setBackground(value))}
        />
        <ToggleRow
          label="Ultra maps"
          hint="On first visit the orrery downloads the highest Solar System Scope maps (8K where they publish them) and keeps them on this device. Uranus and Neptune stay 2K — that is the largest SSS makes. Turn off to use the bundled 2K maps."
          checked={hiRes}
          onChange={(value) => act((engine) => void engine.setHiRes(value))}
        />
        <p className="-mt-2 px-1 text-xs leading-relaxed text-faint">{hiResNote}. Solar System Scope, CC BY 4.0.</p>

        <ToggleRow
          label="Parallax dust"
          hint="Nearby dust motes that drift as you orbit the camera."
          checked={parallax}
          onChange={(value) => act((engine) => engine.setParallax(value))}
        />
        <RangeField
          label="Ambient"
          hint="Fill light on the night side of each world. 1 is the default."
          min={0}
          max={1.4}
          step={0.02}
          value={ambient}
          display={ambient.toFixed(2)}
          onChange={(value) => act((engine) => engine.setAmbient(value))}
        />
        <RangeField
          label="Bloom"
          hint="Glow around the sun and bright strings."
          min={0}
          max={1.4}
          step={0.02}
          value={bloom}
          display={bloom.toFixed(2)}
          onChange={(value) => act((engine) => engine.setBloom(value))}
        />
        <RangeField
          label="Saturn rings"
          hint="How bright Saturn's rings read against the sky. Raise it if the ice bands look faint."
          min={0}
          max={3}
          step={0.05}
          value={ringBrightness}
          display={ringBrightness.toFixed(2)}
          onChange={(value) => act((engine) => engine.setRingBrightness(value))}
        />

        <div className="rounded-lg bg-surface-2/70 px-2 py-2">
          <p className="mb-1 px-1 font-display text-base text-fg">Export</p>
          <ExportFields onStart={onRecordStart} />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            data-hint="Send every planet back to its starting place."
            className="h-10 flex-1 rounded-lg bg-surface-2 text-xs font-medium text-fg hover:bg-fg/10"
            onClick={() => act((engine) => engine.resetPlanets())}
          >
            Reset worlds
          </button>
          <button
            type="button"
            data-hint="Erase drawn strings. Worlds stay where they are."
            className="h-10 flex-1 rounded-lg bg-surface-2 text-xs font-medium text-fg hover:bg-fg/10"
            onClick={() => act((engine) => engine.clearTrails())}
          >
            Clear trails
          </button>
        </div>
        <p className="mt-3 px-1 text-xs leading-relaxed text-faint">
          Maps from Solar System Scope, CC BY 4.0.
        </p>
      </div>
    </Panel>
  );
}

function VoiceChip({ label, on, tone }: { label: string; on: boolean; tone: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
        on ? tone : "bg-fg/10 text-faint",
      )}
    >
      {on ? label : `${label} quiet`}
    </span>
  );
}

function BandRow({ band, label }: { band: "bass" | "mid" | "high"; label: string }) {
  const state = useVizStore((s) => s.audio.bands[band]);
  const autoMix = useVizStore((s) => s.audio.autoMix);
  const tone = band === "bass" ? "bg-bass" : band === "mid" ? "bg-mid" : "bg-high";
  const energy = Math.min(1, state.energy / 220);

  return (
    <div className="rounded-lg bg-surface-2/70 px-2 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            data-hint={`Turn ${label.toLowerCase()} on or off. Off, strings on this channel stay quiet.`}
            onClick={() => act((engine) => engine.setBandEnabled(band, !state.enabled))}
            className={`text-xs font-medium ${state.enabled ? "text-fg" : "text-faint line-through"}`}
          >
            {label}
          </button>
          {autoMix ? (
            <span className={`text-xs ${state.playing ? "text-fg" : "text-faint"}`}>
              {state.playing ? "playing" : "quiet"}
            </span>
          ) : null}
          {state.weaveRate > 0.05 ? (
            <span className="font-mono text-xs tabular-nums text-faint">{state.weaveRate.toFixed(1)} /s</span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {autoMix && state.locked ? (
            <button
              type="button"
              aria-label={`Unlock ${label}`}
              data-hint="This slider is locked. Click to let auto mix move it again."
              className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-fg/10 hover:text-fg"
              onClick={() => act((engine) => engine.unlockBand(band))}
            >
              <Lock className="size-3" strokeWidth={1.75} />
            </button>
          ) : null}
          <span className="font-mono text-xs tabular-nums text-faint">{state.sensitivity.toFixed(1)}×</span>
        </div>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-fg/10">
        <div
          className={`energy-bar h-full ${tone}`}
          style={{ transform: `scaleX(${state.enabled ? energy : 0})` }}
        />
      </div>
      <input
        type="range"
        className="hud-range mt-2"
        min={0.4}
        max={3}
        step={0.05}
        value={state.sensitivity}
        aria-label={`${label} sensitivity`}
        data-hint={`How quiet a ${label.toLowerCase()} note can be and still weave. Higher sits the floor lower so left-hand or melody notes fire, then go silent between them. Drag to lock.`}
        onPointerDown={() => act((engine) => engine.lockBand(band))}
        onChange={(event) =>
          act((engine) => engine.setBandSensitivity(band, Number(event.target.value)))
        }
      />
    </div>
  );
}
