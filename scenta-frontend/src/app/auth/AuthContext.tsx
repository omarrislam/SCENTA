import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, fetchMe, AuthUser } from "../../services/backendApi";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const USER_KEY = "scenta-user";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Hydrate from sessionStorage (cleared on tab close) as a fast read cache.
    // The actual auth state lives in the httpOnly cookie on the server.
    const stored = sessionStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [isLoading, setIsLoading] = useState(!user);

  // Validate the session cookie on mount
  useEffect(() => {
    const validate = async () => {
      try {
        const profile = await fetchMe();
        setUser(profile);
        sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
      } catch {
        setUser(null);
        sessionStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    void validate();
  }, []);

  const login = async (email: string, password: string) => {
    const payload = await loginUser(email, password);
    setUser(payload.user);
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const payload = await registerUser(name, email, password);
    setUser(payload.user);
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    sessionStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
