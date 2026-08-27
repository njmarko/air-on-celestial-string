import { Eye, EyeOff, Lock, Trash2 } from "lucide-react";
import { LanguagePicker } from "@/i18n/language-picker";
import { bodyName, formatNote, useT, type Translate } from "@/i18n/use-i18n";
import type { BackgroundType, OrbitMode, RhythmBand, RhythmMode } from "@/lib/celestial/types";
import { cn } from "@/lib/utils";
import { act } from "@/lib/viz-actions";
import { useVizStore } from "@/store/viz-store";
import { CircleCameraSection, ExportFields } from "./export";
import { IconBtn, Panel, RangeField, Segmented, ToggleRow } from "./widgets";

const CHANNEL_IDS: Exclude<RhythmBand, "custom">[] = ["bass", "mid", "high", "all"];

const CHANNEL_TONE: Record<Exclude<RhythmBand, "custom">, string> = {
  bass: "data-[on=true]:bg-bass data-[on=true]:text-primary-fg",
  mid: "data-[on=true]:bg-mid data-[on=true]:text-primary-fg",
  high: "data-[on=true]:bg-high data-[on=true]:text-primary-fg",
  all: "data-[on=true]:bg-fg data-[on=true]:text-bg",
};

export function WorldsPanel() {
  const t = useT();
  const bodies = useVizStore((s) => s.bodies);

  return (
    <Panel title={t("worlds.title")}>
      <ul className="hud-scroll max-h-64 space-y-0.5 overflow-y-auto pr-1">
        {bodies.map((body) => {
          const name = bodyName(t, body.name);
          return (
            <li key={body.name}>
              <div
                className={`flex h-11 items-center gap-1 rounded-lg px-1 ${
                  body.selected ? "bg-primary/15" : "hover:bg-fg/10"
                }`}
              >
                <IconBtn
                  label={body.visible ? t("worlds.hide", { name }) : t("worlds.show", { name })}
                  hint={
                    body.visible
                      ? t("worlds.hideHint", { name })
                      : t("worlds.showHint", { name })
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
                  data-hint={t("worlds.selectHint", { name })}
                  onClick={() => act((engine) => engine.toggleSelectionByName(body.name))}
                >
                  {name}
                </button>
                {body.hasPath ? (
                  <input
                    type="color"
                    aria-label={t("worlds.pathColor", { name })}
                    data-hint={t("worlds.pathHint", { name })}
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
          );
        })}
      </ul>
    </Panel>
  );
}

export function StringsPanel() {
  const t = useT();
  const connections = useVizStore((s) => s.connections);
  const canCreate = useVizStore((s) => s.canCreate);

  return (
    <Panel title={t("strings.title")}>
      <button
        type="button"
        disabled={!canCreate}
        data-hint={canCreate ? t("strings.weaveHint") : t("strings.weaveDisabled")}
        onClick={() => act((engine) => engine.createConnection())}
        className="mb-2 flex h-10 w-full items-center justify-center rounded-lg bg-fg/10 text-xs font-medium text-fg hover:bg-fg/15 disabled:opacity-40"
      >
        {t("strings.weave")}
      </button>
      {connections.length === 0 ? (
        <p className="px-1 py-3 text-xs text-faint">{t("strings.empty")}</p>
      ) : (
        <ul className="hud-scroll max-h-72 space-y-1 overflow-y-auto pr-1">
          {connections.map((conn) => (
            <li key={conn.id} className="rounded-lg bg-surface-2/80 px-1.5 py-1.5">
              <div className="flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate px-1 text-xs text-fg">
                  {bodyName(t, conn.a)} · {bodyName(t, conn.b)}
                </span>
                <input
                  type="color"
                  aria-label={t("strings.color")}
                  data-hint={t("strings.colorHint")}
                  value={conn.color}
                  className="size-7 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent"
                  onChange={(event) =>
                    act((engine) => engine.setConnectionColor(conn.id, event.target.value))
                  }
                />
                <IconBtn
                  label={conn.visible ? t("strings.hide") : t("strings.show")}
                  hint={conn.visible ? t("strings.hideHint") : t("strings.showHint")}
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
                  label={t("strings.remove")}
                  hint={t("strings.removeHint")}
                  className="size-8 text-danger"
                  onClick={() => act((engine) => engine.removeConnection(conn.id))}
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} />
                </IconBtn>
              </div>
              <p className="mt-1.5 px-1 text-xs text-muted">{t("strings.channel")}</p>
              <div className="mt-1 grid grid-cols-4 gap-1 px-1">
                {CHANNEL_IDS.map((id) => {
                  const on = conn.rhythmType === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      data-on={on}
                      data-hint={t(`channel.${id}Hint`)}
                      aria-pressed={on}
                      onClick={() => act((engine) => engine.setConnectionRhythmType(conn.id, id))}
                      className={cn(
                        "h-8 rounded-md text-xs font-medium transition-colors duration-150",
                        "bg-fg/10 text-muted hover:text-fg",
                        CHANNEL_TONE[id],
                      )}
                    >
                      {t(`channel.${id}`)}
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
                  aria-label={t("strings.lowFreq")}
                  data-hint={t("strings.lowHint")}
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
                  aria-label={t("strings.highFreq")}
                  data-hint={t("strings.highHint")}
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
                  <span className="ml-auto text-xs text-faint">{t("strings.custom")}</span>
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
  const t = useT();
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
  const mixNote = formatNote(t, audio.mixNote);
  const mixVoice = audio.mixVoice ? t(audio.mixVoice) : "";

  return (
    <Panel title={t("mix.title")}>
      <div className="hud-scroll mix-scroll space-y-3 overflow-y-auto pr-1">
        <div>
          <p className="mb-2 px-1 text-xs text-muted">{t("lang.label")}</p>
          <LanguagePicker compact />
        </div>
        <ToggleRow
          label={t("mix.hear")}
          hint={t("mix.hearHint")}
          checked={audio.rhythmEnabled}
          onChange={(value) => act((engine) => engine.setRhythmEnabled(value))}
        />
        <Segmented<RhythmMode>
          label={t("mix.onset")}
          value={audio.rhythmMode}
          options={[
            { id: "advanced", label: t("mix.onsets"), hint: t("mix.onsetsHint") },
            { id: "simple", label: t("mix.threshold"), hint: t("mix.thresholdHint") },
          ]}
          onChange={(value) => act((engine) => engine.setRhythmMode(value))}
        />

        <ToggleRow
          label={t("mix.auto")}
          hint={t("mix.autoHint")}
          checked={audio.autoMix}
          onChange={(value) => act((engine) => engine.setAutoMix(value))}
        />
        {mixNote ? (
          <p className="-mt-2 px-2 text-xs leading-relaxed text-faint">{mixNote}</p>
        ) : null}
        {mixVoice && audio.mixStatus === "live" ? (
          <div className="-mt-1 rounded-lg bg-surface-2/70 px-2 py-2" data-hint={t("mix.sectionHint")}>
            <p className="text-xs tracking-wide text-muted uppercase">{t("mix.sectionLabel")}</p>
            <p className="mt-1 text-sm leading-snug text-fg">{mixVoice}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <VoiceChip t={t} label={t("channel.bass")} on={audio.bands.bass.playing} tone="bg-bass text-primary-fg" />
              <VoiceChip t={t} label={t("channel.mid")} on={audio.bands.mid.playing} tone="bg-mid text-primary-fg" />
              <VoiceChip t={t} label={t("channel.high")} on={audio.bands.high.playing} tone="bg-high text-primary-fg" />
            </div>
          </div>
        ) : null}

        <BandRow band="bass" label={t("channel.bass")} />
        <BandRow band="mid" label={t("channel.mid")} />
        <BandRow band="high" label={t("channel.high")} />

        <RangeField
          label={t("mix.orbitSpeed")}
          hint={t("mix.orbitSpeedHint")}
          min={0}
          max={4}
          step={0.05}
          value={speed}
          display={speed.toFixed(2)}
          onChange={(value) => act((engine) => engine.setSpeed(value))}
        />
        <CircleCameraSection />
        <RangeField
          label={t("mix.spin")}
          hint={t("mix.spinHint")}
          min={0}
          max={0.08}
          step={0.001}
          value={spinFactor}
          display={spinFactor.toFixed(3)}
          onChange={(value) => act((engine) => engine.setSpinFactor(value))}
        />
        <RangeField
          label={t("mix.idleWeave")}
          hint={t("mix.idleWeaveHint")}
          min={0.5}
          max={12}
          step={0.1}
          value={linesPerSec}
          display={t("mix.idleWeaveDisplay", { n: linesPerSec.toFixed(1) })}
          onChange={(value) => act((engine) => engine.setLinesPerSec(value))}
        />
        <RangeField
          label={t("mix.maxWeave")}
          hint={t("mix.maxWeaveHint")}
          min={3}
          max={24}
          step={0.5}
          value={maxWeave}
          display={t("mix.idleWeaveDisplay", { n: maxWeave.toFixed(1) })}
          onChange={(value) => act((engine) => engine.setMaxWeave(value))}
        />
        <RangeField
          label={t("mix.trail")}
          hint={t("mix.trailHint")}
          min={4}
          max={180}
          step={1}
          value={trailDuration}
          display={t("mix.trailDisplay", { n: Math.round(trailDuration) })}
          onChange={(value) => act((engine) => engine.setTrailDuration(value))}
        />

        <Segmented<OrbitMode>
          label={t("mix.paths")}
          options={[
            { id: "realistic", label: t("mix.kepler"), hint: t("mix.keplerHint") },
            { id: "circular", label: t("mix.circle"), hint: t("mix.circleHint") },
            { id: "hidden", label: t("mix.hidePaths"), hint: t("mix.hidePathsHint") },
          ]}
          value={orbitMode}
          onChange={(value) => act((engine) => engine.setOrbitMode(value))}
        />
        <Segmented<BackgroundType>
          label={t("mix.sky")}
          value={background}
          options={[
            { id: "milkyway", label: t("mix.milky"), hint: t("mix.milkyHint") },
            { id: "stars", label: t("mix.stars"), hint: t("mix.starsHint") },
            { id: "none", label: t("mix.void"), hint: t("mix.voidHint") },
          ]}
          onChange={(value) => act((engine) => engine.setBackground(value))}
        />
        <ToggleRow
          label={t("mix.ultra")}
          hint={t("mix.ultraHint")}
          checked={hiRes}
          onChange={(value) => act((engine) => void engine.setHiRes(value))}
        />
        <p className="-mt-2 px-1 text-xs leading-relaxed text-faint">
          {t("mix.ultraCredit", { note: formatNote(t, hiResNote) })}
        </p>

        <ToggleRow
          label={t("mix.parallax")}
          hint={t("mix.parallaxHint")}
          checked={parallax}
          onChange={(value) => act((engine) => engine.setParallax(value))}
        />
        <RangeField
          label={t("mix.ambient")}
          hint={t("mix.ambientHint")}
          min={0}
          max={1.4}
          step={0.02}
          value={ambient}
          display={ambient.toFixed(2)}
          onChange={(value) => act((engine) => engine.setAmbient(value))}
        />
        <RangeField
          label={t("mix.bloom")}
          hint={t("mix.bloomHint")}
          min={0}
          max={1.4}
          step={0.02}
          value={bloom}
          display={bloom.toFixed(2)}
          onChange={(value) => act((engine) => engine.setBloom(value))}
        />
        <RangeField
          label={t("mix.rings")}
          hint={t("mix.ringsHint")}
          min={0}
          max={3}
          step={0.05}
          value={ringBrightness}
          display={ringBrightness.toFixed(2)}
          onChange={(value) => act((engine) => engine.setRingBrightness(value))}
        />

        <div className="rounded-lg bg-surface-2/70 px-2 py-2">
          <p className="mb-1 px-1 font-display text-base text-fg">{t("record.title")}</p>
          <ExportFields onStart={onRecordStart} />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            data-hint={t("mix.resetHint")}
            className="h-10 flex-1 rounded-lg bg-surface-2 text-xs font-medium text-fg hover:bg-fg/10"
            onClick={() => act((engine) => engine.resetPlanets())}
          >
            {t("mix.reset")}
          </button>
          <button
            type="button"
            data-hint={t("mix.clearHint")}
            className="h-10 flex-1 rounded-lg bg-surface-2 text-xs font-medium text-fg hover:bg-fg/10"
            onClick={() => act((engine) => engine.clearTrails())}
          >
            {t("mix.clear")}
          </button>
        </div>
        <p className="mt-3 px-1 text-xs leading-relaxed text-faint">{t("mix.mapsCredit")}</p>
      </div>
    </Panel>
  );
}

function VoiceChip({
  t,
  label,
  on,
  tone,
}: {
  t: Translate;
  label: string;
  on: boolean;
  tone: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
        on ? tone : "bg-fg/10 text-faint",
      )}
    >
      {on ? label : t("band.quietChip", { name: label })}
    </span>
  );
}

function BandRow({ band, label }: { band: "bass" | "mid" | "high"; label: string }) {
  const t = useT();
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
            data-hint={t("band.toggleHint", { name: label })}
            onClick={() => act((engine) => engine.setBandEnabled(band, !state.enabled))}
            className={`text-xs font-medium ${state.enabled ? "text-fg" : "text-faint line-through"}`}
          >
            {label}
          </button>
          {autoMix ? (
            <span className={`text-xs ${state.playing ? "text-fg" : "text-faint"}`}>
              {state.playing ? t("band.playing") : t("band.quiet")}
            </span>
          ) : null}
          {state.weaveRate > 0.05 ? (
            <span className="font-mono text-xs tabular-nums text-faint">
              {t("band.rate", { n: state.weaveRate.toFixed(1) })}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {autoMix && state.locked ? (
            <button
              type="button"
              aria-label={t("band.unlock", { name: label })}
              data-hint={t("band.unlockHint")}
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
        aria-label={t("band.sensitivity", { name: label })}
        data-hint={t("band.sensitivityHint", { name: label.toLowerCase() })}
        onPointerDown={() => act((engine) => engine.lockBand(band))}
        onChange={(event) =>
          act((engine) => engine.setBandSensitivity(band, Number(event.target.value)))
        }
      />
    </div>
  );
}
