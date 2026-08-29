import { LanguagePicker } from "@/i18n/language-picker";
import { useT } from "@/i18n/use-i18n";
import { act } from "@/lib/viz-actions";
import { TrackList } from "./track-list";
import { MakerCredit } from "./widgets";

export function IntroCard({
  onOpenFile,
  visible,
  ready,
}: {
  onOpenFile: () => void;
  visible: boolean;
  ready: boolean;
}) {
  const t = useT();
  if (!visible) return null;

  const play = (id: string) =>
    act((engine) => {
      engine.loadLibrary(id);
      engine.playAudio();
    });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
      <div className="intro-card pointer-events-auto max-h-dvh w-full max-w-xl overflow-y-auto rounded-3xl p-6 md:p-8">
        <div className="mb-4 flex justify-center">
          <LanguagePicker />
        </div>
        <p className="mb-2 text-center text-xs font-medium tracking-widest text-muted uppercase">
          {t("app.tagline")}
        </p>
        <h1 className="font-display text-center text-5xl leading-tight font-medium tracking-tight text-fg md:text-6xl">
          {t("app.titleLead")} <em className="text-primary italic">{t("app.titleOn")}</em>
          <br />
          {t("app.titleTail")}
        </h1>
        <MakerCredit className="mt-3 text-center" />
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-muted">
          {t("intro.body")}
        </p>
        <div className="mt-6 rounded-2xl bg-surface-2/80 p-2">
          {ready ? (
            <TrackList onPick={play} onAdd={onOpenFile} />
          ) : (
            <p className="px-3 py-4 text-center text-sm text-muted">{t("intro.lighting")}</p>
          )}
        </div>
        <p className="mt-5 text-center text-xs text-faint">{t("intro.controls")}</p>
        <p className="mt-3 text-center text-xs text-faint">{t("intro.credits")}</p>
      </div>
    </div>
  );
}
