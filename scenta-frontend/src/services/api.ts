const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
const publicBase = baseUrl.replace(/\/api\/?$/, "");

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
  if (!publicBase) return value;

  if (value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/")) {
    if (value.startsWith("/uploads/")) {
      return `${publicBase}${value}`;
    }
    return value;
  }

  try {
    const parsed = new URL(value);
    const isLocalOrigin = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (isLocalOrigin) {
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${publicBase}${parsed.pathname}${parsed.search}`;
      }
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return value;
  }

  return value;
};
