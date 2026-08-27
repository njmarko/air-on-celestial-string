import { createFileRoute } from "@tanstack/react-router";
import { VizCanvas } from "@/components/viz/canvas";
import { VizHud } from "@/components/viz/hud";
import { LocaleSync } from "@/i18n/locale-sync";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <LocaleSync />
      <VizCanvas />
      <VizHud />
    </main>
  );
}
