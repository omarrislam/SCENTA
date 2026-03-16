import { ThemeConfig } from "../services/backendApi";

export const lightThemePreset = {
  mode: "light" as const,
  colors: {
    bgStart: "#f5eee6",
    bgMid: "#e7dacb",
    bgEnd: "#d6c6b6",
    surface: "#fdfaf7",
    text: "#1a1714",
    muted: "#665e56",
    accent: "#b4894b",
    accentDark: "#2c221e",
    accentSoft: "#d2b79b"
  },
  radius: {
    sm: 10,
    md: 18,
    lg: 28
  }
};

export const darkThemePreset = {
  mode: "dark" as const,
  colors: {
    bgStart: "#1c1714",
    bgMid: "#161210",
    bgEnd: "#120f0d",
    surface: "#26201c",
    text: "#f5eee6",
    muted: "#c7bdb1",
    accent: "#d4a45b",
    accentDark: "#5e4a3f",
    accentSoft: "#8a6f5c"
  },
  radius: {
    sm: 10,
    md: 18,
    lg: 28
  }
};

const defaultSections = [
  { id: "hero", label: "Hero Banner", isVisible: true },
  { id: "promo", label: "Promo Bar", isVisible: true },
  { id: "featured", label: "Featured Products", isVisible: true },
  { id: "collections", label: "Collections", isVisible: true },
  { id: "bestsellers", label: "Best Sellers", isVisible: true },
  { id: "quiz", label: "Scent Quiz", isVisible: true },
  { id: "shipping", label: "Shipping Info", isVisible: true }
];

export const defaultThemeConfig: ThemeConfig = {
  locale: "en",
  mode: lightThemePreset.mode,
  homeSections: defaultSections,
  colors: lightThemePreset.colors,
  radius: lightThemePreset.radius,
  home: {
    heroHeight: 520,
    heroAlignment: "left",
    heroOverlayStrength: 0.45,
    heroAutoplayMs: 6000,
    heroPauseOnHover: true,
    promoEnabled: true,
    promoShowIcon: true,
    promoSpeedSeconds: 18,
    badges: {
      bestLabel: "Best",
      newLabel: "New",
      textColor: "#ffffff",
      backgroundColor: "#2f2623",
      position: "top-left"
    }
  }
};
