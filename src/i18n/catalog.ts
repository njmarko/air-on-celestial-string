/**
 * Register a language here. To add one:
 *   1. Copy src/i18n/locales/en.ts → locales/<id>.ts and translate (Messages is typed).
 *   2. Import it and append a row to LANGUAGES (id, htmlLang, nativeName, flag, messages).
 *   3. If you need a new flag, add a case in src/i18n/flags.tsx.
 */
import { en, type Messages } from "./locales/en";
import { sr } from "./locales/sr";

export type FlagCode = string;

export type LocaleDef = {
  id: string;
  htmlLang: string;
  nativeName: string;
  flag: FlagCode;
  messages: Messages;
};

export const LANGUAGES = [
  { id: "en", htmlLang: "en", nativeName: "English", flag: "gb", messages: en },
  { id: "sr", htmlLang: "sr-Cyrl", nativeName: "Српски", flag: "rs", messages: sr },
] as const satisfies readonly LocaleDef[];

export type LocaleId = (typeof LANGUAGES)[number]["id"];

export const DEFAULT_LOCALE: LocaleId = "en";

const byId = new Map<string, (typeof LANGUAGES)[number]>(LANGUAGES.map((lang) => [lang.id, lang]));

export function isLocaleId(value: string): value is LocaleId {
  return byId.has(value);
}

export function localeDef(id: string): (typeof LANGUAGES)[number] {
  return byId.get(id) ?? LANGUAGES[0];
}

export function messagesFor(id: string): Messages {
  return localeDef(id).messages;
}
