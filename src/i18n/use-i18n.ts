import { useMemo } from "react";
import { create } from "zustand";
import {
  DEFAULT_LOCALE,
  isLocaleId,
  localeDef,
  messagesFor,
  type LocaleId,
} from "./catalog";
import { interpolate, type I18nVars } from "./interpolate";
import type { LocNote } from "@/lib/celestial/loc-note";

const STORAGE_KEY = "viz-locale";

type LocaleStore = {
  locale: LocaleId;
  setLocale: (id: LocaleId) => void;
};

function persist(id: LocaleId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (id) => {
    persist(id);
    set({ locale: id });
  },
}));

export function hydrateLocale(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocaleId(stored)) useLocaleStore.getState().setLocale(stored);
  } catch {
    /* ignore */
  }
}

export type Translate = (key: string, vars?: I18nVars) => string;

export function translate(locale: LocaleId, key: string, vars?: I18nVars): string {
  const dict = messagesFor(locale) as Record<string, string>;
  const fallback = messagesFor(DEFAULT_LOCALE) as Record<string, string>;
  return interpolate(dict[key] ?? fallback[key] ?? key, vars);
}

export function useT(): Translate {
  const locale = useLocaleStore((s) => s.locale);
  return useMemo(() => {
    return (key: string, vars?: I18nVars) => translate(locale, key, vars);
  }, [locale]);
}

export function useLocale(): LocaleId {
  return useLocaleStore((s) => s.locale);
}

export function formatNote(t: Translate, note: LocNote | string | undefined): string {
  if (!note) return "";
  if (typeof note === "string") return t(note) === note ? note : t(note);
  if (!note.key) return "";
  const vars = { ...note.vars };
  if (typeof vars.map === "string") vars.map = t(`map.${vars.map}`);
  if (typeof vars.body === "string") vars.body = t(`body.${vars.body}`);
  return t(note.key, vars);
}

export function bodyName(t: Translate, name: string): string {
  const key = `body.${name}`;
  const labeled = t(key);
  return labeled === key ? name : labeled;
}

export function htmlLangFor(id: LocaleId): string {
  return localeDef(id).htmlLang;
}
