import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getPublicTheme, ThemeConfig } from "../services/backendApi";
import { resolveApiAssetUrl } from "../services/api";
import { resolveLocale } from "../utils/localize";
import { defaultThemeConfig } from "./themeDefaults";

interface ThemeState {
  theme: ThemeConfig;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const fallbackColors = {
  bgStart: "#f5eee6",
  bgMid: "#e7dacb",
  bgEnd: "#d6c6b6",
  surface: "#fdfaf7",
  text: "#1a1714",
  muted: "#665e56",
  accent: "#b4894b",
  accentDark: "#2c221e",
  accentSoft: "#d2b79b"
};

const fallbackRadius = { sm: 10, md: 18, lg: 28 };

type ResolvedColors = typeof fallbackColors;
type ResolvedRadius = typeof fallbackRadius;

const normalizeThemeAssets = (config: ThemeConfig): ThemeConfig => {
  const sectionSettings = config.home?.sectionSettings;
  const normalizedSectionSettings = sectionSettings
    ? Object.fromEntries(
        Object.entries(sectionSettings).map(([key, value]) => [
          key,
          {
            ...value,
            backgroundImage: resolveApiAssetUrl(value?.backgroundImage)
          }
        ])
      )
    : undefined;

  return {
    ...config,
    home: config.home
      ? {
          ...config.home,
          heroSlides: config.home.heroSlides?.map((slide) => ({
            ...slide,
            image: resolveApiAssetUrl(slide.image) ?? slide.image
          })),
          collectionItems: config.home.collectionItems?.map((item) => ({
            ...item,
            image: resolveApiAssetUrl(item.image)
          })),
          sectionSettings: normalizedSectionSettings
        }
      : config.home
  };
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { data, isLoading } = useQuery({
    queryKey: ["theme", locale],
    queryFn: () => getPublicTheme(locale)
  });
  const { data: fallbackData } = useQuery({
    queryKey: ["theme", "en"],
    queryFn: () => getPublicTheme("en"),
    enabled: locale !== "en"
  });

  const theme = useMemo<ThemeConfig>(() => {
    const base = data ?? fallbackData;
    if (!base) {
      return { ...defaultThemeConfig, locale };
    }
    return normalizeThemeAssets({
      ...defaultThemeConfig,
      ...base,
      locale,
      homeSections: base.homeSections?.length ? base.homeSections : defaultThemeConfig.homeSections,
      home: { ...defaultThemeConfig.home, ...base.home },
      colors: { ...(defaultThemeConfig.colors ?? fallbackColors), ...(base.colors ?? {}) },
      radius: { ...(defaultThemeConfig.radius ?? fallbackRadius), ...(base.radius ?? {}) }
    });
  }, [data, fallbackData, locale]);

  useEffect(() => {
    const defaultColors = defaultThemeConfig.colors ?? fallbackColors;
    const defaultRadius = defaultThemeConfig.radius ?? fallbackRadius;
    const root = document.documentElement;
    root.dataset.theme = theme.mode ?? "light";
    const mergedColors = { ...defaultColors, ...(theme.colors ?? {}) };
    const mergedRadius = { ...defaultRadius, ...(theme.radius ?? {}) };
    const colors: ResolvedColors = {
      bgStart: mergedColors.bgStart ?? fallbackColors.bgStart,
      bgMid: mergedColors.bgMid ?? fallbackColors.bgMid,
      bgEnd: mergedColors.bgEnd ?? fallbackColors.bgEnd,
      surface: mergedColors.surface ?? fallbackColors.surface,
      text: mergedColors.text ?? fallbackColors.text,
      muted: mergedColors.muted ?? fallbackColors.muted,
      accent: mergedColors.accent ?? fallbackColors.accent,
      accentDark: mergedColors.accentDark ?? fallbackColors.accentDark,
      accentSoft: mergedColors.accentSoft ?? fallbackColors.accentSoft
    };
    const radius: ResolvedRadius = {
      sm: mergedRadius.sm ?? fallbackRadius.sm,
      md: mergedRadius.md ?? fallbackRadius.md,
      lg: mergedRadius.lg ?? fallbackRadius.lg
    };
    root.style.setProperty("--color-bg-start", colors.bgStart);
    root.style.setProperty("--color-bg-mid", colors.bgMid);
    root.style.setProperty("--color-bg-end", colors.bgEnd);
    root.style.setProperty("--color-surface", colors.surface);
    root.style.setProperty("--color-ink", colors.text);
    root.style.setProperty("--color-muted", colors.muted);
    root.style.setProperty("--color-gold", colors.accent);
    root.style.setProperty("--color-ember", colors.accentDark);
    root.style.setProperty("--color-rose", colors.accentSoft);
    root.style.setProperty("--radius-sm", `${radius.sm}px`);
    root.style.setProperty("--radius-md", `${radius.md}px`);
    root.style.setProperty("--radius-lg", `${radius.lg}px`);
    const heroHeight = theme.home?.heroHeight ?? defaultThemeConfig.home?.heroHeight ?? 420;
    root.style.setProperty("--hero-height", `${Math.max(heroHeight, 520)}px`);
    const heroOverlay = theme.home?.heroOverlayStrength ?? defaultThemeConfig.home?.heroOverlayStrength ?? 0.45;
    root.style.setProperty("--hero-overlay", String(heroOverlay));
    const promoSeconds = theme.home?.promoSpeedSeconds ?? defaultThemeConfig.home?.promoSpeedSeconds ?? 18;
    root.style.setProperty("--promo-duration", `${Math.max(6, promoSeconds)}s`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
