import { fetchApi } from "./api";
import { Coupon, Locale, QuizQuestion, ThemeSection } from "./types";
import { defaultThemeConfig } from "../theme/themeDefaults";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: "customer" | "admin";
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export const loginUser = async (email: string, password: string) =>
  fetchApi<AuthPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const registerUser = async (name: string, email: string, password: string) =>
  fetchApi<AuthPayload>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });

export const fetchMe = async () => fetchApi<AuthUser>("/auth/me");

export const changePassword = async (currentPassword: string, newPassword: string) =>
  fetchApi<{ status: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword })
  });

export interface ThemeConfig {
  id?: string;
  locale: Locale;
  homeSections: ThemeSection[];
  mode?: "light" | "dark";
  colors?: {
    bgStart?: string;
    bgMid?: string;
    bgEnd?: string;
    surface?: string;
    text?: string;
    muted?: string;
    accent?: string;
    accentDark?: string;
    accentSoft?: string;
  };
  radius?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  home?: {
    heroHeight?: number;
    heroAlignment?: "left" | "center" | "right";
    heroOverlayStrength?: number;
    heroAutoplayMs?: number;
    heroPauseOnHover?: boolean;
    promoEnabled?: boolean;
    promoMessages?: string[];
    promoShowIcon?: boolean;
    promoSpeedSeconds?: number;
    heroSlides?: Array<{
      title: string;
      subtitle: string;
      image: string;
      primaryLabel: string;
      primaryLink: string;
      secondaryLabel: string;
      secondaryLink: string;
    }>;
    shippingItems?: Array<{
      title: string;
      body: string;
      icon: "truck" | "cash" | "gift";
      enabled?: boolean;
    }>;
    collectionItems?: Array<{
      slug: string;
      title?: string;
      description?: string;
      image?: string;
      enabled?: boolean;
    }>;
    sectionSettings?: Record<
      string,
      {
        title?: string;
        subtitle?: string;
        ctaLabel?: string;
        ctaLink?: string;
        backgroundImage?: string;
        layout?: "grid" | "carousel";
        maxItems?: number;
      }
    >;
    badges?: {
      bestLabel?: string;
      newLabel?: string;
      textColor?: string;
      backgroundColor?: string;
      position?: "top-left" | "top-right";
    };
  };
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
const hasApi = Boolean(baseUrl);
const THEME_STORAGE_KEY = "scenta-theme";

const getStoredTheme = (locale: Locale): ThemeConfig | null => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Record<string, ThemeConfig>;
    return parsed[locale] ?? null;
  } catch {
    return null;
  }
};

const saveStoredTheme = (payload: ThemeConfig) => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const parsed = stored ? (JSON.parse(stored) as Record<string, ThemeConfig>) : {};
  parsed[payload.locale] = payload;
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(parsed));
};

export const getTheme = async (locale: Locale) => {
  if (!hasApi) {
    return getStoredTheme(locale);
  }
  try {
    return await fetchApi<ThemeConfig | null>(`/admin/theme?locale=${locale}`);
  } catch {
    return getStoredTheme(locale);
  }
};

export const updateTheme = async (payload: ThemeConfig) => {
  if (!hasApi) {
    const merged = {
      ...defaultThemeConfig,
      ...payload,
      colors: { ...defaultThemeConfig.colors, ...payload.colors },
      radius: { ...defaultThemeConfig.radius, ...payload.radius },
      home: { ...defaultThemeConfig.home, ...payload.home }
    };
    saveStoredTheme(merged);
    return merged;
  }
  try {
    return await fetchApi<ThemeConfig>("/admin/theme", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  } catch {
    const merged = {
      ...defaultThemeConfig,
      ...payload,
      colors: { ...defaultThemeConfig.colors, ...payload.colors },
      radius: { ...defaultThemeConfig.radius, ...payload.radius },
      home: { ...defaultThemeConfig.home, ...payload.home }
    };
    saveStoredTheme(merged);
    return merged;
  }
};

export const getPublicTheme = async (locale: Locale) => {
  if (!hasApi) {
    return getStoredTheme(locale);
  }
  try {
    return await fetchApi<ThemeConfig | null>(`/theme?locale=${locale}`);
  } catch {
    return getStoredTheme(locale);
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  if (!hasApi) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.readAsDataURL(file);
    });
  }
  const token = localStorage.getItem("scenta-token");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${baseUrl}/admin/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const payload = (await response.json()) as { url?: string; data?: { url?: string } };
  const url = payload?.url ?? payload?.data?.url;
  if (!url) {
    throw new Error("Upload failed");
  }
  if (url.startsWith("/") && baseUrl) {
    const publicBase = baseUrl.replace(/\/api\/?$/, "");
    return `${publicBase}${url}`;
  }
  return url;
};

export const listAdminCoupons = async () => fetchApi<Coupon[]>("/admin/coupons");

export const createAdminCoupon = async (payload: Partial<Coupon>) =>
  fetchApi<Coupon>("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateAdminCoupon = async (id: string, payload: Partial<Coupon>) =>
  fetchApi<Coupon>(`/admin/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const deleteAdminCoupon = async (id: string) =>
  fetchApi<{ status: string }>(`/admin/coupons/${id}`, {
    method: "DELETE"
  });

interface BackendQuizQuestion {
  _id?: string;
  id?: string;
  prompt: string;
  promptAr?: string;
  options: { label: string; labelAr?: string; score: number; note: string }[];
}

const mapQuizQuestion = (question: BackendQuizQuestion, index: number): QuizQuestion => ({
  id: question._id ?? question.id ?? `quiz-${index}`,
  prompt: question.prompt,
  promptAr: question.promptAr,
  options: question.options ?? []
});

export const listAdminQuiz = async (): Promise<QuizQuestion[]> => {
  const questions = await fetchApi<BackendQuizQuestion[]>("/admin/quiz");
  return questions.map(mapQuizQuestion);
};

export const updateAdminQuiz = async (questions: QuizQuestion[]) =>
  fetchApi<BackendQuizQuestion[]>("/admin/quiz", {
    method: "PUT",
    body: JSON.stringify({
      questions: questions.map((question) => ({
        prompt: question.prompt,
        promptAr: question.promptAr,
        options: question.options
      }))
    })
  });
