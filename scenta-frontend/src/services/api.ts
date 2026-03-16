const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
const publicBase = baseUrl.replace(/\/api\/?$/, "");
const appBase = import.meta.env.BASE_URL || "/";

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

export const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers || {});
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: "include"   // send httpOnly auth cookie automatically
  });

  const payload = await response.json().catch(() => null);

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

  if (value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    // Cloudinary or other external URLs — return as-is
    return value;
  }

  if (value.startsWith("/")) {
    if (!publicBase) return withAppBase(value);
    if (value.startsWith("/uploads/")) {
      return `${publicBase}${value}`;
    }
    return withAppBase(value);
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
  if (/\.webp$/i.test(pathname)) {
    return pathname.replace(/\.webp$/i, "");
  }
  return null;
};

export const resolveResponsiveImageSource = (value?: string): ResponsiveImageSource | null => {
  const resolved = resolveApiAssetUrl(value);
  if (!resolved) return null;

  // Cloudinary URLs already support on-the-fly transformations, return as single src
  if (resolved.startsWith("https://res.cloudinary.com")) {
    return { src: resolved };
  }

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
