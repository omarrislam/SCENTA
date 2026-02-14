import { Locale } from "../services/types";

export const resolveLocale = (language?: string): Locale =>
  language?.startsWith("ar") ? "ar" : "en";

export const pickLocalized = (value: string, localized: string | undefined, locale: Locale) =>
  locale === "ar" && localized ? localized : value;

export const pickLocalizedArray = (
  value: string[],
  localized: string[] | undefined,
  locale: Locale
) => (locale === "ar" && localized && localized.length ? localized : value);
