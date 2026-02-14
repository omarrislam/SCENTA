import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser, fetchMe, AuthUser } from "../../services/backendApi";

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const USER_KEY = "scenta-user";
const USERS_KEY = "scenta-users";
const TOKEN_KEY = "scenta-token";
const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthState["user"]>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    const validate = async () => {
      if (!hasApi || !token) return;
      try {
        const profile = await fetchMe();
        if (profile) {
          setUser((prev) => ({ ...prev, ...profile }));
        }
      } catch {
        setUser(null);
        setToken(null);
      }
    };
    void validate();
  }, [token]);

  const adminEmail = useMemo(
    () => (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase() ?? "",
    []
  );
  const adminPassword = useMemo(() => (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "", []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Missing credentials");
    }
    if (hasApi) {
      const payload = await loginUser(email, password);
      setToken(payload.token);
      setUser(payload.user);
      return;
    }
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? (JSON.parse(storedUsers) as Array<AuthUser & { password: string }>) : [];
    const isAdmin = Boolean(adminEmail && adminPassword) && email.toLowerCase() === adminEmail && password === adminPassword;
    const match = isAdmin
      ? { id: "admin", email, name: "Admin", role: "admin" as const }
      : users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);
    if (!match) {
      throw new Error("Invalid credentials");
    }
    setUser({ id: match.id, email: match.email, name: match.name, role: match.role });
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("Missing credentials");
    }
    if (hasApi) {
      const payload = await registerUser(name, email, password);
      setToken(payload.token);
      setUser(payload.user);
      return;
    }
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? (JSON.parse(storedUsers) as Array<AuthUser & { password: string }>) : [];
    const exists = users.some((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "customer" as const,
      password
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    setUser({ id: newUser.id, email, name, role: "customer" });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
