import { useEffect } from "react";
import { htmlLangFor, hydrateLocale, useLocale, useT } from "./use-i18n";

export function LocaleSync() {
  const locale = useLocale();
  const t = useT();

  useEffect(() => {
    hydrateLocale();
  }, []);

  useEffect(() => {
    document.documentElement.lang = htmlLangFor(locale);
    document.title = t("app.title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("app.description"));
  }, [locale, t]);

  return null;
}
