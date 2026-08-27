import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Maximize2, Minus, Plus, X } from "lucide-react";
import { LanguagePicker } from "@/i18n/language-picker";
import { useT } from "@/i18n/use-i18n";
import { act, isAudioFile } from "@/lib/viz-actions";
import { useVizStore } from "@/store/viz-store";
import { RecPill } from "./export";
import { HintLayer } from "./hint";
import { IntroCard } from "./intro";
import { MixPanel, StringsPanel, WorldsPanel } from "./panels";
import { Transport } from "./transport";
import { IconBtn, MakerCredit } from "./widgets";

type Sheet = "none" | "worlds" | "mix";

export function VizHud() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sheet, setSheet] = useState<Sheet>("none");
  const [fileReady, setFileReady] = useState(false);
  const t = useT();

  const uiHidden = useVizStore((s) => s.uiHidden);
  const hasTrack = useVizStore((s) => s.audio.hasTrack);
  const fps = useVizStore((s) => s.fps);
  const ready = useVizStore((s) => s.ready);

  const openFile = () => fileRef.current?.click();

  useEffect(() => {
    setFileReady(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        act((engine) => {
          if (!engine.audio.hasTrack) engine.loadDemo();
          engine.toggleAudio();
        });
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "h") {
        act((engine) => engine.toggleUi());
      } else if (key === "p" && !event.metaKey && !event.ctrlKey) {
        act((engine) => engine.togglePaused());
      } else if (key === "r") {
        act((engine) => engine.resetPlanets());
      } else if (key === "c") {
        act((engine) => engine.clearTrails());
      } else if (event.key === "=" || event.key === "+") {
        act((engine) => engine.zoomBy(0.82));
      } else if (event.key === "-" || event.key === "_") {
        act((engine) => engine.zoomBy(1.22));
      } else if (key === "f") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => undefined);
      } else if (event.key === "escape") {
        act((engine) => {
          if (engine.recording) void engine.stopRecording();
        });
        setSheet("none");
      }
    };

    const onDragOver = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
      setDragging(true);
    };
    const onDragLeave = (event: DragEvent) => {
      if (event.relatedTarget) return;
      setDragging(false);
    };
    const onDrop = (event: DragEvent) => {
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

  return (
    <>
      <HintLayer />
      {fileReady ? (
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file || !isAudioFile(file)) return;
            act((engine) => {
              engine.loadFile(file);
              engine.playAudio();
            });
          }}
        />
      ) : null}

      {dragging ? (
        <div className="pointer-events-none absolute inset-4 z-30 flex items-center justify-center rounded-3xl border border-dashed border-primary/50 bg-bg/40">
          <p className="font-display text-2xl text-fg">{t("drop.song")}</p>
        </div>
      ) : null}

      <RecPill />

      {uiHidden ? (
        <div className="overlay-safe pointer-events-none absolute inset-0 z-20">
          <div className="pointer-events-auto absolute top-3 right-3">
            <IconBtn
              label={t("hud.show")}
              hint={t("hud.showHint")}
              onClick={() => act((engine) => engine.toggleUi())}
            >
              <Eye className="size-4" strokeWidth={1.75} />
            </IconBtn>
          </div>
        </div>
      ) : (
        <div className="overlay-safe pointer-events-none absolute inset-0 z-20 flex flex-col">
          {hasTrack ? (
            <header className="flex items-start justify-between gap-3">
              <div className="pointer-events-auto px-1 pt-1" data-hint={t("hud.titleHint")}>
                <p className="font-display text-xl leading-none tracking-tight text-fg">
                  {t("app.title")}
                </p>
                <MakerCredit className="mt-1" />
                <LanguagePicker compact className="mt-2" />
                <p className="mt-1 text-xs tracking-widest text-faint uppercase">
                  {ready ? t("app.fps", { n: Math.round(fps) }) : t("intro.lightingSky")}
                </p>
              </div>
              <div className="pointer-events-auto flex items-center gap-0.5">
                <IconBtn
                  label={t("hud.zoomIn")}
                  hint={t("hud.zoomInHint")}
                  onClick={() => act((engine) => engine.zoomBy(0.82))}
                >
                  <Plus className="size-4" strokeWidth={1.75} />
                </IconBtn>
                <IconBtn
                  label={t("hud.zoomOut")}
                  hint={t("hud.zoomOutHint")}
                  onClick={() => act((engine) => engine.zoomBy(1.22))}
                >
                  <Minus className="size-4" strokeWidth={1.75} />
                </IconBtn>
                <IconBtn
                  label={t("hud.fullscreen")}
                  hint={t("hud.fullscreenHint")}
                  onClick={() => {
                    if (document.fullscreenElement) void document.exitFullscreen();
                    else void document.documentElement.requestFullscreen().catch(() => undefined);
                  }}
                >
                  <Maximize2 className="size-4" strokeWidth={1.75} />
                </IconBtn>
                <IconBtn
                  label={t("hud.hide")}
                  hint={t("hud.hideHint")}
                  onClick={() => act((engine) => engine.toggleUi())}
                >
                  <EyeOff className="size-4" strokeWidth={1.75} />
                </IconBtn>
              </div>
            </header>
          ) : null}

          <IntroCard visible={!hasTrack} ready={ready} onOpenFile={openFile} />

          {hasTrack ? (
            <div className="hud-desktop mt-3 min-h-0 flex-1 gap-3">
              <div className="pointer-events-auto flex min-h-0 flex-col gap-3 self-start">
                <WorldsPanel />
                <StringsPanel />
              </div>
              <div />
              <div className="pointer-events-auto self-start">
                <MixPanel onRecordStart={() => setSheet("none")} />
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {hasTrack ? (
            <div className="mt-auto flex justify-center pt-3">
              <Transport
                onOpenFile={openFile}
                onOpenSheet={() => setSheet((current) => (current === "none" ? "mix" : "none"))}
              />
            </div>
          ) : null}
        </div>
      )}

      {sheet !== "none" && !uiHidden ? (
        <div className="absolute inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={t("hud.closePanel")}
            data-hint={t("hud.closeHint")}
            className="absolute inset-0 bg-bg/55"
            onClick={() => setSheet("none")}
          />
          <div className="sheet-panel absolute inset-x-0 bottom-0 overflow-y-auto rounded-t-3xl bg-surface p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex gap-1 rounded-lg bg-surface-2 p-1">
                <button
                  type="button"
                  data-hint={t("hud.sheetWorldsHint")}
                  onClick={() => setSheet("worlds")}
                  className={`h-9 rounded-md px-3 text-xs font-medium ${
                    sheet === "worlds" ? "bg-fg text-bg" : "text-muted"
                  }`}
                >
                  {t("hud.sheetWorlds")}
                </button>
                <button
                  type="button"
                  data-hint={t("hud.sheetMixHint")}
                  onClick={() => setSheet("mix")}
                  className={`h-9 rounded-md px-3 text-xs font-medium ${
                    sheet === "mix" ? "bg-fg text-bg" : "text-muted"
                  }`}
                >
                  {t("hud.sheetMix")}
                </button>
              </div>
              <IconBtn label={t("hud.close")} hint={t("hud.closeHint")} onClick={() => setSheet("none")}>
                <X className="size-4" strokeWidth={1.75} />
              </IconBtn>
            </div>
            {sheet === "worlds" ? (
              <div className="space-y-3">
                <WorldsPanel />
                <StringsPanel />
              </div>
            ) : (
              <MixPanel onRecordStart={() => setSheet("none")} />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
