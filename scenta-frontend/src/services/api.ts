const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
const publicBase = baseUrl.replace(/\/api\/?$/, "");
const appBase = import.meta.env.BASE_URL || "/";
const legacyImageMap: Record<string, string> = {
  "/images/silk-amber.png": "/images/amber-1.svg",
  "/images/rose-veil.png": "/images/rose-1.svg",
  "/images/velvet-iris.png": "/images/iris-1.svg",
  "/images/golden-oud.png": "/images/oud-1.svg",
  "/images/cidar-mist.png": "/images/cedar-1.svg",
  "/images/cirtus.png": "/images/citrus-1.svg"
};

const withAppBase = (pathLike: string) => {
  if (!pathLike.startsWith("/")) return pathLike;
  if (appBase === "/") return pathLike;
  const cleanBase = appBase.endsWith("/") ? appBase.slice(0, -1) : appBase;
  return `${cleanBase}${pathLike}`;
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string; details?: unknown };
}

const getAuthToken = () => localStorage.getItem("scenta-token");

export const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = getAuthToken();
  const headers = new Headers(init?.headers || {});
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    localStorage.removeItem("scenta-token");
    localStorage.removeItem("scenta-user");
  }

  if (!response.ok) {
    const message = payload?.error?.message ?? "Request failed";
    throw new Error(message);
  }

  return payload as T;
};

export const fetchApi = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const payload = await fetchJson<ApiResponse<T>>(path, init);
  if (!payload?.success) {
    throw new Error(payload?.error?.message ?? "Request failed");
  }
  return payload.data;
};

export const resolveApiAssetUrl = (value?: string) => {
  if (!value) return value;
  const normalizeLegacy = (pathLike: string) => legacyImageMap[pathLike] ?? pathLike;

  if (value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/")) {
    const normalized = normalizeLegacy(value);
    if (!publicBase) return withAppBase(normalized);
    if (value.startsWith("/uploads/")) {
      return `${publicBase}${value}`;
    }
    return withAppBase(normalized);
  }

  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith("/images/")) {
      return withAppBase(`${normalizeLegacy(parsed.pathname)}${parsed.search}`);
    }
    if (!publicBase) return value;
    const isLocalOrigin = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (isLocalOrigin) {
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${publicBase}${parsed.pathname}${parsed.search}`;
      }
      return withAppBase(`${parsed.pathname}${parsed.search}`);
    }
  } catch {
    return value;
  }

  return value;
};

interface ResponsiveImageSource {
  src: string;
  srcSet?: string;
}

const normalizeUploadBasePath = (pathname: string) => {
  if (!pathname.startsWith("/uploads/")) return null;
  if (/-((sm)|(md)|(lg))\.webp$/i.test(pathname)) {
    return pathname.replace(/-((sm)|(md)|(lg))\.webp$/i, "");
  }
  const extMatch = pathname.match(/\.[^/.]+$/);
  if (!extMatch) return pathname;
  return pathname.slice(0, -extMatch[0].length);
};

export const resolveResponsiveImageSource = (value?: string): ResponsiveImageSource | null => {
  const resolved = resolveApiAssetUrl(value);
  if (!resolved) return null;
  try {
    const parsed = new URL(resolved, window.location.origin);
    const basePath = normalizeUploadBasePath(parsed.pathname);
    if (!basePath) {
      return { src: resolved };
    }

    const suffix = parsed.search ?? "";
    const sm = `${parsed.origin}${basePath}-sm.webp${suffix}`;
    const md = `${parsed.origin}${basePath}-md.webp${suffix}`;
    const lg = `${parsed.origin}${basePath}-lg.webp${suffix}`;

    return {
      src: lg,
      srcSet: `${sm} 480w, ${md} 960w, ${lg} 1440w`
    };
  } catch {
    return { src: resolved };
  }
};
